<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Forum Interactif</v-toolbar-title>
      <v-spacer />
      <NuxtLink to="/">Accueil</NuxtLink>
      <template v-if="session.user">
        <NuxtLink to="/profile">{{ session.user.login }}</NuxtLink>
        <NuxtLink @click.prevent="deconnexion" to="#">Déconnexion</NuxtLink>
        <NuxtLink v-if="session.user.role==='admin'" to="/admin">Admin</NuxtLink>
      </template>
      <template v-else>
        <NuxtLink to="/login">Connexion</NuxtLink>
        <NuxtLink to="/register">Inscription</NuxtLink>
      </template>
    </v-app-bar>
    <v-main><NuxtPage /></v-main>
  </v-app>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useSession } from '#imports'
import { useRouter } from 'vue-router'

const { session, reset } = await useSession()
watch(() => session.value.user, u => {
  console.log('[SESSION]', u ? `logged in as ${u.login}` : 'logged out')
})

function deconnexion() {
  $fetch('/api/logout', { method: 'POST', credentials: 'include' })
    .then(() => {
      reset()
      console.log('[SESSION] logged out')
    })
}
</script>

