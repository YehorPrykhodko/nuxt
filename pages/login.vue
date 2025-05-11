<template>
  <v-container>
    <h1>Connexion</h1>
    <v-form @submit.prevent="doLogin">
      <v-text-field v-model="loginModel" label="Login" required />
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'

const auth = useAuthStore()
const loginModel = ref('')
const passwordModel = ref('')
const router = useRouter()

async function doLogin() {
  try {
    const { user, token } = await $fetch('/api/login', {
      method: 'POST',
      body: {
        login: loginModel.value,
        password: passwordModel.value,
      },
    })
    auth.login(user, token)
    router.push('/')
  } catch (err: any) {
    console.error('LOGIN ERROR', err?.data || err)
    alert(err?.data?.message || err?.message || 'Erreur lors de la connexion')
  }
}
</script>