-- Tabela nova: armazena o HASH do refresh token para permitir rotacao e revogacao.

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` CHAR(36) NOT NULL,
  `user_id` INTEGER NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME(0) NOT NULL,
  `revoked_at` DATETIME(0) NULL,
  `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_refresh_tokens_user_id`(`user_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `admin_users`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
