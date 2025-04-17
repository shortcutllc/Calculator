import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        calculator: resolve(__dirname, 'public/calculator.html'),
        proposal: resolve(__dirname, 'public/proposal.html')
      }
    }
  },
  server: {
    port: 3001,
    open: '/calculator.html'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './public'),
      '@js': resolve(__dirname, './public/js'),
      '@services': resolve(__dirname, './public/js'),
      '@css': resolve(__dirname, './public/css'),
      '@assets': resolve(__dirname, './public/assets')
    }
  },
  optimizeDeps: {
    include: ['uuid']
  }
}); 