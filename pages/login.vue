<template>
  <v-container>
    <h1>Connexion</h1>
    <v-form @submit.prevent="doLogin">
      <v-text-field
        v-model="loginModel"
        label="Login"
        required
      />
      <v-text-field
        v-model="passwordModel"
        label="Mot de passe"
        type="password"
        autocomplete="current-password"
        required
      />
      <v-btn type="submit" color="primary">Se connecter</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { navigateTo } from '#imports'       // Nuxt 3-way навигация
import { useAuthStore } from '~/stores/authStore'

const auth          = useAuthStore()
const loginModel    = ref('')
const passwordModel = ref('')

async function doLogin() {
  // === 1) шлём правильный payload, а не ref-ы ===
  const res = await $fetch('/api/login', {
    method: 'POST',
    credentials: 'include',
    body: {
      login:    loginModel.value,
      password: passwordModel.value
    }
  })

  // === 2) заливаем в Pinia store ===
  // предполагаем что сервер возвращает { user, token }
  auth.login(res.user, res.token)

  // === 3) навигируем на главную ===
  await navigateTo('/')
}
</script>

