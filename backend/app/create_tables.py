"""
Run this script once to create all database tables.
Usage: python create_tables.py
"""
from database import Base, engine
import models  # noqa: F401 — import so SQLAlchemy registers all models

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done! Tables created successfully.")
