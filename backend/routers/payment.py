from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os
from firebase_admin import firestore
import firebase_admin
from firebase_admin import credentials

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
    if not firebase_admin._apps:
        raise HTTPException(status_code=500, detail="Firebase not initialized")
    
    plan = PLAN_CONFIG.get(request.plan)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    expires = now + timedelta(days=30 * plan["months"])
    
    db = firestore.client()
    db.collection("users").document(request.user_id).update({
        "plan": request.plan,
        "subscriptionExpires": expires,
        "maxTVs": plan["maxTVs"],
        "maxPhones": plan["maxPhones"],
        "registeredDevices": [],
        "extraDevices": 0,
        "updatedAt": now
    })

    # Referral reward: give referrer 5 extra days if this user was referred
    try:
        user_doc = db.collection("users").document(request.user_id).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            referred_by = user_data.get("referredBy")
            if referred_by:
                referrer_ref = db.collection("users").document(referred_by)
                referrer_doc = referrer_ref.get()
                if referrer_doc.exists:
                    referrer_data = referrer_doc.to_dict()
                    # Get referrer current expiry or now
                    current_expires = referrer_data.get("subscriptionExpires")
                    if current_expires and hasattr(current_expires, "replace"):
                        base = current_expires
                    else:
                        base = now
                    referrer_ref.update({
                        "referralCredit": firestore.Increment(5),
                        "referralCount": firestore.Increment(1),
                    })
                    # Mark so we dont double-reward
                    db.collection("users").document(request.user_id).update({"referralRewarded": True})
    except Exception as e:
        print(f"Referral reward error: {e}")

    return {"success": True, "expires": expires.isoformat(), "maxTVs": plan["maxTVs"], "maxPhones": plan["maxPhones"]}

@router.post("/add-extra-device")
async def add_extra_device(request: AddDeviceRequest):
    if not firebase_admin._apps:
        raise HTTPException(status_code=500, detail="Firebase not initialized")
    
    db = firestore.client()
    user_ref = db.collection("users").document(request.user_id)
    user = user_ref.get()
    if not user.exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    data = user.to_dict()
    if request.device_type == "tv":
        user_ref.update({"maxTVs": firestore.Increment(1), "extraDevices": firestore.Increment(1)})
    else:
        user_ref.update({"maxPhones": firestore.Increment(1), "extraDevices": firestore.Increment(1)})
    
    return {"success": True}

@router.post("/register-device")
async def register_device(request: RegisterDeviceRequest):
    import traceback
    try:
    if not firebase_admin._apps:
        raise HTTPException(status_code=500, detail="Firebase not initialized")
    
    db = firestore.client()
    user_ref = db.collection("users").document(request.user_id)
    user = user_ref.get()
    if not user.exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    data = user.to_dict()
    registered = data.get("registeredDevices") or []
    if not isinstance(registered, list):
        registered = []
    max_tvs = int(data.get("maxTVs") or 1)
    max_phones = int(data.get("maxPhones") or 1)
    
    # Check if device already registered
    existing = [d for d in registered if isinstance(d, dict) and d.get("device_id") == request.device_id]
    if existing:
        return {"success": True, "status": "already_registered"}
    
    # Count current devices by type
    tvs = [d for d in registered if isinstance(d, dict) and d.get("device_type") == "tv"]
    phones = [d for d in registered if isinstance(d, dict) and d.get("device_type") == "phone"]
    
    if request.device_type == "tv" and len(tvs) >= max_tvs:
        return {"success": False, "status": "limit_reached", "device_type": "tv", "limit": max_tvs}
    if request.device_type == "phone" and len(phones) >= max_phones:
        return {"success": False, "status": "limit_reached", "device_type": "phone", "limit": max_phones}
    
    # Register device
    from datetime import datetime
    new_device = {
        "device_id": request.device_id,
        "device_type": request.device_type,
        "device_name": request.device_name,
        "registered_at": datetime.utcnow().isoformat()
    }
    registered.append(new_device)
    user_ref.update({"registeredDevices": registered})
    return {"success": True, "status": "registered"}
    except Exception as e:
        print("REGISTER DEVICE ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/remove-device/{user_id}/{device_id}")
async def remove_device(user_id: str, device_id: str):
    if not firebase_admin._apps:
        raise HTTPException(status_code=500, detail="Firebase not initialized")
    
    db = firestore.client()
    user_ref = db.collection("users").document(user_id)
    user = user_ref.get()
    if not user.exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    data = user.to_dict()
    registered = [d for d in data.get("registeredDevices", []) if d["device_id"] != device_id]
    user_ref.update({"registeredDevices": registered})
    return {"success": True}
