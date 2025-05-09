// server/api/sujets.post.ts
import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { readBody, getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export default defineWrappedResponseHandler(async (event) => {
  // 1) Authentification
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

  const userId = decoded.id
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid payload' })
  }

  // 2) Corps de la requête
  const { forumId, titre, msg } = await readBody<{
    forumId?: number
    titre?: string
    msg?: string
  }>(event)

  if (!forumId || !titre || !msg) {
    throw createError({ statusCode: 400, statusMessage: 'Champs requis manquants' })
  }

  const db = event.context.mysql

  // 3) Créer le sujet
  const [resSujet] = await db.execute<any>(
    'INSERT INTO sujets (forum_id, user_id, titre) VALUES (?, ?, ?)',
    [forumId, userId, titre]
  )

  const sujetId = (resSujet as any).insertId

  // 4) Ajouter le premier message
  await db.execute(
    'INSERT INTO messages (sujet_id, user_id, contenu) VALUES (?, ?, ?)',
    [sujetId, userId, msg]
  )

  return { ok: true, id: sujetId }
})
