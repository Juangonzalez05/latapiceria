# La Tapicería · Landing

Landing de una página (Astro + Tailwind v4) para La Tapicería: mobiliario hecho a mano, tapizado en tela y en cuero (la especialidad), para hoteles, restaurantes, galerías y casas de arquitecto. No tiene backend: todos los CTA abren WhatsApp con un mensaje prellenado.

La dirección visual y el registro del rediseño están en [AUDITORIA.md](AUDITORIA.md). El contexto de producto está en [PRODUCT.md](PRODUCT.md).

## Cómo ejecutar

```bash
npm install
npm run media     # copia y limpia fotos de ./brand -> src/assets (solo si cambias fotos)
npm run og        # regenera public/og-image.jpg con el logo y la foto `og` del mapa, vertical (después de media)
npm run dev       # http://localhost:4321 (con etiquetas TODO visibles)
npm run build     # genera ./dist (sitio estático, sin TODO)
npm run preview   # sirve ./dist
```

## Dónde editar

| Qué | Archivo |
|---|---|
| Datos del negocio (eslogan, WhatsApp, correo, Instagram, dirección, horario, cobertura, anuncio) | `src/data/site.json` |
| Hero (foto del banner, titular, subtítulo, CTA, línea de confianza) | `src/data/hero.json` |
| Sectores (hoteles, restaurantes, galerías, casas de arquitecto) | `src/data/sectors.json` |
| Principios «hecho a mano» | `src/data/values.json` |
| Taller: foto y tira «Manos que saben» (oficio en tela y madera) | `src/data/taller.json` |
| Manifiesto (pausa de marca, texto del catálogo) | `src/data/manifesto.json` |
| Sección Cuero (exclusiva, la especialidad): pasos, «Del corte al capitoné» y «Piezas en cuero» | `src/data/leather.json` |
| Pasos del proceso | `src/data/steps.json` |
| Del boceto a la pieza (los dos pares, visibles a la vez) | `src/data/beforeAfter.json` |
| Telas | `src/data/fabrics.json` |
| Trabajos en tela: destacadas (`featured`) y galería con filtros y «Ver más» (`category`: sofas, sillones, camas; `tier`: premium, taller) | `src/data/projects.json` |
| Condiciones del servicio | `src/data/conditions.json` |
| Testimonios (`show: false` los oculta) | `src/data/testimonials.json` |
| Preguntas frecuentes | `src/data/faq.json` |
| Fotos (origen, recortes y estado de derechos) | `scripts/media-map.json` → `npm run media` |
| Colores, escala tipográfica, espaciado y formas | `src/styles/global.css` (`@theme`) |

### Datos del negocio

- Los datos de la cliente ya están en la página y no queda ningún TODO. Se reparten así:
  - `site.json`: dirección en Laureles, Medellín, cobertura en el área metropolitana y barra de anuncio;
  - `conditions.json`, `steps.json` y `faq.json`: visitas técnicas, tiempos, anticipo y pagos, y garantía;
  - `Fabrics.astro`: la ficha de información de las telas.
- Lo que sigue vacío no se muestra, no deja hueco y se omite en los datos estructurados: **WhatsApp, correo, Instagram y horario** (`site.json`).
- Los testimonios esperan en `testimonials.json` con `show: false` hasta que haya reales. No se inventan.
- El componente `<Todo>` sigue disponible para marcar pendientes nuevos. Solo se ve en desarrollo o con `PUBLIC_SHOW_TODOS=true npm run build`.
- La URL absoluta (canonical y Open Graph) la entrega Vercel al compilar: `VERCEL_PROJECT_PRODUCTION_URL` en `astro.config.mjs`.

**WhatsApp:** pon el número en `site.json → whatsapp` solo con dígitos y el indicativo del país (ej. `573001234567`), y en `whatsappDisplay` la versión legible. Mientras esté vacío, los enlaces usan `wa.me/?text=`, que abre WhatsApp para que el usuario elija el chat. **Es lo primero que falta antes de publicar.**

## Fotos

**Regla: ninguna foto se recorta.** Cada foto se muestra completa y en su proporción con `src/components/ui/Foto.astro`:
- por defecto, en su proporción natural;
- con `box`, dentro de una caja fija (galerías y fundidos), ajustada entera.

**Dirección de arte:** el taller va en blanco y negro (filtro CSS en «Manos que saben», color al pasar el mouse) y las piezas terminadas siempre a color. En la galería de trabajos, `tier: premium` va primero y `tier: taller` (fotos en la bodega) al final; `featured` son las 3 destacadas de arriba.

