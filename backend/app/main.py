from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
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
import json
import os
import re
import secrets
import smtplib
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from email.message import EmailMessage
from zipfile import ZipFile
from xml.etree import ElementTree as ET
from pydantic import BaseModel, Field
from fastapi import UploadFile, File
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from openai import OpenAI
from app.models import Product

from .database import (
    Base,
    engine,
    ensure_product_columns,
    ensure_fiscal_invoice_columns,
    ensure_revenue_columns,
    ensure_user_columns,
    ensure_verification_code_columns,
    get_db,
)
from . import models, schemas

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
security = HTTPBearer(auto_error=False)

# Modo de desenvolvimento: quando ativo e sem SMTP/SMS configurados,
# os codigos de verificacao sao retornados na resposta em vez de enviados.
AUTH_DEV_MODE = os.getenv("AUTH_DEV_MODE", "false").lower() == "true"

# Numero maximo de tentativas erradas antes de invalidar o desafio.
MAX_VERIFICATION_ATTEMPTS = 5


def get_allowed_origins():
    raw = os.getenv("ALLOWED_ORIGINS", "").strip()

    if not raw or raw == "*":
        return ["*"]

    return [origin.strip() for origin in raw.split(",") if origin.strip()]


def parse_bool_env(name: str, default: str = "false"):
    return os.getenv(name, default).lower().strip() == "true"


def get_smtp_settings():
    raw_port = os.getenv("SMTP_PORT", "587").strip()
    raw_timeout = os.getenv("SMTP_TIMEOUT", "8").strip()
    port_valid = True
    timeout_valid = True

    try:
        smtp_port = int(raw_port)
    except ValueError:
        smtp_port = 587
        port_valid = False

    try:
        smtp_timeout = int(raw_timeout)
    except ValueError:
        smtp_timeout = 8
        timeout_valid = False

    smtp_host = os.getenv("SMTP_HOST", "").strip()
    smtp_user = os.getenv("SMTP_USER", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    smtp_from = (os.getenv("SMTP_FROM") or smtp_user).strip()
    smtp_tls = parse_bool_env("SMTP_TLS", "true")
    smtp_ssl = parse_bool_env("SMTP_SSL", "false") or smtp_port == 465

    missing = []
    if not smtp_host:
        missing.append("SMTP_HOST")
    if not smtp_from:
        missing.append("SMTP_FROM")
    if not port_valid:
        missing.append("SMTP_PORT")
    if not timeout_valid:
        missing.append("SMTP_TIMEOUT")
    if smtp_user and not smtp_password:
        missing.append("SMTP_PASSWORD")
    if smtp_password and not smtp_user:
        missing.append("SMTP_USER")

    return {
        "configured": not missing,
        "missing": missing,
        "smtp_host": smtp_host,
        "smtp_port": smtp_port,
        "smtp_user": smtp_user,
        "smtp_password": smtp_password,
        "smtp_from": smtp_from,
        "smtp_tls": smtp_tls,
        "smtp_ssl": smtp_ssl,
        "smtp_timeout": smtp_timeout,
        "port_valid": port_valid,
        "timeout_valid": timeout_valid,
    }


def get_smtp_attempts(smtp_settings: dict):
    attempts = [smtp_settings]
    host = smtp_settings["smtp_host"].lower()
    already_using_gmail_ssl = (
        host == "smtp.gmail.com"
        and smtp_settings["smtp_port"] == 465
        and smtp_settings["smtp_ssl"]
    )

    if host == "smtp.gmail.com" and not already_using_gmail_ssl:
        fallback = smtp_settings.copy()
        fallback["smtp_port"] = 465
        fallback["smtp_ssl"] = True
        fallback["smtp_tls"] = False
        attempts.append(fallback)

    return attempts


def get_email_provider():
    provider = os.getenv("EMAIL_PROVIDER", "auto").lower().strip()

    if provider in {"auto", "smtp", "resend"}:
        return provider

    return "auto"


def get_resend_settings():
    api_key = os.getenv("RESEND_API_KEY", "").strip()
    from_address = (
        os.getenv("RESEND_FROM")
        or os.getenv("EMAIL_FROM")
        or os.getenv("SMTP_FROM")
        or ""
    ).strip()

    missing = []
    if not api_key:
        missing.append("RESEND_API_KEY")
    if not from_address:
        missing.append("RESEND_FROM")

    return {
        "configured": not missing,
        "missing": missing,
        "api_key": api_key,
        "from_address": from_address,
        "api_url": os.getenv("RESEND_API_URL", "https://api.resend.com/emails").strip(),
    }


def get_sms_settings():
    provider = os.getenv("SMS_PROVIDER", "zenvia").lower().strip()
    missing = []

    if provider == "zenvia":
        if not os.getenv("ZENVIA_API_TOKEN", "").strip():
            missing.append("ZENVIA_API_TOKEN")
        if not os.getenv("ZENVIA_FROM", "").strip():
            missing.append("ZENVIA_FROM")
    elif provider == "twilio":
        if not os.getenv("TWILIO_ACCOUNT_SID", "").strip():
            missing.append("TWILIO_ACCOUNT_SID")
        if not os.getenv("TWILIO_AUTH_TOKEN", "").strip():
            missing.append("TWILIO_AUTH_TOKEN")
        if not os.getenv("TWILIO_FROM_NUMBER", "").strip():
            missing.append("TWILIO_FROM_NUMBER")
    else:
        missing.append("SMS_PROVIDER")

    return {
        "configured": not missing,
        "provider": provider,
        "provider_valid": provider in {"zenvia", "twilio"},
        "missing": missing,
    }


class ChatRequest(BaseModel):
    message: str


class SetupRequest(BaseModel):
    name: str
    email: str
    password: str
    verification_channel: str = "email"
    phone: str = ""
    remember: bool = True


class LoginRequest(BaseModel):
    email: str
    password: str
    verification_channel: str = "email"
    phone: str = ""
    remember: bool = True


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
    remember: bool = True


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


class SettingsBulkUpdate(BaseModel):
    settings: list[SettingUpdate]


class ShopeeConfigUpdate(BaseModel):
    partner_id: str = ""
    partner_key: str = ""
    shop_id: str = ""
    shop_name: str = ""
    environment: str = "production"
    redirect_url: str = ""
    frontend_return_url: str = ""
    auth_url: str = ""
    token_url: str = ""
    refresh_url: str = ""
    shop_info_url: str = ""
    api_base: str = ""


class FiscalConfigUpdate(BaseModel):
    provider: str = "focus_nfe"
    environment: str = "homologacao"
    base_url: str = ""
    focus_token: str = ""
    company_name: str = ""
    company_document: str = ""
    state_registration: str = ""
    municipal_registration: str = ""
    tax_regime: str = ""
    series_nfe: str = "1"
    series_nfce: str = "1"
    automatic_issue: bool = False
    focus_issuer_registered: bool = False
    focus_nfe_enabled: bool = False
    focus_certificate_uploaded: bool = False
    focus_homologation_token_ready: bool = False
    focus_production_token_ready: bool = False
    focus_nfce_csc_configured: bool = False


class FiscalIssueRequest(BaseModel):
    ref: str = ""
    document_type: str = "nfe"
    payload: dict = Field(default_factory=dict)


class FiscalCancelRequest(BaseModel):
    justificativa: str


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


class CopyListingRequest(BaseModel):
    url: str = ""
    source_id: str = ""
    source_platform: str = "mercado_livre"


class PublishListingRequest(BaseModel):
    url: str = ""
    source_id: str = ""
    source_platform: str = "mercado_livre"
    target_platform: str = "mercado_livre"
    title: str = ""
    price: float | None = None
    available_quantity: int | None = None


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


def create_auth_session(user_id: int, db: Session, session_days: int = 7):
    token = secrets.token_urlsafe(48)
    session = models.AuthSession(
        token=token,
        user_id=user_id,
        expires_at=datetime.utcnow() + timedelta(days=max(session_days, 1)),
    )
    db.add(session)
    db.commit()
    return token


def serialize_user(user: models.User):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone or "",
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


FISCAL_SETTING_KEYS = {
    "provider",
    "environment",
    "base_url",
    "company_name",
    "company_document",
    "state_registration",
    "municipal_registration",
    "tax_regime",
    "series_nfe",
    "series_nfce",
    "automatic_issue",
    "focus_issuer_registered",
    "focus_nfe_enabled",
    "focus_certificate_uploaded",
    "focus_homologation_token_ready",
    "focus_production_token_ready",
    "focus_nfce_csc_configured",
}


def get_setting_value(db: Session, key: str, default: str = "", group: str = "fiscal"):
    setting = (
        db.query(models.Setting)
        .filter(models.Setting.group == group, models.Setting.key == key)
        .first()
    )
    return setting.value if setting else default


def upsert_setting_value(db: Session, key: str, value: str, group: str = "fiscal"):
    setting = db.query(models.Setting).filter(models.Setting.key == key).first()

    if setting:
        setting.value = value
        setting.group = group
        setting.updated_at = datetime.utcnow()
    else:
        setting = models.Setting(key=key, value=value, group=group)
        db.add(setting)

    return setting


def get_focus_token(db: Session):
    return (os.getenv("FOCUS_NFE_TOKEN") or get_setting_value(db, "focus_nfe_token", group="fiscal_secret")).strip()


def get_fiscal_config(db: Session):
    environment = get_setting_value(db, "environment", os.getenv("FISCAL_ENVIRONMENT", "homologacao"))
    default_base_url = (
        "https://api.focusnfe.com.br"
        if environment == "producao"
        else "https://homologacao.focusnfe.com.br"
    )
    base_url = get_setting_value(db, "base_url") or os.getenv("FOCUS_NFE_BASE_URL") or default_base_url

    return {
        "provider": get_setting_value(db, "provider", os.getenv("FISCAL_PROVIDER", "focus_nfe")),
        "environment": environment,
        "base_url": base_url.rstrip("/"),
        "company_name": get_setting_value(db, "company_name"),
        "company_document": get_setting_value(db, "company_document"),
        "state_registration": get_setting_value(db, "state_registration"),
        "municipal_registration": get_setting_value(db, "municipal_registration"),
        "tax_regime": get_setting_value(db, "tax_regime"),
        "series_nfe": get_setting_value(db, "series_nfe", "1"),
        "series_nfce": get_setting_value(db, "series_nfce", "1"),
        "automatic_issue": get_setting_value(db, "automatic_issue", "false") == "true",
        "focus_issuer_registered": get_setting_value(db, "focus_issuer_registered", "false") == "true",
        "focus_nfe_enabled": get_setting_value(db, "focus_nfe_enabled", "false") == "true",
        "focus_certificate_uploaded": get_setting_value(db, "focus_certificate_uploaded", "false") == "true",
        "focus_homologation_token_ready": get_setting_value(db, "focus_homologation_token_ready", "false") == "true",
        "focus_production_token_ready": get_setting_value(db, "focus_production_token_ready", "false") == "true",
        "focus_nfce_csc_configured": get_setting_value(db, "focus_nfce_csc_configured", "false") == "true",
        "focus_token_configured": bool(get_focus_token(db)),
    }


def generate_fiscal_ref(document_type: str):
    clean_type = re.sub(r"[^a-z0-9-]", "", (document_type or "nfe").lower()) or "nfe"
    return f"{clean_type}-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{secrets.token_hex(3)}"


def fiscal_json_dumps(payload):
    return json.dumps(payload or {}, ensure_ascii=False, separators=(",", ":"))


def normalize_focus_asset_url(value: str, base_url: str):
    if not value:
        return ""

    if value.startswith("http://") or value.startswith("https://"):
        return value

    return f"{base_url.rstrip('/')}/{value.lstrip('/')}"


def extract_focus_invoice_data(response_payload: dict, base_url: str = ""):
    pdf_url = str(
        response_payload.get("caminho_danfe")
        or response_payload.get("url_danfe")
        or response_payload.get("danfe")
        or ""
    )
    xml_url = str(
        response_payload.get("caminho_xml_nota_fiscal")
        or response_payload.get("url_xml")
        or response_payload.get("xml")
        or ""
    )

    return {
        "status": str(response_payload.get("status") or response_payload.get("situacao") or "processando"),
        "status_sefaz": str(response_payload.get("status_sefaz") or ""),
        "mensagem_sefaz": str(
            response_payload.get("mensagem_sefaz")
            or response_payload.get("mensagem")
            or response_payload.get("message")
            or ""
        ),
        "chave": str(response_payload.get("chave_nfe") or response_payload.get("chave") or ""),
        "numero": str(response_payload.get("numero") or ""),
        "serie": str(response_payload.get("serie") or ""),
        "pdf_url": normalize_focus_asset_url(pdf_url, base_url),
        "xml_url": normalize_focus_asset_url(xml_url, base_url),
    }


def apply_focus_invoice_response(invoice: models.FiscalInvoice, response_payload: dict, db: Session):
    extracted = extract_focus_invoice_data(response_payload, get_fiscal_config(db)["base_url"])

    for key, value in extracted.items():
        setattr(invoice, key, value)

    invoice.response_payload = fiscal_json_dumps(response_payload)
    invoice.updated_at = datetime.utcnow()


def build_focus_auth_header(db: Session):
    token = get_focus_token(db)

    if not token:
        raise HTTPException(
            status_code=503,
            detail="Focus NFe nao configurado. Informe o token na tela fiscal ou configure FOCUS_NFE_TOKEN no backend/.env.",
        )

    credentials = base64.b64encode(f"{token}:".encode("utf-8")).decode("utf-8")
    return f"Basic {credentials}"


def focus_document_path(document_type: str):
    normalized = (document_type or "nfe").lower().strip()

    if normalized not in {"nfe", "nfce"}:
        raise HTTPException(status_code=400, detail="Tipo fiscal invalido. Use nfe ou nfce.")

    return normalized


def focus_nfe_request(method: str, path: str, body: dict | None, db: Session):
    config = get_fiscal_config(db)

    if config["provider"] != "focus_nfe":
        raise HTTPException(status_code=400, detail="Provedor fiscal configurado nao suportado")

    payload = fiscal_json_dumps(body).encode("utf-8") if body is not None else None
    request = urllib.request.Request(
        f"{config['base_url']}{path}",
        data=payload,
        method=method,
    )
    request.add_header("Authorization", build_focus_auth_header(db))
    request.add_header("Accept", "application/json")

    if body is not None:
        request.add_header("Content-Type", "application/json")

    try:
        with urllib.request.urlopen(request, timeout=40) as response:
            raw = response.read().decode("utf-8", errors="ignore")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore") or str(exc)
        try:
            parsed_detail = json.loads(detail)
            detail = (
                parsed_detail.get("mensagem")
                or parsed_detail.get("message")
                or parsed_detail.get("erro")
                or parsed_detail.get("error")
                or parsed_detail.get("errors")
                or detail
            )
        except Exception:
            pass
        raise HTTPException(status_code=exc.code, detail=f"Falha fiscal Focus NFe: {detail}")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Falha fiscal Focus NFe: {exc}")


def serialize_fiscal_invoice(invoice: models.FiscalInvoice):
    return {
        "id": invoice.id,
        "ref": invoice.ref,
        "document_type": invoice.document_type,
        "provider": invoice.provider,
        "status": invoice.status,
        "status_sefaz": invoice.status_sefaz,
        "mensagem_sefaz": invoice.mensagem_sefaz,
        "chave": invoice.chave,
        "numero": invoice.numero,
        "serie": invoice.serie,
        "valor_total": invoice.valor_total,
        "customer_name": invoice.customer_name,
        "customer_document": invoice.customer_document,
        "pdf_url": invoice.pdf_url,
        "xml_url": invoice.xml_url,
        "created_at": invoice.created_at.isoformat() if invoice.created_at else None,
        "updated_at": invoice.updated_at.isoformat() if invoice.updated_at else None,
    }


# ---------------------------------------------------------------------------
# Integracao Mercado Livre (OAuth 2.0)
# ---------------------------------------------------------------------------
ML_PROVIDER = "mercado_livre"
ML_OAUTH_STATE_GROUP = "ml_oauth"


def get_ml_settings():
    return {
        "app_id": os.getenv("ML_APP_ID", "").strip(),
        "secret_key": os.getenv("ML_SECRET_KEY", "").strip(),
        "redirect_uri": os.getenv("ML_REDIRECT_URI", "").strip(),
        "auth_url": os.getenv(
            "ML_AUTH_URL", "https://auth.mercadolivre.com.br/authorization"
        ).strip(),
        "api_base": os.getenv("ML_API_BASE", "https://api.mercadolibre.com").strip().rstrip("/"),
        "frontend_return_url": os.getenv("ML_FRONTEND_RETURN_URL", "/").strip() or "/",
    }


def require_ml_settings():
    settings = get_ml_settings()

    missing = [
        name
        for name, key in (("ML_APP_ID", "app_id"), ("ML_SECRET_KEY", "secret_key"), ("ML_REDIRECT_URI", "redirect_uri"))
        if not settings[key]
    ]

    if missing:
        raise HTTPException(
            status_code=503,
            detail=(
                "Mercado Livre nao configurado. Defina "
                + ", ".join(missing)
                + " no backend/.env."
            ),
        )

    return settings


def http_json_request(
    method: str,
    url: str,
    *,
    data: bytes | None = None,
    headers: dict | None = None,
    error_prefix: str = "Falha na API",
):
    request = urllib.request.Request(url, data=data, method=method)
    request.add_header("Accept", "application/json")

    for header_name, header_value in (headers or {}).items():
        request.add_header(header_name, header_value)

    try:
        with urllib.request.urlopen(request, timeout=40) as response:
            raw = response.read().decode("utf-8", errors="ignore")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore") or str(exc)
        raise HTTPException(status_code=exc.code, detail=f"{error_prefix}: {detail}")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"{error_prefix}: {exc}")


