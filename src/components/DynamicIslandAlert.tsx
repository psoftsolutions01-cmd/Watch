import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Watch, Bell, RefreshCw, CheckCircle2, PhoneCall, Heart } from 'lucide-react';

export interface DynamicIslandMessage {
  id: string;
  type: 'notification' | 'sync' | 'connected' | 'call' | 'heartrate';
  title: string;
  subtitle: string;
  icon?: string;
}

interface DynamicIslandAlertProps {
  message: DynamicIslandMessage | null;
}

export const DynamicIslandAlert: React.FC<DynamicIslandAlertProps> = ({ message }) => {
  return (
    <div className="w-full flex justify-center pointer-events-none sticky top-2 z-50 px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="bg-black border border-neutral-800 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 max-w-sm pointer-events-auto"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0">
              {message.type === 'notification' && <Bell className="w-4 h-4 text-blue-400" />}
              {message.type === 'sync' && <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />}
              {message.type === 'connected' && <Watch className="w-4 h-4 text-cyan-400" />}
              {message.type === 'call' && <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />}
              {message.type === 'heartrate' && <Heart className="w-4 h-4 text-rose-400 animate-pulse" />}
            </div>
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-bold text-white truncate">{message.title}</span>
              <span className="text-[11px] text-neutral-400 truncate">{message.subtitle}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
