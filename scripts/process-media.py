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
import re
import shutil

from PIL import Image, ImageOps, ImageStat

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets')
PUB = os.path.join(ROOT, 'public')
MANIFEST = os.path.join(ROOT, 'src', 'lib', 'media.generated.json')

BONE = (0xEF, 0xE9, 0xDE)
INK = (0x1A, 0x18, 0x15)

# Every project, keyed by the slug it is published under. Names, descriptions and credits come
# from Haley's own project pages (haleycustomhomes.com/project/...); locations and years for the
# first six from Haley's Houzz profile, matched by comparing each Houzz cover photo with the
# asset folders (the folders are named after clients, not projects). Values: (folder, cover
# file, optional list of files to leave out).
PROJECTS = {
    'curated-house': ('mcdonald', 'Nancy-Holst-McDonald-08-25-23-Front-Living-Horizantal-Web.jpg', []),
    'naturally-modern': ('lowe', 'Lowe+Exterior+back.jpg', []),
    'modern-elevated': ('beckman', 'Beckman+Exterior+Side+2.jpg', []),
    'tradition-reimagined': ('walker', 'Walker+Great+Room.jpeg', []),
    'timeless-estate': ('fisher', 'Fischer+Front+417A7330_v2.jpg', []),
    'simplicity-perfected': ('polzin', 'Polzin+Front+Exterior+3.0.jpg', []),
    # The retouched '-Edit' drone frame replaces its unretouched twin.
    'striking-modern-sanctuary': ('timian', 'Cover+Option+Copy.jpeg',
                                  ['5+CHP-DJI_20230921172329_0723_D.jpg']),
    'house-of-tranquility': ('19-chp', '19+Backyard.jpg', []),
    'heaven-at-sunset': ('landeskog', 'ExteriorRear.jpg', []),
    'endlessly-charming': ('boland', 'Boland+EMR_7046.jpg', []),
    # Drafts: listed on Haley's site with details still "TBD"; imported unpublished so they can
    # be completed and published from the admin.
    'laney': ('laney', '01+-+Laney+Pool+Side.jpg', []),
    'millisor': ('millisor', '01+-+Millisor+Exterior.jpg', []),
    # The quincy folder also holds three Polzin photos; only the Quincy exterior belongs here.
    'quincy': ('quincy', '01+-+Quincy+Exterior2.jpg', ['01+-+Polzin+Front+Exterior+3.0.jpg',
               '02+-+Polzin+Back+yard+through+3.0.jpg', '03+-+Polzin+Backyard+Side+3.0.jpg']),
}
GALLERY_MAX = 24
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
    # Founder: studio portrait supplied by Damian (477x1024); a solid black band across the top
    # (rows 0-123) is cropped off in main().
    'people/dan-fuller.jpg': 'people/Danfullerimage.jpg',
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


def emit(src_rel, out_rel, max_w=2400, quality=90, crop=None):
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, src_rel))).convert('RGB')
    if crop:
        im = im.crop(crop)
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


def write_color_mark(im, out_rel, knockout, height):
    """Keep a mark's own colors; turn a flat black/white backdrop transparent."""
    if knockout:
        r, g, b, a = im.split()
        lum = ImageOps.grayscale(im.convert('RGB'))
        # distance from the backdrop color becomes opacity, with a soft ramp for anti-aliasing
        dist = lum if knockout == 'black' else ImageOps.invert(lum)
        alpha = dist.point(lambda v: 0 if v < 12 else min(255, int((v - 12) * 255 / 60)))
        alpha = Image.composite(alpha, Image.new('L', im.size, 0), a)
        im.putalpha(alpha)
    bbox = im.getchannel('A').getbbox()
    if bbox:
        im = im.crop(bbox)
    w = round(im.width * height / im.height)
    im = im.resize((w, height), Image.LANCZOS)
    out = os.path.join(PUB, 'images', out_rel)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im.save(out, 'PNG', optimize=True)
    manifest['/images/' + out_rel] = {
        'width': im.width, 'height': im.height, 'color': 'transparent', 'blurDataURL': ''}


def ink_whites(im):
    """Recolor a mark's white strokes (drawn for dark backgrounds) to ink, keeping its accents."""
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a and min(r, g, b) > 200:
                px[x, y] = (26, 24, 21, a)
    return im


