import React, { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { auth, db } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Smartphone, Tv, Plus, X } from "lucide-react";
import { addExtraDevice, getDeviceId, getDeviceType, getDeviceName } from "../services/deviceService";

const API = process.env.REACT_APP_API_URL || "https://family-binge-backend.onrender.com/api";

const DeviceBlockedModal = ({ deviceType, onUnblocked }) => {
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = async (data) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Capture payment
      const res = await fetch(${API}/payment/capture-order/, { method: "POST" });
      const capture = await res.json();

      if (capture.status === "COMPLETED") {
        // Add extra device to user account
        await addExtraDevice(user.uid, deviceType, data.orderID);

        // Now register this device
        const regRes = await fetch(${API}/payment/register-device, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.uid,
            device_id: getDeviceId(),
            device_type: getDeviceType(),
            device_name: getDeviceName()
          })
        });

        setPaid(true);
        setTimeout(() => onUnblocked(), 1500);
      }
    } catch (e) {
      console.error("Extra device payment error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 420, width: "100%", background: "#111", borderRadius: 20, padding: 36, textAlign: "center", border: "1px solid #222" }}>
        <div style={{ width: 64, height: 64, background: "#1a1a2e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          {deviceType === "tv" ? <Tv size={28} color="#a855f7" /> : <Smartphone size={28} color="#a855f7" />}
        </div>
        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Device Limit Reached</h2>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 6 }}>
          You have reached the maximum number of {deviceType === "tv" ? "TVs" : "phones"} allowed on your plan.
        </p>
        <p style={{ color: "#aaa", fontSize: 14, marginBottom: 28 }}>
          Add this {deviceType === "tv" ? "TV" : "phone"} for <strong style={{ color: "#fff" }}>R20/month</strong>.
        </p>

        {paid ? (
          <div style={{ color: "#22c55e", fontWeight: 600, fontSize: 16 }}>Device added! Loading...</div>
        ) : (
          <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID, currency: "USD" }}>
            <PayPalButtons
              style={{ layout: "vertical", shape: "rect", color: "gold" }}
              createOrder={async () => {
                const res = await fetch(${API}/payment/create-order, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ plan: "extra_device", amount: 1.10, currency: "USD" })
                });
                const order = await res.json();
                return order.id;
              }}
              onApprove={handleApprove}
            />
          </PayPalScriptProvider>
        )}

        <p style={{ color: "#555", fontSize: 11, marginTop: 16 }}>
          To remove a device, go to your Profile page and manage registered devices.
        </p>
      </div>
    </div>
  );
};

export default DeviceBlockedModal;
