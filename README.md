# La Tapicería · Landing

Landing de una página (Astro + Tailwind v4) para La Tapicería: mobiliario hecho a mano para hoteles, restaurantes, galerías y casas de arquitecto, con el cuero como especialidad. No tiene backend: todos los CTA abren WhatsApp con un mensaje prellenado.

La dirección visual y el registro del rediseño están en [AUDITORIA.md](AUDITORIA.md). El contexto de producto está en [PRODUCT.md](PRODUCT.md).

## Cómo ejecutar

```bash
npm install
npm run media     # copia y limpia fotos de ./brand -> src/assets (solo si cambias fotos)
npm run og        # regenera public/og-image.jpg con el logo y la foto del hero (después de media)
npm run dev       # http://localhost:4321 (con etiquetas TODO visibles)
npm run build     # genera ./dist (sitio estático, sin TODO)
npm run preview   # sirve ./dist
```

## Dónde editar

| Qué | Archivo |
|---|---|
| Datos del negocio (eslogan, WhatsApp, correo, Instagram, dirección, horario, cobertura, anuncio) | `src/data/site.json` |
| Hero (titular, subtítulo, CTA, fotos, línea de confianza) | `src/data/hero.json` |
| Sectores (hoteles, restaurantes, galerías, casas de arquitecto) | `src/data/sectors.json` |
| Principios «hecho a mano» | `src/data/values.json` |
| Sección Cuero (especialidad) y tira «Del corte al capitoné» | `src/data/leather.json` |
| Pasos del proceso | `src/data/steps.json` |
| Antes / después | `src/data/beforeAfter.json` |
| Telas | `src/data/fabrics.json` |
| Proyectos curados (6 piezas) | `src/data/projects.json` |
| Condiciones del servicio | `src/data/conditions.json` |
| Testimonios (`show: false` los oculta) | `src/data/testimonials.json` |
| Preguntas frecuentes | `src/data/faq.json` |
| Fotos (origen, recortes y estado de derechos) | `scripts/media-map.json` → `npm run media` |
| Colores, escala tipográfica, espaciado y formas | `src/styles/global.css` (`@theme`) |

### Datos que faltan (TODO)

- Las etiquetas **TODO** solo se ven en desarrollo (`npm run dev`). Para verlas en un build de revisión: `PUBLIC_SHOW_TODOS=true npm run build`.
- En producción, lo que no tiene datos reales se oculta sin dejar huecos:
  - barra de anuncio;
  - condiciones;
  - testimonios;
  - datos de contacto vacíos;
  - pares antes/después incompletos.
- Para encontrar todos los pendientes, busca `<Todo` y `"todo"` en `src/`.

**WhatsApp:** pon el número en `site.json → whatsapp` solo con dígitos y el indicativo del país (ej. `573001234567`), y en `whatsappDisplay` la versión legible. Mientras esté vacío, los enlaces usan `wa.me/?text=`, que abre WhatsApp para que el usuario elija el chat. **Es lo primero que falta antes de publicar.**

## Fotos

**Regla: ninguna foto se recorta.** Cada foto se muestra completa y en su proporción con `src/components/ui/Foto.astro`:
- por defecto, en su proporción natural;
- con `box`, dentro de una caja fija (galerías y fundidos), ajustada entera.

No uses `object-cover` ni marcos de proporción fija para fotos. `npm run audit:scan` lo verifica: `imagesCropped` debe quedar vacío.

- `npm run media` lee `scripts/media-map.json` y hace tres cosas:
  - recorta **solo** la interfaz (contadores «2/13», íconos y barras de Instagram);
  - genera los recortes de textura de las muestras de tela (`muestras` en el mapa);
  - crea el favicon con la silla del logo y el cursor de la silla (`public/cursor/`).
- Las fotos nuevas que se usan están en `brand/2026-10-28/`. La entrega en bruto (`brand/Nuevo contenido 28-10/`: zip, catálogo PDF y descartes) no se sube al repositorio.
- Las fotos de WhatsApp miden como máximo unos 1170 px. Ninguna se muestra a más de unos 550 px CSS, para que se vean nítidas en pantallas 2x.
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

Cada foto en `scripts/media-map.json` tiene un campo `origen` (`propia`, `por-confirmar` o `riesgo-alto`) y, si aparece en el catálogo del cliente, un campo `catalogo`. El inventario y las prioridades están en `AUDITORIA.md` §8. **Antes de publicar, reemplazar las 3 marcadas `riesgo-alto`, empezando por `cuero-oliva`.**

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
