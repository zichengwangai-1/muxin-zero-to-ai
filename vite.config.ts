import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), {
    name: 'admin-directory-index',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const incoming = request as typeof request & { url?: string };
        if (/^\/admin\/?(?:\?|$)/.test(incoming.url ?? '')) incoming.url = incoming.url!.replace(/^\/admin\/?/, '/admin/index.html');
        next();
      });
    },
  }],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
