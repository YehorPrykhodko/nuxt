// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { verifyJWT } from '~/server/utils/jwt'

export default defineNuxtRouteMiddleware(async (to) => {
  const publicPaths = ['/login', '/register']
  if (publicPaths.includes(to.path)) return

  // читаем только из заголовка
  // const authHeader = useRequestHeaders()['authorization'] || ''
  // const token = authHeader.split(' ')[1]
  // if (!token) {
  //   return navigateTo('/login')
  // }

  try {
    // await verifyJWT(token)
  } catch {
    // return navigateTo('/login')
  }
})
