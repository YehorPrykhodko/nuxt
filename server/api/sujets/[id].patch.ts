// server/api/sujets/[id].patch.ts
import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { readBody, getHeader, createError } from 'h3'
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

  const { titre } = await readBody<{ titre?: string }>(event)
  if (!titre) {
    throw createError({ statusCode: 400, statusMessage: 'Titre requis' })
  }

  const db = event.context.mysql
  await db.execute('UPDATE sujets SET titre = ? WHERE id = ?', [titre, sujetId])

  return { success: true }
})
