export interface Hadith {
  id: number
  narrator: string
  arabic: string
  translation: string
  source: string
  grade: string
  theme: 'Iman' | 'Ihsan' | 'Akhlak' | 'Ibadah' | 'Muamalah' | 'Ilmu'
}

export const HADITHS: Hadith[] = [
  {
    id: 1,
    narrator: 'HR. Bukhari & Muslim',
    arabic:
      'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    translation:
      'Sesungguhnya setiap amal tergantung pada niatnya, dan setiap orang akan mendapatkan apa yang diniatkannya.',
    source: 'Shahih Bukhari no. 1, Shahih Muslim no. 1907',
    grade: 'Shahih',
    theme: 'Iman',
  },
  {
    id: 2,
    narrator: 'HR. Muslim',
    arabic:
      'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    translation:
      'Tidak sempurna iman salah seorang dari kalian hingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri.',
    source: 'Shahih Muslim no. 45',
    grade: 'Shahih',
    theme: 'Akhlak',
  },
  {
    id: 3,
    narrator: 'HR. Tirmidzi',
    arabic:
      'إِنَّ اللَّهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ',
    translation:
      'Sesungguhnya Allah mewajibkan berbuat ihsan (yang terbaik) atas segala sesuatu.',
    source: 'Sunan Tirmidzi no. 1934',
    grade: 'Hasan Shahih',
    theme: 'Ihsan',
  },
  {
    id: 4,
    narrator: 'HR. Bukhari',
    arabic:
      'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    translation:
      'Barangsiapa menempuh jalan mencari ilmu, Allah mudahkan baginya jalan menuju surga.',
    source: 'Shahih Bukhari no. 2950',
    grade: 'Shahih',
    theme: 'Ilmu',
  },
  {
    id: 5,
    narrator: 'HR. Ibnu Majah',
    arabic:
      'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ صَالِحَ الْأَخْلَاقِ',
    translation:
      'Sesungguhnya aku diutus hanya untuk menyempurnakan akhlak yang mulia.',
    source: 'Sunan Ibnu Majah no. 4021',
    grade: 'Shahih',
    theme: 'Akhlak',
  },
  {
    id: 6,
    narrator: 'HR. Ahmad & Abu Dawud',
    arabic:
      'لَا تَحَاسَدُوا وَلَا تَنَاجَشُوا وَلَا تَدَابَرُوا وَكُونُوا عِبَادَ اللَّهِ إِخْوَانًا',
    translation:
      'Janganlah kalian saling dengki, saling menipu jual beli, dan saling membelakangi. Jadilah hamba-hamba Allah yang bersaudara.',
    source: 'Musnad Ahmad no. 18561, Sunan Abu Dawud no. 4913',
    grade: 'Shahih',
    theme: 'Muamalah',
  },
  {
    id: 7,
    narrator: 'HR. Bukhari & Muslim',
    arabic:
      'الطُّهُورُ شَطْرُ الْإِيمَانِ',
    translation:
      'Bersuci itu separuh dari iman.',
    source: 'Shahih Muslim no. 223',
    grade: 'Shahih',
    theme: 'Ibadah',
  },
  {
    id: 8,
    narrator: 'HR. Tirmidzi',
    arabic:
      'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ',
    translation:
      'Dunia itu penjara bagi orang beriman dan surga bagi orang kafir.',
    source: 'Sunan Tirmidzi no. 2324',
    grade: 'Hasan Shahih',
    theme: 'Iman',
  },
  {
    id: 9,
    narrator: 'HR. Bukhari & Muslim',
    arabic:
      'خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ وَأَنَا خَيْرُكُمْ لِأَهْلِي',
    translation:
      'Sebaik-baik kalian adalah yang paling baik terhadap keluarganya, dan aku adalah yang paling baik terhadap keluargaku.',
    source: 'Sunan Tirmidzi no. 3895',
    grade: 'Shahih',
    theme: 'Akhlak',
  },
  {
    id: 10,
    narrator: 'HR. Bukhari',
    arabic:
      'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    translation:
      'Senyummu di hadapan saudaramu adalah sedekah bagimu.',
    source: 'Sunan Tirmidzi no. 1956',
    grade: 'Hasan',
    theme: 'Muamalah',
  },
  {
    id: 11,
    narrator: 'HR. Muslim',
    arabic:
      'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    translation:
      'Muslim sejati adalah orang yang kaum Muslimin selamat dari lisan dan tangannya.',
    source: 'Shahih Bukhari no. 10, Shahih Muslim no. 40',
    grade: 'Shahih',
    theme: 'Muamalah',
  },
  {
    id: 12,
    narrator: 'HR. Bukhari & Muslim',
    arabic:
      'مَنْ غَشَّنَا فَلَيْسَ مِنَّا',
    translation:
      'Barangsiapa menipu kami, maka ia bukan golongan kami.',
    source: 'Shahih Muslim no. 102',
    grade: 'Shahih',
    theme: 'Muamalah',
  },
]

export const HADITH_THEMES = ['Semua', 'Iman', 'Ihsan', 'Akhlak', 'Ibadah', 'Muamalah', 'Ilmu'] as const
