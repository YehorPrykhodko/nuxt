import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { readBody, getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '~/server/config/auth'

export default defineWrappedResponseHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Token requis' })
  }

  let payload: any
  try {
    const token = authHeader.split(' ')[1]
    payload = jwt.verify(token, jwtSecret)
  } catch {
    throw createError({ statusCode: 403, statusMessage: 'Token invalide' })
  }

  const { forumId, titre, msg } = await readBody(event)

  if (!forumId || !titre || !msg) {
    throw createError({ statusCode: 400, statusMessage: 'Champs manquants' })
  }

  const db = event.context.mysql

  const [res] = await db.execute(
    'INSERT INTO sujets (forum_id, user_id, titre) VALUES (?, ?, ?)',
    [forumId, payload.id, titre]
  )
  const sujetId = (res as any).insertId

  await db.execute(
    'INSERT INTO messages (sujet_id, user_id, contenu) VALUES (?, ?, ?)',
    [sujetId, payload.id, msg]
  )

  return { ok: true, sujetId }
})
