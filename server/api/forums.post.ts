// server/api/forums.post.ts
// Code généré par une IA – création d'un forum (admin requis)
import { defineSQLHandler } from '~/server/utils/mysql'
import { readBody, createError } from 'h3'
import { getRequestURL } from 'h3'
// server/api/some-endpoint.ts
console.log('[API] forums.post loaded');
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

  const body = await readBody<{ nom?: string }>(event)
  console.log('[API] body:', body);
  if (!body?.nom) {
    throw createError({ statusCode: 400, statusMessage: 'Nom manquant' })
  }

console.log('[API]', 'Body received:', body)

  const db = event.context.mysql
  await db.execute('INSERT INTO forums (nom) VALUES (?)', [body.nom])
  return { ok: true }
})
