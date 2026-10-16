"""The home hero film: six of Haley's professional photographs as one seamless looping video.

Each shot drifts or pushes in slowly (a camera move over a still, rendered frame by frame with
sub-pixel bicubic sampling, so slow moves never stair-step the way ffmpeg's zoompan does) and
crossfades into the next; the last shot crossfades back into the first, so the loop has no seam.
Two renders: 1920x1080 for wide screens and 1080x1920 for phones, each framed for its shape, so
neither is stretched. Real homes only: every frame is a Haley photograph.

Used by scripts/process-media.py; frames are piped raw into ffmpeg (libx264).
"""
import os
import subprocess

from PIL import Image

FPS = 30
SHOT = 4.0   # seconds each shot leads the picture
FADE = 1.2   # seconds each crossfade lasts

# (source under assets/projects, wide move, tall move). A move is
# (zoom start, zoom end, centre x start, centre x end, centre y) with centres as fractions of
# the photo; zoom 1 is the largest window of the output's shape that fits the photo.
SHOTS = [
    ('polzin/Polzin+Front+Exterior+3.0.jpg', (1.00, 1.08, 0.50, 0.52, 0.52), (1.00, 1.06, 0.44, 0.56, 0.5)),
    ('walker/Walker+Great+Room.jpeg', (1.07, 1.07, 0.46, 0.54, 0.50), (1.00, 1.04, 0.42, 0.58, 0.5)),
    ('landeskog/ExteriorRear.jpg', (1.00, 1.07, 0.52, 0.52, 0.48), (1.00, 1.05, 0.62, 0.48, 0.5)),
    ('19-chp/19+Backyard.jpg', (1.07, 1.07, 0.55, 0.45, 0.50), (1.00, 1.04, 0.70, 0.56, 0.5)),
    ('timian/Cover+Option+Copy.jpeg', (1.00, 1.08, 0.50, 0.50, 0.55), (1.00, 1.06, 0.50, 0.50, 0.55)),
    ('boland/Boland+EMR_7046.jpg', (1.08, 1.00, 0.50, 0.50, 0.50), (1.05, 1.00, 0.40, 0.54, 0.5)),
]


def _smooth(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def _prepare(path, W, H, z_min):
    """The photo resized so a zoom-1 window maps about 1:1 onto the output (no aliasing)."""
    im = Image.open(path).convert('RGB')
    iw, ih = im.size
    a = W / H
    win_w = ih * a if iw / ih > a else iw
    s = (W * z_min) / win_w * 1.0
    if abs(s - 1) > 0.01:
        im = im.resize((round(iw * s), round(ih * s)), Image.LANCZOS)
    return im


def _frame(im, W, H, z, cx, cy):
    iw, ih = im.size
    a = W / H
    if iw / ih > a:
        h = ih / z
        w = h * a
    else:
        w = iw / z
        h = w / a
    x = min(max(cx * iw, w / 2), iw - w / 2)
    y = min(max(cy * ih, h / 2), ih - h / 2)
    data = (w / W, 0, x - w / 2, 0, h / H, y - h / 2)
    return im.transform((W, H), Image.AFFINE, data, resample=Image.BICUBIC)


def render(src_root, out_path, W, H, tall, ffmpeg, crf='28'):
    shots = []
    for path, wide_move, tall_move in SHOTS:
        move = tall_move if tall else wide_move
        shots.append((_prepare(os.path.join(src_root, path), W, H, min(move[0], move[1])), move))
    n = len(shots)
    length = n * SHOT
    span = SHOT + FADE
    frames = round(length * FPS)

    proc = subprocess.Popen(
        [ffmpeg, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
         '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-an', '-c:v', 'libx264',
         '-preset', 'slow', '-crf', crf, '-tune', 'film', '-profile:v', 'high',
         '-level:v', '4.2', '-pix_fmt', 'yuv420p', '-g', str(FPS * 2),
         '-movflags', '+faststart', out_path],
        stdin=subprocess.PIPE)

    def shot_at(i, u):
        im, (z0, z1, x0, x1, cy) = shots[i]
        p = u / span
        return _frame(im, W, H, z0 + (z1 - z0) * p, x0 + (x1 - x0) * p, cy)

    for k in range(frames):
        t = k / FPS
        # Shots on screen at t, oldest first; u is time since each shot began (mod the loop).
        live = []
        for i in range(n):
            u = (t - i * SHOT) % length
            if u < span:
                live.append((u, i))
        live.sort(reverse=True)
        u, i = live[0]
        img = shot_at(i, u)
        for u2, i2 in live[1:]:
            img = Image.blend(img, shot_at(i2, u2), _smooth(u2 / FADE))
        proc.stdin.write(img.tobytes())
    proc.stdin.close()
    if proc.wait() != 0:
        raise RuntimeError(f'ffmpeg failed for {out_path}')
