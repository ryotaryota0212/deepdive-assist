import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.supabase_client import get_supabase_client, is_supabase_available

def test_supabase_connection():
    """
    Test the Supabase connection.
    This will print a message indicating whether Supabase is available or not.
    """
    load_dotenv()
    
    print("Testing Supabase connection...")
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        print("Supabase credentials not found in .env file.")
        print("To use Supabase, add the following to your .env file:")
        print("SUPABASE_URL=your_supabase_url")
        print("SUPABASE_KEY=your_supabase_key")
        print("\nFalling back to SQLite database for local testing.")
        return
    
    client = get_supabase_client()
    
    if client:
        print("Successfully connected to Supabase!")
        print("Supabase is available and configured correctly.")
    else:
        print("Failed to connect to Supabase.")
        print("Check your credentials and try again.")
        print("Falling back to SQLite database for local testing.")

if __name__ == "__main__":
    test_supabase_connection()
