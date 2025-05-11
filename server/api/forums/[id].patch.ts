import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { readBody, getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '~/server/config/auth'


export default defineWrappedResponseHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Authorization header required' })
  }
  const token = authHeader.split(' ')[1]
  let payload: any
  try {
    payload = jwt.verify(token, jwtSecret)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  if (payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }

  const { id } = event.context.params

  const { nom } = await readBody<{ nom?: string }>(event)
  if (!nom) {
    throw createError({ statusCode: 400, statusMessage: 'Le champ "nom" est requis' })
  }

  const db = event.context.mysql
  await db.execute(
    'UPDATE forums SET nom = ? WHERE id = ?',
    [nom, id]
  )

  return { ok: true }
})
