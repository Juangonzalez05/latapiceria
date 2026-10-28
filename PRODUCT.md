# Product

<!-- impeccable:product-schema 1 -->

> Escrito a partir de `PROMPT-REDISENO-VISUAL.md`, del contenido de `src/data/*.json` y de `./brand`, sin entrevista aparte. Lo marcado *(inferido)* está pendiente de confirmar con el cliente.

## Platform

web

## Users

- **Público principal (confirmado por el cliente):** hoteles, restaurantes, galerías y casas de arquitecto, es decir, estudios de arquitectura e interiorismo y quienes compran mobiliario para esos espacios.
- **Público secundario:** hogares particulares, como mención breve.
- Llegan desde el celular o el computador y deciden si escribir por WhatsApp para cotizar un proyecto. *(inferido)*

## Product Purpose

Landing informativa de una sola página para La Tapicería. Su único objetivo es que el visitante pida una cotización por WhatsApp. No es una tienda: no hay precios ni carrito.

## Positioning

Taller de diseño y producción donde **todo es hecho a mano**, con el **cuero como especialidad**. Prioriza la **calidad sobre la cantidad**: pocas piezas, materiales nobles y acompañamiento del brief a la entrega. **El eslogan del sitio es «Comodidad hecha diseño»**: viene del logo a color y se usa en todo el sitio. La versión de línea del logo dice «Diseño y producción».

## Operating Context

- Canal único de conversión: WhatsApp con mensaje prellenado, desde CTA, el cotizador de 3 pasos y el selector de telas.
- Proceso de 6 pasos, tomado del catálogo del cliente: análisis, cotización, fabricación, control de calidad, envío e instalación y entrega final.
- Para negocios, el catálogo ofrece producción por lotes y muestras antes de producir.

## Capabilities and Constraints

- Sitio estático Astro 7 + Tailwind v4. Contenido en `src/data/*.json`.
- Fotos solo de `./brand`: exportes de WhatsApp y del catálogo PDF del cliente, de máximo unos 1170 px de ancho, casi todos verticales o cuadrados. Ninguna imagen debe mostrarse a más de unos 550 px CSS de ancho en pantallas 2x.
- **Ninguna foto se recorta:** cada mueble se ve completo, en la proporción original de la foto (`ui/Foto.astro`).
- **Sin definir:**
  - número de WhatsApp, correo, Instagram, dirección, ciudad, cobertura y horario;
  - costo de la visita, plazos, anticipo y garantía.

## Brand Commitments

- **Paleta oficial:** Negro #060606 · Esmeralda #2E3D35 · Champaña #CFC3AB · Crema #EAEAE5 · Menta #979A83 · Terra #A86639 · Sepia #9B764B. Se permiten tonos derivados para contraste, pero no colores ajenos a la paleta.
- **Tipografías:** Literata (serif, titulares) y Figtree (texto).
- **Logo:** silla de respaldo redondeado, con respaldo y asiento en Terra; nombre en serif; hilo punteado con aguja, y el eslogan «Comodidad hecha diseño» en itálica. Es vectorial y su texto es texto real.
- **Referencias de tono:** Marzo Atelier (principal), Macizo Colombia y La Carpintería. Son referencias de ambiente, nunca para copiar.
- **Voz:** español de Colombia, tuteo, cálida y cercana. Titulares de máximo 8 palabras.

## Evidence on Hand

- **Fotos:** las de `./brand` y `brand/2026-10-28/` (cuero, taller y catálogo).
  - El cliente dijo que son trabajos propios, pero varias parecen venir de publicaciones ajenas (ver `AUDITORIA.md` §8).
  - Hay un par alineado de estructura → sofá terminado (`estructura-cinchas`, `sofa-boucle-terminado`).
- **Catálogo del cliente** (`Catalogo_Fabrica_La_Tapiceria_2026.pdf`): trae los nombres de las piezas en cuero, los valores, el proceso y los servicios para negocios. Sus datos de contacto son de relleno.
- **No existen todavía, y no se deben inventar:**
  - testimonios, cifras, años de experiencia, garantías, precios y plazos;
  - fotos de restauración y pares antes/después de retapizado.

## Product Principles

1. Toda sección empuja hacia una conversación por WhatsApp, sin fricción.
2. Se muestra el oficio (taller, telas, manos) en vez de prometerlo.
3. Ningún dato comercial se publica si no es real. Lo que falta se oculta en producción.
4. La calidad de imagen manda sobre el tamaño: una foto bien enmarcada vale más que una foto grande y blanda.

## Accessibility & Inclusion

WCAG 2.2 AA: contraste, foco visible, teclado en slider, lightbox, carrusel, acordeón y menú, y respeto de `prefers-reduced-motion`.
