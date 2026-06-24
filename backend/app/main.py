from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models import PricingHistory
from app.schemas import PricingHistoryCreate
import csv
import base64
import hashlib
import hmac
import io
import os
import re
import secrets
import smtplib
import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from email.message import EmailMessage
from zipfile import ZipFile
from xml.etree import ElementTree as ET
from pydantic import BaseModel
from fastapi import UploadFile, File
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from openai import OpenAI
from app.models import Product

from .database import Base, engine, ensure_product_columns, get_db
from . import models, schemas

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
security = HTTPBearer(auto_error=False)

class ChatRequest(BaseModel):
    message: str


class SetupRequest(BaseModel):
    name: str
    email: str
    password: str
    verification_channel: str = "email"
    phone: str = ""


class LoginRequest(BaseModel):
    email: str
    password: str
    verification_channel: str = "email"
    phone: str = ""


class VerifyLoginRequest(BaseModel):
    challenge_id: str
    code: str


class RegisterCodeRequest(BaseModel):
    email: str
    verification_channel: str = "email"
    phone: str = ""


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: str = ""
    verification_code: str = ""
    email_code: str = ""
    sms_code: str = ""
    accepted_terms: bool


class StoreIntegrationCreate(BaseModel):
    marketplace: str
    store_name: str
    country: str = "BR"
    shop_id: str = ""
    status: str = "Pendente"
    auth_date: str = ""
    notes: str = ""


class StoreIntegrationUpdate(StoreIntegrationCreate):
    pass


class SettingUpdate(BaseModel):
    key: str
    value: str
    group: str = "general"


class ProductBulkDelete(BaseModel):
    ids: list[int]


class ProductBulkUpdate(BaseModel):
    ids: list[int]
    cost: float | None = None
    sale_price: float | None = None
    stock: int | None = None
    minimum_stock: int | None = None
    marketplace: str | None = None
    category: str | None = None
    supplier: str | None = None


XLSX_NS = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
PROJECT_ROOT = Path(__file__).resolve().parents[2]
FRONTEND_DIST = PROJECT_ROOT / "frontend" / "dist"


def excel_column_index(cell_ref: str) -> int:
    letters = re.sub(r"[^A-Z]", "", cell_ref.upper())
    index = 0

    for letter in letters:
        index = index * 26 + (ord(letter) - ord("A") + 1)

    return max(index - 1, 0)


def parse_number(value, default=0):
    if value is None or value == "":
        return default

    text = str(value).strip().replace("R$", "").replace(" ", "")

    if "," in text and "." in text:
        text = text.replace(".", "").replace(",", ".")
    elif "," in text:
        text = text.replace(",", ".")

    try:
        return float(text)
    except ValueError:
        return default


def read_xlsx_rows(content: bytes):
    rows = []

    with ZipFile(io.BytesIO(content)) as archive:
        shared_strings = []

        if "xl/sharedStrings.xml" in archive.namelist():
            shared_root = ET.fromstring(archive.read("xl/sharedStrings.xml"))

            for item in shared_root.findall("a:si", XLSX_NS):
                text_parts = [
                    node.text or ""
                    for node in item.findall(".//a:t", XLSX_NS)
                ]
                shared_strings.append("".join(text_parts))

        sheet_root = ET.fromstring(archive.read("xl/worksheets/sheet1.xml"))

        for row in sheet_root.findall(".//a:sheetData/a:row", XLSX_NS):
            values = []

            for cell in row.findall("a:c", XLSX_NS):
                cell_ref = cell.attrib.get("r", "")
                column_index = excel_column_index(cell_ref)

                while len(values) <= column_index:
                    values.append("")

                cell_type = cell.attrib.get("t")
                raw_value = cell.find("a:v", XLSX_NS)
                value = raw_value.text if raw_value is not None else ""

                if cell_type == "s" and value != "":
                    value = shared_strings[int(value)]
                elif cell_type == "inlineStr":
                    value = "".join(
                        node.text or ""
                        for node in cell.findall(".//a:t", XLSX_NS)
                    )

                values[column_index] = value

            rows.append(values)

    if not rows:
        return []

    headers = [str(value).strip() for value in rows[0]]
    parsed_rows = []

    for values in rows[1:]:
        parsed_rows.append(
            {
                headers[index]: values[index] if index < len(values) else ""
                for index in range(len(headers))
                if headers[index]
            }
        )

    return parsed_rows


