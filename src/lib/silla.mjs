// Silla del logo a color, vectorizada a mano sobre brand/2026-10-28/logo-color-referencia.jpeg
// (coordenadas en px de esa imagen). La usan el logo (Logo.astro), el sello y scripts/prepare-media.mjs
// (favicon e imagen OG), para que sea la misma silla en todas partes.
// Respaldo y asiento en Terra de la paleta (el original es naranja); patas y postes solo en línea, sin
// relleno: el fondo se ve a través, así sirve sobre crema, esmeralda o negro.

export const SILLA_VIEWBOX = '112 163 272 393';
export const SILLA_RATIO = 272 / 393;

/**
 * Marcado interno del <svg> de la silla.
 * @param {object} o
 * @param {string} o.id      id único para la máscara (varias sillas en la misma página).
 * @param {string} [o.ink]   color de la línea.
 * @param {string} [o.fill]  relleno de respaldo y asiento.
 * @param {string} [o.shade] relleno del rodillo del respaldo (un punto más oscuro).
 * @param {number} [o.stroke] grosor de línea en unidades del viewBox (5,5 = el del logo).
 */
export function sillaInner({ id, ink = 'currentColor', fill = '#a86639', shade = '#8c5230', stroke = 5.5 }) {
  return `
  <defs>
    <mask id="${id}" maskUnits="userSpaceOnUse" x="112" y="163" width="272" height="393">
      <rect x="112" y="163" width="272" height="393" fill="#fff"/>
      <rect x="121" y="333" width="19" height="183" rx="9.5" fill="#000"/>
      <rect x="262" y="346" width="25" height="203" rx="12.5" fill="#000"/>
    </mask>
  </defs>
  <g fill="none" stroke="${ink}" stroke-width="${stroke}" stroke-linejoin="round">
    <rect x="222" y="200" width="18" height="287" rx="9"/>
    <rect x="343" y="200" width="18" height="311" rx="9"/>
    <rect x="211" y="171" width="162" height="36" rx="18" fill="${fill}"/>
    <circle cx="359" cy="189" r="17" fill="${shade}"/>
    <g mask="url(#${id})">
      <ellipse cx="241" cy="353" rx="100" ry="33" fill="${fill}"/>
      <ellipse cx="241" cy="342" rx="101" ry="31" fill="${fill}"/>
      <line x1="140" y1="386" x2="343" y2="386"/>
    </g>
    <rect x="121" y="333" width="19" height="183" rx="9.5"/>
    <ellipse cx="130.5" cy="337" rx="9.5" ry="4"/>
    <rect x="262" y="346" width="25" height="203" rx="12.5"/>
    <ellipse cx="274.5" cy="350" rx="12.5" ry="5"/>
  </g>`;
}

/** SVG completo (para rasterizar con sharp o usar como archivo). */
export function sillaSvg({ width, height, ...o }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SILLA_VIEWBOX}" width="${width}" height="${height}">${sillaInner(o)}</svg>`;
}
