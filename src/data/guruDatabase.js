// DATABASE MASTER GURU / PROKTOR / ADMIN LENGKAP SMK ADI SUMARMO (51 GURU)
const GURU_STORAGE_KEY = 'ANBK_GURU_DATABASE_V1';

export const INITIAL_GURU_DATA = [
  {
    id: 'G-001',
    niy: '480805090705',
    nama: 'YOTO SARJONO SARGI',
    mapel: '-',
    jabatan: 'Guru / Staf',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '05-08-1948',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'GAWANAN RT 03 RW 07 COLOMADU KARANGANYAR'
  },
  {
    id: 'G-002',
    niy: '591028020702',
    nama: 'Drs. HARYANTO',
    mapel: '-',
    jabatan: 'Guru / Staf',
    waliKelas: '-',
    tempatLahir: 'SURAKARTA',
    tglLahir: '28-10-1959',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'PERUM MADU ASRI BLOK C NO. 54 RT.01 RW.09 GAWANAN CO'
  },
  {
    id: 'G-003',
    niy: '600315980602',
    nama: 'Drs. ATMANTO',
    mapel: 'Bahasa Indonesia',
    jabatan: 'Tatib',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '15-03-1960',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'PAULAN RT 01 RW 04 COLOMADU KARANGANYAR'
  },
  {
    id: 'G-004',
    niy: '611009950600',
    nama: 'Drs. SUWARNO',
    mapel: 'Penjaskes, Bahasa Jawa',
    jabatan: 'Tatib',
    waliKelas: 'XI TKR E',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '09-10-1961',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'TROWANGSAN RT 05 RW 02 COLOMADU KARANGANYAR'
  },
  {
    id: 'G-005',
    niy: '650415950600',
    nama: 'Dra. SRI PRAMESTI',
    mapel: 'Pend. Agama Islam',
    jabatan: 'Kepala Perpustakaan',
    waliKelas: 'XII TKR C',
    tempatLahir: 'SUKOHARJO',
    tglLahir: '15-04-1965',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'YOSODIPURAN RT.05/III, KEDUNGLUMBU, PASAR KLIWON, SURAKARTA'
  },
  {
    id: 'G-006',
    niy: '660318040704',
    nama: 'SUTRISNO, ST',
    mapel: 'Komli TKR',
    jabatan: 'Kabeng Chasis',
    waliKelas: 'XII TKR A',
    tempatLahir: 'SUKOHARJO',
    tglLahir: '18-03-1966',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'GENTAN, RT. 01/ III, BAKI, SUKOHARJO'
  },
  {
    id: 'G-007',
    niy: '660221950601',
    nama: 'Hj. SUDARWASTUTI, SE',
    mapel: '-',
    jabatan: 'Guru / Staf',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '21-02-1966',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'PERUM MADU ASRI, BLOK.A, NO. 66, GAWANAN,COLOMADU'
  },
  {
    id: 'G-008',
    niy: '670629000702',
    nama: 'H. PAIDI, S.Ag',
    mapel: 'Pend. Agama Islam',
    jabatan: 'Koordinator Tatib, Pembina Rohis',
    waliKelas: '-',
    tempatLahir: 'BOYOLALI',
    tglLahir: '29-06-1967',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'KEBONAGUNG, RT.02/IV,NGESREP, NGEMPLAK, BOYOLALI'
  },
  {
    id: 'G-009',
    niy: '670608070704',
    nama: 'TUGIMIN, S.Ag',
    mapel: 'Pend. Agama Islam',
    jabatan: 'Guru / Staf',
    waliKelas: '-',
    tempatLahir: 'BOYOLALI',
    tglLahir: '08-06-1967',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'KEBONAGUNG RT 03 RW04 NGESREP NGEMPLAK BOYOLALI'
  },
  {
    id: 'G-010',
    niy: '680802040704',
    nama: 'JAMIATUN',
    mapel: '-',
    jabatan: 'Staf / Pengadministrasi',
    waliKelas: '-',
    tempatLahir: 'BOYOLALI',
    tglLahir: '02-08-1968',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'SEMPOL POTRONAYAN RT 03 RW II NOGOSARI BOYOLALI'
  },
  {
    id: 'G-011',
    niy: '680213120705',
    nama: 'BUDI RAHARJA',
    mapel: '-',
    jabatan: 'Guru / Staf',
    waliKelas: '-',
    tempatLahir: 'KLATEN',
    tglLahir: '13-02-1968',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'JETAKAN RT 02 RW 01 JATISARI SAMBI BOYOLALI'
  },
  {
    id: 'G-012',
    niy: '690910950600',
    nama: 'KASIMIN, S.Pd',
    mapel: 'IPAS, Komli TKR',
    jabatan: 'Ketua BKK',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '10-09-1969',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'GRIYAN RT 02 RW 02 BATURAN COLOMADU KARANGANYAR'
  },
  {
    id: 'G-013',
    niy: '690421960702',
    nama: 'SAPTONO, S.Pd',
    mapel: 'Komli TKR',
    jabatan: 'Kepala Sekolah',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '21-04-1969',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'PAULAN TIMUR RT 04 RW 02 COLOMADU KARANGANYAR'
  },
  {
    id: 'G-014',
    niy: '700803200708',
    nama: 'SRI NURYATI, S.Pd',
    mapel: 'Bahasa Indonesia',
    jabatan: 'Guru / Staf',
    waliKelas: 'XI TKJ B',
    tempatLahir: 'SUKOHARJO',
    tglLahir: '03-08-1970',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'DUKUH ROJONITEN, RT 03 RW 01, NGEMPLAK, KARTASURA, SUKOHARJO'
  },
  {
    id: 'G-015',
    niy: '710110960701',
    nama: 'PURWANTO, S.Si',
    mapel: 'Matematika, Bhs Jawa',
    jabatan: 'Pengajaran',
    waliKelas: 'XII TKR E',
    tempatLahir: 'BOYOLALI',
    tglLahir: '10-01-1971',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'DONOHUDAN RT 03 RW 04 NGEMPLAK BOYOLALI'
  },
  {
    id: 'G-016',
    niy: '710921960702',
    nama: 'SRI SUPRIYATI, S.Pd',
    mapel: 'Bahasa Inggris',
    jabatan: 'Guru / Staf',
    waliKelas: 'XI TAV',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '21-09-1971',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'NGARGOREJO, NGEMPLAK, BOYOLALI'
  },
  {
    id: 'G-017',
    niy: '710505950601',
    nama: 'INDRA WIDIYATI',
    mapel: '-',
    jabatan: 'Staf / Pengadministrasi',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '05-05-1971',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'PAULAN, RT.04/II, COLOMADU, KARANGANYAR'
  },
  {
    id: 'G-018',
    niy: '720313010702',
    nama: 'Hj. TITIS RAHAYU, ST',
    mapel: 'Dasar-dasar dan Komli TKR',
    jabatan: 'Guru / Staf',
    waliKelas: 'XI TKR B',
    tempatLahir: 'PURBALINGGA',
    tglLahir: '13-03-1972',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'KEBONAGUNG, RT.02/IV,NGESREP, NGEMPLAK, BOYOLALI'
  },
  {
    id: 'G-019',
    niy: '730323980702',
    nama: 'CATUR HARYATMO, SS',
    mapel: 'Bhs Inggris, PA Kristen',
    jabatan: 'Ka Lab. Bhs Inggris',
    waliKelas: 'XII TKR B',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '23-03-1973',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Kristen',
    alamat: 'GAWANAN, RT.01/II, COLOMADU, KARANGANYAR'
  },
  {
    id: 'G-020',
    niy: '730107950600',
    nama: 'EKO WARPIJIANTO',
    mapel: '-',
    jabatan: 'Guru / Staf',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '07-01-1973',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'TOHUDAN,RT.01/II, COLOMADU, KARANGANYAR'
  },
  {
    id: 'G-021',
    niy: '730906960701',
    nama: 'SRI SUNARSIH',
    mapel: '-',
    jabatan: 'Guru / Staf',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '06-09-1973',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'TOHUDAN,RT.01/II, COLOMADU, KARANGANYAR'
  },
  {
    id: 'G-022',
    niy: '730609230908',
    nama: 'SUTARDI',
    mapel: '-',
    jabatan: 'Guru / Staf',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '09-06-1973',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'NGERANGAN RT01 RW03 GAWANAN COLOMADU KARANGANYAR'
  },
  {
    id: 'G-023',
    niy: '740317040703',
    nama: 'ROCHMAD, S.Pd',
    mapel: 'Penjaskes',
    jabatan: 'Operator Dapodik',
    waliKelas: '-',
    tempatLahir: 'SUKOHARJO',
    tglLahir: '17-03-1974',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'KUTUT RT 03 RW 05 COMBONGAN SUKOHARJO'
  },
  {
    id: 'G-024',
    niy: '740831980602',
    nama: 'SARTONO',
    mapel: '-',
    jabatan: 'Guru / Staf',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '31-08-1974',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'GAWANAN TIMUR RT 04 RW 07 COLOMADU KARANGANYAR'
  },
  {
    id: 'G-025',
    niy: '760826060704',
    nama: 'Th. YENI SRI HABSARI. S.Pd',
    mapel: 'Komli TKJ',
    jabatan: 'Wakil Kepala Sekolah Humas',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '26-08-1976',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'KARANGASEM, GG SAWO III NO.8, RT.02/IV, LAWEYAN, SURAKARTA'
  },
  {
    id: 'G-026',
    niy: '770310040703',
    nama: 'BAKRI ROYANI, S.PdT',
    mapel: 'Dasar-dasar Elektronika',
    jabatan: 'Guru / Staf',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '10-03-1977',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'PILANGAN, BATURAN, RT.04/VI, COLOMADU, KARANGANYAR'
  },
  {
    id: 'G-027',
    niy: '771102070704',
    nama: 'ERNI NOVIYANTI',
    mapel: '-',
    jabatan: 'Staf / Pengadministrasi',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '02-11-1977',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'GAWANAN RT 03 RW 07 COLOMADU KARANGANYAR'
  },
  {
    id: 'G-028',
    niy: '790529030803',
    nama: 'YULI ASTUTI, S.Pd',
    mapel: 'IPAS, Kewirausahaan',
    jabatan: 'Ka Lab. IPA, Pembantu Bendahara BOS',
    waliKelas: 'XI TKR D',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '29-05-1979',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'KARANGDOWO, RT 02 RW 02, PUGERAN, KARANGDOWO, KLATEN'
  },
  {
    id: 'G-029',
    niy: '790319030703',
    nama: 'SULISTYOWATI, SE',
    mapel: 'Kewirausahaan',
    jabatan: 'Guru / Staf',
    waliKelas: 'XII TKJ',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '19-03-1979',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'PAULAN, RT. 01/II, NO.72, COLOMADU, KARANGANYAR'
  },
  {
    id: 'G-030',
    niy: '800503070705',
    nama: 'DWI HARTANTO, ST',
    mapel: 'Komli TKR',
    jabatan: 'Kakomli TKR',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '03-05-1980',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'JETAK RT 02 RW 03 WONOREJO GONDANGREJO KARANGANYAR'
  },
  {
    id: 'G-031',
    niy: '801217240708',
    nama: 'RAHMI MEUTHIA, S.Si',
    mapel: 'Pend. Pancasila, Sejarah',
    jabatan: 'Pengajaran',
    waliKelas: 'XI TKR A',
    tempatLahir: 'SIGLI',
    tglLahir: '17-12-1980',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'JL. PATIMURA 151, RT03 RW 09, SERENGAN, SURAKARTA'
  },
  {
    id: 'G-032',
    niy: '820306010702',
    nama: 'SUGIYANTO',
    mapel: '-',
    jabatan: 'Guru / Staf',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '06-03-1982',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'GAWANAN TIMUR RT 04 RW 07 COLOMADU KARANGANYAR'
  },
  {
    id: 'G-033',
    niy: '830823121006',
    nama: 'HARTONO, S.Pd',
    mapel: 'Komli TKR',
    jabatan: 'Kabeng Engine, Wakil BKK',
    waliKelas: 'XII TKR F',
    tempatLahir: 'BOYOLALI',
    tglLahir: '23-08-1983',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'PERUM MADU ASRI BLOK C76 GAWANAN COLOMADU'
  },
  {
    id: 'G-034',
    niy: '841012070705',
    nama: 'DARMANTO, S.Pd',
    mapel: 'Matematika, Bhs Jawa',
    jabatan: 'Wakil Kepala Sekolah Kesiswaan',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '12-10-1984',
    gender: 'Laki-laki',
    statusNikah: 'Belum Nikah',
    agama: 'Islam',
    alamat: 'GAWANAN RT 04 RW 07 COLOMADU KARANGANYAR'
  },
  {
    id: 'G-035',
    niy: '840304120706',
    nama: 'DHANAR DHONO, ST., M.Pd.',
    mapel: 'Komli TKR',
    jabatan: 'Kabeng Listrik',
    waliKelas: 'XII TKR D',
    tempatLahir: 'SUKOHARJO',
    tglLahir: '04-03-1984',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'JL. LAWU NO.6 BANARAN GROGOL SKH'
  },
  {
    id: 'G-036',
    niy: '840303100705',
    nama: 'SUTOPO SETIYADI, A.Md',
    mapel: '-',
    jabatan: 'Guru / Staf Teknisi',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '03-03-1984',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'GAWANAN RT 01 RW 07 COLOMADU KARANGANYAR'
  },
  {
    id: 'G-037',
    niy: '851129070705',
    nama: 'MURNINGSIH, S.Pd',
    mapel: 'Matematika, Sejarah',
    jabatan: 'Pembina OSIS, Bendahara BOSDA',
    waliKelas: 'XI TKR F',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '29-11-1985',
    gender: 'Perempuan',
    statusNikah: 'Belum Nikah',
    agama: 'Islam',
    alamat: 'GAWANAN RT 03 RW 07 COLOMADU KARANGANYAR'
  },
  {
    id: 'G-038',
    niy: '860326060704',
    nama: 'TRI RAHAYU, S.Pd',
    mapel: 'BP/BK kelas X',
    jabatan: 'Petugas Perpustakaan',
    waliKelas: 'X TKR D',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '26-03-1986',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'GAWANAN RT 03 RW 07 COLOMADU KARANGANYAR'
  },
  {
    id: 'G-039',
    niy: '880918140706',
    nama: 'SEPTIAN PANDU REZA BHAKTI, S.Kom',
    mapel: 'Komli TAV',
    jabatan: 'Kakomli TAV',
    waliKelas: '-',
    tempatLahir: 'SUKOHARJO',
    tglLahir: '18-09-1988',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'PERUM CENGKLIK PERMATA ASRI KAV. 36, NGARGOREJO, BOYOLALI'
  },
  {
    id: 'G-040',
    niy: '880416260109',
    nama: 'ASIH SRI PATMINI, S.Pd',
    mapel: 'Bahasa Inggris',
    jabatan: 'Petugas Pengelola Pajak & Inventarisasi',
    waliKelas: 'X TKR A',
    tempatLahir: 'BOYOLALI',
    tglLahir: '16-04-1988',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'GUMUK SARI RT03 RW05, PUCANGAN, KARTASURA, SUKOHARJO'
  },
  {
    id: 'G-041',
    niy: '901112150707',
    nama: 'CAHYA NOVENTA KUSUMARINI, S.Pd., M.Pd.',
    mapel: 'Bahasa Indonesia',
    jabatan: 'Guru / Staf',
    waliKelas: 'X TAV',
    tempatLahir: 'SURAKARTA',
    tglLahir: '12-11-1990',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'PERUM MADU ASRI BLOK A/22 RT 02 RW 08 GAWANAN COLOMADU'
  },
  {
    id: 'G-042',
    niy: '911027170707',
    nama: 'RISAL ARDI PRATAMA, S.Pd',
    mapel: 'BP/BK kelas XII',
    jabatan: 'Pembina OSIS',
    waliKelas: 'XII TAV',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '27-10-1991',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'KREMBYONGAN, RT 02 RW 07, KADIPIRO, BANJARSARI, SURAKARTA'
  },
  {
    id: 'G-043',
    niy: '921113160707',
    nama: 'RAHMAWATI NUR HIDAYAH, S.Kom',
    mapel: 'Informatika',
    jabatan: 'WKS. Sarpras, KaLab KKPI',
    waliKelas: 'X TKJ',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '13-11-1992',
    gender: 'Perempuan',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'GAWANAN TIMUR, RT 03 RW 07, GAWANAN, COLOMADU'
  },
  {
    id: 'G-044',
    niy: '920401170707',
    nama: 'PRASETYO AJI SAPUTRO, S.Kom',
    mapel: 'Komli TKJ',
    jabatan: 'Kakomli TKJ, Bendahara BOS Pusat',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '01-04-1992',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'GAWANAN TIMUR, RT 04 RW 07, GAWANAN, COLOMADU'
  },
  {
    id: 'G-045',
    niy: '960509190708',
    nama: 'RIFQI ARIF ZAINUDIN, S.Pd',
    mapel: 'Komli TKR',
    jabatan: 'Wakil Kepala Sekolah Kurikulum',
    waliKelas: '-',
    tempatLahir: 'KLATEN',
    tglLahir: '09-05-1996',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'NGAWEN, RT. 15, RW. 08, SIDOWARNO, WONOSARI, KLATEN'
  },
  {
    id: 'G-046',
    niy: '960322190708',
    nama: 'ULIL ALBAB, ST',
    mapel: 'Komli TKR',
    jabatan: 'PIC PBD',
    waliKelas: 'X TKR E',
    tempatLahir: 'BOYOLALI',
    tglLahir: '22-03-1996',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: 'TANDUK, RT. 08 RW. 01, TANDUK, AMPEL, BOYOLALI'
  },
  {
    id: 'G-047',
    niy: '960520250709',
    nama: 'FARIDA FAUSYAH, S.Sos',
    mapel: 'Pend. Pancasila, Sejarah',
    jabatan: 'Guru / Staf',
    waliKelas: 'XI TKR C',
    tempatLahir: 'SUKOHARJO',
    tglLahir: '20-05-1996',
    gender: 'Perempuan',
    statusNikah: 'Belum Nikah',
    agama: 'Islam',
    alamat: 'DS. KAJEN RT01 RW04, KEL.GROGOL,KEC.GROGOL,KAB.SUKOHARJO'
  },
  {
    id: 'G-048',
    niy: '000202250709',
    nama: 'FAISHAL AZIZ AL AMMAR, ST',
    mapel: 'Komli TKR',
    jabatan: 'Kabeng Dasar Otomotif',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '02-02-2000',
    gender: 'Laki-laki',
    statusNikah: 'Belum Nikah',
    agama: 'Islam',
    alamat: 'SIDOREJO RT01 RW10,SELOKATON,GONDANGREJO,KARANGANYAR'
  },
  {
    id: 'G-049',
    niy: '000117260109',
    nama: 'RYAN SAMPURNA, S.S',
    mapel: 'Seni Budaya, Bhs. Jawa',
    jabatan: 'Guru / Staf',
    waliKelas: 'X TKR B',
    tempatLahir: 'SURAKARTA',
    tglLahir: '17-01-2000',
    gender: 'Laki-laki',
    statusNikah: 'Belum Nikah',
    agama: 'Kristen',
    alamat: 'JL. NAYU 11, RT01 RW12, NUSUKAN, SURAKARTA'
  },
  {
    id: 'G-050',
    niy: '010714250709',
    nama: 'TIARA CARABELA SAPUTRI, S.Psi',
    mapel: 'BP/BK',
    jabatan: 'Guru / Staf',
    waliKelas: 'XI TKJ A',
    tempatLahir: 'KLATEN',
    tglLahir: '14-07-2001',
    gender: 'Perempuan',
    statusNikah: 'Belum Nikah',
    agama: 'Islam',
    alamat: 'TEGALWEDEN,RT02 RW05, TEGALGONDO ,WONOSARI,KLATEN'
  },
  {
    id: 'G-051',
    niy: '020818250709',
    nama: 'LILIK SETYO PAMBUDI',
    mapel: 'Komli TKR',
    jabatan: 'Pembina Pramuka',
    waliKelas: '-',
    tempatLahir: 'WONOGIRI',
    tglLahir: '18-08-2002',
    gender: 'Laki-laki',
    statusNikah: 'Belum Nikah',
    agama: 'Islam',
    alamat: 'BANGSRI, PURWANTORO, WONOGIRI, JAWA TENGAH'
  }
];

