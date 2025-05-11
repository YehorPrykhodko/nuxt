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
  let isAdmin = false

  try {
    const decoded: any = jwt.verify(token, jwtSecret)
    userId = decoded.id
    isAdmin = decoded.role === 'admin'
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  const { id } = event.context.params
  const { contenu } = await readBody<{ contenu?: string }>(event)

  if (!contenu) {
    throw createError({ statusCode: 400, statusMessage: 'Contenu requis' })
  }

  const db = event.context.mysql

  let result
  if (isAdmin) {
    [result] = await db.execute<any>(
      'UPDATE messages SET contenu = ? WHERE id = ?',
      [contenu, id]
    )
  } else {
    [result] = await db.execute<any>(
      'UPDATE messages SET contenu = ? WHERE id = ? AND user_id = ?',
      [contenu, id, userId]
    )
  }

  if (result.affectedRows === 0) {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }

  return { success: true }
})
