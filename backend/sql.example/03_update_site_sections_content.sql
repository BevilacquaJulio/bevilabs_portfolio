-- Copie este arquivo para backend/sql/ e execute manualmente no MySQL compartilhado (mysql_shared),
-- no banco "bevilabs", via phpMyAdmin, DBeaver ou ferramenta similar.
-- Necessário apenas se as linhas "sobre" e "contato" já existirem na tabela site_sections
-- (o seed automático da aplicação só insere linhas novas, nunca sobrescreve as existentes).
-- Risco: sobrescreve o conteúdo atual das linhas "sobre" e "contato". Faça backup antes, se necessário.

UPDATE site_sections
SET
  title = 'Sobre',
  content = 'Sou o Julio, desenvolvedor Full Stack por trás do Bevilacqua Labs®. Trabalho principalmente com Python (FastAPI) e PHP, construindo desde APIs REST até sistemas completos que vão para produção — já entreguei soluções que processaram mais de R$ 200 mil em transações reais.\n\nComo eu desenvolvo: entendo o problema antes de escrever a primeira linha de código, desenho uma arquitetura simples de manter e escalar, e cuido de cada camada — autenticação com JWT, controle de acesso por papéis (RBAC), banco de dados (MySQL, PostgreSQL, MongoDB) e deploy automatizado com Docker, Docker Compose e Traefik em VPS Linux.\n\nUso Git no dia a dia e apoio meu fluxo de trabalho com IA (Claude, GPT, Cursor) para ganhar velocidade sem perder qualidade. Sigo metodologias ágeis (Scrum e Kanban) e gosto de manter tudo organizado, documentado e sob controle de versão.\n\nEstou sempre em movimento: atuo como desenvolvedor Full Stack no DSG Grupo, atendo projetos freelance e curso Análise e Desenvolvimento de Sistemas na Universidade Senac Santo Amaro. Este laboratório é onde coloco em prática — e em público — tudo o que construo.'
WHERE slug = 'sobre';

UPDATE site_sections
SET
  title = 'Contato',
  content = 'Quer conversar sobre um projeto, uma proposta de trabalho ou só trocar uma ideia sobre tecnologia? Fico à disposição — costumo responder rápido.\n\nEstou baseado em São Paulo, SP, e atendo remotamente para todo o Brasil.',
  email = 'contato@bevilabs.com.br'
WHERE slug = 'contato';
