from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    
    media_genres = relationship("MediaGenre", back_populates="genre")

class MediaGenre(Base):
    __tablename__ = "media_genres"

    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey("media.id"))
    genre_id = Column(Integer, ForeignKey("genres.id"))
    
    media = relationship("Media", back_populates="media_genres")
    genre = relationship("Genre", back_populates="media_genres")
