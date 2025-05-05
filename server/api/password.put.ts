// server/api/password.put.ts
// Code généré par une IA – changement de mot de passe
import bcrypt from 'bcryptjs'
import { readBody, createError } from 'h3'
import { defineSQLHandler } from '~/server/utils/mysql'
// server/api/some-endpoint.ts
import { getRequestURL } from 'h3'
export default defineSQLHandler(async (event) => {
/* AUTOMATIC LOG */ 
console.log(
  '[API]',
  event.method,
  getRequestURL(event).toString(),
  { params: event.context?.params, query: event.context?.query }
);
  // Vérifie qu'on est connecté
  const sess = event.context.session
  if (!sess.user) {
    throw createError({ statusCode: 401, statusMessage: 'Non connecté' })
  }

  const body = await readBody<{ oldPwd?: string; newPwd?: string }>(event)
  console.log('[API] body:', body);
  const { oldPwd, newPwd } = body || {}
  if (!oldPwd || !newPwd) {
    throw createError({ statusCode: 400, statusMessage: 'Champs manquants' })
  }
console.log('[API]', 'Body received:', body)

  const db = event.context.mysql
  const [rows] = await db.execute<any[]>(
    'SELECT password FROM users WHERE id = ?',
    [sess.user.id]
  )
  if (!Array.isArray(rows) || rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Utilisateur introuvable' })
  }

  const ok = await bcrypt.compare(oldPwd, rows[0].password)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: 'Mot de passe actuel incorrect' })
  }

  const hash = await bcrypt.hash(newPwd, 10)
  await db.execute('UPDATE users SET password = ? WHERE id = ?', [hash, sess.user.id])

  return { ok: true }
})
