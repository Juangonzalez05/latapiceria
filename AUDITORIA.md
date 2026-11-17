# Auditoría visual · La Tapicería

> **Método.** La crítica y la auditoría siguen las guías de Impeccable (`.claude/skills/impeccable/reference/critique.md`, `audit.md`, `craft-floor.md`, `mode-persuade.md`), aplicadas a mano. No ejecuté el lanzador de Impeccable porque descarga y ejecuta un binario nativo desde GitHub, así que no hay detector automático.
>
> En su lugar, `scripts/audit-scan.mjs` mide contraste, tamaño de texto, objetivos táctiles, encabezados e imágenes sobre el build renderizado en Edge.
>
> Las reglas de Vercel Web Interface Guidelines (`web-design-guidelines`) se revisaron contra el código.
>
> **Capturas «antes»** (390 / 768 / 1440 px, hero y página completa): `.audit/antes/`.
>
> ⚠️ DEGRADED: single-context. La crítica no usó dos subagentes independientes, como pide Impeccable, porque no estaban autorizados en esta sesión.

---

## 1. Resumen

| Medición | 390 px | 1440 px |
|---|---|---|
| Alto de página | 17 104 px | 16 306 px |
| Etiquetas TODO visibles | 28 | 28 |
| Textos de menos de 13 px | 49 | 50 |
| Objetivos táctiles de menos de 44 px (sin contar enlaces en línea) | 10 | 10 |
| Contraste < AA (fondos sólidos medibles) | 2 (eyebrow «Testimonios» y su TODO, 4,24:1) | 2 |
| Foto del hero en pantalla | ancho completo, sofá tapado | 864 px CSS con 1081 px de origen (blanda en 2x) |

### Puntuación heurística (Nielsen, modo *Persuade*)

| # | Heurística | Nota | Hallazgo clave |
|---|---|---|---|
| 1 | Visibilidad del estado | 3 | El cotizador y el slider informan bien; el header no marca la sección activa |
| 2 | Lenguaje del usuario | 3 | Español claro y cálido; «Aprobación» y «Propuesta» son abstractos sin foto que los explique |
| 3 | Control y libertad | 3 | Hay «Atrás» en el cotizador y Esc en el menú y el lightbox |
| 4 | Consistencia | 2 | Todas las secciones usan el mismo encabezado; los TODO rompen la consistencia visual |
| 5 | Prevención de errores | 3 | El cotizador valida antes de avanzar |
| 6 | Reconocer antes que recordar | 3 | Filtros y telas visibles |
| 7 | Flexibilidad | n/a | Landing de una sola acción |
| 8 | Estética y minimalismo | 2 | 28 TODO, eyebrows en todas las secciones y 16 000 px de página plana en beige |
| 9 | Recuperación de errores | 3 | Mensajes claros en el cotizador |
| 10 | Ayuda | n/a | Landing (la FAQ cubre las dudas) |
| **Total** | | **22/32 (69 %)** | **Aceptable**, en el límite de «Bueno» |

### Salud técnica (auditoría)

| # | Dimensión | Nota | Hallazgo clave |
|---|---|---|---|
| 1 | Accesibilidad | 3 | AA casi completo; objetivos táctiles de 8 a 38 px y textos de 12 px con tracking alto |
| 2 | Rendimiento | 3 | Imágenes responsivas y lazy; el hero escala la foto por encima de su resolución, `will-change` permanente y fuente del H1 sin precarga |
| 3 | Theming | 3 | Tokens de marca en `@theme`; varios `rgb()` sueltos en componentes y sin `color-scheme` |
| 4 | Responsive | 3 | Sin scroll horizontal; en móvil el hero tapa el producto y la barra de anuncio ocupa 3 líneas |
| 5 | Integridad del diseño | 2 | Patrón de plantilla (eyebrow + H2 + párrafo × 12), textura `feTurbulence` y TODO visibles en producción |
| **Total** | | **14/20** | **Bueno**, con integridad visual débil |

### Veredicto de especificidad

**No pasa.** La paleta y el logo son propios, pero la estructura se puede intercambiar con cualquier landing: el mismo encabezado (raya + eyebrow en mayúsculas + H2 serif + párrafo a la derecha) aparece 12 veces, las superficies con `rounded-sm` no tienen lenguaje de formas y los fondos crema / crema-50 / champaña se funden en un solo bloque beige.

El logo trae dos motivos de marca muy útiles (el respaldo redondeado de la silla y el pespunte con aguja) que la página no usa en ningún lado. La impresión general es «plantilla editorial cálida», no «estudio artesanal».

---

## 2. Hallazgos priorizados

### P0 · Bloqueantes

1. **Hero · el producto no se ve en móvil y el bloque partido parece plantilla.**
   - **Problema:** en 390 px el sofá queda bajo los velos negros, el titular y los botones. En 1440 px, el bloque esmeralda liso del 40 % y el degradado sobre los árboles dejan una franja turbia.
   - **Por qué importa:** es lo primero que el cliente rechazó, y en el primer segundo no se entiende qué se vende.
   - **Propuesta:** concepto A, editorial enmarcado (ver §4).
2. **Hero · foto blanda.**
   - **Problema:** 1081 px de origen se muestran a 864 px CSS, más zoom 1.08 y `scale(1.08)` del parallax. En 2x pide 1728 px.
   - **Por qué importa:** en un negocio de oficio, una foto pixelada transmite descuido.
   - **Propuesta:** mostrarla como máximo a unos 540 px CSS, sin escalados.
3. **Producción · TODOs visibles (28) y secciones vacías publicadas.**
   - **Problema:** las condiciones son 4 tarjetas vacías, los testimonios tienen texto provisional y en contacto todo es TODO.
   - **Por qué importa:** el visitante lee «página en construcción» y desconfía.
   - **Propuesta:** flag `PUBLIC_SHOW_TODOS` (activo solo en desarrollo). Las secciones sin datos reales se ocultan o se degradan con elegancia.
4. **WhatsApp sin número** *(dato, no diseño).*
   - **Problema:** con `site.whatsapp` vacío, todos los CTA abren `wa.me/?text=` y el visitante tiene que elegir a quién escribir.
   - **Por qué importa:** rompe la única conversión.
   - **Propuesta:** el cliente debe darlo antes de lanzar. No es un cambio de diseño.

### P1 · Mayores

5. **Monotonía estructural (todas las secciones).**
   - **Problema:** se repite el mismo patrón de encabezado y el eyebrow de 12 px en mayúsculas con 0,22 em de tracking.
   - **Por qué importa:** el ojo deja de distinguir secciones, y el craft floor de Impeccable prohíbe el eyebrow sobre titulares.
   - **Propuesta:** quitar los eyebrows y crear `SectionHeader` con 3 variantes (§3).
