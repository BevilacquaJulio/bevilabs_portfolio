from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class ProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    icon: str = Field(min_length=1, max_length=32)
    description: str = Field(min_length=1)
    link: HttpUrl


class ProjectUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    icon: str = Field(min_length=1, max_length=32)
    description: str = Field(min_length=1)
    link: HttpUrl


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    icon: str
    description: str
    link: str
    created_at: datetime
    updated_at: datetime
