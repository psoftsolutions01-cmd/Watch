import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Watch,
  Smartphone,
  Sparkles,
  Wifi,
  RefreshCw,
  Bell,
  Heart,
  Sliders,
  Volume2,
  VolumeX,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  ConnectionState,
  WatchDeviceInfo,
  WatchFaceType,
  AppNotification,
  NotificationAppFilter,
  QuickReplyOption,
  DailyActivity,
  SleepStageData,
  BodyCompositionData,
  WorkoutSession,
  HealthSyncSummary
} from './types';
import { bluetoothService } from './services/bluetooth';
import { soundService } from './services/sound';
import {
  INITIAL_DAILY_ACTIVITY,
  INITIAL_SLEEP_DATA,
  INITIAL_BODY_COMP,
  INITIAL_WORKOUTS,
  INITIAL_SYNC_SUMMARY
} from './services/healthSync';
import { GalaxyWatchMirror } from './components/GalaxyWatchMirror';
import { IPhoneFrame } from './components/IPhoneFrame';
import { DynamicIslandAlert, DynamicIslandMessage } from './components/DynamicIslandAlert';
import { DashboardTab } from './components/tabs/DashboardTab';
import { NotificationsTab } from './components/tabs/NotificationsTab';
import { HealthSyncTab } from './components/tabs/HealthSyncTab';
import { DeviceTab } from './components/tabs/DeviceTab';
import { PairingWizardTab } from './components/tabs/PairingWizardTab';

