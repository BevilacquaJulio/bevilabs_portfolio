from sqlalchemy.orm import Session

from app.auth.security import hash_password
from app.config import Settings
from app.models import AdminUser, SiteSection

DEFAULT_SECTIONS = [
    {
        "slug": "sobre",
        "title": "Sobre",
        "content": (
            "O Bevilacqua Labs® é um laboratório de inovação dedicado a transformar "
            "ideias em soluções digitais. Combinamos arquitetura sólida, design cuidadoso "
            "e tecnologia de ponta para construir projetos que fazem diferença.\n\n"
            "Este conteúdo será personalizado em breve."
        ),
        "email": None,
    },
    {
        "slug": "contato",
        "title": "Contato",
        "content": (
            "Quer conversar sobre um projeto ou parceria? Entre em contato — "
            "respondo o mais breve possível.\n\n"
            "Informações de contato serão atualizadas em breve."
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
