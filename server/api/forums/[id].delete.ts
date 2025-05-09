// server/api/forums/[id].delete.ts
import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export default defineWrappedResponseHandler(async (event) => {
  // 1) Vérifier l'en-tête Authorization
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Authorization header required' })
  }

  // 2) Vérifier le token
  const token = authHeader.split(' ')[1]
  let payload: any
  try {
    payload = jwt.verify(token, SECRET)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  // 3) Vérifier que l'utilisateur est admin
  if (payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }

  // 4) Lire l'ID du forum depuis les params
  const { id } = event.context.params
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID requis' })
  }

  const db = event.context.mysql

  // 5) Supprimer les messages, sujets et le forum
  await db.execute(
    'DELETE FROM messages WHERE sujet_id IN (SELECT id FROM sujets WHERE forum_id = ?)',
    [id]
  )
  await db.execute(
    'DELETE FROM sujets WHERE forum_id = ?',
    [id]
  )
  await db.execute(
    'DELETE FROM forums WHERE id = ?',
    [id]
  )

  return { ok: true, message: 'Forum supprimé avec succès' }
})
