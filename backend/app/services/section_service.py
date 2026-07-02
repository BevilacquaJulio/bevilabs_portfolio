from sqlalchemy.orm import Session

from app.models import SiteSection


def list_sections(db: Session) -> list[SiteSection]:
    return db.query(SiteSection).order_by(SiteSection.slug).all()


def get_section(db: Session, slug: str) -> SiteSection | None:
    return db.get(SiteSection, slug)
