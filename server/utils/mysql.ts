// server/utils/mysql.ts
import mysql from 'mysql2/promise'
import bluebird from 'bluebird'
import { defineEventHandler, type EventHandler, type EventHandlerRequest } from 'h3'

export const defineWrappedResponseHandler = <
  T extends EventHandlerRequest,
  D
>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async event => {
    try {
      const connection = await mysql.createConnection({
        host:     'db',
        user:     'root',
        password: 'root',
        database: 'forum',
        Promise:  bluebird,
      })
      // пушим соединение в контекст
      event.context.mysql = connection
      const response = await handler(event)
      await connection.end()
      return response
    } catch (err) {
      // здесь можно централизованно логировать
      return { error: true, details: err }
    }
  })
