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

1. **Número de WhatsApp** (P0 para publicar).
2. Ciudad, cobertura, dirección, horario, correo e Instagram.
3. Condiciones reales (visita, plazos, anticipo, garantía).
4. Testimonios reales.
5. Fotos de restauración y pares antes/después de retapizado.
6. Confirmar «producción propia», las categorías de los proyectos y los nombres de las telas.
7. Logo vectorial.
8. Dominio para `site` y Open Graph.

---

## 8. Inventario de derechos de las fotos (preparación)

Cada foto de `scripts/media-map.json` tiene un campo `origen`. Esto **no** reemplaza ninguna foto todavía: deja lista la revisión de derechos que se hará más adelante. Varias fotos parecen venir de publicaciones de otras marcas, de México y de otros países.

| Estado | Fotos | Motivo |
|---|---|---|
| **riesgo-alto** | `hero-arco`, `hero-bosque`, `hero-sofa` | Carrusel de Instagram «5/13», de la misma sesión que el comedor |
| **riesgo-alto** | `comedor-resultado`, `comedor-boceto` | La captura original muestra la marca «MUEBLES DE PUEBLITO» y el contador «2/13» |
| **riesgo-alto** | `chaise-sala`, `sala-modulos`, `butaca-curva`, `silla-madera` | Aspecto de render o de foto de catálogo |
| por-confirmar | Todas las demás, incluidas las de cuero | Capturas de WhatsApp o Instagram sin autoría confirmada |
| propia | (ninguna confirmada aún) | — |

**Dónde se usan las de riesgo alto:**
- `hero-arco`: el hero.
- `comedor-resultado` y `comedor-boceto`: el sector Restaurantes, el par antes/después y el paso 3 del proceso.
- `butaca-curva`: el sector Galerías.
- `sala-modulos`: el sector Casas de arquitecto.

**Prioridad de reemplazo:**
1. El hero.
2. Las tres fotos de sectores con riesgo alto (Restaurantes, Galerías y Casas de arquitecto).
3. El par antes/después.

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
