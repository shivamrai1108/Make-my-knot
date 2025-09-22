#!/usr/bin/env python3
import base64
import os

def save_image(image_data, filename):
    """Save base64 image data to file"""
    try:
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64 data
        image_binary = base64.b64decode(image_data)
        
        # Save to file
        filepath = f"public/images/{filename}"
        with open(filepath, 'wb') as f:
            f.write(image_binary)
        
        print(f"Image saved to {filepath}")
        return True
    except Exception as e:
        print(f"Error saving image: {e}")
        return False

if __name__ == "__main__":
    print("Image saving script ready")