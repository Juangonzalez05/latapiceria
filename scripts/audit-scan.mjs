// Escaneo medible de la página renderizada (Edge del sistema vía playwright-core).
// Uso: node scripts/audit-scan.mjs [url] [anchos] > informe.json
import { chromium } from 'playwright-core';

const url = process.argv[2] ?? 'http://127.0.0.1:4400/';
const widths = (process.argv[3] ?? '390,1440').split(',').map(Number);
const browser = await chromium.launch({ channel: 'msedge' });
const report = {};

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  report[w] = await page.evaluate(() => {
    const lum = ([r, g, b]) => {
      const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    // Cualquier formato CSS (rgb, oklab, color-mix…) → [r,g,b,a] pintándolo en un canvas de 1px.
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    const parse = (s) => {
      cx.clearRect(0, 0, 1, 1);
      cx.fillStyle = '#000';
      cx.fillStyle = s;
      cx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = cx.getImageData(0, 0, 1, 1).data;
      return [r, g, b, a / 255];
    };
    const ratio = (a, b) => {
      const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
      return (l1 + 0.05) / (l2 + 0.05);
    };
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[hidden],[aria-hidden="true"]');
    };
    // Fondo efectivo: primer ancestro con color de fondo opaco; si hay imagen de por medio, se marca.
    const bgOf = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const cs = getComputedStyle(n);
        const c = parse(cs.backgroundColor);
        if (c[3] > 0.6) return { rgb: c.slice(0, 3), overImage: false };
        if (cs.backgroundImage !== 'none') return { rgb: null, overImage: true };
        n = n.parentElement;
      }
      return { rgb: parse(getComputedStyle(document.body).backgroundColor).slice(0, 3), overImage: false };
    };
    const contrast = [];
    const small = [];
    const seen = new Set();
    for (const el of document.querySelectorAll('body *')) {
      const own = [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
      if (!own || !visible(el)) continue;
      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize);
      const fw = parseInt(cs.fontWeight, 10);
      const text = el.textContent.trim().slice(0, 40);
      const key = el.tagName + text;
      if (seen.has(key)) continue;
      seen.add(key);
      if (fs < 13) small.push({ text, fs, sel: el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] });
      const bg = bgOf(el);
      // Ancestros con opacidad o imagen detrás: no medibles con certeza.
      const imgBehind = !!el.closest('#inicio, [data-path-card], #contacto, .ba');
      if (!bg.rgb || imgBehind) continue;
      const fg = parse(cs.color);
      const alpha = fg[3] ?? 1;
      const mixed = fg.slice(0, 3).map((c, i) => c * alpha + bg.rgb[i] * (1 - alpha));
      const r = ratio(mixed, bg.rgb);
      const large = fs >= 24 || (fs >= 18.66 && fw >= 700);
      if (r < (large ? 3 : 4.5)) contrast.push({ text, ratio: +r.toFixed(2), fs, large });
    }
    const targets = [];
    for (const el of document.querySelectorAll('a[href], button, [role="slider"], summary, label.choice, label.swatch')) {
      if (!visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 44 || r.height < 44) {
        const inline = getComputedStyle(el).display === 'inline' && el.closest('p, li, dd');
        targets.push({ text: (el.getAttribute('aria-label') || el.textContent).trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height), inline: !!inline });
      }
    }
    const imgs = [...document.images].map((i) => ({ src: i.currentSrc.split('/').pop().slice(0, 40), alt: i.alt, hasDims: i.hasAttribute('width') && i.hasAttribute('height'), loading: i.loading, natural: i.naturalWidth, shown: Math.round(i.getBoundingClientRect().width) }));
    const headings = [...document.querySelectorAll('h1,h2,h3')].filter(visible).map((h) => `${h.tagName} ${h.textContent.trim().slice(0, 40)} (${getComputedStyle(h).fontSize})`);
    return {
      pageHeight: document.documentElement.scrollHeight,
      todos: document.querySelectorAll('[data-todo], .todo').length,
      contrastFails: contrast,
      smallText: small.slice(0, 25),
      smallTextCount: small.length,
      smallTargets: targets,
      imagesUpscaled: imgs.filter((i) => i.natural && i.shown * 2 > i.natural * 1.05).map((i) => `${i.src} natural ${i.natural} · mostrado ${i.shown}px CSS (2x pide ${i.shown * 2})`),
      imagesNoDims: imgs.filter((i) => !i.hasDims).length,
      imagesNoAlt: imgs.filter((i) => i.alt === '' ).length,
      headings,
    };
  });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(report, null, 2));
