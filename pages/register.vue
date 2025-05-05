<template>
  <v-container>
    <h1>Inscription</h1>
    <v-form @submit.prevent="doRegister">
      <v-text-field
        v-model="loginModel"
        label="Login"
        required
      />
      <v-text-field
        v-model="passwordModel"
        label="Mot de passe"
        type="password"
        autocomplete="new-password"
        required
      />
      <v-btn type="submit" color="primary">S'inscrire</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/authStore' // ← твой Pinia store

const auth = useAuthStore()
const loginModel    = ref('')
const passwordModel = ref('')
const router        = useRouter()

async function doRegister() {
  console.log('[REGISTER] Submitting', loginModel.value)

  // Сначала создаём пользователя
  await $fetch('/api/users', {
    method: 'POST',
    body: {
      login: loginModel.value,
      password: passwordModel.value,
    },
  })

  // Затем сразу логинимся
  const res = await $fetch('/api/login', {
    method: 'POST',
    body: {
      login: loginModel.value,
      password: passwordModel.value,
    },
  })

  // Сохраняем токен и пользователя в Pinia store
  auth.login(res.user, res.token)

  // Перенаправляем на главную
  router.push('/')
}
</script>
