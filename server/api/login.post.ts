// server/api/login.post.ts
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { readBody, createError } from 'h3'
import { defineSQLHandler } from '~/server/utils/mysql'

const JWT_SECRET = process.env.JWT_SECRET 

export default defineSQLHandler(async (event) => {
  console.log('[API] POST /api/login')

  const { login, password } = await readBody<{ login?: string; password?: string }>(event)
  if (!login || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Champs manquants' })
  }

  const db = event.context.mysql

  // Crée le compte admin par défaut (optionnel)
  await db.execute(`
    INSERT IGNORE INTO users (login, password, role)
    VALUES (
      'admin',
      '$2b$12$tlTdIrnZJYq48QPmkWK3pOKufFGy22s34cA2WXSX.bBpnHHTQh2WW',
      'admin'
    )
  `)

  const [rows] = await db.execute<any[]>(
    'SELECT id, password, role FROM users WHERE login = ?',
    [login]
  )
  if (!Array.isArray(rows) || rows.length === 0) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides' })
  }

  const user = rows[0]
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides' })
  }

  // Génère un JWT
  const token = jwt.sign(
    { id: user.id, login, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  return {
    ok: true,
    user: { id: user.id, login, role: user.role },
    token
  }
})
