import { BAHASA_INDONESIA_2025_QUESTIONS } from './bahasaIndonesiaQuestions';
import { BAHASA_INGGRIS_2025_QUESTIONS } from './bahasaInggrisQuestions';
import { MATEMATIKA_2025_QUESTIONS } from './matematikaQuestions2025';
import { MATEMATIKA_TL_2025_QUESTIONS } from './matematikaTLQuestions2025';
import { PANCASILA_PILIHAN_2025_QUESTIONS } from './pancasilaPilihanQuestions2025';

const EXISTING_MATH_QUESTIONS = [
  {
    id: 1,
    type: 'single',
    questionText: 'Harga 3 buah buku dan 2 buah penggaris Rp18.000,00. Jika harga sebuah buku Rp1.000,00 lebih mahal dari sebuah penggaris, harga 2 buah buku dan 5 buah penggaris adalah ....',
    options: [
      { key: 'A', text: 'Rp19.000,00' },
      { key: 'B', text: 'Rp23.000,00', isCorrect: true },
      { key: 'C', text: 'Rp25.000,00' },
      { key: 'D', text: 'Rp27.000,00' },
      { key: 'E', text: 'Rp30.000,00' }
    ],
    correctAnswer: 'B',
    explanation: '3x + 2y = 18.000 dan x = y + 1.000. diperoleh y = 3.000 dan x = 4.000. Maka 2x + 5y = 2(4.000) + 5(3.000) = Rp23.000,00.'
  },
  {
    id: 2,
    type: 'single',
    questionText: 'Daerah yang memenuhi sistem pertidaksamaan linear $x + y \\le 4$; $x + 3y \\ge 6$; $x \\ge 0$; $y \\ge 0$ adalah ....',
    options: [
      { key: 'A', text: 'I' },
      { key: 'B', text: 'II', isCorrect: true },
      { key: 'C', text: 'III' },
      { key: 'D', text: 'IV' },
      { key: 'E', text: 'V' }
    ],
    correctAnswer: 'B',
    explanation: 'Irisan daerah di bawah garis x+y=4 dan di atas garis x+3y=6 di Kuadran I berada pada daerah II.'
  },
  {
    id: 3,
    type: 'single',
    questionText: 'Diketahui fungsi $f(x) = \\sqrt{2x + 3}$, dengan $x \\ge -\\frac{3}{2}$. Jika $f^{-1}(x)$ adalah invers dari fungsi $f(x)$, nilai dari $f^{-1}(3) = ....$',
    options: [
      { key: 'A', text: '6' },
      { key: 'B', text: '3', isCorrect: true },
      { key: 'C', text: '3/2' },
      { key: 'D', text: '-1/2' },
      { key: 'E', text: '-1' }
    ],
    correctAnswer: 'B',
    explanation: 'f(k) = 3 => \\sqrt{2k + 3} = 3 => 2k + 3 = 9 => 2k = 6 => k = 3.'
  },
  {
    id: 4,
    type: 'single',
    questionText: 'Fungsi $f: R \\to R$ dan $g: R \\to R$. Jika $g(x) = x - 1$ dan $(f \\circ g)(x) = x^3 - 4x$, nilai dari $f(2) = ....$',
    options: [
      { key: 'A', text: '9' },
      { key: 'B', text: '13' },
      { key: 'C', text: '15', isCorrect: true },
      { key: 'D', text: '17' },
      { key: 'E', text: '25' }
    ],
    correctAnswer: 'C',
    explanation: 'f(x-1) = x^3 - 4x. Untuk f(2), buat x-1=2 => x=3. Maka f(2) = 3^3 - 4(3) = 27 - 12 = 15.'
  },
  {
    id: 5,
    type: 'single',
    questionText: 'Seorang peneliti melakukan pengamatan terhadap bakteri. Setiap 1/2 hari bakteri membelah menjadi 2. Pada awal ada 2 bakteri. Setiap 2 hari 1/4 dari jumlah bakteri mati, banyaknya bakteri setelah 3 hari adalah....',
    options: [
      { key: 'A', text: '48 bakteri' },
      { key: 'B', text: '64 bakteri' },
      { key: 'C', text: '96 bakteri', isCorrect: true },
      { key: 'D', text: '128 bakteri' },
      { key: 'E', text: '192 bakteri' }
    ],
    correctAnswer: 'C',
    explanation: 't=2 hari: 32 bakteri, mati 1/4 (8) => sisa 24. t=2.5 hari: 48, t=3 hari: 96 bakteri.'
  }
];

export const MOCK_EXAMS = {
  'b-indo': {
    title: 'Bahasa Indonesia - SMA/MA/SMK/MAK',
    durationMinutes: 75,
    questions: BAHASA_INDONESIA_2025_QUESTIONS
  },

  'b-ing': {
    title: 'Bahasa Inggris - SMA/MA/SMK/MAK',
    durationMinutes: 75,
    questions: BAHASA_INGGRIS_2025_QUESTIONS
  },
  
  'matematika': {
    title: 'Matematika - SMA/MA/SMK/MAK',
    durationMinutes: 75,
    questions: [...EXISTING_MATH_QUESTIONS, ...MATEMATIKA_2025_QUESTIONS]
  },

  'matematika-tl': {
    title: 'Matematika Tingkat Lanjut - SMA/MA/SMK/MAK',
    durationMinutes: 75,
    questions: MATEMATIKA_TL_2025_QUESTIONS
  },

  'pancasila-pilihan': {
    title: 'Pendidikan Pancasila (Pilihan) - SMA/MA/SMK/MAK',
    durationMinutes: 75,
    questions: PANCASILA_PILIHAN_2025_QUESTIONS
  }
};
