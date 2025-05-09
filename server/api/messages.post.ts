// server/api/messages.post.ts
import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { readBody, getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '~/server/config/auth'

export default defineWrappedResponseHandler(async (event) => {
  const authHeader = getHeader(event, 'Authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Authorization header required' })
  }

  const token = authHeader.split(' ')[1]
  let userId: number
  try {
    const decoded: any = jwt.verify(token, jwtSecret)
    userId = decoded.id
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  const { sujetId, contenu } = await readBody<{
    sujetId?: number
    contenu?: string
  }>(event)

  if (!sujetId || !contenu) {
    throw createError({ statusCode: 400, statusMessage: 'Champs manquants' })
  }

  const db = event.context.mysql

  await db.execute(
    'INSERT INTO messages (sujet_id, user_id, contenu) VALUES (?, ?, ?)',
    [sujetId, userId, contenu]
  )

  await db.execute(
    'UPDATE sujets SET updated_at = NOW() WHERE id = ?',
    [sujetId]
  )

  return { success: true }
})
