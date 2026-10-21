// Etiquetas TODO (datos que faltan del cliente): visibles en desarrollo, ocultas en producción.
// Para verlas en un build de revisión: PUBLIC_SHOW_TODOS=true npm run build
export const SHOW_TODOS: boolean = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_TODOS === 'true';

/** Hay dato real (no vacío). */
export const has = (v: unknown): boolean =>
  Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? v.trim().length > 0 : v != null && v !== false;