6. **Fondos sin ritmo.**
   - **Problema:** crema-50 → crema → crema-50 → champaña-200 apenas se distinguen. El terra y el sepia casi no aparecen.
   - **Propuesta:** secuencia claro / material / profundo / acento (§3).
7. **Proceso demasiado largo.**
   - **Problema:** 6 pasos en zigzag con fotos 5:6 suman unos 4 000 px; en móvil, unos 4 500 px.
   - **Propuesta:** foto sticky que cambia con el paso activo y lista de pasos compacta con el hilo como línea de progreso. En móvil, tarjetas con foto 4:3.
8. **Legibilidad tipográfica.**
   - **Problema:** 49 textos de menos de 13 px (eyebrows, etiquetas de categoría, TODO). Los H3 de las tarjetas de valores (20 px) se ven débiles frente a los H2 (32–58 px).
   - **Propuesta:** escala de §3 con mínimo de 13 px para rótulos y 15 px para texto secundario.
9. **Objetivos táctiles.**
   - **Problema:** puntos de testimonios de 8 × 8 px, filtros y pestañas de 38 px de alto y cerrar anuncio de 36 px.
   - **Propuesta:** 44 px mínimo; los puntos se reemplazan por contador o por un área táctil ampliada.
10. **Proyectos dispares.**
    - **Problema:** hay lámina metálica de taller junto a ambientes de hogar, y la tarjeta vacía de «Restauración» se ve en la página.
    - **Propuesta:** grilla editorial de tamaños mixtos con marco uniforme (fondo crema y radio de 14 px), sin carrusel en escritorio. El filtro «Restauración» solo aparece si hay fotos.
11. **Cierre oscuro y vacío.**
    - **Problema:** la foto queda al 55 % de opacidad bajo un velo del 90 % (casi negra) y los datos son una fila de TODO.
    - **Propuesta:** cierre en campo terra-700 (acento cálido, AA con texto crema 5,1:1), foto enmarcada en arco y solo los datos reales.
12. **Barra de anuncio en móvil.**
    - **Problema:** son 3 líneas por el TODO y empujan el hero.
    - **Propuesta:** no se renderiza si `site.announcement` está vacío. En desarrollo se muestra en una línea.

### P2 · Menores

13. **Movimiento disperso.**
    - **Problema:** palabras que suben, zoom, 3 parallax (`Hero.astro:15`, `Intro.astro:13`, `ClosingCta.astro:12`), máscaras, riel y fade en cada bloque.
    - **Propuesta:** un solo momento de entrada en el hero, revelados de opacidad cortos y el riel del proceso. Fuera el parallax.
14. **Textura con `feTurbulence`** (`global.css:257`, clase `.grain`).
    - **Problema:** se lee como efecto genérico.
    - **Propuesta:** eliminarla.
15. **`will-change` permanente** (`Hero.astro:15`, `Process.astro:88`).
    - **Propuesta:** quitarlo o activarlo solo durante la interacción.
16. **`prefers-reduced-motion` como apagado global a 1 ms** (`global.css:269`).
    - **Problema:** también anula transiciones de estado útiles.
    - **Propuesta:** alternativa intencional que conserve los cambios de opacidad cortos.
17. **Faltan `color-scheme`, `env(safe-area-inset-bottom)` y `overscroll-behavior`.**
    - **Dónde:** `color-scheme` en `:root`; `safe-area-inset-bottom` en el botón flotante (`WhatsAppFloat.astro:10`); `overscroll-behavior: contain` en el lightbox (`Lightbox.astro:5`) y el menú móvil.
18. **Fuente del H1 sin precarga.**
    - **Propuesta:** `preload` del woff2 latino de Literata para el LCP de texto.
19. **Logo del header ilegible.**
    - **Problema:** el tagline «Diseño y producción» mide unos 5 px de alto.
    - **Propuesta:** versión compacta sin tagline en el header (ya generada: `logo-compact-*.png`) y logo completo en el footer.
20. **Indicador «Desliza»** sobre la costura bloque/foto, cortado.
    - **Propuesta:** eliminarlo; el nuevo hero deja ver la siguiente sección.

### Lo que funciona (se conserva)

- Paleta de marca coherente y CTAs claros en esmeralda (más de 9:1).
- Cotizador de 3 pasos bien resuelto: validación, progreso, mensaje armado y avance solo con puntero.
- Par boceto → comedor alineado al píxel: es la mejor prueba de oficio de la página.
- Accesibilidad de base sólida:
  - skip-link;
  - trampa de foco y Esc en el menú;
  - tablist en antes/después;
  - slider con teclado;
  - `<dialog>` en el lightbox;
  - JSON-LD.

### Personas

- **Casey (móvil, con prisa):**
  - en el primer pantallazo no ve el producto;
  - la barra de anuncio ocupa 3 líneas;
  - la página mide 17 000 px;
  - los puntos de testimonios son imposibles de tocar.
- **Jordan (primera vez):**
  - los TODO le hacen pensar que la página no está terminada;
  - no sabe si atienden en su ciudad;
  - las condiciones están vacías, así que no hay nada que lo tranquilice antes de escribir.
- **Riley (prueba los bordes):**
  - el CTA abre WhatsApp sin destinatario;
  - el filtro «Restauración» muestra una tarjeta vacía;
  - los testimonios son texto provisional.

---

## 3. Dirección de diseño y sistema

### Dirección

**«Taller a la vista: pespunte y arco.»** La página debe sentirse como entrar al estudio de un tapicero con criterio: fotos enmarcadas como piezas, nunca estiradas; mucho aire; y un solo hilo que recorre el sitio.

- **Formas:** el arco del respaldo de la silla enmarca las imágenes clave (hero, cierre). El pespunte del logo une pasos y separa bloques.
- **Color:** a escala de página.
  - Crema y champaña son el «papel» y el «material».
  - Esmeralda ocupa campos completos en los momentos de profundidad (proceso, antes/después, cotizador).
  - Terra queda para el cierre y para detalles pequeños: números y aguja.
- **Referencias de tono:** sobriedad editorial de Marzo Atelier, y cómo Frama o Carl Hansen & Søn cuentan el oficio con fotos de taller y de material a escala humana. Son referencias de método, no de estética que se copie.
- **Tono:** cálido y seguro, sin adornos de lujo ni promesas.

### Escala tipográfica (fluida)

