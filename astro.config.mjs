// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TODO: reemplazar por el dominio real cuando exista (se usa para URLs absolutas de Open Graph).
  site: 'https://latapiceria.example',
  vite: {
    plugins: [tailwindcss()],
  },
});