export const DEFAULT_TEACHER_PASSWORD = 'S4l4m2Periode';

export function validatePasswordStrength(pwd) {
  if (!pwd) return { valid: false, message: 'Password tidak boleh kosong.' };
  if (pwd.length > 8) return { valid: false, message: 'Password maksimal 8 karakter!' };
  if (pwd.length < 4) return { valid: false, message: 'Password minimal 4 karakter.' };
  if (!/[A-Z]/.test(pwd)) return { valid: false, message: 'Password harus mengandung minimal 1 huruf besar (A-Z).' };
  if (!/[a-z]/.test(pwd)) return { valid: false, message: 'Password harus mengandung minimal 1 huruf kecil (a-z).' };
  if (!/[0-9]/.test(pwd)) return { valid: false, message: 'Password harus mengandung minimal 1 angka (0-9).' };
  return { valid: true, message: '' };
}

export function getGuruData() {
  const saved = localStorage.getItem(GURU_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Automatically migration/update if structure or length expanded to 51
      if (Array.isArray(parsed) && parsed.length >= 51 && parsed[0].niy) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing guru database:', e);
    }
  }
  // Initialize with complete 51 records
  localStorage.setItem(GURU_STORAGE_KEY, JSON.stringify(INITIAL_GURU_DATA));
  return INITIAL_GURU_DATA;
}

