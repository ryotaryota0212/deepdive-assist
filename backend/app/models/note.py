from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey("media.id"))
    content = Column(Text)
    rating = Column(Float, nullable=True)  # 1-5 star rating
    emotion = Column(String, nullable=True)  # User's emotion when creating the note
    ai_summary = Column(Text, nullable=True)  # AI-generated summary
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    media = relationship("Media", back_populates="notes")
