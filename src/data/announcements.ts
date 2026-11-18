export type AnnouncementLevel = 'info' | 'warning' | 'urgent' | 'event'

export interface Announcement {
  id: number
  title: string
  body: string
  date: string
  time?: string
  location?: string
  level: AnnouncementLevel
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: 'Sholat Berjamaah',
    body: 'Sholat lima waktu berjamaah di masjid salsabila setiap hari. Shubuh berjamaah 15 menit setelah adzan.',
    date: 'Setiap Hari',
    time: '05:15 WIB',
    location: 'Mushola Utama',
    level: 'info',
  },
  {
    id: 2,
    title: 'Pengajian Ahad Pagi',
    body: 'Pengajian rutin setiap Ahad pagi pukul 08:00 setelah sholat Subuh. Pemateri: Ustadz Firmanda Hidayat, S.Pd.i.',
    date: 'Setiap Ahad',
    time: '08:00 WIB',
    location: 'Serambi Masjid',
    level: 'event',
  },
  {
    id: 3,
    title: 'Santunan Anak Yatim',
    body: 'Bagi yang ingin berpartisipasi dalam program santunan, silakan hubungi takmir masjid atau Bendahara.',
    date: 'Setiap Bulan',
    location: 'Kantor Takmir',
    level: 'event',
  },
  {
    id: 4,
    title: 'Peringatan Kebersihan',
    body: 'Mari menjaga kebersihan masjid. Dilarang membawa makanan berat ke dalam mushola utama.',
    date: 'Berlaku Selamanya',
    level: 'warning',
  },
  {
    id: 6,
    title: 'Donasi & Infak Online',
    body: 'Kini donasi dan infak dapat dilakukan melalui QRIS yang tersedia di setiap sudut masjid, atau melalui transfer bank.',
    date: 'Berlaku Selamanya',
    level: 'info',
  },
]

export const LEVEL_STYLES: Record<AnnouncementLevel, { label: string; dot: string; chip: string }> = {
  info: { label: 'Informasi', dot: 'bg-sky-500', chip: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200' },
  warning: { label: 'Peringatan', dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  urgent: { label: 'Penting', dot: 'bg-rose-500', chip: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' },
  event: { label: 'Kegiatan', dot: 'bg-teal-500', chip: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200' },
}
