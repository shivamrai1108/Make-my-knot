#!/bin/bash

echo "Checking for new images..."

if [ -f "public/images/maulik-goyal.jpg" ]; then
    echo "✅ Maulik Goyal image found: public/images/maulik-goyal.jpg"
    ls -lh "public/images/maulik-goyal.jpg"
else
    echo "❌ Maulik Goyal image NOT found: public/images/maulik-goyal.jpg"
    echo "Please save the first image (man in navy suit) as: public/images/maulik-goyal.jpg"
fi

if [ -f "public/images/chaman-prakash-goyal.jpg" ]; then
    echo "✅ Chaman Prakash Goyal image found: public/images/chaman-prakash-goyal.jpg"
    ls -lh "public/images/chaman-prakash-goyal.jpg"
else
    echo "❌ Chaman Prakash Goyal image NOT found: public/images/chaman-prakash-goyal.jpg"
    echo "Please save the second image (older man with glasses) as: public/images/chaman-prakash-goyal.jpg"
fi

echo ""
echo "Instructions:"
echo "1. Right-click on the first image (man in navy suit) and save as: $(pwd)/public/images/maulik-goyal.jpg"
echo "2. Right-click on the second image (older man with glasses) and save as: $(pwd)/public/images/chaman-prakash-goyal.jpg"