export default function App() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('connected');
  const [device, setDevice] = useState<WatchDeviceInfo>(bluetoothService.getDeviceInfo());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedWatchFace, setSelectedWatchFace] = useState<WatchFaceType>('minimal_digital');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFindAlarmActive, setIsFindAlarmActive] = useState<boolean>(false);
  const [viewLayout, setViewLayout] = useState<'dual' | 'phone_only' | 'watch_only'>('dual');
  const [dynamicIslandMsg, setDynamicIslandMsg] = useState<DynamicIslandMessage | null>(null);

  // Health and Activity States
  const [activity, setActivity] = useState<DailyActivity>(INITIAL_DAILY_ACTIVITY);
  const [sleep, setSleep] = useState<SleepStageData>(INITIAL_SLEEP_DATA);
  const [bodyComp, setBodyComp] = useState<BodyCompositionData>(INITIAL_BODY_COMP);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>(INITIAL_WORKOUTS);
  const [syncSummary, setSyncSummary] = useState<HealthSyncSummary>(INITIAL_SYNC_SUMMARY);
  const [liveHeartRate, setLiveHeartRate] = useState<number>(74);

  // Active Notification on Watch AMOLED Screen
  const [activeWatchNotification, setActiveWatchNotification] = useState<AppNotification | null>(null);

  // Notification History
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-01',
      appName: 'iMessage',
      appBundleId: 'com.apple.MobileSMS',
      appIcon: 'message-square',
      title: 'Mom',
      body: 'Are you coming over for dinner this Sunday?',
      timestamp: '12m ago',
      read: true,
      relayedToWatch: true,
      category: 'message',
      priority: 'normal'
    },
    {
      id: 'notif-02',
      appName: 'WhatsApp',
      appBundleId: 'net.whatsapp.WhatsApp',
      appIcon: 'message-circle',
      title: 'Fitness Group',
      body: 'Weekend 10K run is scheduled for 7:30 AM at the park.',
      timestamp: '34m ago',
      read: true,
      relayedToWatch: true,
      category: 'message',
      priority: 'normal'
    },
    {
      id: 'notif-03',
      appName: 'Calendar',
      appBundleId: 'com.apple.mobilecal',
      appIcon: 'calendar',
      title: 'Sprint Planning',
      body: 'Starts in 15 minutes in Room 4B',
      timestamp: '1h ago',
      read: true,
      relayedToWatch: true,
      category: 'reminder',
      priority: 'normal'
    }
  ]);

  // Per-App Filters
  const [appFilters, setAppFilters] = useState<NotificationAppFilter[]>([
    { id: 'f-msg', appName: 'iMessage / SMS', bundleId: 'com.apple.MobileSMS', iconName: 'MessageSquare', color: '#2563eb', enabled: true, vibratePattern: 'default', wakeScreen: true },
    { id: 'f-wa', appName: 'WhatsApp', bundleId: 'net.whatsapp.WhatsApp', iconName: 'MessageCircle', color: '#16a34a', enabled: true, vibratePattern: 'double', wakeScreen: true },
    { id: 'f-phone', appName: 'Phone Calls', bundleId: 'com.apple.mobilephone', iconName: 'Phone', color: '#059669', enabled: true, vibratePattern: 'continuous', wakeScreen: true },
    { id: 'f-insta', appName: 'Instagram', bundleId: 'com.burbn.instagram', iconName: 'Instagram', color: '#e11d48', enabled: true, vibratePattern: 'default', wakeScreen: false },
    { id: 'f-slack', appName: 'Slack', bundleId: 'com.tinyspeck.chatlyio', iconName: 'Hash', color: '#7c3aed', enabled: true, vibratePattern: 'double', wakeScreen: true },
    { id: 'f-mail', appName: 'Apple Mail', bundleId: 'com.apple.mobilemail', iconName: 'Mail', color: '#0284c7', enabled: false, vibratePattern: 'silent', wakeScreen: false }
  ]);

  // Quick Replies list
  const [quickReplies, setQuickReplies] = useState<QuickReplyOption[]>([
    { id: 'qr-1', text: 'Yes, absolutely!', isDefault: true },
    { id: 'qr-2', text: 'On my way now 🏃‍♂️', isDefault: true },
    { id: 'qr-3', text: 'In a meeting, will call later.', isDefault: true },
    { id: 'qr-4', text: 'Sounds good to me 👍', isDefault: true },
    { id: 'qr-5', text: 'Can you send details?', isDefault: false }
  ]);

  // Subscribe to Bluetooth service changes
  useEffect(() => {
    const unsub = bluetoothService.subscribe((state, dev) => {
      setConnectionState(state);
      if (dev) setDevice(dev);
    });
    return unsub;
  }, []);

  // Heart rate pulse simulation
  useEffect(() => {
    const hrInterval = setInterval(() => {
      setLiveHeartRate((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = Math.max(64, Math.min(96, prev + delta));
        return next;
      });
    }, 4000);
    return () => clearInterval(hrInterval);
  }, []);

  const triggerDynamicIsland = (msg: DynamicIslandMessage) => {
    setDynamicIslandMsg(msg);
    setTimeout(() => {
      setDynamicIslandMsg((current) => (current?.id === msg.id ? null : current));
    }, 3500);
  };

  const handleConnectToggle = async () => {
    if (connectionState === 'connected') {
      bluetoothService.disconnect();
      triggerDynamicIsland({
        id: `island-${Date.now()}`,
        type: 'connected',
        title: 'Galaxy Watch 4 Disconnected',
        subtitle: 'BLE Bridge Inactive'
      });
    } else {
      const res = await bluetoothService.scanAndConnect();
      if (res.success) {
        soundService.playSyncSuccessChime();
        triggerDynamicIsland({
          id: `island-${Date.now()}`,
          type: 'connected',
          title: 'Galaxy Watch 4 Connected',
          subtitle: 'ANCS Relay & HealthKit Active'
        });
      }
    }
  };

  const handleTriggerSync = async () => {
    triggerDynamicIsland({
      id: `island-${Date.now()}`,
      type: 'sync',
      title: 'Syncing Apple Health',
      subtitle: 'Reading steps, heart rate & sleep'
    });

    const success = await bluetoothService.triggerSync();
    if (success) {
      soundService.playSyncSuccessChime();
      setActivity((prev) => ({
        ...prev,
        steps: prev.steps + Math.floor(Math.random() * 80) + 20,
        activeCalories: prev.activeCalories + 6
      }));
      triggerDynamicIsland({
        id: `island-${Date.now()}`,
        type: 'sync',
        title: 'HealthKit Sync Complete',
        subtitle: 'All metrics up to date'
      });
    }
  };

  const handleSendCustomNotification = (notifData: Partial<AppNotification>) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      appName: notifData.appName || 'iMessage',
      appBundleId: notifData.appBundleId || 'com.apple.MobileSMS',
      appIcon: notifData.appIcon || 'message-square',
      title: notifData.title || 'New Alert',
      body: notifData.body || 'Notification relayed via ANCS',
      timestamp: 'Just now',
      read: false,
      relayedToWatch: true,
      category: notifData.category || 'message',
      priority: notifData.priority || 'high'
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setActiveWatchNotification(newNotif);

    triggerDynamicIsland({
      id: `island-${Date.now()}`,
      type: newNotif.category === 'call' ? 'call' : 'notification',
      title: `${newNotif.appName}: ${newNotif.title}`,
      subtitle: 'Relayed to Galaxy Watch 4'
    });
  };

  const handleDismissWatchNotification = (id: string) => {
    setActiveWatchNotification(null);
  };

  const handleReplyWatchNotification = (id: string, replyText: string) => {
    triggerDynamicIsland({
      id: `island-${Date.now()}`,
      type: 'notification',
      title: 'Quick Reply Sent from Watch',
      subtitle: `"${replyText}"`
    });
  };

  const handleFindWatch = () => {
    setIsFindAlarmActive(true);
    soundService.playFindWatchAlarm();
    triggerDynamicIsland({
      id: `island-${Date.now()}`,
      type: 'connected',
      title: 'Find My Watch Active',
      subtitle: 'Ringing Galaxy Watch 4 speaker'
    });

    setTimeout(() => {
      setIsFindAlarmActive(false);
    }, 4500);
  };

  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundService.setMuted(next);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Application Navigation Bar */}
      <header className="border-b border-[#E5E5EA] bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-[#1C1C1E] tracking-tight">
                  Galaxy Watch 4 <span className="text-indigo-600">iOS Bridge</span>
                </h1>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200 font-bold uppercase tracking-wider">
                  v1.4 Pro
                </span>
              </div>
              <p className="text-xs text-[#8E8E93] hidden sm:block">
                BLE ANCS Notifications Relay & Apple HealthKit Live Synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle Button */}
            <button
              id="btn-app-sound-toggle"
              onClick={handleToggleSound}
              className="p-2.5 rounded-2xl bg-white hover:bg-[#F2F2F7] text-[#8E8E93] hover:text-[#1C1C1E] border border-[#E5E5EA] shadow-sm transition-colors"
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-green-600" />}
            </button>

            {/* Layout Mode Toggle (Desktop only) */}
            <div className="hidden lg:flex items-center bg-[#F2F2F7] p-1 rounded-2xl border border-[#E5E5EA] text-xs">
              <button
                onClick={() => setViewLayout('dual')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  viewLayout === 'dual' ? 'bg-white text-[#1C1C1E] shadow-sm' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                }`}
              >
                Dual Studio View
              </button>
              <button
                onClick={() => setViewLayout('phone_only')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  viewLayout === 'phone_only' ? 'bg-white text-[#1C1C1E] shadow-sm' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                }`}
              >
                iPhone View
              </button>
              <button
                onClick={() => setViewLayout('watch_only')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  viewLayout === 'watch_only' ? 'bg-white text-[#1C1C1E] shadow-sm' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                }`}
              >
                Watch AMOLED
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dynamic Island Floating Notification Bar */}
      <DynamicIslandAlert message={dynamicIslandMsg} />

      {/* Main Studio Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        {viewLayout === 'dual' && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center">
            {/* Left Column: iPhone 16 Pro Max Screen Frame */}
            <div className="lg:col-span-7 flex justify-center w-full">
              <IPhoneFrame
                activeTab={activeTab}
                onSelectTab={(tab) => setActiveTab(tab)}
                unreadCount={notifications.filter((n) => !n.read).length}
              >
                {activeTab === 'dashboard' && (
                  <DashboardTab
                    connectionState={connectionState}
                    device={device}
                    activity={activity}
                    liveHeartRate={liveHeartRate}
                    recentNotifications={notifications}
                    onTriggerSync={handleTriggerSync}
                    onConnectToggle={handleConnectToggle}
                    onSendTestNotification={() => setActiveTab('notifications')}
                    onFindWatch={handleFindWatch}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === 'notifications' && (
                  <NotificationsTab
                    notifications={notifications}
                    appFilters={appFilters}
                    quickReplies={quickReplies}
                    onToggleAppFilter={(id) =>
                      setAppFilters((prev) =>
                        prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
                      )
                    }
                    onChangeVibration={(id, pattern) =>
                      setAppFilters((prev) =>
                        prev.map((f) => (f.id === id ? { ...f, vibratePattern: pattern } : f))
                      )
                    }
                    onSendCustomNotification={handleSendCustomNotification}
                    onAddQuickReply={(text) =>
                      setQuickReplies((prev) => [...prev, { id: `qr-${Date.now()}`, text, isDefault: false }])
                    }
                    onDeleteQuickReply={(id) =>
                      setQuickReplies((prev) => prev.filter((qr) => qr.id !== id))
                    }
                    onClearHistory={() => setNotifications([])}
                  />
                )}

                {activeTab === 'health' && (
                  <HealthSyncTab
                    activity={activity}
                    sleep={sleep}
                    bodyComp={bodyComp}
                    workouts={workouts}
                    syncSummary={syncSummary}
                    liveHeartRate={liveHeartRate}
                    onTriggerSync={handleTriggerSync}
                    isSyncing={connectionState === 'syncing'}
                  />
                )}

                {activeTab === 'device' && (
                  <DeviceTab
                    device={device}
                    selectedWatchFace={selectedWatchFace}
                    onChangeWatchFace={(face) => setSelectedWatchFace(face)}
                    onFindWatch={handleFindWatch}
                    isFindAlarmActive={isFindAlarmActive}
                    onUpdateBattery={(lvl, chg) => bluetoothService.updateBattery(lvl, chg)}
                  />
                )}

                {activeTab === 'wizard' && (
                  <PairingWizardTab onConnectNow={handleConnectToggle} />
                )}
              </IPhoneFrame>
            </div>

            {/* Right Column: Galaxy Watch 4 Live AMOLED Mirror & Studio Deck */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
              <div className="text-center mb-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1C1C1E]">
                    Live Galaxy Watch 4 AMOLED Mirror
                  </span>
                </div>
                <p className="text-[11px] text-[#8E8E93] mt-0.5">
                  Interactive rotating touch bezel • Live ANCS notifications & PPG pulse
                </p>
              </div>

              {/* Watch Mirror Element */}
              <GalaxyWatchMirror
                device={device}
                activeNotification={activeWatchNotification}
                onDismissNotification={handleDismissWatchNotification}
                onReplyNotification={handleReplyWatchNotification}
                activity={activity}
                liveHeartRate={liveHeartRate}
                selectedWatchFace={selectedWatchFace}
                onChangeWatchFace={(face) => setSelectedWatchFace(face)}
                isFindAlarmActive={isFindAlarmActive}
              />

              {/* Quick Actions Deck under Watch */}
              <div className="w-full max-w-sm bg-white border border-[#E5E5EA] rounded-3xl p-5 shadow-sm space-y-3 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8E8E93] font-medium">Bluetooth Status</span>
                  <span className="text-green-600 font-bold capitalize font-mono">{connectionState}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8E8E93] font-medium">Active Watch Face</span>
                  <span className="text-indigo-600 font-bold capitalize">
                    {selectedWatchFace.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8E8E93] font-medium">ANCS Notification Sync</span>
                  <span className="text-green-600 font-bold">100% Real-Time</span>
                </div>

                <div className="pt-3 border-t border-[#E5E5EA] grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      handleSendCustomNotification({
                        appName: 'iMessage',
                        title: 'Emma Watson',
                        body: 'Hey! Are you free for a call?',
                        category: 'message'
                      });
                    }}
                    className="py-2.5 px-3 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-[#D1D1D6]"
                  >
                    <Bell className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Trigger Alert</span>
                  </button>

                  <button
                    onClick={() => {
                      soundService.playFindWatchAlarm();
                      handleFindWatch();
                    }}
                    className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-amber-200"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ring Watch</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewLayout === 'phone_only' && (
          <div className="w-full flex justify-center">
            <IPhoneFrame
              activeTab={activeTab}
              onSelectTab={(tab) => setActiveTab(tab)}
              unreadCount={notifications.filter((n) => !n.read).length}
            >
              {activeTab === 'dashboard' && (
                <DashboardTab
                  connectionState={connectionState}
                  device={device}
                  activity={activity}
                  liveHeartRate={liveHeartRate}
                  recentNotifications={notifications}
                  onTriggerSync={handleTriggerSync}
                  onConnectToggle={handleConnectToggle}
                  onSendTestNotification={() => setActiveTab('notifications')}
                  onFindWatch={handleFindWatch}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationsTab
                  notifications={notifications}
                  appFilters={appFilters}
                  quickReplies={quickReplies}
                  onToggleAppFilter={(id) =>
                    setAppFilters((prev) =>
                      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
                    )
                  }
                  onChangeVibration={(id, pattern) =>
                    setAppFilters((prev) =>
                      prev.map((f) => (f.id === id ? { ...f, vibratePattern: pattern } : f))
                    )
                  }
                  onSendCustomNotification={handleSendCustomNotification}
                  onAddQuickReply={(text) =>
                    setQuickReplies((prev) => [...prev, { id: `qr-${Date.now()}`, text, isDefault: false }])
                  }
                  onDeleteQuickReply={(id) =>
                    setQuickReplies((prev) => prev.filter((qr) => qr.id !== id))
                  }
                  onClearHistory={() => setNotifications([])}
                />
              )}

              {activeTab === 'health' && (
                <HealthSyncTab
                  activity={activity}
                  sleep={sleep}
                  bodyComp={bodyComp}
                  workouts={workouts}
                  syncSummary={syncSummary}
                  liveHeartRate={liveHeartRate}
                  onTriggerSync={handleTriggerSync}
                  isSyncing={connectionState === 'syncing'}
                />
              )}

              {activeTab === 'device' && (
                <DeviceTab
                  device={device}
                  selectedWatchFace={selectedWatchFace}
                  onChangeWatchFace={(face) => setSelectedWatchFace(face)}
                  onFindWatch={handleFindWatch}
                  isFindAlarmActive={isFindAlarmActive}
                  onUpdateBattery={(lvl, chg) => bluetoothService.updateBattery(lvl, chg)}
                />
              )}

              {activeTab === 'wizard' && (
                <PairingWizardTab onConnectNow={handleConnectToggle} />
              )}
            </IPhoneFrame>
          </div>
        )}

        {viewLayout === 'watch_only' && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <GalaxyWatchMirror
              device={device}
              activeNotification={activeWatchNotification}
              onDismissNotification={handleDismissWatchNotification}
              onReplyNotification={handleReplyWatchNotification}
              activity={activity}
              liveHeartRate={liveHeartRate}
              selectedWatchFace={selectedWatchFace}
              onChangeWatchFace={(face) => setSelectedWatchFace(face)}
              isFindAlarmActive={isFindAlarmActive}
            />

            <div className="flex gap-2.5">
              <button
                onClick={() =>
                  handleSendCustomNotification({
                    appName: 'WhatsApp',
                    title: 'Alex',
                    body: 'Are you ready for the presentation?',
                    category: 'message'
                  })
                }
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-200 active:scale-95"
              >
                Send Test WhatsApp
              </button>
              <button
                onClick={handleFindWatch}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-amber-200 active:scale-95"
              >
                Ring Watch
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="border-t border-[#E5E5EA] bg-white py-3.5 text-center text-xs text-[#8E8E93] select-none">
        <p>Galaxy Watch 4 iOS Bridge • Apple Notification Center Service (ANCS) & HealthKit Bridge</p>
      </footer>
    </div>
  );
}
