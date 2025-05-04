// server/api/users.post.ts
// Code généré par une IA – inscription utilisateur
import bcrypt from 'bcryptjs'
import { readBody, createError } from 'h3'
// On importe le wrapper qui gère la connexion MySQL.
import { defineSQLHandler } from '~/server/utils/mysql' // chemin relatif depuis /server/api
// server/api/some-endpoint.ts
console.log('[API]', 'Loaded endpoint', __filename)

// Handler POST /api/users
export default defineSQLHandler(async (event) => {
  // Récupération du corps JSON
  const body = await readBody<{ login?: string; password?: string }>(event)
  const { login, password } = body || {}
  if (!login || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Champs manquants' })
  }
  console.log('[API]', 'Body received:', body)
  // Connexion MySQL fournie par le wrapper
  const db = event.context.mysql

  // Création de la table si absente (idéal pour premier démarrage)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      login VARCHAR(64) UNIQUE,
      password VARCHAR(255),
      role ENUM('admin','user') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)

  // Vérifier si le login existe déjà
  const [ex] = await db.execute<any[]>('SELECT id FROM users WHERE login = ?', [login])
  if (Array.isArray(ex) && ex.length) {
    throw createError({ statusCode: 409, statusMessage: 'Login déjà utilisé' })
  }

  // Hash du mot de passe
  const hash = await bcrypt.hash(password, 10)

  // Insertion
  await db.execute('INSERT INTO users (login, password) VALUES (?, ?)', [login, hash])

  return { ok: true }
})
