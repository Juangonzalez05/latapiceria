// Copia y limpia las fotos de ./brand hacia src/assets según scripts/media-map.json.
// - Recorta overlays de interfaz (WhatsApp/Instagram) y normaliza a JPEG de calidad alta.
// - Convierte el logo raster (línea negra sobre crema) en PNG transparente, en tinta oscura y clara.
// Uso: npm run media
import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const map = JSON.parse(await readFile(path.join(root, 'scripts/media-map.json'), 'utf8'));
const brand = (f) => path.join(root, 'brand', f);
const photosDir = path.join(root, 'src/assets/photos');
const brandDir = path.join(root, 'src/assets/brand');
await mkdir(photosDir, { recursive: true });
await mkdir(brandDir, { recursive: true });

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

// Logo: alfa a partir de la luminancia (tinta oscura = opaca, fondo crema = transparente).
// hide = [x, y, w, h] relativo al recorte: zona que se vuelve transparente (p. ej. el tagline).
async function inkPng(rect, color, out, hide) {
  const { data, info } = await sharp(brand(map.logo.src))
    .extract(toRect(rect))
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  const [r, g, b] = color;
  for (let i = 0; i < info.width * info.height; i++) {
    const v = data[i];
    const x = i % info.width;
    const y = Math.floor(i / info.width);
    const hidden = hide && x >= hide[0] && y >= hide[1] && x < hide[0] + hide[2] && y < hide[1] + hide[3];
    const a = hidden ? 0 : Math.max(0, Math.min(255, Math.round(((215 - v) / (215 - 60)) * 255)));
    rgba[i * 4] = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;
    rgba[i * 4 + 3] = a;
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim()
    .png()
    .toFile(out);
  console.log('logo', path.basename(out));
}
await inkPng(map.logo.crop, [6, 6, 6], path.join(brandDir, 'logo-dark.png'));
await inkPng(map.logo.crop, [234, 234, 229], path.join(brandDir, 'logo-light.png'));
await inkPng(map.logo.chair, [46, 61, 53], path.join(root, 'public/favicon.png'));
// Versión compacta para el header: silla + nombre + pespunte, sin el tagline (ilegible a ~48px de alto).
await inkPng(map.logo.crop, [6, 6, 6], path.join(brandDir, 'logo-compact-dark.png'), map.logo.hideTagline);
await inkPng(map.logo.crop, [234, 234, 229], path.join(brandDir, 'logo-compact-light.png'), map.logo.hideTagline);

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

// Imagen Open Graph 1200x630 a partir del hero.
await sharp(path.join(photosDir, `${map.og}.jpg`))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82 })
  .toFile(path.join(root, 'public/og-image.jpg'));
console.log('og-image');
