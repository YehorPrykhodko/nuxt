// ~/plugins/auth-init.client.ts
import { defineNuxtPlugin } from '#app'
import { useAuthStore }     from '~/stores/authStore'

export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  auth.initFromStorage()
})
