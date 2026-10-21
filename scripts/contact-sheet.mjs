// Genera hojas de contacto numeradas de ./brand para clasificar fotos sin abrirlas una a una.
// Uso: node scripts/contact-sheet.mjs [carpeta-salida]
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BRAND = path.resolve('brand');
const OUT = path.resolve(process.argv[2] ?? '.contact-sheet');
const COLS = 6;
const CELL = 220;
const PER_SHEET = 30;

const files = (await readdir(BRAND)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
await mkdir(OUT, { recursive: true });

const index = [];
for (let s = 0; s * PER_SHEET < files.length; s++) {
  const batch = files.slice(s * PER_SHEET, (s + 1) * PER_SHEET);
  const rows = Math.ceil(batch.length / COLS);
  const composites = [];
  for (let i = 0; i < batch.length; i++) {
    const n = s * PER_SHEET + i;
    index.push(`${n}\t${batch[i]}`);
    const thumb = await sharp(path.join(BRAND, batch[i]))
      .resize(CELL, CELL, { fit: 'contain', background: '#222' })
      .toBuffer();
    const label = Buffer.from(
      `<svg width="${CELL}" height="34"><rect width="60" height="34" fill="#c00"/><text x="8" y="25" font-size="24" font-family="Arial" font-weight="bold" fill="#fff">${n}</text></svg>`
    );
    const x = (i % COLS) * CELL;
    const y = Math.floor(i / COLS) * CELL;
    composites.push({ input: thumb, left: x, top: y }, { input: label, left: x, top: y });
  }
  await sharp({ create: { width: COLS * CELL, height: rows * CELL, channels: 3, background: '#111' } })
    .composite(composites)
    .jpeg({ quality: 70 })
    .toFile(path.join(OUT, `sheet-${s}.jpg`));
}
await writeFile(path.join(OUT, 'index.tsv'), index.join('\n'));
console.log(`${files.length} fotos -> ${OUT}`);
