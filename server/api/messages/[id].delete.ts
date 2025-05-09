// server/api/messages/[id].delete.ts
import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { getHeader, createError } from 'h3'
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
  const db = event.context.mysql

  // Удаляем сообщение, только если оно принадлежит пользователю
  const [result] = await db.execute<any>(
    'DELETE FROM messages WHERE id = ? AND user_id = ?',
    [id, userId]
  )

  if (result.affectedRows === 0) {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }

  return { success: true }
})
