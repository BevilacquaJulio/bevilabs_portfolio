-- Copie este arquivo para backend/sql/ e execute manualmente no MySQL compartilhado (mysql_shared),
-- no banco "bevilabs", via phpMyAdmin, DBeaver ou ferramenta similar.
-- Necessário se a tabela "projects" ainda não existir (deploy com schema antigo).
-- Risco: cria a tabela "projects" — operação segura com IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS projects (
  id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(32) NOT NULL DEFAULT 'folder',
  description TEXT NOT NULL,
  link VARCHAR(2048) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
