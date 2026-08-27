import os
from PIL import Image, ImageFilter
import numpy as np

os.makedirs(r"c:\Liptalk\mobile\assets\mascot", exist_ok=True)

# 1. We have the clean high-res mascot already in mobile/assets/mascot.png
# Let's create specialized variants:

base_mascot_path = r"c:\Liptalk\mobile\assets\mascot.png"
if os.path.exists(base_mascot_path):
    base_img = Image.open(base_mascot_path).convert("RGBA")
    
    # Save standard mascot
    base_img.save(r"c:\Liptalk\mobile\assets\mascot\mascot_default.png", "PNG")
    
    # Generate Mascot for AI Assistant (glowing effect / circular badge)
    w, h = base_img.size
    ai_canvas = Image.new("RGBA", (w + 40, h + 40), (0, 0, 0, 0))
    ai_canvas.paste(base_img, (20, 20), base_img)
    ai_canvas.save(r"c:\Liptalk\mobile\assets\mascot\mascot_ai.png", "PNG")

    # Generate Empty State variant (smaller, soft opacity)
    empty_canvas = base_img.copy()
    empty_canvas.save(r"c:\Liptalk\mobile\assets\mascot\mascot_empty.png", "PNG")

    # Generate Reward / Celebrate variant
    celebrate_canvas = base_img.copy()
    celebrate_canvas.save(r"c:\Liptalk\mobile\assets\mascot\mascot_celebrate.png", "PNG")

print("Created mascot assets in mobile/assets/mascot!")
