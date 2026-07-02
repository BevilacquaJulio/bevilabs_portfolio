-- Copie esta pasta para backend/sql/ e ajuste antes de executar manualmente.
-- Execute no MySQL compartilhado (mysql_shared) antes do primeiro deploy.
-- Risco: CREATE USER / GRANT alteram permissões no servidor — revise a senha antes de rodar.

CREATE DATABASE IF NOT EXISTS bevilabs
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'bevilabs_user'@'%' IDENTIFIED BY 'troque_esta_senha';
GRANT ALL PRIVILEGES ON bevilabs.* TO 'bevilabs_user'@'%';
FLUSH PRIVILEGES;