| Rol | Fuente | Tamaño | Interlineado / tracking |
|---|---|---|---|
| Display (solo hero) | Literata 400 | `clamp(2.5rem, 2rem + 3.4vw, 4.6rem)` | 1.02 / −0,025 em |
| H2 | Literata 400 | `clamp(2rem, 1.55rem + 2.1vw, 3.4rem)` | 1.06 / −0,02 em |
| H3 | Literata 450 | `clamp(1.35rem, 1.2rem + 0.6vw, 1.7rem)` | 1.2 |
| Lead | Figtree 400 | `clamp(1.1rem, 1.04rem + 0.3vw, 1.25rem)` | 1.6 |
| Cuerpo | Figtree 400 | 1.0625rem (17 px) | 1.65; medida máxima de 68 ch |
| Pequeño | Figtree 500 | 0.9375rem (15 px) | 1.5 |
| Rótulo | Figtree 600 | 0.8125rem (13 px), tracking 0,06 em | Solo en metadatos (categoría, paso), nunca sobre un H2 |

### Espaciado vertical

- **Sección:** `--space-section: clamp(4.5rem, 3rem + 6vw, 8.5rem)`.
- **Sección compacta:** `--space-section-sm: clamp(3.5rem, 2.5rem + 4vw, 6rem)`.
- **Del encabezado al contenido:** `clamp(2.5rem, 2rem + 2vw, 4rem)`.
- **Encabezados:** más aire arriba que abajo.

### Secuencia de fondos (y orden propuesto de secciones)

| # | Sección | Fondo | Rol |
|---|---|---|---|
| 1 | Hero | crema `#EAEAE5` | claro |
| 2 | Servicios (dos caminos) | crema-50 | claro |
| 3 | Proyectos | crema | claro con marcos |
| 4 | Oficio (intro) | esmeralda | profundo, banda corta |
| 5 | Proceso | crema-50 | claro |
| 6 | Antes y después | esmeralda-900 | profundo |
| 7 | Telas | champaña-200 | material |
| 8 | Cotizador | esmeralda | profundo |
| 9 | Condiciones + FAQ | crema-50 | claro |
| 10 | Cierre | terra-700 | acento |
| 11 | Footer | esmeralda-900 | profundo |

**Cambio de orden propuesto:** Proyectos sube justo después de Servicios para que la prueba llegue antes que el proceso, y la intro pasa a ser una banda corta de oficio. El recorrido queda así: oferta → prueba → cómo trabajamos → cotizar. Testimonios queda oculto hasta tener reales.

### Encabezados de sección (`SectionHeader`)

- **`split`**: H2 grande a la izquierda y lead alineado abajo a la derecha. Para Servicios, Proyectos y Antes/después.
- **`center`**: H2 centrado con un pespunte corto debajo. Para Proceso y Cotizador.
- **`aside`**: H2 y lead en una columna estrecha y fija al lado del contenido. Para Telas y Condiciones/FAQ.

Ninguno lleva eyebrow.

### Botones y superficies

- **Primario:** píldora esmeralda con texto crema.
- **Sobre oscuro:** píldora crema.
- **Secundario:** enlace con subrayado animado y flecha (no un segundo botón con borde).
- **Radios:**
  - píldoras solo en controles pequeños;
  - 14 px en tarjetas y marcos de foto;
  - arco (semicírculo) en las imágenes clave.
- **Sombra:** una sola, suave y con desplazamiento, solo para piezas superpuestas.

### Motivos

- **Pespunte** (`src/components/ui/Pespunte.astro`): hilo punteado + onda + ojo + aguja, en sepia o terra. Se usa como divisor, como línea de progreso del proceso y como ornamento del cierre, y nunca más de una vez por pantalla.
- **Arco** (`src/components/ui/ArchFrame.astro`): para el hero y el cierre.

### Movimiento

- Un solo momento de entrada en el hero: el arco se descubre y el texto aparece.
- Revelado de opacidad corto por sección, solo en el encabezado.
- Riel del proceso.
- Sin parallax ni palabras que suben.
- `prefers-reduced-motion`: sin desplazamientos y con cambios de opacidad instantáneos.

---

## 4. Conceptos de hero (`/lab/hero`, `noindex`)

Capturas a 2x en `.audit/lab/` (`concepto-{a,b,c}-{390,1440}.png`). Lámina comparativa: `.audit/lab/lamina-heros.png`.

| | A · Editorial enmarcado | B · Mosaico de oficio | C · Inmersivo corregido |
|---|---|---|---|
| Idea | Titular en 3 líneas, foto vertical en arco y manos tapizando superpuestas | Titular arriba y tira taller → tela → tapizado → en casa unida por el hilo | Foto a sangre, sofá centrado y texto en los árboles |
| Sofá visible en móvil | Sí, arriba, dentro del arco | Sí, foto grande del mosaico | Sí, pero el texto pasa sobre follaje claro |
| Nitidez en 2x | ✅ arco de 464 px CSS con origen de 1081 px | ✅ fotos de 290 px CSS | ❌ estira 1081 px a 1440 px (ver `nitidez-a-vs-c.png`) |
| Riesgo | Poco dramático si el resto de la página no acompaña | Cuatro fotos compiten; el producto final pierde protagonismo | Se descarta por nitidez; además repite el «hero de foto con velo» genérico |

**Recomendación: A.** Es el único concepto que cumple las tres condiciones: producto visible siempre, foto nítida y forma propia de la marca (el arco). B queda como alternativa válida. Sus ideas se reutilizan en Proyectos y en el Proceso.

### Propuestas de copy (no aplicadas, a confirmar)

- Titular actual: «Tu mueble, como siempre lo imaginaste». Se mantiene. Alternativas:
  - «Muebles con oficio, a la medida de tu casa».
  - «Le damos otra vida a tus muebles».
- Línea de confianza del hero: «Diseño y producción propia · Retapizado · Restauración · A la medida · Atención por WhatsApp». Confirmar «producción propia» y agregar ciudad y cobertura cuando existan en `site.json`.

---

## 5. Revisión contra Web Interface Guidelines (Vercel)

```
src/styles/global.css:257 - textura feTurbulence decorativa (.grain): eliminar
src/styles/global.css:269 - reduced-motion anula todas las transiciones (1ms); usar alternativa intencional
src/styles/global.css - falta color-scheme: light en :root
src/components/Hero.astro:15 - will-change permanente + scale(1.08) sobre foto de baja resolución
src/components/Process.astro:88 - will-change permanente en el riel
src/components/WhatsAppFloat.astro:10 - botón fijo sin env(safe-area-inset-bottom)
src/components/Lightbox.astro:5 - dialog sin overscroll-behavior: contain
src/components/Testimonials.astro:39 - puntos de 8×8 px (objetivo táctil < 44 px)
src/components/Projects.astro:33 - filtros de 38 px de alto
src/components/BeforeAfter.astro:30 - pestañas de 38 px de alto
src/components/AnnouncementBar.astro:21 - botón cerrar de 36 px
src/layouts/Base.astro - sin preload de la fuente del H1 (LCP de texto)
src/components/Header.astro - el nombre de la marca debería llevar translate="no"
```

