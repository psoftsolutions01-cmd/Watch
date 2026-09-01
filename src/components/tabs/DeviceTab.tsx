import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Watch,
  Battery,
  HardDrive,
  Cpu,
  Volume2,
  Sparkles,
  Sliders,
  Moon,
  Eye,
  RotateCw,
  Droplets,
  Shield,
  CheckCircle2,
  RefreshCw,
  Smartphone
} from 'lucide-react';
import { WatchDeviceInfo, WatchFaceType } from '../../types';
import { soundService } from '../../services/sound';

interface DeviceTabProps {
  device: WatchDeviceInfo;
  selectedWatchFace: WatchFaceType;
  onChangeWatchFace: (face: WatchFaceType) => void;
  onFindWatch: () => void;
  isFindAlarmActive: boolean;
  onUpdateBattery: (level: number, charging: boolean) => void;
}

export const DeviceTab: React.FC<DeviceTabProps> = ({
  device,
  selectedWatchFace,
  onChangeWatchFace,
  onFindWatch,
  isFindAlarmActive,
  onUpdateBattery
}) => {
  const [aodEnabled, setAodEnabled] = useState<boolean>(true);
  const [raiseToWake, setRaiseToWake] = useState<boolean>(true);
  const [touchBezelEnabled, setTouchBezelEnabled] = useState<boolean>(true);
  const [vibrationStrength, setVibrationStrength] = useState<'high' | 'medium' | 'low'>('high');
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  const watchFaces: { id: WatchFaceType; name: string; description: string }[] = [
    { id: 'minimal_digital', name: 'Minimal Digital', description: 'Clean typography with date, steps, heart rate & calories' },
    { id: 'sport_rings', name: 'Sport Activity Rings', description: 'Triple concentric rings for active calories, steps & workout time' },
    { id: 'classic_chrono', name: 'Classic Chronograph', description: 'Analog dial with second hand, sub-dials & date window' },
    { id: 'health_dash', name: 'Health Dashboard', description: 'Dense multi-metric grid showing pulse, steps, kcal & SpO2' }
  ];

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setUpdateStatus(null);
    soundService.playHapticTick();

    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateStatus('Your Galaxy Watch 4 is up to date (Wear OS 4.0 One UI Watch 5.0).');
      soundService.playSyncSuccessChime();
    }, 1500);
  };

  return (
    <div id="tab-device-settings" className="space-y-4 pb-12">
      {/* Device Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E5EA] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Watch className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C1C1E]">{device.name}</h3>
              <span className="text-xs text-[#8E8E93] font-mono">SN: {device.serialNumber}</span>
            </div>
          </div>

          <button
            id="btn-device-find-watch"
            onClick={() => {
              soundService.playFindWatchAlarm();
              onFindWatch();
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-md ${
              isFindAlarmActive
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isFindAlarmActive ? 'Ringing...' : 'Find Watch'}</span>
          </button>
        </div>

        {/* Storage, RAM & Battery Diagnostics Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-xs">
          <div className="bg-[#F2F2F7] p-3.5 rounded-2xl border border-[#E5E5EA]">
            <div className="flex items-center gap-1 text-green-700 mb-1">
              <Battery className="w-3.5 h-3.5" />
              <span className="text-[10px] text-[#8E8E93] font-bold uppercase">Battery</span>
            </div>
            <span className="text-base font-bold font-mono text-[#1C1C1E]">{device.batteryLevel}%</span>
            <span className="text-[10px] text-[#8E8E93] font-medium block">~28h remaining</span>
          </div>

          <div className="bg-[#F2F2F7] p-3.5 rounded-2xl border border-[#E5E5EA]">
            <div className="flex items-center gap-1 text-indigo-600 mb-1">
              <HardDrive className="w-3.5 h-3.5" />
              <span className="text-[10px] text-[#8E8E93] font-bold uppercase">Storage</span>
            </div>
            <span className="text-base font-bold font-mono text-[#1C1C1E]">9.6 <span className="text-xs font-normal text-[#8E8E93]">GB Free</span></span>
            <span className="text-[10px] text-[#8E8E93] font-medium block">16.0 GB Total</span>
          </div>

          <div className="bg-[#F2F2F7] p-3.5 rounded-2xl border border-[#E5E5EA]">
            <div className="flex items-center gap-1 text-purple-600 mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span className="text-[10px] text-[#8E8E93] font-bold uppercase">RAM</span>
            </div>
            <span className="text-base font-bold font-mono text-[#1C1C1E]">0.9 <span className="text-xs font-normal text-[#8E8E93]">/ 1.5 GB</span></span>
            <span className="text-[10px] text-[#8E8E93] font-medium block">Exynos W920</span>
          </div>
        </div>
      </div>

      {/* Watch Face Customizer */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E5EA] shadow-sm">
        <h3 className="text-sm font-bold text-[#1C1C1E] flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Watch Face Gallery
        </h3>
        <p className="text-xs text-[#8E8E93] mb-4">
          Select a watch face to render in real-time on your Galaxy Watch 4 AMOLED display.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {watchFaces.map((wf) => (
            <div
              key={wf.id}
              onClick={() => {
                soundService.playHapticTick();
                onChangeWatchFace(wf.id);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedWatchFace === wf.id
                  ? 'bg-indigo-50 border-indigo-600 shadow-sm ring-1 ring-indigo-600'
                  : 'bg-[#F2F2F7] border-[#E5E5EA] hover:border-[#D1D1D6]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#1C1C1E]">{wf.name}</span>
                {selectedWatchFace === wf.id && (
                  <span className="text-[10px] bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-bold uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8E8E93] leading-relaxed">{wf.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Display & Gesture Controls */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E5EA] shadow-sm">
        <h3 className="text-sm font-bold text-[#1C1C1E] flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4 text-indigo-600" />
          Display & Bezel Settings
        </h3>

        <div className="divide-y divide-[#E5E5EA]">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-[#8E8E93]" />
              <div>
                <span className="text-xs font-bold text-[#1C1C1E] block">Always On Display (AOD)</span>
                <span className="text-[10px] text-[#8E8E93]">Keep watch face dimmed when wrist is down</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundService.playHapticTick();
                setAodEnabled(!aodEnabled);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                aodEnabled ? 'bg-green-500' : 'bg-[#D1D1D6]'
              }`}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white shadow-sm"
                animate={{ x: aodEnabled ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <RotateCw className="w-4 h-4 text-[#8E8E93]" />
              <div>
                <span className="text-xs font-bold text-[#1C1C1E] block">Touch Bezel Emulation</span>
                <span className="text-[10px] text-[#8E8E93]">Digital bezel rotation with haptic clicks</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundService.playHapticTick();
                setTouchBezelEnabled(!touchBezelEnabled);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                touchBezelEnabled ? 'bg-green-500' : 'bg-[#D1D1D6]'
              }`}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white shadow-sm"
                animate={{ x: touchBezelEnabled ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#8E8E93]" />
              <div>
                <span className="text-xs font-bold text-[#1C1C1E] block">Raise Wrist to Wake</span>
                <span className="text-[10px] text-[#8E8E93]">Turn on AMOLED screen on movement</span>
              </div>
            </div>
            <button
              onClick={() => {
                soundService.playHapticTick();
                setRaiseToWake(!raiseToWake);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                raiseToWake ? 'bg-green-500' : 'bg-[#D1D1D6]'
              }`}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white shadow-sm"
                animate={{ x: raiseToWake ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Firmware & Wear OS Info */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E5EA] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#1C1C1E] flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            Software & Firmware Info
          </h3>
          <button
            id="btn-check-firmware-update"
            onClick={handleCheckUpdate}
            disabled={isCheckingUpdate}
            className="px-4 py-2 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] text-xs font-bold rounded-2xl border border-[#D1D1D6] flex items-center gap-1 active:scale-95 transition-all"
          >
            <RefreshCw className={`w-3 h-3 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
            <span>{isCheckingUpdate ? 'Checking...' : 'Check Updates'}</span>
          </button>
        </div>

        {updateStatus && (
          <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>{updateStatus}</span>
          </div>
        )}

        <div className="space-y-1.5 text-xs text-[#8E8E93] font-mono">
          <div className="flex justify-between py-1.5 border-b border-[#E5E5EA]">
            <span className="text-[#8E8E93]">Operating System</span>
            <span className="text-[#1C1C1E] font-medium">{device.wearOsVersion}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[#E5E5EA]">
            <span className="text-[#8E8E93]">User Interface</span>
            <span className="text-[#1C1C1E] font-medium">{device.oneUiWatchVersion}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[#E5E5EA]">
            <span className="text-[#8E8E93]">Build Number</span>
            <span className="text-[#1C1C1E] font-medium">{device.firmwareVersion}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[#8E8E93]">Bluetooth Low Energy MAC</span>
            <span className="text-[#1C1C1E] font-medium">{device.bluetoothAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
