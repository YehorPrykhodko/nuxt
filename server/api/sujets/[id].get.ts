// server/api/sujets/[id].get.ts
import { defineSQLHandler } from '~/server/utils/mysql'
import { createError }      from 'h3'

export default defineSQLHandler(async (event) => {
  const id = Number(event.context.params.id)
  const db = event.context.mysql

  const [rows] = await db.execute<any[]>(
    'SELECT id, titre FROM sujets WHERE id = ?',
    [id]
  )
  if (!rows.length) {
    throw createError({ statusCode: 404, statusMessage: 'Sujet non trouvé' })
  }

  return rows[0]
})
