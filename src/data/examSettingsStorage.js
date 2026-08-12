const SETTINGS_STORAGE_KEY = 'ANBK_EXAM_SETTINGS_V1';

// Default setting structure for a mapel
export const DEFAULT_MAPEL_SETTING = {
  durasiMenit: 75,
  tanggalUjian: '2026-08-15',
  jamMulai: '07:30',
  jamSelesai: '11:30',
  jumlahSoal: 20,
  metodeSoal: 'acak', // 'acak' | 'manual'
  selectedQuestionIds: [],
  statusUjian: 'aktif', // 'aktif' | 'nonaktif'
};

export function getAllExamSettings() {
  const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing exam settings', e);
    }
  }
  return {};
}

export function getExamSettingForMapel(mapelId) {
  const all = getAllExamSettings();
  return all[mapelId] || { ...DEFAULT_MAPEL_SETTING };
}

export function saveExamSettingForMapel(mapelId, settingsData) {
  const all = getAllExamSettings();
  all[mapelId] = {
    ...DEFAULT_MAPEL_SETTING,
    ...(all[mapelId] || {}),
    ...settingsData
  };
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(all));
  return all[mapelId];
}
