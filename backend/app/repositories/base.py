from typing import Any, Dict, List, Optional, TypeVar, Generic, Type
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.supabase_client import get_supabase_client, is_supabase_available

T = TypeVar('T')
CreateSchemaType = TypeVar('CreateSchemaType', bound=BaseModel)
UpdateSchemaType = TypeVar('UpdateSchemaType', bound=BaseModel)

class BaseRepository(Generic[T, CreateSchemaType, UpdateSchemaType]):
    """
    Base repository class that can work with both SQLAlchemy and Supabase.
    Falls back to SQLAlchemy if Supabase is not available.
    """
    def __init__(
        self, 
        db: Session, 
        model: Type[T], 
        table_name: str,
        id_field: str = "id"
    ):
        self.db = db
        self.model = model
        self.table_name = table_name
        self.id_field = id_field
        self.supabase = get_supabase_client()
    
    def create(self, obj_in: CreateSchemaType) -> T:
        """
        Create a new record in the database.
        """
        if is_supabase_available():
            data = obj_in.dict(exclude={"genres"} if hasattr(obj_in, "genres") else None)
            result = self.supabase.table(self.table_name).insert(data).execute()
            return result.data[0]
        else:
            obj_data = obj_in.dict(exclude={"genres"} if hasattr(obj_in, "genres") else None)
            db_obj = self.model(**obj_data)
            self.db.add(db_obj)
            self.db.commit()
            self.db.refresh(db_obj)
            return db_obj
    
    def get(self, id: Any) -> Optional[T]:
        """
        Get a record by ID.
        """
        if is_supabase_available():
            result = self.supabase.table(self.table_name).select("*").eq(self.id_field, id).execute()
            if result.data:
                return result.data[0]
            return None
        else:
            return self.db.query(self.model).filter(getattr(self.model, self.id_field) == id).first()
    
    def get_multi(self, skip: int = 0, limit: int = 100, **filters) -> List[T]:
        """
        Get multiple records with optional filtering.
        """
        if is_supabase_available():
            query = self.supabase.table(self.table_name).select("*").range(skip, skip + limit)
            
            for field, value in filters.items():
                if value is not None:
                    query = query.eq(field, value)
            
            result = query.execute()
            # captured_atがNoneの場合は現在時刻を設定
            from datetime import datetime
            for item in result.data:
                if not item.get("captured_at"):
                    item["captured_at"] = datetime.utcnow()
            return result.data
        else:
            try:
                query = self.db.query(self.model)
                
                for field, value in filters.items():
                    if value is not None:
                        query = query.filter(getattr(self.model, field) == value)
                
                items = query.offset(skip).limit(limit).all()
                # captured_atがNoneの場合は現在時刻を設定
                from datetime import datetime
                for item in items:
                    if not item.captured_at:
                        item.captured_at = datetime.utcnow()
                self.db.commit()
                return items
            except Exception as e:
                if "is not among the defined enum values" in str(e):
                    from app.db.init_db import init_db
                    init_db()  # Recreate tables
                    return []  # Return empty list for now
                raise
    
    def update(self, id: Any, obj_in: UpdateSchemaType) -> Optional[T]:
        """
        Update a record by ID.
        """
        if is_supabase_available():
            data = obj_in.dict(exclude_unset=True)
            result = self.supabase.table(self.table_name).update(data).eq(self.id_field, id).execute()
            if result.data:
                return result.data[0]
            return None
        else:
            db_obj = self.db.query(self.model).filter(getattr(self.model, self.id_field) == id).first()
            if db_obj:
                update_data = obj_in.dict(exclude_unset=True)
                for field, value in update_data.items():
                    setattr(db_obj, field, value)
                self.db.commit()
                self.db.refresh(db_obj)
                return db_obj
            return None
    
    def delete(self, id: Any) -> bool:
        """
        Delete a record by ID.
        """
        if is_supabase_available():
            result = self.supabase.table(self.table_name).delete().eq(self.id_field, id).execute()
            return bool(result.data)
        else:
            db_obj = self.db.query(self.model).filter(getattr(self.model, self.id_field) == id).first()
            if db_obj:
                self.db.delete(db_obj)
                self.db.commit()
                return True
            return False
