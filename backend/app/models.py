from sqlalchemy import Column, Integer, String, Float
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
