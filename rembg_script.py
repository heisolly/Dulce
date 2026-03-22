from rembg import remove
from PIL import Image

files = [
    "Dishes",
    "Drinks",
    "Snacks",
    "Dessert",
    "Platters"
]

for name in files:
    input_path = fr"c:\Softwares\Dulce\public\assets\Heroimg\{name}.png"
    output_path = fr"c:\Softwares\Dulce\public\assets\Heroimg\{name}_cut.png"
    
    try:
        print(f"Processing {name} with rembg...")
        input_image = Image.open(input_path)
        
        # Applying AI background removal directly using the local rembg model
        output_image = remove(input_image)
        output_image.save(output_path, "PNG")
        print(f"Successfully saved {name}_cut.png")
    except Exception as e:
        print(f"Failed to process {name}: {e}")
