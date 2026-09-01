import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  Send,
  MessageSquare,
  Phone,
  Calendar,
  Instagram,
  Mail,
  Car,
  CheckCircle2,
  Sliders,
  Sparkles,
  Plus,
  Trash2,
  Volume2,
  Vibrate,
  Shield
} from 'lucide-react';
import { AppNotification, NotificationAppFilter, QuickReplyOption } from '../../types';
import { soundService } from '../../services/sound';

interface NotificationsTabProps {
  notifications: AppNotification[];
  appFilters: NotificationAppFilter[];
  quickReplies: QuickReplyOption[];
  onToggleAppFilter: (id: string) => void;
  onChangeVibration: (id: string, pattern: 'default' | 'double' | 'continuous' | 'silent') => void;
  onSendCustomNotification: (notif: Partial<AppNotification>) => void;
  onAddQuickReply: (text: string) => void;
  onDeleteQuickReply: (id: string) => void;
  onClearHistory: () => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  notifications,
  appFilters,
  quickReplies,
  onToggleAppFilter,
  onChangeVibration,
  onSendCustomNotification,
  onAddQuickReply,
  onDeleteQuickReply,
  onClearHistory
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [customApp, setCustomApp] = useState('iMessage');
  const [newReplyText, setNewReplyText] = useState('');

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customBody.trim()) return;

    soundService.playNotificationChime();
    onSendCustomNotification({
      appName: customApp,
      title: customTitle,
      body: customBody,
      category: customApp === 'Phone' ? 'call' : 'message',
      priority: 'high'
    });

    setCustomTitle('');
    setCustomBody('');
  };

  const handleQuickPreset = (preset: { appName: string; title: string; body: string; category: 'message' | 'call' | 'reminder' }) => {
    if (preset.category === 'call') {
      soundService.playIncomingCallRingtone();
    } else {
      soundService.playNotificationChime();
    }
    onSendCustomNotification({
      appName: preset.appName,
      title: preset.title,
      body: preset.body,
      category: preset.category,
      priority: 'high'
    });
  };

  return (
    <div id="tab-notifications" className="space-y-4 pb-12">
      {/* Test Notification Simulator Box */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Live iOS Notification Relay Test
          </h3>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-mono">
            ANCS GATT
          </span>
        </div>
        <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
          Trigger simulated iOS push notifications. The alert instantly relays over BLE to the Galaxy Watch 4 circular AMOLED screen with haptic chime.
        </p>

        {/* Quick Test Preset Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <button
            id="btn-preset-imessage"
            onClick={() =>
              handleQuickPreset({
                appName: 'iMessage',
                title: 'Sarah Jenkins',
                body: 'Hey! Are we still meeting for coffee at 4?',
                category: 'message'
              })
            }
            className="p-2.5 bg-neutral-950/80 hover:bg-neutral-850 border border-neutral-800 rounded-xl text-left transition-all active:scale-95"
          >
            <span className="text-[10px] text-blue-400 font-bold uppercase block">iMessage</span>
            <span className="text-xs font-semibold text-white truncate block">Coffee at 4?</span>
          </button>

          <button
            id="btn-preset-call"
            onClick={() =>
              handleQuickPreset({
                appName: 'Phone',
                title: 'Incoming Call',
                body: 'Alexander Graham (Mobile)',
                category: 'call'
              })
            }
            className="p-2.5 bg-neutral-950/80 hover:bg-neutral-850 border border-neutral-800 rounded-xl text-left transition-all active:scale-95"
          >
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Call Alert</span>
            <span className="text-xs font-semibold text-white truncate block">Alexander Graham</span>
          </button>

          <button
            id="btn-preset-whatsapp"
            onClick={() =>
              handleQuickPreset({
                appName: 'WhatsApp',
                title: 'Design Team Group',
                body: 'New prototypes have been uploaded for review 🚀',
                category: 'message'
              })
            }
            className="p-2.5 bg-neutral-950/80 hover:bg-neutral-850 border border-neutral-800 rounded-xl text-left transition-all active:scale-95"
          >
            <span className="text-[10px] text-emerald-500 font-bold uppercase block">WhatsApp</span>
            <span className="text-xs font-semibold text-white truncate block">Design Team</span>
          </button>

          <button
            id="btn-preset-uber"
            onClick={() =>
              handleQuickPreset({
                appName: 'Uber',
                title: 'Driver Arrived',
                body: 'White Toyota Camry (Plate #7XYZ) is outside',
                category: 'reminder'
              })
            }
            className="p-2.5 bg-neutral-950/80 hover:bg-neutral-850 border border-neutral-800 rounded-xl text-left transition-all active:scale-95"
          >
            <span className="text-[10px] text-neutral-300 font-bold uppercase block">Uber</span>
            <span className="text-xs font-semibold text-white truncate block">Driver Outside</span>
          </button>
        </div>

        {/* Custom Notification Form */}
        <form onSubmit={handleSendCustom} className="space-y-3 pt-2 border-t border-neutral-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-medium text-neutral-400 block mb-1">Source App</label>
              <select
                value={customApp}
                onChange={(e) => setCustomApp(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="iMessage">iMessage</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Phone">Phone Call</option>
                <option value="Slack">Slack</option>
                <option value="Instagram">Instagram</option>
                <option value="Calendar">Calendar</option>
                <option value="Mail">Mail</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-medium text-neutral-400 block mb-1">Sender / Title</label>
              <input
                id="input-notif-title"
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. David Miller"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-neutral-400 block mb-1">Message Body</label>
            <input
              id="input-notif-body"
              type="text"
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              placeholder="e.g. The package has arrived at the front door."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            id="btn-send-notif"
            type="submit"
            disabled={!customTitle.trim() || !customBody.trim()}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Alert to Galaxy Watch 4</span>
          </button>
        </form>
      </div>

      {/* Per-App Notification Forwarding Rules */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
          <Sliders className="w-4 h-4 text-emerald-400" />
          App Forwarding & Vibration Rules
        </h3>
        <p className="text-xs text-neutral-400 mb-3">
          Configure which iOS apps relay to Galaxy Watch 4 and select custom haptic vibration patterns.
        </p>

        <div className="divide-y divide-neutral-800/80">
          {appFilters.map((app) => (
            <div key={app.id} className="py-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0"
                  style={{ backgroundColor: app.color }}
                >
                  {app.appName.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{app.appName}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">{app.bundleId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Vibration Selector */}
                <select
                  value={app.vibratePattern}
                  onChange={(e) => {
                    soundService.playHapticTick();
                    onChangeVibration(app.id, e.target.value as any);
                  }}
                  className="bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="default">Standard Pulse</option>
                  <option value="double">Double Haptic</option>
                  <option value="continuous">Long Ring</option>
                  <option value="silent">Silent Display</option>
                </select>

                {/* Toggle Switch */}
                <button
                  id={`toggle-app-${app.id}`}
                  onClick={() => {
                    soundService.playHapticTick();
                    onToggleAppFilter(app.id);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    app.enabled ? 'bg-blue-600' : 'bg-neutral-800'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white shadow-sm"
                    animate={{ x: app.enabled ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Watch Quick Replies Manager */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
          <MessageSquare className="w-4 h-4 text-violet-400" />
          Watch Quick Replies
        </h3>
        <p className="text-xs text-neutral-400 mb-3">
          Preset text replies available on your Galaxy Watch 4 when responding to incoming messages.
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {quickReplies.map((qr) => (
            <div
              key={qr.id}
              className="bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 text-xs text-neutral-200 flex items-center gap-2"
            >
              <span>{qr.text}</span>
              <button
                onClick={() => {
                  soundService.playHapticTick();
                  onDeleteQuickReply(qr.id);
                }}
                className="text-neutral-500 hover:text-rose-400 transition-colors"
                title="Delete Reply"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="input-new-quick-reply"
            type="text"
            value={newReplyText}
            onChange={(e) => setNewReplyText(e.target.value)}
            placeholder="Add new quick reply (e.g. 'In a meeting, call later')"
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
          />
          <button
            id="btn-add-quick-reply"
            onClick={() => {
              if (newReplyText.trim()) {
                soundService.playHapticTick();
                onAddQuickReply(newReplyText.trim());
                setNewReplyText('');
              }
            }}
            disabled={!newReplyText.trim()}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>

      {/* Relayed Notification Log History */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            Relayed Notification History
          </h3>
          {notifications.length > 0 && (
            <button
              onClick={() => {
                soundService.playHapticTick();
                onClearHistory();
              }}
              className="text-[11px] text-neutral-500 hover:text-rose-400 transition-colors"
            >
              Clear Log
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-xs text-neutral-500 text-center py-6">No notifications relayed yet. Try sending a test alert above!</p>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-800 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">{n.appName}</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-xs font-bold text-white">{n.title}</span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-0.5">{n.body}</p>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 shrink-0">{n.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
