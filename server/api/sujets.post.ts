// server/api/sujets.post.ts
// Code généré par une IA – création d'un sujet + message initial
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
  const body = await readBody<{ forumId?: number; titre?: string; msg?: string }>(event)
  console.log('[API] body:', body);
  if (!body?.forumId || !body.titre || !body.msg) {
    throw createError({ statusCode: 400, statusMessage: 'Champs manquants' })
  }
console.log('[API]', 'Body received:', body)
  const db = event.context.mysql
  const [res] = await db.execute<any>('INSERT INTO sujets (forum_id, user_id, titre) VALUES (?,?,?)',
    [body.forumId, sess.user.id, body.titre])
  const sujetId = res.insertId
  await db.execute('INSERT INTO messages (sujet_id, user_id, contenu) VALUES (?,?,?)',
    [sujetId, sess.user.id, body.msg])

  // TODO: broadcast WebSocket "newSujet"
  return { ok: true, id: sujetId }
})