export function saveGuruItem(guruObj) {
  const all = getGuruData();
  const index = all.findIndex(g => g.id === guruObj.id || (guruObj.niy && g.niy === guruObj.niy));

  if (index >= 0) {
    all[index] = { ...all[index], ...guruObj };
  } else {
    all.push({
      id: `G-${String(all.length + 1).padStart(3, '0')}`,
      niy: guruObj.niy || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      gender: guruObj.gender || 'Laki-laki',
      statusNikah: guruObj.statusNikah || 'Nikah',
      agama: guruObj.agama || 'Islam',
      password: DEFAULT_TEACHER_PASSWORD,
      isMustChangePassword: true,
      ...guruObj
    });
  }

  localStorage.setItem(GURU_STORAGE_KEY, JSON.stringify(all));
  return all;
}

export function deleteGuruItem(guruId) {
  const all = getGuruData();
  const filtered = all.filter(g => g.id !== guruId);
  localStorage.setItem(GURU_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

export function resetGuruData() {
  localStorage.setItem(GURU_STORAGE_KEY, JSON.stringify(INITIAL_GURU_DATA));
  return INITIAL_GURU_DATA;
}

export function resetGuruPassword(guruId) {
  const all = getGuruData();
  const index = all.findIndex(g => g.id === guruId || g.niy === guruId);
  if (index >= 0) {
    all[index].password = DEFAULT_TEACHER_PASSWORD;
    all[index].isMustChangePassword = true;
    localStorage.setItem(GURU_STORAGE_KEY, JSON.stringify(all));
  }
  return all;
}

export function updateGuruPassword(guruId, newPassword) {
  const all = getGuruData();
  const index = all.findIndex(g => g.id === guruId || g.niy === guruId);
  if (index >= 0) {
    all[index].password = newPassword;
    all[index].isMustChangePassword = false;
    localStorage.setItem(GURU_STORAGE_KEY, JSON.stringify(all));
  }
  return all;
}

