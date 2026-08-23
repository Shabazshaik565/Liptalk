from PIL import Image, ImageDraw, ImageFilter
import numpy as np

# Load original image
img = Image.open(r"c:\Liptalk\WhatsApp Image 2026-08-20 at 10.25.15 PM.jpeg").convert("RGBA")
w, h = img.size

# High resolution polygon mask
detailed_pts = [
    # Top left to top of eyes
    (0, 0),
    (575, 0),
    (575, 80),
    (595, 115),
    (630, 140),
    (670, 150),
    (705, 170),
    (720, 200),
    (710, 235),
    (685, 260),
    (665, 285),
    (650, 320),
    (645, 365),
    (642, 410),
    (650, 450),
    (668, 480),
    (690, 505),
    (715, 540),
    (732, 580),
    (740, 620),
    (735, 650),
    (705, 670),
    (660, 690),
    (550, 715),
    (450, 725),
    (200, 725),
    (0, 725)
]

# Create a polygon mask for the mascot region
poly_mask = Image.new("L", (w, h), 0)
draw = ImageDraw.Draw(poly_mask)
draw.polygon(detailed_pts, fill=255)

# Extract only the region inside the polygon mask
isolated_np = np.array(img)
poly_np = np.array(poly_mask)

r = isolated_np[:, :, 0].astype(int)
g = isolated_np[:, :, 1].astype(int)
b = isolated_np[:, :, 2].astype(int)

# Outer white background detector
# Only within poly_mask region
is_white = (r > 230) & (g > 230) & (b > 230)

# Flood fill to find outer white background
from collections import deque
mask_bg = np.zeros((h, w), dtype=bool)
visited = np.zeros((h, w), dtype=bool)
queue = deque()

# Add all outer boundary pixels
for x in range(w):
    if is_white[0, x]:
        queue.append((0, x))
        visited[0, x] = True
    if is_white[h - 1, x]:
        queue.append((h - 1, x))
        visited[h - 1, x] = True

for y in range(h):
    if is_white[y, 0]:
        queue.append((y, 0))
        visited[y, 0] = True
    if is_white[y, w - 1]:
        queue.append((y, w - 1))
        visited[y, w - 1] = True

while queue:
    cy, cx = queue.popleft()
    mask_bg[cy, cx] = True
    for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        ny, nx = cy + dy, cx + dx
        if 0 <= ny < h and 0 <= nx < w:
            if not visited[ny, nx] and is_white[ny, nx]:
                visited[ny, nx] = True
                queue.append((ny, nx))

# Alpha is 255 where (poly_mask is 255 AND NOT mask_bg)
final_alpha = np.zeros((h, w), dtype=np.uint8)
valid_mascot = (poly_np > 128) & (~mask_bg)
final_alpha[valid_mascot] = 255

alpha_image = Image.fromarray(final_alpha, mode='L')
# Smooth alpha slightly
alpha_smooth = alpha_image.filter(ImageFilter.SMOOTH)

# Apply to image
result_np = isolated_np.copy()
result_np[:, :, 3] = np.array(alpha_smooth)
result_img = Image.fromarray(result_np, mode='RGBA')

# Crop to bounding box
coords = np.argwhere(np.array(alpha_smooth) > 15)
y_min, x_min = coords.min(axis=0)
y_max, x_max = coords.max(axis=0)

pad = 8
x_min = max(0, x_min - pad)
y_min = max(0, y_min - pad)
x_max = min(w, x_max + pad)
y_max = min(h, y_max + pad)

neat_mascot = result_img.crop((x_min, y_min, x_max, y_max))

# Save
neat_mascot.save(r"c:\Liptalk\mobile\assets\logo.png", "PNG")
neat_mascot.save(r"c:\Liptalk\mobile\assets\mascot.png", "PNG")

# Square icons
mw, mh = neat_mascot.size
dim = max(mw, mh) + 20
sq = Image.new("RGBA", (dim, dim), (0, 0, 0, 0))
sq.paste(neat_mascot, ((dim - mw) // 2, (dim - mh) // 2), neat_mascot)

icon_512 = sq.resize((512, 512), Image.Resampling.LANCZOS)
icon_512.save(r"c:\Liptalk\mobile\assets\icon.png", "PNG")
icon_512.save(r"c:\Liptalk\mobile\assets\adaptive-icon.png", "PNG")
icon_512.save(r"c:\Liptalk\mobile\assets\favicon.png", "PNG")

# Splash screen with #0B0F19
splash_bg = Image.new("RGBA", (1242, 2436), (11, 15, 25, 255))
splash_mascot = neat_mascot.copy()
splash_mascot.thumbnail((720, 720), Image.Resampling.LANCZOS)
sm_w, sm_h = splash_mascot.size
splash_bg.paste(splash_mascot, ((1242 - sm_w) // 2, (2436 - sm_h) // 2), splash_mascot)
splash_bg.save(r"c:\Liptalk\mobile\assets\splash.png", "PNG")

print(f"Generated neat mascot! Size: {neat_mascot.size}")
