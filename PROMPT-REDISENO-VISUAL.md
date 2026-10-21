# Prompt para Claude Code · Rediseño visual de la landing de La Tapicería

> Cómo usarlo: abre Claude Code en la carpeta del proyecto y escribe:
> **"Lee PROMPT-REDISENO-VISUAL.md y ejecútalo fase por fase, deteniéndote en cada punto de control."**

---

## Rol y objetivo

Actúa como director de arte y desarrollador frontend senior. Vas a hacer una **refactorización visual** de la landing de La Tapicería (taller de retapizado, restauración y muebles a la medida en Colombia). Se mantienen el contenido, el funcionamiento y la marca; cambian la composición, la jerarquía, el ritmo y el acabado. El resultado debe sentirse como la web de un **estudio de diseño artesanal de gama media-alta**, cálido y con oficio, y no como una plantilla genérica de landing.

La prioridad número uno es el **hero (banner principal)**: al cliente no le gusta el actual y hay que rediseñarlo desde cero.

## Contexto técnico (no cambiar)

- Astro 7 + Tailwind v4 (`@tailwindcss/vite`), sitio estático de una sola página. Sin backend: todos los CTA abren WhatsApp (`src/lib/whatsapp.ts`).
- Contenido editable en `src/data/*.json`. Las fotos salen de `scripts/media-map.json` → `npm run media` → `src/assets/photos/<slug>.jpg`, y se llaman con `photo('<slug>')`.
- Tokens de color y fuentes en `src/styles/global.css` (`@theme`). Fuentes: Literata Variable (serif) y Figtree Variable (sans), vía Fontsource.
- Cada sección es un componente en `src/components/`. El orden está en `src/pages/index.astro`.
- Ya hay a11y que **debe conservarse**: skip-link, trampa de foco en el menú móvil, tablist accesible en antes/después, slider con teclado, `prefers-reduced-motion`, JSON-LD (LocalBusiness + FAQPage).
- Paleta oficial de la marca (lámina en `./brand`): Negro #060606 · Esmeralda #2E3D35 · Champaña #CFC3AB · Crema #EAEAE5 · Menta #979A83 · Terra #A86639 · Sepia #9B764B. Es obligatoria; puedes derivar tonos (más claros u oscuros) para lograr contraste AA, nunca agregar tonos ajenos.
- Logo: silla de respaldo redondeado + «La Tapicería» en serif + «Diseño y producción» en itálica, con un **hilo punteado y una aguja** sobre el nombre. Ese pespunte es un motivo de marca aprovechable.

### Restricción clave de las fotos
**Todas las fotos vienen de WhatsApp**: máximo unos 1170 px de ancho, casi todas verticales o cuadradas. `hero-bosque.jpg` mide 1081×1140. Las únicas horizontales son fotos de bodega o taller (sin valor para el hero). Por eso:
- Ninguna foto debe mostrarse a más de ~550 px CSS de ancho en pantallas 2x. Diseña el hero y las secciones para imágenes **enmarcadas, verticales o en mosaico**, no a sangre completa en 100vw.
- No uses fotos de stock ni imágenes generadas. Trabaja solo con las de `./brand`. Para ver opciones corre `npm run contact-sheet` (genera hojas en `.contact-sheet/`).

---

## Skills de diseño que debes usar

Instálalas antes de empezar (si alguna falla, avísame y sigue con las demás):

1. **frontend-design** (oficial de Anthropic). Da dirección estética y tipografía, y evita el look de plantilla.
   ```
   /plugin marketplace add anthropics/claude-code
   /plugin install frontend-design@claude-code-plugins
   ```
