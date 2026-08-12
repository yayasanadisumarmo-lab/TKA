import mammoth from 'mammoth';

/**
 * Parses raw text string (from Word HTML or plain text) into structured question objects
 */
export function parseRawQuestionText(textContent, imgElements = []) {
  const parsedQuestions = [];
  const lines = textContent.split('\n').map(l => l.trim()).filter(Boolean);

  let currentQuestion = null;
  let inExplanation = false;

  const commitCurrentQuestion = () => {
    if (currentQuestion && (currentQuestion.questionText || currentQuestion.stimulus)) {
      if (!currentQuestion.options || currentQuestion.options.length === 0) {
        currentQuestion.options = [
          { key: 'A', text: 'Pilihan A', isCorrect: true },
          { key: 'B', text: 'Pilihan B', isCorrect: false },
          { key: 'C', text: 'Pilihan C', isCorrect: false },
          { key: 'D', text: 'Pilihan D', isCorrect: false },
        ];
      }

      // Default correct key if none specified
      if (!currentQuestion.correctAnswer) {
        const correctOpt = currentQuestion.options.find(o => o.isCorrect);
        currentQuestion.correctAnswer = correctOpt ? correctOpt.key : 'A';
      }

      parsedQuestions.push({
        id: Date.now() + Math.random(),
        type: 'single',
        stimulus: currentQuestion.stimulus || currentQuestion.questionText,
        stimulusImage: currentQuestion.stimulusImage || null,
        questionText: currentQuestion.questionText || currentQuestion.stimulus,
        options: currentQuestion.options,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation || 'Pembahasan dari dokumen.'
      });
    }
    currentQuestion = null;
    inExplanation = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line starts a new question (e.g. "Soal 1:", "Soal 2:", "1.", "No. 1")
    const isNewQuestionMatch = line.match(/^(?:Soal|No\.?)\s*(\d+)[:\.]?/i) || line.match(/^(\d+)[\.\)]\s+/);

    if (isNewQuestionMatch) {
      commitCurrentQuestion();
      const cleanHeader = line.replace(/^(?:Soal|No\.?)\s*\d+[:\.]?/i, '').replace(/^\d+[\.\)]\s+/, '').trim();
      currentQuestion = {
        questionText: cleanHeader,
        options: [],
        correctAnswer: 'A',
        explanation: ''
      };
      continue;
    }

    if (!currentQuestion) {
      currentQuestion = {
        questionText: line,
        options: [],
        correctAnswer: 'A',
        explanation: ''
      };
      continue;
    }

    // Check for option line (e.g. "A. Rp19.000,00" or "a) Option text")
    const optionMatch = line.match(/^([A-Ea-e])[\.\)]\s*(.*)/);
    if (optionMatch && !inExplanation) {
      const key = optionMatch[1].toUpperCase();
      const text = optionMatch[2].trim();
      currentQuestion.options.push({
        key,
        text,
        isCorrect: false
      });
      continue;
    }

    // Check for Answer Key line (e.g. "Kunci: B" or "Kunci: C")
    const keyMatch = line.match(/^(?:Kunci|Jawaban|Key)[:\=]?\s*([A-Ea-e])/i);
    if (keyMatch && !inExplanation) {
      const targetKey = keyMatch[1].toUpperCase();
      currentQuestion.correctAnswer = targetKey;
      if (currentQuestion.options) {
        currentQuestion.options = currentQuestion.options.map(o => ({
          ...o,
          isCorrect: o.key === targetKey
        }));
      }
      continue;
    }

    // Check for Explanation header (e.g. "Pembahasan:")
    const expMatch = line.match(/^(?:Pembahasan|Penjelasan|Bahasan)[:\=]?\s*(.*)/i);
    if (expMatch) {
      inExplanation = true;
      currentQuestion.explanation = expMatch[1].trim();
      continue;
    }

    if (inExplanation) {
      currentQuestion.explanation += '\n' + line;
      continue;
    }

    // Append to question text if no options encountered yet
    if (currentQuestion.options.length === 0) {
      currentQuestion.questionText += '\n' + line;
    }
  }

  commitCurrentQuestion();

  // Attach images if found
  if (imgElements.length > 0 && parsedQuestions.length > 0) {
    imgElements.forEach((img, idx) => {
      if (parsedQuestions[idx]) {
        parsedQuestions[idx].stimulusImage = img.src;
      }
    });
  }

  return parsedQuestions;
}

/**
 * Parses a Word .docx File or plain text File and extracts structured questions
 */
export async function parseDocxFile(file) {
  let textContent = '';
  let imgElements = [];

  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    textContent = doc.body.innerText || doc.body.textContent || '';
    imgElements = Array.from(doc.querySelectorAll('img'));
  } catch (e) {
    console.warn('Mammoth docx parse failed, falling back to raw text reading:', e);
    // Fallback to text reading for plain text or txt file
    try {
      textContent = await file.text();
    } catch (textErr) {
      console.error('File text fallback failed:', textErr);
      throw new Error('Gagal membaca isi file.');
    }
  }

  return parseRawQuestionText(textContent, imgElements);
}

/**
 * Creates and triggers download of a sample Word (.docx) question template
 */
export function generateSampleWordTemplate() {
  const content = `FORMAT IMPORT SOAL ANBK (WORD / DOCX)
==============================================

Petunjuk:
1. Awali setiap soal dengan "Soal 1:", "Soal 2:", dst.
2. Tuliskan teks soal/pertanyaan.
3. Tuliskan opsi A, B, C, D, E.
4. Baris "Kunci: X" menentukan kunci jawaban benar.
5. Baris "Pembahasan: ..." menentukan pembahasan (opsional).

----------------------------------------------

Soal 1:
Diketahui sebuah segitiga siku-siku ABC siku-siku di titik B. Panjang sisi AB = 8 cm dan BC = 6 cm. Berapakah nilai sin(a) + cos(a)?
A. 1/5
B. 7/5
C. 12/5
D. 14/5
E. 2/5
Kunci: B
Pembahasan: sin(a) = 6/10 = 3/5, cos(a) = 8/10 = 4/5. Total = 7/5.

Soal 2:
Berikut data penjualan unit laptop: Januari (15 unit), Februari (25 unit), Maret (20 unit), April (30 unit), dan Mei (35 unit). Berapakah rata-rata penjualan per bulan?
A. 20 Unit
B. 22 Unit
C. 25 Unit
D. 28 Unit
E. 30 Unit
Kunci: C
Pembahasan: Rata-rata = 125 / 5 = 25 unit.
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Template_Import_Soal_ANBK.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
