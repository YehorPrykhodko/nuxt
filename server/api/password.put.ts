import bcrypt from 'bcryptjs'
import { readBody, getHeader, createError, getRequestURL } from 'h3'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '~/server/config/auth'
import { defineWrappedResponseHandler } from '~/server/utils/mysql'

console.log('[API] password.put loaded')

export default defineWrappedResponseHandler(async (event) => {
  console.log(
    '[API]',
    event.method,
    getRequestURL(event).toString(),
    { params: event.context?.params, query: event.context?.query }
  )

  const authHeader = getHeader(event, 'Authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Token requis' })
  }

  let payload: any
  try {
    const token = authHeader.split(' ')[1]
    payload = jwt.verify(token, jwtSecret)
  } catch {
    throw createError({ statusCode: 403, statusMessage: 'Token invalide' })
  }

  const body = await readBody<{ oldPwd?: string; newPwd?: string }>(event)
  const { oldPwd, newPwd } = body || {}
  if (!oldPwd || !newPwd) {
    throw createError({ statusCode: 400, statusMessage: 'Champs manquants' })
  }

  const db = event.context.mysql
  const [rows] = await db.execute<any[]>(
    'SELECT password FROM users WHERE id = ?',
    [payload.id]
  )
  if (!Array.isArray(rows) || rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Utilisateur introuvable' })
  }

  const ok = await bcrypt.compare(oldPwd, rows[0].password)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: 'Mot de passe actuel incorrect' })
  }

  const hash = await bcrypt.hash(newPwd, 10)
  await db.execute('UPDATE users SET password = ? WHERE id = ?', [hash, payload.id])

  return { ok: true }
})
