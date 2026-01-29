import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import autoImport from 'unplugin-auto-import/vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    base: './',
    resolve: {
      alias: {
        renderer: resolve('src/renderer'),
      },
    },
    plugins: [
      react(),
      svgr(),
      viteStaticCopy({
        targets: [
          {
            src: `${resolve('node_modules')}/@tldraw/assets/**/*`,
            dest: 'tldraw-assets',
          },
        ],
      }),
      autoImport({
        imports: [
          'react',
          'react-dom',
          {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'react-i18next': ['useTranslation'],
          },
        ],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
    ],
  },
});
