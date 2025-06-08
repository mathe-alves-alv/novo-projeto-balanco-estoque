import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-netlify'; // <-- Garanta que está importando o 'adapter-netlify'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter() // <-- E usando ele aqui
    }
};

export default config;