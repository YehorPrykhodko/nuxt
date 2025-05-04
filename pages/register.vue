<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title>Inscription</v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent="onSubmit">
              <v-text-field
                v-model="login"
                label="Login"
                required
              />
              <v-text-field
                v-model="password"
                label="Mot de passe"
                type="password"
                required
              />
              <v-btn
                type="submit"
                color="primary"
                :loading="loading"
                class="mt-4"
              >
                S'inscrire
              </v-btn>
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

const login = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

async function onSubmit() {
  console.log('[REGISTER] Submitting', login.value)
  loading.value = true
  try {
    const res = await $fetch('/api/users', {
      method: 'POST',
      body: { login: login.value, password: password.value }
    })
    console.log('[REGISTER] Response', res)
    if (res.ok) {
      router.push('/login')
    }
  } catch (e) {
    console.error('[REGISTER] Error', e)
  } finally {
    loading.value = false
  }
}
</script>

