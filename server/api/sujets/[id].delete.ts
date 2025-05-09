// server/api/sujets/[id].delete.ts
import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export default defineWrappedResponseHandler(async (event) => {
  const sujetId = Number(event.context.params.id)
  if (!sujetId) {
    throw createError({ statusCode: 400, statusMessage: 'ID du sujet requis' })
  }

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Authorization header required' })
  }

  const token = authHeader.split(' ')[1]
  let decoded: any
  try {
    decoded = jwt.verify(token, SECRET)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  const db = event.context.mysql

  // Supprimer les messages liés à ce sujet
  await db.execute('DELETE FROM messages WHERE sujet_id = ?', [sujetId])

  // Supprimer le sujet
  await db.execute('DELETE FROM sujets WHERE id = ?', [sujetId])

  return { success: true }
})