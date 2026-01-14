import os
from PIL import Image

assets_dir = 'src/assets'
for filename in os.listdir(assets_dir):
    if filename.endswith('.png'):
        filepath = os.path.join(assets_dir, filename)
        img = Image.open(filepath)
        webp_path = os.path.splitext(filepath)[0] + '.webp'
        img.save(webp_path, 'WEBP')
        print(f"Converted {filename} to WebP")
