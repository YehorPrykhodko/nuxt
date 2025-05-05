// nuxt.config.ts
// Code généré par une IA – configuration initiale du forum interactif

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Activation du rendu côté serveur (SSR)
  ssr: true,

  nitro: {
    plugins: ['~/server/middleware/auth.ts'] // или через server/middleware/
  },

  // Modules Nuxt à charger
  modules: [// Gestion d'état centralisée
  '@pinia/nuxt', // Sessions utilisateur
  '@sidebase/nuxt-session', // Vuetify 3 pour l'UI
  'vuetify-nuxt-module', // Utilitaires serveur (MySQL & co)
  'nuxt-server-utils', 'nuxt-auth-utils'],
  auth: {
    origin: process.env.AUTH_ORIGIN,
    // другие настройки
  },
  // Configuration de Vuetify
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
    // Exemple : fichier SCSS global pour les variables
    styles: {
      configFile: 'styles/settings.scss'
    
    }
  },
    defaultAssets: {
      font: { family: 'Roboto' }
    },
    theme: {
      defaultTheme: 'light'
    }
  },

  // Configuration Nitro (backend Node)
  nitro: {
    experimental: {
      websocket: true // WebSocket natif pour le temps réel
    }
  },

  // Variables d'environnement côté serveur
  runtimeConfig: {
    mysqlHost: process.env.MYSQL_HOST || 'db',
    mysqlUser: process.env.MYSQL_USER || 'root',
    mysqlPass: process.env.MYSQL_PASS || 'root',
    mysqlDb:   process.env.MYSQL_DB   || 'forum',
    public: {
      // Paramètres exposés au navigateur si nécessaire
    }
  },

  // TypeScript strict
  typescript: {
    strict: true
  },

  app: {
    $fetch: {
      credentials: 'include'
    }
  }
})