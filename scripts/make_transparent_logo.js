import fs from 'fs';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const jpegData = fs.readFileSync('src/assets/images/jamia_logo_calligraphy_header_1786465075729.jpg');
const rawImageData = jpeg.decode(jpegData, { useTArray: true });

const { width, height, data } = rawImageData;
const png = new PNG({ width, height });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  
  // Calculate brightness / luminance
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  
  if (luminance > 235) {
    // Completely white background -> fully transparent
    png.data[i] = 0;
    png.data[i + 1] = 0;
    png.data[i + 2] = 0;
    png.data[i + 3] = 0;
  } else if (luminance > 160) {
    // Anti-aliased transition edge
    const alpha = Math.round((1 - (luminance - 160) / 75) * 255);
    png.data[i] = Math.min(r, 45);
    png.data[i + 1] = Math.min(g, 35);
    png.data[i + 2] = Math.min(b, 25);
    png.data[i + 3] = Math.max(0, Math.min(255, alpha));
  } else {
    // Dark calligraphy ink
    png.data[i] = Math.min(r, 35);
    png.data[i + 1] = Math.min(g, 25);
    png.data[i + 2] = Math.min(b, 15);
    png.data[i + 3] = 255;
  }
}

const buffer = PNG.sync.write(png);
fs.writeFileSync('src/assets/images/jamia_logo_calligraphy_transparent.png', buffer);
fs.writeFileSync('public/jamia_logo_calligraphy_transparent.png', buffer);
console.log('Successfully created transparent PNG logo!');
