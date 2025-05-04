// server/api/forums.put.ts
// Code généré par une IA – renommage forum (admin)
import { defineSQLHandler } from '~/server/utils/mysql'
import { readBody, createError } from 'h3'
// server/api/some-endpoint.ts
console.log('[API]', 'Loaded endpoint', __filename)

export default defineSQLHandler(async (event) => {
  const sess = event.context.session
  if (!sess.user || sess.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }
  const body = await readBody<{ id?: number; nom?: string }>(event)
  if (!body?.id || !body.nom) {
    throw createError({ statusCode: 400, statusMessage: 'Paramètres manquants' })
  }

console.log('[API]', 'Body received:', body)

  const db = event.context.mysql
  await db.execute('UPDATE forums SET nom = ? WHERE id = ?', [body.nom, body.id])
  return { ok: true }
})
