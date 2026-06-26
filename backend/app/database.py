import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import OperationalError
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


USER_COLUMN_MIGRATIONS = {
    "phone": "VARCHAR DEFAULT ''",
}


REVENUE_COLUMN_MIGRATIONS = {
    "marketplace": "VARCHAR DEFAULT ''",
    "external_id": "VARCHAR DEFAULT ''",
    "sku": "VARCHAR DEFAULT ''",
    "created_at": "TIMESTAMP",
}


VERIFICATION_CODE_COLUMN_MIGRATIONS = {
    "attempts": "INTEGER DEFAULT 0",
}


FISCAL_INVOICE_COLUMN_MIGRATIONS = {
    "document_type": "VARCHAR DEFAULT 'nfe'",
    "provider": "VARCHAR DEFAULT 'focus_nfe'",
    "status": "VARCHAR DEFAULT 'draft'",
    "status_sefaz": "VARCHAR DEFAULT ''",
    "mensagem_sefaz": "VARCHAR DEFAULT ''",
    "chave": "VARCHAR DEFAULT ''",
    "numero": "VARCHAR DEFAULT ''",
    "serie": "VARCHAR DEFAULT ''",
    "valor_total": "FLOAT DEFAULT 0",
    "customer_name": "VARCHAR DEFAULT ''",
    "customer_document": "VARCHAR DEFAULT ''",
    "request_payload": "TEXT DEFAULT ''",
    "response_payload": "TEXT DEFAULT ''",
    "pdf_url": "VARCHAR DEFAULT ''",
    "xml_url": "VARCHAR DEFAULT ''",
    "updated_at": "TIMESTAMP",
}


def _ensure_columns(table_name: str, migrations: dict):
    inspector = inspect(engine)

    if not inspector.has_table(table_name):
        return

    existing = {column["name"] for column in inspector.get_columns(table_name)}

    for column_name, column_type in migrations.items():
        if column_name in existing:
            continue

        # Cada coluna roda na propria transacao para que uma falha isolada
        # nao impeca as demais migracoes nem derrube a inicializacao do app.
        try:
            with engine.begin() as connection:
                connection.execute(
                    text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}")
                )
        except Exception as exc:
            if "duplicate column" in str(exc).lower() or "already exists" in str(exc).lower():
                continue

            print(
                f"[migracao] Aviso: nao foi possivel adicionar {table_name}.{column_name}: {exc}"
            )


def ensure_product_columns():
    _ensure_columns("products", PRODUCT_COLUMN_MIGRATIONS)


def ensure_user_columns():
    _ensure_columns("users", USER_COLUMN_MIGRATIONS)


def ensure_revenue_columns():
    _ensure_columns("revenues", REVENUE_COLUMN_MIGRATIONS)


def ensure_verification_code_columns():
    _ensure_columns("verification_codes", VERIFICATION_CODE_COLUMN_MIGRATIONS)


def ensure_fiscal_invoice_columns():
    _ensure_columns("fiscal_invoices", FISCAL_INVOICE_COLUMN_MIGRATIONS)
