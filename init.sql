CREATE DATABASE IF NOT EXISTS forum;
USE forum;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(64) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin','user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO users (login, password, role) VALUES
('admin', '$2b$12$tlTdIrnZJYq48QPmkWK3pOKufFGy22s34cA2WXSX.bBpnHHTQh2WW', 'admin'),
('user1', '$2b$12$4eK1mXPbG/YDgWaT8OjQAuCglS2z48/FuF/5bR2ot7Gq3N6VbQO9.', 'user'),
('user2', '$2b$12$K7UaXEuxDgWjT1Ng8NrHWuZY/1lFv6jFoD3t8lS6p7Jq2KsM4Lz9.', 'user'),
('lucie',  '$2b$12$KabcDEeuxDgWjT1Ng8HWWuZY/1lFv6jFoD3t8lS6p7Jq2KsM1XyZ.', 'user'),
('paul',   '$2b$12$J7UaABCDEeWjT1Ng8NrHWuZY/1lFv6jFoD3t8lS6p7Jq2KsP0QwE.', 'user');

CREATE TABLE IF NOT EXISTS forums (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO forums (nom) VALUES
('General'), ('Support'), ('Suggestions'), ('Jeux'), ('Actualites');

CREATE TABLE IF NOT EXISTS sujets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  forum_id INT NOT NULL,
  user_id INT NOT NULL,
  titre VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (forum_id) REFERENCES forums(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO sujets (forum_id, user_id, titre) VALUES
(1, 1, 'Bienvenue sur le forum'),
(1, 2, 'Regles et infos'),
(2, 1, 'Probleme dinstallation'),
(3, 3, 'Nouvelle idee pour le forum'),
(3, 4, 'Fonctionnalite a ajouter'),
(4, 5, 'Quel est votre jeu prefere'),
(5, 2, 'Discussion sur les nouvelles');

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sujet_id INT NOT NULL,
  user_id INT NOT NULL,
  contenu TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sujet_id) REFERENCES sujets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO messages (sujet_id, user_id, contenu) VALUES
(1, 1, 'Ceci est le premier message.'),
(1, 2, 'Merci pour cet accueil !'),
(2, 2, 'Quelles sont les regles du forum ?'),
(3, 1, 'Quel est le message derreur exact ?'),
(4, 3, 'Je propose un systeme de vote'),
(4, 2, 'Bonne idee !'),
(5, 4, 'Ajouter une section pour les evenements'),
(6, 5, 'Moi jaime bien les jeux de strategie'),
(6, 1, 'Moi aussi, surtout les classiques'),
(7, 2, 'Avez-vous vu les dernieres actualites ?');
