import bcrypt from 'bcryptjs'
import { readBody, createError } from 'h3'
import { defineWrappedResponseHandler } from '~/server/utils/mysql'

export default defineWrappedResponseHandler(async (event) => {
  console.log('API POST /api/users', {
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

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      login VARCHAR(64) UNIQUE,
      password VARCHAR(255),
      role ENUM('admin','user') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)

  const [exists] = await db.execute<any[]>(
    'SELECT id FROM users WHERE login = ?',
    [login]
  )
  if (Array.isArray(exists) && exists.length) {
    throw createError({
      statusCode:   409,
      statusMessage: 'Ce login est déjà utilisé.'
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  await db.execute(
    'INSERT INTO users (login, password) VALUES (?, ?)',
    [login, hashedPassword]
  )

  return { ok: true }
})
