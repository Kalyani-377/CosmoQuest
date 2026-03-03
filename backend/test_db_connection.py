import os
from sqlalchemy import text
from db import engine, SessionLocal
from models import Event

def test_connection():
    print("--- Starting Database Connection Test ---")
    try:
        # Try to connect and execute a simple query
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Success: Established connection to the database!")
            
        # Try to session query
        db = SessionLocal()
        try:
            # Check for events table
            count = db.query(Event).count()
            print(f"✅ Success: 'events' table is accessible. Current row count: {count}")
        except Exception as e:
            print(f"❌ Error querying table: {str(e)}")
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ CRITICAL ERROR: Could not connect to the database.")
        print(f"Details: {str(e)}")
        print("\nPossible solutions:")
        print("1. Check your internet connection.")
        print("2. Verify DATABASE_URL in backend/.env is correct.")
        print("3. Ensure your database IP whitelist (if any) allows your current connection.")

if __name__ == "__main__":
    test_connection()