No uses `object-cover` ni marcos de proporción fija para fotos. `npm run audit:scan` lo verifica: `imagesCropped` debe quedar vacío.

**Única excepción: el banner del hero** (`data-crop-ok` en `Hero.astro`). En el celular la foto va completa, de borde a borde. Desde 640 px el banner tiene proporción fija y la foto se ajusta con `object-position: 50% 80%`: solo pierde pared arriba y piso abajo, y el mueble queda completo. El escaneo no lo cuenta; se revisa en las capturas (`npm run shoot -- <dir> <url> 360,390,768,1024,1440,1920 --hero-only`). Si cambias la foto del hero (`hero.json → image`), vuelve a revisar esas capturas. La foto debe ser apaisada y tener el mueble centrado.

- `npm run media` lee `scripts/media-map.json` y hace tres cosas:
  - recorta **solo** la interfaz (contadores «2/13», íconos y barras de Instagram);
  - genera los recortes de textura de las muestras de tela (`muestras` en el mapa);
  - crea el favicon con la silla del logo y el cursor de la silla (`public/cursor/`).
- Las fotos nuevas que se usan están en `brand/2026-10-28/`. La entrega en bruto (`brand/Nuevo contenido 28-10/`: zip, catálogo PDF y descartes) no se sube al repositorio.
- Las fotos de WhatsApp miden como máximo unos 1170 px. Ninguna se muestra a más de unos 550 px CSS, para que se vean nítidas en pantallas 2x.
  - Excepción: el banner del hero. En el celular es nítido (390 px × 3 = 1170). En escritorio ocupa el ancho del contenido (máx. 1224 px CSS, a 1:1 en pantallas 1x), y `audit:scan` lo marca como blando a 2x desde 768 px. Para que también sea nítido en pantallas retina hace falta un original de unos 2500 px de ancho.
- `npm run contact-sheet -- <salida> [carpeta]` genera hojas de contacto numeradas (por defecto, de `./brand`).
- `npm run extract-pdf -- <archivo.pdf> <salida>` extrae las imágenes de un PDF, como el catálogo del cliente.

## Logo «Comodidad hecha diseño»

El logo es vectorial y su texto es texto real:
- `src/components/ui/Logo.astro`: nombre y eslogan en Literata;
- `src/lib/silla.mjs`: la silla, dibujada sobre la referencia a color `brand/2026-10-28/logo-color-referencia.jpeg`, con respaldo y asiento en Terra.

El tamaño se controla con `--logo-size`. No lo bajes de 1,625rem, para que el eslogan no quede por debajo de 13 px. El eslogan sale de `site.json → tagline`.

## Cursor de la silla

Con mouse, el cursor es la silla del logo: oscura con borde claro en la página y en terra sobre enlaces y botones. En los campos de texto se mantiene el cursor de escribir, y en el slider antes/después el de arrastre. En pantallas táctiles y en modo de alto contraste se usa el cursor del sistema. Las imágenes salen de `npm run media` y las reglas están al final de `src/styles/global.css`.

## Derechos de las fotos

Cada foto en `scripts/media-map.json` tiene un campo `origen` (`propia`, `por-confirmar` o `riesgo-alto`) y, si aparece en el catálogo del cliente, un campo `catalogo`. El inventario y las prioridades están en `AUDITORIA.md` §8. **Antes de publicar, revisar las 9 marcadas `riesgo-alto`, empezando por el par del comedor.**

## QA y capturas

Usan `playwright-core` con el Edge instalado en Windows. No descargan ningún navegador.

```bash
npm run preview -- --port 4400                                      # en otra terminal
npm run shoot -- .audit/despues http://127.0.0.1:4400/ 390,768,1440 # hero 2x + página completa
npm run audit:scan -- http://127.0.0.1:4400/ 390,1440               # contraste, texto pequeño, objetivos táctiles, fotos recortadas, nitidez 2x
npm run qa -- http://127.0.0.1:4400/                                # recorre todas las interacciones
```

## Estructura

```
src/components/      una sección por componente (Hero, Sectors, Intro, Leather, Projects, Process, BeforeAfter, Fabrics, …)
src/components/ui/   piezas del sistema: Logo, Silla, Foto (fotos sin recorte), SectionHeader, Pespunte (motivo del logo), ArchFrame (arco de fondo), SelloHechoAMano
src/data/            contenido editable en JSON
src/lib/             whatsapp.ts (enlaces), photos.ts (fotos por slug), flags.ts (TODO solo en desarrollo), silla.mjs (silla del logo)
src/scripts/         reveal.ts (revelado al scroll)
scripts/             pipeline de medios, imagen OG, extracción de PDF, capturas, escaneo y QA
```
