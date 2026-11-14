import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { parseResume } from './src/data/load';
import { renderBack, renderFront } from './src/html/render';
import { escapeHtml } from './src/html/typography';

const root = import.meta.dirname;
const yamlPath = resolve(root, 'src/data/resume.yaml');
const bootPath = resolve(root, 'src/boot-scale.js');

/** Prints the resume from the yaml into both pages at build and on every dev request. */
function resumeHtml(): Plugin {
  return {
    name: 'resume-html',
    configureServer(server) {
      server.watcher.add([yamlPath, bootPath]);
      server.watcher.on('change', (file) => {
        if (file === yamlPath || file === bootPath) server.ws.send({ type: 'full-reload' });
      });
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const resume = parseResume(readFileSync(yamlPath, 'utf8'));
        const boot = readFileSync(bootPath, 'utf8');
        const plainBoot = boot.replace('Math.min(Math.max(w * 0.62, 760), 1000, w - 32)', 'Math.min(816, w - 32)');
        return html
          .replaceAll('%NAME%', () => escapeHtml(resume.header.name))
          .replaceAll('%TITLE%', () => escapeHtml(resume.header.title))
          .replace('/*boot-scale*/', () => boot)
          .replace('/*boot-scale-plain*/', () => plainBoot)
          .replace('<!--sheet-front-->', () => renderFront(resume))
          .replace('<!--sheet-back-->', () => renderBack());
      },
    },
  };
}

export default defineConfig({
  plugins: [resumeHtml()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        plain: resolve(root, 'plain/index.html'),
      },
    },
  },
  optimizeDeps: { exclude: ['three'] },
  server: { port: 5199, strictPort: true },
});
