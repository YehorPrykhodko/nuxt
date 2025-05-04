// server/api/messages.delete.ts
// Code généré par une IA – suppression d'un message (admin ou auteur)
import { defineSQLHandler } from '~/server/utils/mysql'
import { readBody, createError } from 'h3'
// server/api/some-endpoint.ts

export default defineSQLHandler(async (event) => {
/* AUTOMATIC LOG */ 
console.log(
  '[API]',
  event.method,
  event.node.req.url,
  { params: event.context?.params, query: event.context?.query }
);
  const sess = event.context.session
  if (!sess.user) {
    throw createError({ statusCode: 401, statusMessage: 'Connexion requise' })
  }
  const body = await readBody<{ id?: number }>(event)
  console.log('[API] body:', body);
  if (!body?.id) {
    throw createError({ statusCode: 400, statusMessage: 'ID manquant' })
  }

console.log('[API]', 'Body received:', body)

  const db = event.context.mysql
  const [[row]]: any = await db.execute('SELECT user_id FROM messages WHERE id = ?', [body.id])
  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Message introuvable' })
  }
  if (row.user_id !== sess.user.id && sess.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }
  await db.execute('DELETE FROM messages WHERE id = ?', [body.id])
  return { ok: true }
})
