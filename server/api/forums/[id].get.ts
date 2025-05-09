// server/api/forums/[id].get.ts
import { defineWrappedResponseHandler } from '~/server/utils/mysql'
import { createError } from 'h3'

export default defineWrappedResponseHandler(async (event) => {
  const id = Number(event.context.params.id)
  const db = event.context.mysql

  // 1. Проверка существования форума
  const [forumRows] = await db.execute<any[]>(
    'SELECT nom FROM forums WHERE id = ?',
    [id]
  )
  if (!forumRows.length) {
    throw createError({ statusCode: 404, statusMessage: 'Forum non trouvé' })
  }

  // 2. Получаем все сюжеты форума
  const [sujets] = await db.execute<any[]>(
    `SELECT s.id, s.titre, u.login AS auteur
     FROM sujets s
     LEFT JOIN users u ON s.user_id = u.id
     WHERE s.forum_id = ?
     ORDER BY s.created_at DESC`,
    [id]
  )

  return {
    nom: forumRows[0].nom,
    sujets
  }
})
