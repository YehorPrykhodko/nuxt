// server/api/sujets.delete.ts
// Code généré par une IA – suppression sujet (admin)
import { defineSQLHandler } from '~/server/utils/mysql'
import { readBody, createError } from 'h3'
// server/api/some-endpoint.ts
console.log('[API]', 'Loaded endpoint', __filename)

export default defineSQLHandler(async (event) => {
  const sess = event.context.session
  if (!sess.user || sess.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }
  const body = await readBody<{ id?: number }>(event)
  if (!body?.id) {
    throw createError({ statusCode: 400, statusMessage: 'ID manquant' })
  }
console.log('[API]', 'Body received:', body)
  const db = event.context.mysql
  await db.execute('DELETE FROM messages WHERE sujet_id = ?', [body.id])
  await db.execute('DELETE FROM sujets WHERE id = ?', [body.id])
  return { ok: true }
})
