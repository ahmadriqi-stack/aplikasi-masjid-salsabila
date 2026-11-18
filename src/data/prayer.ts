export type PrayerKey = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'

export interface PrayerInfo {
  key: PrayerKey
  name: string
  arabic: string
  time: string
  time12: string
  note?: string
}

export interface ScheduleDay {
  date: string
  hijri: string
  times: PrayerInfo[]
}

export const FALLBACK_SCHEDULE: ScheduleDay = {
  date: 'Senin, 21 Rabiʻul Awwal',
  hijri: '1448 H',
  times: [
    { key: 'Fajr', name: 'Subuh', arabic: 'الفجر', time: '04:30', time12: '4:30 AM' },
    { key: 'Sunrise', name: 'Terbit', arabic: 'الشروق', time: '05:45', time12: '5:45 AM' },
    { key: 'Dhuhr', name: 'Dzuhur', arabic: 'الظهر', time: '12:00', time12: '12:00 PM' },
    { key: 'Asr', name: 'Ashar', arabic: 'العصر', time: '15:15', time12: '3:15 PM' },
    { key: 'Maghrib', name: 'Maghrib', arabic: 'المغرب', time: '18:15', time12: '6:15 PM' },
    { key: 'Isha', name: 'Isya', arabic: 'العشاء', time: '19:30', time12: '7:30 PM' },
  ],
}

export const PRAYER_ARABIC: Record<PrayerKey, string> = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
}