def ml_http_request(method: str, url: str, *, data: bytes | None = None, headers: dict | None = None):
    return http_json_request(method, url, data=data, headers=headers, error_prefix="Falha Mercado Livre")


def ml_token_request(payload: dict):
    settings = require_ml_settings()
    body = urllib.parse.urlencode(payload).encode("utf-8")
    return ml_http_request(
        "POST",
        f"{settings['api_base']}/oauth/token",
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )


def create_ml_oauth_state(user_id: int, db: Session):
    state = secrets.token_urlsafe(32)
    expires_at = (datetime.utcnow() + timedelta(minutes=15)).isoformat()
    upsert_setting_value(
        db,
        f"state:{state}",
        json.dumps({"user_id": user_id, "expires_at": expires_at}),
        group=ML_OAUTH_STATE_GROUP,
    )
    db.commit()
    return state


def consume_ml_oauth_state(state: str, db: Session):
    if not state:
        raise HTTPException(status_code=400, detail="Parametro state ausente no retorno do Mercado Livre")

    setting = (
        db.query(models.Setting)
        .filter(models.Setting.group == ML_OAUTH_STATE_GROUP, models.Setting.key == f"state:{state}")
        .first()
    )

    if not setting:
        raise HTTPException(status_code=400, detail="Autorizacao invalida ou expirada. Tente conectar novamente.")

    try:
        data = json.loads(setting.value or "{}")
        expires_at = datetime.fromisoformat(data.get("expires_at"))
    except (ValueError, TypeError):
        expires_at = datetime.utcnow() - timedelta(seconds=1)
        data = {}

    db.delete(setting)
    db.commit()

    if expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Autorizacao expirada. Tente conectar novamente.")

    return data


def get_ml_credential(db: Session):
    return (
        db.query(models.MarketplaceCredential)
        .filter(models.MarketplaceCredential.provider == ML_PROVIDER)
        .first()
    )


def save_ml_credential(token_payload: dict, db: Session):
    expires_in = int(token_payload.get("expires_in") or 0)
    credential = get_ml_credential(db)

    if not credential:
        credential = models.MarketplaceCredential(provider=ML_PROVIDER)
        db.add(credential)

    credential.external_user_id = str(token_payload.get("user_id") or credential.external_user_id or "")
    credential.access_token = str(token_payload.get("access_token") or "")
    credential.refresh_token = str(token_payload.get("refresh_token") or credential.refresh_token or "")
    credential.token_type = str(token_payload.get("token_type") or "bearer")
    credential.scope = str(token_payload.get("scope") or "")
    credential.expires_at = datetime.utcnow() + timedelta(seconds=expires_in) if expires_in else None
    credential.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(credential)
    return credential


