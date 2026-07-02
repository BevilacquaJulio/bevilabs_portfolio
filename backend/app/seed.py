from sqlalchemy.orm import Session

from app.auth.security import hash_password
from app.config import Settings
from app.models import AdminUser, SiteSection

DEFAULT_SECTIONS = [
    {
        "slug": "sobre",
        "title": "Sobre",
        "content": (
            "Sou o Julio, desenvolvedor Full Stack por trás do Bevilacqua Labs®. Trabalho "
            "principalmente com Python (FastAPI) e PHP, construindo desde APIs REST até "
            "sistemas completos que vão para produção — já entreguei soluções que processaram "
            "mais de R$ 200 mil em transações reais.\n\n"
            "Como eu desenvolvo: entendo o problema antes de escrever a primeira linha de "
            "código, desenho uma arquitetura simples de manter e escalar, e cuido de cada "
            "camada — autenticação com JWT, controle de acesso por papéis (RBAC), banco de "
            "dados (MySQL, PostgreSQL, MongoDB) e deploy automatizado com Docker, Docker "
            "Compose e Traefik em VPS Linux.\n\n"
            "Uso Git no dia a dia e apoio meu fluxo de trabalho com IA (Claude, GPT, Cursor) "
            "para ganhar velocidade sem perder qualidade. Sigo metodologias ágeis (Scrum e "
            "Kanban) e gosto de manter tudo organizado, documentado e sob controle de versão.\n\n"
            "Estou sempre em movimento: atuo como desenvolvedor Full Stack no DSG Grupo, "
            "atendo projetos freelance e curso Análise e Desenvolvimento de Sistemas na "
            "Universidade Senac Santo Amaro. Este laboratório é onde coloco em prática — e em "
            "público — tudo o que construo."
        ),
        "email": None,
    },
    {
        "slug": "contato",
        "title": "Contato",
        "content": (
            "Quer conversar sobre um projeto, uma proposta de trabalho ou só trocar uma ideia "
            "sobre tecnologia? Fico à disposição — costumo responder rápido.\n\n"
            "Estou baseado em São Paulo, SP, e atendo remotamente para todo o Brasil."
        ),
        "email": "contato@bevilabs.com.br",
    },
]


def seed_site_sections(db: Session) -> None:
    for data in DEFAULT_SECTIONS:
        existing = db.get(SiteSection, data["slug"])
        if existing is None:
            db.add(SiteSection(**data))

    db.commit()


def seed_admin_user(db: Session, settings: Settings) -> None:
    if db.query(AdminUser).first() is not None:
        return

    if not settings.admin_password.strip():
        return

    db.add(
        AdminUser(
            username="admin",
            password_hash=hash_password(settings.admin_password),
        )
    )
    db.commit()
