import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { readBody, createError, getHeader } from 'h3'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '~/server/config/auth'
import { broadcastMessage } from '~/server/routes/_ws'

export default defineWrappedResponseHandler(async (event) => {
  const authHeader = getHeader(event, 'Authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Token requis' })
  }

  const token = authHeader.split(' ')[1]
  let payload: any
  try {
    payload = jwt.verify(token, jwtSecret)
  } catch {
    throw createError({ statusCode: 403, statusMessage: 'Token invalide' })
  }

  const { sujetId, contenu } = await readBody(event)
  if (!sujetId || !contenu) {
    throw createError({ statusCode: 400, statusMessage: 'Champs requis' })
  }

  const db = event.context.mysql
  await db.execute(
    'INSERT INTO messages (sujet_id, user_id, contenu) VALUES (?, ?, ?)',
    [sujetId, payload.id, contenu]
  )

  broadcastMessage(JSON.stringify({ type: 'newMessage', payload: { sujetId } }))

  return { success: true }
})