✓ Pasan: `alt` en todas las imágenes de contenido; `width`/`height` (Astro); `touch-action` en el slider; `autocomplete` en el cotizador; foco visible; enlaces reales; comillas tipográficas «».

---

## 6. Decisión tomada

Concepto **A** y la dirección de §3. El cliente pidió continuar sin pausas en los puntos de control, así que elegí el concepto que el brief marca como recomendado. B y C quedan disponibles en `/lab/hero`.

---

## 7. Resultado del rediseño

Capturas finales en `.audit/despues/` (390 / 768 / 1440 px). Comparativas lado a lado en `.audit/comparativa/` (`hero-1440.png`, `hero-390.png`, `pagina-1440.png`, `pagina-390.png`). Hero en 6 anchos (360 → 1920) en `.audit/heros/heros-6-anchos.png`.

### Métricas

| Medición | Antes | Después |
|---|---|---|
| Alto de página 1440 / 390 | 16 306 / 17 104 px | 11 122 / 11 277 px (−32 %) |
| TODO visibles en producción | 28 | 0 (22 en desarrollo) |
| Textos de menos de 13 px | 49–50 | 0 |
| Contraste < AA (fondos sólidos) | 2 | 0 |
| Objetivos táctiles de menos de 24 px | 3 (puntos de 8 px) | 0 (y los de menos de 44 px solo quedan en enlaces del footer de escritorio) |
| Foto del hero | 864 px CSS de un origen de 1081 px (blanda en 2x) | 464 px CSS (nítida en 2x) |
| Lighthouse móvil (Rend. / Acces. / Buenas prácticas / SEO) | no medido | **91–93 / 100 / 100 / 100** (LCP 3,1 s, CLS 0, TBT 0 ms) |
| Errores de consola | — | 0 (`scripts/qa.mjs`) |

### Qué cambió

- **Hero (concepto A):**
  - fondo crema, titular en 3 líneas con la última en itálica esmeralda;
  - foto vertical en arco (eco del respaldo del logo) y detalle de manos tapizando;
  - CTA principal y secundario en forma de enlace, y línea de confianza con pespunte.
  - El header es legible desde el primer pixel, usa el logo compacto sin tagline ilegible y marca la sección activa.
  - Ya no hay eyebrow, «Desliza», bloque verde plano ni parallax.
- **Sistema** (`global.css`, `src/components/ui/`):
  - escala tipográfica fluida (`text-display`… `text-label`);
  - ritmo vertical (`py-section`, `mb-head`);
  - radios de 14 px y arco;
  - una sola sombra;
  - `SectionHeader` en variantes `split`, `center` y `aside`, sin eyebrows;
  - motivo `Pespunte` y `ArchFrame`.
- **Secuencia de fondos:** crema → crema-50 → crema → **esmeralda** (oficio) → crema-50 (proceso) → **esmeralda-900** (antes/después) → **champaña** (telas) → **esmeralda** (cotizador) → crema-50 (FAQ) → **terra** (cierre) → esmeralda-900 (footer).
- **Orden de secciones:** Proyectos sube justo después de Servicios, para que la prueba llegue antes que el proceso. La intro pasa a ser una banda corta de oficio.
- **Servicios:** tarjetas horizontales con la foto enmarcada (≤ 300 px CSS) y el contenido siempre visible (antes dependía del hover).
- **Proyectos:** grilla editorial de tamaños mixtos (5-4-3 / 3-4-5 columnas) con 9 piezas y «Ver los 15 proyectos» en escritorio, y carrusel en móvil. El filtro «Restauración» solo aparece si hay fotos.
- **Proceso:** de unos 4 000 px a unos 1 100 px. Foto sticky que cambia con el paso activo y un hilo punteado que se llena en terra. En móvil son tarjetas deslizables con contador.
- **Antes y después:** slider ≤ 544 px CSS junto al texto. Las pestañas solo aparecen si hay más de un par real, y el arrastre ya no queda pegado si se pierde el puntero.
- **Telas:** campo champaña, 6 muestras en una fila (también en 390 px) y pespunte como divisor.
- **Cotizador:** tarjeta clara con sombra suave, campos de 10 px de radio y placeholder AA.
- **Condiciones y Testimonios:** se ocultan en producción mientras no haya datos reales (`testimonials.json → show: false`).
- **Cierre:** campo terra con foto en arco y solo los datos de contacto reales.
- **Footer:** logo completo con tagline, navegación y CTA.
- **Movimiento:**
  - una sola entrada en el hero, solo con transformación, para no retrasar el LCP;
  - revelados cortos;
  - hilo del proceso.
  - Sin parallax ni palabras que suben.
  - `prefers-reduced-motion` tiene ahora una alternativa intencional (fundidos breves, sin desplazamientos) en lugar del apagado global.
- **Técnico:**
  - `color-scheme`, `scrollbar-color` y `caret-color` de la paleta;
  - `viewport-fit=cover` y `safe-area-inset` en el botón flotante;
  - `overscroll-behavior` en el lightbox y el menú;
  - `translate="no"` en la marca;
  - precarga de la fuente del titular.
  - Eliminados la textura `feTurbulence`, `will-change` permanente y `parallax.ts`.
  - El flag `PUBLIC_SHOW_TODOS` muestra los TODO en builds de revisión.

### Intercambio consciente

Para pasar de 83 a más de 90 en rendimiento móvil, Literata pasó de la variante con eje óptico (`opsz`, 110 KB por estilo) a la de solo peso (`wght`, 52 KB). El titular queda un punto más firme, más cercano al serif del logo. Si se prefiere el dibujo óptico de display, basta con volver a `opsz.css` en `global.css` (Lighthouse vuelve a unos 83).

### Pendiente (depende del cliente)

El 17-11 la cliente entregó estos datos, que ya están en la página (no queda ningún TODO):
- dirección: Carrera 79 No. 45 E-72, Laureles, Medellín;
- cobertura: Medellín y el área metropolitana;
- visitas técnicas;
- tiempos: unos 25 días de fabricación;
- anticipo: 50 % y 50 %;
- garantía: 5 años en estructura y 2 en costuras;
- la ficha de información de telas.

Sigue pendiente:

1. **Número de WhatsApp** (P0: todos los botones lo usan; sin él abren WhatsApp para elegir el chat).
2. Correo, Instagram y horario.
3. Testimonios reales.
4. Fotos de restauración y pares antes/después de retapizado.
5. Dominio propio, si lo habrá (mientras tanto se usa la URL de Vercel).

