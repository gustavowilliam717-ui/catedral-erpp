from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Product(Base):
    __tablename__ = "products"

   id
sku
name
description
category
supplier
cost
sale_price
stock
minimum_stock
barcode
image_url
marketplace
active
created_at
updated_at

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    value = Column(Float, default=0)
    category = Column(String, default="Geral")
