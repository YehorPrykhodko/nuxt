import { defineSQLHandler } from '~/server/utils/mysql'
import { createError }      from 'h3'
import { verifyJWT }        from '~/server/utils/jwt'

export default defineSQLHandler(async (event) => {
  // Аналогичная JWT-проверка
  const authHeader = event.node.req.headers.authorization || ''
  const token = authHeader.split(' ')[1]
  if (!token) throw createError({ statusCode: 401, statusMessage: 'No token' })

  let payload: any
  try {
    payload = await verifyJWT(token)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
  const userId = payload.id
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Invalid payload' })

  // Удаляем сообщение
  const { id } = event.context.params
  const db = event.context.mysql

  // По желанию можно удостовериться, что payload.id == user_id сообщения
  await db.execute('DELETE FROM messages WHERE id = ?', [id])
  return { success: true }
})
