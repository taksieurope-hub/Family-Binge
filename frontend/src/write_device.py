import pathlib

path = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\services\deviceService.js')

content = '''const API = process.env.REACT_APP_API_URL || "https://family-binge-backend.onrender.com/api";

// Generate a stable unique device ID stored in localStorage
export const getDeviceId = () => {
  let id = localStorage.getItem("fb_device_id");
  if (!id) {
    id = "dev_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
    localStorage.setItem("fb_device_id", id);
  }
  return id;
};

// Detect if running on TV or phone
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
    const res = await fetch(${API}/payment/register-device, {
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
    const res = await fetch(${API}/payment/remove-device//, { method: "DELETE" });
    return await res.json();
  } catch (e) {
    return { success: false };
  }
};

export const addExtraDevice = async (userId, deviceType, orderId) => {
  try {
    const res = await fetch(${API}/payment/add-extra-device, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, device_type: deviceType, order_id: orderId })
    });
    return await res.json();
  } catch (e) {
    return { success: false };
  }
};
''';

path.write_text(content, encoding='utf-8')
print('Done! deviceService.js written.')