def read_csv_rows(content: bytes):
    text = content.decode("utf-8-sig")
    sample = text[:2048]

    try:
        dialect = csv.Sniffer().sniff(sample, delimiters=",;")
    except csv.Error:
        dialect = csv.excel

    return list(csv.DictReader(io.StringIO(text), dialect=dialect))


def get_first(row, keys, default=""):
    for key in keys:
        value = row.get(key)

        if value not in (None, ""):
            return value

    return default


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        120_000,
    ).hex()
    return f"{salt}${digest}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, digest = stored_hash.split("$", 1)
    except ValueError:
        return False

    candidate = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        120_000,
    ).hex()
    return hmac.compare_digest(candidate, digest)


def create_auth_session(user_id: int, db: Session):
    token = secrets.token_urlsafe(48)
    session = models.AuthSession(
        token=token,
        user_id=user_id,
        expires_at=datetime.utcnow() + timedelta(days=7),
    )
    db.add(session)
    db.commit()
    return token


def serialize_user(user: models.User):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
    }


def normalize_verification_channel(channel: str):
    normalized = (channel or "email").lower().strip()

    if normalized not in {"email", "phone"}:
        raise HTTPException(status_code=400, detail="Canal de verificacao invalido")

    return normalized


def normalize_email(email: str):
    normalized = (email or "").lower().strip()

    if "@" not in normalized or "." not in normalized:
        raise HTTPException(status_code=400, detail="Informe um email valido")

    return normalized


def normalize_phone(phone: str):
    normalized = re.sub(r"\D", "", phone or "")

    if len(normalized) < 10:
        raise HTTPException(status_code=400, detail="Informe um celular valido")

    return normalized


def phone_to_e164(phone: str):
    normalized = normalize_phone(phone)
    return f"+{normalized}" if normalized.startswith("55") else f"+55{normalized}"


def create_six_digit_code():
    return f"{secrets.randbelow(900000) + 100000}"


def hash_verification_code(code: str):
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        code.encode("utf-8"),
        salt.encode("utf-8"),
        80_000,
    ).hex()
    return f"{salt}${digest}"


def verify_verification_code(code: str, stored_hash: str):
    try:
        salt, digest = stored_hash.split("$", 1)
    except ValueError:
        return False

    candidate = hashlib.pbkdf2_hmac(
        "sha256",
        code.strip().encode("utf-8"),
        salt.encode("utf-8"),
        80_000,
    ).hex()
    return hmac.compare_digest(candidate, digest)


def delete_expired_verification_codes(db: Session):
    db.query(models.VerificationCode).filter(
        models.VerificationCode.expires_at < datetime.utcnow()
    ).delete(synchronize_session=False)
    db.commit()


def expose_dev_code(code: str):
    return code if os.getenv("SHOW_VERIFICATION_CODE", "true").lower() == "true" else None


def send_email_code(email: str, code: str, purpose: str):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM") or smtp_user
    smtp_tls = os.getenv("SMTP_TLS", "true").lower() == "true"
    smtp_ssl = os.getenv("SMTP_SSL", "false").lower() == "true" or smtp_port == 465

    if not smtp_host or not smtp_from:
        return False

    message = EmailMessage()
    message["Subject"] = "Codigo de verificacao Catedral ERP"
    message["From"] = smtp_from
    message["To"] = email
    message.set_content(
        "\n".join(
            [
                "Catedral ERP",
                "",
                f"Seu codigo para {purpose} e {code}.",
                "Ele expira em 10 minutos.",
                "",
                "Se voce nao solicitou este acesso, ignore esta mensagem.",
            ]
        )
    )

    try:
        smtp_client = smtplib.SMTP_SSL if smtp_ssl else smtplib.SMTP
        with smtp_client(smtp_host, smtp_port, timeout=20) as server:
            if smtp_tls and not smtp_ssl:
                server.starttls()

            if smtp_user and smtp_password:
                server.login(smtp_user, smtp_password)

            server.send_message(message)
        return True
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Falha ao enviar email: {exc}")


