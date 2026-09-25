# -*- coding: utf-8 -*-
"""
Builds the site's public media from the raw asset library in ./assets (kept out of git).

- Resizes and re-encodes every image the site uses into ./public/images
- Samples a muted tone from each image and a tiny blur preview, written to
  src/lib/media.generated.json, so every <Image> gets an image-specific placeholder
- Produces bone/ink logo variants and flat single-tone award marks
- Copies the hero video

Run with: npm run media   (requires Pillow and imageio-ffmpeg)
"""
import base64
import io
import json
import os
import shutil

from PIL import Image, ImageOps, ImageStat

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets')
PUB = os.path.join(ROOT, 'public')
MANIFEST = os.path.join(ROOT, 'src', 'lib', 'media.generated.json')

BONE = (0xEF, 0xE9, 0xDE)
INK = (0x1A, 0x18, 0x15)

# Projects shown on the site. `cherry-hills-village` duplicates the Landeskog set and
# `quincy` duplicates Polzin (plus one extra exterior), so both are left out.
# The House 1-3 folders under videos/ are renamed duplicates of these projects.
PROJECTS = {
    'timian': 'Cover+Option+Copy.jpeg',
    'landeskog': 'ExteriorRear.jpg',
    'walker': 'Walker+Exterior+Front.jpeg',
    'fisher': 'Fischer+Front+417A7330_v2.jpg',
    'beckman': 'Beckman+Exterior+Side+2.jpg',
    '19-chp': 'kyliefitts_haleycustomhomes_19cherryhillsparkway_13.jpg',
    'mcdonald': 'Nancy-Holst-McDonald-08-25-23-Front-Living-Horizantal-Web.jpg',
    'boland': 'Boland+EMR_6929.jpg',
    'polzin': 'Polzin+Front+Exterior+3.0.jpg',
    'lowe': 'Lowe+Exterior.jpeg',
    'millisor': '01+-+Millisor+Exterior.jpg',
    'laney': '01+-+Laney+Pool+Side.jpg',
}
GALLERY_MAX = 18
GALLERY_MIN_WIDTH = 1200  # skip older low-res duplicates when a project has better files

SECTIONS = {
    # Closing CTA: twilight exterior, per the Home Page Spec
    'sections/cta-twilight.jpg': 'projects/timian/5+CHP-+Exteroior+Night+1+-+DJI_20230921172739_0753_D.jpg',
    # About philosophy statement: quiet craftsmanship detail
    'sections/philosophy-detail.jpg': 'projects/timian/5+CHP-+Bar+-+1F2A0080.jpg',
    # Process concierge
    'sections/concierge.jpg': 'projects/landeskog/Entry7848.jpg',
    # Six phases
    'phases/1-design-spec-lock.jpg': 'projects/mcdonald/Nancy-Holst-McDonald-08-25-23-Kitchen-Detail-Left-Side-Web.jpg',
    'phases/2-pre-construction.jpg': 'other/luxe-magazine-feature/image-asset__1423511255040-I0KMRDZIG3RZGHS22MCM.jpeg',
    'phases/3-framing.jpg': 'other/eco-building/eco+home+framing.jpg',
    'phases/4-trade-sequencing.jpg': 'projects/landeskog/Stairs7677.jpg',
    'phases/5-finish-work.jpg': 'projects/timian/5+CHP-Master+Bath+1+-+1F2A9894.jpg',
    'phases/6-move-in.jpg': 'projects/mcdonald/Nancy-Holst-McDonald-08-25-23-One-Point-Living-Web.jpg',
    # Founder
    'people/dan-fuller.jpg': 'people/Dan+Fuller+from+Haley+Custom+Homes.jpg',
}

manifest = {}


def muted_tone(im):
    small = im.resize((1, 1), Image.LANCZOS).getpixel((0, 0))
    # Pull the sampled tone toward the bone background so placeholders read muted, not loud.
    return '#%02x%02x%02x' % tuple(int(c * 0.7 + b * 0.3) for c, b in zip(small, BONE))


def blur_data_url(im):
    tiny = im.copy()
    tiny.thumbnail((16, 16))
    buf = io.BytesIO()
    tiny.save(buf, 'JPEG', quality=50)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()


def emit(src_rel, out_rel, max_w=2400, quality=80):
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, src_rel))).convert('RGB')
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    out = os.path.join(PUB, 'images', out_rel)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, 'JPEG', quality=quality, optimize=True, progressive=True)
    key = '/images/' + out_rel
    manifest[key] = {
        'width': im.width,
        'height': im.height,
        'color': muted_tone(im),
        'blurDataURL': blur_data_url(im),
    }
    return key


def single_tone_mark(src_rel, out_rel, knockout):
    """Flatten a logo or award mark into one tone on transparency, 'muted' per the Home Page Spec."""
    im = Image.open(os.path.join(SRC, src_rel)).convert('RGBA')
    gray = ImageOps.grayscale(im)
    alpha = im.getchannel('A')
    if knockout == 'white':
        mask = ImageOps.invert(gray)
    elif knockout == 'black':
        mask = gray
    else:
        mask = alpha
    mask = Image.composite(mask, Image.new('L', im.size, 0), alpha)
    return mask


