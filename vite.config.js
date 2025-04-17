import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  base: '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        calculator: resolve(__dirname, 'src/calculator.html'),
        proposal: resolve(__dirname, 'src/proposal.html')
      }
    }
  },
  server: {
    port: 3001,
    open: '/calculator.html'
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@js': resolve(__dirname, 'src/js'),
      '@services': resolve(__dirname, 'src/services'),
      '@css': resolve(__dirname, 'src/css'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  }
}); 