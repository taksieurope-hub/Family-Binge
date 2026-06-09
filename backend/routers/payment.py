from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os
from datetime import datetime, timedelta
from routers.mongo_sync import get_mongo_db, sync_user

router = APIRouter(prefix="/payment", tags=["payment"])

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox")
BASE_URL = "https://api-m.sandbox.paypal.com" if PAYPAL_MODE == "sandbox" else "https://api-m.paypal.com"

PLAN_CONFIG = {
    "basic":    {"months": 1,  "maxTVs": 1, "maxPhones": 1},
    "standard": {"months": 3,  "maxTVs": 1, "maxPhones": 1},
    "premium":  {"months": 6,  "maxTVs": 2, "maxPhones": 2},
    "annual":   {"months": 12, "maxTVs": 5, "maxPhones": 5},
    "extra_device": {"maxTVs": 0, "maxPhones": 0},
}

async def get_paypal_access_token():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/v1/oauth2/token",
            headers={"Accept": "application/json", "Accept-Language": "en_US"},
            data={"grant_type": "client_credentials"},
            auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to get PayPal token")
        return response.json()["access_token"]

class CreateOrderRequest(BaseModel):
    plan: str
    amount: float
    currency: str = "USD"

class ActivatePlanRequest(BaseModel):
    user_id: str
    plan: str
    order_id: str

class AddDeviceRequest(BaseModel):
    user_id: str
    device_type: str
    order_id: str

class RegisterDeviceRequest(BaseModel):
    user_id: str
    device_id: str
    device_type: str
    device_name: str

@router.post("/create-order")
async def create_order(request: CreateOrderRequest):
    token = await get_paypal_access_token()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/v2/checkout/orders",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json={
                "intent": "CAPTURE",
                "purchase_units": [{
                    "amount": {"currency_code": request.currency, "value": str(request.amount)},
                    "description": f"Family Binge - {request.plan} Plan"
                }]
            }
        )
        if response.status_code != 201:
            raise HTTPException(status_code=400, detail="Failed to create PayPal order")
        return response.json()

@router.post("/capture-order/{order_id}")
async def capture_order(order_id: str):
    token = await get_paypal_access_token()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/v2/checkout/orders/{order_id}/capture",
            headers={"Authorization": f"Bearer {token}"}
        )
        if response.status_code != 201:
            raise HTTPException(status_code=400, detail="Payment capture failed")
        return response.json()

@router.post("/activate-plan")
async def activate_plan(request: ActivatePlanRequest):
    plan = PLAN_CONFIG.get(request.plan)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan")
    db = get_mongo_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database not available")
    now = datetime.utcnow()
    expires = now + timedelta(days=30 * plan["months"])
    db["users"].update_one(
        {"uid": request.user_id},
        {"$set": {
            "plan": request.plan,
            "subscriptionExpires": expires.isoformat(),
            "maxTVs": plan["maxTVs"],
            "maxPhones": plan["maxPhones"],
            "registeredDevices": [],
            "extraDevices": 0,
            "updatedAt": now.isoformat()
        }},
        upsert=True
    )
    sync_user({"uid": request.user_id, "plan": request.plan, "subscriptionExpires": expires.isoformat(), "maxTVs": plan["maxTVs"], "maxPhones": plan["maxPhones"]})
    return {"success": True, "expires": expires.isoformat(), "maxTVs": plan["maxTVs"], "maxPhones": plan["maxPhones"]}

@router.post("/add-extra-device")
async def add_extra_device(request: AddDeviceRequest):
    db = get_mongo_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database not available")
    user = db["users"].find_one({"uid": request.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if request.device_type == "tv":
        db["users"].update_one({"uid": request.user_id}, {"$inc": {"maxTVs": 1, "extraDevices": 1}})
    else:
        db["users"].update_one({"uid": request.user_id}, {"$inc": {"maxPhones": 1, "extraDevices": 1}})
    return {"success": True}

@router.post("/register-device")
async def register_device(request: RegisterDeviceRequest):
    db = get_mongo_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database not available")
    user = db["users"].find_one({"uid": request.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    registered = user.get("registeredDevices") or []
    max_tvs = int(user.get("maxTVs") or 1)
    max_phones = int(user.get("maxPhones") or 1)
    existing = [d for d in registered if isinstance(d, dict) and d.get("device_id") == request.device_id]
    if existing:
        return {"success": True, "status": "already_registered"}
    tvs = [d for d in registered if isinstance(d, dict) and d.get("device_type") == "tv"]
    phones = [d for d in registered if isinstance(d, dict) and d.get("device_type") == "phone"]
    if request.device_type == "tv" and len(tvs) >= max_tvs:
        return {"success": False, "status": "limit_reached", "device_type": "tv", "limit": max_tvs}
    if request.device_type == "phone" and len(phones) >= max_phones:
        return {"success": False, "status": "limit_reached", "device_type": "phone", "limit": max_phones}
    new_device = {
        "device_id": request.device_id,
        "device_type": request.device_type,
        "device_name": request.device_name,
        "registered_at": datetime.utcnow().isoformat()
    }
    registered.append(new_device)
    db["users"].update_one({"uid": request.user_id}, {"$set": {"registeredDevices": registered}})
    sync_user({"uid": request.user_id, "registeredDevices": registered})
    return {"success": True, "status": "registered"}

@router.delete("/remove-device/{user_id}/{device_id}")
async def remove_device(user_id: str, device_id: str):
    db = get_mongo_db()
    if not db:
        raise HTTPException(status_code=500, detail="Database not available")
    user = db["users"].find_one({"uid": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    registered = [d for d in user.get("registeredDevices", []) if d["device_id"] != device_id]
    db["users"].update_one({"uid": user_id}, {"$set": {"registeredDevices": registered}})
    return {"success": True}
