// server/api/forums/[id].patch.ts
import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { readBody, getHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export default defineWrappedResponseHandler(async (event) => {
  // 1) Récupérer et vérifier le JWT depuis l'en-tête Authorization
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

  // 2) Seul un admin peut renommer un forum
  if (payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }

  // 3) Récupérer l'ID du forum depuis le paramètre de route
  const { id } = event.context.params

  // 4) Lire le nouveau nom dans le corps
  const { nom } = await readBody<{ nom?: string }>(event)
  if (!nom) {
    throw createError({ statusCode: 400, statusMessage: 'Le champ "nom" est requis' })
  }

  // 5) Mettre à jour en base
  const db = event.context.mysql
  await db.execute(
    'UPDATE forums SET nom = ? WHERE id = ?',
    [nom, id]
  )

  return { ok: true }
})
