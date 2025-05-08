from sqlalchemy.orm import Session
from app.db.database import Base, engine
from app.models.media import Media, MediaType
from app.models.note import Note
from app.models.deep_dive import DeepDiveSession, RelatedWork
from app.models.genre import Genre, MediaGenre

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    from app.db.database import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
