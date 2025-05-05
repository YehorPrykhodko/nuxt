import { readBody, createError } from 'h3'
import { defineSQLHandler }      from '~/server/utils/mysql'
import { verifyJWT }             from '~/server/utils/jwt'

export default defineSQLHandler(async (event) => {
  // 1) Вытащить и проверить JWT
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

  // 2) Прочитать тело
  const { sujetId, contenu } = await readBody<{
    sujetId?: number
    contenu?: string
  }>(event)
  if (!sujetId || !contenu) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
  }

  // 3) Вставить сообщение
  const db = event.context.mysql
  await db.execute(
    'INSERT INTO messages (sujet_id, user_id, contenu) VALUES (?, ?, ?)',
    [sujetId, userId, contenu]
  )
  // Обновить время последнего обновления темы
  await db.execute(
    'UPDATE sujets SET updated_at = NOW() WHERE id = ?',
    [sujetId]
  )

  return { ok: true }
})
