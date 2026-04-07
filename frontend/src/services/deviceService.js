const API = process.env.REACT_APP_API_URL || "https://family-binge-backend.onrender.com/api";

export const getDeviceId = () => {
  try {
    let id = localStorage.getItem("fb_device_id");
    if (!id) {
      // Use stable fingerprint so TV doesn't re-register on every session
      const ua = navigator.userAgent;
      const screen = window.screen.width + "x" + window.screen.height;
      const stable = btoa(ua + screen).replace(/[^a-z0-9]/gi, '').substr(0, 16);
      id = "dev_" + stable + "_" + Date.now().toString(36);
      localStorage.setItem("fb_device_id", id);
    }
    return id;
  } catch (e) {
    // localStorage blocked (e.g. some TV browsers) - use fingerprint directly
    const ua = navigator.userAgent;
    const screen = window.screen.width + "x" + window.screen.height;
    return "dev_" + btoa(ua + screen).replace(/[^a-z0-9]/gi, '').substr(0, 20);
  }
};

export const getDeviceType = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isTv = /smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast|viera|nettv|roku|opera tv|silk|kodi|firetv|fire tv|android tv|webos|tizen/.test(ua)
    || window.screen.width >= 1920 && !("ontouchstart" in window);
  return isTv ? "tv" : "phone";
};

export const getDeviceName = () => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "Android Device";
  if (/iphone/i.test(ua)) return "iPhone";
  if (/ipad/i.test(ua)) return "iPad";
  if (/windows/i.test(ua)) return "Windows PC";
  if (/mac/i.test(ua)) return "Mac";
  return "Unknown Device";
};

export const registerDevice = async (userId) => {
  const device_id = getDeviceId();
  const device_type = getDeviceType();
  const device_name = getDeviceName();
  try {
    const res = await fetch(`${API}/payment/register-device`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, device_id, device_type, device_name })
    });
    return await res.json();
  } catch (e) {
    console.error("Device registration error:", e);
    return { success: false, status: "error" };
  }
};

export const removeDevice = async (userId, deviceId) => {
  try {
    const res = await fetch(`${API}/payment/remove-device/${userId}/${deviceId}`, { method: "DELETE" });
    return await res.json();
  } catch (e) {
    return { success: false };
  }
};

export const addExtraDevice = async (userId, deviceType, orderId) => {
  try {
    const res = await fetch(`${API}/payment/add-extra-device`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, device_type: deviceType, order_id: orderId })
    });
    return await res.json();
  } catch (e) {
    return { success: false };
  }
};
