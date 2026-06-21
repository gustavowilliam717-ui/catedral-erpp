from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from . import models, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Catedral ERP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Catedral ERP rodando com sucesso"}


@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    expenses = db.query(models.Expense).all()

    total_stock_value = sum(p.cost * p.stock for p in products)
    total_sales_value = sum(p.sale_price * p.stock for p in products)
    total_cost_value = sum(p.cost * p.stock for p in products)
    estimated_profit = total_sales_value - total_cost_value
    monthly_expenses = sum(e.value for e in expenses)

    return {
        "total_products": len(products),
        "total_stock_value": round(total_stock_value, 2),
        "total_sales_value": round(total_sales_value, 2),
        "estimated_profit": round(estimated_profit, 2),
        "monthly_expenses": round(monthly_expenses, 2),
    }


@app.post("/products")
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@app.get("/products")
def list_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


@app.put("/products/{product_id}")
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    for key, value in product.model_dump().items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    return db_product


@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    db.delete(db_product)
    db.commit()

    return {"message": "Produto excluído com sucesso"}


@app.post("/expenses")
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = models.Expense(**expense.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@app.get("/expenses")
def list_expenses(db: Session = Depends(get_db)):
    return db.query(models.Expense).all()


@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()

    if not db_expense:
        raise HTTPException(status_code=404, detail="Despesa não encontrada")

    db.delete(db_expense)
    db.commit()

    return {"message": "Despesa excluída com sucesso"}


@app.post("/pricing/simulate")
def simulate_price(data: schemas.PriceSimulation):
    total_percent = (
        data.desired_profit_percent
        + data.marketplace_fee_percent
        + data.freight_percent
        + data.anticipation_percent
        + data.fixed_cost_percent
    )

    if total_percent >= 100:
        return {"error": "A soma dos percentuais não pode ser maior ou igual a 100%."}

    suggested_price = data.cost / (1 - total_percent / 100)
    profit_value = suggested_price * (data.desired_profit_percent / 100)

    return {
        "cost": round(data.cost, 2),
        "suggested_price": round(suggested_price, 2),
        "desired_profit_value": round(profit_value, 2),
        "total_percent_used": round(total_percent, 2),
    }
