import { readBody, getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { jwtSecret } from '~/server/config/auth'
import { defineWrappedResponseHandler } from '~/server/utils/mysql'

export default defineWrappedResponseHandler(async (event) => {
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

  if (payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }

  const { login, password } = await readBody(event)
  if (!login || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Champs manquants' })
  }

  const db = event.context.mysql

  const [existing] = await db.execute('SELECT id FROM users WHERE login = ?', [login])
  if (Array.isArray(existing) && existing.length > 0) {
    throw createError({ statusCode: 409, statusMessage: 'Login déjà utilisé' })
  }

  const hash = await bcrypt.hash(password, 10)
  await db.execute(
    'INSERT INTO users (login, password, role) VALUES (?, ?, "admin")',
    [login, hash]
  )

  return { success: true }
})
