// server/api/sujets.post.ts
import { readBody, createError } from 'h3'
import { defineSQLHandler }      from '~/server/utils/mysql'
import { verifyJWT }             from '~/server/utils/jwt'

export default defineSQLHandler(async (event) => {
  // 1) достаём токен из заголовка
  const authHeader = event.node.req.headers.authorization || ''
  const token = authHeader.split(' ')[1]
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'No token' })
  }

  // 2) проверяем его
  let payload: any
  try {
    payload = await verifyJWT(token)
    console.log('JWT payload', payload)
  } catch (e) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
  const userId = payload.id as number
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid payload' })
  }

  // 3) читаем тело запроса
  const { forumId, titre, msg } = await readBody<{
    forumId?: number; titre?: string; msg?: string
  }>(event)
  if (!forumId || !titre || !msg) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
  }

  const db = event.context.mysql
  // 4) вставляем тему
  const [resSujet] = await db.execute<any>(
    'INSERT INTO sujets (forum_id, titre, user_id) VALUES (?, ?, ?)',
    [forumId, titre, userId]
  )
  const sujetId = (resSujet as any).insertId

  // 5) вставляем первый message
  await db.execute(
    'INSERT INTO messages (sujet_id, contenu, user_id) VALUES (?, ?, ?)',
    [sujetId, msg, userId]
  )

  return { ok: true, id: sujetId }
})
