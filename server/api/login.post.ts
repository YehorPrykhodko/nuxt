import bcrypt from 'bcryptjs'
import { readBody, createError } from 'h3'
import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { signJWT } from '~/server/utils/jwt'

export default defineWrappedResponseHandler(async (event) => {
  console.log('API POST /api/login', {
    params: event.context.params,
    query:  event.context.query
  })

  const { login, password } = await readBody<{
    login?: string
    password?: string
  }>(event)
  if (!login || !password) {
    throw createError({
      statusCode:   400,
      statusMessage: 'Champs "login" et "password" requis.'
    })
  }

  const db = event.context.mysql

  const [rows] = await db.execute<any[]>(
    'SELECT id, password, role FROM users WHERE login = ?',
    [login]
  )
  if (!Array.isArray(rows) || rows.length === 0) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides' })
  }

  const usr = rows[0]

  const valid = await bcrypt.compare(password, usr.password)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides' })
  }

  const user = { id: usr.id, login, role: usr.role }
  const token = signJWT(user)

  return {
    ok:    true,
    token,
    user
  }
})
