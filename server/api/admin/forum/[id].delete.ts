import { getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '~/server/config/auth'
import { defineWrappedResponseHandler } from '~/server/utils/mysql'

export default defineWrappedResponseHandler(async (event) => {
  const { id } = event.context.params
  const authHeader = getHeader(event, 'Authorization')

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

  if (payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }

  const db = event.context.mysql

  // Supprimer les messages liés
  await db.execute(`
    DELETE FROM messages 
    WHERE sujet_id IN (SELECT id FROM sujets WHERE forum_id = ?)
  `, [id])

  // Supprimer les sujets
  await db.execute(`DELETE FROM sujets WHERE forum_id = ?`, [id])

  // Supprimer le forum
  await db.execute(`DELETE FROM forums WHERE id = ?`, [id])

  return { success: true }
})
