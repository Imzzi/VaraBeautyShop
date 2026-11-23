import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { PRODUCTS } from './src/data/products';
import { DEFAULT_PRODUCT_IMAGE, getProductCover, HERO_PRODUCT_IDS } from './src/lib/productImages';

const productPreloads = Object.fromEntries(PRODUCTS
  .map((product) => [product.id, getProductCover(product)] as const)
  .filter(([, image]) => image !== DEFAULT_PRODUCT_IMAGE));
const preloadData = JSON.stringify({
  hero: productPreloads[HERO_PRODUCT_IDS[0]], products: productPreloads,
}).replace(/</g, '\\u003c');

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'vara-critical-image',
        transformIndexHtml: {
          order: 'pre',
          handler: (html) => html.replace('<!-- vara:critical-image -->', `<script>(() => {
  const route = location.hash.startsWith('#/product/') && location.pathname === '/'
    ? location.hash.slice(1) : location.pathname;
  const match = /^\\/product\\/([a-z0-9_-]+)(?:[/?]|$)/i.exec(route);
  const images = ${preloadData};
  let src = match && Object.hasOwn(images.products, match[1]) ? images.products[match[1]] : null;
  if (route === '/' && !location.hash) src = images.hero;
  if (!src) return;
  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.as = 'image';
  preload.fetchPriority = 'high';
  preload.referrerPolicy = 'no-referrer';
  preload.href = src;
  document.head.append(preload);
})();</script>`),
        },
      },
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
      __VARA_SERVERLESS__: JSON.stringify(process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV)),
    },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom') || id.includes('/react/') || id.includes('react-helmet-async') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              if (id.includes('motion') || id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              return 'vendor';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
