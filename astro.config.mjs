// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // WAJIB: Ganti dengan domain asli lu nanti pas sudah deploy
  site: 'https://ashel-quran.vercel.app/', 

  vite: {
    plugins: [tailwindcss()]
  },

  // Integrasi sitemap otomatis bikin peta situs buat Google
  integrations: [sitemap()]
});