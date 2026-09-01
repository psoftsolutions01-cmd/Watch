import React from 'react';
import { motion } from 'motion/react';
import {
  Watch,
  Battery,
  RefreshCw,
  Heart,
  Footprints,
  Flame,
  Clock,
  Bell,
  ShieldCheck,
  Zap,
  Volume2,
  ChevronRight,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { ConnectionState, WatchDeviceInfo, DailyActivity, AppNotification } from '../../types';
import { soundService } from '../../services/sound';

interface DashboardTabProps {
  connectionState: ConnectionState;
  device: WatchDeviceInfo;
  activity: DailyActivity;
  liveHeartRate: number;
  recentNotifications: AppNotification[];
  onTriggerSync: () => void;
  onConnectToggle: () => void;
  onSendTestNotification: () => void;
  onFindWatch: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  connectionState,
  device,
  activity,
  liveHeartRate,
  recentNotifications,
  onTriggerSync,
  onConnectToggle,
  onSendTestNotification,
  onFindWatch,
  onNavigateTab
}) => {
  const isConnected = connectionState === 'connected' || connectionState === 'syncing';
  const isSyncing = connectionState === 'syncing';

  return (
    <div id="tab-dashboard" className="space-y-4 pb-12">
      {/* Device Connection Hero Card */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700/80 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <Watch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{device.name}</h2>
                <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full border border-neutral-700">
                  Wear OS
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span className="font-medium capitalize text-neutral-300">
                    {connectionState === 'syncing' ? 'Syncing...' : connectionState}
                  </span>
                </span>
                <span>•</span>
                <span className="font-mono text-neutral-400">ANCS Active</span>
              </div>
            </div>
          </div>

          <button
            id="btn-dash-connect-toggle"
            onClick={() => {
              soundService.playHapticTick();
              onConnectToggle();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              isConnected
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        {/* Device Quick Telemetry Row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-800/80 text-xs">
          <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/60 flex flex-col">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">Battery</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Battery className="w-4 h-4 text-emerald-400" />
              <span className="font-mono font-bold text-white">{device.batteryLevel}%</span>
            </div>
          </div>
          <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/60 flex flex-col">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">Last Sync</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="font-mono font-medium text-white truncate">{device.lastSyncTime}</span>
            </div>
          </div>
          <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/60 flex flex-col">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">Apple Health</span>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-medium text-emerald-400">Synced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          id="btn-dash-sync"
          disabled={!isConnected || isSyncing}
          onClick={() => {
            soundService.playHapticTick();
            onTriggerSync();
          }}
          className="p-3 bg-neutral-900/80 hover:bg-neutral-850 active:scale-95 border border-neutral-800 rounded-xl flex flex-col items-start gap-1 transition-all disabled:opacity-50"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1">
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          </div>
          <span className="text-xs font-semibold text-white">Sync Health</span>
          <span className="text-[10px] text-neutral-500">Apple HealthKit</span>
        </button>

        <button
          id="btn-dash-test-notif"
          onClick={() => {
            soundService.playHapticTick();
            onSendTestNotification();
          }}
          className="p-3 bg-neutral-900/80 hover:bg-neutral-850 active:scale-95 border border-neutral-800 rounded-xl flex flex-col items-start gap-1 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-1">
            <Bell className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-white">Test Notification</span>
          <span className="text-[10px] text-neutral-500">Relay to Watch</span>
        </button>

        <button
          id="btn-dash-find-watch"
          onClick={() => {
            soundService.playHapticTick();
            onFindWatch();
          }}
          className="p-3 bg-neutral-900/80 hover:bg-neutral-850 active:scale-95 border border-neutral-800 rounded-xl flex flex-col items-start gap-1 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1">
            <Volume2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-white">Find My Watch</span>
          <span className="text-[10px] text-neutral-500">Ring & Vibrate</span>
        </button>

        <button
          id="btn-dash-setup-guide"
          onClick={() => {
            soundService.playHapticTick();
            onNavigateTab('wizard');
          }}
          className="p-3 bg-neutral-900/80 hover:bg-neutral-850 active:scale-95 border border-neutral-800 rounded-xl flex flex-col items-start gap-1 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center mb-1">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-white">Setup Wizard</span>
          <span className="text-[10px] text-neutral-500">Sideload APK guide</span>
        </button>
      </div>

      {/* Activity Overview Card (Apple Health style) */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-emerald-400" />
              Daily Activity Rings
            </h3>
            <span className="text-[11px] text-neutral-400">{activity.date}</span>
          </div>
          <button
            onClick={() => onNavigateTab('health')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-0.5"
          >
            Details <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          {/* Steps */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-neutral-400 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-emerald-400" /> Steps
              </span>
              <span className="font-mono text-white font-bold">
                {activity.steps.toLocaleString()} <span className="text-neutral-500 font-normal">/ {activity.stepGoal.toLocaleString()}</span>
              </span>
            </div>
            <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((activity.steps / activity.stepGoal) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Active Calories */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-neutral-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Active Calories
              </span>
              <span className="font-mono text-white font-bold">
                {activity.activeCalories} <span className="text-neutral-500 font-normal">/ {activity.caloriesGoal} kcal</span>
              </span>
            </div>
            <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((activity.activeCalories / activity.caloriesGoal) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Active Minutes */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-neutral-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Active Time
              </span>
              <span className="font-mono text-white font-bold">
                {activity.activeMinutes} <span className="text-neutral-500 font-normal">/ {activity.activeMinutesGoal} min</span>
              </span>
            </div>
            <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((activity.activeMinutes / activity.activeMinutesGoal) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Heart Rate & PPG Sensor Card */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
            <Heart className="w-6 h-6 animate-pulse fill-rose-500/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold font-mono text-white">{liveHeartRate}</span>
              <span className="text-xs text-neutral-400 font-medium">BPM</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">PPG Optical Sensor Connected</span>
          </div>
        </div>

        <button
          id="btn-dash-pulse-beep"
          onClick={() => {
            soundService.playHeartbeatPulse();
          }}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-semibold rounded-xl border border-neutral-700 active:scale-95 transition-all"
        >
          Check Pulse
        </button>
      </div>

      {/* Relayed Notifications Feed Preview */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-blue-400" />
            Recent Relayed Notifications
          </h3>
          <button
            onClick={() => onNavigateTab('notifications')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-0.5"
          >
            Manage <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentNotifications.slice(0, 3).map((n) => (
            <div
              key={n.id}
              className="bg-neutral-950/70 p-3 rounded-xl border border-neutral-800/80 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 font-bold text-xs">
                {n.appName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{n.title}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">{n.timestamp}</span>
                </div>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
