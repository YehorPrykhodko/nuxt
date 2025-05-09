<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Forum Interactif</v-toolbar-title>
      <v-spacer />
      <NuxtLink to="/">Accueil</NuxtLink>
      <template v-if="auth.user">
        <a href="#" @click.prevent="logout">Déconnexion</a>
        <NuxtLink v-if="auth.user.role === 'admin'" to="/admin">Admin</NuxtLink>
      </template>
      <template v-else>
        <NuxtLink to="/login">Connexion</NuxtLink>
        <NuxtLink to="/register">Inscription</NuxtLink>
      </template>
    </v-app-bar>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/')
}
</script>
