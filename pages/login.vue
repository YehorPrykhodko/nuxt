<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title>Connexion</v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent="onSubmit">
              <v-text-field v-model="login" label="Login" required />
              <v-text-field v-model="password" label="Mot de passe" type="password" required />
              <v-btn type="submit" color="primary" :loading="loading" class="mt-4">Se connecter</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '#imports'

const login = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const { session, refresh } = await useSession()

async function onSubmit() {
  console.log('[LOGIN] Trying to log in', login.value)
  loading.value = true
  try {
    const res = await $fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      body: { login: login.value, password: password.value }
    })
    console.log('[LOGIN] Response', res)
    if (res.ok) {
      await refresh()
      console.log('[LOGIN] Session refreshed')
      router.push('/')
    }
  } catch (e) {
    console.error('[LOGIN] Error', e)
  } finally {
    loading.value = false
  }
}
</script>
