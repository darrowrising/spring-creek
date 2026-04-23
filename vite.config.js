/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';
import liveReload from 'vite-plugin-live-reload';
import macrosPlugin from 'vite-plugin-babel-macros';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Anchor to this file so `root` / `.env*` resolution does not depend on process cwd.
const srcRoot = path.resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig(() => {
  // Vitest loads Vite config; avoid watch-based plugins keeping the process alive.
  const isTest = Boolean(process.env.VITEST);

  return {
    root: srcRoot,
    envDir: srcRoot,
    plugins: [
      react({
        babel: {
          plugins: [
            [
              'babel-plugin-styled-components',
              {
                displayName: true,
                fileName: false,
              },
            ],
          ],
        },
      }),
      !isTest && liveReload('.'),
      !isTest && reactRefresh(),
      macrosPlugin(),
    ].filter(Boolean),
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
  };
});
