#!/bin/bash

# Find and remove files with " 2" or " 3" suffix
find . -type f -name "* 2*" -delete
find . -type f -name "* 3*" -delete

# Remove .DS_Store files
find . -name ".DS_Store" -delete

echo "Cleanup complete!" 