---

## 8. Inventario de derechos de las fotos (preparación)

Cada foto de `scripts/media-map.json` tiene un campo `origen`. Si aparece en el catálogo del cliente (`Catalogo_Fabrica_La_Tapiceria_2026.pdf`), también tiene un campo `catalogo` con la página y el nombre que le da. Que una foto esté en el catálogo indica que el cliente la presenta como suya, pero **no** confirma la autoría. Este inventario no reemplaza ninguna foto: deja lista la revisión de derechos que se hará más adelante.

| Estado | Fotos en uso | Motivo |
|---|---|---|
| **riesgo-alto** | `comedor-boceto`, `comedor-resultado` (Del boceto a la pieza) | La captura original muestra la marca «MUEBLES DE PUEBLITO» y el contador «2/13». El cliente pidió explícitamente este par |
| **riesgo-alto** | `sala-modulos`, `chaise-sala` (Trabajos) | Aspecto de render o de foto de catálogo |
| **riesgo-alto** | `sillon-curvo` (sector Galerías), `poltrona` (Trabajos) | Aspecto de render o de foto de catálogo (son las antiguas `butaca-curva` y `silla-madera`) |
| **riesgo-alto** | `cuero-chesterfield-puf`, `cuero-tejido` (Piezas en cuero) | Los originales de WhatsApp son capturas de publicaciones ajenas (contadores de Instagram) |
| **riesgo-alto** | `cuero-oliva` (Piezas en cuero) | Aspecto de render o de foto de catálogo |
| por-confirmar | Todas las demás | Capturas de WhatsApp o fotos de catálogo sin autoría confirmada. Las más probables como propias son las del taller real: `sofa-blanco-taller`, `sofa-cafe-chaise`, `sofa-gris-esquinero`, `sofa-terracota`, `taller-panorama` y `cuero-chesterfield-clasico` (instalación con muebles embalados). Las que parecen render llevan una nota |
| propia | (ninguna confirmada aún) | — |

**No se publican** (iteraciones del 28-10 y del 8-11):

| Motivo | Fotos |
|---|---|
| Marca de agua «ar» de otra marca | La serie 8.21.07 PM y sus versiones del catálogo (colección «Confort que se siente» 02–06). Decisión confirmada con el cliente |
| Otra marca en la foto | Sofás verdes «MOSS…» (zip 35130); renders con «SOFÁ ELLIE» y contadores de Instagram, y las butacas verdes con «©ZENTO.MX» (zip 35135); camisetas de otros talleres («DE LA ROSA», «MORAI…») |
| Texto incrustado | «Azul media noche», «Borgoña», «Fabricación», «Quiero poder elegir / Es la idea», «La belleza está en el proceso», «Lo hecho a mano lleva tiempo», «El detalle está en el proceso», «Una idea», «Un proceso» |
| Stock (ícono de Google Lens) | 4.48.55 y 4.49.30 |
| Borrosas o sin valor | tornillos, fresadora, sierra con aspecto de IA, taller con línea dibujada encima |
| Mueble cortado en el original | chesterfield con muro de ladrillo (8.21.12 PM (2)); versión de WhatsApp del chesterfield con puf (se usa la del catálogo) |
| Duplicados | se usa una sola versión: `butaca-curva` = `sillon-curvo`, `silla-madera` = `poltrona`, bouclé en el banco de tapizado (×3), cama de cabecero redondeado |

**Prioridad de reemplazo:**
1. El par del comedor, si se consigue un boceto → terminado propio.
2. Las demás de riesgo alto.

El 11-11 salió de la página `sofa-bosque` (hero, riesgo alto). El nuevo hero, `divan-pana-naranja`, es una captura de carrusel enviada por el cliente: queda `por-confirmar`. Las fotos «ar» que el cliente adjuntó el 11-11 tampoco se publican, y no se les borra la marca.

El 13-11 el banner del hero pasó a `sofa-listones` (WhatsApp del 25-10, `por-confirmar`). Es la foto más visible de la página: conviene confirmar sus derechos antes de publicar, o reemplazarla por una foto propia en alta resolución (§13).

Cuando una foto se confirme como propia, se cambia su `origen` a `propia` en el mapa.

---

## 9. Iteración B2B: cuero, hecho a mano y cursor de la silla

**Pedido:**
- logo más grande;
- énfasis en que todo es hecho a mano;
- una sección para el cuero, que es la especialidad;
- calidad antes que cantidad y énfasis en la experiencia del cliente;
- cursor con la silla del logo;
- foco en hoteles, restaurantes, galerías y casas de arquitecto.

**Cambios:**
- **Header:** el logo pasa de 3 a 4 rem en escritorio y de 2,6 a 3,25 rem en móvil. Navegación: Sectores · Cuero · Proyectos · Proceso · Contacto.
- **Cursor:** silla del logo redibujada en SVG (la original es de línea muy fina para 32 px), negra con halo crema y en terra sobre clicables. Solo con mouse y sin modo de alto contraste; los campos de texto y el slider conservan sus cursores.
- **Hero:**
  - titular «Mobiliario / *hecho a mano* / para espacios / con carácter»;
  - subtítulo con los cuatro sectores y «Pocas piezas, hechas con tiempo y cuidado»;
  - CTA «Cotizar un proyecto» y «Conocer el cuero»;
  - sello circular «Hecho a mano · Diseño y producción».
- **Sectores** (nuevo, reemplaza «Dos caminos»): 4 tarjetas con mensaje de WhatsApp propio. El hogar queda como una línea secundaria.
- **Hecho a mano** (antes «Oficio»): manifiesto de calidad antes que cantidad y tres principios (Hecho a mano · Calidad antes que cantidad · Acompañamiento).
- **Cuero** (nuevo): campo negro, fotos de costura y corte de pieles, oficio en 4 pasos y CTA «Pedir muestras de cuero».
- **Proyectos:** 6 piezas curadas, cada una con nota de material u oficio. Se quitan los filtros, el contador y «Ver todos».
- **Contenido B2B:**
  - proceso «Del brief a la entrega, sin prisas»;
  - cotizador (espacio → necesidad → empresa, ciudad y piezas);
  - FAQ (arquitectos, series cortas, cueros, facturación);
  - cierre «¿Tienes un proyecto en mente?»;
  - title y description de SEO.

