import React from 'react';
import { X, Download, Smartphone, Monitor, Tv } from 'lucide-react';
import { Button } from './ui/button';

const DownloadModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 rounded-3xl max-w-lg w-full p-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Download Family Binge</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Android */}
          <a href="#" className="flex items-center gap-4 p-4 bg-zinc-800 rounded-2xl hover:bg-zinc-700 transition-colors">
            <Smartphone className="w-8 h-8 text-green-400" />
            <div className="flex-1">
              <p className="text-white font-medium">Android Phone / Tablet / TV Box</p>
              <p className="text-gray-400 text-sm">Download APK (direct install)</p>
            </div>
            <Button className="bg-green-400 text-black">Download APK</Button>
          </a>

          {/* iOS */}
          <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-2xl hover:bg-zinc-700 transition-colors">
            <Smartphone className="w-8 h-8 text-blue-400" />
            <div className="flex-1">
              <p className="text-white font-medium">iPhone / iPad</p>
              <p className="text-gray-400 text-sm">Add to Home Screen (PWA)</p>
            </div>
            <Button variant="outline">Add to Home Screen</Button>
          </div>

          {/* Computer */}
          <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-2xl hover:bg-zinc-700 transition-colors">
            <Monitor className="w-8 h-8 text-white" />
            <div className="flex-1">
              <p className="text-white font-medium">Computer (Windows / Mac)</p>
              <p className="text-gray-400 text-sm">Install as PWA</p>
            </div>
            <Button variant="outline">Install App</Button>
          </div>

          {/* Smart TV */}
          <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-2xl hover:bg-zinc-700 transition-colors">
            <Tv className="w-8 h-8 text-purple-400" />
            <div className="flex-1">
              <p className="text-white font-medium">Smart TV / Android TV</p>
              <p className="text-gray-400 text-sm">Install via browser</p>
            </div>
            <Button variant="outline">Open in Browser</Button>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          Works on Android, iOS, Windows, Mac, Smart TVs and TV boxes
        </p>
      </div>
    </div>
  );
};

export default DownloadModal;
