// server/api/forums/[id].delete.ts   ← suppression (cascade en SQL)
import { defineSQLHandler } from '~/server/utils/mysql'
import { createError }      from 'h3'

export default defineSQLHandler(async (event) => {
  const sess = event.context.session
  if (!sess.user?.role || sess.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }

  const { id } = event.context.params
  const db = event.context.mysql

  await db.execute('DELETE FROM forums WHERE id = ?', [id])
  return { ok: true }
})
