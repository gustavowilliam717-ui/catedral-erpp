from pydantic import BaseModel

class ProductCreate(BaseModel):
    sku: str
    name: str
    description: str = ""
    category: str = ""
    supplier: str = ""
    barcode: str = ""
    image_url: str = ""
    cost: float
    sale_price: float
    stock: int
    minimum_stock: int = 0
    marketplace: str = "Shopee"

class ExpenseCreate(BaseModel):
    name: str
    value: float
    category: str = "Geral"


class RevenueCreate(BaseModel):
    description: str
    value: float
    category: str = "Venda"


class PriceSimulation(BaseModel):
    cost: float
    desired_profit_percent: float = 15
    marketplace_fee_percent: float = 18
    freight_percent: float = 4
    anticipation_percent: float = 3.5
    fixed_cost_percent: float = 0

class PricingHistoryCreate(BaseModel):
    product_id: int = 0
    sku: str = ""
    product_name: str = ""
    marketplace: str = ""
    suggested_price: float = 0
    profit: float = 0
    margin: float = 0