2. **Impeccable** (pbakaus, https://impeccable.style). Comandos de crítica y pulido: `/critique`, `/audit`, `/normalize`, `/bolder`, `/quieter`, `/animate`, `/adapt`, `/polish`. Descarga el bundle para Claude Code desde la web y copia su carpeta `.claude` al proyecto. Corre `/teach-impeccable` una vez con el contexto de este documento.
3. **web-design-guidelines** (Vercel). Revisión contra buenas prácticas de UI, a11y y rendimiento:
   ```
   npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code
   ```
4. (Opcional) **Playwright MCP**, para que tomes capturas tú mismo:
   ```
   claude mcp add playwright npx @playwright/mcp@latest
   ```
   Si no, usa Playwright por script. Lo importante es que **mires el resultado renderizado**, no solo el código.

---

## Diagnóstico previo (ya hecho; valídalo y amplíalo)

Se revisó el build actual en 1440×900 y 390×844. La página mide unos 16 300 px en escritorio y unos 17 000 en móvil.

### Hero — problemas (prioridad máxima)
1. **Composición dividida y plana**: un bloque esmeralda liso ocupa el 40 % izquierdo y la foto el 60 % derecho. El degradado esmeralda → foto deja una franja turbia sobre los árboles. Parece plantilla.
2. **El protagonista se pierde**: el sofá (lo que vende) queda pequeño en el tercio inferior. En móvil queda **tapado** por velos negros, por el titular y por los botones, y casi no se ve.
3. **Titular sobredimensionado**: «Tu mueble, como siempre lo imaginaste» ocupa 4 líneas a ~5,6 rem con `max-width: 9.5ch`. Aplasta la jerarquía y empuja los CTA al borde inferior.
4. **Foto estirada**: 1081 px de origen se muestran a 60vw × 100svh, más un zoom de entrada (1.08) y parallax con `scale(1.08)`. En retina se ve blanda.
5. **Navegación sin contraste**: «Telas» y «Contacto» quedan sobre el follaje claro. Además el tagline del logo es ilegible al tamaño del header.
6. **Redundancia**: el eyebrow «La Tapicería · Diseño y producción» repite el logo y en móvil se parte en dos líneas.
7. **Indicador «Desliza»** mal ubicado: cae justo en la costura entre el bloque y la foto, y queda cortado.
8. **Barra de anuncio** con un TODO visible: en móvil ocupa 2–3 líneas y empuja el hero.
9. **Sin señal de confianza** sobre el pliegue (taller propio, ciudad, cobertura, tiempo de respuesta…). Usa solo datos reales de `site.json`, nunca inventes cifras.

### Resto de la página
- **Monotonía estructural**: las 12 secciones usan el mismo patrón (eyebrow con raya + H2 serif + párrafo a la derecha). Hacen falta 2 o 3 variantes de encabezado y cambios reales de ritmo.
- **Fondos casi idénticos**: crema-50, crema y champaña-200 se funden, y la página se lee como un solo bloque beige. El terra y el sepia están casi sin usar. Define una secuencia de fondos con contraste intencional (claro / profundo / acento).
- **Proceso demasiado largo**: 6 pasos en zigzag con fotos 5:6 ocupan unos 4 000 px. Compáctalo (por ejemplo, imagen sticky que cambia con el paso activo, o una grilla 3×2 / 2×3), manteniendo la línea de progreso si aporta.
- **TODOs visibles por todas partes** (~20): anuncio, servicios, proceso, telas, condiciones (las 4 tarjetas vacías), testimonios (texto provisional), contacto (todo TODO). Mantén el sistema, pero **muéstralos solo en desarrollo** (`import.meta.env.DEV` o una variable `PUBLIC_SHOW_TODOS`). En producción, una sección sin datos reales se oculta o se degrada con elegancia, sin dejar huecos.
- **Testimonios**: una sección completa champaña dedicada a texto provisional. Ocúltala mientras no haya testimonios reales (flag en JSON) y deja el componente listo.
- **Proyectos**: fotos de calidad y fondo dispares (lámina metálica de taller frente a ambientes de hogar). Dales un tratamiento uniforme (mismo ratio, mismo fondo, quizá un sutil marco crema) y considera una grilla editorial de tamaños mixtos en escritorio en lugar de un carrusel. La tarjeta vacía de «Restauración» no debe verse en producción.
- **Telas**: el sexto swatch cae solo en una segunda fila. Ajusta tamaños o grilla. Buen candidato para usar el motivo del pespunte.
- **Cierre (Contacto)**: la foto de fondo quedó casi negra (opacidad 55 % + velo al 90 %) y el bloque de datos es una fila de TODOs. Hace falta un cierre con más luz y presencia.
- **Footer** pobre. Puede repetir datos de contacto reales y tener más aire.
- **Tipografía**: eyebrows a 0,75 rem con tracking 0,22 em, difíciles de leer en móvil. Los H3 son débiles frente a los H2. Define una escala tipográfica clara (display, h2, h3, lead, body, small, eyebrow) y aplícala en todas partes.
- **Bordes y superficies**: todo usa `rounded-sm` (2 px) y se ve rígido. Busca un lenguaje de formas propio, por ejemplo el **arco** del respaldo de la silla del logo para marcos de imagen clave y el **pespunte punteado** del logo como divisor u ornamento, sin abusar.
- **Movimiento**: hay mucho a la vez (palabras que suben, zoom, parallax, máscaras, riel). Quédate con pocas animaciones y con propósito. Respeta siempre `prefers-reduced-motion`.

---

## Plan de trabajo por fases

### Fase 0 · Preparación
1. Si el proyecto no tiene git: `git init`, `.gitignore` ya existe, y haz un commit «baseline antes del rediseño». Después, un commit por fase.
2. Instala las skills de arriba y confirma cuáles quedaron activas.
3. `npm install` y `npm run dev`. Toma **capturas «antes»** a 390, 768 y 1440 px de ancho (hero y página completa) en `.audit/antes/`. Agrega `.audit/` a `.gitignore`.

### Fase 1 · Auditoría visual (sin tocar código)
1. Corre `/critique` y `/audit` (Impeccable) y la revisión de `web-design-guidelines` sobre la página renderizada.
2. Cruza los resultados con el diagnóstico de arriba y escribe `AUDITORIA.md` con:
   - hallazgos priorizados **P0 / P1 / P2**, con sección, problema, por qué importa y propuesta;
   - una **dirección de diseño** en un párrafo (concepto, referencias de estudios o marcas de mobiliario artesanal, tono);
   - la propuesta de sistema: escala tipográfica, espaciado vertical, secuencia de fondos, variantes de encabezado de sección, botones, motivo gráfico.
3. Diseña **3 conceptos de hero** como prototipos navegables en `src/pages/lab/hero.astro` (página aparte, `noindex`), los tres reales en escritorio y móvil. Puntos de partida, adáptalos si encuentras algo mejor:
   - **A · Editorial enmarcado (recomendado)**: fondo claro (crema), titular más corto en 2–3 líneas, `hero-bosque` vertical **enmarcada en arco** (eco de la silla del logo) y no a sangre completa. Un segundo detalle pequeño superpuesto (textura de tela o manos tapizando). CTA claros y una línea de confianza con datos reales. La foto nunca supera su resolución nativa.
   - **B · Mosaico de oficio**: titular arriba y una tira de 3–4 fotos verticales que cuentan «taller → tela → resultado en casa», con leve desfase vertical.
   - **C · Inmersivo corregido**: foto a pantalla completa, pero con un encuadre que deja el sofá visible y centrado, texto en la zona superior (árboles o cielo), velo solo donde hace falta, titular en 2 líneas y sin bloque verde plano. Úsalo solo si en capturas 2x la foto se ve nítida.
   En los tres: header legible desde el primer pixel, sin eyebrow redundante, la barra de anuncio no debe romper el hero en móvil y el sofá debe verse siempre.
4. Toma capturas de los 3 conceptos a 390 y 1440 px.

**⏸ PUNTO DE CONTROL 1**: muéstrame `AUDITORIA.md` y las capturas de los 3 heros. **No sigas hasta que elija un concepto y apruebe la dirección.**

### Fase 2 · Sistema visual
1. Actualiza `@theme` en `global.css`: tokens derivados para contraste, escala tipográfica fluida (`clamp`), escala de espaciado de sección, radios del lenguaje de formas y sombras sutiles si las usas.
2. Crea los componentes base reutilizables: `SectionHeader.astro` con 2–3 variantes, el ornamento del pespunte (SVG inline, `aria-hidden`) y el marco en arco para imágenes.
3. Agrega el flag de TODOs solo en desarrollo y el mecanismo para ocultar en producción las secciones sin datos reales.

### Fase 3 · Hero
Implementa el concepto elegido en `Hero.astro` (más ajustes en `Header.astro` y `AnnouncementBar.astro`). Requisitos:
- LCP: la imagen del hero con `loading="eager"`, `fetchpriority="high"`, `widths`/`sizes` coherentes con el tamaño real en pantalla y sin escalados que pixelen.
- Texto con contraste AA sobre cualquier fondo, también durante la transición del header al hacer scroll.
- Máximo una animación de entrada y suave. Sin parallax que escale la foto por encima de su resolución.
- Verifica en 360, 390, 768, 1024, 1440 y 1920 px.

### Fase 4 · Secciones
Aplica el sistema al resto, en este orden de impacto: Servicios (Paths) → Proceso (compactar) → Proyectos → Telas → Cotizador → Cierre/Contacto → Footer → Intro → Condiciones/FAQ → Testimonios (oculto si no hay reales). Revisa también el orden de las secciones y propón cambios si mejoran el recorrido hacia la cotización. Después de cada 2–3 secciones, toma capturas y corrige lo que se vea mal antes de seguir.

**⏸ PUNTO DE CONTROL 2**: muéstrame capturas antes/después de escritorio y móvil.

### Fase 5 · Pulido y QA
1. `/polish` (Impeccable) y una pasada final de `web-design-guidelines`.
2. Accesibilidad: contraste AA, foco visible, orden de tabulación, `alt` correctos, `prefers-reduced-motion`.
3. `npm run build` sin errores ni warnings nuevos. Lighthouse móvil con objetivo ≥ 90 en Performance y ≥ 95 en Accessibility, Best Practices y SEO.
4. Capturas «después» en `.audit/despues/` y un resumen breve de cambios en `AUDITORIA.md`.

---

## Reglas

- **No inventes contenido**: ni testimonios, ni cifras, ni años de experiencia, ni ciudades. Si algo falta, queda como TODO (visible solo en desarrollo).
- Copy en español de Colombia, tuteo. Puedes proponer ajustes de copy al titular o los CTA, pero márcalos como propuesta en `AUDITORIA.md` y no los cambies sin aprobación.
- No agregues frameworks (React, Vue…) ni librerías de animación pesadas. Basta con CSS y TypeScript vanilla dentro de componentes Astro.
- Mantén el contenido en los JSON. Si un componente necesita datos nuevos, agrégalos al JSON correspondiente.
- No toques `./brand`, ni la lógica de WhatsApp ni el JSON-LD, salvo que haga falta y lo justifiques.
- Antes de dar algo por terminado, **mira las capturas**. Si algo se ve torpe, recortado o genérico, no está terminado.
