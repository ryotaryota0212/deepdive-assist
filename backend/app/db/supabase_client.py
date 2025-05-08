import os
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Optional

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

_supabase_client: Optional[Client] = None

def get_supabase_client() -> Optional[Client]:
    """
    Returns a Supabase client instance if credentials are available.
    Returns None if credentials are not set, allowing fallback to SQLite.
    """
    global _supabase_client
    
    if _supabase_client is not None:
        return _supabase_client
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Supabase credentials not found. Using SQLite database instead.")
        return None
    
    try:
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Successfully connected to Supabase.")
        return _supabase_client
    except Exception as e:
        print(f"Error connecting to Supabase: {e}")
        return None

def is_supabase_available() -> bool:
    """
    Check if Supabase is available and configured.
    """
    return get_supabase_client() is not None
