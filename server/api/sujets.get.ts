// server/api/sujets.get.ts
// Code généré par une IA – liste des sujets d'un forum (pagination)
import { defineSQLHandler } from '~/server/utils/mysql'
import { getQuery, createError } from 'h3'
// server/api/some-endpoint.ts
import { getRequestURL } from 'h3'
export default defineSQLHandler(async (event) => {
/* AUTOMATIC LOG */ 
console.log(
  '[API]',
  event.method,
  getRequestURL(event).toString(),
  { params: event.context?.params, query: event.context?.query }
);
  const q = getQuery(event)
  const forumId = Number(q.forumId)
  const page = Math.max(Number(q.page || 1), 1)
  const limit = 20
  if (!forumId) {
    throw createError({ statusCode: 400, statusMessage: 'forumId requis' })
  }
  const db = event.context.mysql

  // Compte total
  const [[{ total }]]: any = await db.execute('SELECT COUNT(*) AS total FROM sujets WHERE forum_id = ?', [forumId])
  const pages = Math.max(Math.ceil(total / limit), 1)
  const offset = (page - 1) * limit

  const [rows] = await db.query<any[]>(`
    SELECT s.*, u.login AS auteur,
      (SELECT login FROM users u2 WHERE u2.id = (SELECT user_id FROM messages m WHERE m.sujet_id = s.id ORDER BY m.created_at DESC LIMIT 1)) AS dernierAuteur,
      (SELECT created_at FROM messages m2 WHERE m2.sujet_id = s.id ORDER BY m2.created_at DESC LIMIT 1) AS derniereDate
    FROM sujets s
    JOIN users u ON u.id = s.user_id
    WHERE s.forum_id = ?
    ORDER BY derniereDate DESC
    LIMIT ? OFFSET ?
  `, [forumId, limit, offset])

  return { sujets: rows, page, pages }
})
