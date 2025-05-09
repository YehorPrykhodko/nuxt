// server/api/messages.get.ts
import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { getQuery, createError } from 'h3'

export default defineWrappedResponseHandler(async (event) => {
  const query = getQuery(event)
  const sujetId = Number(query.sujetId)
  const page = Number(query.page) || 1
  const limit = 10
  const offset = (page - 1) * limit

  if (!sujetId) {
    throw createError({ statusCode: 400, statusMessage: 'sujetId requis' })
  }

  const db = event.context.mysql

  const [rows] = await db.execute(
    `SELECT messages.*, users.login 
     FROM messages 
     JOIN users ON messages.user_id = users.id 
     WHERE sujet_id = ?
     ORDER BY messages.created_at ASC
     LIMIT ? OFFSET ?`,
    [sujetId, limit, offset]
  )

  const [countRes] = await db.execute<any[]>(
    'SELECT COUNT(*) AS count FROM messages WHERE sujet_id = ?',
    [sujetId]
  )

  const total = countRes[0].count
  const pages = Math.ceil(total / limit)

  return {
    messages: rows,
    pages
  }
})
