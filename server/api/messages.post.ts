// server/api/messages.post.ts
// Code généré par une IA – création d'un message
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
  const body = await readBody<{ sujetId?: number; contenu?: string }>(event)
  console.log('[API] body:', body);
  if (!body?.sujetId || !body.contenu) {
    throw createError({ statusCode: 400, statusMessage: 'Champs manquants' })
  }

console.log('[API]', 'Body received:', body)

  const db = event.context.mysql
  await db.execute('INSERT INTO messages (sujet_id, user_id, contenu) VALUES (?,?,?)',
    [body.sujetId, sess.user.id, body.contenu])

  // Mise à jour updated_at du sujet
  await db.execute('UPDATE sujets SET updated_at = NOW() WHERE id = ?', [body.sujetId])

  // TODO: broadcast WebSocket "newMessage"
  return { ok: true }
})