def send_sms_code(phone: str, code: str, purpose: str):
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_FROM_NUMBER")

    if not account_sid or not auth_token or not from_number:
        return False

    payload = urllib.parse.urlencode(
        {
            "To": phone_to_e164(phone),
            "From": from_number,
            "Body": f"Catedral ERP: seu codigo para {purpose} e {code}. Expira em 10 minutos.",
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json",
        data=payload,
        method="POST",
    )
    credentials = base64.b64encode(f"{account_sid}:{auth_token}".encode("utf-8")).decode("utf-8")
    request.add_header("Authorization", f"Basic {credentials}")
    request.add_header("Content-Type", "application/x-www-form-urlencoded")

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return 200 <= response.status < 300
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Falha ao enviar SMS: {exc}")


def send_code_by_channel(channel: str, target: str, code: str, purpose: str):
    if channel == "phone":
        return send_sms_code(target, code, purpose)

    return send_email_code(target, code, purpose)


def create_verification_challenge(user: models.User, payload, db: Session):
    channel = normalize_verification_channel(payload.verification_channel)
    target = user.email

    if channel == "phone":
        target = normalize_phone(payload.phone)

    delete_expired_verification_codes(db)
    code = create_six_digit_code()
    challenge_id = secrets.token_urlsafe(32)
    sent = send_code_by_channel(channel, target, code, "login",)

    db.add(
        models.VerificationCode(
            purpose="login",
            challenge_id=challenge_id,
            user_id=user.id,
            email=user.email,
            phone=target if channel == "phone" else "",
            channel=channel,
            code_hash=hash_verification_code(code),
            expires_at=datetime.utcnow() + timedelta(minutes=10),
        )
    )
    db.commit()

    # Enquanto nao houver provedor de email/SMS conectado, o codigo fica
    # disponivel no retorno local para permitir testar o fluxo completo.
    return {
        "requires_verification": True,
        "challenge_id": challenge_id,
        "channel": channel,
        "target": target,
        "expires_in_minutes": 10,
        "sent": sent,
        "dev_code": expose_dev_code(code),
    }


def create_registration_code(payload: RegisterCodeRequest, db: Session):
    email = normalize_email(payload.email)
    phone = normalize_phone(payload.phone)

    if db.query(models.User).filter(models.User.email == email).first():
        raise HTTPException(status_code=400, detail="Este email ja possui cadastro")

    delete_expired_verification_codes(db)
    email_code = create_six_digit_code()
    sms_code = create_six_digit_code()
    email_sent = send_email_code(email, email_code, "cadastro")
    sms_sent = send_sms_code(phone, sms_code, "cadastro")
    db.query(models.VerificationCode).filter(
        models.VerificationCode.purpose == "registration",
        models.VerificationCode.email == email,
    ).delete(synchronize_session=False)
    db.add(
        models.VerificationCode(
            purpose="registration",
            challenge_id=secrets.token_urlsafe(32),
            email=email,
            phone=phone,
            channel="email_sms",
            email_code_hash=hash_verification_code(email_code),
            sms_code_hash=hash_verification_code(sms_code),
            expires_at=datetime.utcnow() + timedelta(minutes=10),
        )
    )
    db.commit()

    return {
        "message": "Codigos de verificacao gerados",
        "email": email,
        "phone": phone,
        "email_sent": email_sent,
        "sms_sent": sms_sent,
        "expires_in_minutes": 10,
        "email_dev_code": expose_dev_code(email_code),
        "sms_dev_code": expose_dev_code(sms_code),
    }


def validate_registration_codes(
    email: str,
    phone: str,
    email_code: str,
    sms_code: str,
    fallback_code: str = "",
    db: Session | None = None,
):
    if db is None:
        raise HTTPException(status_code=500, detail="Banco indisponivel para validar codigos")

    registration = (
        db.query(models.VerificationCode)
        .filter(
            models.VerificationCode.purpose == "registration",
            models.VerificationCode.email == email,
        )
        .order_by(models.VerificationCode.created_at.desc())
        .first()
    )

    if not registration:
        raise HTTPException(status_code=400, detail="Solicite os codigos de verificacao")

    if registration.expires_at < datetime.utcnow():
        db.delete(registration)
        db.commit()
        raise HTTPException(status_code=400, detail="Codigos de verificacao expirados")

    if normalize_phone(phone) != registration.phone:
        raise HTTPException(status_code=400, detail="O celular informado precisa ser o mesmo que recebeu o SMS")

    clean_email_code = (email_code or fallback_code or "").strip()
    clean_sms_code = (sms_code or fallback_code or "").strip()

    if not clean_email_code or not clean_sms_code:
        raise HTTPException(status_code=400, detail="Informe os codigos recebidos por email e SMS")

    if not verify_verification_code(clean_email_code, registration.email_code_hash):
        raise HTTPException(status_code=400, detail="Codigo de email invalido")

    if not verify_verification_code(clean_sms_code, registration.sms_code_hash):
        raise HTTPException(status_code=400, detail="Codigo de SMS invalido")


def finish_verified_login(challenge_id: str, code: str, db: Session):
    challenge = (
        db.query(models.VerificationCode)
        .filter(
            models.VerificationCode.purpose == "login",
            models.VerificationCode.challenge_id == challenge_id,
        )
        .first()
    )

    if not challenge:
        raise HTTPException(status_code=400, detail="Codigo de verificacao expirado")

    if challenge.expires_at < datetime.utcnow():
        db.delete(challenge)
        db.commit()
        raise HTTPException(status_code=400, detail="Codigo de verificacao expirado")

    if not verify_verification_code(code, challenge.code_hash):
        raise HTTPException(status_code=400, detail="Codigo de verificacao invalido")

    user = (
        db.query(models.User)
        .filter(models.User.id == challenge.user_id, models.User.is_active == True)
        .first()
    )

    if not user:
        raise HTTPException(status_code=401, detail="Usuario inativo")

    db.delete(challenge)
    token = create_auth_session(user.id, db)

    return {
        "token": token,
        "user": serialize_user(user),
    }


def require_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Login obrigatorio")

    session = (
        db.query(models.AuthSession)
        .filter(models.AuthSession.token == credentials.credentials)
        .first()
    )

    if not session or session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Sessao expirada")

    user = (
        db.query(models.User)
        .filter(models.User.id == session.user_id, models.User.is_active == True)
        .first()
    )

    if not user:
        raise HTTPException(status_code=401, detail="Usuario inativo")

    return user

Base.metadata.create_all(bind=engine)
ensure_product_columns()

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
    index_file = FRONTEND_DIST / "index.html"

    if index_file.exists():
        return FileResponse(index_file)

    return {"message": "Catedral ERP rodando com sucesso"}


@app.get("/health/database")
def database_health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {
        "status": "ok",
        "database": engine.url.get_backend_name(),
        "driver": engine.url.get_driver_name(),
    }


@app.get("/auth/bootstrap-status")
def auth_bootstrap_status(db: Session = Depends(get_db)):
    users_count = db.query(models.User).count()
    return {"needs_setup": users_count == 0}


@app.post("/auth/register-code")
def auth_register_code(payload: RegisterCodeRequest, db: Session = Depends(get_db)):
    return create_registration_code(payload, db)


@app.post("/auth/register")
def auth_register(payload: RegisterRequest, db: Session = Depends(get_db)):
    email = normalize_email(payload.email)

    if not payload.accepted_terms:
        raise HTTPException(status_code=400, detail="Aceite os termos para criar a conta")

    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="A senha precisa ter ao menos 6 caracteres")

    if db.query(models.User).filter(models.User.email == email).first():
        raise HTTPException(status_code=400, detail="Este email ja possui cadastro")

    validate_registration_codes(
        email,
        payload.phone,
        payload.email_code,
        payload.sms_code,
        payload.verification_code,
        db,
    )

    user = models.User(
        name=payload.name.strip() or "Administrador",
        email=email,
        password_hash=hash_password(payload.password),
        role="admin",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.query(models.VerificationCode).filter(
        models.VerificationCode.purpose == "registration",
        models.VerificationCode.email == email,
    ).delete(synchronize_session=False)
    db.commit()

    token = create_auth_session(user.id, db)

    return {
        "token": token,
        "user": serialize_user(user),
    }


@app.post("/auth/setup")
def auth_setup(payload: SetupRequest, db: Session = Depends(get_db)):
    if db.query(models.User).count() > 0:
        raise HTTPException(status_code=400, detail="Setup inicial ja foi feito")

    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="A senha precisa ter ao menos 6 caracteres")

    user = models.User(
        name=payload.name.strip() or "Administrador",
        email=payload.email.lower().strip(),
        password_hash=hash_password(payload.password),
        role="admin",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return create_verification_challenge(user, payload, db)


@app.post("/auth/login")
def auth_login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = (
        db.query(models.User)
        .filter(models.User.email == payload.email.lower().strip())
        .first()
    )

    if not user or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email ou senha invalidos")

    return create_verification_challenge(user, payload, db)


@app.post("/auth/verify-login")
def auth_verify_login(payload: VerifyLoginRequest, db: Session = Depends(get_db)):
    return finish_verified_login(payload.challenge_id, payload.code, db)


@app.get("/auth/me")
def auth_me(user: models.User = Depends(require_user)):
    return serialize_user(user)


@app.post("/auth/logout")
def auth_logout(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
):
    if credentials:
        session = (
            db.query(models.AuthSession)
            .filter(models.AuthSession.token == credentials.credentials)
            .first()
        )

        if session:
            db.delete(session)
            db.commit()

    return {"message": "Logout realizado"}


@app.post("/chat")
def chat(request: ChatRequest, user: models.User = Depends(require_user)):
    if not openai_client:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY não está configurada.")

    try:
        completion = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Você é um assistente inteligente para o ERP Catedral, ajudando com informações sobre estoque, marketplace, precificação e processos de vendas."},
                {"role": "user", "content": request.message},
            ],
            max_tokens=500,
            temperature=0.7,
        )

        answer = (completion.choices[0].message.content or "").strip()
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    products = db.query(models.Product).all()
    expenses = db.query(models.Expense).all()

    total_stock_value = sum(p.cost * p.stock for p in products)
    total_sales_value = sum(p.sale_price * p.stock for p in products)
    estimated_profit = total_sales_value - total_stock_value
    monthly_expenses = sum(e.value for e in expenses)

    low_stock_products = [
        {
            "name": p.name,
            "stock": p.stock,
            "minimum_stock": p.minimum_stock
        }
        for p in products
        if p.stock <= p.minimum_stock
    ]

    shopee_count = len([p for p in products if p.marketplace == "Shopee"])
    ml_count = len([p for p in products if p.marketplace == "Mercado Livre"])
    amazon_count = len([p for p in products if p.marketplace == "Amazon"])
    magalu_count = len([p for p in products if p.marketplace == "Magalu"])
    tiktok_count = len([p for p in products if p.marketplace == "TikTok Shop"])

    return {
        "total_products": len(products),
        "total_stock_value": round(total_stock_value, 2),
        "total_sales_value": round(total_sales_value, 2),
        "estimated_profit": round(estimated_profit, 2),
        "monthly_expenses": round(monthly_expenses, 2),

        "marketplaces": {
            "Shopee": shopee_count,
            "Mercado Livre": ml_count,
            "Amazon": amazon_count,
            "Magalu": magalu_count,
            "TikTok Shop": tiktok_count
        },

        "low_stock_products": low_stock_products
    }


