import site from '../data/site.json';

/** Número en formato internacional solo dígitos (ej. 573001234567). Vacío = TODO. */
export const waNumber = site.whatsapp.replace(/\D/g, '');
export const hasWaNumber = waNumber.length > 0;

/**
 * Enlace de WhatsApp con mensaje prellenado.
 * Sin número configurado usa wa.me/?text=, que abre WhatsApp para elegir el chat.
 */
export function waLink(message = 'Hola, quiero una cotización.'): string {
  const text = encodeURIComponent(message);
  return hasWaNumber ? `https://wa.me/${waNumber}?text=${text}` : `https://wa.me/?text=${text}`;
}

/** Base sin texto, para que el JS del cliente arme mensajes dinámicos. */
export const waBase = hasWaNumber ? `https://wa.me/${waNumber}` : 'https://wa.me/';
