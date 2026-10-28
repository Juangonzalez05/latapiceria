// Extrae las imágenes incrustadas de un PDF (p. ej. el catálogo del cliente) para revisarlas.
// DCTDecode -> .jpg tal cual; FlateDecode (+ SMask como alfa) -> .png.
// Uso: node scripts/extract-pdf.mjs <archivo.pdf> <carpeta-salida>
import sharp from 'sharp';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';
import path from 'node:path';

const [pdfPath, outDir] = process.argv.slice(2);
if (!pdfPath || !outDir) {
  console.error('Uso: node scripts/extract-pdf.mjs <archivo.pdf> <carpeta-salida>');
  process.exit(1);
}
const buf = await readFile(pdfPath);
const text = buf.toString('latin1');
await mkdir(outDir, { recursive: true });

// Índice de objetos: número -> { dict, data }
const objects = new Map();
const re = /(\d+) 0 obj\s*<<([\s\S]*?)>>\s*stream\r?\n/g;
for (let m; (m = re.exec(text)); ) {
  const dict = m[2];
  const len = Number(/\/Length\s+(\d+)(?!\s+0\s+R)/.exec(dict)?.[1]);
  if (!len) continue;
  const start = m.index + m[0].length;
  objects.set(Number(m[1]), { dict, data: buf.subarray(start, start + len) });
}
const plain = new Map();
for (const m of text.matchAll(/(\d+) 0 obj\s*<<([\s\S]*?)>>\s*endobj/g)) plain.set(Number(m[1]), m[2]);

const channelsOf = (dict) => {
  if (/\/DeviceGray/.test(dict)) return 1;
  if (/\/DeviceCMYK/.test(dict)) return 4;
  const icc = /\/ICCBased\s+(\d+)\s+0\s+R/.exec(dict);
  if (icc) {
    const d = objects.get(Number(icc[1]))?.dict ?? plain.get(Number(icc[1])) ?? '';
    return Number(/\/N\s+(\d)/.exec(d)?.[1] ?? 3);
  }
  return 3;
};

let n = 0;
for (const [num, { dict, data }] of objects) {
  if (!/\/Subtype\s*\/Image/.test(dict)) continue;
  const width = Number(/\/Width\s+(\d+)/.exec(dict)[1]);
  const height = Number(/\/Height\s+(\d+)/.exec(dict)[1]);
  // Las máscaras de alfa se usan al componer su imagen, no por separado.
  if ([...objects.values()].some((o) => new RegExp(`/SMask\\s+${num}\\s+0\\s+R`).test(o.dict))) continue;
  const name = `img-${String(++n).padStart(2, '0')}-obj${num}-${width}x${height}`;
  if (/\/DCTDecode/.test(dict)) {
    await writeFile(path.join(outDir, `${name}.jpg`), data);
  } else if (/\/FlateDecode/.test(dict)) {
    const channels = channelsOf(dict);
    let raw = inflateSync(data);
    let ch = channels;
    const smask = /\/SMask\s+(\d+)\s+0\s+R/.exec(dict);
    if (smask && channels === 3) {
      const alpha = inflateSync(objects.get(Number(smask[1])).data);
      const rgba = Buffer.alloc(width * height * 4);
      for (let i = 0; i < width * height; i++) {
        rgba[i * 4] = raw[i * 3];
        rgba[i * 4 + 1] = raw[i * 3 + 1];
        rgba[i * 4 + 2] = raw[i * 3 + 2];
        rgba[i * 4 + 3] = alpha[i];
      }
      raw = rgba;
      ch = 4;
    }
    await sharp(raw, { raw: { width, height, channels: ch } }).png().toFile(path.join(outDir, `${name}.png`));
  } else {
    continue;
  }
  console.log(name);
}
