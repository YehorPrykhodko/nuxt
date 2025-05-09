import { readBody, getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '~/server/config/auth'
import { defineWrappedResponseHandler } from '~/server/utils/mysql'

export default defineWrappedResponseHandler(async (event) => {
  const { id } = event.context.params
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
    throw createError({ statusCode: 400, statusMessage: 'Nom requis' })
  }

  const db = event.context.mysql
  await db.execute('UPDATE forums SET nom = ? WHERE id = ?', [nom, id])

  return { success: true }
})
