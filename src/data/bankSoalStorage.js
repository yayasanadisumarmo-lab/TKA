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
  const saved = localStorage.getItem(STORAGE_KEY);
  
  if (saved) {
    try {
      const parsed = JSON.parse(saved);

      const fixSqrtString = (str) => {
        if (typeof str !== 'string') return str;
        return str
          .replace(/\\?sqrt\(([^)]+)\)/gi, '\\sqrt{$1}')
          .replace(/\\?sqrt\{([^}]+)\}/gi, '\\sqrt{$1}')
          .replace(/\\?sqrt\s*([0-9a-zA-Z]+(?:\s*[\+\-\*\/]\s*[0-9a-zA-Z]+)*)/gi, '\\sqrt{$1}');
      };

      const cleanQuestionObj = (q) => {
        if (!q) return q;
        return {
          ...q,
          questionText: fixSqrtString(q.questionText),
          stimulus: fixSqrtString(q.stimulus),
          explanation: fixSqrtString(q.explanation),
          options: Array.isArray(q.options)
            ? q.options.map(opt => ({ ...opt, text: fixSqrtString(opt.text) }))
            : q.options
        };
      };

      // Helper to merge default questions with existing user questions without losing any previous questions
      const mergePreservingExisting = (existingList = [], defaultList = []) => {
        const map = new Map();
        
        // 1. Map all default questions by unique key
        (defaultList || []).map(cleanQuestionObj).forEach(q => {
          map.set(String(q.id), q);
        });

        // 2. Determine max ID to prevent ID collision
        let maxId = 0;
        Array.from(map.values()).concat(existingList || []).forEach(q => {
          const numId = parseInt(q.id, 10);
          if (!isNaN(numId) && numId > maxId) maxId = numId;
        });

        // 3. Add existing questions, preserving any user-added questions
        (existingList || []).map(cleanQuestionObj).forEach(q => {
          const normText = normalizeQuestionText(q.questionText || '');
          let foundKey = null;
          
          for (let [k, item] of map.entries()) {
            if (normalizeQuestionText(item.questionText || '') === normText && normText !== '') {
              foundKey = k;
              break;
            }
          }

          if (foundKey) {
            // Update default question with user edits/stimulus
            map.set(foundKey, { ...map.get(foundKey), ...q });
          } else {
            // New user-created question: preserve it with a non-colliding ID if needed
            if (map.has(String(q.id))) {
              maxId += 1;
              map.set(String(maxId), { ...q, id: maxId });
            } else {
              map.set(String(q.id), q);
            }
          }
        });

        return Array.from(map.values());
      };

      // Dynamically sync ALL subjects in MOCK_EXAMS while preserving pre-existing questions
      Object.keys(MOCK_EXAMS).forEach(subjectKey => {
        const mockExam = MOCK_EXAMS[subjectKey];
        if (!mockExam) return;

        if (!parsed[subjectKey]) {
          parsed[subjectKey] = {
            title: mockExam.title || subjectKey,
            questions: mockExam.questions || []
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } else {
          const merged = mergePreservingExisting(parsed[subjectKey].questions, mockExam.questions);
          if (merged.length > (parsed[subjectKey].questions || []).length || !parsed[subjectKey].questions?.[0]?.stimulus) {
            parsed[subjectKey].questions = merged;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          }
        }
      });

      // Return the parsed data AS IS — preserve all user-added questions
      return parsed;
    } catch (e) {
      console.error('Failed to parse bank soal from localStorage', e);
    }
  }

  // First time only: initialize with defaults
  const initial = {
    'b-indo': {
      title: 'Bahasa Indonesia - SMA/MA/SMK/MAK',
      questions: MOCK_EXAMS['b-indo']?.questions || []
    },
    'b-ing': {
      title: 'Bahasa Inggris - SMA/MA/SMK/MAK',
      questions: MOCK_EXAMS['b-ing']?.questions || []
    },
    'matematika': {
      title: 'Matematika - SMA/MA/SMK/MAK',
      questions: MOCK_EXAMS['matematika']?.questions || []
    },
    'matematika-tl': {
      title: 'Matematika Tingkat Lanjut - SMA/MA/SMK/MAK',
      questions: MOCK_EXAMS['matematika-tl']?.questions || []
    },
    'pancasila-pilihan': {
      title: 'Pendidikan Pancasila (Pilihan) - SMA/MA/SMK/MAK',
      questions: MOCK_EXAMS['pancasila-pilihan']?.questions || []
    },
    'sejarah': {
      title: 'Sejarah (Pilihan) - SMA/MA/SMK/MAK',
      questions: MOCK_EXAMS['sejarah']?.questions || []
    }
  };
  
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
    if (!Array.isArray(bank[mapelId].questions)) bank[mapelId].questions = [];
    const idx = bank[mapelId].questions.findIndex(q => String(q.id) === String(oldQuestionId));
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

  if (!Array.isArray(bank[mapelId].questions)) {
    bank[mapelId].questions = [];
  }

  // Check if editing existing question (match by ID using String coercion)
  const targetId = questionData.id;
  const existingIdx = bank[mapelId].questions.findIndex(q => String(q.id) === String(targetId));
  
  if (existingIdx >= 0) {
    // Update existing question in place
    bank[mapelId].questions[existingIdx] = { ...bank[mapelId].questions[existingIdx], ...questionData, id: targetId };
  } else {
    // Generate a guaranteed unique ID for the new question if no ID provided
    const newId = targetId || (Date.now() + Math.floor(Math.random() * 1000));
    bank[mapelId].questions.push({ ...questionData, id: newId });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
  triggerBackendSync(mapelId, bank);
  return bank[mapelId].questions;
}

export const saveQuestionToBank = saveQuestionToMapel;

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
    const idsSet = new Set(questionIds.map(String));
    bank[mapelId].questions = bank[mapelId].questions.filter(q => !idsSet.has(String(q.id)));
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
    bank[mapelId].questions = bank[mapelId].questions.filter(q => String(q.id) !== String(questionId));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
    triggerBackendSync(mapelId, bank);
  }
  return bank[mapelId]?.questions || [];
}
