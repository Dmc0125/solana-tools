import { sveltekit } from '@sveltejs/kit/vite'
import nodePolyfills from 'rollup-plugin-node-polyfills'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	optimizeDeps: {
		esbuildOptions: {
			target: 'esnext',
			define: {
				global: 'globalThis',
			},
			inject: ['rollup-plugin-node-polyfills/polyfills/buffer-es6.js'],
		},
	},
	build: {
		rollupOptions: {
			plugins: [nodePolyfills({ crypto: true, buffer: true })],
		},
	},
}

export default config
