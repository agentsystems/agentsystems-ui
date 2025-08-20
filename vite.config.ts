import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Bundle analyzer for production builds
    mode === 'analyze' && visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@api': path.resolve(__dirname, './src/api'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api/config': {
        target: 'http://localhost:18080',
        changeOrigin: true,
        // Keep /api prefix for config endpoints
      },
      '/api': {
        target: 'http://localhost:18080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // Strip /api prefix for regular endpoints like /agents
      },
    },
  },
  
  // Performance optimization
  build: {
    // Enable source maps for better debugging
    sourcemap: true,
    
    // Performance budgets
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor dependencies for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'icons-vendor': ['@heroicons/react'],
          'utils-vendor': ['axios', 'date-fns', 'zustand'],
        },
      },
    },
    
    // Warn if chunks are too large
    chunkSizeWarningLimit: 1000,
  },
}))