// DATABASE MASTER MATA PELAJARAN (WAJIB & PILIHAN) ANBK
const MAPEL_STORAGE_KEY = 'ANBK_MAPEL_DATABASE_V1';

export const JENJANG_OPTIONS = [
  { id: 'sma', label: 'SMA/MA/SMK/MAK/Sederajat', hasJenisMapel: true },
  { id: 'smp', label: 'SMP/MTs/Sederajat', hasJenisMapel: false },
  { id: 'sd', label: 'SD/MI/Sederajat', hasJenisMapel: false },
];

export const JENIS_MAPEL_OPTIONS = [
  { id: 'wajib', label: 'Mata Pelajaran Wajib' },
  { id: 'pilihan', label: 'Mata Pelajaran Pilihan' },
];

export const INITIAL_MAPEL_DATABASE = {
  // SMA Wajib
  'sma-wajib': [
    { id: 'matematika', label: 'Matematika' },
    { id: 'b-indo', label: 'Bahasa Indonesia' },
    { id: 'b-ing', label: 'Bahasa Inggris' },
    { id: 'pancasila', label: 'Pendidikan Pancasila' },
  ],
  // SMA Pilihan (47 Mata Pelajaran Pilihan Lengkap)
  'sma-pilihan': [
    { id: 'matematika-tl', label: 'Matematika Tingkat Lanjut' },
    { id: 'fisika', label: 'Fisika' },
    { id: 'kimia', label: 'Kimia' },
    { id: 'biologi', label: 'Biologi' },
    { id: 'ekonomi', label: 'Ekonomi' },
    { id: 'sosiologi', label: 'Sosiologi' },
    { id: 'geografi', label: 'Geografi' },
    { id: 'sejarah', label: 'Sejarah' },
    { id: 'antropologi', label: 'Antropologi' },
    { id: 'pancasila-pilihan', label: 'Pendidikan Pancasila' },
    { id: 'indo-tl', label: 'Bahasa Indonesia Tingkat Lanjut' },
    { id: 'ing-tl', label: 'Bahasa Inggris Tingkat Lanjut' },
    { id: 'b-arab', label: 'Bahasa Arab' },
    { id: 'b-jepang', label: 'Bahasa Jepang' },
    { id: 'b-jerman', label: 'Bahasa Jerman' },
    { id: 'b-mandarin', label: 'Bahasa Mandarin' },
    { id: 'b-korea', label: 'Bahasa Korea' },
    { id: 'b-prancis', label: 'Bahasa Prancis' },
    { id: 'pkk', label: 'Projek Kreatif dan Kewirausahaan (PKK)' },
    { id: 'rpl', label: 'Pengembangan Perangkat Lunak dan Gim (RPL)' },
    { id: 'tkj', label: 'Teknik Jaringan Komputer dan Telekomunikasi (TKJ)' },
    { id: 'dkv', label: 'Desain Komunikasi Visual (DKV)' },
    { id: 'animasi', label: 'Animasi' },
    { id: 'teknik-mesin', label: 'Teknik Mesin' },
    { id: 'teknik-otomotif', label: 'Teknik Otomotif' },
    { id: 'teknik-pengelasan', label: 'Teknik Pengelasan' },
    { id: 'teknik-konstruksi', label: 'Teknik Konstruksi dan Perumahan' },
    { id: 'teknik-elektro', label: 'Teknik Elektro' },
    { id: 'teknik-perminyakan', label: 'Teknik Perminyakan' },
    { id: 'teknik-logistik', label: 'Teknik Logistik' },
    { id: 'akuntansi', label: 'Akuntansi dan Keuangan Lembaga' },
    { id: 'manajemen-perkantoran', label: 'Manajemen Perkantoran dan Layanan Bisnis' },
    { id: 'pemasaran', label: 'Pemasaran' },
    { id: 'perhotelan', label: 'Perhotelan' },
    { id: 'kuliner', label: 'Kuliner' },
    { id: 'busana', label: 'Busana' },
    { id: 'kecantikan-spa', label: 'Kecantikan dan Spa' },
    { id: 'layanan-kesehatan', label: 'Layanan Kesehatan' },
    { id: 'farmasi', label: 'Farmasi' },
    { id: 'pekerjaan-sosial', label: 'Pekerjaan Sosial' },
    { id: 'agribisnis-tanaman', label: 'Agribisnis Tanaman' },
    { id: 'agribisnis-perikanan', label: 'Agribisnis Perikanan' },
    { id: 'agribisnis-ternak', label: 'Agribisnis Ternak' },
    { id: 'nautika-kapal', label: 'Nautika Kapal Niaga' },
    { id: 'seni-rupa', label: 'Seni Rupa' },
    { id: 'seni-pertunjukan', label: 'Seni Pertunjukan' },
    { id: 'desain-kriya', label: 'Desain dan Produksi Kriya' },
  ],
  // SMP Sederajat
  'smp': [
    { id: 'mat-smp', label: 'Matematika - SMP Sederajat' },
    { id: 'indo-smp', label: 'Bahasa Indonesia - SMP Sederajat' },
    { id: 'ing-smp', label: 'Bahasa Inggris - SMP Sederajat' },
    { id: 'ipa-smp', label: 'IPA - SMP Sederajat' },
    { id: 'ips-smp', label: 'IPS - SMP Sederajat' },
  ],
  // SD Sederajat
  'sd': [
    { id: 'mat-sd', label: 'Matematika - SD Sederajat' },
    { id: 'indo-sd', label: 'Bahasa Indonesia - SD Sederajat' },
    { id: 'ipas-sd', label: 'IPAS - SD Sederajat' },
  ],
};

export function getMapelDatabase() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return INITIAL_MAPEL_DATABASE;
  }
  const saved = localStorage.getItem(MAPEL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed['sma-wajib']) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing mapel database:', e);
    }
  }
  localStorage.setItem(MAPEL_STORAGE_KEY, JSON.stringify(INITIAL_MAPEL_DATABASE));
  return INITIAL_MAPEL_DATABASE;
}

// Compatibility export after getMapelDatabase function is declared
export const MAPEL_DATABASE = getMapelDatabase();

export function saveMapelItem(categoryKey, mapelObj) {
  const allDb = getMapelDatabase();
  const catList = [...(allDb[categoryKey] || [])];

  const targetId = mapelObj.id || mapelObj.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const index = catList.findIndex(m => m.id === targetId);

  const newObj = {
    id: targetId,
    label: mapelObj.label.trim()
  };

  if (index >= 0) {
    catList[index] = newObj;
  } else {
    catList.push(newObj);
  }

  allDb[categoryKey] = catList;
  localStorage.setItem(MAPEL_STORAGE_KEY, JSON.stringify(allDb));
  return allDb;
}

export function deleteMapelItem(categoryKey, mapelId) {
  const allDb = getMapelDatabase();
  const catList = (allDb[categoryKey] || []).filter(m => m.id !== mapelId);
  allDb[categoryKey] = catList;
  localStorage.setItem(MAPEL_STORAGE_KEY, JSON.stringify(allDb));
  return allDb;
}

export function resetMapelDatabase() {
  localStorage.setItem(MAPEL_STORAGE_KEY, JSON.stringify(INITIAL_MAPEL_DATABASE));
  return INITIAL_MAPEL_DATABASE;
}
