"""Extract complete brochure artwork at its embedded resolution, without upscaling."""
from pathlib import Path
from pypdf import PdfReader
import sys

reader = PdfReader(sys.argv[1])
out = Path('public/images')
for page in [4, 5, 6, 7, 8, 9, 10]:
    image = reader.pages[page-1].images[0].image
    w, h = image.size
    # Includes the entire illustrated panel, roof, ground and brochure labels.
    box = tuple(round(v) for v in (w*.145, h*.108, w*.845, h*.617))
    artwork = image.crop(box)
    artwork.save(out / f'project-{page}-full.png')
    print(page, artwork.size)
image = reader.pages[10].images[0].image
w, h = image.size
for name, bounds in [('11a', (.087,.114,.591,.478)), ('11b', (.442,.520,.940,.961))]:
    artwork = image.crop(tuple(round(v) for v in (w*bounds[0],h*bounds[1],w*bounds[2],h*bounds[3])))
    artwork.save(out / f'project-{name}-full.png')
    print(name, artwork.size)
