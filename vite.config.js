/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';
import liveReload from 'vite-plugin-live-reload';
import macrosPlugin from 'vite-plugin-babel-macros';

// https://vitejs.dev/config/
export default defineConfig(() => {
  // Vitest loads Vite config; avoid watch-based plugins keeping the process alive.
  const isTest = Boolean(process.env.VITEST);

  return {
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
      !isTest && liveReload('./src'),
      !isTest && reactRefresh(),
      macrosPlugin(),
    ].filter(Boolean),
    root: 'src',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
  };
});
