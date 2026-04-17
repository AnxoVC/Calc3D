const { Jimp } = require('jimp');
async function main() {
  const image = await Jimp.read('calc3d-app/public/logo.png');
  image.rotate(180);
  await image.write('calc3d-app/public/logo.png');
  console.log('Rotated 180 degrees');
}
main().catch(console.error);
