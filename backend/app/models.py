from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from .database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    cost = Column(Float, nullable=False, default=0)
    sale_price = Column(Float, nullable=False, default=0)
    stock = Column(Integer, nullable=False, default=0)
    marketplace = Column(String, nullable=False, default="Shopee")
    created_at = Column(DateTime, default=datetime.utcnow)

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    value = Column(Float, nullable=False, default=0)
    category = Column(String, nullable=False, default="Fixo")
    created_at = Column(DateTime, default=datetime.utcnow)

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    gross_value = Column(Float, nullable=False, default=0)
    marketplace_fee = Column(Float, nullable=False, default=0)
    freight_fee = Column(Float, nullable=False, default=0)
    anticipation_fee = Column(Float, nullable=False, default=0)
    net_profit = Column(Float, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)