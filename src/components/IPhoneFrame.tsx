import React from 'react';
import { motion } from 'motion/react';
import {
  Watch,
  Bell,
  Heart,
  Sliders,
  Sparkles,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { soundService } from '../services/sound';

interface IPhoneFrameProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
  unreadCount?: number;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  activeTab,
  onSelectTab,
  children,
  unreadCount = 0
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const tabs = [
    { id: 'dashboard', label: 'Today', icon: Watch },
    { id: 'notifications', label: 'Relay', icon: Bell, badge: unreadCount },
    { id: 'health', label: 'Fitness', icon: Heart },
    { id: 'device', label: 'Watch', icon: Sliders },
    { id: 'wizard', label: 'Setup', icon: Sparkles }
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-neutral-950 rounded-[44px] border-[6px] border-neutral-800 shadow-2xl shadow-black/80 overflow-hidden flex flex-col h-[840px] relative">
      {/* iOS Status Bar */}
      <div className="pt-3 px-7 pb-2 flex items-center justify-between text-xs text-white select-none z-30 shrink-0">
        <span className="font-semibold text-xs tracking-tight">{currentTime}</span>

        {/* Dynamic Island cutout placeholder */}
        <div className="w-24 h-5 bg-black rounded-full border border-neutral-800/80 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-700/60" />
        </div>

        <div className="flex items-center gap-1.5 text-neutral-200">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <div className="flex items-center gap-0.5">
            <Battery className="w-4 h-4 text-neutral-100" />
          </div>
        </div>
      </div>

      {/* Main Content Area (Scrollable inside iPhone screen) */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 scrollbar-none">
        {children}
      </div>

      {/* iOS Translucent Glass Tab Bar */}
      <div className="bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-800/80 px-4 pt-2.5 pb-6 flex items-center justify-around select-none z-30 shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => {
                soundService.playHapticTick();
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center gap-1 relative px-3 py-1 transition-all ${
                isActive ? 'text-blue-500 scale-105' : 'text-neutral-500 hover:text-neutral-400'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="w-1 h-1 bg-blue-500 rounded-full absolute -bottom-1"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-600 rounded-full z-40 pointer-events-none" />
    </div>
  );
};
