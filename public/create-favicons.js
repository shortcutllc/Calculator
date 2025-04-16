const sharp = require('sharp');

async function createFavicons() {
  try {
    // Convert SVG to PNG
    await sharp('assets/favicon.svg')
      .png()
      .toFile('assets/favicon.png');

    // Convert SVG to ICO
    await sharp('assets/favicon.svg')
      .resize(32, 32)
      .toFormat('ico')
      .toFile('assets/favicon.ico');

    console.log('Favicons created successfully!');
  } catch (error) {
    console.error('Error creating favicons:', error);
  }
}

createFavicons(); 