**Verificación:**
- **QA funcional** (`scripts/qa.mjs`) completa en 390 y 1440. Comprueba el cursor calculado (silla en `html`, silla terra en `<a>`, `text` en campos), el mensaje B2B del cotizador y los carruseles. 0 errores de consola.
- **Escaneo:** 0 TODO en producción (29 con `PUBLIC_SHOW_TODOS=true`), 0 textos de menos de 13 px, 0 fallos de contraste (incluido el campo negro de Cuero) y sin desbordamiento horizontal.
- **Lighthouse móvil:** **91–92 / 100 / 100 / 100**.
- **CTA del hero:** dentro del primer pantallazo en 360 × 780 y en 390 × 844.

**Pendiente del cliente** (además de lo de §7):
- tipos y procedencia del cuero;
- fotos de piezas terminadas en cuero;
- alcance real por sector (cantidades, plazos, instalación);
- confirmar si trabajan a partir de planos del estudio;
- capacidad de producción;
- facturación a empresas.

---

## 10. Iteración del 28-10: cuero, logo «Comodidad hecha diseño» y fotos sin recortes

**Pedido:**
- rediseñar con las fotos de cuero del contenido nuevo (`brand/Nuevo contenido 28-10/`);
- usar el logo con el eslogan «Comodidad hecha diseño» en todo el sitio;
- que ninguna foto se recorte, porque los muebles se veían cortados.

**Contenido nuevo:**
- Llegaron 29 fotos sueltas, 4 zip (33 fotos) y el catálogo PDF del cliente (18 páginas).
- `scripts/extract-pdf.mjs` extrae las 49 imágenes del catálogo, y pdf.js en Edge permite leer su texto.
- Del catálogo salen datos reales:
  - el nombre de cada pieza en cuero;
  - «Del corte al capitoné»;
  - el proceso de 6 pasos (Análisis, Cotización, Fabricación, Control de calidad, Envío e instalación, Entrega final);
  - «Producción por lotes» y «Muestras antes de producir» para negocios;
  - «Madera maciza, esponja de alta densidad».
- Los datos de contacto del catálogo son de relleno (`[+57 000 000 0000]`, `[@usuario]`), así que siguen como TODO.
- Las fotos elegidas se copiaron a `brand/2026-10-28/`. La entrega en bruto (zip, PDF y descartes) queda fuera del repositorio con `.gitignore`.

**Diagnóstico de los recortes:**
- Todas las secciones metían la foto en un marco de proporción fija (4:5, 3:4, 1:1 o 4:3) con `object-cover`. Por ejemplo, `sofa-gris-taller` (1,71:1) perdía el 53 % del ancho en Proyectos.
- Además, el *zoom* al pasar el mouse recortaba los bordes, y el arco del hero cortaba las esquinas de la foto.

**Regla nueva: ninguna foto se recorta.**
- **`ui/Foto.astro`:** muestra la foto en su proporción natural. Para galerías y fundidos admite una caja fija (`box`) donde la foto se ajusta entera, apoyada en una base común (los títulos quedan alineados) o centrada sobre un paspartú.
- **Arco:** ahora es un panel de fondo (`ui/ArchFrame.astro`) y la foto va completa delante.
- **Hover:** se quitó el zoom; la foto se eleva con una sombra.
- **Antes/después:** la caja toma la proporción real del par. En el pipeline, las dos fotos se igualan con un desplazamiento de (2, 1) px.
- **Muestras de tela:** usan recortes solo de textura (`<slug>-muestra`), nunca de un mueble.
- **`media-map.json`:** los `crop` solo quitan interfaz (contadores, íconos y barras).
- **Control automático:** `npm run audit:scan` reporta `imagesCropped`, la parte visible de cada foto según `object-fit` y los ancestros con overflow oculto. También mide la nitidez a 2x con el candidato real del `srcset`.

