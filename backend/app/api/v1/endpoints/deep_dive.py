from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.repositories.deep_dive_repository import DeepDiveRepository
from app.repositories.media_repository import MediaRepository
from app.repositories.note_repository import NoteRepository
from app.schemas.deep_dive import DeepDiveCreate, DeepDiveResponse
from app.services.ai_service import generate_deep_dive_response

router = APIRouter()

def get_deep_dive_repository(db: Session = Depends(get_db)) -> DeepDiveRepository:
    return DeepDiveRepository(db)

def get_media_repository(db: Session = Depends(get_db)) -> MediaRepository:
    return MediaRepository(db)

def get_note_repository(db: Session = Depends(get_db)) -> NoteRepository:
    return NoteRepository(db)

@router.post("/", response_model=DeepDiveResponse, status_code=status.HTTP_201_CREATED)
def create_deep_dive_session(
    deep_dive: DeepDiveCreate, 
    deep_dive_repo: DeepDiveRepository = Depends(get_deep_dive_repository),
    media_repo: MediaRepository = Depends(get_media_repository),
    note_repo: NoteRepository = Depends(get_note_repository)
):
    """
    Create a new deep dive session for a media item.
    """
    db_media = media_repo.get(deep_dive.media_id)
    if not db_media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    user_notes = note_repo.get_by_media_id(deep_dive.media_id)
    
    try:
        ai_response, related_works = generate_deep_dive_response(
            question=deep_dive.question,
            media=db_media,
            user_notes=user_notes
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating AI response: {str(e)}"
        )
    
    db_deep_dive, _ = deep_dive_repo.create_with_related_works(
        deep_dive_data=deep_dive,
        answer=ai_response,
        related_works=related_works
    )
    
    return db_deep_dive

@router.get("/", response_model=List[DeepDiveResponse])
def read_deep_dive_sessions(
    skip: int = 0, 
    limit: int = 100, 
    media_id: Optional[int] = None, 
    repo: DeepDiveRepository = Depends(get_deep_dive_repository)
):
    """
    Retrieve deep dive sessions with optional filtering by media ID.
    """
    if media_id:
        return repo.get_by_media_id(media_id, skip, limit)
    else:
        return repo.get_multi(skip=skip, limit=limit)

@router.get("/{session_id}", response_model=DeepDiveResponse)
def read_deep_dive_session(
    session_id: int, 
    repo: DeepDiveRepository = Depends(get_deep_dive_repository)
):
    """
    Get a specific deep dive session by ID.
    """
    db_session = repo.get(session_id)
    if db_session is None:
        raise HTTPException(status_code=404, detail="Deep dive session not found")
    return db_session

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deep_dive_session(
    session_id: int, 
    repo: DeepDiveRepository = Depends(get_deep_dive_repository)
):
    """
    Delete a deep dive session.
    """
    success = repo.delete(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Deep dive session not found")
    return None
