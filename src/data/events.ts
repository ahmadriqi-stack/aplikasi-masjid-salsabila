export interface MasjidEvent {
  id: number
  day: string
  time: string
  title: string
  description: string
}

export const UPCOMING_EVENTS: MasjidEvent[] = [
  {
    id: 1,
    day: 'Senin',
    time: '19:00',
    title: 'Tahsin Al-Quran',
    description: 'Pembinaan baca tulis Al-Quran untuk pemula dan lanjutan.',
  },
  {
    id: 2,
    day: 'Selasa',
    time: '19:00',
    title: 'Halaqah Sore',
    description: 'Pengajian tematik seputar akhlak dan muamalah sehari-hari.',
  },
  {
    id: 3,
    day: 'Rabu',
    time: '20:00',
    title: 'Kajian Tafsir',
    description: 'Bedah surah pilihan bersama ustadz muda masjid.',
  },
  {
    id: 4,
    day: 'Kamis',
    time: '18:30',
    title: 'Wirausaha Santri',
    description: 'Pelatihan keterampilan untuk pemuda dan pemudi masjid.',
  },
  {
    id: 5,
    day: 'Jumat',
    time: '12:30',
    title: 'Kultum Jumat',
    description: 'Kultum singkat setelah sholat Jumat untuk jamaah.',
  },
  {
    id: 6,
    day: 'Ahad',
    time: '08:00',
    title: 'Pengajian Ahad Pagi',
    description: 'Pengajian rutin Ahad pagi bersama keluarga besar Salsabila.',
  },
]
