export type ConnectionState = 'disconnected' | 'scanning' | 'connecting' | 'connected' | 'syncing';

export type WatchModel = 'Galaxy Watch 4 (40mm)' | 'Galaxy Watch 4 (44mm)' | 'Galaxy Watch 4 Classic (42mm)' | 'Galaxy Watch 4 Classic (46mm)';

export type WatchFaceType = 'minimal_digital' | 'sport_rings' | 'classic_chrono' | 'health_dash' | 'infographic';

export interface WatchDeviceInfo {
  name: string;
  model: WatchModel;
  bluetoothAddress: string;
  batteryLevel: number;
  isCharging: boolean;
  storageTotalGB: number;
  storageUsedGB: number;
  ramTotalGB: number;
  ramUsedGB: number;
  firmwareVersion: string;
  wearOsVersion: string;
  oneUiWatchVersion: string;
  serialNumber: string;
  lastSyncTime: string;
  bluetoothRssi: number;
  ancsSupported: boolean;
}

export interface AppNotification {
  id: string;
  appName: string;
  appBundleId: string;
  appIcon: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  relayedToWatch: boolean;
  category: 'message' | 'call' | 'health' | 'social' | 'system' | 'reminder';
  priority: 'low' | 'normal' | 'high';
  senderAvatar?: string;
  actions?: string[];
}

export interface NotificationAppFilter {
  id: string;
  appName: string;
  bundleId: string;
  iconName: string;
  color: string;
  enabled: boolean;
  vibratePattern: 'default' | 'double' | 'continuous' | 'silent';
  wakeScreen: boolean;
}

export interface DailyActivity {
  date: string;
  steps: number;
  stepGoal: number;
  activeCalories: number;
  caloriesGoal: number;
  activeMinutes: number;
  activeMinutesGoal: number;
  distanceKm: number;
  floorsClimbed: number;
  hourlySteps: number[];
}

export interface HeartRateReading {
  timestamp: string;
  bpm: number;
  zone: 'resting' | 'fat_burn' | 'cardio' | 'peak';
}

export interface SleepStageData {
  deepMinutes: number;
  remMinutes: number;
  lightMinutes: number;
  awakeMinutes: number;
  totalDurationMinutes: number;
  sleepScore: number;
  spO2Average: number;
  snoringDetectedMinutes: number;
  bedtime: string;
  wakeTime: string;
}

export interface BodyCompositionData {
  weightKg: number;
  skeletalMuscleKg: number;
  fatMassKg: number;
  bodyFatPercentage: number;
  bodyWaterPercentage: number;
  bmi: number;
  bmrKcal: number;
  measuredAt: string;
}

export interface WorkoutSession {
  id: string;
  type: 'Outdoor Run' | 'Cycling' | 'Walking' | 'HIIT' | 'Swimming' | 'Strength';
  startTime: string;
  durationMinutes: number;
  distanceKm: number;
  caloriesBurned: number;
  avgHeartRate: number;
  maxHeartRate: number;
  avgPace: string;
  elevationGainMeters: number;
  syncedToAppleHealth: boolean;
  routeCoordinates?: { lat: number; lng: number }[];
}

export interface HealthSyncSummary {
  lastSyncTimestamp: string;
  appleHealthConnected: boolean;
  googleFitConnected: boolean;
  autoSyncIntervalMinutes: number;
  syncItemsPending: number;
  totalWorkoutsSynced: number;
  exportFormat: 'healthkit_xml' | 'json' | 'csv';
}

export interface QuickReplyOption {
  id: string;
  text: string;
  isDefault: boolean;
}
