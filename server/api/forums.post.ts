// server/api/forums.post.ts
import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { readBody, getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export default defineWrappedResponseHandler(async (event) => {
  // 1) Vérifier le token dans l'en-tête Authorization
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Authorization header required' })
  }
  const token = authHeader.split(' ')[1]
  let payload: any
  try {
    payload = jwt.verify(token, SECRET)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  // 2) Seuls les admins peuvent créer un forum
  if (payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }

  // 3) Lire le corps de la requête
  const { nom } = await readBody<{ nom?: string }>(event)
  if (!nom) {
    throw createError({ statusCode: 400, statusMessage: 'Le champ "nom" est requis' })
  }

  // 4) Insérer en base
  const db = event.context.mysql
  const [result] = await db.execute<any>(
    'INSERT INTO forums (nom) VALUES (?)',
    [nom]
  )

  // 5) Retourner l'ID du nouveau forum
  return {
    ok: true,
    id: (result as any).insertId
  }
})
