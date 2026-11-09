// QA funcional del build (Edge del sistema): errores de consola y recorrido de cada interacción.
// Uso: node scripts/qa.mjs [url]
import { chromium } from 'playwright-core';

const url = process.argv[2] ?? 'http://127.0.0.1:4400/';
const browser = await chromium.launch({ channel: 'msedge' });
const results = {};

async function run(width) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  const r = {};

  r.horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);

  // Header: compacta al bajar
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(200);
  r.headerCompact = await page.evaluate(() => document.querySelector('[data-header]').hasAttribute('data-scrolled'));
  await page.evaluate(() => window.scrollTo(0, 0));

  // Menú móvil
  if (width < 1024) {
    await page.click('[data-menu-toggle]');
    r.menuOpen = await page.evaluate(() => !document.querySelector('[data-menu]').hidden);
    r.menuFocus = await page.evaluate(() => document.activeElement?.textContent?.trim());
    await page.keyboard.press('Escape');
    r.menuClosedByEsc = await page.evaluate(() => document.querySelector('[data-menu]').hidden);
  }

  // Slider antes/después con teclado
  const handle = page.locator('[data-ba-handle]').first();
  await handle.focus();
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
  r.sliderAfter5Right = await handle.getAttribute('aria-valuenow');
  await page.keyboard.press('Home');
  r.sliderHome = await handle.getAttribute('aria-valuenow');

  // Trabajos en tela: filtros + «Ver más» (9 visibles al inicio)
  const works = () => page.evaluate(() => {
    const all = [...document.querySelectorAll('.work')];
    return `${all.filter((w) => !w.hidden).length} visibles de ${all.length} · ${document.querySelector('[data-works-count]').textContent}`;
  });
  r.worksInitial = await works();
  await page.locator('[data-filter="camas"]').scrollIntoViewIfNeeded();
  await page.click('[data-filter="camas"]');
  r.worksCamas = await works();
  r.worksCamasOnly = await page.evaluate(() => [...document.querySelectorAll('.work:not([hidden])')].every((w) => w.dataset.category === 'camas'));
  await page.click('[data-filter="todos"]');
  await page.click('[data-works-more]');
  r.worksExpanded = await works();
  r.worksMoreFocus = await page.evaluate(() => !!document.activeElement?.closest('.work'));

  // Secciones presentes y sin fotos repetidas en toda la página (cada foto aparece una sola vez)
  r.sections = await page.evaluate(() => ['sectores', 'hecho-a-mano', 'trabajos', 'cuero', 'boceto-a-pieza', 'proceso', 'telas', 'cotizar', 'contacto'].filter((id) => !document.getElementById(id)));
  r.sectorCards = await page.evaluate(() => document.querySelectorAll('.sector').length);
  r.duplicatePhotos = await page.evaluate(() => {
    const slugs = [...document.querySelectorAll('main img:not([data-muestra])')].map((i) => (i.getAttribute('src') || '').split('/').pop().split('.')[0]);
    // Proceso repite a propósito cada foto: fija en escritorio y en la tarjeta móvil (una de las dos está oculta).
    const process = new Set([...document.querySelectorAll('#proceso img')].map((i) => (i.getAttribute('src') || '').split('/').pop().split('.')[0]));
    const seen = {};
    for (const s of slugs) seen[s] = (seen[s] || 0) + 1;
    return Object.entries(seen).filter(([s, n]) => n > (process.has(s) ? 2 : 1)).map(([s, n]) => `${s} ×${n}`);
  });

  // Logo «Comodidad hecha diseño» (vector) en header y footer, con el eslogan como texto real
  r.logos = await page.evaluate(() =>
    [...document.querySelectorAll('.logo')].map((l) => `${l.closest('header, footer')?.tagName} · ${l.querySelector('.logo-lema')?.textContent} · ${getComputedStyle(l.querySelector('.logo-lema')).fontSize}`)
  );
  r.faviconSvg = await page.evaluate(() => !!document.querySelector('link[rel="icon"][href="/favicon.svg"]'));

  // Cuero (sección exclusiva): tira «Del corte al capitoné» + «Piezas en cuero»; taller «Manos que saben»
  r.leatherDetails = await page.evaluate(() => document.querySelectorAll('#cuero figure').length);
  r.leatherPieces = await page.evaluate(() => document.querySelectorAll('#cuero [data-lb-group="cuero"]').length);
  r.tallerItems = await page.evaluate(() => document.querySelectorAll('#hecho-a-mano figure').length);
  r.swatchesFromTexture = await page.evaluate(() => [...document.querySelectorAll('[data-muestra]')].every((i) => i.src.includes('-muestra')));

  // Del boceto a la pieza: los dos pares visibles a la vez; cada caja con la proporción de sus fotos
  r.baPairs = await page.evaluate(() =>
    [...document.querySelectorAll('[data-ba]')].map((box) => {
      const img = box.querySelector('img');
      const br = box.getBoundingClientRect();
      return `${box.closest('figure').querySelector('figcaption span').textContent} · caja ${(br.width / br.height).toFixed(3)} = foto ${(img.getAttribute('width') / img.getAttribute('height')).toFixed(3)} · visible ${br.height > 0}`;
    })
  );

  // Cursor «silla» (solo con mouse): html y enlaces
  r.cursorHtml = await page.evaluate(() => getComputedStyle(document.documentElement).cursor.slice(0, 60));
  r.cursorLink = await page.evaluate(() => getComputedStyle(document.querySelector('a[href]')).cursor.slice(0, 60));
  r.cursorInput = await page.evaluate(() => getComputedStyle(document.querySelector('#q-nombre')).cursor);

  // Lightbox: abrir, flechas, Esc, foco devuelto
  const first = page.locator('[data-open-lightbox]').first();
  await first.scrollIntoViewIfNeeded();
  await first.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  r.lightboxOpen = await page.evaluate(() => document.querySelector('[data-lightbox]').open);
  await page.keyboard.press('ArrowRight');
  r.lightboxCounter = await page.locator('[data-lb-counter]').textContent();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  r.lightboxFocusBack = await page.evaluate(() => document.activeElement?.hasAttribute('data-open-lightbox'));
  // Visor por grupo: una pieza en cuero solo recorre las piezas en cuero
  const leatherPiece = page.locator('[data-lb-group="cuero"]').first();
  await leatherPiece.scrollIntoViewIfNeeded();
  await leatherPiece.click();
  await page.waitForTimeout(200);
  r.lightboxLeatherCounter = await page.locator('[data-lb-counter]').textContent();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // Telas: elegir con teclado actualiza imagen y mensaje
  await page.locator('[data-fabric-input]').first().focus();
  await page.keyboard.press('ArrowRight');
  r.fabricMessage = await page.evaluate(() => decodeURIComponent(document.querySelector('[data-fabric-cta]').href.split('text=')[1]));
  r.fabricImage = await page.evaluate(() => document.querySelector('.fabric-img.is-active')?.dataset.fabricImg);

  // Cotizador completo
  await page.evaluate(() => (window.open = (u) => ((window.__wa = u), null)));
  await page.locator('#cotizar').scrollIntoViewIfNeeded();
  await page.click('[data-q-next]');
  r.wizardValidation = await page.locator('[data-q-error]').textContent();
  await page.click('label.choice:has(input[value="Hotel"])');
  await page.waitForTimeout(400);
  await page.click('label.choice:has(input[value="Tapizado en cuero"])');
  await page.waitForTimeout(400);
  await page.fill('#q-nombre', 'Ana');
  await page.fill('#q-empresa', 'Hotel Prueba');
  await page.fill('#q-piezas', '12 sillas');
  await page.click('[data-q-submit]');
  r.wizardMessage = await page.evaluate(() => decodeURIComponent((window.__wa || '').split('text=')[1] || ''));

  // FAQ: uno abierto a la vez
  const faqs = page.locator('details.faq summary');
  await faqs.nth(0).click();
  await faqs.nth(1).click();
  r.faqExclusive = await page.evaluate(() => [...document.querySelectorAll('details.faq')].filter((d) => d.open).length === 1);

  // Proceso móvil: flechas
  if (width < 1024) {
    await page.locator('[data-step-next]').scrollIntoViewIfNeeded();
    await page.click('[data-step-next]');
    await page.waitForTimeout(700);
    r.stepCounter = await page.locator('[data-step-count]').textContent();
    await page.locator('[data-sector-next]').scrollIntoViewIfNeeded();
    await page.click('[data-sector-next]');
    await page.waitForTimeout(700);
    r.sectorCounter = await page.locator('[data-sector-count]').textContent();
  }

  r.consoleErrors = errors;
  await ctx.close();
  return r;
}

results[390] = await run(390);
results[1440] = await run(1440);

// Movimiento reducido: nada se desplaza al entrar
const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const p = await rm.newPage();
await p.goto(url, { waitUntil: 'networkidle' });
results.reducedMotion = await p.evaluate(() => ({
  heroAnimations: document.getAnimations().map((a) => a.animationName),
  revealTransform: getComputedStyle(document.querySelector('[data-reveal]')).transform,
}));
await rm.close();
await browser.close();
console.log(JSON.stringify(results, null, 2));