def refresh_ml_token(credential: models.MarketplaceCredential, db: Session):
    settings = require_ml_settings()

    if not credential.refresh_token:
        raise HTTPException(status_code=401, detail="Mercado Livre desconectado. Conecte a conta novamente.")

    token_payload = ml_token_request(
        {
            "grant_type": "refresh_token",
            "client_id": settings["app_id"],
            "client_secret": settings["secret_key"],
            "refresh_token": credential.refresh_token,
        }
    )
    return save_ml_credential(token_payload, db)


def get_valid_ml_access_token(db: Session):
    credential = get_ml_credential(db)

    if not credential or not credential.access_token:
        raise HTTPException(status_code=401, detail="Mercado Livre nao conectado. Conecte a conta primeiro.")

    if credential.expires_at and credential.expires_at <= datetime.utcnow() + timedelta(minutes=5):
        credential = refresh_ml_token(credential, db)

    return credential.access_token, credential


def ml_authenticated_get(path: str, db: Session):
    settings = get_ml_settings()
    access_token, _ = get_valid_ml_access_token(db)
    return ml_http_request(
        "GET",
        f"{settings['api_base']}{path}",
        headers={"Authorization": f"Bearer {access_token}"},
    )


def serialize_ml_status(db: Session):
    settings = get_ml_settings()
    credential = get_ml_credential(db)
    configured = bool(settings["app_id"] and settings["secret_key"] and settings["redirect_uri"])

    return {
        "configured": configured,
        "connected": bool(credential and credential.access_token),
        "app_id_present": bool(settings["app_id"]),
        "redirect_uri": settings["redirect_uri"],
        "nickname": credential.nickname if credential else "",
        "external_user_id": credential.external_user_id if credential else "",
        "scope": credential.scope if credential else "",
        "expires_at": credential.expires_at.isoformat() if credential and credential.expires_at else None,
        "updated_at": credential.updated_at.isoformat() if credential and credential.updated_at else None,
    }


SHOPEE_PROVIDER = "shopee"
SHOPEE_OAUTH_STATE_GROUP = "shopee_oauth"
SHOPEE_CONFIG_SETTING_KEY = "shopee_config"


def get_shopee_defaults():
    return {
        "partner_id": os.getenv("SHOPEE_PARTNER_ID", "").strip(),
        "partner_key": os.getenv("SHOPEE_PARTNER_KEY", "").strip(),
        "shop_id": os.getenv("SHOPEE_SHOP_ID", "").strip(),
        "shop_name": "",
        "environment": os.getenv("SHOPEE_ENVIRONMENT", "production").strip().lower(),
        "redirect_url": os.getenv("SHOPEE_REDIRECT_URI", "http://127.0.0.1:8000/shopee/callback").strip(),
        "frontend_return_url": os.getenv("SHOPEE_FRONTEND_RETURN_URL", "/").strip() or "/",
        "auth_url": os.getenv(
            "SHOPEE_AUTH_URL",
            "https://partner.shopeemobile.com/api/v2/shop/auth_partner",
        ).strip(),
        "token_url": os.getenv(
            "SHOPEE_TOKEN_URL",
            "https://partner.shopeemobile.com/api/v2/auth/token/get",
        ).strip(),
        "refresh_url": os.getenv(
            "SHOPEE_REFRESH_URL",
            "https://partner.shopeemobile.com/api/v2/auth/access_token/get",
        ).strip(),
        "shop_info_url": os.getenv(
            "SHOPEE_SHOP_INFO_URL",
            "https://partner.shopeemobile.com/api/v2/shop/get_shop_info",
        ).strip(),
        "api_base": os.getenv("SHOPEE_API_BASE", "https://partner.shopeemobile.com").strip().rstrip("/"),
    }


def normalize_shopee_environment(value: str):
    normalized = (value or "production").lower().strip()

    if normalized in {"sandbox", "homologacao", "homologation", "test"}:
        return "sandbox"

    return "production"


def get_shopee_config(db: Session):
    defaults = get_shopee_defaults()
    config = defaults.copy()
    stored = get_setting_value(db, SHOPEE_CONFIG_SETTING_KEY, "", group="shopee").strip()

    if stored:
        try:
            config.update(json.loads(stored))
        except (TypeError, ValueError):
            pass

    env_overrides = {
        "partner_id": "SHOPEE_PARTNER_ID",
        "partner_key": "SHOPEE_PARTNER_KEY",
        "shop_id": "SHOPEE_SHOP_ID",
        "environment": "SHOPEE_ENVIRONMENT",
        "redirect_url": "SHOPEE_REDIRECT_URI",
        "frontend_return_url": "SHOPEE_FRONTEND_RETURN_URL",
        "auth_url": "SHOPEE_AUTH_URL",
        "token_url": "SHOPEE_TOKEN_URL",
        "refresh_url": "SHOPEE_REFRESH_URL",
        "shop_info_url": "SHOPEE_SHOP_INFO_URL",
        "api_base": "SHOPEE_API_BASE",
    }

    for key, env_name in env_overrides.items():
        env_value = os.getenv(env_name, "").strip()

        if env_value:
            config[key] = env_value

    config["partner_id"] = str(config.get("partner_id") or "").strip()
    config["partner_key"] = str(config.get("partner_key") or "").strip()
    config["shop_id"] = str(config.get("shop_id") or "").strip()
    config["shop_name"] = str(config.get("shop_name") or "").strip()
    config["environment"] = normalize_shopee_environment(config.get("environment"))
    config["redirect_url"] = str(config.get("redirect_url") or "").strip() or defaults["redirect_url"]
    config["frontend_return_url"] = str(config.get("frontend_return_url") or "").strip() or "/"
    config["auth_url"] = str(config.get("auth_url") or "").strip() or defaults["auth_url"]
    config["token_url"] = str(config.get("token_url") or "").strip() or defaults["token_url"]
    config["refresh_url"] = str(config.get("refresh_url") or "").strip() or defaults["refresh_url"]
    config["shop_info_url"] = str(config.get("shop_info_url") or "").strip() or defaults["shop_info_url"]
    config["api_base"] = str(config.get("api_base") or "").strip().rstrip("/") or defaults["api_base"]

    return config


def update_shopee_config(db: Session, payload: ShopeeConfigUpdate):
    current = get_shopee_config(db)
    updates = payload.model_dump()

    for key, value in updates.items():
        if isinstance(value, str):
            cleaned = value.strip()

            if cleaned:
                current[key] = cleaned
        elif value is not None:
            current[key] = value

    current["environment"] = normalize_shopee_environment(current.get("environment"))
    upsert_setting_value(
        db,
        SHOPEE_CONFIG_SETTING_KEY,
        json.dumps(current, ensure_ascii=False),
        group="shopee",
    )
    db.commit()
    return current


def require_shopee_config(db: Session):
    config = get_shopee_config(db)
    missing = [
        name
        for name, key in (
            ("SHOPEE_PARTNER_ID", "partner_id"),
            ("SHOPEE_PARTNER_KEY", "partner_key"),
            ("SHOPEE_REDIRECT_URI", "redirect_url"),
        )
        if not config[key]
    ]

    if missing:
        raise HTTPException(
            status_code=503,
            detail=(
                "Shopee nao configurada. Defina "
                + ", ".join(missing)
                + " na tela de integracao ou em backend/.env."
            ),
        )

    return config


