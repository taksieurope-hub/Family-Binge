from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os

router = APIRouter(prefix="/payment", tags=["payment"])

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox")

BASE_URL = "https://api-m.sandbox.paypal.com" if PAYPAL_MODE == "sandbox" else "https://api-m.paypal.com"

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
    currency: str = "ZAR"   # change to ZAR if you want

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
