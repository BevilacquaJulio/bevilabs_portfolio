-- Copie este arquivo para backend/sql/ e execute manualmente no MySQL compartilhado (mysql_shared),
-- no banco "bevilabs", via phpMyAdmin, DBeaver ou ferramenta similar.
-- Necessário apenas se a tabela "site_sections" já foi criada anteriormente (02_schema.sql antigo).
-- O conteúdo das seções "Sobre" e "Contato" passou a ser mantido diretamente no código do
-- frontend (frontend/index.html), então essa tabela não é mais utilizada pela aplicação.
-- Risco: apaga permanentemente a tabela "site_sections" e todo o seu conteúdo. Faça backup
-- antes, se quiser preservar o histórico.

DROP TABLE IF EXISTS site_sections;
