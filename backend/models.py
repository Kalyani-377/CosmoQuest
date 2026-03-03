from sqlalchemy import Column, Integer, String
from db import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True)
    type = Column(String)  # e.g., 'iss', 'planet', etc.
    event_type = Column(String) # e.g., 'Jupiter Brightness'
    description = Column(String)
    location = Column(String) # e.g., 'Global', 'New York, USA', etc.
    visibility = Column(String, default="High")
    date = Column(String) # e.g., '2026-02-23'
