// BANK SOAL TKA MATEMATIKA TINGKAT LANJUT (PILIHAN) SMA/MA/SMK TAHUN 2025
// Total Soal: 25 Soal Lengkap Notasi Matriks, Vektor, Polinomial, Limit, Kunci Jawaban & Pembahasan

export const MATEMATIKA_TL_2025_QUESTIONS = [
  // SOAL 1: Invers Matriks 2x2
  {
    id: 401,
    type: 'single',
    questionText: 'Perhatikan matriks berikut!\n$$F = \\begin{bmatrix} 2 & 0 \\\\ 0 & \\frac{1}{2} \\end{bmatrix}$$\n\nInvers dari matriks F adalah ....',
    options: [
      { key: 'A', text: '[1  0; 0  2]' },
      { key: 'B', text: '[-1  0; 0 -2]' },
      { key: 'C', text: '[2  0; 0  1]' },
      { key: 'D', text: '[-1/2 0; 0 -2]' },
      { key: 'E', text: '[1/2 0; 0  2]', isCorrect: true }
    ],
    correctAnswer: 'E',
    explanation: 'Determinan $F = (2)(\\frac{1}{2}) - (0)(0) = 1$.\nInvers $F^{-1} = \\frac{1}{1} \\begin{bmatrix} \\frac{1}{2} & 0 \\\\ 0 & 2 \\end{bmatrix} = \\begin{bmatrix} \\frac{1}{2} & 0 \\\\ 0 & 2 \\end{bmatrix}$.'
  },

  // SOAL 2: Aplikasi Invers Matriks Pakan Ternak
  {
    id: 402,
    type: 'single',
    questionText: 'Pak Andi memiliki sapi ($x$) dan kambing ($y$). Setiap hari dia menyediakan $38\\text{ kg}$ rumput gajah dan $34\\text{ kg}$ rumput gamal. Kebutuhan per ekor:\n- Sapi: $10\\text{ kg}$ rumput gajah dan $10\\text{ kg}$ rumput gamal\n- Kambing: $2\\text{ kg}$ rumput gajah dan $1\\text{ kg}$ rumput gamal\n\nJika banyaknya sapi dan kambing berturut-turut adalah $x$ dan $y$, maka bentuk persamaan matriks $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$ yang sesuai adalah ....',
    options: [
      { key: 'A', text: '[-1 1; 10 -5] [19; 34] = [15; 20]' },
      { key: 'B', text: '[10 -10; -1 2] [38; 34] = [4; 3]' },
      { key: 'C', text: '[-1 2; 10 -10] [38; 34] = [3; 4]' },
      { key: 'D', text: '[-1/10 2/10; 1 -1] [34; 38] = [4; 3]' },
      { key: 'E', text: '[-1/5 1/5; 2 -1] [19; 34] = [3; 4]', isCorrect: true }
    ],
    correctAnswer: 'E',
    explanation: 'Sistem pertidaksamaan:\n$$10x + 2y = 38 \\implies 5x + y = 19$$\n$$10x + y = 34$$\nMatriks $\\begin{bmatrix} 5 & 1 \\\\ 10 & 1 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} 19 \\\\ 34 \\end{bmatrix}$.\nInvers matriks koefisien $= \\begin{bmatrix} -1/5 & 1/5 \\\\ 2 & -1 \\end{bmatrix}$, sehingga diperoleh $x = 3$ (sapi) dan $y = 4$ (kambing).'
  },

  // SOAL 3: Perkalian Matriks Bahan Minuman Tradisional
  {
    id: 403,
    type: 'single',
    questionText: 'Sebuah pabrik minuman tradisional memproduksi Wedang Jahe (WJ), Beras Kencur (BK), dan Kunir Asem (KA). Bahan utama per botol (gram/ml):\nMatriks kebutuhan bahan (Jahe, Gula Merah, Air):\n$$\\begin{bmatrix} 20 & 15 & 50 \\\\ 10 & 25 & 40 \\\\ 12 & 8 & k \\end{bmatrix}$$\n\nPesanan minuman: 100 botol WJ, 120 botol BK, dan 80 botol KA. Total bahan air (A) yang digunakan adalah $13.000\\text{ ml}$.\nBanyak air ($k$) yang dibutuhkan untuk memproduksi satu botol kunir asem adalah ....',
    options: [
      { key: 'A', text: '30 ml' },
      { key: 'B', text: '35 ml' },
      { key: 'C', text: '40 ml', isCorrect: true },
      { key: 'D', text: '45 ml' },
      { key: 'E', text: '50 ml' }
    ],
    correctAnswer: 'C',
    explanation: 'Persamaan perkalian matriks bahan air:\n$$50(100) + 40(120) + k(80) = 13.000$$\n$$2.500 + 4.800 + 80k = 13.000 \\implies 9.800 + 80k = 13.000$$\n$$80k = 3.200 \\implies k = 40\\text{ ml}$$.'
  },

  // SOAL 4: Operasi Matriks Pendapatan Kamar Hotel (MCMA)
  {
    id: 404,
    type: 'complex',
    questionText: 'Seorang pemilik mengelola 3 hotel (A, B, C) dengan tarif kamar:\n- Standard Room: Rp150.000/malam (Hotel A: 9, Hotel B: 6, Hotel C: 7)\n- Deluxe Room: Rp500.000/malam (Hotel A: 6, Hotel B: 7, Hotel C: 5)\n- Suite Room: Rp1.000.000/malam (Hotel A: 3, Hotel B: 2, Hotel C: 4)\n\nBagaimana kondisi pendapatan ketiga hotel tersebut dalam 1 hari jika semua kamar terisi penuh? (Pilih semua jawaban benar!)',
    options: [
      { key: 'A', text: 'Pendapatan Hotel A dan Hotel C sama besar.' },
      { key: 'B', text: 'Pendapatan Hotel B lebih besar daripada Hotel A.' },
      { key: 'C', text: 'Pendapatan paling besar diperoleh dari Hotel C.', isCorrect: true },
      { key: 'D', text: 'Masing-masing hotel memiliki selisih pendapatan yang sama besar.' },
      { key: 'E', text: 'Pendapatan yang diperoleh dari ketiga hotel tersebut lebih dari Rp20.000.000.', isCorrect: true }
    ],
    correctAnswers: ['C', 'E'],
    explanation: 'Pendapatan per hotel:\n- Hotel A = 9(150rb) + 6(500rb) + 3(1jt) = Rp7.350.000\n- Hotel B = 6(150rb) + 7(500rb) + 2(1jt) = Rp6.400.000\n- Hotel C = 7(150rb) + 5(500rb) + 4(1jt) = Rp7.550.000 (Paling besar!)\nTotal 3 hotel = Rp21.300.000 (> Rp20.000.000).'
  },

  // SOAL 5: Pemfaktoran Polinomial Berorde Tiga (MCMA)
  {
    id: 405,
    type: 'complex',
    questionText: 'Di manakah koordinat titik perpotongan grafik fungsi $f(x) = x^3 + 3x^2 - 10x - 24$ terhadap sumbu X? (Pilih semua jawaban benar!)',
    options: [
      { key: 'A', text: '(-2, 0)', isCorrect: true },
      { key: 'B', text: '(-1, 0)' },
      { key: 'C', text: '(3, 0)', isCorrect: true },
      { key: 'D', text: '(4, 0)' },
      { key: 'E', text: '(5, 0)' }
    ],
    correctAnswers: ['A', 'C'],
    explanation: 'Fungsi $f(x) = (x+2)(x+4)(x-3) = 0$.\nAkar-akar perpotongan sumbu X berada di $x = -2, x = -4, x = 3$.\nMaka titik perpotongan adalah (-2,0), (-4,0), dan (3,0).'
  },

  // SOAL 6: Sisa Pembagian Polinomial
  {
    id: 406,
    type: 'single',
    questionText: 'Diketahui suku banyak $f(x) = x^4 + ax^3 + bx^2 + x - 6$ apabila dibagi oleh $x^2 + x + 1$ menghasilkan sisa $5x - 1$.\n\nNilai dari $a + b = ....$',
    options: [
      { key: 'A', text: '11' },
      { key: 'B', text: '5', isCorrect: true },
      { key: 'C', text: '-1' },
      { key: 'D', text: '-5' },
      { key: 'E', text: '-7' }
    ],
    correctAnswer: 'B',
    explanation: 'Lakukan pembagian suku banyak $x^4 + ax^3 + bx^2 + x - 6$ oleh $x^2 + x + 1$:\nDiperoleh sisa pembagian $(a - b + 2)x + (b - a + 1) = 5x - 1$.\nDiperoleh $a = 3$ dan $b = 2$, sehingga $a + b = 5$.'
  },

  // SOAL 7: Perkalian Skalar Polinomial Volume BBM
  {
    id: 407,
    type: 'single',
    questionText: 'Sebuah drum bahan bakar logam mengalami penambahan kapasitas volume saat terkena panas yang dinyatakan dalam fungsi:\n$$V(T) = 0{,}05T^3 + 0{,}4T^2 + 20T$$\ndengan $T$ adalah suhu ($^\\circ\\text{C}$) dan $V(T)$ penambahan volume (liter).\n\nApabila terdapat 10 drum dengan jenis dan ukuran yang sama, total penambahan volume dari drum-drum tersebut adalah ....',
    options: [
      { key: 'A', text: '50T³ + 40T² + 200T' },
      { key: 'B', text: '50T³ + 4T² + 200T' },
      { key: 'C', text: '5T³ + 4T² + 200T' },
      { key: 'D', text: '0,5T³ + 4T² + 200T', isCorrect: true },
      { key: 'E', text: '0,5T³ + 0,4T² + 200T' }
    ],
    correctAnswer: 'D',
    explanation: 'Total penambahan volume 10 drum $= 10 \\times V(T) = 10(0{,}05T^3 + 0{,}4T^2 + 20T) = 0{,}5T^3 + 4T^2 + 200T$.'
  },

  // SOAL 8: Operasi Polinomial Modal Saham (Matriks)
  {
    id: 408,
    type: 'matrix',
    questionText: 'Sebuah perusahaan menawarkan modal saham yang dinyatakan sebagai fungsi $$f(x) = x^3 - 70x^2 - 600x + 74.000$$\ndimana $f(x)$ dalam jutaan rupiah dan $x$ menyatakan banyak unit saham.\n\nApabila modal saham yang dimiliki perusahaan adalah 2 miliar (2.000 juta), tentukan Mungkin atau Tidak Mungkin perusahaan dapat menjual sejumlah unit saham berikut!',
    matrixHeaders: ['Banyak Unit Saham', 'Mungkin', 'Tidak Mungkin'],
    matrixRows: [
      { id: 'row-1', text: '30 unit', correct: 'Tidak Mungkin' },
      { id: 'row-2', text: '40 unit', correct: 'Mungkin' },
      { id: 'row-3', text: '60 unit', correct: 'Mungkin' }
    ],
    explanation: 'Substitusi ke fungsi $f(x)$ untuk modal 2.000 juta:\n- f(30) = 20.000 (Tidak Mungkin > 2.000)\n- f(40) = 2.000 (Mungkin)\n- f(60) = 2.000 (Mungkin).'
  },

  // SOAL 9: Model Eksponensial Populasi Kelinci (Matriks)
  {
    id: 409,
    type: 'matrix',
    questionText: 'Populasi kelinci di suatu pulau dimodelkan dengan fungsi eksponensial $$K(t) = 4 \\cdot 2^{t/4}$$\ndengan $t$ menyatakan waktu (tahun) dan $K(t)$ menyatakan populasi (ribu ekor).\n\nBagaimana interpretasi yang tepat mengenai model eksponensial populasi kelinci tersebut?',
    matrixHeaders: ['Pernyataan', 'Benar', 'Salah'],
    matrixRows: [
      { id: 'row-1', text: 'Setiap 4 tahun populasi bertambah menjadi 4 kalinya.', correct: 'Salah' },
      { id: 'row-2', text: 'Pada saat awal populasi kelinci berjumlah 4 ribu ekor.', correct: 'Benar' },
      { id: 'row-3', text: 'Populasi mencapai 1 juta sebelum 20 tahun dari awal pengamatan.', correct: 'Salah' }
    ],
    explanation: '1. Setiap 4 tahun populasi berlipat 2 kali ($2^1=2$), bukan 4 kali (Salah).\n2. Pada t=0, K(0) = 4(1) = 4 ribu ekor (Benar).\n3. Pada t=20, K(20) = 4(32) = 128 ribu ekor < 1.000 ribu ekor (Salah).'
  },

  // SOAL 10: Grafik Eksponensial Eceng Gondok (MCMA)
  {
    id: 410,
    type: 'complex',
    questionText: 'Pengamatan pertumbuhan tanaman eceng gondok dimodelkan dengan fungsi eksponensial $y = 10 \\cdot 7^{t/2}$ ($t$ tahun, $y$ luas tertutupi dalam $\\text{m}^2$). Data pengamatan 3 tahun:\n- Danau A: 15.000 m²\n- Danau B: 16.500 m²\n- Danau C: 17.000 m²\n- Danau D: 17.500 m²\n- Danau E: 18.000 m²\n\nManakah wilayah perairan dengan luas area tertutupi lebih dari $49\\text{ m}^2$ pada awal pengamatan? (Pilih semua jawaban benar!)',
    options: [
      { key: 'A', text: 'Danau A' },
      { key: 'B', text: 'Danau B', isCorrect: true },
      { key: 'C', text: 'Danau C', isCorrect: true },
      { key: 'D', text: 'Danau D', isCorrect: true },
      { key: 'E', text: 'Danau E', isCorrect: true }
    ],
    correctAnswers: ['B', 'C', 'D', 'E'],
    explanation: 'Berdasarkan grafik eksponensial $y = 10 \\cdot 7^{t/2}$, wilayah B, C, D, dan E memiliki luasan awal yang melebihi batas $49\\text{ m}^2$.'
  },

  // SOAL 11: Trigonometri Kedalaman Air Laut
  {
    id: 411,
    type: 'single',
    questionText: 'Perubahan kedalaman air laut di sebuah teluk dimodelkan fungsi $$y = a + b \\cos\\left(\\frac{1}{6}\\pi t\\right)$$\nGrafik berosilasi antara kedalaman minimum $10{,}3\\text{ meter}$ dan maksimum $14{,}3\\text{ meter}$. Kedalaman $10{,}3\\text{ m}$ dicapai saat $t = 6$ jam setelah pukul 00.00.\n\nWaktu saat kedalaman air laut mencapai $12{,}3\\text{ meter}$ untuk ketiga kalinya setelah pukul 00.00 adalah ....',
    options: [
      { key: 'A', text: '3 jam' },
      { key: 'B', text: '9 jam' },
      { key: 'C', text: '10 jam' },
      { key: 'D', text: '12 jam' },
      { key: 'E', text: '15 jam', isCorrect: true }
    ],
    correctAnswer: 'E',
    explanation: 'Rata-rata $a = 12{,}3\\text{ m}$. Kedalaman $12{,}3\\text{ m}$ terjadi saat $\\cos(\\frac{\\pi t}{6}) = 0$.\nNilai $t$ yang memenuhi adalah $t = 3, 9, 15, 21, \\dots$ jam.\nMaka ketiga kalinya terjadi pada $t = 15$ jam.'
  },

  // SOAL 12: Vektor Berdimensi 3 (Panjang Vektor)
  {
    id: 412,
    type: 'single',
    questionText: 'Diketahui vektor $\\vec{AB} = \\begin{pmatrix} 2m \\\\ m + 3 \\\\ m \\end{pmatrix}$. Jika panjang vektor $|\\vec{AB}| = 9$ satuan panjang, maka nilai $m$ yang memenuhi vektor $\\vec{AB}$ adalah ....',
    options: [
      { key: 'A', text: '-4 atau -3' },
      { key: 'B', text: '-4 atau 3', isCorrect: true },
      { key: 'C', text: '-3 atau 4' },
      { key: 'D', text: '3 atau 4' }
    ],
    correctAnswer: 'B',
    explanation: '$$|\\vec{AB}|^2 = (2m)^2 + (m+3)^2 + m^2 = 81$$\n$$4m^2 + m^2 + 6m + 9 + m^2 = 81 \\implies 6m^2 + 6m - 72 = 0$$\n$$m^2 + m - 12 = 0 \\implies (m+4)(m-3) = 0 \\implies m = -4 \\text{ atau } m = 3$$.'
  },

  // SOAL 13: Operasi Vektor Trapesium Sama Kaki
  {
    id: 413,
    type: 'single',
    questionText: 'Diketahui trapesium sama kaki $ABCD$ dengan $AD = BC$ dan titik $A(0,0)$.\nVektor posisi pembentuk trapesium: $\\vec{AD} = \\begin{pmatrix} 1 \\\\ 4 \\end{pmatrix}$, $\\vec{AB} = \\begin{pmatrix} 6 \\\\ 0 \\end{pmatrix}$, dan $\\vec{BC} = \\begin{pmatrix} a \\\\ b \\end{pmatrix}$.\n\nNilai dari $a^2 + 2b = ....$',
    options: [
      { key: 'A', text: '5' },
      { key: 'B', text: '7' },
      { key: 'C', text: '9', isCorrect: true },
      { key: 'D', text: '10' },
      { key: 'E', text: '13' }
    ],
    correctAnswer: 'C',
    explanation: 'Karena trapesium sama kaki $ABCD$, vektor $\\vec{BC} = \\begin{pmatrix} -1 \\\\ 4 \\end{pmatrix} \\implies a = -1, b = 4$.\nNilai $a^2 + 2b = (-1)^2 + 2(4) = 1 + 8 = 9$.'
  },

  // SOAL 14: Aplikasi Vektor Lintasan Kereta Api (MCMA)
  {
    id: 414,
    type: 'complex',
    questionText: 'Sebuah kereta api melaju dari stasiun A sampai E. Koordinat stasiun A(2, 3, 5) dan E(11, 6, 8) dalam km. Waktu tempuh antar stasiun: A-B (5 menit), B-C (3 menit), C-D (2 menit), D-E (3 menit).\n\nManakah stasiun-stasiun yang jaraknya kurang dari 3,5 km? (Pilih semua jawaban benar!)',
    options: [
      { key: 'A', text: 'AB' },
      { key: 'B', text: 'BC', isCorrect: true },
      { key: 'C', text: 'CD', isCorrect: true },
      { key: 'D', text: 'DE', isCorrect: true },
      { key: 'E', text: 'CE' }
    ],
    correctAnswers: ['B', 'C', 'D'],
    explanation: 'Total jarak A-E $= \\sqrt{9^2 + 3^2 + 3^2} = \\sqrt{99} \\approx 9{,}95\\text{ km}$.\nJarak segmen berbanding lurus waktu tempuh. Segmen BC (3 mnt), CD (2 mnt), dan DE (3 mnt) memiliki jarak kurang dari $3{,}5\\text{ km}$.'
  },

  // SOAL 15: Persamaan Lingkaran Sepusat
  {
    id: 415,
    type: 'single',
    questionText: 'Perhatikan gambar Lingkaran A berpusat di $P(-3, 4)$ dengan diameter 4 satuan.\n\nPersamaan lingkaran yang sepusat dengan lingkaran A adalah ....',
    options: [
      { key: 'A', text: 'x² + 6x + y² - 8y + 16 = 0', isCorrect: true },
      { key: 'B', text: 'x² - 6x + y² - 8y + 21 = 0' },
      { key: 'C', text: 'x² + 6x + y² + 8y + 16 = 0' },
      { key: 'D', text: 'x² - 8x + y² - 6y + 16 = 0' },
      { key: 'E', text: 'x² + 8x + y² - 6y + 21 = 0' }
    ],
    correctAnswer: 'A',
    explanation: 'Pusat lingkaran $(a,b) = (-3,4) \\implies (x+3)^2 + (y-4)^2 = R^2 \\implies x^2 + 6x + y^2 - 8y + 25 - R^2 = 0$.\nUntuk $R = 3$, diperoleh $x^2 + 6x + y^2 - 8y + 16 = 0$.'
  },

  // SOAL 16: Titik Singgung Lingkaran Tegak Lurus Garis (MCMA)
  {
    id: 416,
    type: 'complex',
    questionText: 'Sebuah lingkaran berpusat di $A(2, -3)$ dan melalui titik $B(3, -1)$. Garis $f$ melalui titik $C(-1,0)$ dan $D(0,2)$.\n\nTentukan semua koordinat titik singgung lingkaran dari garis-garis singgung lingkaran yang tegak lurus terhadap garis $f$! (Pilih semua jawaban benar!)',
    options: [
      { key: 'A', text: '(3, 1)' },
      { key: 'B', text: '(1, -5)', isCorrect: true },
      { key: 'C', text: '(-1, 5)' },
      { key: 'D', text: '(3, -1)', isCorrect: true },
      { key: 'E', text: '(-3, -1)' }
    ],
    correctAnswers: ['B', 'D'],
    explanation: 'Persamaan lingkaran $(x-2)^2 + (y+3)^2 = 5$. Gradien garis $f = 2 \\implies m_{\\text{singgung}} = -1/2$.\nTitik singgung berada di $(3, -1)$ dan $(1, -5)$.'
  },

  // SOAL 17: Luas Daerah Lingkaran Rambu Lalu Lintas (MCMA)
  {
    id: 417,
    type: 'complex',
    questionText: 'Gambar rambu lalu lintas balai pertolongan pertama berbentuk lingkaran diameter luar $40\\text{ cm}$ ($R=20$) dengan bidang persegi $40\\text{ cm} \\times 40\\text{ cm}$. Di tengah terdapat palang silang merah berukuran $10\\text{ cm} \\times 40\\text{ cm}$.\n\nCat warna apakah yang lebih banyak digunakan dibanding cat warna hitam? (Pilih semua jawaban benar!)',
    options: [
      { key: 'A', text: 'Setengah hitam dan biru.' },
      { key: 'B', text: 'Setengah hitam dan merah.' },
      { key: 'C', text: 'Setengah hitam dan putih.' },
      { key: 'D', text: 'Biru dan putih.', isCorrect: true },
      { key: 'E', text: 'Biru dan merah.', isCorrect: true }
    ],
    correctAnswers: ['D', 'E'],
    explanation: 'Luas area biru dan merah mendominasi permukaan rambu dibanding area hitam di sekeliling bingkai.'
  },

  // SOAL 18: Kaca Patri & Kerangka Logam (Matriks)
  {
    id: 418,
    type: 'matrix',
    questionText: 'Pak Baskara membuat daun pintu dengan ornamen kaca patri bulat di tengahnya (luas 1 potong kaca merah $= 456\\text{ cm}^2$, $\\pi \\approx 3{,}14$). Kerangka dibuat dari batang logam:\n- Logam A: 4 m\n- Logam B: 5 m\n- Logam C: 6,5 m\n\nTentukan apakah pilihan logam yang dibeli Pak Baskara Pas atau Tidak Pas!',
    matrixHeaders: ['Pilihan Logam', 'Pas', 'Tidak Pas'],
    matrixRows: [
      { id: 'row-1', text: 'Membeli 2 buah logam A', correct: 'Tidak Pas' },
      { id: 'row-2', text: 'Membeli 1 buah logam B', correct: 'Pas' },
      { id: 'row-3', text: 'Membeli 1 buah logam C', correct: 'Pas' }
    ],
    explanation: 'Kebutuhan kerangka logam $\\approx 4{,}8\\text{ meter}$.\n- Logam A (4 m) kurang $\\implies 2$ buah ($8\\text{ m}$) sisa terlalu banyak (Tidak Pas).\n- Logam B (5 m) cukup pas (Pas).\n- Logam C (6,5 m) cukup (Pas).'
  },

  // SOAL 19: Transformasi Refleksi & Translasi Garis
  {
    id: 419,
    type: 'single',
    questionText: 'Apabila garis $ax + y - 9 = 0$ dan $x + by + 6 = 0$ dicerminkan terhadap garis $y = x$ kemudian dilanjutkan translasi $T\\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix}$ menghasilkan bayangan garis berturut-turut $x + 2y - 8 = 0$ dan $2x - y - 9 = 0$.\n\nNilai dari $2a - b = ....$',
    options: [
      { key: 'A', text: '-6' },
      { key: 'B', text: '-2' },
      { key: 'C', text: '0' },
      { key: 'D', text: '2' },
      { key: 'E', text: '6', isCorrect: true }
    ],
    correctAnswer: 'E',
    explanation: 'Refleksi $y=x$ memetakan $(x,y) \\to (y,x)$, diikuti translasi $(1,-1)$ memetakan $(x\'+1, y\'-1)$.\nDiperoleh nilai $a = 2$ dan $b = -2$.\nNilai $2a - b = 2(2) - (-2) = 4 + 2 = 6$.'
  },

  // SOAL 20: Transformasi Lingkaran Translasi & Dilatasi
  {
    id: 420,
    type: 'single',
    questionText: 'Lingkaran $L$ memiliki pusat di $(-5, 3)$ dan jari-jari 2. Lingkaran $L\'$ dengan persamaan $(x+4)^2 + (y-4)^2 = 16$ adalah bayangan dari $L$ setelah dilakukan translasi $T$ dan dilatasi dengan pusat $O(0,0)$ faktor skala $k$.\n\nPernyataan yang benar mengenai translasi T dan faktor skala dilatasi adalah ....',
    options: [
      { key: 'A', text: 'T = [3; -1] dan skala dilatasi 8' },
      { key: 'B', text: 'T = [3; -1] dan skala dilatasi 4' },
      { key: 'C', text: 'T = [3; -1] dan skala dilatasi 2', isCorrect: true },
      { key: 'D', text: 'T = [1; 1] dan skala dilatasi 2' },
      { key: 'E', text: 'T = [1; 1] dan skala dilatasi 8' }
    ],
    correctAnswer: 'C',
    explanation: 'Jari-jari awal $r = 2$, jari-jari bayangan $R = \\sqrt{16} = 4 \\implies$ skala dilatasi $k = 4/2 = 2$.\nPusat $(-5,3) + T(3,-1) = (-2,2)$, setelah didilatasi 2 menjadi $(-4,4)$. Maka $T = \\begin{pmatrix} 3 \\\\ -1 \\end{pmatrix}$.'
  },

  // SOAL 21: Transformasi Rotasi Garis (MCMA)
  {
    id: 421,
    type: 'complex',
    questionText: 'Garis $l$ merupakan bayangan garis $3x + 2y = 6$ dirotasikan sejauh $90^\\circ$ berlawanan arah jarum jam dengan pusat rotasi $(2,0)$.\n\nManakah koordinat titik yang terletak pada garis $l$? (Pilih semua jawaban benar!)',
    options: [
      { key: 'A', text: '(-3, -2)' },
      { key: 'B', text: '(-2, -1)' },
      { key: 'C', text: '(1, 2)', isCorrect: true },
      { key: 'D', text: '(2, 0)', isCorrect: true },
      { key: 'E', text: '(5, 2)' }
    ],
    correctAnswers: ['C', 'D'],
    explanation: 'Persamaan garis bayangan $l$ setelah rotasi $90^\\circ$ pusat $(2,0)$ adalah $-2x + 3y = -4 \\implies 2x - 3y = 4$.\nTitik (1,2) dan (2,0) memenuhi persamaan garis tersebut.'
  },

  // SOAL 22: Limit Fungsi Aljabar Pecahan Rasional
  {
    id: 422,
    type: 'single',
    questionText: 'Nilai dari $$\\lim_{x \\to 3} \\frac{x^3 - 3x^2 + 2x + 1}{5 + 3x - 9x^2}$$ adalah ....',
    options: [
      { key: 'A', text: '-7/67', isCorrect: true },
      { key: 'B', text: '-6/67' },
      { key: 'C', text: '6/76' },
      { key: 'D', text: '7/67' },
      { key: 'E', text: '7/76' }
    ],
    correctAnswer: 'A',
    explanation: 'Substitusi langsung $x = 3$:\n- Pembilang: $3^3 - 3(3^2) + 2(3) + 1 = 27 - 27 + 6 + 1 = 7$.\n- Penyebut: $5 + 3(3) - 9(3^2) = 5 + 9 - 81 = -67$.\nLimit $= -\\frac{7}{67}$.'
  },

  // SOAL 23: Limit Tak Tentu Nasi Goreng Roni
  {
    id: 423,
    type: 'single',
    questionText: 'Roni, penjual nasi goreng, menjual dagangannya sebanyak $p$ porsi dan akan memperoleh keuntungan (dalam jutaan rupiah) yang dapat dinyatakan dengan fungsi:\n$$K(p) = \\frac{9p^2 + 2p + 10}{3p^2 + 3p + 2}$$\n\nKeuntungan yang akan diperoleh Roni apabila dia menjual nasi goreng dengan porsi sangat banyak ($p \\to \\infty$) adalah ....',
    options: [
      { key: 'A', text: 'Rp2.000.000,00' },
      { key: 'B', text: 'Rp3.000.000,00', isCorrect: true },
      { key: 'C', text: 'Rp5.000.000,00' },
      { key: 'D', text: 'Rp9.000.000,00' },
      { key: 'E', text: 'Rp10.000.000,00' }
    ],
    correctAnswer: 'B',
    explanation: '$$\\lim_{p \\to \\infty} \\frac{9p^2 + 2p + 10}{3p^2 + 3p + 2} = \\frac{9}{3} = 3\\text{ juta rupiah} = \\text{Rp}3.000.000,00$$.'
  },

  // SOAL 24: Limit Trigonometri Kerucut Es Krim (MCMA)
  {
    id: 424,
    type: 'complex',
    questionText: 'Sebuah setengah lingkaran dengan diameter $AB = 2\\pi$ terletak pada segitiga sama kaki ABC sehingga membentuk daerah berbentuk kerucut es krim.\nJika luas segitiga ABC dinyatakan dengan $X$ dan luas setengah lingkaran dinyatakan dengan $Y$, manakah pernyataan yang benar tentang nilai $\\lim_{\\theta \\to a} \\frac{X}{Y}$? (Pilih semua jawaban benar!)',
    options: [
      { key: 'A', text: 'Besar jari-jari mempengaruhi nilai limit.' },
      { key: 'B', text: 'Besar sudut tidak mempengaruhi nilai limit.', isCorrect: true },
      { key: 'C', text: 'Nilai X/Y selalu sama untuk berapapun θ.' },
      { key: 'D', text: 'lim_{θ -> π/6} (X/Y) = 2/π', isCorrect: true },
      { key: 'E', text: 'Jika θ = π maka X/Y = 0.' }
    ],
    correctAnswers: ['B', 'D'],
    explanation: 'Nilai perbandingan limit trigonometri $\\lim_{\\theta \\to \\frac{\\pi}{6}} \\frac{X}{Y} = \\frac{2}{\\pi}$ dan tidak tergantung besarnya sudut.'
  },

  // SOAL 25: Limit Trigonometri Terhingga
  {
    id: 425,
    type: 'single',
    questionText: 'Nilai dari $$\\lim_{x \\to 3} \\frac{1 - \\cos(6x - 18)}{(x - 3)\\sin(6x - 18)}$$ adalah ....',
    options: [
      { key: 'A', text: '-3/2' },
      { key: 'B', text: '-2/3' },
      { key: 'C', text: '0' },
      { key: 'D', text: '2/3' },
      { key: 'E', text: '3/2', isCorrect: true }
    ],
    correctAnswer: 'E',
    explanation: 'Gunakan pemisalan $u = 6x - 18 = 6(x-3) \\implies x-3 = \\frac{u}{6}$. Saat $x \\to 3$, $u \\to 0$.\n$$\\lim_{u \\to 0} \\frac{1 - \\cos u}{\\frac{u}{6} \\sin u} = \\lim_{u \\to 0} \\frac{2 \\sin^2(u/2)}{\\frac{u}{6} \\sin u} = 2 \\times \\frac{(1/2)^2}{\\frac{1}{6} \\times 1} = 2 \\times \\frac{6}{4} = \\frac{3}{2}$$.'
  }
];
