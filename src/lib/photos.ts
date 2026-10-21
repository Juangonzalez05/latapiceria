import type { ImageMetadata } from 'astro';

// Todas las fotos procesadas por scripts/prepare-media.mjs, indexadas por slug.
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });

export const photos: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!.replace('.jpg', ''), mod.default])
);

export function photo(slug: string): ImageMetadata {
  const img = photos[slug];
  if (!img) throw new Error(`Foto no encontrada: "${slug}". Revisa scripts/media-map.json y corre npm run media.`);
  return img;
}