def build_shopee_signature(partner_id: str, partner_key: str, path: str, timestamp: str, access_token: str = "", shop_id: str = ""):
    message = f"{partner_id}{path}{timestamp}{access_token}{shop_id}"
    return hmac.new(
        partner_key.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def resolve_shopee_url(url_or_path: str, config: dict):
    if url_or_path.startswith("http://") or url_or_path.startswith("https://"):
        return url_or_path

    return f"{config['api_base'].rstrip('/')}/{url_or_path.lstrip('/')}"


def append_url_params(url: str, params: dict):
    parsed = urllib.parse.urlparse(url)
    query = dict(urllib.parse.parse_qsl(parsed.query, keep_blank_values=True))

    for key, value in params.items():
        if value not in (None, ""):
            query[key] = value

    return urllib.parse.urlunparse(parsed._replace(query=urllib.parse.urlencode(query, doseq=True)))


def shopee_numeric_value(value: str):
    text = str(value or "").strip()
    return int(text) if text.isdigit() else text


def shopee_request(
    method: str,
    url_or_path: str,
    db: Session,
    *,
    params: dict | None = None,
    body: dict | None = None,
    access_token: str = "",
    shop_id: str = "",
):
    config = require_shopee_config(db)
    url = resolve_shopee_url(url_or_path, config)
    parsed = urllib.parse.urlparse(url)
    path = parsed.path or "/"
    timestamp = str(int(datetime.utcnow().timestamp()))
    sign = build_shopee_signature(
        config["partner_id"],
        config["partner_key"],
        path,
        timestamp,
        access_token=access_token,
        shop_id=shop_id,
    )
    query = {
        "partner_id": config["partner_id"],
        "timestamp": timestamp,
        "sign": sign,
    }

    if access_token:
        query["access_token"] = access_token

    if shop_id:
        query["shop_id"] = shop_id

    for key, value in (params or {}).items():
        if value not in (None, ""):
            query[key] = value

    final_url = urllib.parse.urlunparse(
        parsed._replace(query=urllib.parse.urlencode(query, doseq=True))
    )
    payload = None
    headers = None

    if body is not None:
        payload = json.dumps(body, ensure_ascii=False).encode("utf-8")
        headers = {"Content-Type": "application/json"}

    data = http_json_request(
        method,
        final_url,
        data=payload,
        headers=headers,
        error_prefix="Falha Shopee",
    )

    if isinstance(data, dict):
        error = str(data.get("error") or "").strip()

        if error:
            message = data.get("message") or data.get("msg") or error
            request_id = data.get("request_id")
            detail = f"Falha Shopee: {message}"

            if request_id:
                detail = f"{detail} (request_id: {request_id})"

            raise HTTPException(status_code=502, detail=detail)

        if "response" in data:
            return data["response"]

    return data


def get_shopee_credential(db: Session):
    return (
        db.query(models.MarketplaceCredential)
        .filter(models.MarketplaceCredential.provider == SHOPEE_PROVIDER)
        .first()
    )


def create_shopee_oauth_state(user_id: int, db: Session):
    state = secrets.token_urlsafe(32)
    expires_at = (datetime.utcnow() + timedelta(minutes=15)).isoformat()
    upsert_setting_value(
        db,
        f"state:{state}",
        json.dumps({"user_id": user_id, "expires_at": expires_at}),
        group=SHOPEE_OAUTH_STATE_GROUP,
    )
    db.commit()
    return state


def consume_shopee_oauth_state(state: str, db: Session):
    if not state:
        raise HTTPException(status_code=400, detail="Parametro state ausente no retorno da Shopee")

    setting = (
        db.query(models.Setting)
        .filter(
            models.Setting.group == SHOPEE_OAUTH_STATE_GROUP,
            models.Setting.key == f"state:{state}",
        )
        .first()
    )

    if not setting:
        raise HTTPException(status_code=400, detail="Autorizacao da Shopee invalida ou expirada.")

    try:
        data = json.loads(setting.value or "{}")
        expires_at = datetime.fromisoformat(data.get("expires_at"))
    except (ValueError, TypeError):
        expires_at = datetime.utcnow() - timedelta(seconds=1)
        data = {}

    db.delete(setting)
    db.commit()

    if expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Autorizacao da Shopee expirada. Tente novamente.")

    return data


def save_shopee_credential(token_payload: dict, db: Session):
    expires_in = int(
        token_payload.get("expire_in")
        or token_payload.get("expires_in")
        or token_payload.get("access_token_expire_in")
        or 0
    )
    credential = get_shopee_credential(db)

    if not credential:
        credential = models.MarketplaceCredential(provider=SHOPEE_PROVIDER)
        db.add(credential)

    credential.external_user_id = str(
        token_payload.get("shop_id")
        or token_payload.get("merchant_id")
        or credential.external_user_id
        or ""
    )
    credential.nickname = str(
        token_payload.get("shop_name")
        or token_payload.get("merchant_name")
        or token_payload.get("nickname")
        or credential.nickname
        or ""
    )
    credential.access_token = str(token_payload.get("access_token") or "")
    credential.refresh_token = str(token_payload.get("refresh_token") or credential.refresh_token or "")
    credential.token_type = str(token_payload.get("token_type") or "bearer")
    credential.scope = str(token_payload.get("scope") or "")
    credential.expires_at = datetime.utcnow() + timedelta(seconds=expires_in) if expires_in else None
    credential.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(credential)
    return credential


def refresh_shopee_token(credential: models.MarketplaceCredential, db: Session):
    config = require_shopee_config(db)

    if not credential.refresh_token:
        raise HTTPException(status_code=401, detail="Shopee desconectada. Conecte a conta novamente.")

    target_shop_id = str(credential.external_user_id or config["shop_id"]).strip()
    body = {
        "partner_id": shopee_numeric_value(config["partner_id"]),
        "refresh_token": credential.refresh_token,
    }

    if target_shop_id:
        body["shop_id"] = shopee_numeric_value(target_shop_id)

    token_payload = shopee_request(
        "POST",
        config["refresh_url"],
        db,
        body=body,
    )
    return save_shopee_credential(token_payload, db)


def get_valid_shopee_access_token(db: Session):
    credential = get_shopee_credential(db)

    if not credential or not credential.access_token:
        raise HTTPException(status_code=401, detail="Shopee nao conectada. Conecte a conta primeiro.")

    if credential.expires_at and credential.expires_at <= datetime.utcnow() + timedelta(minutes=5):
        credential = refresh_shopee_token(credential, db)

    return credential.access_token, credential


def serialize_shopee_status(db: Session):
    config = get_shopee_config(db)
    credential = get_shopee_credential(db)
    token_expired = bool(
        credential
        and credential.expires_at
        and credential.expires_at <= datetime.utcnow()
    )

    return {
        "configured": bool(
            config["partner_id"]
            and config["partner_key"]
            and config["redirect_url"]
        ),
        "connected": bool(credential and credential.access_token),
        "token_expired": token_expired,
        "partner_id": config["partner_id"],
        "partner_id_present": bool(config["partner_id"]),
        "partner_key_configured": bool(config["partner_key"]),
        "shop_id": config["shop_id"],
        "shop_name": (credential.nickname if credential and credential.nickname else config["shop_name"]),
        "external_user_id": credential.external_user_id if credential else "",
        "environment": config["environment"],
        "redirect_url": config["redirect_url"],
        "frontend_return_url": config["frontend_return_url"],
        "auth_url": config["auth_url"],
        "token_url": config["token_url"],
        "refresh_url": config["refresh_url"],
        "shop_info_url": config["shop_info_url"],
        "api_base": config["api_base"],
        "expires_at": credential.expires_at.isoformat() if credential and credential.expires_at else None,
        "updated_at": credential.updated_at.isoformat() if credential and credential.updated_at else None,
    }


def build_shopee_authorization_url(config: dict, state: str):
    auth_url = config["auth_url"]
    timestamp = str(int(datetime.utcnow().timestamp()))
    parsed = urllib.parse.urlparse(auth_url)
    path = parsed.path or "/"
    sign = build_shopee_signature(config["partner_id"], config["partner_key"], path, timestamp)
    redirect_url = append_url_params(config["redirect_url"], {"state": state})
    query = {
        "partner_id": config["partner_id"],
        "timestamp": timestamp,
        "sign": sign,
        "redirect": redirect_url,
    }
    existing_query = dict(urllib.parse.parse_qsl(parsed.query, keep_blank_values=True))
    existing_query.update(query)
    return urllib.parse.urlunparse(parsed._replace(query=urllib.parse.urlencode(existing_query, doseq=True)))


def shopee_token_request(code: str, shop_id: str, db: Session):
    config = require_shopee_config(db)
    target_shop_id = str(shop_id or config["shop_id"]).strip()

    if not target_shop_id:
        raise HTTPException(status_code=400, detail="Informe o Shop ID da Shopee")

    body = {
        "partner_id": shopee_numeric_value(config["partner_id"]),
        "code": code,
    }

    if target_shop_id:
        body["shop_id"] = shopee_numeric_value(target_shop_id)

    return shopee_request(
        "POST",
        config["token_url"],
        db,
        body=body,
    )


def shopee_shop_info_request(db: Session):
    config = get_shopee_config(db)
    access_token, credential = get_valid_shopee_access_token(db)
    return shopee_request(
        "GET",
        config["shop_info_url"],
        db,
        access_token=access_token,
        shop_id=credential.external_user_id or config["shop_id"],
    )


def sync_shopee_store_integration(db: Session, credential: models.MarketplaceCredential, shop_info: dict | None = None):
    shop_info = shop_info or {}
    shop_id = str(
        shop_info.get("shop_id")
        or shop_info.get("merchant_id")
        or credential.external_user_id
        or ""
    ).strip()
    store_name = str(
        shop_info.get("shop_name")
        or shop_info.get("nickname")
        or shop_info.get("name")
        or credential.nickname
        or "Loja Shopee"
    ).strip()
    country = str(shop_info.get("region") or shop_info.get("country") or "BR").strip() or "BR"
    query = db.query(models.StoreIntegration).filter(models.StoreIntegration.marketplace == "Shopee")

    if shop_id:
        integration = query.filter(models.StoreIntegration.shop_id == shop_id).first()
    else:
        integration = query.filter(models.StoreIntegration.shop_id == "").first()

    if not integration:
        integration = models.StoreIntegration(marketplace="Shopee")
        db.add(integration)

    integration.store_name = store_name
    integration.country = country
    integration.shop_id = shop_id
    integration.status = "Ativo"
    integration.auth_date = datetime.utcnow().strftime("%d/%m/%Y %H:%M")
    integration.notes = "Autorizada pela Shopee Open Platform"
    db.commit()
    db.refresh(integration)
    return integration


def mark_shopee_store_integrations_disconnected(db: Session):
    integrations = (
        db.query(models.StoreIntegration)
        .filter(models.StoreIntegration.marketplace == "Shopee")
        .all()
    )

    for integration in integrations:
        integration.status = "Expirado"
        integration.notes = "Conta Shopee desconectada"

    db.commit()


ML_MARKETPLACE_LABEL = "Mercado Livre"
ML_SYNC_PAGE_LIMIT = 50
ML_SYNC_MAX_OFFSET = 2000
ML_MULTIGET_BATCH = 20


def resolve_ml_seller_id(db: Session):
    _, credential = get_valid_ml_access_token(db)
    seller_id = (credential.external_user_id or "").strip()

    if not seller_id:
        me = ml_authenticated_get("/users/me", db)
        seller_id = str(me.get("id") or "").strip()

        if seller_id:
            credential.external_user_id = seller_id
            db.commit()

    if not seller_id:
        raise HTTPException(
            status_code=400,
            detail="Nao foi possivel identificar o vendedor no Mercado Livre.",
        )

    return seller_id


def sync_ml_products(db: Session):
    seller_id = resolve_ml_seller_id(db)

    item_ids = []
    offset = 0

    while True:
        search = ml_authenticated_get(
            f"/users/{seller_id}/items/search?limit={ML_SYNC_PAGE_LIMIT}&offset={offset}",
            db,
        )
        results = search.get("results") or []
        item_ids.extend(str(item_id) for item_id in results)

        total = int((search.get("paging") or {}).get("total") or 0)
        offset += ML_SYNC_PAGE_LIMIT

        if not results or offset >= total or offset > ML_SYNC_MAX_OFFSET:
            break

    created = 0
    updated = 0

    for start in range(0, len(item_ids), ML_MULTIGET_BATCH):
        chunk = item_ids[start : start + ML_MULTIGET_BATCH]
        attributes = "id,title,price,available_quantity,seller_custom_field,thumbnail,status"
        multiget = ml_authenticated_get(
            "/items?ids=" + ",".join(chunk) + "&attributes=" + attributes,
            db,
        )

        for entry in multiget if isinstance(multiget, list) else []:
            body = entry.get("body") if isinstance(entry, dict) else None

            if not body or not body.get("id"):
                continue

            ml_id = str(body.get("id"))
            sku = str(body.get("seller_custom_field") or "").strip() or ml_id
            name = str(body.get("title") or "").strip() or sku
            price = parse_number(body.get("price"), 0)
            stock = int(parse_number(body.get("available_quantity"), 0))
            thumbnail = str(body.get("thumbnail") or "").replace("http://", "https://")
            status = str(body.get("status") or "").strip().lower()

            existing = (
                db.query(models.Product)
                .filter(
                    models.Product.marketplace == ML_MARKETPLACE_LABEL,
                    models.Product.sku == sku,
                )
                .first()
            )

            if existing:
                existing.name = name
                existing.sale_price = price
                existing.stock = stock
                existing.marketplace_status = status

                if thumbnail:
                    existing.image_url = thumbnail
                if not existing.barcode:
                    existing.barcode = ml_id

                updated += 1
            else:
                db.add(
                    models.Product(
                        sku=sku,
                        name=name,
                        sale_price=price,
                        stock=stock,
                        image_url=thumbnail,
                        barcode=ml_id,
                        marketplace=ML_MARKETPLACE_LABEL,
                        marketplace_status=status,
                        minimum_stock=0,
                    )
                )
                created += 1

    db.commit()

    return {"items_found": len(item_ids), "created": created, "updated": updated}


def sync_ml_orders(db: Session):
    seller_id = resolve_ml_seller_id(db)

    found = 0
    created = 0
    updated = 0
    skipped = 0
    offset = 0

    while True:
        data = ml_authenticated_get(
            f"/orders/search?seller={seller_id}&sort=date_desc&limit={ML_SYNC_PAGE_LIMIT}&offset={offset}",
            db,
        )
        results = data.get("results") or []
        found += len(results)

        for order in results:
            order_id = str(order.get("id") or "").strip()
            status = str(order.get("status") or "").strip().lower()

            if not order_id or status in {"cancelled", "invalid"}:
                skipped += 1
                continue

            external_id = f"ml:{order_id}"
            total = parse_number(order.get("total_amount"), 0)
            titles = ", ".join(
                str((item.get("item") or {}).get("title") or "")
                for item in (order.get("order_items") or [])
            ).strip(", ")
            description = f"Venda Mercado Livre #{order_id}"
            if titles:
                description = f"{description} - {titles}"
            description = description[:240]

            existing = (
                db.query(models.Revenue)
                .filter(models.Revenue.external_id == external_id)
                .first()
            )

            if existing:
                existing.value = total
                existing.description = description
                existing.marketplace = ML_MARKETPLACE_LABEL
                updated += 1
            else:
                db.add(
                    models.Revenue(
                        description=description,
                        value=total,
                        category="Venda",
                        marketplace=ML_MARKETPLACE_LABEL,
                        external_id=external_id,
                    )
                )
                created += 1

        total_orders = int((data.get("paging") or {}).get("total") or 0)
        offset += ML_SYNC_PAGE_LIMIT

        if not results or offset >= total_orders or offset > ML_SYNC_MAX_OFFSET:
            break

    db.commit()

    return {"orders_found": found, "created": created, "updated": updated, "skipped": skipped}


# Atributos que costumam gerar conflito ao clonar (ex: GTIN/SKU ja em uso).
ML_CLONE_SKIP_ATTRIBUTES = {"GTIN", "SELLER_SKU", "EAN"}


def extract_ml_reference(value: str):
    upper = (value or "").strip().upper()
    match = re.search(r"MLB-?\d{5,}", upper)

    if not match:
        raise HTTPException(
            status_code=400,
            detail="Link invalido. Cole o link de um anuncio do Mercado Livre.",
        )

    reference_id = match.group(0).replace("-", "")
    # Links de catalogo tem o padrao /p/MLB...; sao produtos, nao anuncios.
    is_product = bool(re.search(r"/P/MLB-?\d{5,}", upper))
    return ("product" if is_product else "item"), reference_id


def _ml_try_get_item(item_id: str, db: Session):
    try:
        item = ml_authenticated_get(f"/items/{item_id}", db)
        return item if item and item.get("id") else None
    except HTTPException as exc:
        if exc.status_code in (400, 403, 404):
            return None
        raise


def _ml_item_from_product(product_id: str, db: Session):
    try:
        product = ml_authenticated_get(f"/products/{product_id}", db)
    except HTTPException as exc:
        if exc.status_code in (400, 403, 404):
            return None
        raise

    winner = product.get("buy_box_winner") or {}
    item_id = winner.get("item_id")

    if not item_id:
        candidates = product.get("results") or product.get("children_ids") or []
        if candidates:
            first = candidates[0]
            item_id = first if isinstance(first, str) else (first or {}).get("item_id")

    if not item_id:
        return None

    return _ml_try_get_item(str(item_id), db)


def resolve_ml_item(value: str, db: Session):
    kind, reference_id = extract_ml_reference(value)
    order = ("item", "product") if kind == "item" else ("product", "item")

    for attempt in order:
        item = (
            _ml_try_get_item(reference_id, db)
            if attempt == "item"
            else _ml_item_from_product(reference_id, db)
        )
        if item:
            return item

    raise HTTPException(
        status_code=400,
        detail=(
            "Nao foi possivel encontrar este anuncio no Mercado Livre. "
            "Confira se o link e de um anuncio ATIVO e tente o link no formato "
            "produto.mercadolivre.com.br/MLB-..."
        ),
    )


def fetch_ml_listing(value: str, db: Session):
    item = resolve_ml_item(value, db)
    item_id = item.get("id")

    description_text = ""
    try:
        description = ml_authenticated_get(f"/items/{item_id}/description", db)
        description_text = str(description.get("plain_text") or description.get("text") or "")
    except HTTPException:
        description_text = ""

    return item, description_text


def serialize_ml_listing(item: dict, description_text: str):
    pictures = [
        str(picture.get("secure_url") or picture.get("url") or "")
        for picture in (item.get("pictures") or [])
        if picture.get("secure_url") or picture.get("url")
    ]

    return {
        "source_id": item.get("id"),
        "title": item.get("title"),
        "price": item.get("price"),
        "currency_id": item.get("currency_id"),
        "available_quantity": item.get("available_quantity"),
        "condition": item.get("condition"),
        "category_id": item.get("category_id"),
        "listing_type_id": item.get("listing_type_id"),
        "permalink": item.get("permalink"),
        "thumbnail": str(item.get("thumbnail") or "").replace("http://", "https://"),
        "pictures": pictures,
        "description": description_text,
    }


def build_ml_clone_payload(source: dict, payload: "PublishListingRequest"):
    attributes = []
    for attribute in source.get("attributes") or []:
        attribute_id = attribute.get("id")

        if not attribute_id or attribute_id in ML_CLONE_SKIP_ATTRIBUTES:
            continue

        if not (attribute.get("value_id") or attribute.get("value_name")):
            continue

        entry = {"id": attribute_id}
        if attribute.get("value_id"):
            entry["value_id"] = attribute["value_id"]
        else:
            entry["value_name"] = attribute["value_name"]
        attributes.append(entry)

    pictures = [
        {"source": str(picture.get("secure_url") or picture.get("url") or "")}
        for picture in (source.get("pictures") or [])
        if picture.get("secure_url") or picture.get("url")
    ]

    clone = {
        "title": (payload.title or source.get("title") or "").strip(),
        "category_id": source.get("category_id"),
        "price": payload.price if payload.price is not None else source.get("price"),
        "currency_id": source.get("currency_id") or "BRL",
        "available_quantity": (
            payload.available_quantity
            if payload.available_quantity is not None
            else (source.get("available_quantity") or 1)
        ),
        "buying_mode": source.get("buying_mode") or "buy_it_now",
        "condition": source.get("condition") or "new",
        "listing_type_id": source.get("listing_type_id") or "bronze",
    }

    if pictures:
        clone["pictures"] = pictures
    if attributes:
        clone["attributes"] = attributes

    return clone


def ml_create_item(clone_payload: dict, description_text: str, db: Session):
    settings = get_ml_settings()
    access_token, _ = get_valid_ml_access_token(db)
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    created = ml_http_request(
        "POST",
        f"{settings['api_base']}/items",
        data=json.dumps(clone_payload).encode("utf-8"),
        headers=headers,
    )

    new_id = created.get("id")

    if new_id and description_text:
        try:
            ml_http_request(
                "POST",
                f"{settings['api_base']}/items/{new_id}/description",
                data=json.dumps({"plain_text": description_text}).encode("utf-8"),
                headers=headers,
            )
        except HTTPException:
            pass

    return created


def send_email_code(email: str, code: str, purpose: str):
    subject = "Codigo de verificacao NEXT ERP"
    body = "\n".join(
        [
            "NEXT ERP",
            "",
            f"Seu codigo para {purpose} e {code}.",
            "Ele expira em 10 minutos.",
            "",
            "Se voce nao solicitou este acesso, ignore esta mensagem.",
        ]
    )
    provider = get_email_provider()
    resend_settings = get_resend_settings()

    if provider == "resend" or (provider == "auto" and resend_settings["configured"]):
        return send_resend_email(email, subject, body, resend_settings)

    return send_smtp_email(email, subject, body)


def send_resend_email(email: str, subject: str, body: str, resend_settings: dict):
    if not resend_settings["configured"]:
        if AUTH_DEV_MODE:
            return False

        missing = ", ".join(resend_settings["missing"])
        raise HTTPException(
            status_code=503,
            detail=f"Envio de email via Resend nao configurado. Verifique no Railway: {missing}.",
        )

    payload = json.dumps(
        {
            "from": resend_settings["from_address"],
            "to": [email],
            "subject": subject,
            "text": body,
        }
    ).encode("utf-8")

    request = urllib.request.Request(
        resend_settings["api_url"],
        data=payload,
        method="POST",
    )
    request.add_header("Authorization", f"Bearer {resend_settings['api_key']}")
    request.add_header("Content-Type", "application/json")
    request.add_header("User-Agent", "nexterp/1.0")

    try:
        with urllib.request.urlopen(request, timeout=12) as response:
            if 200 <= response.status < 300:
                return True

            response_body = response.read().decode("utf-8", errors="replace")
            raise HTTPException(
                status_code=502,
                detail=f"Falha ao enviar email via Resend: HTTP {response.status} {response_body}",
            )
    except urllib.error.HTTPError as exc:
        response_body = exc.read().decode("utf-8", errors="replace")
        raise HTTPException(
            status_code=502,
            detail=f"Falha ao enviar email via Resend: HTTP {exc.code} {response_body}",
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Falha ao enviar email via Resend: {type(exc).__name__}: {exc}",
        )


def send_smtp_email(email: str, subject: str, body: str):
    smtp_settings = get_smtp_settings()

    if not smtp_settings["configured"]:
        if AUTH_DEV_MODE:
            return False

        missing = ", ".join(smtp_settings["missing"])
        raise HTTPException(
            status_code=503,
            detail=f"Envio de email SMTP nao configurado. Verifique no Railway: {missing}.",
        )

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = smtp_settings["smtp_from"]
    message["To"] = email
    message.set_content(body)

    errors = []

    for attempt in get_smtp_attempts(smtp_settings):
        try:
            smtp_client = smtplib.SMTP_SSL if attempt["smtp_ssl"] else smtplib.SMTP
            with smtp_client(
                attempt["smtp_host"],
                attempt["smtp_port"],
                timeout=attempt["smtp_timeout"],
            ) as server:
                if attempt["smtp_tls"] and not attempt["smtp_ssl"]:
                    server.starttls()

                if attempt["smtp_user"] and attempt["smtp_password"]:
                    server.login(attempt["smtp_user"], attempt["smtp_password"])

                server.send_message(message)
            return True
        except Exception as exc:
            mode = "ssl" if attempt["smtp_ssl"] else "tls"
            errors.append(
                f"{attempt['smtp_host']}:{attempt['smtp_port']} ({mode}) "
                f"{type(exc).__name__}: {exc}"
            )

    raise HTTPException(status_code=502, detail="Falha ao enviar email: " + " | ".join(errors))


def build_sms_body(code: str, purpose: str):
    return f"NEXT ERP: seu codigo para {purpose} e {code}. Expira em 10 minutos."


def send_twilio_sms_code(phone: str, code: str, purpose: str):
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_FROM_NUMBER")

    if not account_sid or not auth_token or not from_number:
        if AUTH_DEV_MODE:
            return False

        raise HTTPException(
            status_code=503,
            detail=(
                "Envio de SMS nao configurado. Configure TWILIO_ACCOUNT_SID, "
                "TWILIO_AUTH_TOKEN e TWILIO_FROM_NUMBER no backend/.env."
            ),
        )

    payload = urllib.parse.urlencode(
        {
            "To": phone_to_e164(phone),
            "From": from_number,
            "Body": build_sms_body(code, purpose),
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
            if 200 <= response.status < 300:
                return True

            raise HTTPException(status_code=502, detail="Falha ao enviar SMS pelo provedor")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Falha ao enviar SMS: {exc}")


def send_zenvia_sms_code(phone: str, code: str, purpose: str):
    api_token = os.getenv("ZENVIA_API_TOKEN")
    sender = os.getenv("ZENVIA_FROM")
    api_url = os.getenv("ZENVIA_API_URL", "https://api.zenvia.com/v2/channels/sms/messages")

    if not api_token or not sender:
        if AUTH_DEV_MODE:
            return False

        raise HTTPException(
            status_code=503,
            detail="Envio de SMS nao configurado. Configure ZENVIA_API_TOKEN e ZENVIA_FROM no backend/.env.",
        )

    payload = json.dumps(
        {
            "from": sender,
            "to": phone_to_e164(phone),
            "contents": [
                {
                    "type": "text",
                    "text": build_sms_body(code, purpose),
                }
            ],
        }
    ).encode("utf-8")
    request = urllib.request.Request(api_url, data=payload, method="POST")
    request.add_header("Content-Type", "application/json")
    request.add_header("X-API-TOKEN", api_token)

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            if 200 <= response.status < 300:
                return True

            raise HTTPException(status_code=502, detail="Falha ao enviar SMS pela Zenvia")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Falha ao enviar SMS pela Zenvia: {exc}")


def send_sms_code(phone: str, code: str, purpose: str):
    sms_settings = get_sms_settings()
    sms_provider = sms_settings["provider"]

    if not sms_settings["configured"]:
        if AUTH_DEV_MODE:
            return False

        missing = ", ".join(sms_settings["missing"])
        raise HTTPException(
            status_code=503,
            detail=f"Envio de SMS nao configurado. Verifique no Railway: {missing}.",
        )

    if sms_provider == "zenvia":
        return send_zenvia_sms_code(phone, code, purpose)

    if sms_provider == "twilio":
        return send_twilio_sms_code(phone, code, purpose)

    raise HTTPException(
        status_code=503,
        detail="Provedor de SMS invalido. Use SMS_PROVIDER=twilio ou SMS_PROVIDER=zenvia.",
    )


def send_code_by_channel(channel: str, target: str, code: str, purpose: str):
    if channel == "phone":
        return send_sms_code(target, code, purpose)

    return send_email_code(target, code, purpose)


def create_verification_challenge(user: models.User, payload, db: Session):
    channel = normalize_verification_channel(payload.verification_channel)
    target = user.email
    session_days = 14 if getattr(payload, "remember", True) else 7

    if channel == "phone":
        target = normalize_phone(payload.phone)
        if not user.phone:
            raise HTTPException(status_code=400, detail="Este usuario nao possui celular cadastrado")

        if target != user.phone:
            raise HTTPException(status_code=400, detail="Informe o celular cadastrado nesta conta")

    delete_expired_verification_codes(db)
    code = create_six_digit_code()
    challenge_id = secrets.token_urlsafe(32)
    sent = send_code_by_channel(channel, target, code, "login")

    db.add(
        models.VerificationCode(
            purpose="login",
            challenge_id=challenge_id,
            user_id=user.id,
            email=user.email,
            phone=target if channel == "phone" else "",
            channel=channel,
            code_hash=hash_verification_code(code),
            session_days=session_days,
            expires_at=datetime.utcnow() + timedelta(minutes=10),
        )
    )
    db.commit()

    response = {
        "requires_verification": True,
        "challenge_id": challenge_id,
        "channel": channel,
        "target": target,
        "expires_in_minutes": 10,
        "sent": bool(sent),
    }

    if AUTH_DEV_MODE and not sent:
        response["dev_code"] = code

    return response


def create_registration_code(payload: RegisterCodeRequest, db: Session):
    email = normalize_email(payload.email)
    phone = normalize_phone(payload.phone)
    sms_settings = get_sms_settings()
    sms_required = sms_settings["configured"]

    if db.query(models.User).filter(models.User.email == email).first():
        raise HTTPException(status_code=400, detail="Este email ja possui cadastro")

    delete_expired_verification_codes(db)
    email_code = create_six_digit_code()
    sms_code = create_six_digit_code() if sms_required else ""
    email_sent = send_email_code(email, email_code, "cadastro")
    sms_sent = send_sms_code(phone, sms_code, "cadastro") if sms_required else False
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
            channel="email_sms" if sms_required else "email",
            email_code_hash=hash_verification_code(email_code),
            sms_code_hash=hash_verification_code(sms_code) if sms_required else "",
            expires_at=datetime.utcnow() + timedelta(minutes=10),
        )
    )
    db.commit()

    result = {
        "message": "Codigos de verificacao enviados",
        "email": email,
        "phone": phone,
        "email_sent": bool(email_sent),
        "sms_sent": bool(sms_sent),
        "sms_required": sms_required,
        "expires_in_minutes": 10,
    }

    if AUTH_DEV_MODE:
        if not email_sent:
            result["dev_email_code"] = email_code
        if sms_required and not sms_sent:
            result["dev_sms_code"] = sms_code

    return result


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

    sms_required = bool(registration.sms_code_hash)

    if sms_required and normalize_phone(phone) != registration.phone:
        raise HTTPException(status_code=400, detail="O celular informado precisa ser o mesmo que recebeu o SMS")

    clean_email_code = (email_code or fallback_code or "").strip()
    clean_sms_code = (sms_code or fallback_code or "").strip() if sms_required else ""

    if not clean_email_code:
        raise HTTPException(status_code=400, detail="Informe o codigo recebido por email")

    if sms_required and not clean_sms_code:
        raise HTTPException(status_code=400, detail="Informe os codigos recebidos por email e SMS")

    def register_failed_attempt(detail: str):
        registration.attempts = (registration.attempts or 0) + 1

        if registration.attempts >= MAX_VERIFICATION_ATTEMPTS:
            db.delete(registration)
            db.commit()
            raise HTTPException(
                status_code=429,
                detail="Muitas tentativas. Solicite novos codigos de verificacao.",
            )

        db.commit()
        raise HTTPException(status_code=400, detail=detail)

    if not verify_verification_code(clean_email_code, registration.email_code_hash):
        register_failed_attempt("Codigo de email invalido")

    if sms_required and not verify_verification_code(clean_sms_code, registration.sms_code_hash):
        register_failed_attempt("Codigo de SMS invalido")


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
        challenge.attempts = (challenge.attempts or 0) + 1

        if challenge.attempts >= MAX_VERIFICATION_ATTEMPTS:
            db.delete(challenge)
            db.commit()
            raise HTTPException(
                status_code=429,
                detail="Muitas tentativas. Solicite um novo codigo de verificacao.",
            )

        db.commit()
        raise HTTPException(status_code=400, detail="Codigo de verificacao invalido")

    user = (
        db.query(models.User)
        .filter(models.User.id == challenge.user_id, models.User.is_active == True)
        .first()
    )

    if not user:
        raise HTTPException(status_code=401, detail="Usuario inativo")

    session_days = challenge.session_days or 7
    db.delete(challenge)
    token = create_auth_session(user.id, db, session_days)

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
ensure_fiscal_invoice_columns()
ensure_user_columns()
ensure_verification_code_columns()
ensure_revenue_columns()

app = FastAPI(title="NEXT ERP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# index.html nunca pode ficar em cache: ele aponta para os bundles com hash.
# Se o navegador guardar um index antigo, o usuario fica preso numa versao velha.
NO_CACHE_HEADERS = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
}


@app.get("/")
def home():
    index_file = FRONTEND_DIST / "index.html"

    if index_file.exists():
        return FileResponse(index_file, headers=NO_CACHE_HEADERS)

    return {"message": "NEXT ERP rodando com sucesso"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "NEXT ERP"}


@app.get("/health/database")
def database_health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {
        "status": "ok",
        "database": engine.url.get_backend_name(),
        "driver": engine.url.get_driver_name(),
    }


@app.get("/health/email")
def email_health():
    provider = get_email_provider()
    smtp_settings = get_smtp_settings()
    resend_settings = get_resend_settings()
    effective_provider = (
        "resend"
        if provider == "resend" or (provider == "auto" and resend_settings["configured"])
        else "smtp"
    )
    return {
        "status": (
            "ok"
            if (effective_provider == "resend" and resend_settings["configured"])
            or (effective_provider == "smtp" and smtp_settings["configured"])
            else "missing_config"
        ),
        "configured": (
            resend_settings["configured"]
            if effective_provider == "resend"
            else smtp_settings["configured"]
        ),
        "provider": provider,
        "effective_provider": effective_provider,
        "resend_configured": resend_settings["configured"],
        "resend_from_configured": bool(resend_settings["from_address"]),
        "resend_missing": resend_settings["missing"],
        "smtp_host_configured": bool(smtp_settings["smtp_host"]),
        "smtp_port": smtp_settings["smtp_port"],
        "smtp_port_valid": smtp_settings["port_valid"],
        "smtp_timeout": smtp_settings["smtp_timeout"],
        "smtp_timeout_valid": smtp_settings["timeout_valid"],
        "smtp_from_configured": bool(smtp_settings["smtp_from"]),
        "smtp_auth_configured": bool(
            smtp_settings["smtp_user"] and smtp_settings["smtp_password"]
        ),
        "smtp_tls": smtp_settings["smtp_tls"],
        "smtp_ssl": smtp_settings["smtp_ssl"],
        "auth_dev_mode": AUTH_DEV_MODE,
        "missing": resend_settings["missing"] if effective_provider == "resend" else smtp_settings["missing"],
    }


@app.get("/health/sms")
def sms_health():
    sms_settings = get_sms_settings()
    return {
        "status": "ok" if sms_settings["configured"] else "missing_config",
        "configured": sms_settings["configured"],
        "provider": sms_settings["provider"],
        "provider_valid": sms_settings["provider_valid"],
        "auth_dev_mode": AUTH_DEV_MODE,
        "missing": sms_settings["missing"],
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
        phone=normalize_phone(payload.phone),
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

    token = create_auth_session(user.id, db, 14 if payload.remember else 7)

    return {
        "token": token,
        "user": serialize_user(user),
    }


@app.post("/auth/setup")
def auth_setup(payload: SetupRequest, db: Session = Depends(get_db)):
    if db.query(models.User).count() > 0:
        raise HTTPException(status_code=400, detail="Setup inicial ja foi feito")

    email = normalize_email(payload.email)

    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="A senha precisa ter ao menos 6 caracteres")

    verification_channel = normalize_verification_channel(payload.verification_channel)
    phone = normalize_phone(payload.phone) if verification_channel == "phone" else ""

    user = models.User(
        name=payload.name.strip() or "Administrador",
        email=email,
        phone=phone,
        password_hash=hash_password(payload.password),
        role="admin",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    try:
        return create_verification_challenge(user, payload, db)
    except Exception:
        db.rollback()
        db.query(models.User).filter(models.User.id == user.id).delete(synchronize_session=False)
        db.commit()
        raise


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
                {"role": "system", "content": "Voce e um assistente inteligente da NEXT ERP, ajudando com informacoes sobre estoque, marketplace, precificacao e processos de vendas."},
                {"role": "user", "content": request.message},
            ],
            max_tokens=500,
            temperature=0.7,
        )

        answer = (completion.choices[0].message.content or "").strip()
        return {"answer": answer}
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Nao foi possivel obter resposta do assistente no momento.",
        )


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


