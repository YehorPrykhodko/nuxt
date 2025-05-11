<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Forum Interactif</v-toolbar-title>
      <v-spacer />
      
      <div class="nav-links d-flex align-center">
        <NuxtLink class="mx-2" to="/">Accueil</NuxtLink>
        <template v-if="auth.user">
          <NuxtLink class="mx-2" to="/admin" v-if="auth.user.role === 'admin'">Admin</NuxtLink>
          <a href="#" @click.prevent="logout" class="mx-2">Déconnexion</a>
        </template>
        <template v-else>
          <NuxtLink class="mx-2" to="/login">Connexion</NuxtLink>
          <NuxtLink class="mx-2" to="/register">Inscription</NuxtLink>
        </template>
      </div>
    </v-app-bar>

    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push("/");
}
</script>

<style scoped>
.nav-links a,
.nav-links .router-link-active {
  text-decoration: none;
  color: inherit;
  font-weight: 500;
}
</style>