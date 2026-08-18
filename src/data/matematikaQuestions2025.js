// BANK SOAL TKA MATEMATIKA (WAJIB) SMA/MA/SMK TAHUN 2025
// Total Soal: 25 Soal Lengkap Rumus Matematika, Matriks, Kunci Jawaban & Pembahasan Detail

export const MATEMATIKA_2025_QUESTIONS = [
  // SOAL 1: Himpunan (Irisan & Gabungan)
  {
    id: 301,
    type: 'single',
    questionText: 'Diberikan tiga himpunan bilangan sebagai berikut:\n$$A = \\{x \\mid x < 6, x \\in \\text{Bilangan Asli}\\}$$\n$$B = \\{x \\mid x \\text{ bilangan genap}, x \\in \\text{Bilangan Cacah}\\}$$\n$$C = \\{x \\mid x \\le 10, x \\in \\text{Bilangan Prima}\\}$$\n\nBerdasarkan himpunan-himpunan tersebut, hasil dari $(A \\cap B) \\cup C$ adalah ....',
    options: [
      { key: 'A', text: '{2, 3, 5, 7}' },
      { key: 'B', text: '{0, 2, 3, 5, 7}' },
      { key: 'C', text: '{2, 3, 4, 5, 7}', isCorrect: true },
      { key: 'D', text: '{0, 2, 3, 4, 5, 7}' },
      { key: 'E', text: '{2, 3, 4, 5, 7, 10}' }
    ],
    correctAnswer: 'C',
    explanation: 'Himpunan A = {1, 2, 3, 4, 5}, B = {0, 2, 4, 6, 8, 10}, dan C = {2, 3, 5, 7}.\nIrisan A ∩ B = {2, 4}.\nGabungan (A ∩ B) ∪ C = {2, 4} ∪ {2, 3, 5, 7} = {2, 3, 4, 5, 7}.'
  },

  // SOAL 2: Eksponen & Sifat Perpangkatan
  {
    id: 302,
    type: 'single',
    questionText: 'Bentuk sederhana dari $$\\frac{3^{\\frac{2}{3}} \\times 8^{\\frac{3}{2}}}{2^{\\frac{5}{2}} \\times 9^{\\frac{5}{6}}}$$ adalah ....',
    options: [
      { key: 'A', text: '1/42' },
      { key: 'B', text: '2/3' },
      { key: 'C', text: '4/3', isCorrect: true },
      { key: 'D', text: '6' },
      { key: 'E', text: '12' }
    ],
    correctAnswer: 'C',
    explanation: 'Ubah basis ke 2 dan 3:\n$$\\frac{3^{\\frac{2}{3}} \\times (2^3)^{\\frac{3}{2}}}{2^{\\frac{5}{2}} \\times (3^2)^{\\frac{5}{6}}} = \\frac{3^{\\frac{2}{3}} \\times 2^{\\frac{9}{2}}}{2^{\\frac{5}{2}} \\times 3^{\\frac{5}{3}}} = 2^{\\frac{9}{2} - \\frac{5}{2}} \\times 3^{\\frac{2}{3} - \\frac{5}{3}} = 2^2 \\times 3^{-1} = \\frac{4}{3}$$.'
  },

  // SOAL 3: Operasi Biner (Matriks Benar/Salah)
  {
    id: 303,
    type: 'matrix',
    questionText: 'Operasi biner $\\odot$ didefinisikan sebagai $$a \\odot b = \\frac{(a-b)^2 + 2ab}{a+b}$$ untuk setiap bilangan real tidak negatif $a$ dan $b$.\n\nJika $a \\odot 2 = 5$, tentukan Benar atau Salah pada setiap pernyataan berikut!',
    matrixHeaders: ['Pernyataan', 'Benar', 'Salah'],
    matrixRows: [
      { id: 'row-1', text: 'a merupakan kelipatan dari 3.', correct: 'Benar' },
      { id: 'row-2', text: 'a merupakan bilangan prima.', correct: 'Salah' },
      { id: 'row-3', text: 'a ⊙ 0 = 6.', correct: 'Benar' }
    ],
    explanation: 'Substitusi b=2:\n$$\\frac{(a-2)^2 + 4a}{a+2} = \\frac{a^2 + 4}{a+2} = 5 \\implies a^2 - 5a - 6 = 0 \\implies a = 6$$.\n1. 6 kelipatan 3 (Benar).\n2. 6 bukan prima (Salah).\n3. 6 ⊙ 0 = (36+0)/6 = 6 (Benar).'
  },

  // SOAL 4: Fungsi Linear & Pemanasan Global
  {
    id: 304,
    type: 'single',
    questionText: 'Seorang peneliti memodelkan peningkatan suhu akibat pemanasan global yang terjadi dengan fungsi linear berikut:\n$$y = 0{,}02x - 39{,}9$$\ndengan $x$ mewakili tahun dan $y$ mewakili peningkatan suhu dalam derajat Celsius.\n\nPada tahun berapakah peningkatan suhu diperkirakan mencapai $0{,}7^\\circ\\text{C}$?',
    options: [
      { key: 'A', text: 'Tahun 2000.' },
      { key: 'B', text: 'Tahun 2003.' },
      { key: 'C', text: 'Tahun 2025.' },
      { key: 'D', text: 'Tahun 2030.', isCorrect: true },
      { key: 'E', text: 'Tahun 2345.' }
    ],
    correctAnswer: 'D',
    explanation: 'Substitusi $y = 0{,}7$:\n$$0{,}7 = 0{,}02x - 39{,}9 \\implies 0{,}02x = 40{,}6 \\implies x = 2030$$.\nJadi peningkatan suhu mencapai $0{,}7^\\circ\\text{C}$ pada tahun 2030.'
  },

  // SOAL 5: Komposisi Diskon Biaya Kursus
  {
    id: 305,
    type: 'single',
    questionText: 'Tempat Les Pintarku memberikan potongan biaya kursus kepada 50 pendaftar pertama: $y = 0{,}9x$ ($x$ biaya mula-mula, $y$ biaya setelah potongan).\nSelain itu, bagi siswa yang berprestasi mendapat tambahan potongan harga sesuai nilai rapor:\n$$g(y) = \\begin{cases} 0{,}7y, & \\text{jika nilai rapor } > 90 \\\\ 0{,}8y, & \\text{jika nilai rapor } 85-90 \\end{cases}$$\n\nFira pendaftar ke-50 membayar biaya kursus Rp180.000,00 ($y = 180.000 \\implies x = 200.000$).\nEmpat siswa pendaftar setelahnya:\n- Andi: Nilai 90, Uang Rp285.000\n- Budi: Nilai 92, Uang Rp286.000\n- Cici: Nilai 89, Uang Rp280.000\n- Dini: Nilai 95, Uang Rp287.000\n\nDengan uang yang dimiliki, siapakah siswa yang pasti dapat mengikuti kursus?',
    options: [
      { key: 'A', text: 'Dini.' },
      { key: 'B', text: 'Dini dan Budi.', isCorrect: true },
      { key: 'C', text: 'Dini, Budi dan Andi.' },
      { key: 'D', text: 'Dini, Cici, Budi dan Andi.' },
      { key: 'E', text: 'Cici dan Andi.' }
    ],
    correctAnswer: 'B',
    explanation: 'Biaya normal $x = 200.000$. Untuk pendaftar dengan nilai > 90 (Dini & Budi), biaya akhir $= 0{,}7 \\times 200.000 = 140.000$. Uang Dini (287.000) dan Budi (286.000) sangat cukup untuk membayar kursus.'
  },

  // SOAL 6: Barisan Aritmetika Koreo Suporter
  {
    id: 306,
    type: 'single',
    questionText: 'Pada saat pertandingan sepak bola Indonesia melawan Jepang, kelompok pendukung tim Indonesia membentuk koreo. Total kertas berwarna pada barisan kursi paling bawah adalah sebanyak 400 lembar, kemudian di baris kedua sebanyak 550 lembar, dan semakin bertambah pada barisan kursi berikutnya dengan pola penambahan yang sama.\n\nJika pola penambahan tersebut berlaku sampai pada baris kursi ketujuh, maka berapa banyak penonton yang memegang kertas koreo di baris ke-5?',
    options: [
      { key: 'A', text: '700 orang.' },
      { key: 'B', text: '850 orang.' },
      { key: 'C', text: '1.000 orang.', isCorrect: true },
      { key: 'D', text: '1.150 orang.' },
      { key: 'E', text: '1.300 orang.' }
    ],
    correctAnswer: 'C',
    explanation: 'Barisan aritmetika dengan $a = 400$ dan beda $b = 550 - 400 = 150$.\nBanyak penonton pada baris ke-5 ($U_5$) $= a + 4b = 400 + 4(150) = 400 + 600 = 1.000$ orang.'
  },

  // SOAL 7: Barisan Geometri Kadar Asam Urat (MCMA)
  {
    id: 307,
    type: 'complex',
    questionText: 'Seorang pasien dengan kadar asam urat tinggi menjalani terapi menggunakan obat penurun kadar asam urat. Pada hari pertama, kadar asam urat dalam darah tercatat 13 mg/dL. Obat bekerja menurunkan kadar asam urat sebesar 20% setiap hari secara konsisten.\n- Pasien mulai merasa lebih nyaman saat kadar asam urat ada di bawah 7 mg/dL.\n- Pasien dianggap sembuh secara klinis jika kadar asam urat telah mencapai kurang dari 5 mg/dL.\n\nPada hari keberapa berapa pasien merasa nyaman namun belum dianggap sembuh secara klinis? (Pilih semua jawaban benar!)',
    options: [
      { key: 'A', text: 'Hari ke-2' },
      { key: 'B', text: 'Hari ke-3' },
      { key: 'C', text: 'Hari ke-4', isCorrect: true },
      { key: 'D', text: 'Hari ke-5', isCorrect: true },
      { key: 'E', text: 'Hari ke-6' }
    ],
    correctAnswers: ['C', 'D'],
    explanation: 'Penurunan 20% berarti kadar sisa $= 80\\% = 0{,}8$.\nHari 1 = 13, Hari 2 = 10,4, Hari 3 = 8,32, Hari 4 = 6,66 (nyaman <7, belum sembuh >5), Hari 5 = 5,33 (nyaman <7, belum sembuh >5), Hari 6 = 4,26 (sembuh <5).\nMaka hari ke-4 dan hari ke-5 pasien merasa nyaman namun belum sembuh klinis.'
  },

  // SOAL 8: System Pertidaksamaan Linear Dua Variabel (Grafik Arsiran)
  {
    id: 308,
    type: 'single',
    questionText: 'Perhatikan grafik pertidaksamaan linear dua variabel dengan titik sudut $A(-4,0)$, $B(0,2)$, dan $C(2,0)$ tempat daerah diarsir berada.\n\nDaerah yang diarsir pada gambar tersebut merupakan himpunan penyelesaian dari sistem pertidaksamaan ....',
    options: [
      { key: 'A', text: 'x - 2y ≥ -4, x + y ≤ 2, x ≥ 0, y ≥ 0' },
      { key: 'B', text: 'x - 2y ≥ -4, x + y ≤ 2, y ≥ 0', isCorrect: true },
      { key: 'C', text: 'x - 2y ≥ -4, x + y ≥ 2, y ≥ 0' },
      { key: 'D', text: '2x - y ≤ 4, x + y ≤ 2, y ≥ 0' },
      { key: 'E', text: '2x - y ≥ 4, x + y ≤ 2, x ≥ 0, y ≥ 0' }
    ],
    correctAnswer: 'B',
    explanation: 'Garis 1 melalui (-4,0) dan (0,2): $2x - 4y = -8 \\implies x - 2y = -4$. Arsiran di bawah garis $\\implies x - 2y \\ge -4$.\nGaris 2 melalui (2,0) dan (0,2): $x + y = 2$. Arsiran di bawah garis $\\implies x + y \\le 2$.\nSerta $y \\ge 0$.'
  },

  // SOAL 9: SPLTV Buket Bunga Mawar Lili Anyelir
  {
    id: 309,
    type: 'single',
    questionText: 'Bu Silma adalah seorang perangkai bunga. Di tokonya, ia memiliki bunga mawar, lili, dan anyelir. Tiga jenis buket yang biasa ia siapkan:\n- Buket Tipe A (3 mawar, 2 lili, 3 anyelir) = Rp85.000,00\n- Buket Tipe B (2 mawar, 2 lili, 2 anyelir) = Rp70.000,00\n- Buket Tipe C (2 mawar, 3 lili, 2 anyelir) = Rp75.000,00\n\nBila seorang pembeli ingin membeli buket bunga tipe C namun ingin menambah 2 tangkai lili dan 1 tangkai anyelir, maka total harga yang harus dibayar pembeli tersebut adalah ....',
    options: [
      { key: 'A', text: 'Rp75.000,00' },
      { key: 'B', text: 'Rp102.000,00', isCorrect: true },
      { key: 'C', text: 'Rp110.000,00' },
      { key: 'D', text: 'Rp115.000,00' },
      { key: 'E', text: 'Rp116.000,00' }
    ],
    correctAnswer: 'B',
    explanation: 'Buket C - Buket B $= 1$ lili $= 75.000 - 70.000 = 5.000$.\nBuket A - Buket C $= 1$ mawar - 1 lili + 1 anyelir $= 10.000 \\implies 1$ mawar + 1 anyelir $= 15.000$.\nBuket B $= 2(\text{mawar}+\text{anyelir}) + 2(\text{lili}) = 2(15.000) + 10.000 = 40.000$.\nUntuk tambahan 2 lili ($10.000$) + 1 anyelir ($17.000$), total harga Buket C + tambahan $= 75.000 + 10.000 + 17.000 = \\text{Rp}102.000,00$.'
  },

  // SOAL 10: Sudut Garis Sejajar 180 Derajat (MCMA)
  {
    id: 310,
    type: 'complex',
    questionText: 'Perhatikan gambar garis sejajar dipotong garis transversal yang membentuk sudut-sudut $\\angle A, \\angle B, \\angle C, \\angle D, \\angle E, \\angle F$.\n\nBerdasarkan gambar tersebut, pasangan sudut manakah yang membentuk sudut $180^\\circ$? (Pilih semua jawaban benar!)',
    options: [
      { key: 'A', text: '∠A dan ∠B', isCorrect: true },
      { key: 'B', text: '∠A dan ∠E' },
      { key: 'C', text: '∠B dan ∠C', isCorrect: true },
      { key: 'D', text: '∠B dan ∠D' },
      { key: 'E', text: '∠E dan ∠C', isCorrect: true }
    ],
    correctAnswers: ['A', 'C', 'E'],
    explanation: 'Sudut berpelurus (suplemen) dan sudut dalam sepihak berjumlah $180^\\circ$. Pasangan $\\angle A$ & $\\angle B$, $\\angle B$ & $\\angle C$, serta $\\angle E$ & $\\angle C$ membentuk jumlah $180^\\circ$.'
  },

  // SOAL 11: Geometri Ruang Kedudukan Dinding Kamar (MCMA)
  {
    id: 311,
    type: 'complex',
    questionText: 'Zara ingin menata kembali kamarnya yang berbentuk balok ABCD.EFGH dengan menambahkan papan jadwal di dinding. Papan jadwal tidak diletakkan pada dinding yang sejajar dengan rak buku gantung di dinding CDHG.\n\nBerdasarkan posisi yang diinginkan, pada dinding manakah papan jadwal akan diletakkan? (Pilih semua jawaban benar!)',
    options: [
      { key: 'A', text: 'CDHG' },
      { key: 'B', text: 'BCGF', isCorrect: true },
      { key: 'C', text: 'ABFE', isCorrect: true },
      { key: 'D', text: 'BCFA' },
      { key: 'E', text: 'ADHE', isCorrect: true }
    ],
    correctAnswers: ['B', 'C', 'E'],
    explanation: 'Dinding yang sejajar dengan CDHG adalah ABFE. Jadi dinding lainnya yang tegak lurus (BCGF, ABFE, ADHE) dapat dijadikan pilihan.'
  },

  // SOAL 12: Kesebangunan Trapesium
  {
    id: 312,
    type: 'single',
    questionText: 'Diketahui trapesium KLMN dan NMPO sebangun. Dengan $OP = 18\\text{ cm}$, $KL = 32\\text{ cm}$, dan $KN = 16\\text{ cm}$.\n\nBerdasarkan informasi tersebut, berapakah panjang sisi LM?',
    options: [
      { key: 'A', text: '6√5 cm' },
      { key: 'B', text: '8√5 cm', isCorrect: true },
      { key: 'C', text: '9√5 cm' },
      { key: 'D', text: '10√5 cm' },
      { key: 'E', text: '14√5 cm' }
    ],
    correctAnswer: 'B',
    explanation: 'Menggunakan rumus kesebangunan trapesium tegak dan Pythagoras:\n$$LM = \\sqrt{KN^2 + (KL - OP)^2} = \\sqrt{16^2 + (32 - 18)^2} = \\sqrt{256 + 196} = \\sqrt{320} = 8\\sqrt{5}\\text{ cm}$$.'
  },

  // SOAL 13: Teorema Pythagoras Tanaman Toga (Matriks)
  {
    id: 313,
    type: 'matrix',
    questionText: 'Tim adiwiyata SMA Gemilang sedang menata sayuran di kebun sekolah. Sisi kebun tanaman toga memiliki ukuran tinggi $500\\text{ cm}$ dan $350\\text{ cm}$ dengan lebar alas $360\\text{ cm}$.\nSisi miring ditanami pot tanaman. Ukuran diameter pot jahe $15\\text{ cm}$, kunyit $26\\text{ cm}$, dan lengkuas $30\\text{ cm}$.\n\nTentukan Benar atau Salah pernyataan berkaitan dengan ukuran sisi kebun yang ditanami tanaman toga tersebut!',
    matrixHeaders: ['Pernyataan', 'Benar', 'Salah'],
    matrixRows: [
      { id: 'row-1', text: 'Ada 25 tanaman jahe yang bisa ditanam.', correct: 'Salah' },
      { id: 'row-2', text: 'Ada 15 tanaman kunyit yang bisa ditanam.', correct: 'Benar' },
      { id: 'row-3', text: 'Ada 10 tanaman lengkuas yang bisa ditanam.', correct: 'Salah' }
    ],
    explanation: 'Panjang sisi miring $= \\sqrt{360^2 + (500-350)^2} = \\sqrt{129.600 + 22.500} = \\sqrt{152.100} = 390\\text{ cm}$.\n- Jahe: $390 / 15 = 26$ pot (Pernyataan 1 Salah).\n- Kunyit: $390 / 26 = 15$ pot (Pernyataan 2 Benar).\n- Lengkuas: $390 / 30 = 13$ pot (Pernyataan 3 Salah).'
  },

  // SOAL 14: Transformasi Geometri (Refleksi & Rotasi)
  {
    id: 314,
    type: 'single',
    questionText: 'Titik B direfleksikan oleh garis $y = 1$, kemudian dirotasi dengan pusat $O(0,0)$ sebesar $180^\\circ$ searah jarum jam. Titik $B\'(-4, 1)$ pada gambar merupakan bayangan titik B hasil komposisi kedua transformasi tersebut.\n\nKoordinat titik B yang sesuai adalah ....',
    options: [
      { key: 'A', text: 'B(4, -1)' },
      { key: 'B', text: 'B(4, 3)', isCorrect: true },
      { key: 'C', text: 'B(-4, -1)' },
      { key: 'D', text: 'B(-2, -1)' },
      { key: 'E', text: 'B(2, 4)' }
    ],
    correctAnswer: 'B',
    explanation: 'Rotasi $180^\\circ$ memetakan $(x\', y\') \\to (-x\', -y\') = (-4, 1) \\implies (x\', y\') = (4, -1)$.\nRefleksi terhadap $y=1$ memetakan $(x, 2(1)-y) = (4, -1) \\implies x=4, 2-y=-1 \\implies y=3$.\nJadi titik awal $B(4, 3)$.'
  },

  // SOAL 15: Jarak Dua Titik Tali Hiasan Kelas
  {
    id: 315,
    type: 'single',
    questionText: 'SD Jaya Makmur mendapat ruangan kelas baru berukuran panjang $6\\text{ m}$, lebar $4\\text{ m}$, dan tinggi $5\\text{ m}$. Murid-murid memasang tali hiasan dari pojok dinding pintu masuk ke bagian tengah langit-langit papan tulis.\n\nMereka akan membuat tali kedua yang sama seperti tali hiasan pertama. Apabila mereka membeli gulungan tali yang panjangnya 20 meter, berapakah sisa tali yang tidak terpakai?',
    options: [
      { key: 'A', text: '6 m.', isCorrect: true },
      { key: 'B', text: '10 m.' },
      { key: 'C', text: '11 m.' },
      { key: 'D', text: '13 m.' }
    ],
    correctAnswer: 'A',
    explanation: 'Panjang 1 tali $= \\sqrt{6^2 + 4^2 + (5/2)^2} = \\sqrt{36 + 16 + 6{,}25} = \\sqrt{58{,}25} \\approx 7{,}63\\text{ m}$.\nDua tali $\\approx 14\\text{ m}$. Sisa tali dari gulungan 20 m $= 20 - 14 = 6\\text{ m}$.'
  },

  // SOAL 16: Keliling Gabungan Segitiga & Lingkaran
  {
    id: 316,
    type: 'single',
    questionText: 'Arif membuat desain ornamen jam dinding berbentuk gabungan segitiga sama kaki dan lingkaran (diameter $20\\text{ cm} \\implies r=10$). Lebar alas segitiga $50\\text{ cm}$ dan tinggi total ornamen $70\\text{ cm}$.\nDi sekeliling ornamen akan ditempel kayu tipis 3D. Apabila Arif membuat dua buah ornamen jam dinding, berapa panjang kayu tipis yang diperlukan?',
    options: [
      { key: 'A', text: '322,8 cm.' },
      { key: 'B', text: '352,8 cm.' },
      { key: 'C', text: '362,8 cm.', isCorrect: true },
      { key: 'D', text: '382,8 cm.' },
      { key: 'E', text: '445,6 cm.' }
    ],
    correctAnswer: 'C',
    explanation: 'Tinggi segitiga $= 70 - 20 = 50\\text{ cm}$. Sisi miring $= \\sqrt{50^2 + 25^2} = 25\\sqrt{5} \\approx 55{,}9\\text{ cm}$.\nKeliling 1 ornamen $= 2(55{,}9) + \\pi(20) = 111{,}8 + 69{,}6 = 181{,}4\\text{ cm}$.\nPanjang kayu 2 ornamen $= 2 \\times 181{,}4 = 362{,}8\\text{ cm}$.'
  },

  // SOAL 17: Kecukupan Data Keliling Layang-Layang
  {
    id: 317,
    type: 'single',
    questionText: 'Panjang salah satu diagonal suatu layang-layang adalah $20\\text{ cm}$. Berapakah keliling layang-layang tersebut?\n\nPutuskan apakah pernyataan (1) dan (2) berikut cukup untuk menjawab pertanyaan:\n(1) Luas layang-layang adalah $160\\text{ cm}^2$.\n(2) Panjang salah satu sisi layang-layang adalah $10\\text{ cm}$.',
    options: [
      { key: 'A', text: 'Pernyataan (1) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (2) SAJA tidak cukup.' },
      { key: 'B', text: 'Pernyataan (2) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (1) SAJA tidak cukup.' },
      { key: 'C', text: 'DUA pernyataan BERSAMA-SAMA cukup untuk menjawab pertanyaan, tetapi SATU pernyataan SAJA tidak cukup.', isCorrect: true },
      { key: 'D', text: 'Pernyataan (1) SAJA cukup untuk menjawab pertanyaan dan pernyataan (2) SAJA cukup.' },
      { key: 'E', text: 'Pernyataan (1) dan pernyataan (2) tidak cukup untuk menjawab pertanyaan.' }
    ],
    correctAnswer: 'C',
    explanation: 'Dari (1), $L = \\frac{1}{2} d_1 d_2 = 160 \\implies d_2 = 16\\text{ cm}$. Namun belum cukup untuk menentukan perbandingan 2 pasang sisi miring. Ditambah (2) panjang salah satu sisi $= 10\\text{ cm}$, maka kedua diagonal dan sisi dapat dihitung unik. Jadi DUA pernyataan BERSAMA-SAMA cukup.'
  },

  // SOAL 18: Muatan Maksimum Kardus Helm di Truk
  {
    id: 318,
    type: 'single',
    questionText: 'Pak Omar adalah distributor helm. Kardus helm berukuran $20\\text{ cm} \\times 20\\text{ cm} \\times 30\\text{ cm}$. Truk pengangkut memiliki ruang muatan berukuran $120\\text{ cm} \\times 150\\text{ cm} \\times 240\\text{ cm}$.\nKardus helm tidak boleh dibalik (tempat helm harus menghadap bawah). Semua kardus helm disusun menghadap depan atau samping.\n\nBerdasarkan posisi susunan tersebut, berapa paling banyak kardus helm yang dapat dimuat di truk tersebut?',
    options: [
      { key: 'A', text: '336 kardus.' },
      { key: 'B', text: '360 kardus.', isCorrect: true },
      { key: 'C', text: '384 kardus.' },
      { key: 'D', text: '432 kardus.' },
      { key: 'E', text: '504 kardus.' }
    ],
    correctAnswer: 'B',
    explanation: 'Arah susunan optimal:\n- Lebar truk $120 / 20 = 6$ kardus.\n- Tinggi truk $150 / 30 = 5$ kardus.\n- Panjang truk $240 / 20 = 12$ kardus.\nTotal muatan $= 6 \\times 5 \\times 12 = 360$ kardus.'
  },

  // SOAL 19: Luas Selimut Tabung & Biaya Stiker Lampu Tidur
  {
    id: 319,
    type: 'single',
    questionText: 'Bu Sita membuat 8 buah hiasan lampu tidur berbentuk tabung berongga (tanpa alas dan tutup) dari akrilik dengan diameter $14\\text{ cm}$ ($r=7$) dan tinggi $25\\text{ cm}$. Bagian luar dilapisi stiker vinil.\nStiker vinil dijual dalam lembaran seharga Rp9.000,00 per lembar yang mampu menutupi area $300\\text{ cm}^2$.\n\nBerapakah biaya minimal yang harus dikeluarkan Bu Sita untuk membeli stiker vinil tersebut?',
    options: [
      { key: 'A', text: 'Rp72.000,00.' },
      { key: 'B', text: 'Rp108.000,00.' },
      { key: 'C', text: 'Rp252.000,00.' },
      { key: 'D', text: 'Rp270.000,00.', isCorrect: true },
      { key: 'E', text: 'Rp288.000,00.' }
    ],
    correctAnswer: 'D',
    explanation: 'Luas selimut 1 lampu $= 2 \\pi r t = 2 \\times \\frac{22}{7} \\times 7 \\times 25 = 1.100\\text{ cm}^2$.\nLuas 8 lampu $= 8 \\times 1.100 = 8.800\\text{ cm}^2$.\nBanyak lembar stiker $= \\lceil 8.800 / 300 \\rceil = 30$ lembar.\nBiaya $= 30 \\times \\text{Rp}9.000 = \\text{Rp}270.000,00$.'
  },

  // SOAL 20: Trigonometri cos(a) = 3/5 (Matriks)
  {
    id: 320,
    type: 'matrix',
    questionText: 'Perhatikan gambar segitiga siku-siku dengan nilai $\\cos(a) = \\frac{3}{5}$. Tentukan Benar atau Salah terkait perbandingan trigonometri sudut $\\beta$ berikut!',
    matrixHeaders: ['Pernyataan', 'Benar', 'Salah'],
    matrixRows: [
      { id: 'row-1', text: 'sin(β) = √7 / 4', correct: 'Salah' },
      { id: 'row-2', text: 'cos(β) = √7 / 5', correct: 'Benar' },
      { id: 'row-3', text: 'tan(β) = 3√7 / 7', correct: 'Benar' }
    ],
    explanation: 'Sesuai aturan Pythagoras dan trigonometri dasar segitiga siku-siku:\n- $\\cos(\\beta) = \\frac{\\sqrt{7}}{5}$ (Benar).\n- $\\tan(\\beta) = \\frac{3\\sqrt{7}}{7}$ (Benar).\n- $\\sin(\\beta) = \\frac{3}{5} \\neq \\frac{\\sqrt{7}}{4}$ (Salah).'
  },

  // SOAL 21: Interpretasi Diagram Garis Lulusan Sekolah (MCMA)
  {
    id: 321,
    type: 'complex',
    questionText: 'Banyak siswa yang lulus di sekolah Yayasan Cahaya beragam setiap tahunnya. Berdasarkan grafik diagram garis data lulusan 2017-2025, manakah pernyataan yang tepat mendeskripsikan banyak lulusan? (Pilih semua jawaban benar!)',
    options: [
      { key: 'A', text: 'Banyak siswa SMA 1 Bintang yang lulus selalu bertambah mulai tahun 2020.', isCorrect: true },
      { key: 'B', text: 'Pada tahun 2017-2020, banyak lulusan dari ketiga sekolah selalu bertambah.', isCorrect: true },
      { key: 'C', text: 'Banyak lulusan SMK Kejora konsisten naik selama lima tahun terakhir.', isCorrect: true },
      { key: 'D', text: 'Banyak lulusan SMA 2 Bintang tetap sama selama tiga tahun terakhir.' },
      { key: 'E', text: 'Banyak lulusan ketiga sekolah di tahun 2023 menurun dibanding tahun sebelumnya.' }
    ],
    correctAnswers: ['A', 'B', 'C'],
    explanation: 'Berdasarkan grafik diagram garis: SMA 1 Bintang selalu naik sejak 2020, tren 2017-2020 bertambah, dan SMK Kejora konsisten naik 5 tahun terakhir.'
  },

  // SOAL 22: Permutasi Penataan Stan Bazar Sekolah
  {
    id: 322,
    type: 'single',
    questionText: 'Di sebuah acara bazar sekolah, terdapat 5 stan (A, B, C, D, E) yang masing-masing dikelola oleh pedagang yang berbeda.\nDalam bazar tersebut, stan pedagang C ingin berada di antara pedagang A dan pedagang D. Banyak kemungkinan susunan atau penataan stan sesuai keinginan pedagang C tersebut adalah ....',
    options: [
      { key: 'A', text: '6 susunan' },
      { key: 'B', text: '12 susunan', isCorrect: true },
      { key: 'C', text: '120 susunan' },
      { key: 'D', text: '240 susunan' },
      { key: 'E', text: '720 susunan' }
    ],
    correctAnswer: 'B',
    explanation: 'Stan C harus berada di antara A dan D $\\implies$ ada 2 susunan internal: (A-C-D) dan (D-C-A).\nAnggap (ACD), B, E sebagai 3 objek $\\implies 3! = 6$ cara.\nTotal susunan $= 6 \\times 2 = 12$ susunan.'
  },

  // SOAL 23: Ukuran Pemusatan Data Pengunjung Perpustakaan (Matriks)
  {
    id: 323,
    type: 'matrix',
    questionText: 'Perhatikan tabel distribusi jumlah pengunjung perpustakaan Desa Sukamaju pada minggu ke-1 Januari:\n- Senin: 4 orang\n- Selasa: p orang\n- Rabu: 5 orang\n- Kamis: r orang\n- Jumat: 6 orang\n\nDiketahui: rata-rata pengunjung per hari = 6 orang, minimal 2 orang dan maksimal 10 orang per hari, serta median data = 6.\n\nTentukan Benar atau Salah pada setiap pernyataan berikut!',
    matrixHeaders: ['Pernyataan', 'Benar', 'Salah'],
    matrixRows: [
      { id: 'row-1', text: 'Banyak pengunjung pada hari Selasa pasti selalu lebih banyak dibandingkan hari lain.', correct: 'Salah' },
      { id: 'row-2', text: 'Banyak pengunjung pada hari Kamis pasti lebih dari 5 orang.', correct: 'Benar' },
      { id: 'row-3', text: 'Banyak pengunjung pada hari Jumat dan Kamis mungkin saja sama.', correct: 'Benar' }
    ],
    explanation: 'Total pengunjung $= 5 \\times 6 = 30 \\implies 4 + p + 5 + r + 6 = 30 \\implies p + r = 15$.\nKarena median $= 6$ dan $p, r \\le 10$, maka $r$ harus $> 5$ (paling sedikit 7 atau 8). Jadi hari Kamis pasti $> 5$ orang.'
  },

  // SOAL 24: Peluang Kejadian Tunggal Angpao Imlek
  {
    id: 324,
    type: 'single',
    questionText: 'Dalam rangka memperingati Tahun Baru Imlek, sebuah supermarket membuat kotak undian berisi 60 angpao hadiah:\n- 15 angpao kupon Rp25.000,00\n- 12 angpao kupon Rp50.000,00\n- 10 angpao set sendok-garpu\n- 8 angpao pemanas air\n- Sisanya angpao kosong\n\nRini menjadi orang pertama yang berkesempatan mengambil satu angpao secara acak dari kotak tersebut.\nBerapakah peluang Rini mengambil angpao yang kosong?',
    options: [
      { key: 'A', text: '1/15' },
      { key: 'B', text: '1/5' },
      { key: 'C', text: '1/4', isCorrect: true },
      { key: 'D', text: '1/3' },
      { key: 'E', text: '5/11' }
    ],
    correctAnswer: 'C',
    explanation: 'Jumlah angpao hadiah $= 15 + 12 + 10 + 8 = 45$.\nAngpao kosong $= 60 - 45 = 15$.\nPeluang Rini mengambil angpao kosong $= \\frac{15}{60} = \\frac{1}{4}$.'
  },

  // SOAL 25: Peluang Kejadian Majemuk Kertas Undian Kantin
  {
    id: 325,
    type: 'single',
    questionText: 'Sebuah kantin sekolah mengadakan undian berhadiah dengan total 15 kertas (6 Minuman Gratis, 4 Makanan Gratis, 5 Kertas Kosong).\nHanya kertas kosong yang selalu dikembalikan lagi ke dalam kotak undian.\nAni adalah orang ke-5 yang mengambil undian. Peluang Ani memperoleh minuman atau makanan gratis adalah 2/3.\n\nKertas apa sajakah yang mungkin sudah terambil oleh orang-orang sebelumnya sehingga peluang Ani bernilai 2/3?',
    options: [
      { key: 'A', text: '1 minuman gratis, 1 makanan gratis, dan 2 kertas kosong.' },
      { key: 'B', text: '2 makanan gratis dan 2 minuman gratis.' },
      { key: 'C', text: '2 minuman gratis dan 2 kertas kosong.' },
      { key: 'D', text: '4 kertas kosong.', isCorrect: true },
      { key: 'E', text: '4 minuman gratis.' }
    ],
    correctAnswer: 'D',
    explanation: 'Jika 4 orang sebelumnya mengambil kertas kosong, kertas kosong selalu dikembalikan lagi ke kotak $\\implies$ isi kotak tetap 6 Minuman, 4 Makanan, 5 Kosong (total 15).\nPeluang Ani $= \\frac{6 + 4}{15} = \\frac{10}{15} = \\frac{2}{3}$. Jadi 4 orang sebelumnya mengambil 4 kertas kosong.'
  }
];
