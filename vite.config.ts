import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import router from 'vite-plugin-react-views'

const currentFilePath = fileURLToPath(import.meta.url)

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), router()],
	envDir: 'env',
	resolve: { alias: { '@': path.resolve(currentFilePath, '../src') } },
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return 'vendor'
					}
				}
			}
		}
	}
})
