import { readBody, getHeader, createError, getRequestURL } from 'h3'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '~/server/config/auth'
import { defineWrappedResponseHandler } from '~/server/utils/mysql'

console.log('API sujets.delete loaded')

export default defineWrappedResponseHandler(async (event) => {
  console.log(
    'API',
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

  if (payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }

  const body = await readBody<{ id?: number }>(event)
  if (!body?.id) {
    throw createError({ statusCode: 400, statusMessage: 'ID manquant' })
  }

  const db = event.context.mysql
  await db.execute('DELETE FROM messages WHERE sujet_id = ?', [body.id])
  await db.execute('DELETE FROM sujets WHERE id = ?', [body.id])

  return { ok: true }
})
