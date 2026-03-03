import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

print(f"Connecting to: {DATABASE_URL[:20]}... (truncated for safety)")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        print("\n✅ SUCCESS! Connection established.")
        print(f"PostgreSQL version: {result.fetchone()[0]}")
except Exception as e:
    print("\n❌ FAILED! Could not connect to the database.")
    print(f"Error: {e}")
