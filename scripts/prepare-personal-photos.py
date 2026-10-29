"""Create web-sized copies of the personal photos; leave originals untouched."""
import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "asset" / "personal"
OUTPUT = ROOT / "public" / "images" / "personal"
PHOTOS = [
    ("retouch_2026032112455679.png", "A spring afternoon beneath the blossoms"),
    ("IMG_20260807_133843.jpg", "An afternoon outdoors with friends"),
    ("IMG_20241226_212807_edit_15087888446134.jpg", "A handmade paper Christmas tree"),
    ("IMG_20260712_142402.jpg", "Cats curled up together at home"),
    ("IMG_20251005_202943.jpg", "A plate of homemade pasta"),
    ("IMG_20250129_002454.jpg", "Fireworks outside the window"),
    ("IMG_20250330_124523.jpg", "Spring blossoms along a courtyard path"),
    ("IMG_20241231_190916_edit_24417694472836.jpg", "A handwritten note and a festive card"),
    ("IMG_20260727_113747.jpg", "A colorful building-block tower in the classroom"),
    ("Image_50246825150145.jpg", "A panoramic group photo on the lawn"),
    ("retouch_2026041821143472.png", "A portrait with flowers"),
    ("retouch_2026051521574316.jpg", "A group selfie with friends"),
    ("IMG_20250606_192326.jpg", "Instant photos spread out across a table"),
    ("IMG_20251006_184557.jpg", "A table full of dishes for a shared meal"),
    ("IMG_20241231_180636_edit_21166831860311.jpg", "A festive gift and a glass ornament"),
    ("IMG_20251108_185603.jpg", "A glowing concert light stick"),
    ("IMG_20251005_202702.jpg", "Cooking pasta in the kitchen"),
    ("retouch_2026071012503567.jpg", "A collection of printed photographs"),
    ("Screenshot_20250829_155440_com.tencent.mm.jpg", "A collection of colorful souvenir magnets"),
    ("Image_1783586123330_967_edit_83887719005185.jpg", "A musical theater certificate among photographs"),
]

OUTPUT.mkdir(parents=True, exist_ok=True)
manifest = []
for index, (filename, label) in enumerate(PHOTOS, start=1):
    with Image.open(SOURCE / filename) as original:
        photo = ImageOps.exif_transpose(original).convert("RGB")
        photo.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        output_name = f"photo-{index:02d}.webp"
        photo.save(OUTPUT / output_name, "WEBP", quality=85, method=6)
        manifest.append({"label": label, "src": f"/images/personal/{output_name}"})

(ROOT / "src" / "personal-photos.json").write_text(
    json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
)
total = sum(path.stat().st_size for path in OUTPUT.glob("*.webp"))
print(f"Prepared {len(manifest)} personal photos ({total / 1024 / 1024:.2f} MiB).")
