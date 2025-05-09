<template>
  <v-container>
    <h1>Inscription</h1>
    <v-form @submit.prevent="doRegister">
      <v-text-field v-model="loginModel" label="Login" required />
      <v-text-field
        v-model="passwordModel"
        type="password"
        label="Mot de passe"
        required
      />
      <v-btn type="submit">S'inscrire</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter }    from 'vue-router'
import { useAuthStore } from '~/stores/authStore'

const loginModel    = ref('')
const passwordModel = ref('')
const router        = useRouter()
const auth          = useAuthStore()

async function doRegister() {
  await $fetch('/api/users', {
    method: 'POST',
    body: { login: loginModel.value, password: passwordModel.value }
  })
  // ensuite auto-login
  const res = await $fetch('/api/login', {
    method: 'POST',
    body: { login: loginModel.value, password: passwordModel.value }
  })
  auth.login(res.user, res.token)
  router.push('/')
}
</script>
