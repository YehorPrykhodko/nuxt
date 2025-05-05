// /middleware/auth.global.ts   ← Nuxt route middleware, runs on every page navigation
import { defineNuxtRouteMiddleware, useCookie, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie('auth_token').value
  // if (!token && to.path !== '/login' && to.path !== '/register') {
  //   // if no token, redirect to login
  //   return navigateTo('/login')
  // }
  // optionally, you can validate token here...
})
