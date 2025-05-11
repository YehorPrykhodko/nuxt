export default defineNuxtConfig({
  devtools: true,
  ssr: true,
  nitro: {
    preset: 'node-server',
    experimental: {
      websocket: true
    }
  },
  modules: [
    '@pinia/nuxt',
    'vuetify-nuxt-module'
  ],
  vuetify: {
    vuetifyOptions: {
      ssr: true
    }
  },
  alias: {
    '~/utils': '/server/utils'
  },
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: { 'process.env.DEBUG': false }
  }
})
