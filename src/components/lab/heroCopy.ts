import site from '../../data/site.json';

// Línea de confianza del hero: solo hechos que ya están en el sitio (tagline del logo, servicios, canal).
// La ciudad y la cobertura se suman solas cuando existan en site.json.
export const heroTrust: string[] = [
  'Diseño y producción propia',
  'Retapizado · Restauración · A la medida',
  site.city ? `Taller en ${site.city}` : 'Atención por WhatsApp',
];
