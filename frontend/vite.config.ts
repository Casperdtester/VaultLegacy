import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    base: '/',
    plugins: [
        nodePolyfills({
            globals: { Buffer: true, global: true, process: true },
            overrides: { crypto: 'crypto-browserify' },
        }),
        react(),
    ],
    resolve: {
        alias: { global: 'global' },
        mainFields: ['module', 'main', 'browser'],
        dedupe: ['react', 'react-dom'],
    },
    server: {
        port: 5173,
        open: true,
    },
});
