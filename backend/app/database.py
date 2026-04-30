from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQL Server Express connection string
# Format: mssql+pyodbc://username:password@server/database?driver=ODBC+Driver+17+for+SQL+Server
DATABASE_URL = (
    "mssql+pyodbc://localhost\\SQLEXPRESS/PizzaApp"
    "?driver=ODBC+Driver+17+for+SQL+Server"
    "&trusted_connection=yes"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency that provides a DB session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
