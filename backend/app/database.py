import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base

BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")


def normalize_database_url(database_url: str) -> str:
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    if database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+psycopg://", 1)

    return database_url


DATABASE_URL = normalize_database_url(
    os.getenv("DATABASE_URL", "sqlite:///./catedral_erp.db")
)

connect_args = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


PRODUCT_COLUMN_MIGRATIONS = {
    "description": "VARCHAR DEFAULT ''",
    "category": "VARCHAR DEFAULT ''",
    "supplier": "VARCHAR DEFAULT ''",
    "barcode": "VARCHAR DEFAULT ''",
    "image_url": "VARCHAR DEFAULT ''",
    "minimum_stock": "INTEGER DEFAULT 0",
}


def ensure_product_columns():
    inspector = inspect(engine)

    if not inspector.has_table("products"):
        return

    existing = {column["name"] for column in inspector.get_columns("products")}

    with engine.begin() as connection:
        for column_name, column_type in PRODUCT_COLUMN_MIGRATIONS.items():
            if column_name in existing:
                continue

            connection.execute(
                text(f"ALTER TABLE products ADD COLUMN {column_name} {column_type}")
            )
