from datetime import datetime

from sqlalchemy import Boolean, Column, Integer, String, Float, DateTime, Text
from .database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, index=True)
    name = Column(String, index=True)
    description = Column(String, default="")
    category = Column(String, default="")
    supplier = Column(String, default="")
    barcode = Column(String, default="")
    image_url = Column(String, default="")
    cost = Column(Float, default=0)
    sale_price = Column(Float, default=0)
    stock = Column(Integer, default=0)
    minimum_stock = Column(Integer, default=0)
    marketplace = Column(String, default="Shopee")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    value = Column(Float, default=0)
    category = Column(String, default="Geral")


class Revenue(Base):
    __tablename__ = "revenues"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, default="")
    value = Column(Float, default=0)
    category = Column(String, default="Venda")
    marketplace = Column(String, default="", index=True)
    external_id = Column(String, default="", index=True)
    sku = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class PricingHistory(Base):
    __tablename__ = "pricing_history"

    id = Column(Integer, primary_key=True, index=True)

    product_id = Column(Integer, default=0)
    sku = Column(String, default="")
    product_name = Column(String, default="")
    marketplace = Column(String, default="")

    suggested_price = Column(Float, default=0)
    profit = Column(Float, default=0)
    margin = Column(Float, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="")
    email = Column(String, unique=True, index=True)
    phone = Column(String, default="", index=True)
    password_hash = Column(String)
    role = Column(String, default="admin")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AuthSession(Base):
    __tablename__ = "auth_sessions"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True)
    user_id = Column(Integer, index=True)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class VerificationCode(Base):
    __tablename__ = "verification_codes"

    id = Column(Integer, primary_key=True, index=True)
    purpose = Column(String, index=True)
    challenge_id = Column(String, unique=True, index=True)
    user_id = Column(Integer, nullable=True, index=True)
    email = Column(String, default="", index=True)
    phone = Column(String, default="", index=True)
    channel = Column(String, default="email")
    code_hash = Column(String, default="")
    email_code_hash = Column(String, default="")
    sms_code_hash = Column(String, default="")
    attempts = Column(Integer, default=0)
    expires_at = Column(DateTime, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class StoreIntegration(Base):
    __tablename__ = "store_integrations"

    id = Column(Integer, primary_key=True, index=True)
    marketplace = Column(String, index=True)
    store_name = Column(String, index=True)
    country = Column(String, default="BR")
    shop_id = Column(String, default="")
    status = Column(String, default="Pendente")
    auth_date = Column(String, default="")
    notes = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class MarketplaceCredential(Base):
    __tablename__ = "marketplace_credentials"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String, unique=True, index=True)
    external_user_id = Column(String, default="", index=True)
    nickname = Column(String, default="")
    access_token = Column(Text, default="")
    refresh_token = Column(Text, default="")
    token_type = Column(String, default="bearer")
    scope = Column(String, default="")
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)


class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(String, default="")
    group = Column(String, default="general")
    updated_at = Column(DateTime, default=datetime.utcnow)


class FiscalInvoice(Base):
    __tablename__ = "fiscal_invoices"

    id = Column(Integer, primary_key=True, index=True)
    ref = Column(String, unique=True, index=True)
    document_type = Column(String, default="nfe", index=True)
    provider = Column(String, default="focus_nfe")
    status = Column(String, default="draft", index=True)
    status_sefaz = Column(String, default="")
    mensagem_sefaz = Column(String, default="")
    chave = Column(String, default="", index=True)
    numero = Column(String, default="")
    serie = Column(String, default="")
    valor_total = Column(Float, default=0)
    customer_name = Column(String, default="")
    customer_document = Column(String, default="")
    request_payload = Column(Text, default="")
    response_payload = Column(Text, default="")
    pdf_url = Column(String, default="")
    xml_url = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
