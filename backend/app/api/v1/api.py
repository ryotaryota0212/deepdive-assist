from fastapi import APIRouter
from app.api.v1.endpoints.media import router as media_router
from app.api.v1.endpoints.notes import router as notes_router
from app.api.v1.endpoints.deep_dive import router as deep_dive_router

api_router = APIRouter()

api_router.include_router(media_router, prefix="/media", tags=["media"])
api_router.include_router(notes_router, prefix="/notes", tags=["notes"])
api_router.include_router(deep_dive_router, prefix="/deep-dive", tags=["deep-dive"])
