from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship, column_property
from sqlalchemy.ext.hybrid import hybrid_property
import enum
from datetime import datetime
from app.db.database import Base

class MediaType(str, enum.Enum):
    MOVIE = "MOVIE"
    ANIME = "ANIME"
    BOOK = "BOOK"
    GAME = "GAME"
    MUSIC = "MUSIC"
    OTHER = "OTHER"

class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    media_type = Column(Enum(MediaType), index=True)
    creator = Column(String, nullable=True)
    release_year = Column(Integer, nullable=True)
    cover_image = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    captured_at = Column(DateTime, default=datetime.utcnow)

    notes = relationship("Note", back_populates="media", cascade="all, delete-orphan")
    deep_dive_sessions = relationship("DeepDiveSession", back_populates="media", cascade="all, delete-orphan")
    media_genres = relationship("MediaGenre", back_populates="media", cascade="all, delete-orphan")
    
    @property
    def genres(self):
        """Return genre names as a list of strings for Pydantic schema compatibility"""
        return [mg.genre.name for mg in self.media_genres if mg.genre]
