// server/api/messages/[id].patch.ts
import { defineSQLHandler } from '~/server/utils/mysql'
import { readBody, createError } from 'h3'

export default defineSQLHandler(async (event) => {
  const { id } = event.context.params
  const body    = await readBody<{ contenu?: string }>(event)
  if (!body?.contenu) {
    throw createError({ statusCode: 400, statusMessage: 'Le contenu est requis' })
  }

  const db = event.context.mysql
  await db.execute(
    'UPDATE messages SET contenu = ? WHERE id = ?',
    [body.contenu, id]
  )
  return { success: true }
})
