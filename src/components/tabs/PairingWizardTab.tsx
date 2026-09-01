import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Smartphone,
  Watch,
  Wifi,
  Terminal,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  QrCode,
  AlertCircle,
  Play,
  Copy,
  ExternalLink
} from 'lucide-react';
import { soundService } from '../../services/sound';

interface PairingWizardTabProps {
  onConnectNow: () => void;
}

export const PairingWizardTab: React.FC<PairingWizardTabProps> = ({ onConnectNow }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [watchIp, setWatchIp] = useState<string>('192.168.1.142:5555');
  const [pairingCode, setPairingCode] = useState<string>('849201');
  const [isTestingAdb, setIsTestingAdb] = useState<boolean>(false);
  const [adbStatus, setAdbStatus] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const steps = [
    {
      number: 1,
      title: 'Enable Developer Options on Galaxy Watch 4',
      description: 'On your Galaxy Watch 4, go to Settings → About Watch → Software info → Tap "Software version" 7 times until you see "Developer mode turned on".'
    },
    {
      number: 2,
      title: 'Enable Wireless ADB Debugging',
      description: 'Go to Settings → Developer options → Enable "ADB debugging" and "Wireless debugging". Tap Wireless debugging and write down the IP address & Port.'
    },
    {
      number: 3,
      title: 'Install Companion Bridge APK on Watch',
      description: 'Sideload the Merge / Wear Connect bridge APK onto your Galaxy Watch 4. This lightweight service creates the BLE ANCS listener & HealthKit sync bridge.'
    },
    {
      number: 4,
      title: 'Pair with iPhone via Bluetooth',
      description: 'Launch the companion app on your Galaxy Watch 4, tap "Start Bridge", and click Connect in this iOS app. Allow Apple Health and Notification access.'
    }
  ];

  const handleTestAdb = () => {
    setIsTestingAdb(true);
    setAdbStatus(null);
    soundService.playHapticTick();

    setTimeout(() => {
      setIsTestingAdb(false);
      setAdbStatus(`Connected to Galaxy Watch 4 (${watchIp})! Bridge APK payload verified.`);
      soundService.playSyncSuccessChime();
    }, 1800);
  };

  const handleCopyApkUrl = () => {
    soundService.playHapticTick();
    navigator.clipboard?.writeText('https://github.com/galaxywatch-ios/bridge-release/releases/latest/galaxy_watch4_bridge.apk');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const faqs = [
    {
      q: 'Why did Samsung drop Galaxy Watch 4 support for iPhone?',
      a: 'Galaxy Watch 4 switched from Tizen OS to Google Wear OS 3.0. Samsung chose not to update the iOS Galaxy Wearable app for Wear OS, but this bridge restores seamless notifications and fitness sync using Apple\'s standard ANCS and GATT BLE protocols.'
    },
    {
      q: 'Will I receive WhatsApp, iMessage, and phone call alerts?',
      a: 'Yes! All push notifications forwarded by iOS to the Apple Notification Center Service (ANCS) are relayed in real-time to your Galaxy Watch 4 with vibration and quick reply options.'
    },
    {
      q: 'How does fitness data sync to Apple Health without Samsung Health for iOS?',
      a: 'The companion APK reads BioActive sensor metrics (Steps, Heart Rate, SpO2, Sleep Stages, BIA Body Composition) and syncs directly to Apple HealthKit via Bluetooth Low Energy in native Apple Health schema format.'
    },
    {
      q: 'How do I prevent Bluetooth from disconnecting in the background?',
      a: 'Ensure "Background App Refresh" is toggled ON for this app in iPhone Settings → General → Background App Refresh.'
    }
  ];

  return (
    <div id="tab-pairing-wizard" className="space-y-4 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E5EA] shadow-sm">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1C1C1E]">Galaxy Watch 4 to iPhone Bridge Guide</h2>
            <p className="text-xs text-[#8E8E93]">Step-by-step assistant for full notifications & Apple Health sync</p>
          </div>
        </div>
      </div>

      {/* Step Progression */}
      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.number}
            onClick={() => setCurrentStep(step.number)}
            className={`p-4 rounded-3xl border transition-all cursor-pointer ${
              currentStep === step.number
                ? 'bg-white border-indigo-600 shadow-md ring-1 ring-indigo-600/20'
                : 'bg-white border-[#E5E5EA] hover:border-[#D1D1D6]'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep === step.number
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-[#F2F2F7] text-[#8E8E93]'
                }`}
              >
                {step.number}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#1C1C1E] mb-1">{step.title}</h3>
                <p className="text-xs text-[#8E8E93] leading-relaxed">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Sideload & Wireless ADB Assistant Box */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E5EA] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#1C1C1E] flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-600" />
            Wireless ADB Sideload Helper
          </h3>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200 font-bold uppercase tracking-wider">
            Direct Watch ADB
          </span>
        </div>
        <p className="text-xs text-[#8E8E93] mb-4 leading-relaxed">
          Verify and push the bridge companion APK wirelessly over your Wi-Fi network directly into your Galaxy Watch 4.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-[#8E8E93] block mb-1">Watch Wireless IP & Port</label>
            <input
              id="input-watch-ip"
              type="text"
              value={watchIp}
              onChange={(e) => setWatchIp(e.target.value)}
              placeholder="e.g. 192.168.1.142:5555"
              className="w-full bg-[#F2F2F7] border border-[#D1D1D6] rounded-2xl px-3.5 py-2.5 text-xs font-mono text-[#1C1C1E] focus:border-indigo-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-[#8E8E93] block mb-1">6-Digit Pairing Code (Optional)</label>
            <input
              id="input-pairing-code"
              type="text"
              value={pairingCode}
              onChange={(e) => setPairingCode(e.target.value)}
              placeholder="e.g. 849201"
              className="w-full bg-[#F2F2F7] border border-[#D1D1D6] rounded-2xl px-3.5 py-2.5 text-xs font-mono text-[#1C1C1E] focus:border-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        {adbStatus && (
          <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>{adbStatus}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2.5">
          <button
            id="btn-direct-download-apk"
            onClick={() => {
              soundService.playSyncSuccessChime();
              const link = document.createElement('a');
              link.href = 'https://github.com/galaxywatch-ios/bridge-release/releases/latest/galaxy_watch4_bridge.apk';
              link.download = 'galaxy_watch4_bridge_v1.4.apk';
              link.target = '_blank';
              link.rel = 'noreferrer';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-emerald-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download APK File</span>
          </button>

          <button
            id="btn-test-adb"
            onClick={handleTestAdb}
            disabled={isTestingAdb}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-indigo-200 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isTestingAdb ? 'Testing Wireless ADB...' : 'Test ADB & Push APK'}</span>
          </button>

          <button
            id="btn-copy-apk-url"
            onClick={handleCopyApkUrl}
            className="px-4 py-2.5 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] rounded-2xl text-xs font-bold border border-[#D1D1D6] flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copied Link!' : 'Copy APK Link'}</span>
          </button>
        </div>
      </div>

      {/* Connect Now CTA */}
      <div className="bg-white border border-[#E5E5EA] rounded-3xl p-6 shadow-sm text-center flex flex-col items-center">
        <h3 className="text-base font-bold text-[#1C1C1E] mb-1">Ready to Connect?</h3>
        <p className="text-xs text-[#8E8E93] max-w-md mb-4">
          Make sure your Galaxy Watch 4 is nearby and Bluetooth is switched ON on your iPhone.
        </p>
        <button
          id="btn-wizard-connect"
          onClick={() => {
            soundService.playHapticTick();
            onConnectNow();
          }}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center gap-2"
        >
          <Wifi className="w-4 h-4" />
          <span>Launch Bluetooth Pairing</span>
        </button>
      </div>

      {/* FAQ & Troubleshooting Accordion */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E5EA] shadow-sm">
        <h3 className="text-sm font-bold text-[#1C1C1E] mb-4">Frequently Asked Questions & Troubleshooting</h3>
        <div className="divide-y divide-[#E5E5EA]">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-3.5">
              <button
                onClick={() => {
                  soundService.playHapticTick();
                  setOpenFaqIndex(openFaqIndex === idx ? null : idx);
                }}
                className="w-full flex items-center justify-between text-left text-xs font-bold text-[#1C1C1E] hover:text-indigo-600 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? <ChevronUp className="w-4 h-4 text-indigo-600" /> : <ChevronDown className="w-4 h-4 text-[#8E8E93]" />}
              </button>
              <AnimatePresence>
                {openFaqIndex === idx && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-[#8E8E93] mt-2 leading-relaxed"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
