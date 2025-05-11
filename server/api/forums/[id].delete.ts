import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '~/server/config/auth'


export default defineWrappedResponseHandler(async (event) => {
  //  verifier header Authorization
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Authorization header required' })
  }

  //verifle token
  const token = authHeader.split(' ')[1]
  let payload: any
  try {
    payload = jwt.verify(token, jwtSecret)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  //verif que l'utilisateur est admin
  if (payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }

  //lire id du forum
  const { id } = event.context.params
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID requis' })
  }

  const db = event.context.mysql

  //supprimer les messages sujets et le forum
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
