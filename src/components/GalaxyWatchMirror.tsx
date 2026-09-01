import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Flame,
  Footprints,
  Clock,
  Battery,
  Wifi,
  Volume2,
  Bell,
  MessageSquare,
  Phone,
  Check,
  X,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Moon,
  Sparkles,
  Play,
  Pause
} from 'lucide-react';
import { WatchDeviceInfo, WatchFaceType, AppNotification, DailyActivity } from '../types';
import { soundService } from '../services/sound';

interface GalaxyWatchMirrorProps {
  device: WatchDeviceInfo;
  activeNotification: AppNotification | null;
  onDismissNotification: (id: string) => void;
  onReplyNotification?: (id: string, text: string) => void;
  activity: DailyActivity;
  liveHeartRate: number;
  selectedWatchFace: WatchFaceType;
  onChangeWatchFace?: (face: WatchFaceType) => void;
  isFindAlarmActive?: boolean;
}

export const GalaxyWatchMirror: React.FC<GalaxyWatchMirrorProps> = ({
  device,
  activeNotification,
  onDismissNotification,
  onReplyNotification,
  activity,
  liveHeartRate,
  selectedWatchFace,
  onChangeWatchFace,
  isFindAlarmActive
}) => {
  const [currentTileIndex, setCurrentTileIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(true);
  const [musicTrack, setMusicTrack] = useState<{ title: string; artist: string }>({
    title: 'Cruel Summer',
    artist: 'Taylor Swift (iPhone Sync)'
  });

  const tiles = ['face', 'notifications', 'activity', 'heartrate', 'music', 'quicksettings'];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRotateTile = (direction: 'next' | 'prev') => {
    soundService.playHapticTick();
    if (direction === 'next') {
      setCurrentTileIndex((prev) => (prev + 1) % tiles.length);
    } else {
      setCurrentTileIndex((prev) => (prev - 1 + tiles.length) % tiles.length);
    }
  };

  const formattedHours = currentTime.getHours().toString().padStart(2, '0');
  const formattedMinutes = currentTime.getMinutes().toString().padStart(2, '0');
  const formattedSeconds = currentTime.getSeconds().toString().padStart(2, '0');
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Analog watch face hands calculation
  const hoursDegrees = (currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5;
  const minutesDegrees = currentTime.getMinutes() * 6 + currentTime.getSeconds() * 0.1;
  const secondsDegrees = currentTime.getSeconds() * 6;

  return (
    <div id="galaxy-watch-mirror-container" className="flex flex-col items-center justify-center relative select-none">
      {/* Outer Watch Casing & Bezel Accent */}
      <div className="relative w-80 h-80 sm:w-88 sm:h-88 rounded-full bg-neutral-900 border-4 border-neutral-800 p-2 shadow-2xl shadow-neutral-950/80 flex items-center justify-center">
        
        {/* Physical Button Top (Home) */}
        <button
          id="btn-watch-home"
          onClick={() => {
            soundService.playHapticTick();
            setCurrentTileIndex(0);
          }}
          title="Watch Home Button"
          className="absolute -right-3.5 top-18 w-3 h-10 bg-gradient-to-l from-neutral-600 to-neutral-800 rounded-r-md border-y border-r border-neutral-700 active:translate-x-0.5 transition-transform hover:brightness-125 shadow-md flex items-center justify-center"
        >
          <span className="w-1 h-3 rounded-full bg-rose-500/80"></span>
        </button>

        {/* Physical Button Bottom (Back) */}
        <button
          id="btn-watch-back"
          onClick={() => {
            soundService.playHapticTick();
            handleRotateTile('prev');
          }}
          title="Watch Back Button"
          className="absolute -right-3.5 bottom-18 w-3 h-10 bg-gradient-to-l from-neutral-600 to-neutral-800 rounded-r-md border-y border-r border-neutral-700 active:translate-x-0.5 transition-transform hover:brightness-125 shadow-md"
        />

        {/* Top/Bottom Watch Band Mounts */}
        <div className="absolute -top-4 w-32 h-4 bg-neutral-800 rounded-t-lg border-t border-neutral-700/60 -z-10 shadow-inner" />
        <div className="absolute -bottom-4 w-32 h-4 bg-neutral-800 rounded-b-lg border-b border-neutral-700/60 -z-10 shadow-inner" />

        {/* Rotating Touch Bezel Ring Indicator */}
        <div className="relative w-full h-full rounded-full bg-black border border-neutral-800/80 flex items-center justify-center overflow-hidden">
          
          {/* Bezel Tick Marks */}
          <div className="absolute inset-1 rounded-full border border-neutral-800/40 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1.5 w-0.5 h-1.5 bg-neutral-700 -translate-x-1/2 origin-[center_145px]"
                style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
              />
            ))}
          </div>

          {/* AMOLED Display (Circular Screen) */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-black overflow-hidden flex items-center justify-center text-white">
            
            {/* Status Bar Indicators (Top of Watch) */}
            <div className="absolute top-3 left-0 right-0 z-20 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
              <span className="flex items-center gap-0.5 text-blue-400">
                <Wifi className="w-3 h-3" />
                <span className="text-[10px]">BLE</span>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center gap-0.5 text-emerald-400">
                <Battery className="w-3 h-3" />
                <span className="text-[10px] font-mono">{device.batteryLevel}%</span>
              </span>
            </div>

            {/* Tile Content Switcher */}
            <AnimatePresence mode="wait">
              {/* TILE 0: WATCH FACE */}
              {tiles[currentTileIndex] === 'face' && (
                <motion.div
                  key="tile-face"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex flex-col items-center justify-center relative p-6 cursor-pointer"
                  onClick={() => {
                    const faces: WatchFaceType[] = ['minimal_digital', 'sport_rings', 'classic_chrono', 'health_dash'];
                    const next = faces[(faces.indexOf(selectedWatchFace) + 1) % faces.length];
                    onChangeWatchFace?.(next);
                    soundService.playHapticTick();
                  }}
                  title="Click to cycle Watch Face style"
                >
                  {selectedWatchFace === 'minimal_digital' && (
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1">
                        {dateStr}
                      </span>
                      <div className="text-5xl sm:text-6xl font-extrabold tracking-tight font-mono text-white flex items-baseline">
                        <span>{formattedHours}</span>
                        <span className="text-blue-500 animate-pulse">:</span>
                        <span>{formattedMinutes}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-xs">
                        <div className="flex items-center gap-1 text-rose-400 font-mono">
                          <Heart className="w-3.5 h-3.5 animate-pulse fill-rose-500/20" />
                          <span>{liveHeartRate}</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400 font-mono">
                          <Footprints className="w-3.5 h-3.5" />
                          <span>{activity.steps.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 font-mono">
                          <Flame className="w-3.5 h-3.5" />
                          <span>{activity.activeCalories}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-500 mt-3">Tap face to customize</span>
                    </div>
                  )}

                  {selectedWatchFace === 'sport_rings' && (
                    <div className="relative w-56 h-56 flex items-center justify-center">
                      {/* Outer Calories Ring */}
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" stroke="#262626" strokeWidth="6" fill="none" />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="#ef4444"
                          strokeWidth="6"
                          strokeDasharray={264}
                          strokeDashoffset={264 - (Math.min(activity.activeCalories / activity.caloriesGoal, 1) * 264)}
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Middle Steps Ring */}
                        <circle cx="50" cy="50" r="34" stroke="#262626" strokeWidth="6" fill="none" />
                        <circle
                          cx="50"
                          cy="50"
                          r="34"
                          stroke="#10b981"
                          strokeWidth="6"
                          strokeDasharray={213}
                          strokeDashoffset={213 - (Math.min(activity.steps / activity.stepGoal, 1) * 213)}
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Inner Active Time Ring */}
                        <circle cx="50" cy="50" r="26" stroke="#262626" strokeWidth="6" fill="none" />
                        <circle
                          cx="50"
                          cy="50"
                          r="26"
                          stroke="#06b6d4"
                          strokeWidth="6"
                          strokeDasharray={163}
                          strokeDashoffset={163 - (Math.min(activity.activeMinutes / activity.activeMinutesGoal, 1) * 163)}
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold font-mono text-white tracking-tight">
                          {formattedHours}:{formattedMinutes}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-medium mt-0.5">{dateStr}</span>
                      </div>
                    </div>
                  )}

                  {selectedWatchFace === 'classic_chrono' && (
                    <div className="relative w-56 h-56 rounded-full border border-neutral-800/80 flex items-center justify-center">
                      {/* Chrono Dial Markings */}
                      <div className="absolute inset-2 rounded-full border border-neutral-800/50"></div>
                      <span className="absolute top-4 text-xs font-semibold text-neutral-400">12</span>
                      <span className="absolute right-4 text-xs font-semibold text-neutral-400">3</span>
                      <span className="absolute bottom-4 text-xs font-semibold text-neutral-400">6</span>
                      <span className="absolute left-4 text-xs font-semibold text-neutral-400">9</span>
                      
                      {/* Digital Sub-display */}
                      <div className="absolute top-14 bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800 text-[10px] font-mono text-neutral-300">
                        {dateStr}
                      </div>

                      <div className="absolute bottom-12 flex items-center gap-2 text-[10px] text-neutral-400">
                        <span className="text-emerald-400">{activity.steps}</span>
                        <span>•</span>
                        <span className="text-rose-400">{liveHeartRate} BPM</span>
                      </div>

                      {/* Hour Hand */}
                      <div
                        className="absolute w-1.5 h-14 bg-white rounded-full origin-bottom shadow-lg"
                        style={{
                          transform: `translateY(-50%) rotate(${hoursDegrees}deg)`,
                          transformOrigin: '50% 100%'
                        }}
                      />
                      {/* Minute Hand */}
                      <div
                        className="absolute w-1 h-20 bg-neutral-300 rounded-full origin-bottom shadow-lg"
                        style={{
                          transform: `translateY(-50%) rotate(${minutesDegrees}deg)`,
                          transformOrigin: '50% 100%'
                        }}
                      />
                      {/* Second Hand */}
                      <div
                        className="absolute w-0.5 h-22 bg-blue-500 rounded-full origin-bottom shadow-md"
                        style={{
                          transform: `translateY(-50%) rotate(${secondsDegrees}deg)`,
                          transformOrigin: '50% 100%'
                        }}
                      />
                      {/* Center Pin */}
                      <div className="absolute w-3 h-3 rounded-full bg-blue-500 border-2 border-white z-10" />
                    </div>
                  )}

                  {selectedWatchFace === 'health_dash' && (
                    <div className="w-full flex flex-col items-center justify-center p-3 text-center">
                      <div className="text-3xl font-extrabold font-mono text-white mb-2">
                        {formattedHours}:{formattedMinutes}
                      </div>
                      <div className="grid grid-cols-2 gap-2 w-48 text-left text-xs">
                        <div className="bg-neutral-900/90 p-2 rounded-xl border border-neutral-800">
                          <div className="flex items-center gap-1 text-rose-400 text-[10px]">
                            <Heart className="w-3 h-3" />
                            <span>Pulse</span>
                          </div>
                          <div className="font-mono text-sm font-bold text-white mt-0.5">{liveHeartRate} <span className="text-[10px] text-neutral-400">bpm</span></div>
                        </div>
                        <div className="bg-neutral-900/90 p-2 rounded-xl border border-neutral-800">
                          <div className="flex items-center gap-1 text-emerald-400 text-[10px]">
                            <Footprints className="w-3 h-3" />
                            <span>Steps</span>
                          </div>
                          <div className="font-mono text-sm font-bold text-white mt-0.5">{activity.steps}</div>
                        </div>
                        <div className="bg-neutral-900/90 p-2 rounded-xl border border-neutral-800">
                          <div className="flex items-center gap-1 text-amber-400 text-[10px]">
                            <Flame className="w-3 h-3" />
                            <span>Active</span>
                          </div>
                          <div className="font-mono text-sm font-bold text-white mt-0.5">{activity.activeCalories} <span className="text-[10px] text-neutral-400">kcal</span></div>
                        </div>
                        <div className="bg-neutral-900/90 p-2 rounded-xl border border-neutral-800">
                          <div className="flex items-center gap-1 text-cyan-400 text-[10px]">
                            <Droplets className="w-3 h-3" />
                            <span>SpO2</span>
                          </div>
                          <div className="font-mono text-sm font-bold text-white mt-0.5">98%</div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TILE 1: NOTIFICATIONS TILE */}
              {tiles[currentTileIndex] === 'notifications' && (
                <motion.div
                  key="tile-notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">iOS Notifications</h4>
                  <p className="text-[11px] text-neutral-400 max-w-[190px] leading-relaxed mb-3">
                    ANCS Service Active. All iPhone push notifications relay to this Galaxy Watch 4.
                  </p>
                  <div className="bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800 text-[10px] text-emerald-400 flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Listening to iPhone
                  </div>
                </motion.div>
              )}

              {/* TILE 2: DAILY ACTIVITY TILE */}
              {tiles[currentTileIndex] === 'activity' && (
                <motion.div
                  key="tile-activity"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                >
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Daily Activity</h4>
                  <div className="text-2xl font-bold font-mono text-white mb-1">
                    {activity.steps.toLocaleString()}
                    <span className="text-xs text-neutral-400 font-normal"> / {activity.stepGoal.toLocaleString()}</span>
                  </div>
                  <div className="w-48 bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800 mb-3">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((activity.steps / activity.stepGoal) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-around w-48 text-xs">
                    <div className="text-amber-400">
                      <span className="font-bold font-mono">{activity.activeCalories}</span>
                      <span className="text-[10px] text-neutral-500 block">KCAL</span>
                    </div>
                    <div className="text-cyan-400">
                      <span className="font-bold font-mono">{activity.activeMinutes}</span>
                      <span className="text-[10px] text-neutral-500 block">MINS</span>
                    </div>
                    <div className="text-violet-400">
                      <span className="font-bold font-mono">{activity.distanceKm}</span>
                      <span className="text-[10px] text-neutral-500 block">KM</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TILE 3: HEART RATE SENSOR TILE */}
              {tiles[currentTileIndex] === 'heartrate' && (
                <motion.div
                  key="tile-heartrate"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="relative mb-2">
                    <Heart className="w-10 h-10 text-rose-500 fill-rose-500/30 animate-pulse" />
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                  </div>
                  <div className="text-4xl font-extrabold font-mono text-white">
                    {liveHeartRate}
                    <span className="text-xs text-neutral-400 font-normal ml-1">BPM</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium mt-1">Resting • Regular Rhythm</span>
                  <div className="text-[10px] text-neutral-500 mt-2 font-mono">
                    PPG BioActive Sensor Live
                  </div>
                </motion.div>
              )}

              {/* TILE 4: MUSIC & MEDIA CONTROLLER */}
              {tiles[currentTileIndex] === 'music' && (
                <motion.div
                  key="tile-music"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="text-[10px] text-blue-400 uppercase font-semibold tracking-wider mb-1">
                    iPhone Media Relay
                  </div>
                  <div className="font-bold text-sm text-white truncate max-w-[180px]">{musicTrack.title}</div>
                  <div className="text-xs text-neutral-400 truncate max-w-[180px] mb-3">{musicTrack.artist}</div>
                  
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        soundService.playHapticTick();
                        setIsPlayingMusic(!isPlayingMusic);
                      }}
                      className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                      {isPlayingMusic ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TILE 5: QUICK SETTINGS */}
              {tiles[currentTileIndex] === 'quicksettings' && (
                <motion.div
                  key="tile-quicksettings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Quick Settings</div>
                  <div className="grid grid-cols-2 gap-2 w-44">
                    <button
                      onClick={() => soundService.playHapticTick()}
                      className="bg-neutral-900 hover:bg-neutral-800 p-2 rounded-xl flex flex-col items-center text-[10px] text-neutral-300 border border-neutral-800"
                    >
                      <Moon className="w-4 h-4 text-amber-400 mb-1" />
                      Bedtime
                    </button>
                    <button
                      onClick={() => soundService.playHapticTick()}
                      className="bg-neutral-900 hover:bg-neutral-800 p-2 rounded-xl flex flex-col items-center text-[10px] text-neutral-300 border border-neutral-800"
                    >
                      <Droplets className="w-4 h-4 text-cyan-400 mb-1" />
                      Water Lock
                    </button>
                    <button
                      onClick={() => soundService.playHapticTick()}
                      className="bg-neutral-900 hover:bg-neutral-800 p-2 rounded-xl flex flex-col items-center text-[10px] text-neutral-300 border border-neutral-800"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400 mb-1" />
                      Vibrate
                    </button>
                    <button
                      onClick={() => soundService.playHapticTick()}
                      className="bg-neutral-900 hover:bg-neutral-800 p-2 rounded-xl flex flex-col items-center text-[10px] text-neutral-300 border border-neutral-800"
                    >
                      <Sparkles className="w-4 h-4 text-violet-400 mb-1" />
                      AOD ON
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LIVE INCOMING NOTIFICATION MODAL OVERLAY */}
            <AnimatePresence>
              {activeNotification && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className="absolute inset-0 bg-neutral-950/95 backdrop-blur-md rounded-full p-6 flex flex-col items-center justify-between text-center z-30 border border-neutral-800"
                >
                  <div className="w-full flex items-center justify-between px-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                      {activeNotification.category === 'call' ? <Phone className="w-3 h-3 text-emerald-400" /> : <MessageSquare className="w-3 h-3" />}
                      {activeNotification.appName}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-mono">ANCS Relay</span>
                  </div>

                  <div className="flex flex-col items-center my-auto max-w-[200px]">
                    <div className="font-bold text-sm text-white mb-0.5 leading-tight">
                      {activeNotification.title}
                    </div>
                    <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                      {activeNotification.body}
                    </p>
                  </div>

                  <div className="w-full flex items-center justify-center gap-3 pb-2">
                    <button
                      id="btn-watch-notif-dismiss"
                      onClick={() => {
                        soundService.playHapticTick();
                        onDismissNotification(activeNotification.id);
                      }}
                      className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center border border-neutral-700 active:scale-95 transition-transform"
                      title="Dismiss on Watch"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {activeNotification.category !== 'call' ? (
                      <button
                        id="btn-watch-notif-reply"
                        onClick={() => {
                          soundService.playHapticTick();
                          onReplyNotification?.(activeNotification.id, 'Got it!');
                          onDismissNotification(activeNotification.id);
                        }}
                        className="px-4 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md active:scale-95 transition-transform"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Reply
                      </button>
                    ) : (
                      <button
                        id="btn-watch-notif-answer"
                        onClick={() => {
                          soundService.playHapticTick();
                          onDismissNotification(activeNotification.id);
                        }}
                        className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                        title="Answer Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FIND WATCH ALARM OVERLAY */}
            <AnimatePresence>
              {isFindAlarmActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-rose-950/95 rounded-full p-6 flex flex-col items-center justify-center text-center z-40 border-2 border-rose-500 animate-pulse"
                >
                  <Volume2 className="w-10 h-10 text-rose-400 mb-2 animate-bounce" />
                  <div className="font-extrabold text-base text-white mb-1">Ringing Watch...</div>
                  <p className="text-xs text-rose-200/80">iPhone Find My Watch signal received</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination Dots (Bottom) */}
            <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1 z-20 pointer-events-none">
              {tiles.map((tile, idx) => (
                <div
                  key={tile}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    currentTileIndex === idx ? 'bg-blue-500 w-3' : 'bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bezel Interactive Controls bar */}
      <div className="flex items-center gap-3 mt-4 text-xs text-neutral-400">
        <button
          id="btn-bezel-prev"
          onClick={() => handleRotateTile('prev')}
          className="flex items-center gap-1 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 rounded-lg border border-neutral-800 text-neutral-300 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous Tile</span>
        </button>
        <span className="text-[11px] font-mono text-neutral-500 uppercase">
          Tile {currentTileIndex + 1}/{tiles.length}
        </span>
        <button
          id="btn-bezel-next"
          onClick={() => handleRotateTile('next')}
          className="flex items-center gap-1 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 rounded-lg border border-neutral-800 text-neutral-300 active:scale-95 transition-all"
        >
          <span>Next Tile</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
