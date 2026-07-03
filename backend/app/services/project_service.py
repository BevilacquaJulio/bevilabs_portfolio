import uuid

from sqlalchemy.orm import Session

from app.models import Project
from app.schemas.projects import ProjectCreate, ProjectUpdate

ALLOWED_ICONS = {
    "folder",
    "rocket",
    "zap",
    "layers",
    "code",
    "globe",
    "link",
    "box",
    "terminal",
    "chart",
}


def normalize_icon(icon: str) -> str:
    normalized = icon.strip().lower()
    if normalized in ALLOWED_ICONS:
        return normalized
    return "folder"


def list_projects(db: Session) -> list[Project]:
    return db.query(Project).order_by(Project.created_at.desc()).all()


def get_project(db: Session, project_id: str) -> Project | None:
    return db.get(Project, project_id)


def create_project(db: Session, data: ProjectCreate) -> Project:
    project = Project(
        id=str(uuid.uuid4()),
        title=data.title.strip(),
        icon=normalize_icon(data.icon),
        description=data.description.strip(),
        link=str(data.link).strip(),
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def update_project(db: Session, project: Project, data: ProjectUpdate) -> Project:
    project.title = data.title.strip()
    project.icon = normalize_icon(data.icon)
    project.description = data.description.strip()
    project.link = str(data.link).strip()
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project) -> None:
    db.delete(project)
    db.commit()
