import {
  DailyActivity,
  HeartRateReading,
  SleepStageData,
  BodyCompositionData,
  WorkoutSession,
  HealthSyncSummary
} from '../types';

export const INITIAL_DAILY_ACTIVITY: DailyActivity = {
  date: 'Today, ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  steps: 8432,
  stepGoal: 10000,
  activeCalories: 480,
  caloriesGoal: 650,
  activeMinutes: 46,
  activeMinutesGoal: 60,
  distanceKm: 6.2,
  floorsClimbed: 14,
  hourlySteps: [0, 0, 0, 0, 0, 0, 120, 540, 1420, 890, 640, 1280, 950, 1120, 780, 692, 0, 0, 0, 0, 0, 0, 0, 0]
};

export const INITIAL_HEART_RATE_HISTORY: HeartRateReading[] = [
  { timestamp: '08:00 AM', bpm: 68, zone: 'resting' },
  { timestamp: '09:30 AM', bpm: 82, zone: 'fat_burn' },
  { timestamp: '11:15 AM', bpm: 74, zone: 'resting' },
  { timestamp: '01:00 PM', bpm: 95, zone: 'fat_burn' },
  { timestamp: '03:45 PM', bpm: 138, zone: 'cardio' },
  { timestamp: '04:15 PM', bpm: 156, zone: 'peak' },
  { timestamp: '05:00 PM', bpm: 88, zone: 'fat_burn' },
  { timestamp: '06:30 PM', bpm: 72, zone: 'resting' }
];

export const INITIAL_SLEEP_DATA: SleepStageData = {
  totalDurationMinutes: 442, // 7h 22m
  deepMinutes: 98, // 1h 38m
  remMinutes: 114, // 1h 54m
  lightMinutes: 202, // 3h 22m
  awakeMinutes: 28,
  sleepScore: 87,
  spO2Average: 97.4,
  snoringDetectedMinutes: 12,
  bedtime: '11:18 PM',
  wakeTime: '06:40 AM'
};

export const INITIAL_BODY_COMP: BodyCompositionData = {
  weightKg: 73.4,
  skeletalMuscleKg: 34.2,
  fatMassKg: 13.8,
  bodyFatPercentage: 18.8,
  bodyWaterPercentage: 58.6,
  bmi: 22.9,
  bmrKcal: 1720,
  measuredAt: 'Yesterday, 07:15 AM'
};

export const INITIAL_WORKOUTS: WorkoutSession[] = [
  {
    id: 'wo-01',
    type: 'Outdoor Run',
    startTime: 'Today, 03:45 PM',
    durationMinutes: 34,
    distanceKm: 5.12,
    caloriesBurned: 395,
    avgHeartRate: 148,
    maxHeartRate: 168,
    avgPace: '5\'42" /km',
    elevationGainMeters: 42,
    syncedToAppleHealth: true,
    routeCoordinates: [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7758, lng: -122.4178 },
      { lat: 37.7782, lng: -122.4165 },
      { lat: 37.7810, lng: -122.4150 },
      { lat: 37.7835, lng: -122.4180 },
      { lat: 37.7815, lng: -122.4210 },
      { lat: 37.7770, lng: -122.4215 },
      { lat: 37.7749, lng: -122.4194 }
    ]
  },
  {
    id: 'wo-02',
    type: 'Cycling',
    startTime: 'Yesterday, 06:10 PM',
    durationMinutes: 48,
    distanceKm: 16.4,
    caloriesBurned: 440,
    avgHeartRate: 132,
    maxHeartRate: 154,
    avgPace: '20.5 km/h',
    elevationGainMeters: 110,
    syncedToAppleHealth: true
  },
  {
    id: 'wo-03',
    type: 'HIIT',
    startTime: '2 days ago, 08:30 AM',
    durationMinutes: 25,
    distanceKm: 0,
    caloriesBurned: 260,
    avgHeartRate: 152,
    maxHeartRate: 174,
    avgPace: '-',
    elevationGainMeters: 0,
    syncedToAppleHealth: true
  }
];

export const INITIAL_SYNC_SUMMARY: HealthSyncSummary = {
  lastSyncTimestamp: '2 minutes ago',
  appleHealthConnected: true,
  googleFitConnected: true,
  autoSyncIntervalMinutes: 15,
  syncItemsPending: 0,
  totalWorkoutsSynced: 48,
  exportFormat: 'healthkit_xml'
};

