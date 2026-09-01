import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Footprints,
  Flame,
  Clock,
  Moon,
  Activity,
  ShieldCheck,
  Download,
  RefreshCw,
  Droplets,
  Zap,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Share2
} from 'lucide-react';
import {
  DailyActivity,
  SleepStageData,
  BodyCompositionData,
  WorkoutSession,
  HealthSyncSummary
} from '../../types';
import { generateAppleHealthKitXML, downloadHealthExport } from '../../services/healthSync';
import { soundService } from '../../services/sound';

interface HealthSyncTabProps {
  activity: DailyActivity;
  sleep: SleepStageData;
  bodyComp: BodyCompositionData;
  workouts: WorkoutSession[];
  syncSummary: HealthSyncSummary;
  liveHeartRate: number;
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const HealthSyncTab: React.FC<HealthSyncTabProps> = ({
  activity,
  sleep,
  bodyComp,
  workouts,
  syncSummary,
  liveHeartRate,
  onTriggerSync,
  isSyncing
}) => {
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSession | null>(workouts[0] || null);

  const handleExportXML = () => {
    soundService.playSyncSuccessChime();
    const xml = generateAppleHealthKitXML(activity, sleep, bodyComp, workouts);
    downloadHealthExport(xml, `AppleHealth_GalaxyWatch4_${new Date().toISOString().slice(0, 10)}.xml`, 'application/xml');
  };

  const handleExportJSON = () => {
    soundService.playSyncSuccessChime();
    const payload = {
      source: 'Galaxy Watch 4 iOS Bridge',
      exportedAt: new Date().toISOString(),
      dailyActivity: activity,
      sleepAnalysis: sleep,
      bodyComposition: bodyComp,
      workoutSessions: workouts
    };
    downloadHealthExport(JSON.stringify(payload, null, 2), `GalaxyWatch4_HealthData_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
  };

  return (
    <div id="tab-health-sync" className="space-y-4 pb-12">
      {/* Apple Health Sync Status Banner */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
            <Heart className="w-6 h-6 fill-rose-500/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">Apple Health (HealthKit) Sync</h3>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-mono">
                Connected
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Syncs steps, heart rate, workouts & sleep stages directly to iOS Health.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="btn-health-sync-now"
            disabled={isSyncing}
            onClick={() => {
              soundService.playHapticTick();
              onTriggerSync();
            }}
            className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          <button
            id="btn-export-apple-health"
            onClick={handleExportXML}
            title="Download Apple HealthKit XML format"
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 rounded-xl text-xs font-medium border border-neutral-700 flex items-center gap-1 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export XML</span>
          </button>
        </div>
      </div>

      {/* Activity Rings & Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white border border-[#E5E5EA] p-4 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#FF2D55] mb-2">
            <Footprints className="w-5 h-5" />
            <span className="text-[10px] font-bold text-[#8E8E93]">84% Goal</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold font-mono text-[#FF2D55] block">{activity.steps.toLocaleString()}</span>
            <span className="text-[11px] font-medium text-[#8E8E93]">Steps Today</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5EA] p-4 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5856D6] mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-[10px] font-bold text-[#8E8E93]">74% Goal</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold font-mono text-[#5856D6] block">{activity.activeCalories} <span className="text-xs font-normal text-[#8E8E93]">kcal</span></span>
            <span className="text-[11px] font-medium text-[#8E8E93]">Active Energy</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5EA] p-4 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#34C759] mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-bold text-[#8E8E93]">76% Goal</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold font-mono text-[#34C759] block">{activity.activeMinutes} <span className="text-xs font-normal text-[#8E8E93]">mins</span></span>
            <span className="text-[11px] font-medium text-[#8E8E93]">Exercise Time</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5EA] p-4 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-bold text-[#8E8E93]">GPS Track</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold font-mono text-[#1C1C1E] block">{activity.distanceKm} <span className="text-xs font-normal text-[#8E8E93]">km</span></span>
            <span className="text-[11px] font-medium text-[#8E8E93]">Walking/Running</span>
          </div>
        </div>
      </div>

      {/* Hourly Step Cadence Chart */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E5EA] shadow-sm">
        <h4 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider mb-3">
          Hourly Step Activity (Galaxy Watch Sensor)
        </h4>
        <div className="flex items-end justify-between gap-1.5 h-28 pt-4 pb-1">
          {activity.hourlySteps.slice(6, 18).map((steps, index) => {
            const hour = index + 6;
            const heightPercent = Math.min((steps / 1500) * 100, 100);
            return (
              <div key={hour} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-[#F2F2F7] rounded-t h-20 flex items-end overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.5, delay: index * 0.03 }}
                    className="w-full bg-indigo-600 group-hover:bg-indigo-500 rounded-t transition-colors"
                  />
                </div>
                <span className="text-[9px] font-bold text-[#8E8E93]">
                  {hour > 12 ? `${hour - 12}p` : `${hour}a`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sleep Stages Analysis (Wear OS Sleep Tracker) */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E5EA] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-[#1C1C1E]">Sleep Analysis & Stages</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 font-bold">
            Score {sleep.sleepScore}/100
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-extrabold font-mono text-[#1C1C1E]">7h 22m</span>
          <span className="text-xs text-[#8E8E93] font-medium">({sleep.bedtime} – {sleep.wakeTime})</span>
        </div>

        {/* Sleep Stage Stacked Bar */}
        <div className="w-full h-4 rounded-full overflow-hidden flex mb-3 border border-[#E5E5EA]">
          <div className="bg-indigo-700 h-full" style={{ width: `${(sleep.deepMinutes / sleep.totalDurationMinutes) * 100}%` }} title="Deep Sleep" />
          <div className="bg-indigo-400 h-full" style={{ width: `${(sleep.remMinutes / sleep.totalDurationMinutes) * 100}%` }} title="REM Sleep" />
          <div className="bg-sky-400 h-full" style={{ width: `${(sleep.lightMinutes / sleep.totalDurationMinutes) * 100}%` }} title="Light Sleep" />
          <div className="bg-amber-400 h-full" style={{ width: `${(sleep.awakeMinutes / sleep.totalDurationMinutes) * 100}%` }} title="Awake" />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-700" />
            <span className="text-[#8E8E93]">Deep: <span className="text-[#1C1C1E] font-bold">1h 38m</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span className="text-[#8E8E93]">REM: <span className="text-[#1C1C1E] font-bold">1h 54m</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="text-[#8E8E93]">Light: <span className="text-[#1C1C1E] font-bold">3h 22m</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-[#8E8E93]">Awake: <span className="text-[#1C1C1E] font-bold">28m</span></span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E5E5EA] flex items-center justify-between text-xs text-[#8E8E93]">
          <span className="flex items-center gap-1 text-indigo-600 font-semibold">
            <Droplets className="w-3.5 h-3.5" />
            Avg SpO2 Blood Oxygen: <span className="font-mono text-[#1C1C1E] font-bold">{sleep.spO2Average}%</span>
          </span>
          <span>Snoring: <span className="font-mono text-[#1C1C1E] font-semibold">{sleep.snoringDetectedMinutes} mins</span></span>
        </div>
      </div>

      {/* Body Composition (Samsung BioActive BIA Sensor) */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E5EA] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-[#1C1C1E]">Body Composition (BIA Sensor)</h3>
          </div>
          <span className="text-[10px] text-[#8E8E93] font-mono font-medium">{bodyComp.measuredAt}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#F2F2F7] p-3.5 rounded-2xl border border-[#E5E5EA]">
            <span className="text-[10px] font-bold uppercase text-[#8E8E93] block">Weight</span>
            <span className="text-base font-extrabold font-mono text-[#1C1C1E]">{bodyComp.weightKg} <span className="text-xs font-normal text-[#8E8E93]">kg</span></span>
          </div>
          <div className="bg-[#F2F2F7] p-3.5 rounded-2xl border border-[#E5E5EA]">
            <span className="text-[10px] font-bold uppercase text-[#8E8E93] block">Body Fat %</span>
            <span className="text-base font-extrabold font-mono text-indigo-600">{bodyComp.bodyFatPercentage}%</span>
          </div>
          <div className="bg-[#F2F2F7] p-3.5 rounded-2xl border border-[#E5E5EA]">
            <span className="text-[10px] font-bold uppercase text-[#8E8E93] block">Skeletal Muscle</span>
            <span className="text-base font-extrabold font-mono text-purple-600">{bodyComp.skeletalMuscleKg} <span className="text-xs font-normal text-[#8E8E93]">kg</span></span>
          </div>
          <div className="bg-[#F2F2F7] p-3.5 rounded-2xl border border-[#E5E5EA]">
            <span className="text-[10px] font-bold uppercase text-[#8E8E93] block">Body Water %</span>
            <span className="text-base font-extrabold font-mono text-sky-600">{bodyComp.bodyWaterPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Workout Sessions & GPS Track */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E5EA] shadow-sm">
        <h3 className="text-sm font-bold text-[#1C1C1E] flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-amber-500" />
          Recorded Workout Sessions
        </h3>

        <div className="space-y-3">
          {workouts.map((w) => (
            <div
              key={w.id}
              onClick={() => setSelectedWorkout(w)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedWorkout?.id === w.id
                  ? 'bg-indigo-50/50 border-indigo-300 shadow-sm'
                  : 'bg-[#F2F2F7] border-[#E5E5EA] hover:border-[#D1D1D6]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1C1C1E]">{w.type}</span>
                  <span className="text-[10px] text-[#8E8E93] font-mono">{w.startTime}</span>
                </div>
                <span className="text-[10px] bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  HealthKit Synced
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#8E8E93] font-medium block">Duration</span>
                  <span className="font-mono text-[#1C1C1E] font-bold">{w.durationMinutes} mins</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8E8E93] font-medium block">Calories</span>
                  <span className="font-mono text-[#FF2D55] font-bold">{w.caloriesBurned} kcal</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8E8E93] font-medium block">Avg Heart Rate</span>
                  <span className="font-mono text-amber-600 font-bold">{w.avgHeartRate} bpm</span>
                </div>
                {w.distanceKm > 0 && (
                  <div>
                    <span className="text-[10px] text-[#8E8E93] font-medium block">Distance</span>
                    <span className="font-mono text-indigo-600 font-bold">{w.distanceKm} km</span>
                  </div>
                )}
              </div>

              {/* GPS Route thumbnail indicator for Outdoor Run */}
              {w.routeCoordinates && (
                <div className="mt-2.5 pt-2 border-t border-[#D1D1D6] flex items-center justify-between text-[11px] text-[#8E8E93]">
                  <span className="flex items-center gap-1 text-green-700 font-medium">
                    <MapPin className="w-3 h-3" /> GPS Route Mapped (8 Waypoints)
                  </span>
                  <span className="font-mono font-medium text-[#1C1C1E]">Pace: {w.avgPace}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Export & Data Sharing Center */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E5EA] shadow-sm">
        <h3 className="text-sm font-bold text-[#1C1C1E] flex items-center gap-2 mb-1">
          <Share2 className="w-4 h-4 text-indigo-600" />
          Export Fitness Archive
        </h3>
        <p className="text-xs text-[#8E8E93] mb-4">
          Download clean HealthKit XML to import directly into Apple Health app on iPhone or save JSON backup.
        </p>

        <div className="flex flex-wrap gap-2.5">
          <button
            id="btn-export-xml-bottom"
            onClick={handleExportXML}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-indigo-200"
          >
            <Download className="w-3.5 h-3.5" />
            Download Apple Health XML
          </button>
          <button
            id="btn-export-json-bottom"
            onClick={handleExportJSON}
            className="px-5 py-2.5 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] rounded-2xl text-xs font-bold border border-[#D1D1D6] flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download JSON Backup
          </button>
        </div>
      </div>
    </div>
  );
};
