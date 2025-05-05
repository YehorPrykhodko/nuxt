// server/utils/mysql.ts
// Code généré par une IA – utilitaire MySQL + wrapper d’API
// Tous les commentaires sont en français pour la lecture.
import { defineEventHandler } from 'h3'
import mysql from 'mysql2/promise'
import bluebird from 'bluebird'
import type { Pool, PoolConnection } from 'mysql2/promise'
import type { EventHandler, EventHandlerRequest } from 'h3'

/* ---------------------------------------------------------
 * Pool de connexions
 * ---------------------------------------------------------
 * On crée un pool partagé entre toutes les requêtes. Les paramètres
 * sont pris dans runtimeConfig (voir nuxt.config.ts).
 */
let pool: Pool | null = null

function initPool (): Pool {
  const cfg = useRuntimeConfig()
  return mysql.createPool({
    host: cfg.mysqlHost,
    user: cfg.mysqlUser,
    password: cfg.mysqlPass,
    database: cfg.mysqlDb,
    Promise: bluebird,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })
}

export const getPool = (): Pool => {
  if (!pool) pool = initPool()
  return pool
}

/* ---------------------------------------------------------
 * Wrapper de route API
 * ---------------------------------------------------------
 * Simplifie l’accès à MySQL dans les handlers :
 * - Ouvre une connexion via le pool
 * - Stocke la connexion dans event.context.mysql
 * - Libère la connexion après exécution
 */
export const defineSQLHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    const conn: PoolConnection = await getPool().getConnection()
    // On expose la connexion dans le contexte pour le handler.
    // Typage souple : on ajoute la clé « mysql » à context.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    event.context.mysql = conn

    try {
      // On exécute le handler métier.
      return await handler(event)
    } catch (err) {
      console.error('[sql] erreur :', err)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur interne'
      })
    } finally {
      // Toujours relâcher la connexion.
      conn.release()
    }
  })
