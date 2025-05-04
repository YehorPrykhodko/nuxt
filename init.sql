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
('user2', '$2b$12$K7UaXEuxDgWjT1Ng8NrHWuZY/1lFv6jFoD3t8lS6p7Jq2KsM4Lz9.', 'user');

CREATE TABLE IF NOT EXISTS forums (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO forums (nom) VALUES
('Général'), ('Support');

CREATE TABLE IF NOT EXISTS sujets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  forum_id INT,
  user_id INT,
  titre VARCHAR(255),
  locked TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO sujets (forum_id, user_id, titre) VALUES
(1, 1, 'Bienvenue sur le forum'), (1, 2, 'Règles et infos'), (2, 1, 'Problème dinstallation');

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sujet_id INT,
  user_id INT,
  contenu TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO messages (sujet_id, user_id, contenu) VALUES
(1, 1, 'Ceci est le premier message.'),
(1, 2, 'Merci pour cet accueil !'),
(2, 2, 'Quelles sont les règles du forum ?'),
(3, 1, 'Quel est le message d'erreur exact ?');
