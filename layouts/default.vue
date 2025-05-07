<!-- layouts/default.vue -->
<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'
import { useRouter }    from 'vue-router'
import { onMounted }    from 'vue'

const auth   = useAuthStore()
const router = useRouter()

onMounted(() => {
  // only runs client-side, so localStorage is available
  auth.initFromStorage()
})

function deconnexion() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Forum</v-toolbar-title>
      <v-spacer/>
      <NuxtLink to="/">Accueil</NuxtLink>
      <template v-if="auth.user">
        <NuxtLink to="/profile">{{ auth.user.login }}</NuxtLink>
        <a @click.prevent="deconnexion">Déconnexion</a>
        <NuxtLink v-if="auth.user.role==='admin'" to="/admin">Admin</NuxtLink>
      </template>
      <template v-else>
        <NuxtLink to="/login">Connexion</NuxtLink>
        <NuxtLink to="/register">Inscription</NuxtLink>
      </template>
    </v-app-bar>

    <!-- this is where your pages will go -->
    <v-main>
      <NuxtPage/>
    </v-main>
  </v-app>
</template>