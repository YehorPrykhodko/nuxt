import { readBody, getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'
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

  const { nom } = await readBody(event)
  if (!nom) {
    throw createError({ statusCode: 400, statusMessage: 'Nom du forum requis' })
  }

  const db = event.context.mysql
  await db.execute('INSERT INTO forums (nom) VALUES (?)', [nom])

  return { success: true }
})
