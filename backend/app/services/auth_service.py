from sqlalchemy.orm import Session

from app.auth.security import create_access_token, verify_password
from app.models import AdminUser


def authenticate_admin(db: Session, password: str) -> str:
    """Valida a senha do admin e retorna o token JWT da sessão."""
    user = db.query(AdminUser).filter(AdminUser.username == "admin").first()
    if user is None or not verify_password(password, user.password_hash):
        raise ValueError("Senha incorreta.")

    return create_access_token(user.username)
