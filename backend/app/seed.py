from sqlalchemy.orm import Session

from app.auth.security import hash_password
from app.config import Settings
from app.models import AdminUser


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
