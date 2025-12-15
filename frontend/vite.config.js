import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
plugins: [react()],
server: {
host: '0.0.0.0',
proxy: {
    '/record': 'http://localhost:5050',
    '/login': 'http://localhost:5050'
}
}
})