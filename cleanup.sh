#!/bin/bash

# Remove duplicate files with " 4" suffix
find . -name "* 4.*" -type f -delete

# Clean dist directory
rm -rf dist/*

# Create proper dist structure
mkdir -p dist/{js,css,assets,images}

# Copy and organize files
cp public/index.html dist/
cp public/styles.css dist/css/
cp public/main.js dist/js/
cp public/calculation_model.js dist/js/
cp -r public/assets/* dist/assets/

# Remove any leftover temporary files
find . -name ".DS_Store" -type f -delete
find . -name "*.tmp" -type f -delete

echo "Cleanup complete!" 