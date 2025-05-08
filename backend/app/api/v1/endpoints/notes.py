from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.repositories.note_repository import NoteRepository
from app.repositories.media_repository import MediaRepository
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.services.ai_service import generate_note_summary

router = APIRouter()

def get_note_repository(db: Session = Depends(get_db)) -> NoteRepository:
    return NoteRepository(db)

def get_media_repository(db: Session = Depends(get_db)) -> MediaRepository:
    return MediaRepository(db)

@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    note: NoteCreate, 
    note_repo: NoteRepository = Depends(get_note_repository),
    media_repo: MediaRepository = Depends(get_media_repository)
):
    """
    Create a new note for a media item.
    """
    db_media = media_repo.get(note.media_id)
    if not db_media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    db_note = note_repo.create(note)
    
    if note.content:
        try:
            ai_summary = generate_note_summary(note.content)
            db_note = note_repo.update_ai_summary(db_note.id, ai_summary)
        except Exception as e:
            print(f"Error generating AI summary: {e}")
    
    return db_note

@router.get("/", response_model=List[NoteResponse])
def read_notes(
    skip: int = 0, 
    limit: int = 100, 
    media_id: Optional[int] = None, 
    repo: NoteRepository = Depends(get_note_repository)
):
    """
    Retrieve notes with optional filtering by media ID.
    """
    if media_id:
        return repo.get_by_media_id(media_id, skip, limit)
    else:
        return repo.get_multi(skip=skip, limit=limit)

@router.get("/{note_id}", response_model=NoteResponse)
def read_note(
    note_id: int, 
    repo: NoteRepository = Depends(get_note_repository)
):
    """
    Get a specific note by ID.
    """
    db_note = repo.get(note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int, 
    note: NoteUpdate, 
    repo: NoteRepository = Depends(get_note_repository)
):
    """
    Update a note.
    """
    db_note = repo.get(note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db_note = repo.update(note_id, note)
    
    update_data = note.dict(exclude_unset=True)
    if "content" in update_data and update_data["content"]:
        try:
            ai_summary = generate_note_summary(update_data["content"])
            db_note = repo.update_ai_summary(note_id, ai_summary)
        except Exception as e:
            print(f"Error generating AI summary: {e}")
    
    return db_note

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int, 
    repo: NoteRepository = Depends(get_note_repository)
):
    """
    Delete a note.
    """
    success = repo.delete(note_id)
    if not success:
        raise HTTPException(status_code=404, detail="Note not found")
    return None
