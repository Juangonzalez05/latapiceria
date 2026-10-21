// Capturas de auditoría con el Edge del sistema (playwright-core, sin descargar navegador).
// Uso: node scripts/shoot.mjs <carpeta-salida> [url] [anchos separados por coma] [--hero-only]
// Ej.:  node scripts/shoot.mjs .audit/antes http://localhost:4400/ 390,768,1440
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const [outDir = '.audit/tmp', url = 'http://localhost:4400/', widthsArg = '390,768,1440'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const heroOnly = process.argv.includes('--hero-only');
// --sections=id1,id2 → una captura 2x por sección (para el laboratorio de heros).
const sectionsArg = process.argv.find((a) => a.startsWith('--sections='));
const sections = sectionsArg ? sectionsArg.split('=')[1].split(',') : null;
const widths = widthsArg.split(',').map(Number);
const heights = { 360: 780, 390: 844, 768: 1024, 1024: 768, 1280: 800, 1440: 900, 1920: 1080 };
const slug = new URL(url).pathname.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'home';

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge' });

for (const w of widths) {
  const h = heights[w] ?? 900;
  // Hero: tal cual lo ve el visitante (con animaciones), a 2x para juzgar nitidez.
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  if (sections) {
    for (const id of sections) {
      // Las secciones fuera de pantalla retoman animación y decodificación al entrar: se espera a que asienten.
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
      }, `#${id}`);
      await page.waitForTimeout(1800);
      await page.locator(`#${id} img`).evaluateAll((imgs) => Promise.all(imgs.map((i) => i.decode().catch(() => {}))));
      await page.waitForTimeout(300);
      // Captura de viewport (la sección ocupa una pantalla): la captura por elemento de Playwright
      // deja imágenes sin pintar en secciones que estaban fuera de pantalla.
      await page.screenshot({ path: path.join(outDir, `${id}-${w}.png`) });
    }
    await ctx.close();
    continue;
  }
  await page.screenshot({ path: path.join(outDir, `${slug}-hero-${w}.png`) });
  await ctx.close();

  if (heroOnly) continue;
  // Página completa: movimiento reducido para que todo esté revelado; se recorre para cargar imágenes lazy.
  const full = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const p2 = await full.newPage();
  await p2.goto(url, { waitUntil: 'networkidle' });
  await p2.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    // Imágenes en paneles ocultos nunca cargan: se espera como máximo 4 s.
    const loads = [...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r))));
    await Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 4000))]);
  });
  await p2.waitForTimeout(500);
  const height = await p2.evaluate(() => document.documentElement.scrollHeight);
  await p2.screenshot({ path: path.join(outDir, `${slug}-full-${w}.png`), fullPage: true });
  console.log(`${w}px · página ${height}px`);
  await full.close();
}
await browser.close();
console.log('listo ->', outDir);
