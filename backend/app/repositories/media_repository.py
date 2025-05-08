from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.media import Media
from app.schemas.media import MediaCreate, MediaUpdate
from app.repositories.base import BaseRepository

class MediaRepository(BaseRepository[Media, MediaCreate, MediaUpdate]):
    """
    Repository for Media model operations.
    """
    def __init__(self, db: Session):
        super().__init__(db, Media, "media")
    
    def get_by_title(self, title: str) -> Optional[Media]:
        """
        Get a media item by title.
        """
        if self.is_supabase_available():
            result = self.supabase.table(self.table_name).select("*").ilike("title", f"%{title}%").execute()
            if result.data:
                return result.data[0]
            return None
        else:
            return self.db.query(self.model).filter(self.model.title.ilike(f"%{title}%")).first()
    
    def get_by_media_type(self, media_type: str, skip: int = 0, limit: int = 100) -> List[Media]:
        """
        Get media items by media type.
        """
        return self.get_multi(skip=skip, limit=limit, media_type=media_type)
    
    def add_genre(self, media_id: int, genre_name: str) -> bool:
        """
        Add a genre to a media item.
        """
        if self.is_supabase_available():
            genre_result = self.supabase.table("genres").select("*").eq("name", genre_name).execute()
            
            genre_id = None
            if genre_result.data:
                genre_id = genre_result.data[0]["id"]
            else:
                new_genre = self.supabase.table("genres").insert({"name": genre_name}).execute()
                genre_id = new_genre.data[0]["id"]
            
            self.supabase.table("media_genres").insert({
                "media_id": media_id,
                "genre_id": genre_id
            }).execute()
            
            return True
        else:
            from app.models.genre import Genre, MediaGenre
            
            db_genre = self.db.query(Genre).filter(Genre.name == genre_name).first()
            if not db_genre:
                db_genre = Genre(name=genre_name)
                self.db.add(db_genre)
                self.db.commit()
                self.db.refresh(db_genre)
            
            db_media_genre = MediaGenre(media_id=media_id, genre_id=db_genre.id)
            self.db.add(db_media_genre)
            self.db.commit()
            
            return True
    
    def is_supabase_available(self) -> bool:
        """
        Check if Supabase is available.
        """
        return self.supabase is not None
