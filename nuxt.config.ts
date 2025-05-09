// nuxt.config.ts – глобальная конфигурация Nuxt 3 + Vuetify + Pinia + Dotenv
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools : true,

  // 1) Рендерим на сервере (SSR) + Nitro "node-server"
  ssr      : true,
  nitro    : {
    preset : 'node-server'
  },

  // 2) Плагины
  modules  : [
    '@pinia/nuxt',     // хранилище
    'vuetify-nuxt-module'   
  ],
  vuetify: {
    vuetifyOptions: {
      ssr: true // это обязательно для серверного рендеринга
    }
  },

  // 3) Aliases для server/utils
  alias    : {
    '~/utils' : '/server/utils'
  },

  // 4) Runtime env, доступен из process.env / useRuntimeConfig()
  // runtimeConfig: {
  //   JWT_SECRET : process.env.JWT_SECRET || 'dev‑secret',
  //   DB_HOST    : process.env.DB_HOST    || 'db',
  //   DB_USER    : process.env.DB_USER    || 'root',
  //   DB_PASS    : process.env.DB_PASS    || 'root',
  //   DB_NAME    : process.env.DB_NAME    || 'forum'
  // },

  // 5) CSS + Vuetify (ведь у вас Vuetify 3)
  css: [
    'vuetify/styles',
  ],
  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: { 'process.env.DEBUG': false }
  }
})
