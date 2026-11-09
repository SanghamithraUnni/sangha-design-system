import {defineConfig} from 'vite';
export default defineConfig({build:{rollupOptions:{input:{gallery:'index.html',dashboard:'dashboard.html'}}},test:{environment:'jsdom',setupFiles:['./tests/setup.js']}});
