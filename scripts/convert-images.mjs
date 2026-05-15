import Jimp from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const plantsDir = path.join(__dirname, '..', 'assets', 'plants');

const files = ['basil.png', 'spinach.png', 'tomato.png'];

for (const file of files) {
  const filePath = path.join(plantsDir, file);
  console.log(`Converting ${file}...`);
  try {
    const image = await Jimp.read(filePath);
    await image.write(filePath);
    console.log(`✓ ${file} saved as valid PNG`);
  } catch (err) {
    console.error(`✗ Failed to convert ${file}:`, err.message);
  }
}

console.log('Done!');
