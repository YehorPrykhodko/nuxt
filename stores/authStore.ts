import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref('')

  function login(newUser: any, newToken: string) {
    user.value = newUser
    token.value = newToken
  }

  function logout() {
    user.value = null
    token.value = ''
  }

  return { user, token, login, logout }
})