export function generateAppleHealthKitXML(activity: DailyActivity, sleep: SleepStageData, body: BodyCompositionData, workouts: WorkoutSession[]): string {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE HealthData [
<!ELEMENT HealthData (ExportDate, Me, (Record|Workout|ActivitySummary)*)>
<!ATTLIST HealthData
  locale CDATA #REQUIRED
>
]>
<HealthData locale="en_US">
  <ExportDate value="${now}"/>
  <Me HKCharacteristicTypeIdentifierBiologicalSex="HKBiologicalSexNotSet" HKCharacteristicTypeIdentifierBloodType="HKBloodTypeNotSet" HKCharacteristicTypeIdentifierDateOfBirth="1996-05-14"/>
  
  <!-- Step Count from Samsung Galaxy Watch 4 (Wear OS Bridge) -->
  <Record type="HKQuantityTypeIdentifierStepCount" sourceName="Galaxy Watch 4 Bridge" sourceVersion="1.4.2" device="&lt;&lt;HKDevice: 0x283b&gt;, name:Galaxy Watch 4, manufacturer:Samsung, model:SM-R870&gt;" unit="count" creationDate="${now}" startDate="${now}" endDate="${now}" value="${activity.steps}"/>
  
  <!-- Active Energy Burned -->
  <Record type="HKQuantityTypeIdentifierActiveEnergyBurned" sourceName="Galaxy Watch 4 Bridge" sourceVersion="1.4.2" unit="kcal" creationDate="${now}" startDate="${now}" endDate="${now}" value="${activity.activeCalories}"/>
  
  <!-- Distance Walking/Running -->
  <Record type="HKQuantityTypeIdentifierDistanceWalkingRunning" sourceName="Galaxy Watch 4 Bridge" sourceVersion="1.4.2" unit="km" creationDate="${now}" startDate="${now}" endDate="${now}" value="${activity.distanceKm}"/>
  
  <!-- Resting Heart Rate & Oxygen Saturation -->
  <Record type="HKQuantityTypeIdentifierOxygenSaturation" sourceName="Galaxy Watch 4 Bridge" sourceVersion="1.4.2" unit="%" creationDate="${now}" startDate="${now}" endDate="${now}" value="${sleep.spO2Average / 100}"/>
  
  <!-- Body Mass & Body Fat Percentage (BIA sensor) -->
  <Record type="HKQuantityTypeIdentifierBodyMass" sourceName="Galaxy Watch 4 BIA Sensor" unit="kg" creationDate="${now}" startDate="${now}" endDate="${now}" value="${body.weightKg}"/>
  <Record type="HKQuantityTypeIdentifierBodyFatPercentage" sourceName="Galaxy Watch 4 BIA Sensor" unit="%" creationDate="${now}" startDate="${now}" endDate="${now}" value="${body.bodyFatPercentage / 100}"/>

  <!-- Sleep Analysis -->
  <Record type="HKCategoryTypeIdentifierSleepAnalysis" sourceName="Galaxy Watch 4 Sleep Tracker" value="HKCategoryValueSleepAnalysisAsleepCore" startDate="${now}" endDate="${now}"/>
  
  <!-- Workouts -->
  ${workouts.map(w => `
  <Workout workoutActivityType="${w.type === 'Outdoor Run' ? 'HKWorkoutActivityTypeRunning' : w.type === 'Cycling' ? 'HKWorkoutActivityTypeCycling' : 'HKWorkoutActivityTypeFunctionalStrengthTraining'}" duration="${w.durationMinutes * 60}" durationUnit="s" totalDistance="${w.distanceKm}" totalDistanceUnit="km" totalEnergyBurned="${w.caloriesBurned}" totalEnergyBurnedUnit="kcal" sourceName="Galaxy Watch 4" creationDate="${now}" startDate="${w.startTime}" endDate="${w.startTime}">
    <MetadataEntry key="HKAverageHeartRate" value="${w.avgHeartRate} count/min"/>
    <MetadataEntry key="HKMaximumHeartRate" value="${w.maxHeartRate} count/min"/>
  </Workout>`).join('\n')}
</HealthData>`;
}

export function downloadHealthExport(data: string, filename: string, mimeType: string = 'application/xml') {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