def make_logo_marks():
    """Press and community marks, each the organization's own (see assets/*/SOURCES.md)."""
    raster = {
        'press/cherry-creek-lifestyle.png': ('press/sourced/cherry-creek-lifestyle-masthead.png', None, False),
        'press/cherry-creek-magazine.png': ('press/sourced/cherry-creek-magazine.png', None, False),
        'press/modern-in-denver.png': ('press/sourced/modern-in-denver.jpg', 'white', False),
        'press/colorado-homes-lifestyles.png': ('press/sourced/colorado-homes-lifestyles.png', None, False),
        'community/childrens-diabetes-foundation.png': ('community/sourced/childrens-diabetes-foundation.png', None, False),
        'community/st-thomas-more.png': ('community/sourced/st-thomas-more.png', None, False),
        'community/ekman-design-studio.png': ('community/sourced/ekman-design-studio.png', None, True),
    }
    for out_rel, (src_rel, knock, recolor) in raster.items():
        im = Image.open(os.path.join(SRC, src_rel)).convert('RGBA')
        if out_rel == 'press/modern-in-denver.png':
            # The wordmark only: its pale grey tagline all but vanishes once the white is removed.
            im = im.crop((0, 0, im.width, round(im.height * 0.58)))
        if recolor:
            im = ink_whites(im)
        write_color_mark(im, out_rel, knock, height=192)
    # Vector marks: Exquisite Kitchen Design as published; Xssentials' white strokes to ink.
    for name, swap in (('exquisite-kitchen-design', None), ('xssentials', ('#FFFFFF', '#1A1815'))):
        with open(os.path.join(SRC, 'community', 'sourced', f'{name}.svg'), encoding='utf-8') as fh:
            svg = fh.read()
        if swap:
            svg = svg.replace(*swap)
        out = os.path.join(PUB, 'images', 'community', f'{name}.svg')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, 'w', encoding='utf-8') as fh:
            fh.write(svg)
        m = re.search(r'viewBox="[\d.]+ [\d.]+ ([\d.]+) ([\d.]+)"', svg)
        w, h = (float(m.group(1)), float(m.group(2))) if m else (400.0, 120.0)
        manifest[f'/images/community/{name}.svg'] = {
            'width': round(w), 'height': round(h), 'color': 'transparent', 'blurDataURL': ''}


def main():
    if os.path.isdir(os.path.join(PUB, 'images')):
        shutil.rmtree(os.path.join(PUB, 'images'))

    for slug, (folder_name, cover, skip) in PROJECTS.items():
        folder = os.path.join(SRC, 'projects', folder_name)
        emit(f'projects/{folder_name}/{cover}', f'projects/{slug}/cover.jpg', max_w=2400)
        files = sorted(f for f in os.listdir(folder)
                       if f.lower().endswith(('.jpg', '.jpeg', '.png')) and f not in skip)
        sized = [(f, Image.open(os.path.join(folder, f)).size) for f in files]
        good = [f for f, (w, h) in sized if max(w, h) >= GALLERY_MIN_WIDTH]
        chosen = (good if len(good) >= 4 else [f for f, _ in sized])
        chosen = [f for f in chosen if f != cover][:GALLERY_MAX]
        for i, f in enumerate(chosen, 1):
            emit(f'projects/{folder_name}/{f}', f'projects/{slug}/{i:02d}.jpg', max_w=2400)

    for out_rel, src_rel in SECTIONS.items():
        if out_rel == 'people/dan-fuller.jpg':
            w, h = Image.open(os.path.join(SRC, src_rel)).size
            emit(src_rel, out_rel, max_w=2400, quality=92, crop=(0, 128, w, h))
        else:
            emit(src_rel, out_rel, max_w=2400)

    # Logo: the gold transparent mark, recolored to the two palette tones.
    logo = single_tone_mark('branding/Haley Custom Homes logo trans new.png', 'logo', 'alpha')
    write_mark(logo, 'brand/logo-bone.png', BONE)
    write_mark(logo, 'brand/logo-ink.png', INK)

    # Award marks in their original colors (Fixes spec item 5). Solid black or white
    # backgrounds baked into the source files are knocked out to transparency so each mark
    # sits on the bone strip; the mark itself keeps its real color. Rendered 192px tall
    # (2x the 96px maximum display height) so they stay sharp on high-density screens.
    marks = {
        'awards/houzz.png': ('awards/sourced/houzz-2024.png', None),
        'awards/luxury-lifestyle-awards.png': ('awards/Luxury Lifestyle Awards 2025 half.png', 'black'),
        'awards/luxe-gold-list.png': ('other/testimonials/image-asset.jpeg', 'white'),
    }
    for out_rel, (src_rel, knock) in marks.items():
        im = Image.open(os.path.join(SRC, src_rel))
        im = (im.convert('RGB') if im.mode == 'CMYK' else im).convert('RGBA')
        write_color_mark(im, out_rel, knock, height=192)
    # Energy Star: the EPA's official vector mark (public domain), served as SVG.
    shutil.copyfile(os.path.join(SRC, 'awards', 'sourced', 'energy-star.svg'),
                    os.path.join(PUB, 'images', 'awards', 'energy-star.svg'))
    manifest['/images/awards/energy-star.svg'] = {
        'width': 423, 'height': 433, 'color': 'transparent', 'blurDataURL': ''}
    make_logo_marks()

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
    # Constant 30 fps, level 4.0, 2s keyframes: the screen-recorded source is variable frame
    # rate, which iPhone Safari handles poorly (stalls, black frames).
    out_video = os.path.join(PUB, 'video', 'hero-30.mp4')
    os.makedirs(os.path.join(PUB, 'video'), exist_ok=True)
    hero_filter = (
        '[0:v]trim=0:4.05,setpts=PTS-STARTPTS,crop=1444:630:186:232,'
        'scale=1920:838:flags=lanczos,setsar=1[a];'
        '[0:v]trim=start=4.05,setpts=PTS-STARTPTS,crop=1892:826:12:122,'
        'scale=1920:838:flags=lanczos,setsar=1[b];'
        '[a][b]concat=n=2:v=1:a=0,fps=30,format=yuv420p[out]'
    )
    subprocess.run([ff, '-y', '-loglevel', 'error', '-i', src_video, '-filter_complex', hero_filter,
                    '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
                    '-profile:v', 'high', '-level:v', '4.0', '-r', '30', '-g', '60',
                    '-movflags', '+faststart', out_video], check=True)
    subprocess.run([ff, '-y', '-loglevel', 'error', '-ss', '0.1', '-i', out_video, '-frames:v', '1',
                    '-q:v', '3', os.path.join(PUB, 'video', 'hero-poster.jpg')], check=True)

    # Closing CTA background: the whole Timian twilight flyover (8s, 1280x720, 24fps), looped.
    # Its last frame (the close pool view) and first frame (the high aerial) don't match, so the
    # loop point is made seamless: the clip plays from 0.6s to the end, and its final 0.6s
    # cross-dissolves into the opening 0.6s. The output ends on the exact frame it starts on.
    cta_src = os.path.join(SRC, 'videos', 'timian-twilight-flyover.mp4')
    cta_out = os.path.join(PUB, 'video', 'cta-flyover.mp4')
    cta_filter = ('[0:v]split[a][b];'
                  '[a]trim=start=0.6,setpts=PTS-STARTPTS,fps=24[main];'
                  '[b]trim=0:0.6,setpts=PTS-STARTPTS,fps=24[head];'
                  '[main][head]xfade=transition=fade:duration=0.6:offset=6.8,format=yuv420p[out]')
    subprocess.run([ff, '-y', '-loglevel', 'error', '-i', cta_src, '-filter_complex', cta_filter,
                    '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
                    '-profile:v', 'high', '-movflags', '+faststart', cta_out], check=True)

    make_og_images()

    with open(MANIFEST, 'w', encoding='utf-8') as fh:
        json.dump(dict(sorted(manifest.items())), fh, indent=1)
    print(f'{len(manifest)} images written')


