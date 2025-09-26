# Qasira Font Installation

## How to add Qasira font files

To complete the Qasira font integration, you need to add the following font files to this directory (`public/fonts/`):

### Required Font Files:
- `qasira-regular.woff2` (recommended for modern browsers)
- `qasira-regular.woff` (fallback for older browsers)
- `qasira-regular.ttf` (fallback for very old browsers)
- `qasira-medium.woff2`
- `qasira-medium.woff`
- `qasira-medium.ttf`
- `qasira-semibold.woff2`
- `qasira-semibold.woff`
- `qasira-semibold.ttf`
- `qasira-bold.woff2`
- `qasira-bold.woff`
- `qasira-bold.ttf`

### Where to get Qasira font:
1. **ifonts.xyz** - Search for "Qasira" and download the font package
2. **1001fonts.com** - Look up "Qasira" in their database
3. **dafont.com** - Search for "Qasira" or similar serif fonts
4. **Adobe Fonts** - If you have an Adobe subscription
5. **Font Squirrel** - Check their free fonts section

### After downloading:
1. Place all the font files in this directory (`public/fonts/`)
2. The CSS file (`qasira.css`) is already configured to use these files
3. The website will automatically use the Qasira font for "Make My Knot" branding

### Current Fallback:
Until you add the actual Qasira font files, the website will use these fallback fonts in order:
- Playfair Display (currently loaded from Google Fonts)
- Crimson Text
- Lora
- Merriweather
- Georgia (system font)

### Note:
The font implementation is ready - just add the actual Qasira font files to this directory and they will be automatically loaded.