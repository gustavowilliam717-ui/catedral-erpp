import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_DIR = BACKEND_DIR.parent

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

load_dotenv(BACKEND_DIR / ".env")

from app import models  # noqa: E402
from app.database import Base, normalize_database_url  # noqa: E402


MODEL_CLASSES = [
    models.Product,
    models.Expense,
    models.Revenue,
    models.PricingHistory,
    models.User,
    models.AuthSession,
    models.StoreIntegration,
    models.Setting,
]


def default_sqlite_url() -> str:
    sqlite_path = BACKEND_DIR / "catedral_erp.db"
    return f"sqlite:///{sqlite_path.as_posix()}"


def is_postgres_url(database_url: str) -> bool:
    return database_url.startswith("postgresql")


def build_engine(database_url: str):
    database_url = normalize_database_url(database_url)
    connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
    return create_engine(database_url, connect_args=connect_args, pool_pre_ping=True)


def model_payload(row, model_class):
    return {
        column.name: getattr(row, column.name)
        for column in model_class.__table__.columns
    }


def reset_postgres_sequences(session):
    for model_class in MODEL_CLASSES:
        table_name = model_class.__tablename__

        if "id" not in model_class.__table__.columns:
            continue

        quoted_table = f'"{table_name}"'
        session.execute(
            text(
                "SELECT setval("
                f"pg_get_serial_sequence('{table_name}', 'id'), "
                f"COALESCE((SELECT MAX(id) FROM {quoted_table}), 1), "
                f"(SELECT MAX(id) FROM {quoted_table}) IS NOT NULL"
                ")"
            )
        )


def migrate(source_url: str, target_url: str):
    source_engine = build_engine(source_url)
    target_engine = build_engine(target_url)

    if not is_postgres_url(str(target_engine.url)):
        raise RuntimeError("O destino precisa ser PostgreSQL.")

    Base.metadata.create_all(bind=target_engine)

    SourceSession = sessionmaker(bind=source_engine, autocommit=False, autoflush=False)
    TargetSession = sessionmaker(bind=target_engine, autocommit=False, autoflush=False)

    source_session = SourceSession()
    target_session = TargetSession()
    copied = {}

    try:
        for model_class in MODEL_CLASSES:
            rows = source_session.query(model_class).all()

            for row in rows:
                target_session.merge(model_class(**model_payload(row, model_class)))

            copied[model_class.__tablename__] = len(rows)

        target_session.commit()
        reset_postgres_sequences(target_session)
        target_session.commit()
        return copied
    except Exception:
        target_session.rollback()
        raise
    finally:
        source_session.close()
        target_session.close()
        source_engine.dispose()
        target_engine.dispose()


def main():
    parser = argparse.ArgumentParser(
        description="Migra os dados do SQLite atual para PostgreSQL."
    )
    parser.add_argument(
        "--source",
        default=os.getenv("SQLITE_DATABASE_URL", default_sqlite_url()),
        help="URL do SQLite de origem. Padrao: backend/catedral_erp.db",
    )
    parser.add_argument(
        "--target",
        default=os.getenv("POSTGRES_DATABASE_URL") or os.getenv("DATABASE_URL"),
        help="URL PostgreSQL de destino. Tambem pode vir de POSTGRES_DATABASE_URL ou DATABASE_URL.",
    )
    args = parser.parse_args()

    if not args.target:
        raise SystemExit(
            "Informe --target ou configure DATABASE_URL/POSTGRES_DATABASE_URL no backend/.env"
        )

    copied = migrate(args.source, args.target)

    print("Migracao concluida:")
    for table_name, total in copied.items():
        print(f"- {table_name}: {total} registros")


if __name__ == "__main__":
    main()