def write_mark(mask, out_rel, rgb, height=None):
    if height:
        w = round(mask.width * height / mask.height)
        mask = mask.resize((w, height), Image.LANCZOS)
    out_im = Image.new('RGBA', mask.size, rgb + (0,))
    out_im.putalpha(mask)
    bbox = mask.getbbox()
    if bbox:
        out_im = out_im.crop(bbox)
    out = os.path.join(PUB, 'images', out_rel)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    out_im.save(out, 'PNG', optimize=True)
    manifest['/images/' + out_rel] = {
        'width': out_im.width,
        'height': out_im.height,
        'color': 'transparent',
        'blurDataURL': '',
    }


def main():
    if os.path.isdir(os.path.join(PUB, 'images')):
        shutil.rmtree(os.path.join(PUB, 'images'))

    for slug, cover in PROJECTS.items():
        folder = os.path.join(SRC, 'projects', slug)
        emit(f'projects/{slug}/{cover}', f'projects/{slug}/cover.jpg', max_w=2400)
        files = sorted(f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.jpeg', '.png')))
        sized = [(f, Image.open(os.path.join(folder, f)).size) for f in files]
        good = [f for f, (w, h) in sized if max(w, h) >= GALLERY_MIN_WIDTH]
        chosen = (good if len(good) >= 4 else [f for f, _ in sized])
        chosen = [f for f in chosen if f != cover][:GALLERY_MAX]
        for i, f in enumerate(chosen, 1):
            emit(f'projects/{slug}/{f}', f'projects/{slug}/{i:02d}.jpg', max_w=2400)

    for out_rel, src_rel in SECTIONS.items():
        emit(src_rel, out_rel, max_w=2400)

    # Logo: the gold transparent mark, recolored to the two palette tones.
    logo = single_tone_mark('branding/Haley Custom Homes logo trans new.png', 'logo', 'alpha')
    write_mark(logo, 'brand/logo-bone.png', BONE)
    write_mark(logo, 'brand/logo-ink.png', INK)

    # Award marks, flattened to ink so no mark's color competes with the accent.
    marks = {
        'awards/houzz.png': ('other/misc-pages/houzz+logo.jpg', 'white'),
        'awards/luxury-lifestyle-awards.png': ('awards/Luxury Lifestyle Awards 2025 half.png', 'black'),
        'awards/luxe-gold-list.png': ('other/testimonials/image-asset.jpeg', 'white'),
    }
    for out_rel, (src_rel, knock) in marks.items():
        im = Image.open(os.path.join(SRC, src_rel))
        if im.mode == 'CMYK':
            im = im.convert('RGB')
        tmp = os.path.join(PUB, '_tmp.png')
        im.convert('RGBA').save(tmp)
        rel_tmp = os.path.relpath(tmp, SRC)
        mask = single_tone_mark(rel_tmp, None, knock)
        os.remove(tmp)
        write_mark(mask, out_rel, INK, height=96)

    # Hero video. The source is a 1920x1080 screen recording of a social post, so the real
    # footage (about 2.29:1) sits inside black borders that change partway through:
    #   0.00-4.05s  a small window at 1452x652+182+228
    #   4.05s-end   full width at 1900x852+8+118
    # A white progress-bar dot from the post's player also sits on the bottom edge. Each
    # section is cropped a few pixels inside its picture area (22px off the bottom to drop the
    # dot), scaled to one 1920x838 frame and joined. The post also dimmed the footage (whites
    # peak near 185/255). That dimming is deliberately kept: the footage is mostly white
    # interiors, and stretching it back to full brightness drops the bone headline's contrast
    # under the spec's 20% overlay to about 2:1 (it measures about 3.7:1 as is). No audio.
    # Uses the ffmpeg binary from the imageio-ffmpeg package.
    import subprocess
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    src_video = os.path.join(SRC, 'videos', 'HaleysCustomHomesHeroVideo.mp4')
    out_video = os.path.join(PUB, 'video', 'hero.mp4')
    os.makedirs(os.path.join(PUB, 'video'), exist_ok=True)
    hero_filter = (
        '[0:v]trim=0:4.05,setpts=PTS-STARTPTS,crop=1444:630:186:232,'
        'scale=1920:838:flags=lanczos,setsar=1[a];'
        '[0:v]trim=start=4.05,setpts=PTS-STARTPTS,crop=1892:826:12:122,'
        'scale=1920:838:flags=lanczos,setsar=1[b];'
        '[a][b]concat=n=2:v=1:a=0,format=yuv420p[out]'
    )
    subprocess.run([ff, '-y', '-loglevel', 'error', '-i', src_video, '-filter_complex', hero_filter,
                    '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
                    '-profile:v', 'high', '-movflags', '+faststart', out_video], check=True)
    subprocess.run([ff, '-y', '-loglevel', 'error', '-ss', '0.1', '-i', out_video, '-frames:v', '1',
                    '-q:v', '3', os.path.join(PUB, 'video', 'hero-poster.jpg')], check=True)

    with open(MANIFEST, 'w', encoding='utf-8') as fh:
        json.dump(dict(sorted(manifest.items())), fh, indent=1)
    print(f'{len(manifest)} images written')


if __name__ == '__main__':
    main()
