from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate
from app.repositories.base import BaseRepository

class NoteRepository(BaseRepository[Note, NoteCreate, NoteUpdate]):
    """
    Repository for Note model operations.
    """
    def __init__(self, db: Session):
        super().__init__(db, Note, "notes")
    
    def get_by_media_id(self, media_id: int, skip: int = 0, limit: int = 100) -> List[Note]:
        """
        Get notes by media ID.
        """
        return self.get_multi(skip=skip, limit=limit, media_id=media_id)
    
    def update_ai_summary(self, note_id: int, ai_summary: str) -> Optional[Note]:
        """
        Update the AI summary for a note.
        """
        if self.is_supabase_available():
            result = self.supabase.table(self.table_name).update({
                "ai_summary": ai_summary
            }).eq(self.id_field, note_id).execute()
            
            if result.data:
                return result.data[0]
            return None
        else:
            db_note = self.db.query(self.model).filter(self.model.id == note_id).first()
            if db_note:
                db_note.ai_summary = ai_summary
                self.db.commit()
                self.db.refresh(db_note)
                return db_note
            return None
    
    def is_supabase_available(self) -> bool:
        """
        Check if Supabase is available.
        """
        return self.supabase is not None
