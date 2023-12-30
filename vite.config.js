/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';
import liveReload from 'vite-plugin-live-reload';
import macrosPlugin from 'vite-plugin-babel-macros';

// https://vitejs.dev/config/
export default defineConfig({
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
    liveReload('./src'),
    reactRefresh(),
    macrosPlugin(),
  ],
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
