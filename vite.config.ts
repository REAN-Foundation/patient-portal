import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

// export default defineConfig({
// 	plugins: [sveltekit()],
// 	test: {
// 		include: ['src/**/*.{test,spec}.{js,ts}']
// 	}
// });

export default defineConfig({
	plugins: [sveltekit(), purgeCss()],
    optimizeDeps: {
        entries: ['src/routes/**/+*.{js,ts,svelte}', 'src/hooks*.{js,ts}']
    }
});
