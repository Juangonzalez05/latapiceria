// Imagen Open Graph 1200x630 (al compartir el enlace): logo «Comodidad hecha diseño» con las fuentes
// reales + la foto del hero COMPLETA delante del arco. Se dibuja en Edge (playwright-core) y se guarda en
// public/og-image.jpg. Uso: npm run og (después de npm run media).
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { SILLA_VIEWBOX, sillaInner } from '../src/lib/silla.mjs';

const root = path.resolve('.');
const map = JSON.parse(await readFile(path.join(root, 'scripts/media-map.json'), 'utf8'));
const site = JSON.parse(await readFile(path.join(root, 'src/data/site.json'), 'utf8'));
const b64 = async (p) => (await readFile(path.join(root, p))).toString('base64');
const fonts = 'node_modules/@fontsource-variable';
const [serif, serifItalic, sans] = await Promise.all([
  b64(`${fonts}/literata/files/literata-latin-wght-normal.woff2`),
  b64(`${fonts}/literata/files/literata-latin-wght-italic.woff2`),
  b64(`${fonts}/figtree/files/figtree-latin-wght-normal.woff2`),
]);
const photoPath = `src/assets/photos/${map.og}.jpg`;
const { width, height } = await sharp(path.join(root, photoPath)).metadata();
const photo = await b64(photoPath);
const photoH = 470;
const photoW = Math.round((photoH * width) / height);

const html = `<!doctype html><html><head><style>
  @font-face { font-family: L; src: url(data:font/woff2;base64,${serif}) format('woff2'); font-weight: 200 900; }
  @font-face { font-family: L; font-style: italic; src: url(data:font/woff2;base64,${serifItalic}) format('woff2'); font-weight: 200 900; }
  @font-face { font-family: F; src: url(data:font/woff2;base64,${sans}) format('woff2'); font-weight: 300 900; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #eaeae5; color: #060606; display: flex; align-items: center; justify-content: space-between; padding: 0 84px 0 80px; overflow: hidden; }
  .logo { display: flex; align-items: center; gap: 22px; font-size: 64px; line-height: 1; }
  .logo svg.silla { height: 150px; width: auto; aspect-ratio: 272 / 393; flex: none; }
  .t { display: flex; flex-direction: column; }
  .n { font-family: L; font-weight: 400; letter-spacing: -0.005em; }
  .a { display: block; width: 300px; height: auto; margin: 10px 0 8px 18px; }
  .l { font-family: L; font-style: italic; font-size: 32px; letter-spacing: 0.07em; }
  p { font-family: F; font-size: 25px; line-height: 1.45; color: #55594f; max-width: 560px; margin-top: 44px; }
  .media { position: relative; padding: ${Math.round(photoW * 0.32)}px ${Math.round(photoW * 0.1)}px 0; align-self: flex-end; margin-bottom: 40px; }
  .arco { position: absolute; inset: 0 0 9% 0; border-radius: 9999px 9999px 14px 14px; background: #ddd4c2; }
  .media img { position: relative; display: block; width: ${photoW}px; height: ${photoH}px; border-radius: 14px; box-shadow: 0 18px 40px -22px rgb(6 6 6 / 0.45); }
</style></head><body>
  <div>
    <div class="logo">
      <svg class="silla" viewBox="${SILLA_VIEWBOX}">${sillaInner({ id: 'og', ink: '#060606' })}</svg>
      <div class="t">
        <span class="n">${site.name}</span>
        <svg class="a" viewBox="0 0 200 14"><line x1="1" y1="8" x2="30" y2="8" stroke="#060606" stroke-width="1.6" stroke-dasharray="5 4.5" stroke-linecap="round"/><path d="M33 8 C 42 8, 46 2.2, 55 2.2 S 68 9, 76 8.4" fill="none" stroke="#060606" stroke-width="1.6" stroke-linecap="round"/><circle cx="80" cy="8.1" r="2.6" fill="#060606"/><path d="M83.5 7.1 L 200 8 L 83.5 9.1 Z" fill="#060606"/></svg>
        <span class="l">${site.tagline}</span>
      </div>
    </div>
    <p>Mobiliario hecho a mano, con el cuero como especialidad, para hoteles, restaurantes, galerías y casas de arquitecto.</p>
  </div>
  <div class="media"><span class="arco"></span><img src="data:image/jpeg;base64,${photo}" alt=""></div>
</body></html>`;

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: 'png' });
await browser.close();
await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(root, 'public/og-image.jpg'));
console.log('og-image', `${photoW}x${photoH}`);
