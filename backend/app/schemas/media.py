from pydantic import BaseModel
from typing import Optional, List, Union
from datetime import datetime
from app.models.media import MediaType

class MediaBase(BaseModel):
    title: str
    media_type: MediaType
    creator: Optional[str] = None
    release_year: Optional[int] = None
    cover_image: Optional[str] = None
    description: Optional[str] = None

class MediaCreate(MediaBase):
    genres: Optional[List[str]] = None

class MediaUpdate(BaseModel):
    title: Optional[str] = None
    media_type: Optional[MediaType] = None
    creator: Optional[str] = None
    release_year: Optional[int] = None
    cover_image: Optional[str] = None
    description: Optional[str] = None
    genres: Optional[List[str]] = None

class MediaResponse(MediaBase):
    id: int
    captured_at: datetime
    genres: Optional[List[str]] = None

    class Config:
        from_attributes = True
