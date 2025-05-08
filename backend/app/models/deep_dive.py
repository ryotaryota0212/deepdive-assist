from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class DeepDiveSession(Base):
    __tablename__ = "deep_dive_sessions"

    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey("media.id"))
    question = Column(Text)
    answer = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    media = relationship("Media", back_populates="deep_dive_sessions")
    related_works = relationship("RelatedWork", back_populates="deep_dive_session", cascade="all, delete-orphan")

class RelatedWork(Base):
    __tablename__ = "related_works"

    id = Column(Integer, primary_key=True, index=True)
    deep_dive_session_id = Column(Integer, ForeignKey("deep_dive_sessions.id"))
    title = Column(String)
    creator = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    url = Column(String, nullable=True)
    
    deep_dive_session = relationship("DeepDiveSession", back_populates="related_works")
