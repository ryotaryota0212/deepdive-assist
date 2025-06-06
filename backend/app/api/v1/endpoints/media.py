from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.media import Media, MediaType
from app.repositories.media_repository import MediaRepository
from app.schemas.media import MediaCreate, MediaUpdate, MediaResponse
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

def get_media_repository(db: Session = Depends(get_db)) -> MediaRepository:
    return MediaRepository(db)

@router.post("/", response_model=MediaResponse, status_code=status.HTTP_201_CREATED)
def create_media(
    media: MediaCreate, 
    repo: MediaRepository = Depends(get_media_repository)
):
    """
    Create a new media item.
    """
    try:
        print('media:', media)
        print('media.media_type:', media.media_type)
        if isinstance(media.media_type, str):
            media_type_str = media.media_type.lower()
            for enum_val in MediaType:
                if enum_val.value.lower() == media_type_str:
                    media.media_type = enum_val
                    break
        
        logger.info(f"Creating media with type: {media.media_type}")
        db_media = repo.create(media)
        
        if media.genres:
            # Supabaseの場合はdict、SQLAlchemyの場合はモデル
            media_id = db_media["id"] if isinstance(db_media, dict) else db_media.id
            for genre_name in media.genres:
                repo.add_genre(media_id, genre_name)
        
        # 返却値もPydanticスキーマに変換
        if isinstance(db_media, dict):
            # genresプロパティを追加
            db_media["genres"] = media.genres or []
            # captured_atがNoneなら現在時刻をセット
            if not db_media.get("captured_at"):
                db_media["captured_at"] = datetime.utcnow()
            return MediaResponse(**db_media)
        else:
            return db_media
    except Exception as e:
        logger.error(f"Error creating media: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating media: {str(e)}"
        )

@router.get("/", response_model=List[MediaResponse])
def read_media_items(
    skip: int = 0, 
    limit: int = 100, 
    media_type: Optional[MediaType] = None,
    repo: MediaRepository = Depends(get_media_repository)
):
    """
    Retrieve media items with optional filtering by media type.
    """
    try:
        items = []
        if media_type:
            items = repo.get_by_media_type(media_type, skip, limit)
        else:
            items = repo.get_multi(skip=skip, limit=limit)
        
        # captured_atがNoneの場合は現在時刻を設定
        for item in items:
            if isinstance(item, dict):
                if not item.get("captured_at"):
                    item["captured_at"] = datetime.utcnow()
            else:
                if not item.captured_at:
                    item.captured_at = datetime.utcnow()
        
        return items
    except Exception as e:
        logger.error(f"Error retrieving media items: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving media items: {str(e)}"
        )

@router.get("/{media_id}", response_model=MediaResponse)
def read_media(
    media_id: str, 
    repo: MediaRepository = Depends(get_media_repository)
):
    """
    Get a specific media item by ID.
    """
    db_media = repo.get(media_id)
    if db_media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    return db_media

@router.put("/{media_id}", response_model=MediaResponse)
def update_media(
    media_id: str, 
    media: MediaUpdate, 
    repo: MediaRepository = Depends(get_media_repository)
):
    """
    Update a media item.
    """
    db_media = repo.get(media_id)
    if db_media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    
    db_media = repo.update(media_id, media)
    
    if hasattr(media, "genres") and media.genres is not None:
        for genre_name in media.genres:
            repo.add_genre(media_id, genre_name)
    
    return db_media

@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(
    media_id: str, 
    repo: MediaRepository = Depends(get_media_repository)
):
    """
    Delete a media item.
    """
    success = repo.delete(media_id)
    if not success:
        raise HTTPException(status_code=404, detail="Media not found")
    return None
