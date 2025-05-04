// server/api/messages.get.ts
// Code généré par une IA – liste des messages d'un sujet (pagination)
import { defineSQLHandler } from '~/server/utils/mysql'
import { getQuery, createError } from 'h3'
// server/api/some-endpoint.ts
console.log('[API]', 'Loaded endpoint', __filename)

export default defineSQLHandler(async (event) => {
  const q = getQuery(event)
  const sujetId = Number(q.sujetId)
  const page = Math.max(Number(q.page || 1), 1)
  const limit = 20
  if (!sujetId) {
    throw createError({ statusCode: 400, statusMessage: 'sujetId requis' })
  }
  const db = event.context.mysql
  // Création de la table messages au premier lancement
  await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sujet_id INT,
      user_id INT,
      contenu TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX (sujet_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
  const [[{ total }]]: any = await db.execute('SELECT COUNT(*) AS total FROM messages WHERE sujet_id = ?', [sujetId])
  const pages = Math.max(Math.ceil(total / limit), 1)
  const offset = (page - 1) * limit
  const [rows] = await db.query<any[]>(`
    SELECT m.*, u.login AS auteur
    FROM messages m
    JOIN users u ON u.id = m.user_id
    WHERE m.sujet_id = ?
    ORDER BY m.created_at ASC
    LIMIT ? OFFSET ?
  `, [sujetId, limit, offset])
  return { messages: rows, page, pages }
})
