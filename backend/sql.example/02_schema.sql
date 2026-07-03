-- Copie esta pasta para backend/sql/ e ajuste antes de executar manualmente.
-- Execute no MySQL compartilhado (mysql_shared), no banco "bevilabs",
-- DEPOIS de rodar 01_init_database.sql e ANTES do primeiro deploy da aplicação.
-- Risco: cria tabelas na base "bevilabs" — a aplicação não cria mais o schema
-- automaticamente (Base.metadata.create_all foi removido do backend).

CREATE TABLE IF NOT EXISTS admin_users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
