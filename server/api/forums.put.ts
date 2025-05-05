// server/api/forums.put.ts
// Code généré par une IA – renommage forum (admin)
import { defineSQLHandler } from '~/server/utils/mysql'
import { readBody, createError } from 'h3'
import { getRequestURL } from 'h3'
// server/api/some-endpoint.ts
console.log('[API] forums.put loaded');
export default defineSQLHandler(async (event) => {
/* AUTOMATIC LOG */ 
console.log(
  '[API]',
  event.method,
  getRequestURL(event).toString(),
  { params: event.context?.params, query: event.context?.query }
);
  const sess = event.context.session
  if (!sess.user || sess.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }
  const body = await readBody<{ id?: number; nom?: string }>(event)
  console.log('[API] body:', body);
  if (!body?.id || !body.nom) {
    throw createError({ statusCode: 400, statusMessage: 'Paramètres manquants' })
  }

console.log('[API]', 'Body received:', body)

  const db = event.context.mysql
  await db.execute('UPDATE forums SET nom = ? WHERE id = ?', [body.nom, body.id])
  return { ok: true }
})
