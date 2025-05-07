// server/api/admin/users.post.ts
import bcrypt from 'bcryptjs'
import { readBody, createError } from 'h3'
import { defineSQLHandler } from '~/server/utils/mysql'

export default defineSQLHandler(async (event) => {
  // Vérifier que l’utilisateur courant est admin :
  const sess = event.context.session
  if (!sess.user?.role || sess.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }

  const { login, password } = await readBody<{login?:string;password?:string}>(event)
  if (!login || !password) {
    throw createError({ statusCode: 400, statusMessage: 'login & password requis' })
  }

  const db = event.context.mysql
  // hash + insertion
  const hash = await bcrypt.hash(password, 12)
  await db.execute(
    'INSERT INTO users (login, password, role) VALUES (?, ?, "admin")',
    [login, hash]
  )

  return { ok: true }
})
