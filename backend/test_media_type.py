import sys
import os
from sqlalchemy.orm import Session
from app.db.database import engine, Base, SessionLocal
from app.models.media import Media, MediaType

def test_media_type():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create a session
    db = SessionLocal()
    
    try:
        # Create a test media item
        test_media = Media(
            title="Test Media",
            media_type=MediaType.ANIME,  # Using the enum value
            creator="Test Creator",
            description="Test Description"
        )
        
        # Add to session and commit
        db.add(test_media)
        db.commit()
        db.refresh(test_media)
        
        print(f"Created media item with ID: {test_media.id}")
        print(f"Media type: {test_media.media_type}")
        print(f"Media type value: {test_media.media_type.value}")
        
        # Query the media item
        db_media = db.query(Media).filter(Media.id == test_media.id).first()
        print(f"Retrieved media item with ID: {db_media.id}")
        print(f"Retrieved media type: {db_media.media_type}")
        print(f"Retrieved media type value: {db_media.media_type.value}")
        
        # Test filtering by media type
        anime_media = db.query(Media).filter(Media.media_type == MediaType.ANIME).all()
        print(f"Found {len(anime_media)} anime media items")
        
        # Clean up
        db.delete(test_media)
        db.commit()
        
        print("Test completed successfully")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Add the parent directory to sys.path
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    test_media_type()
