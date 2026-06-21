from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import Base, engine, get_db
from . import models, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Catedral ERP MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://catedral-erpp.vercel.app",
        "https://catedral-erpp-5sqw7t39z-catedralerp.vercel.app",
        "https://www.catedralerp.com.br",
        "https://catedralerp.com.br",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Catedral ERP rodando com sucesso"}

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

@app.post("/pricing/simulate")
def simulate_price(data: schemas.PriceSimulation):
    total_percent = (
        data.desired_profit_percent +
        data.marketplace_fee_percent +
        data.freight_percent +
        data.anticipation_percent +
        data.fixed_cost_percent
    )

    if total_percent >= 100:
        return {"error": "A soma dos percentuais não pode ser maior ou igual a 100%."}

    suggested_price = data.cost / (1 - total_percent / 100)
    profit_value = suggested_price * (data.desired_profit_percent / 100)

    return {
        "cost": round(data.cost, 2),
        "suggested_price": round(suggested_price, 2),
        "desired_profit_value": round(profit_value, 2),
        "total_percent_used": total_percent
    }

@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    expenses = db.query(models.Expense).all()

    total_stock_value = sum(p.cost * p.stock for p in products)
    total_expenses = sum(e.value for e in expenses)

    return {
        "total_products": len(products),
        "total_stock_value": round(total_stock_value, 2),
        "monthly_expenses": round(total_expenses, 2),
        "message": "Dashboard inicial do ERP"
    }
