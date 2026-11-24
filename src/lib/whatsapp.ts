import site from '../data/site.json';

const waNumber = site.whatsapp.replace(/\D/g, '');

/**
 * Enlace de WhatsApp con mensaje prellenado.
 * Sin número configurado usa wa.me/?text=, que abre WhatsApp para elegir el chat.
 */
export function waLink(message: string): string {
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

export function fabricSampleLink(name: string): string {
  return waLink(`¡Hola! Me gustó la tela «${name}». ¿Está disponible y cómo puedo recibir una muestra para verla en mi espacio?`);
}