@app.get("/store-integrations")
def list_store_integrations(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    return (
        db.query(models.StoreIntegration)
        .order_by(models.StoreIntegration.marketplace, models.StoreIntegration.store_name)
        .all()
    )


@app.post("/store-integrations")
def create_store_integration(
    payload: StoreIntegrationCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    integration = models.StoreIntegration(**payload.model_dump())
    db.add(integration)
    db.commit()
    db.refresh(integration)
    return integration


@app.put("/store-integrations/{integration_id}")
def update_store_integration(
    integration_id: int,
    payload: StoreIntegrationUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    integration = (
        db.query(models.StoreIntegration)
        .filter(models.StoreIntegration.id == integration_id)
        .first()
    )

    if not integration:
        raise HTTPException(status_code=404, detail="Integracao nao encontrada")

    for key, value in payload.model_dump().items():
        setattr(integration, key, value)

    db.commit()
    db.refresh(integration)
    return integration


@app.delete("/store-integrations/{integration_id}")
def delete_store_integration(
    integration_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    integration = (
        db.query(models.StoreIntegration)
        .filter(models.StoreIntegration.id == integration_id)
        .first()
    )

    if not integration:
        raise HTTPException(status_code=404, detail="Integracao nao encontrada")

    db.delete(integration)
    db.commit()
    return {"message": "Integracao excluida"}


@app.get("/settings")
def list_settings(
    group: str | None = None,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    query = db.query(models.Setting)

    if group:
        query = query.filter(models.Setting.group == group)

    return query.order_by(models.Setting.group, models.Setting.key).all()


@app.post("/settings")
def upsert_setting(
    payload: SettingUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    setting = db.query(models.Setting).filter(models.Setting.key == payload.key).first()

    if setting:
        setting.value = payload.value
        setting.group = payload.group
        setting.updated_at = datetime.utcnow()
    else:
        setting = models.Setting(**payload.model_dump())
        db.add(setting)

    db.commit()
    db.refresh(setting)
    return setting


@app.post("/products")
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@app.get("/products")
def list_products(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    return db.query(models.Product).all()


@app.patch("/products/bulk")
def bulk_update_products(
    payload: ProductBulkUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    if not payload.ids:
        raise HTTPException(status_code=400, detail="Nenhum produto selecionado")

    products = db.query(models.Product).filter(models.Product.id.in_(payload.ids)).all()

    if not products:
        raise HTTPException(status_code=404, detail="Nenhum produto encontrado")

    allowed_fields = [
        "cost",
        "sale_price",
        "stock",
        "minimum_stock",
        "marketplace",
        "category",
        "supplier",
    ]
    update_data = payload.model_dump(exclude={"ids"}, exclude_none=True)

    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum campo informado para atualizar")

    for product in products:
        for field in allowed_fields:
            if field in update_data:
                setattr(product, field, update_data[field])

    db.commit()

    return {
        "message": "Produtos atualizados em massa",
        "updated": len(products)
    }


@app.post("/products/bulk-delete")
def bulk_delete_products(
    payload: ProductBulkDelete,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    if not payload.ids:
        raise HTTPException(status_code=400, detail="Nenhum produto selecionado")

    products = db.query(models.Product).filter(models.Product.id.in_(payload.ids)).all()

    if not products:
        raise HTTPException(status_code=404, detail="Nenhum produto encontrado")

    deleted = len(products)

    for product in products:
        db.delete(product)

    db.commit()

    return {
        "message": "Produtos excluidos em massa",
        "deleted": deleted
    }


@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    for key, value in product.model_dump().items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    return db_product


@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    db.delete(db_product)
    db.commit()

    return {"message": "Produto excluído com sucesso"}


@app.post("/expenses")
def create_expense(
    expense: schemas.ExpenseCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    db_expense = models.Expense(**expense.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@app.get("/expenses")
def list_expenses(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    return db.query(models.Expense).all()


@app.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()

    if not db_expense:
        raise HTTPException(status_code=404, detail="Despesa não encontrada")

    db.delete(db_expense)
    db.commit()

    return {"message": "Despesa excluída com sucesso"}


@app.post("/pricing/simulate")
def simulate_price(
    data: schemas.PriceSimulation,
    user: models.User = Depends(require_user),
):
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
@app.post("/revenues")
def create_revenue(
    revenue: schemas.RevenueCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    db_revenue = models.Revenue(**revenue.model_dump())
    db.add(db_revenue)
    db.commit()
    db.refresh(db_revenue)
    return db_revenue


@app.get("/revenues")
def list_revenues(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    return db.query(models.Revenue).all()


@app.delete("/revenues/{revenue_id}")
def delete_revenue(
    revenue_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    db_revenue = db.query(models.Revenue).filter(models.Revenue.id == revenue_id).first()

    if not db_revenue:
        raise HTTPException(status_code=404, detail="Receita não encontrada")

    db.delete(db_revenue)
    db.commit()

    return {"message": "Receita excluída com sucesso"}

@app.post("/pricing-history")
def create_pricing_history(
    history: PricingHistoryCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    new_history = PricingHistory(
        product_id=history.product_id,
        sku=history.sku,
        product_name=history.product_name,
        marketplace=history.marketplace,
        suggested_price=history.suggested_price,
        profit=history.profit,
        margin=history.margin
    )

    db.add(new_history)
    db.commit()
    db.refresh(new_history)

    return new_history


@app.get("/pricing-history")
def get_pricing_history(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    return (
        db.query(PricingHistory)
        .order_by(PricingHistory.id.desc())
        .limit(100)
        .all()
    )
@app.post("/import-shopee-products")
async def import_shopee_products(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    content = await file.read()
    filename = (file.filename or "").lower()

    if filename.endswith(".xlsx"):
        rows = read_xlsx_rows(content)
    elif filename.endswith(".csv"):
        rows = read_csv_rows(content)
    else:
        raise HTTPException(
            status_code=400,
            detail="Envie uma planilha .xlsx ou .csv de Informações de Vendas da Shopee."
        )

    imported = 0
    skipped = 0

    for row in rows:
        product_id = str(get_first(row, ["et_title_product_id", "ID do Produto"])).strip()
        sku = str(get_first(row, [
            "et_title_variation_sku",
            "et_title_parent_sku",
            "et_title_reference_sku",
            "SKU",
            "SKU de referência",
            "SKU de referencia",
            "ps_gtin_code",
            "GTIN (EAN)",
            "et_title_product_id",
        ])).strip()
        name = str(get_first(row, [
            "et_title_product_name",
            "Nome do Produto",
            "Nome do produto",
        ])).strip()
        variation_name = str(get_first(row, [
            "et_title_variation_name",
            "Nome",
        ])).strip()
        price = parse_number(get_first(row, [
            "et_title_variation_price",
            "Preço",
            "Preco",
        ]))
        stock = int(parse_number(get_first(row, [
            "et_title_variation_stock",
            "Estoque",
        ])))
        barcode = str(get_first(row, [
            "ps_gtin_code",
            "GTIN (EAN)",
        ])).strip()

        if variation_name and variation_name.lower() not in {"nome", name.lower()}:
            name = f"{name} - {variation_name}" if name else variation_name

        if not name or not product_id.isdigit():
            skipped += 1
            continue

        if not sku:
            sku = product_id

        existing = db.query(Product).filter(Product.sku == sku).first()

        if existing:
            existing.name = name
            existing.sale_price = price
            existing.stock = stock
            existing.marketplace = "Shopee"
            existing.barcode = barcode
        else:
            product = Product(
                sku=sku,
                name=name,
                sale_price=price,
                stock=stock,
                barcode=barcode,
                marketplace="Shopee",
                minimum_stock=10
            )

            db.add(product)

        imported += 1

    db.commit()

    return {
        "message": "Produtos importados com sucesso",
        "imported": imported,
        "skipped": skipped
    }


if (FRONTEND_DIST / "assets").exists():
    app.mount(
        "/assets",
        StaticFiles(directory=FRONTEND_DIST / "assets"),
        name="frontend-assets",
    )


@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    index_file = FRONTEND_DIST / "index.html"

    if index_file.exists():
        return FileResponse(index_file)

    raise HTTPException(status_code=404, detail="Frontend nao publicado")
