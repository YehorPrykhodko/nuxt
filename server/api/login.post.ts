// server/api/login.post.ts
// Code généré par une IA – connexion utilisateur
import bcrypt from 'bcryptjs'
import { readBody, createError } from 'h3'
import { defineSQLHandler } from '~/server/utils/mysql'
// server/api/some-endpoint.ts
console.log('[API]', 'Loaded endpoint', __filename)

export default defineSQLHandler(async (event) => {
  const body = await readBody<{ login?: string; password?: string }>(event)
  const { login, password } = body || {}
  if (!login || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Champs manquants' })
  }

  console.log('[API]', 'Body received:', body)

  const db = event.context.mysql

  // Vérifie la présence du compte admin par défaut
  await db.execute(`
    INSERT IGNORE INTO users (login, password, role)
    VALUES ('admin', '$2b$12$tlTdIrnZJYq48QPmkWK3pOKufFGy22s34cA2WXSX.bBpnHHTQh2WW', 'admin')
  `)

  const [rows] = await db.execute<any[]>(
    'SELECT id, password, role FROM users WHERE login = ?',
    [login]
  )
  if (!Array.isArray(rows) || rows.length === 0) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides' })
  }

  const usr = rows[0]
  const ok = await bcrypt.compare(password, usr.password)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides' })
  }

  // On stocke les infos essentielles en session
  event.context.session.user = { id: usr.id, login, role: usr.role }

  return { ok: true, user: { id: usr.id, login, role: usr.role } }
})
