// server/api/logout.post.ts
// Code généré par une IA – déconnexion
import { defineEventHandler } from 'h3'
// server/api/some-endpoint.ts
console.log('[API]', 'Loaded endpoint', __filename)

export default defineEventHandler((event) => {
  event.context.session = {} as any // Réinitialise la session
  return { ok: true }
})
