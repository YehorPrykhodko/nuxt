import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { createError } from 'h3'

export default defineWrappedResponseHandler(async (event) => {
  const sujetId = Number(event.context.params?.id)
  if (!sujetId) {
    throw createError({ statusCode: 400, statusMessage: 'ID requis' })
  }

  const db = event.context.mysql

  const [[sujet]] = await db.execute<any[]>(
    `SELECT s.id, s.titre, u.login AS auteur
     FROM sujets s
     JOIN users u ON s.user_id = u.id
     WHERE s.id = ?`,
    [sujetId]
  )

  if (!sujet) {
    throw createError({ statusCode: 404, statusMessage: 'Sujet introuvable' })
  }

  const [messages] = await db.execute<any[]>(
    `SELECT m.id, m.user_id, m.contenu, m.created_at, u.login AS auteur
     FROM messages m
     JOIN users u ON m.user_id = u.id
     WHERE m.sujet_id = ?
     ORDER BY m.created_at ASC`,
    [sujetId]
  )

  return {
    titre: sujet.titre,
    messages
  }
})
