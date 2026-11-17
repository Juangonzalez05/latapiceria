// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // URL absoluta para canonical y Open Graph. En Vercel se toma el dominio de producción del proyecto
  // (VERCEL_PROJECT_PRODUCTION_URL, disponible al compilar); con dominio propio, Vercel lo entrega ahí mismo.
  site: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://latapiceria.example',
  vite: {
    plugins: [tailwindcss()],
  },
});
