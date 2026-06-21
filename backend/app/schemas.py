from pydantic import BaseModel

class ProductCreate(BaseModel):
    sku: str
    name: str
    cost: float
    sale_price: float
    stock: int
    marketplace: str = "Shopee"


class ExpenseCreate(BaseModel):
    name: str
    value: float
    category: str = "Geral"


class PriceSimulation(BaseModel):
    cost: float
    desired_profit_percent: float = 15
    marketplace_fee_percent: float = 18
    freight_percent: float = 4
    anticipation_percent: float = 3.5
    fixed_cost_percent: float = 0
