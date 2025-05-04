// server/api/forums.get.ts
// Code généré par une IA – liste des forums (avec compteur de sujets)
import { defineSQLHandler } from '~/server/utils/mysql'
// server/api/some-endpoint.ts

export default defineSQLHandler(async (event) => {
/* AUTOMATIC LOG */ 
console.log(
  '[API]',
  event.method,
  event.node.req.url,
  { params: event.context?.params, query: event.context?.query }
);
  const db = event.context.mysql

  // Création de la table au premier lancement
  await db.execute(`
    CREATE TABLE IF NOT EXISTS forums (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(128),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sujets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      forum_id INT,
      user_id INT,
      titre VARCHAR(255),
      locked TINYINT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX (forum_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
  // Compteur de sujets par forum
  const [rows] = await db.query<any[]>(`
    SELECT f.id, f.nom, COUNT(s.id) AS sujets
    FROM forums f
    LEFT JOIN sujets s ON s.forum_id = f.id
    GROUP BY f.id
    ORDER BY f.id
  `)

  return { forums: rows }
})
