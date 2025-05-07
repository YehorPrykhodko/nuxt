// server/api/forums/[id].patch.ts   ← renommage
import { readBody, createError } from 'h3'
import { defineSQLHandler }      from '~/server/utils/mysql'

export default defineSQLHandler(async (event) => {
  const sess = event.context.session
  if (!sess.user?.role || sess.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
  }

  const { id } = event.context.params
  const { nom } = await readBody<{nom?:string}>(event)
  if (!nom) {
    throw createError({ statusCode: 400, statusMessage: 'Nom requis' })
  }

  const db = event.context.mysql
  await db.execute('UPDATE forums SET nom = ? WHERE id = ?', [nom, id])
  return { ok: true }
})
