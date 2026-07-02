from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.sections import SiteSectionRead
from app.services import section_service

router = APIRouter(prefix="/api/sections", tags=["sections"])


@router.get("", response_model=list[SiteSectionRead])
def list_sections_route(db: Session = Depends(get_db)):
    return section_service.list_sections(db)


@router.get("/{slug}", response_model=SiteSectionRead)
def get_section_route(slug: str, db: Session = Depends(get_db)):
    section = section_service.get_section(db, slug)
    if section is None:
        raise HTTPException(status_code=404, detail="Seção não encontrada.")
    return section
