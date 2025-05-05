// stores/authStore.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { id: number, login: string, role?: string },
    token: null as null | string
  }),
  actions: {
    login(user: any, token: string) {
      this.user  = user
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },
    logout() {
      this.user  = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    initFromStorage() {
      const token = localStorage.getItem('token')
      const userS = localStorage.getItem('user')
      if (token) {
        this.token = token
      }
      if (userS) {
        try {
          this.user = JSON.parse(userS)
        } catch {
          localStorage.removeItem('user')
        }
      }
    }
  }
})
