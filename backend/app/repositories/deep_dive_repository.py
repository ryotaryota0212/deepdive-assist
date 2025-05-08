from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.deep_dive import DeepDiveSession, RelatedWork
from app.schemas.deep_dive import DeepDiveCreate
from app.repositories.base import BaseRepository

class DeepDiveRepository(BaseRepository[DeepDiveSession, DeepDiveCreate, DeepDiveCreate]):
    """
    Repository for DeepDiveSession model operations.
    """
    def __init__(self, db: Session):
        super().__init__(db, DeepDiveSession, "deep_dive_sessions")
    
    def get_by_media_id(self, media_id: int, skip: int = 0, limit: int = 100) -> List[DeepDiveSession]:
        """
        Get deep dive sessions by media ID.
        """
        return self.get_multi(skip=skip, limit=limit, media_id=media_id)
    
    def create_with_related_works(
        self, 
        deep_dive_data: DeepDiveCreate, 
        answer: str,
        related_works: List[Dict[str, Any]]
    ) -> Tuple[DeepDiveSession, List[RelatedWork]]:
        """
        Create a deep dive session with related works.
        """
        if self.is_supabase_available():
            session_data = {
                "media_id": deep_dive_data.media_id,
                "question": deep_dive_data.question,
                "answer": answer
            }
            
            result = self.supabase.table(self.table_name).insert(session_data).execute()
            session = result.data[0]
            
            related_work_objects = []
            for work in related_works:
                work_data = {
                    "deep_dive_session_id": session["id"],
                    "title": work.get("title", ""),
                    "creator": work.get("creator"),
                    "description": work.get("description"),
                    "url": work.get("url")
                }
                
                work_result = self.supabase.table("related_works").insert(work_data).execute()
                related_work_objects.append(work_result.data[0])
            
            return session, related_work_objects
        else:
            db_session = DeepDiveSession(
                media_id=deep_dive_data.media_id,
                question=deep_dive_data.question,
                answer=answer
            )
            
            self.db.add(db_session)
            self.db.commit()
            self.db.refresh(db_session)
            
            related_work_objects = []
            for work in related_works:
                db_related_work = RelatedWork(
                    deep_dive_session_id=db_session.id,
                    title=work.get("title", ""),
                    creator=work.get("creator"),
                    description=work.get("description"),
                    url=work.get("url")
                )
                
                self.db.add(db_related_work)
                related_work_objects.append(db_related_work)
            
            self.db.commit()
            for work in related_work_objects:
                self.db.refresh(work)
            
            return db_session, related_work_objects
    
    def is_supabase_available(self) -> bool:
        """
        Check if Supabase is available.
        """
        return self.supabase is not None
