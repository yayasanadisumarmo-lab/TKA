import { MOCK_EXAMS } from './mockQuestions';
import { syncBankSoalToBackend } from '../api/client';

const STORAGE_KEY = 'ANKB_BANK_SOAL_V1';

// Normalize text for duplicate checking
export function normalizeQuestionText(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s]/gi, '') // remove punctuation
    .replace(/\s+/g, ' ')     // collapse spaces
    .trim();
}

// Helper to auto sync to backend database in the background
function triggerBackendSync(mapelId, bankData) {
  if (bankData[mapelId]) {
    syncBankSoalToBackend(mapelId, bankData[mapelId].title || mapelId, bankData[mapelId].questions || []);
  }
}

// Get all bank soal per mapel
export function getBankSoal() {
  const initial = {
    'b-ing': {
      title: 'Bahasa Inggris - SMA/MA/SMK/MAK',
      questions: []
    },
    'matematika': {
      title: 'Matematika - SMA/MA/SMK/MAK',
      questions: MOCK_EXAMS['matematika']?.questions || []
    }
  };

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (!parsed['matematika']) {
        parsed['matematika'] = initial['matematika'];
      }
      if (!parsed['b-ing']) {
        parsed['b-ing'] = initial['b-ing'];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return parsed;
    } catch (e) {
      console.error('Failed to parse bank soal from localStorage', e);
    }
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

// Find if a duplicate question already exists in mapel
export function findDuplicateQuestionInMapel(mapelId, textToCompare) {
  const bank = getBankSoal();
  const questions = bank[mapelId]?.questions || [];
  const targetClean = normalizeQuestionText(textToCompare);

  if (!targetClean || targetClean.length < 5) return null;

  return questions.find(q => {
    const qClean = normalizeQuestionText(q.questionText || q.stimulus);
    return qClean === targetClean;
  });
}

// Replace an existing question in mapel projected
export function replaceQuestionInMapel(mapelId, oldQuestionId, newQuestionData) {
  const bank = getBankSoal();
  if (bank[mapelId]) {
    const idx = bank[mapelId].questions.findIndex(q => q.id === oldQuestionId);
    if (idx >= 0) {
      bank[mapelId].questions[idx] = { ...newQuestionData, id: oldQuestionId };
    } else {
      bank[mapelId].questions.push(newQuestionData);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
    triggerBackendSync(mapelId, bank);
  }
  return bank[mapelId]?.questions || [];
}

// Save a new question to a mapel
export function saveQuestionToMapel(mapelId, mapelTitle, questionData) {
  const bank = getBankSoal();
  
  if (!bank[mapelId]) {
    bank[mapelId] = {
      title: mapelTitle,
      questions: []
    };
  }

  // Check if editing existing question
  const existingIdx = bank[mapelId].questions.findIndex(q => q.id === questionData.id);
  if (existingIdx >= 0) {
    bank[mapelId].questions[existingIdx] = questionData;
  } else {
    // Generate new ID if needed
    const newId = bank[mapelId].questions.length > 0
      ? Math.max(...bank[mapelId].questions.map(q => q.id)) + 1
      : 1;
    bank[mapelId].questions.push({ ...questionData, id: newId });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
  triggerBackendSync(mapelId, bank);
  return bank[mapelId].questions;
}

// Clear all questions from a mapel
export function clearBankSoalMapel(mapelId) {
  const bank = getBankSoal();
  if (bank[mapelId]) {
    bank[mapelId].questions = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
    triggerBackendSync(mapelId, bank);
  }
  return bank;
}

// Delete multiple questions from a mapel
export function deleteMultipleQuestionsFromMapel(mapelId, questionIds) {
  const bank = getBankSoal();
  if (bank[mapelId] && Array.isArray(questionIds)) {
    const idsSet = new Set(questionIds);
    bank[mapelId].questions = bank[mapelId].questions.filter(q => !idsSet.has(q.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
    triggerBackendSync(mapelId, bank);
  }
  return bank;
}

// Undo / Delete a batch of imported question IDs
export function undoImportBatch(mapelId, questionIds) {
  return deleteMultipleQuestionsFromMapel(mapelId, questionIds);
}

// Delete a question from a mapel
export function deleteQuestionFromMapel(mapelId, questionId) {
  const bank = getBankSoal();
  if (bank[mapelId]) {
    bank[mapelId].questions = bank[mapelId].questions.filter(q => q.id !== questionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
    triggerBackendSync(mapelId, bank);
  }
  return bank;
}
