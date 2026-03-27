import pathlib

path = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\MainApp.jsx')
c = path.read_text(encoding='utf-8')

# Add import
old_import = 'import { Crown, AlertTriangle, X } from "lucide-react";'
new_import = '''import { Crown, AlertTriangle, X } from "lucide-react";
import { registerDevice, getDeviceId } from "./services/deviceService";'''

# Add device state
old_state = '  const [accessStatus, setAccessStatus] = useState(\'loading\');'
new_state = '''  const [accessStatus, setAccessStatus] = useState(\'loading\');
  const [deviceBlocked, setDeviceBlocked] = useState(false);
  const [deviceType, setDeviceType] = useState(null);'''

# Add device registration after setAccessStatus calls
old_full = "const hasPaidSub = data.plan && data.plan !== 'free_trial' && subExpires && subExpires > now;\nconst isFreeAccess = data.role === 'admin' || data.role === 'family';\n\nif (isFreeAccess || hasPaidSub) {\n  setAccessStatus('full');\n} else if (trialEnds > now) {\n  setAccessStatus('trial');\n} else {\n  setAccessStatus('expired');\n}"

new_full = """const hasPaidSub = data.plan && data.plan !== 'free_trial' && subExpires && subExpires > now;
const isFreeAccess = data.role === 'admin' || data.role === 'family';

if (isFreeAccess || hasPaidSub) {
  setAccessStatus('full');
} else if (trialEnds > now) {
  setAccessStatus('trial');
} else {
  setAccessStatus('expired');
}

// Register device and check limit
if (isFreeAccess || hasPaidSub || trialEnds > now) {
  const result = await registerDevice(user.uid);
  if (result.status === 'limit_reached') {
    setDeviceBlocked(true);
    setDeviceType(result.device_type);
  }
}"""

c = c.replace(old_import, new_import)
c = c.replace(old_state, new_state)
c = c.replace(old_full, new_full)
path.write_text(c, encoding='utf-8')
print('Done! MainApp patched with device registration.')
