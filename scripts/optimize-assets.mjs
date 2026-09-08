import fs from 'node:fs/promises';
import sharp from 'sharp';

const input = 'assets/hero-office-family.png';
const output = 'assets/hero-office-family.webp';

await sharp(input)
  .webp({ quality: 82, effort: 5 })
  .toFile(output);

const [sourceStat, outputStat] = await Promise.all([fs.stat(input), fs.stat(output)]);
const reduction = Math.round((1 - outputStat.size / sourceStat.size) * 100);
console.log(`Hero optimized: ${Math.round(sourceStat.size / 1024)} KB -> ${Math.round(outputStat.size / 1024)} KB (${reduction}% smaller)`);
