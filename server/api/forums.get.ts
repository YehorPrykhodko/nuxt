import { defineWrappedResponseHandler } from '~/server/utils/mysql'

export default defineWrappedResponseHandler(async (event) => {
  console.log('API GET /api/forums', {
    params: event.context.params,
    query:  event.context.query
  })

  const db = event.context.mysql

  const [rows] = await db.execute<any[]>(`
    SELECT 
      f.id, 
      f.nom AS name, 
      COUNT(s.id) AS sujets
    FROM forums f
    LEFT JOIN sujets s ON s.forum_id = f.id
    GROUP BY f.id, f.nom
    ORDER BY f.created_at DESC
  `)

  return { forums: rows }
})
