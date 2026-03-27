import pathlib

path = pathlib.Path(r'C:\Users\edahl\Desktop\Family Binge\frontend\src\MainApp.jsx')
c = path.read_text(encoding='utf-8')

# Add DeviceBlockedModal import
old = 'import { registerDevice, getDeviceId } from "./services/deviceService";'
new = '''import { registerDevice, getDeviceId } from "./services/deviceService";
import DeviceBlockedModal from "./components/DeviceBlockedModal";'''

# Add modal to JSX before closing div
old_close = '      {/* Paywall Modal */}\n      {showPaywall && ('
new_close = '''      {/* Device Blocked Modal */}
      {deviceBlocked && (
        <DeviceBlockedModal
          deviceType={deviceType}
          onUnblocked={() => setDeviceBlocked(false)}
        />
      )}

      {/* Paywall Modal */}
      {showPaywall && ('''

c = c.replace(old, new)
c = c.replace(old_close, new_close)
path.write_text(c, encoding='utf-8')
print('Done! DeviceBlockedModal added to MainApp.')
