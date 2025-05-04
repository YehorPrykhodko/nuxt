// server/api/messages.put.ts
// Code généré par une IA – modification d'un message
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
  const body = await readBody<{ id?: number; contenu?: string }>(event)
  console.log('[API] body:', body);
  if (!body?.id || !body.contenu) {
    throw createError({ statusCode: 400, statusMessage: 'Champs manquants' })
  }

console.log('[API]', 'Body received:', body)

  const db = event.context.mysql
  // Vérifie droits
  const [[row]]: any = await db.execute('SELECT user_id FROM messages WHERE id = ?', [body.id])
  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Message introuvable' })
  }
  if (row.user_id !== sess.user.id && sess.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }
  await db.execute('UPDATE messages SET contenu = ?, updated_at = NOW() WHERE id = ?', [body.contenu, body.id])
  return { ok: true }
})