@app.post("/settings/bulk")
def upsert_settings_bulk(
    payload: SettingsBulkUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    if not payload.settings:
        raise HTTPException(status_code=400, detail="Nenhuma configuracao informada")

    seen_keys = set()

    for item in payload.settings:
        if item.key in seen_keys:
            raise HTTPException(status_code=400, detail=f"Configuracao repetida: {item.key}")
        seen_keys.add(item.key)

        setting = db.query(models.Setting).filter(models.Setting.key == item.key).first()

        if setting:
            setting.value = item.value
            setting.group = item.group
            setting.updated_at = datetime.utcnow()
        else:
            db.add(models.Setting(**item.model_dump()))

    db.commit()
    return {
        "message": "Configuracoes salvas",
        "updated": len(payload.settings),
    }


@app.get("/fiscal/config")
def fiscal_config(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    return get_fiscal_config(db)


@app.put("/fiscal/config")
def update_fiscal_config(
    payload: FiscalConfigUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    data = payload.model_dump()
    focus_token = str(data.pop("focus_token", "") or "").strip()

    if focus_token:
        upsert_setting_value(db, "focus_nfe_token", focus_token, group="fiscal_secret")

    for key, value in data.items():
        if key not in FISCAL_SETTING_KEYS:
            continue

        upsert_setting_value(db, key, str(value).lower() if isinstance(value, bool) else str(value))

    db.commit()
    return get_fiscal_config(db)


@app.get("/fiscal/invoices")
def list_fiscal_invoices(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    invoices = (
        db.query(models.FiscalInvoice)
        .order_by(models.FiscalInvoice.created_at.desc())
        .limit(100)
        .all()
    )
    return [serialize_fiscal_invoice(invoice) for invoice in invoices]


@app.post("/fiscal/invoices")
def issue_fiscal_invoice(
    payload: FiscalIssueRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    document_type = focus_document_path(payload.document_type)
    ref = (payload.ref or generate_fiscal_ref(document_type)).strip()

    if not ref:
        ref = generate_fiscal_ref(document_type)

    if db.query(models.FiscalInvoice).filter(models.FiscalInvoice.ref == ref).first():
        raise HTTPException(status_code=400, detail="Ja existe uma nota fiscal com esta referencia")

    if not payload.payload:
        raise HTTPException(status_code=400, detail="Informe o JSON fiscal da nota")

    response_payload = focus_nfe_request(
        "POST",
        f"/v2/{document_type}?ref={urllib.parse.quote(ref)}",
        payload.payload,
        db,
    )

    invoice = models.FiscalInvoice(
        ref=ref,
        document_type=document_type,
        provider="focus_nfe",
        request_payload=fiscal_json_dumps(payload.payload),
        valor_total=parse_number(payload.payload.get("valor_total") or payload.payload.get("total"), 0),
        customer_name=str(
            payload.payload.get("nome_destinatario")
            or payload.payload.get("razao_social_destinatario")
            or ""
        ),
        customer_document=str(
            payload.payload.get("cpf_destinatario")
            or payload.payload.get("cnpj_destinatario")
            or ""
        ),
    )
    apply_focus_invoice_response(invoice, response_payload, db)
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    return serialize_fiscal_invoice(invoice) | {"provider_response": response_payload}


@app.get("/fiscal/invoices/{ref}")
def get_fiscal_invoice(
    ref: str,
    refresh: bool = False,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    invoice = db.query(models.FiscalInvoice).filter(models.FiscalInvoice.ref == ref).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Nota fiscal nao encontrada")

    if refresh:
        document_type = focus_document_path(invoice.document_type)
        response_payload = focus_nfe_request(
            "GET",
            f"/v2/{document_type}/{urllib.parse.quote(ref)}?completa=1",
            None,
            db,
        )
        apply_focus_invoice_response(invoice, response_payload, db)
        db.commit()
        db.refresh(invoice)

    return serialize_fiscal_invoice(invoice)


@app.post("/fiscal/invoices/{ref}/cancel")
def cancel_fiscal_invoice(
    ref: str,
    payload: FiscalCancelRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    invoice = db.query(models.FiscalInvoice).filter(models.FiscalInvoice.ref == ref).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Nota fiscal nao encontrada")

    if len(payload.justificativa.strip()) < 15:
        raise HTTPException(status_code=400, detail="Justificativa de cancelamento muito curta")

    document_type = focus_document_path(invoice.document_type)
    response_payload = focus_nfe_request(
        "DELETE",
        f"/v2/{document_type}/{urllib.parse.quote(ref)}",
        {"justificativa": payload.justificativa.strip()},
        db,
    )
    apply_focus_invoice_response(invoice, response_payload, db)
    invoice.status = invoice.status or "cancelamento_solicitado"
    db.commit()
    db.refresh(invoice)

    return serialize_fiscal_invoice(invoice) | {"provider_response": response_payload}


@app.get("/integrations/mercadolivre/status")
def mercadolivre_status(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    return serialize_ml_status(db)


def count_marketplace_ads(db: Session, marketplace_label: str):
    total = (
        db.query(models.Product)
        .filter(models.Product.marketplace == marketplace_label)
        .count()
    )
    active = (
        db.query(models.Product)
        .filter(
            models.Product.marketplace == marketplace_label,
            models.Product.marketplace_status == "active",
        )
        .count()
    )

    return {"total_ads": total, "active_ads": active, "paused_ads": max(total - active, 0)}


@app.get("/integrations/marketplaces")
def list_connected_marketplaces(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    ml_credential = get_ml_credential(db)
    ml_connected = bool(ml_credential and ml_credential.access_token)

    marketplaces = []

    ml_entry = {
        "key": "mercado_livre",
        "label": ML_MARKETPLACE_LABEL,
        "connected": ml_connected,
        "integration_page": "mercado-livre-integration",
        "products_page": "products",
        "total_ads": 0,
        "active_ads": 0,
        "paused_ads": 0,
        "nickname": ml_credential.nickname if ml_credential else "",
    }

    if ml_connected:
        ml_entry.update(count_marketplace_ads(db, ML_MARKETPLACE_LABEL))

    marketplaces.append(ml_entry)

    shopee_credential = get_shopee_credential(db)
    shopee_connected = bool(shopee_credential and shopee_credential.access_token)
    shopee_entry = {
        "key": "shopee",
        "label": "Shopee",
        "connected": shopee_connected,
        "integration_page": "store-integrations",
        "products_page": "products",
        "total_ads": 0,
        "active_ads": 0,
        "paused_ads": 0,
        "nickname": shopee_credential.nickname if shopee_credential else "",
    }

    if shopee_connected:
        shopee_entry.update(count_marketplace_ads(db, "Shopee"))

    marketplaces.append(shopee_entry)

    return {
        "marketplaces": marketplaces,
        "connected": [item for item in marketplaces if item["connected"]],
    }


@app.get("/integrations/mercadolivre/connect")
def mercadolivre_connect(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    settings = require_ml_settings()
    state = create_ml_oauth_state(user.id, db)
    query = urllib.parse.urlencode(
        {
            "response_type": "code",
            "client_id": settings["app_id"],
            "redirect_uri": settings["redirect_uri"],
            "state": state,
        }
    )
    return {"authorization_url": f"{settings['auth_url']}?{query}"}


@app.get("/mercadolivre/callback")
def mercadolivre_callback(
    code: str = "",
    state: str = "",
    error: str = "",
    db: Session = Depends(get_db),
):
    settings = get_ml_settings()
    return_url = settings["frontend_return_url"]
    separator = "&" if "?" in return_url else "?"

    def redirect_with(status: str):
        return RedirectResponse(url=f"{return_url}{separator}ml_status={status}", status_code=302)

    if error:
        return redirect_with(f"erro:{urllib.parse.quote(error)}")

    try:
        consume_ml_oauth_state(state, db)

        if not code:
            raise HTTPException(status_code=400, detail="Codigo de autorizacao ausente")

        token_payload = ml_token_request(
            {
                "grant_type": "authorization_code",
                "client_id": settings["app_id"],
                "client_secret": settings["secret_key"],
                "code": code,
                "redirect_uri": settings["redirect_uri"],
            }
        )
        credential = save_ml_credential(token_payload, db)

        try:
            me = ml_authenticated_get("/users/me", db)
            credential.nickname = str(me.get("nickname") or "")
            db.commit()
        except HTTPException:
            pass

        return redirect_with("conectado")
    except HTTPException as exc:
        return redirect_with(f"erro:{urllib.parse.quote(str(exc.detail))}")


@app.post("/integrations/mercadolivre/sync")
def mercadolivre_sync(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    credential = get_ml_credential(db)

    if not credential or not credential.access_token:
        raise HTTPException(
            status_code=400,
            detail="Conecte a conta do Mercado Livre antes de sincronizar.",
        )

    products_result = sync_ml_products(db)

    try:
        orders_result = sync_ml_orders(db)
    except HTTPException as exc:
        orders_result = {
            "orders_found": 0,
            "created": 0,
            "updated": 0,
            "skipped": 0,
            "error": str(exc.detail),
        }

    return {
        "message": "Sincronizacao concluida",
        "products": products_result,
        "orders": orders_result,
    }


def require_ml_connection(db: Session):
    credential = get_ml_credential(db)

    if not credential or not credential.access_token:
        raise HTTPException(
            status_code=400,
            detail="Conecte a conta do Mercado Livre antes de copiar anuncios.",
        )

    return credential


COPY_PLATFORM_LABELS = {
    "mercado_livre": "Mercado Livre",
    "mercadolivre": "Mercado Livre",
    "ml": "Mercado Livre",
    "shopee": "Shopee",
    "shein": "SHEIN",
    "temu": "Temu",
    "tiktok": "TikTok Shop",
    "tiktok_shop": "TikTok Shop",
    "kwai": "Kwai Shop",
    "kway": "Kwai Shop",
    "kwai_shop": "Kwai Shop",
}


def normalize_copy_platform(value: str):
    normalized = re.sub(r"[^a-z0-9]+", "_", (value or "").lower()).strip("_")
    if normalized in COPY_PLATFORM_LABELS:
        return normalized

    raise HTTPException(status_code=400, detail="Plataforma de anuncio invalida")


def copy_platform_label(platform: str):
    return COPY_PLATFORM_LABELS.get(platform, platform.replace("_", " ").title())


def require_copy_platform_supported(platform: str, action: str):
    if platform in {"mercado_livre", "mercadolivre", "ml"}:
        return

    raise HTTPException(
        status_code=501,
        detail=(
            f"O conector de {copy_platform_label(platform)} para {action} "
            "ja esta previsto, mas ainda precisa da API oficial dessa plataforma."
        ),
    )


@app.post("/integrations/listings/copy/preview")
def marketplace_copy_preview(
    payload: CopyListingRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    source_platform = normalize_copy_platform(payload.source_platform)
    require_copy_platform_supported(source_platform, "capturar anuncios")
    require_ml_connection(db)
    item, description_text = fetch_ml_listing(payload.url or payload.source_id, db)
    return serialize_ml_listing(item, description_text) | {
        "source_platform": "mercado_livre",
        "source_platform_label": "Mercado Livre",
    }


@app.post("/integrations/listings/copy/publish")
def marketplace_copy_publish(
    payload: PublishListingRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    source_platform = normalize_copy_platform(payload.source_platform)
    target_platform = normalize_copy_platform(payload.target_platform)
    require_copy_platform_supported(source_platform, "capturar anuncios")
    require_copy_platform_supported(target_platform, "publicar anuncios")
    require_ml_connection(db)
    source, description_text = fetch_ml_listing(payload.url or payload.source_id, db)
    clone_payload = build_ml_clone_payload(source, payload)

    if not clone_payload.get("category_id"):
        raise HTTPException(
            status_code=400,
            detail="Nao foi possivel identificar a categoria do anuncio de origem.",
        )

    created = ml_create_item(clone_payload, description_text, db)

    return {
        "message": "Anuncio publicado no Mercado Livre",
        "id": created.get("id"),
        "permalink": created.get("permalink"),
        "status": created.get("status"),
        "title": created.get("title"),
        "source_platform": "mercado_livre",
        "target_platform": "mercado_livre",
    }


@app.post("/integrations/mercadolivre/copy/preview")
def mercadolivre_copy_preview(
    payload: CopyListingRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    payload.source_platform = "mercado_livre"
    return marketplace_copy_preview(payload, db, user)


@app.post("/integrations/mercadolivre/copy/publish")
def mercadolivre_copy_publish(
    payload: PublishListingRequest,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    payload.source_platform = "mercado_livre"
    payload.target_platform = "mercado_livre"
    return marketplace_copy_publish(payload, db, user)


@app.post("/integrations/mercadolivre/disconnect")
def mercadolivre_disconnect(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    credential = get_ml_credential(db)

    if credential:
        db.delete(credential)
        db.commit()

    return {"message": "Conta Mercado Livre desconectada"}


@app.get("/integrations/mercadolivre/me")
def mercadolivre_me(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    me = ml_authenticated_get("/users/me", db)
    credential = get_ml_credential(db)

    if credential and me.get("nickname"):
        credential.nickname = str(me.get("nickname"))
        db.commit()

    return {
        "id": me.get("id"),
        "nickname": me.get("nickname"),
        "email": me.get("email"),
        "country_id": me.get("country_id"),
        "site_id": me.get("site_id"),
    }


@app.get("/integrations/shopee/status")
def shopee_status(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    return serialize_shopee_status(db)


@app.put("/integrations/shopee/config")
def shopee_config_update(
    payload: ShopeeConfigUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    update_shopee_config(db, payload)
    return serialize_shopee_status(db)


@app.get("/integrations/shopee/connect")
def shopee_connect(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    config = require_shopee_config(db)
    state = create_shopee_oauth_state(user.id, db)
    return {"authorization_url": build_shopee_authorization_url(config, state)}


@app.get("/shopee/callback")
def shopee_callback(
    code: str = "",
    shop_id: str = "",
    state: str = "",
    error: str = "",
    db: Session = Depends(get_db),
):
    config = get_shopee_config(db)
    return_url = config["frontend_return_url"] or "/"
    separator = "&" if "?" in return_url else "?"

    def redirect_with(status: str):
        return RedirectResponse(url=f"{return_url}{separator}shopee_status={urllib.parse.quote(status)}", status_code=302)

    if error:
        return redirect_with(f"erro:{error}")

    try:
        if state:
            consume_shopee_oauth_state(state, db)

        if not code:
            raise HTTPException(status_code=400, detail="Codigo de autorizacao ausente")

        token_payload = shopee_token_request(code, shop_id, db)
        credential = save_shopee_credential(token_payload, db)

        if shop_id and not credential.external_user_id:
            credential.external_user_id = str(shop_id)
            db.commit()

        try:
            shop_info = shopee_shop_info_request(db)
            credential.nickname = str(
                shop_info.get("shop_name")
                or shop_info.get("nickname")
                or shop_info.get("name")
                or credential.nickname
                or ""
            )
            credential.external_user_id = str(
                shop_info.get("shop_id")
                or shop_info.get("merchant_id")
                or credential.external_user_id
                or ""
            )
            db.commit()
        except HTTPException:
            shop_info = {}

        sync_shopee_store_integration(db, credential, shop_info)

        return redirect_with("conectado")
    except HTTPException as exc:
        return redirect_with(f"erro:{str(exc.detail)}")


@app.post("/integrations/shopee/disconnect")
def shopee_disconnect(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    credential = get_shopee_credential(db)

    if credential:
        db.delete(credential)
        db.commit()

    mark_shopee_store_integrations_disconnected(db)

    return {"message": "Conta Shopee desconectada"}


@app.get("/integrations/shopee/me")
def shopee_me(
    db: Session = Depends(get_db),
    user: models.User = Depends(require_user),
):
    shop_info = shopee_shop_info_request(db)
    credential = get_shopee_credential(db)

    if credential:
        credential.nickname = str(
            shop_info.get("shop_name")
            or shop_info.get("nickname")
            or shop_info.get("name")
            or credential.nickname
            or ""
        )
        credential.external_user_id = str(
            shop_info.get("shop_id")
            or shop_info.get("merchant_id")
            or credential.external_user_id
            or ""
        )
        db.commit()

        sync_shopee_store_integration(db, credential, shop_info)

    return {
        "shop_id": shop_info.get("shop_id") or shop_info.get("merchant_id"),
        "shop_name": shop_info.get("shop_name") or shop_info.get("nickname") or shop_info.get("name"),
        "nickname": (credential.nickname if credential else "") or shop_info.get("shop_name") or shop_info.get("nickname") or shop_info.get("name"),
    }


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
    api_only_prefixes = {"auth", "health", "fiscal", "integrations", "mercadolivre", "shopee"}
    first_path_part = full_path.split("/", 1)[0]

    if first_path_part in api_only_prefixes:
        raise HTTPException(status_code=404, detail="Endpoint nao encontrado")

    index_file = FRONTEND_DIST / "index.html"

    if index_file.exists():
        return FileResponse(index_file, headers=NO_CACHE_HEADERS)

    raise HTTPException(status_code=404, detail="Frontend nao publicado")