OG_PAGES = {
    # file: (eyebrow, headline, background image)
    'home': ('DENVER METRO. BOULDER. ASPEN. VAIL.', 'Three to five homes a year.', 'sections/cta-twilight.jpg'),
    'portfolio': ('PORTFOLIO', "A Sample of What We've Built", 'projects/tradition-reimagined/cover.jpg'),
    'process': ('OUR PROCESS', 'A Build That Moves in Order', 'phases/4-trade-sequencing.jpg'),
    'about': ('ABOUT', 'Dan Haley Fuller', 'sections/philosophy-detail.jpg'),
    'contact': ('CONTACT', 'Start Your Build', 'sections/concierge.jpg'),
}


def make_og_images():
    """1200x630 share cards: photo on the left, bone panel with the logo, eyebrow and headline."""
    from PIL import ImageDraw, ImageFont
    fonts = os.path.join(ROOT, 'scripts', 'fonts')
    serif = ImageFont.truetype(os.path.join(fonts, 'Newsreader.ttf'), 58)
    try:
        serif.set_variation_by_axes([400, 48])  # wght, opsz
    except Exception:
        pass
    sans = ImageFont.truetype(os.path.join(fonts, 'Switzer-Semibold.ttf'), 17)
    logo = Image.open(os.path.join(PUB, 'images', 'brand', 'logo-ink.png'))
    logo.thumbnail((150, 120))
    out_dir = os.path.join(PUB, 'og')
    os.makedirs(out_dir, exist_ok=True)

    def card(name, eyebrow, headline, bg_rel):
        W, H, split = 1200, 630, 660
        canvas = Image.new('RGB', (W, H), BONE)
        photo = Image.open(os.path.join(PUB, 'images', bg_rel)).convert('RGB')
        photo = ImageOps.fit(photo, (split, H), Image.LANCZOS)
        canvas.paste(photo, (0, 0))
        d = ImageDraw.Draw(canvas)
        x = split + 56
        canvas.paste(logo, (x, 56), logo)
        # wrap headline to the panel width
        words, lines, cur = headline.split(), [], ''
        for w in words:
            test = (cur + ' ' + w).strip()
            if d.textlength(test, font=serif) > W - x - 48 and cur:
                lines.append(cur)
                cur = w
            else:
                cur = test
        lines.append(cur)
        y = H - 64 - len(lines) * 66
        d.text((x, y - 44), eyebrow, font=sans, fill=INK, spacing=4)
        for i, line in enumerate(lines):
            d.text((x, y + i * 66), line, font=serif, fill=INK)
        d.line([(x, H - 40), (W - 48, H - 40)], fill=(0x7A, 0x62, 0x50), width=2)
        canvas.save(os.path.join(out_dir, f'{name}.jpg'), 'JPEG', quality=90)

    for name, (eyebrow, headline, bg) in OG_PAGES.items():
        card(name, eyebrow, headline, bg)


if __name__ == '__main__':
    main()
