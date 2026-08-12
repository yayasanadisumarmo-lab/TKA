import { syncStudentProgressToBackend } from '../api/client';

const PROGRESS_STORAGE_KEY = 'ANBK_STUDENT_PROGRESS_V1';

// Get all student exam progress records
export function getAllStudentProgress() {
  const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse student progress', e);
    }
  }
  return {};
}

// Auto-save student exam state dynamically (Local + SQLite Backend)
export function autoSaveStudentProgress({
  username,
  nama,
  nik,
  mapelId,
  mapelLabel,
  currentIdx,
  totalQ,
  answers,
  matrixAnswers,
  bookmarks,
  timeLeft,
  isFinished = false
}) {
  const all = getAllStudentProgress();
  const studentKey = `${username}_${mapelId}`;
  
  const answeredCount = Object.keys(answers || {}).length + Object.keys(matrixAnswers || {}).length;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const record = {
    studentKey,
    username: username || 'P130100230',
    nama: nama || username || 'Siswa Simulasi ANBK',
    nik: nik || 'P130100230',
    mapelId,
    mapelLabel: mapelLabel || 'Bahasa Inggris',
    currentIdx: currentIdx || 0,
    currentQuestionNum: (currentIdx || 0) + 1,
    totalQ: totalQ || 20,
    answeredCount,
    answers: answers || {},
    matrixAnswers: matrixAnswers || {},
    bookmarks: bookmarks || {},
    timeLeft: timeLeft || 4500,
    lastAutoSaveTime: timeStr,
    status: isFinished ? 'SELESAI' : 'SEDANG_MENGERJAKAN',
    updatedAt: Date.now()
  };

  all[studentKey] = record;
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(all));

  // Sync to Backend Database
  syncStudentProgressToBackend({
    username: record.username,
    nama: record.nama,
    nik: record.nik,
    mapelId: record.mapelId,
    mapelLabel: record.mapelLabel,
    currentIdx: record.currentIdx,
    totalQ: record.totalQ,
    answers: record.answers,
    matrixAnswers: record.matrixAnswers,
    bookmarks: record.bookmarks,
    timeLeft: record.timeLeft,
    isFinished
  });

  return record;
}

// Get single student saved progress to resume exam if power goes out
export function getSavedStudentProgress(username, mapelId) {
  const all = getAllStudentProgress();
  const studentKey = `${username}_${mapelId}`;
  return all[studentKey] || null;
}
