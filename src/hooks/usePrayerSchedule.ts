import { useEffect, useRef, useState } from 'react'
import { FALLBACK_SCHEDULE, type PrayerKey, type PrayerInfo, type ScheduleDay } from '../data/prayer'
import { getHijriInfo } from './useHijri'

export interface AladhanResponse {
  data: {
    timings: Record<string, string>
    date: {
      gregorian: { date: string; day: string; month: { number: number }; year: string; weekday: { en: string } }
      hijri: { day: string; month: { en: string; ar: string }; year: string }
    }
  }
}

export type ScheduleStatus = 'loading' | 'live' | 'fallback'

const DEFAULT_CITY = 'Bekasi'
const BEKASI_TIME_ZONE = 'Asia/Jakarta'
const BEKASI_COORDINATES = { latitude: -6.2383, longitude: 106.9756 }

function to24(hm: string): string {
  const time = hm.trim().split(' ')[0]
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    throw new Error(`Waktu sholat tidak valid: ${hm}`)
  }
  return time
}

function getBekasiDate(now: Date): { date: string; stamp: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: BEKASI_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(now)
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  const date = `${values.day}-${values.month}-${values.year}`
  return { date, stamp: date }
}

function buildFallbackDay(now: Date): ScheduleDay {
  const hijri = getHijriInfo(now)
  return {
    ...FALLBACK_SCHEDULE,
    date: hijri.gregorian,
    hijri: hijri.hijri,
  }
}

export function usePrayerSchedule(): {
  schedule: ScheduleDay
  status: ScheduleStatus
  sourceLabel: string
  city: string
  refresh: () => void
} {
  const [status, setStatus] = useState<ScheduleStatus>('loading')
  const [data, setData] = useState<ScheduleDay>(() => buildFallbackDay(new Date()))
  const [sourceLabel, setSourceLabel] = useState('Memuat jadwal…')
  const [city, setCity] = useState(DEFAULT_CITY)
  const [nonce, setNonce] = useState(0)
  const dayStampRef = useRef(getBekasiDate(new Date()).stamp)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const bekasiDate = getBekasiDate(new Date())
      dayStampRef.current = bekasiDate.stamp
      setStatus('loading')
      setSourceLabel('Menghubungi Aladhan API…')
      // Manual timeout — AbortSignal.timeout is missing on older TV WebViews
      const controller = new AbortController()
      const timer = window.setTimeout(() => controller.abort(), 12_000)
      try {
        const url = `https://api.aladhan.com/v1/timings/${bekasiDate.date}?latitude=${BEKASI_COORDINATES.latitude}&longitude=${BEKASI_COORDINATES.longitude}&method=20`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = (await res.json()) as AladhanResponse
        if (cancelled) return

        const today = json.data
        if (!today?.timings) throw new Error('Payload kosong')

        const times: PrayerInfo[] = [
          { key: 'Fajr', name: 'Subuh', arabic: 'الفجر', time: to24(today.timings.Fajr), time12: to24(today.timings.Fajr) },
          { key: 'Sunrise', name: 'Terbit', arabic: 'الشروق', time: to24(today.timings.Sunrise), time12: to24(today.timings.Sunrise) },
          { key: 'Dhuhr', name: 'Dzuhur', arabic: 'الظهر', time: to24(today.timings.Dhuhr), time12: to24(today.timings.Dhuhr) },
          { key: 'Asr', name: 'Ashar', arabic: 'العصر', time: to24(today.timings.Asr), time12: to24(today.timings.Asr) },
          { key: 'Maghrib', name: 'Maghrib', arabic: 'المغرب', time: to24(today.timings.Maghrib), time12: to24(today.timings.Maghrib) },
          { key: 'Isha', name: 'Isya', arabic: 'العشاء', time: to24(today.timings.Isha), time12: to24(today.timings.Isha) },
        ]

        const dayName = INDONESIAN_DAYS_EN[today.date.gregorian.weekday.en] ?? 'Hari ini'
        const hijriLabel = `${today.date.hijri.day} ${today.date.hijri.month.en} ${today.date.hijri.year} H`
        const gregorianLabel = `${dayName}, ${today.date.gregorian.day} ${
          MONTHS_ID[today.date.gregorian.month.number - 1]
        } ${today.date.gregorian.year}`

        setData({
          date: gregorianLabel,
          hijri: hijriLabel,
          times,
        })
        setCity(DEFAULT_CITY)
        setSourceLabel(`Aladhan API — ${DEFAULT_CITY}, Indonesia`)
        setStatus('live')
      } catch {
        if (cancelled) return
        setData(buildFallbackDay(new Date()))
        setSourceLabel('')
        setStatus('fallback')
      } finally {
        window.clearTimeout(timer)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [nonce])

  // Reload when the calendar day rolls over so signage never shows yesterday's schedule
  useEffect(() => {
    const id = window.setInterval(() => {
      const today = getBekasiDate(new Date()).stamp
      if (today !== dayStampRef.current) setNonce((n) => n + 1)
    }, 60_000)
    return () => window.clearInterval(id)
  }, [])

  const refresh = () => setNonce((n) => n + 1)

  return { schedule: data, status, sourceLabel, city, refresh }
}

const INDONESIAN_DAYS_EN: Record<string, string> = {
  Sunday: 'Ahad',
  Monday: 'Senin',
  Tuesday: 'Selasa',
  Wednesday: 'Rabu',
  Thursday: 'Kamis',
  Friday: 'Jumat',
  Saturday: 'Sabtu',
}
const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

export function findNextPrayer(times: PrayerInfo[], now: Date): {
  current: PrayerKey
  next: PrayerInfo
  secondsUntilNext: number
  progress: number
} {
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()

  const order: PrayerInfo[] = times.filter((t) => t.key !== 'Sunrise')
  const withSec = order.map((p) => {
    const [h, m] = p.time.split(':').map(Number)
    return { ...p, seconds: h * 3600 + m * 60 }
  })

  const first = withSec[0]
  const last = withSec[withSec.length - 1]

  // Before Subuh: still inside yesterday's Isya window — next is Subuh today
  if (nowSec < first.seconds) {
    const prev = last.seconds - 86400
    const span = first.seconds - prev
    return {
      current: 'Isha',
      next: order[0],
      secondsUntilNext: first.seconds - nowSec,
      progress: span > 0 ? Math.min(1, Math.max(0, (nowSec - prev) / span)) : 0,
    }
  }

  let current: PrayerKey = first.key as PrayerKey
  let nextIdx = 1
  let prevSeconds = first.seconds
  let nextSeconds = withSec[1].seconds

  for (let i = 0; i < withSec.length; i++) {
    if (nowSec >= withSec[i].seconds) {
      current = withSec[i].key as PrayerKey
      prevSeconds = withSec[i].seconds
      if (i + 1 < withSec.length) {
        nextIdx = i + 1
        nextSeconds = withSec[i + 1].seconds
      } else {
        // After Isya — next is Subuh tomorrow
        nextIdx = 0
        nextSeconds = first.seconds + 86400
      }
    }
  }

  const next = order[nextIdx]
  const secondsUntilNext = nextSeconds - nowSec
  const span = nextSeconds - prevSeconds
  const progress = span > 0 ? Math.min(1, Math.max(0, (nowSec - prevSeconds) / span)) : 0

  return { current, next, secondsUntilNext, progress }
}

export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map((n) => String(n).padStart(2, '0')).join(':')
}

export function formatTime12(time24: string): string {
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}
