import { defineNuxtPlugin, useAuthStore } from '#imports'

export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  return {
    provide: {},
    hooks: {
      'vue:setup': () => {
        // noop
      }
    },
    // Настраиваем глобальный $fetch
    setup() {
      return {}
    }
  }
})
