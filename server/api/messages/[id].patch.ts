// server/api/messages/[id].patch.ts
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

  const { id } = event.context.params
  const { contenu } = await readBody<{ contenu?: string }>(event)

  if (!contenu) {
    throw createError({ statusCode: 400, statusMessage: 'Contenu requis' })
  }

  const db = event.context.mysql

  // Дополнительно можно проверить владельца сообщения, если потребуется

  await db.execute(
    'UPDATE messages SET contenu = ? WHERE id = ? AND user_id = ?',
    [contenu, id, userId]
  )

  return { success: true }
})
