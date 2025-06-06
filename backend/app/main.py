from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from app.db.database import get_db
from app.db.init_db import init_db
from app.api.v1.api import api_router

load_dotenv()

app = FastAPI(
    title=os.getenv("APP_NAME", "DeepDive Assist Backend"),
    description="Backend API for the DeepDive Assist application",
    version="0.1.0",
)

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 開発環境では全てのオリジンを許可
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1/media")

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/healthz")
async def healthz(db: Session = Depends(get_db)):
    return {"status": "ok", "database": "connected"}
