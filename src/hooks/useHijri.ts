const ARABIC_MONTHS = [
  'Muharram',
  'Safar',
  "Rabiʻul Awwal",
  "Rabiʻul Akhir",
  'Jumadil Awwal',
  'Jumadil Akhir',
  'Rajab',
  "Syaʻban",
  'Ramadhan',
  "Syawal",
  "Dzulqaʻdah",
  'Dzulhijjah',
]

const INDONESIAN_DAYS = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

// Cached formatters — constructing Intl.DateTimeFormat is expensive, and
// getHijriInfo runs every second (and ~40× per calendar render).
const HIJRI_FULL = new Intl.DateTimeFormat('id-u-ca-islamic-umalqura', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const HIJRI_MONTH = new Intl.DateTimeFormat('id-u-ca-islamic-umalqura', {
  month: 'long',
})
const HIJRI_MONTH_YEAR = new Intl.DateTimeFormat('id-u-ca-islamic-umalqura', {
  month: 'long',
  year: 'numeric',
})
const GREGORIAN_FULL = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function formatHijri(date: Date): string {
  try {
    const parts = HIJRI_FULL.formatToParts(date)
    const pick = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((p) => p.type === type)?.value ?? ''
    const day = pick('day') || String(date.getDate())
    const month = pick('month')
    const year = pick('year').replace(/\D/g, '').slice(-4)
    return `${day} ${month} ${year} H`
  } catch {
    // Approximate: Islamic year lags the Gregorian year by ~579
    return `${date.getDate()} ${ARABIC_MONTHS[date.getMonth()]} ${date.getFullYear() - 579} H`
  }
}

export interface HijriInfo {
  dayName: string
  hijri: string
  gregorian: string
  isRamadhan: boolean
  monthName: string
}

let lastDayKey = ''
let lastInfo: HijriInfo | null = null

export function getHijriInfo(now: Date): HijriInfo {
  // Result depends only on the calendar day — callers re-render every second
  const dayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
  if (lastInfo && dayKey === lastDayKey) return lastInfo

  const dayName = INDONESIAN_DAYS[now.getDay()]
  const hijri = formatHijri(now)
  const gregorian = GREGORIAN_FULL.format(now)

  let monthName = ''
  let isRamadhan = false
  try {
    const monthPart = HIJRI_MONTH.format(now)
    monthName = monthPart
    isRamadhan = /ramadhan/i.test(monthPart)
  } catch {
    monthName = ARABIC_MONTHS[now.getMonth()]
  }

  lastDayKey = dayKey
  lastInfo = { dayName, hijri, gregorian, isRamadhan, monthName }
  return lastInfo
}

export function formatHijriMonthYear(date: Date): string | null {
  try {
    return HIJRI_MONTH_YEAR.format(date)
  } catch {
    return null
  }
}
