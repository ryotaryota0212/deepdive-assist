from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RelatedWorkBase(BaseModel):
    title: str
    creator: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None

class RelatedWorkResponse(RelatedWorkBase):
    id: int
    deep_dive_session_id: int

    class Config:
        from_attributes = True

class DeepDiveBase(BaseModel):
    question: str

class DeepDiveCreate(DeepDiveBase):
    media_id: int

class DeepDiveResponse(DeepDiveBase):
    id: int
    media_id: int
    answer: str
    created_at: datetime
    related_works: Optional[List[RelatedWorkResponse]] = None

    class Config:
        from_attributes = True
