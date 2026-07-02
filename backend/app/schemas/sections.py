from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SiteSectionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    title: str
    content: str
    email: str | None = None
    updated_at: datetime
