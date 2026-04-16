import pluginChecker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { loadEnv } from 'vite';

const envDir = './environment';

export default ({ mode }: { mode: any }) => {
  const env = loadEnv(mode, envDir);

  return defineConfig({
    base: env.VITE_APP_PUBLIC_URL,
    plugins: [react(), svgr(), pluginChecker({ typescript: true })],
    envDir: envDir,
    server: {
      open: true,
      port: 3000,
    },
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use 'tycho-storybook/dist/styles/base/typographs' as *;
          `,
          includePaths: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'node_modules/tycho-storybook/dist/styles'),
          ],
        },
      },
    },
  });
};
