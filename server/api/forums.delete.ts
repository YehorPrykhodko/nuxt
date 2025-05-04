// server/api/forums.delete.ts
// Code généré par une IA – suppression forum (admin)
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
  // Cascade: suppression sujets + messages
  await db.execute('DELETE FROM messages WHERE sujet_id IN (SELECT id FROM sujets WHERE forum_id = ?)', [body.id])
  await db.execute('DELETE FROM sujets WHERE forum_id = ?', [body.id])
  await db.execute('DELETE FROM forums WHERE id = ?', [body.id])
  return { ok: true }
})
