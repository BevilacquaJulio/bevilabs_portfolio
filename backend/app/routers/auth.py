from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.database import get_db
from app.models import AdminUser
from app.schemas.auth import AdminUserRead, LoginRequest, LoginResponse
from app.services.auth_service import authenticate_admin

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    try:
        token = authenticate_admin(db, body.password)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

    return LoginResponse(access_token=token)


@router.get("/me", response_model=AdminUserRead)
def me(current_admin: AdminUser = Depends(get_current_admin)):
    return AdminUserRead(username=current_admin.username)
