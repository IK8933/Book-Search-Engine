import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql': { 
        target: 'http://localhost:3001',  // ✅ Backend Server URL
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/graphql/, '/graphql'), // ✅ Ensures correct path
      }
    }
  }
})



// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     open: true,
//     proxy: {
//       '/graphql': { // ✅ Make sure this matches the correct path
//         target: 'http://localhost:3001',
//         secure: false,
//         changeOrigin: true
//       }
//     }
//   }
// })


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     open: true,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3001',
//         secure: false,
//         changeOrigin: true
//       }
//     }
//   }
// })
