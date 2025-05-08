from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NoteBase(BaseModel):
    content: str
    rating: Optional[float] = None
    emotion: Optional[str] = None

class NoteCreate(NoteBase):
    media_id: int

class NoteUpdate(BaseModel):
    content: Optional[str] = None
    rating: Optional[float] = None
    emotion: Optional[str] = None

class NoteResponse(NoteBase):
    id: int
    media_id: int
    ai_summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
