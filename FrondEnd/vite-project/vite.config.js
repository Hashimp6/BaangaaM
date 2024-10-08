import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  server: {
    proxy: {
      '/maps': {
        target: 'https://maps.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/maps/, '')
      },
      '/api': 'http://localhost:3200',
    },
  },
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material/Tooltip',
      'react-easy-crop'  
    ],
  },
  build: {
    rollupOptions: {
      external: [
        '@rollup/rollup-linux-x64-gnu'
      ]
    }
  },
  esbuild: {
    target: 'esnext'
  }
});