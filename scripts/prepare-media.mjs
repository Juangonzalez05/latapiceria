// Copia y limpia las fotos de ./brand hacia src/assets según scripts/media-map.json.
// - Recorta solo overlays de interfaz (WhatsApp/Instagram) y normaliza a JPEG de calidad alta.
// - Genera los recortes de textura de las muestras de tela, el favicon (la silla del logo) y el cursor.
// La imagen Open Graph sale de scripts/og-image.mjs (npm run og), que necesita las fuentes reales.
// Uso: npm run media
import sharp from 'sharp';
import { readFile, readdir, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { sillaSvg } from '../src/lib/silla.mjs';

const root = path.resolve('.');
const map = JSON.parse(await readFile(path.join(root, 'scripts/media-map.json'), 'utf8'));
const brand = (f) => path.join(root, 'brand', f);
const photosDir = path.join(root, 'src/assets/photos');
await mkdir(photosDir, { recursive: true });
// Fuera las fotos que ya no están en el mapa, para que no queden huérfanas en src/assets.
const wanted = new Set([...Object.keys(map.photos), ...Object.keys(map.muestras).map((s) => `${s}-muestra`)].map((s) => `${s}.jpg`));
for (const f of await readdir(photosDir)) if (!wanted.has(f)) await rm(path.join(photosDir, f));

const toRect = ([left, top, width, height]) => ({ left, top, width, height });

for (const [slug, cfg] of Object.entries(map.photos)) {
  let img = sharp(brand(cfg.src)).rotate();
  if (cfg.scale) {
    const { width } = await sharp(brand(cfg.src)).metadata();
    img = sharp(await img.resize(Math.round(width * cfg.scale)).toBuffer());
  }
  if (cfg.crop) img = img.extract(toRect(cfg.crop));
  await img.jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(photosDir, `${slug}.jpg`));
  console.log('foto', slug);
}

// Muestras de tela: recorte cuadrado solo de la tela, a 2x del círculo más grande (56px CSS).
for (const [slug, rect] of Object.entries(map.muestras)) {
  await sharp(path.join(photosDir, `${slug}.jpg`))
    .extract(toRect(rect))
    .resize(168, 168)
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(photosDir, `${slug}-muestra.jpg`));
  console.log('muestra', slug);
}

// Favicon: la silla del logo a color. Línea más gruesa para que se lea a 16-32px.
const favicon = sillaSvg({ id: 'f', width: 64, height: 92, ink: '#060606', stroke: 14 });
await writeFile(path.join(root, 'public/favicon.svg'), favicon);
await sharp(Buffer.from(favicon))
  .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(path.join(root, 'public/favicon.png'));
await sharp(Buffer.from(sillaSvg({ id: 'a', width: 124, height: 180, ink: '#060606', stroke: 9 })))
  .resize(132, 132, { fit: 'contain', background: '#eaeae5' })
  .extend({ top: 24, bottom: 24, left: 24, right: 24, background: '#eaeae5' })
  .flatten({ background: '#eaeae5' })
  .png()
  .toFile(path.join(root, 'public/apple-touch-icon.png'));
console.log('favicon');

// Cursor «silla»: versión simplificada de la silla del logo (la original es de línea muy fina y
// desaparece a 32px). Respaldo con rodillo, asiento redondo y 4 patas; halo crema para fondos oscuros.
// Hotspot en la esquina superior izquierda del respaldo: (5, 3) en px CSS.
const chairShapes = `
  <rect x="8.6" y="19" width="2.6" height="7.5" rx="1.2"/>
  <rect x="18.8" y="19" width="2.6" height="7.5" rx="1.2"/>
  <rect x="7" y="6.5" width="2.6" height="9.5" rx="1.2"/>
  <rect x="17.4" y="6.5" width="2.6" height="9.5" rx="1.2"/>
  <ellipse cx="14" cy="17.2" rx="10.5" ry="3"/>
  <rect x="5" y="2.5" width="18" height="5" rx="2.5"/>
  <circle cx="20.5" cy="5" r="1.2"/>
  <rect x="3.6" y="18.5" width="2.8" height="11" rx="1.3"/>
  <rect x="15.6" y="19.5" width="2.8" height="11" rx="1.3"/>`;
const chairSvg = (ink, size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
    <g fill="#eaeae5" stroke="#eaeae5" stroke-width="4.4" stroke-linejoin="round">${chairShapes}</g>
    <g fill="#eaeae5" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round">${chairShapes}</g>
  </svg>`;
const cursorDir = path.join(root, 'public/cursor');
await mkdir(cursorDir, { recursive: true });
for (const [name, ink] of [['silla', '#060606'], ['silla-terra', '#8c5230']]) {
  for (const [suffix, size] of [['', 32], ['@2x', 64]]) {
    await sharp(Buffer.from(chairSvg(ink, size))).png().toFile(path.join(cursorDir, `${name}${suffix}.png`));
  }
}
console.log('cursor silla');
