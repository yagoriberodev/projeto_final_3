-- Banco de dados do LAIVY.
-- O servidor roda este arquivo sozinho ao iniciar, mas pode
-- executar no MySQL Workbench para mostrar o banco.

CREATE DATABASE IF NOT EXISTS laivy
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE laivy;

-- Usuários do sistema. A senha é guardada com HASH (bcrypt), nunca em texto puro.
CREATE TABLE IF NOT EXISTS usuarios (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  login  VARCHAR(50)  NOT NULL UNIQUE,
  senha  VARCHAR(100) NOT NULL,
  nome   VARCHAR(100) NOT NULL,
  tipo   VARCHAR(30)  NOT NULL,
  firebase_uid VARCHAR(128) NULL UNIQUE
);

-- Times. Cada time pertence a um usuário (usuario_id).
CREATE TABLE IF NOT EXISTS times (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  modalidade  VARCHAR(50)  NOT NULL,
  categoria   VARCHAR(30)  NOT NULL,
  atletas     INT          NOT NULL DEFAULT 0,
  usuario_id  INT          NULL,
  CONSTRAINT fk_times_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Usuários de teste (só entram se ainda não existirem):
--   yago  / 123    -> Treinador (cliente)
--   maria / 123    -> Treinador (cliente)
--   admin / admin  -> Administrador
INSERT IGNORE INTO usuarios (login, senha, nome, tipo) VALUES
  ('yago',  '$2b$10$v2NP.a2QkOVqqznNHxw1LustK8F9wFv4ViFpDfbcxdHLwrVJYwpJu', 'Yago',          'Treinador'),
  ('maria', '$2b$10$v2NP.a2QkOVqqznNHxw1LustK8F9wFv4ViFpDfbcxdHLwrVJYwpJu', 'Maria',         'Treinador'),
  ('admin', '$2b$10$8ScJmjf1zamArgxebAZls.UWp73LAhEDd.8NDezGwXCd0LtZKAJcq', 'Administrador', 'Administrador');

-- Times de exemplo (só entram se ainda não existirem).
INSERT INTO times (nome, modalidade, categoria, atletas, usuario_id)
SELECT 'Tigres', 'Futsal', 'Sub-17', 14, u.id FROM usuarios u
WHERE u.login = 'yago' AND NOT EXISTS (SELECT 1 FROM times WHERE nome = 'Tigres');

INSERT INTO times (nome, modalidade, categoria, atletas, usuario_id)
SELECT 'Águias', 'Vôlei', 'Sub-15', 12, u.id FROM usuarios u
WHERE u.login = 'yago' AND NOT EXISTS (SELECT 1 FROM times WHERE nome = 'Águias');

INSERT INTO times (nome, modalidade, categoria, atletas, usuario_id)
SELECT 'Leões', 'Basquete', 'Sub-17', 10, u.id FROM usuarios u
WHERE u.login = 'maria' AND NOT EXISTS (SELECT 1 FROM times WHERE nome = 'Leões');
