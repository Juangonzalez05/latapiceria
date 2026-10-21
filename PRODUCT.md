# Product

<!-- impeccable:product-schema 1 -->

> Escrito a partir de `PROMPT-REDISENO-VISUAL.md`, del contenido de `src/data/*.json` y de `./brand`, sin entrevista aparte. Lo marcado *(inferido)* está pendiente de confirmar con el cliente.

## Platform

web

## Users

- Personas en Colombia que tienen un mueble tapizado que quieren conservar (sofá, sillas, cama, cabecero) y buscan renovarlo, o que necesitan una pieza a la medida de su espacio. *(inferido: hogares; segmento gama media-alta según el brief)*
- Llegan desde el celular la mayoría de las veces y deciden si escribir por WhatsApp. *(inferido)*

## Product Purpose

Landing informativa de una sola página para La Tapicería. Su único objetivo es que el visitante pida una cotización por WhatsApp. No es una tienda: no hay precios ni carrito.

## Positioning

Taller de diseño y producción que retapiza, restaura y fabrica muebles a la medida, con acompañamiento en telas y acabados. El tagline del logo es «Diseño y producción» y la versión a color dice «Comodidad hecha diseño».

## Operating Context

- Canal único de conversión: WhatsApp con mensaje prellenado, desde CTA, el cotizador de 3 pasos y el selector de telas.
- Proceso de 6 pasos: contacto, visita y medidas, propuesta, aprobación, fabricación o tapizado, entrega.

## Capabilities and Constraints

- Sitio estático Astro 7 + Tailwind v4. Contenido en `src/data/*.json`.
- Fotos solo de `./brand`: exportes de WhatsApp de máximo unos 1170 px de ancho, casi todos verticales o cuadrados. Ninguna imagen debe mostrarse a más de unos 550 px CSS de ancho en pantallas 2x.
- **Sin definir:**
  - número de WhatsApp, correo, Instagram, dirección, ciudad, cobertura y horario;
  - costo de la visita, plazos, anticipo y garantía.

## Brand Commitments

- **Paleta oficial:** Negro #060606 · Esmeralda #2E3D35 · Champaña #CFC3AB · Crema #EAEAE5 · Menta #979A83 · Terra #A86639 · Sepia #9B764B. Se permiten tonos derivados para contraste, pero no colores ajenos a la paleta.
- **Tipografías:** Literata (serif, titulares) y Figtree (texto).
- **Logo:** silla de respaldo redondeado, nombre en serif, tagline en itálica y un hilo punteado con aguja sobre el nombre.
- **Referencias de tono:** Marzo Atelier (principal), Macizo Colombia y La Carpintería. Son referencias de ambiente, nunca para copiar.
- **Voz:** español de Colombia, tuteo, cálida y cercana. Titulares de máximo 8 palabras.

## Evidence on Hand

- **Fotos:** 85 en `./brand`. El cliente confirmó que son trabajos propios. Hay un par boceto → comedor terminado alineado (`comedor-boceto`, `comedor-resultado`).
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