**Logo «Comodidad hecha diseño»:**
- El original a color mide 330 px y su silla es roja (#B02020), un color fuera de la paleta.
- Se rehízo en vector:
  - la silla se dibujó sobre la referencia a color de 1169 px (`src/lib/silla.mjs`), con respaldo y asiento en **Terra** de la paleta;
  - el nombre y el eslogan son texto real en Literata (`ui/Logo.astro`), y el eslogan nunca baja de 13 px.
- Se usa en el header, el menú móvil, el footer, el sello del hero, el favicon (SVG y PNG), el `apple-touch-icon` y la imagen OG (`npm run og`).
- El eslogan también está en el title, la description, el JSON-LD (`slogan`) y como firma del cierre.

**Cuero como protagonista:**

| Sección | Cambio |
|---|---|
| Hero | Sillas de comedor en cuero coñac, con el detalle «Botón y pliegues» |
| Sectores | Las 4 fotos son piezas en cuero del catálogo |
| Cuero | Foto principal de las tachuelas a mano y una tira nueva «Del corte al capitoné», con 5 detalles y los nombres del catálogo |
| Proyectos | 5 de 6 piezas en cuero; las fotos horizontales van en las columnas anchas |
| Hecho a mano | Foto de la estructura curva en el taller |
| Proceso | Los 6 pasos del catálogo |
| Antes/después | «De la estructura a la pieza» (cinchas → bouclé) |
| Telas | Se suma «Tejido gris» |
| Cierre | Butaca de cuero sobre un arco terra |

Se borraron `/lab/hero`, que dependía de fotos de riesgo alto, y los PNG del logo anterior.

**Verificación:**
- **Build:** sin errores ni advertencias.
- **Escaneo** en 360, 390, 768, 1024, 1440 y 1920:
  - **0 fotos recortadas** y 0 fotos blandas a 2x;
  - 0 fallos de contraste, 0 textos de menos de 13 px y 0 objetivos táctiles de menos de 24 px;
  - sin desbordamiento horizontal.
- **QA funcional:** completa en 390 y 1440, sin errores de consola. El logo con el eslogan aparece en el header (13,2 px) y en el footer, y la caja del antes/después tiene la misma proporción que la foto (0,764).
- **CTA del hero:** dentro del primer pantallazo en todos los tamaños, de 360 × 780 a 1920 × 1080.
- **TODO:** 0 en producción y 31 con `PUBLIC_SHOW_TODOS=true`.
- **Lighthouse móvil:** **94 / 100 / 100 / 100**, con CLS 0.

**Pendiente del cliente:**
- tipos y procedencia del cuero;
- datos de contacto reales (los del catálogo son de relleno);
- condiciones de garantía y anticipo;
- cobertura del envío;
- revisión de derechos de las 3 fotos de riesgo alto (§8).

---

## 11. Iteración del 8-11: tela y cuero en equilibrio, los dos bocetos y todo el material

**Pedido:**
- que la página no se enfoque solo en el cuero: el cuero es el fuerte del cliente, pero va en **una sección exclusiva**, sin dejar de lado la tapicería en tela;
- que los dos pares boceto → terminado (el comedor y el mueble) estén **los dos**, no uno u otro;
- que se usen **todas las imágenes aportadas** para mostrar lo que se hace.

**Decisiones confirmadas:**
- galería de tela con filtros y «Ver más»;
- no publicar los renders de la marca «ar»;
- el hero lleva el sofá en el bosque, la foto que abre el catálogo.

**Material:**
- Se revisaron una por una las 51 fotos de `./brand` que nunca se habían usado, más los zip y el catálogo.
- Entraron unas 40 fotos (75 en el mapa en total), entre ellas:
  - sofás terminados en el taller real (blanco, chenilla café, esquinero gris);
  - camas y cabeceros;
  - el oficio en tela y madera (medidas, corte, costura, estructura, lijado, tapizado en bouclé).
- Lo que no entra y por qué está en §8. Los recortes solo quitan interfaz; se revisaron con hojas de contacto.

**Estructura nueva** (sigue la del catálogo del cliente):

| Sección | Cambio |
|---|---|
| Hero | Sofá en tela (`sofa-bosque`) con detalle de capitoné en cuero: los dos materiales desde el primer pantallazo. CTA secundario «Ver trabajos» |
| Sectores | 3 fotos en tela y 1 en cuero; los textos dicen «en tela o en cuero» |
| Hecho a mano | Foto del taller real y tira nueva «Manos que saben» (catálogo, p. 13) con 8 pasos del oficio (`src/data/taller.json`) |
| Trabajos (`#trabajos`) | «Confort que se siente»: galería de 27 trabajos en tela, en masonry con fotos completas. Filtros (Todo · Sofás · Sillones y poltronas · Camas y cabeceros), 9 visibles al inicio y «Ver los 27 trabajos», con un contador en `aria-live` |
| Cuero (`#cuero`) | Sección exclusiva: pasos, «Del corte al capitoné» y «Piezas en cuero» (10 piezas con los nombres del catálogo). Es el único lugar de la página donde el cuero es protagonista |
| Del boceto a la pieza (`#boceto-a-pieza`) | Los dos sliders a la vez, lado a lado en escritorio y uno debajo del otro en móvil: «Comedor: del boceto al terminado» y «Sofá: de la estructura al tapizado». Cada caja tiene la proporción de su par y un ancho máximo igual a la mitad del origen (nítido a 2x) |
| Visor | Uno solo para la página, por grupos (`data-lb-group`): las flechas recorren solo la galería abierta |
| Navegación | Sectores · Trabajos · Cuero · Telas · Proceso · Contacto |
| Textos | Title, description, servicios (se suma «Tapicería en tela»), footer, OG y telas hablan de tela **y** cuero |

**Regla nueva:** cada foto aparece una sola vez en la página. `npm run qa` lo comprueba en `duplicatePhotos` (Proceso repite cada foto a propósito: fija en escritorio y tarjeta en móvil).

**Verificación:**
- **Build:** sin errores ni advertencias.
- **Escaneo** en 360, 390, 768, 1024, 1440 y 1920:
  - **0 fotos recortadas** y 0 blandas a 2x;
  - 0 fallos de contraste, 0 textos de menos de 13 px y 0 objetivos táctiles de menos de 24 px;
  - sin desbordamiento horizontal.
- **QA funcional** en 390 y 1440, todo OK y 0 errores de consola:
  - filtros: «Camas» muestra solo camas;
  - «Ver más»: 9 → 27, con el foco en la primera foto nueva;
  - los 2 pares visibles, con caja = foto (0,961 y 0,764);
  - visor de cuero «1 / 10» y de trabajos «x / 27»;
  - 0 fotos repetidas.
- **CTA del hero:** dentro del primer pantallazo de 360 × 780 a 1920 × 1080.
- **TODO:** 0 en producción y 29 con `PUBLIC_SHOW_TODOS=true`.
- **Lighthouse móvil:** **93 / 100 / 100 / 100** (CLS 0).

**Pendiente del cliente:**
- confirmar los derechos de las fotos de riesgo alto (§8), empezando por el hero y el comedor;
- un par real de retapizado antes/después;
- tipos de cuero, contacto, garantía y cobertura (sin cambios).

---

## 12. Iteración del 11-11: imágenes premium y dirección de arte

**Pedido:**
- en el sitio publicado, el cliente marcó 4 fotos poco limpias: el primer trabajo de la galería, el hero, el taller de «Hecho a mano» y el sector «Casas de arquitecto»;
- las cambiamos por imágenes más elaboradas y premium que adjuntó;
- usamos las fotos premium que todavía no estaban en la página;
- limpiamos las que traen texto;
- subimos el nivel visual en móvil y en escritorio, con la skill de diseño (impeccable).

**Decisiones:**
- **Fotos de bodega:** se quedan, pero las mejores ganan protagonismo.
- **Fotos «ar»:** quedan fuera. Son renders de otra marca; quitarles el logo no elimina el copyright y aumenta el riesgo, así que no se borran marcas de terceros.
- **Dirección de arte:** taller en blanco y negro, piezas a color.

**Diagnóstico (revisión de diseño):**
- las 4 fotos marcadas comparten el fondo de bodega, y eso abarata los lugares más vistos;
- la galería no tenía jerarquía;
- el taller mezclaba calidades y colores;
- había demasiado texto bajo cada foto;
- faltaba una pausa de marca.

**Fotos nuevas** (`brand/2026-11-11/`; los recortes solo quitan interfaz):

| Foto | Detalle |
|---|---|
| `divan-pana-naranja` | Adjunto del chat. Se quitó el contador «2/3» |
| `cabecero-lampara` | Catálogo p. 6 |
| `tejido-terracota` | Adjunto, mayor que la versión del catálogo p. 11 |
| `cuero-rejilla` | Del zip |
| `costura-maquina-bn` | — |
| `hilo-bn` | — |
| `tapizado-claro` | Catálogo p. 11 |

**Cambios:**

| Lugar | Antes → después |
|---|---|
| Hero | `sofa-bosque` → `divan-pana-naranja` (pana terra de la paleta). En móvil el subtítulo muestra solo la primera oración y la foto gana un 28 % de alto, con el botón todavía sobre el pliegue |
| «Hecho a mano» | `taller-panorama` → `costura-maquina-bn` |
| «Manos que saben» | En blanco y negro con un filtro CSS (el archivo no cambia); con mouse recupera el color en 400 ms. Se suma «Hilo» |
| Casas de arquitecto | `sofa-verde-modular` → `sofa-ocre` |
| Trabajos | 3 **destacadas** grandes arriba (`sofa-chocolate`, `cabecero-lampara`, `cama-modular`). En la grilla, campo `tier`: las 9 visibles son premium y las 8 de bodega van al final, también al filtrar. Bajo cada foto queda solo el título; la nota pasa al visor |
| Manifiesto (nuevo) | Pausa de marca entre Trabajos y Cuero, con el texto real del catálogo (p. 17) y `tapizado-claro` |
| Telas | «Bouclé terracota» (foto de bodega) → «Tejido terracota» (catálogo p. 11) |
| Cuero | Se suma «Cuero y rejilla»; quedan 11 piezas |
| Galerías masonry | `content-visibility: auto` con la altura real reservada: menos trabajo de layout al cargar |

Salieron de la página `sofa-bosque` (riesgo alto), `taller-panorama`, `cabecero-oscuro` (misma escena que `cabecero-lampara`, en peor versión), `maquina-coser` y `sofa-terracota-taller`.

**Verificación:**
- **Build:** sin errores.
- **Escaneo** en 360, 390, 768, 1024, 1440 y 1920:
  - 0 fotos recortadas y 0 blandas a 2x;
  - 0 fallos de contraste, 0 textos de menos de 13 px y 0 objetivos táctiles de menos de 24 px.
- **QA funcional:**
  - 3 destacadas;
  - las 9 visibles son premium y las de bodega están al final;
  - manifiesto presente;
  - 2 pares de bocetos;
  - visor por grupo («x / 27» en trabajos y «1 / 11» en cuero);
  - 0 fotos repetidas y 0 errores de consola.
- **CTA del hero:** sobre el pliegue de 360 × 780 a 1920 × 1080.
- **TODO:** 0 en producción y 29 con el flag.
- **Lighthouse móvil:** **93–94 / 100 / 100 / 100** (CLS 0).
- **Traza del navegador:** con la CPU limitada, la versión nueva hace menos trabajo de layout que la anterior.

---

## 13. Iteración del 13-11: banner del hero con una sola foto

**Pedido:**
- en lugar de las dos fotos chicas del hero (el diván en el arco y el detalle de capitoné), una sola foto, la mejor del sistema, que cubra toda la parte superior del banner;
- calidad profesional en computador y en celular, sin perder resolución;
- el sello «Hecho a mano» se queda, integrado con la esencia y los colores de la página.

**Decisiones (confirmadas con el cliente):**
- **Foto:** `sofa-listones`, el sofá gris frente a la pared de listones. Es la foto premium más ancha (1170 × 776), con el sofá centrado y completo, y plantas, madera y un tapete terracota y ocre que caen en la paleta.
- **Formato: banner enmarcado.** Las fotos son exportes de WhatsApp de unos 1170 px: en escritorio el banner ocupa el ancho del contenido (máx. 1224 px CSS) y no el de la pantalla, para no ampliarla.

**Composición:**

| Tamaño | Banner | Texto |
|---|---|---|
| Celular (< 640 px) | De borde a borde, en su proporción natural (sin recorte). Nítido: 390 px × 3 = 1170 px | Titular en 4 renglones, primera oración del subtítulo, CTA y línea de confianza |
| Tablet (640–1023 px) | Enmarcado con `rounded-card`, proporción 1,9 | Igual que en el celular, con el subtítulo completo |
| Escritorio (≥ 1024 px) | Proporción 2,6, con un alto máximo de `100svh − 28rem` para que el CTA quede sobre el pliegue | Debajo, en 2 columnas: el titular (6/12, en xl 7/12) y el subtítulo con los CTA (6/12, en xl 5/12) |

- **Sello:** montado sobre el borde inferior derecho del banner, mitad sobre la foto y mitad sobre el crema, con su sombra. Mide de 5,25 rem en el celular a 8 rem en xl. Tapa solo piso, nunca el mueble.
- **Sin texto sobre la foto:** no hace falta oscurecerla y el contraste no depende de la imagen.
- **Movimiento:** la foto se asienta (escala 1,025 → 1, nunca invisible porque es el LCP), el texto sube 10 px y el sello aparece 350 ms después. Con movimiento reducido, solo fundido.

**Fotos reubicadas** (cada foto sigue apareciendo una sola vez):
- `sofa-listones` sale de la galería de Trabajos y pasa al hero;
- `divan-pana-naranja` (hero anterior) entra a la galería como primera pieza premium de Sofás;
- `cuero-boton` (detalle anterior) vuelve a «Del corte al capitoné» como «Botón y pliegues» (catálogo p. 10). La tira queda en 6 detalles, en 6 columnas en escritorio.
- `ArchFrame` ya no se usa en el hero; lo sigue usando el cierre.

**Única excepción a «fotos sin recorte»:**
- Desde 640 px el banner tiene proporción fija y la foto se ajusta con `object-position: 50% 80%`.
- Solo pierde pared arriba y piso abajo. El sofá, con las patas, y las dos mesas auxiliares quedan completos en 768, 1024, 1440 y 1920 (revisado en las capturas).
- La imagen lleva `data-crop-ok` y `audit:scan` la excluye de `imagesCropped`. Ninguna otra foto lo usa.

**Límite de resolución (conocido):**
- En escritorio el banner se muestra a 704–1224 px CSS con un archivo de 1170 px: se ve nítido en pantallas 1x y algo blando en pantallas retina (2x).
- `audit:scan` lo marca en `imagesUpscaled` desde 768 px. Es la única foto marcada.
- Para resolverlo hace falta un original de unos 2500 px de ancho de la misma escena, o una foto propia del taller en alta resolución. Con ese original, el componente no cambia: basta con sumar anchos en `widths`.

**Verificación:**
- **Build:** sin errores.
- **Escaneo** en 360, 390, 768, 1024, 1440 y 1920:
  - 0 fotos recortadas (con el banner exento);
  - en el celular, 0 blandas a 2x; desde 768 px, solo el banner (límite conocido);
  - 0 fallos de contraste y 0 textos de menos de 13 px.
- **QA funcional:**
  - 6 detalles de cuero y 11 piezas;
  - 2 pares de bocetos;
  - visor por grupo («x / 27» en trabajos y «1 / 11» en cuero);
  - 0 fotos repetidas y 0 errores de consola.
- **CTA del hero:** sobre el pliegue en todos los tamaños:

  | Tamaño | Borde inferior del CTA |
  |---|---|
  | 360 × 780 | 719 |
  | 390 × 844 | 744 |
  | 1024 × 768 | 742 |
  | 1440 × 900 | 856 |
  | 1920 × 1080 | 875 |

- **Lighthouse móvil:** **93 / 100 / 100 / 100**: LCP 2,9 s (la foto del banner), TBT 10 ms y CLS 0.
- **Capturas:** `.audit/v6/home-hero-{360,390,768,1024,1440,1920}.png`.
