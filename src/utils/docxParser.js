import mammoth from 'mammoth';

/**
 * Parses raw text string (from Word HTML or plain text) into structured question objects
 * Supports 5 ANBK Question Types:
 * 1. Single Choice ('single')
 * 2. Complex / Multi-Choice ('complex')
 * 3. Matrix Statement / Benar-Salah ('matrix')
 * 4. Matching / Menjodohkan ('matrix')
 * 5. Short Answer ('short')
 */
export function parseRawQuestionText(textContent, imgElements = []) {
  const parsedQuestions = [];
  const lines = textContent.split('\n').map(l => l.trim()).filter(Boolean);

  let currentQuestion = null;
  let inExplanation = false;

  let questionCounter = 0;

  const commitCurrentQuestion = () => {
    if (!currentQuestion || (!currentQuestion.questionText && !currentQuestion.stimulus)) {
      currentQuestion = null;
      inExplanation = false;
      return;
    }

    questionCounter++;
    const uniqueId = Date.now() + questionCounter * 1000 + Math.floor(Math.random() * 999);
    const qType = currentQuestion.detectedType || 'single';

    // TYPE 1: ISIAN SINGKAT
    if (qType === 'short') {
      parsedQuestions.push({
        id: uniqueId,
        type: 'short',
        stimulus: currentQuestion.questionText,
        stimulusImage: currentQuestion.stimulusImage || null,
        questionText: currentQuestion.questionText,
        correctShortAnswer: currentQuestion.correctShortAnswer || '25 unit',
        variations: currentQuestion.variations || '',
        explanation: currentQuestion.explanation || 'Pembahasan dari dokumen.'
      });
    }
    // TYPE 2: BENAR / SALAH (MATRIX)
    else if (qType === 'matrix_bs') {
      const rows = currentQuestion.numberedLines.map((lineText, idx) => {
        let isCorrect = 'Benar';
        if (currentQuestion.bsKeys[idx]) {
          isCorrect = currentQuestion.bsKeys[idx];
        }
        return {
          id: `row-${idx + 1}`,
          text: lineText,
          correct: isCorrect
        };
      });

      parsedQuestions.push({
        id: uniqueId,
        type: 'matrix',
        stimulus: currentQuestion.questionText,
        stimulusImage: currentQuestion.stimulusImage || null,
        questionText: currentQuestion.questionText,
        matrixHeaders: currentQuestion.customHeaders || ['Pernyataan', 'Benar', 'Salah'],
        matrixRows: rows.length > 0 ? rows : [
          { id: 'row-1', text: 'Pernyataan Pertama', correct: 'Benar' },
          { id: 'row-2', text: 'Pernyataan Kedua', correct: 'Salah' }
        ],
        explanation: currentQuestion.explanation || 'Pembahasan dari dokumen.'
      });
    }
    // TYPE 3: MENJODOHKAN (MATRIX MATCHING)
    else if (qType === 'matrix_match') {
      const rows = currentQuestion.numberedLines.map((lineText, idx) => {
        let leftText = lineText;
        let rightText = 'Pasangan';
        if (lineText.includes('->')) {
          const parts = lineText.split('->');
          leftText = parts[0].trim();
          rightText = parts[1].trim();
        } else if (lineText.includes('=')) {
          const parts = lineText.split('=');
          leftText = parts[0].trim();
          rightText = parts[1].trim();
        }

        if (currentQuestion.matchKeys[idx]) {
          rightText = currentQuestion.matchKeys[idx];
        }

        return {
          id: `row-${idx + 1}`,
          text: leftText,
          correct: rightText
        };
      });

      parsedQuestions.push({
        id: uniqueId,
        type: 'matrix',
        stimulus: currentQuestion.questionText,
        stimulusImage: currentQuestion.stimulusImage || null,
        questionText: currentQuestion.questionText,
        matrixHeaders: ['Pernyataan / Item', 'Jawaban / Pasangan'],
        matrixRows: rows.length > 0 ? rows : [
          { id: 'row-1', text: 'Item A', correct: 'Pasangan A' },
          { id: 'row-2', text: 'Item B', correct: 'Pasangan B' }
        ],
        explanation: currentQuestion.explanation || 'Pembahasan dari dokumen.'
      });
    }
    // TYPE 4: PILIHAN GANDA KOMPLEKS (MULTI-CHOICE)
    else if (qType === 'complex') {
      const opts = currentQuestion.options.length > 0 ? currentQuestion.options : [
        { key: 'A', text: 'Pilihan A', isCorrect: true },
        { key: 'B', text: 'Pilihan B', isCorrect: true },
        { key: 'C', text: 'Pilihan C', isCorrect: false },
        { key: 'D', text: 'Pilihan D', isCorrect: true }
      ];

      const keys = currentQuestion.correctAnswers.length > 0 ? currentQuestion.correctAnswers : ['A', 'B', 'D'];
      const updatedOpts = opts.map(o => ({
        ...o,
        isCorrect: keys.includes(o.key)
      }));

      parsedQuestions.push({
        id: uniqueId,
        type: 'complex',
        stimulus: currentQuestion.questionText,
        stimulusImage: currentQuestion.stimulusImage || null,
        questionText: currentQuestion.questionText,
        options: updatedOpts,
        correctAnswers: keys,
        explanation: currentQuestion.explanation || 'Pembahasan dari dokumen.'
      });
    }
    // TYPE 5: PILIHAN GANDA SINGLE (DEFAULT)
    else {
      const opts = currentQuestion.options.length > 0 ? currentQuestion.options : [
        { key: 'A', text: 'Pilihan A', isCorrect: true },
        { key: 'B', text: 'Pilihan B', isCorrect: false },
        { key: 'C', text: 'Pilihan C', isCorrect: false },
        { key: 'D', text: 'Pilihan D', isCorrect: false }
      ];

      const targetKey = currentQuestion.correctAnswer || 'A';
      const updatedOpts = opts.map(o => ({
        ...o,
        isCorrect: o.key === targetKey
      }));

      parsedQuestions.push({
        id: uniqueId,
        type: 'single',
        stimulus: currentQuestion.questionText,
        stimulusImage: currentQuestion.stimulusImage || null,
        questionText: currentQuestion.questionText,
        options: updatedOpts,
        correctAnswer: targetKey,
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
        detectedType: 'single',
        options: [],
        numberedLines: [],
        bsKeys: [],
        matchKeys: [],
        correctAnswers: [],
        correctAnswer: 'A',
        correctShortAnswer: '',
        variations: '',
        explanation: ''
      };
      continue;
    }

    if (!currentQuestion) {
      currentQuestion = {
        questionText: line,
        detectedType: 'single',
        options: [],
        numberedLines: [],
        bsKeys: [],
        matchKeys: [],
        correctAnswers: [],
        correctAnswer: 'A',
        correctShortAnswer: '',
        variations: '',
        explanation: ''
      };
      continue;
    }

    // Check for explicit "Tipe:" tag line (e.g. "Tipe: Pilihan Ganda Kompleks" or "Tipe: Benar Salah")
    const typeTagMatch = line.match(/^(?:Tipe|Jenis|Type)[:\=]?\s*(.*)/i);
    if (typeTagMatch && !inExplanation) {
      const typeVal = typeTagMatch[1].toLowerCase();
      if (typeVal.includes('kompleks') || typeVal.includes('multi')) {
        currentQuestion.detectedType = 'complex';
      } else if (typeVal.includes('benar') || typeVal.includes('salah') || typeVal.includes('pernyataan') || typeVal.includes('kategori') || typeVal.includes('klasifikasi')) {
        currentQuestion.detectedType = 'matrix_bs';
      } else if (typeVal.includes('jodoh') || typeVal.includes('matriks') || typeVal.includes('pasang')) {
        currentQuestion.detectedType = 'matrix_match';
      } else if (typeVal.includes('isian') || typeVal.includes('singkat') || typeVal.includes('short')) {
        currentQuestion.detectedType = 'short';
      } else {
        currentQuestion.detectedType = 'single';
      }
      continue;
    }

    // Check for explicit "Header:" tag line (e.g. "Header: Traits | Similarity | Difference")
    const headerTagMatch = line.match(/^(?:Header|Headers)[:\=]?\s*(.*)/i);
    if (headerTagMatch && !inExplanation) {
      const parts = headerTagMatch[1].split('|').map(p => p.trim());
      if (parts.length >= 2) {
        if (parts.length === 2) {
          currentQuestion.customHeaders = ['Pernyataan / Item', parts[0], parts[1]];
        } else {
          currentQuestion.customHeaders = parts;
        }
        currentQuestion.detectedType = 'matrix_bs';
      }
      continue;
    }

    // Check for Option line (e.g. "A. Option text" or "a) Option text")
    const optionMatch = line.match(/^([A-Ea-e])[\.\)]\s*(.*)/);
    if (optionMatch && !inExplanation && currentQuestion.detectedType !== 'short') {
      const key = optionMatch[1].toUpperCase();
      const text = optionMatch[2].trim();
      currentQuestion.options.push({
        key,
        text,
        isCorrect: false
      });
      continue;
    }

    // Check for Numbered statement line (e.g. "1. Statement" or "1) Statement")
    const numberedMatch = line.match(/^(\d+)[\.\)]\s*(.*)/);
    if (numberedMatch && !inExplanation && (currentQuestion.detectedType === 'matrix_bs' || currentQuestion.detectedType === 'matrix_match')) {
      const text = numberedMatch[2].trim();
      currentQuestion.numberedLines.push(text);
      continue;
    }

    // Check for Variations line (for Isian Singkat)
    const varMatch = line.match(/^(?:Variasi|Variasi Jawaban)[:\=]?\s*(.*)/i);
    if (varMatch && !inExplanation) {
      currentQuestion.variations = varMatch[1].trim();
      continue;
    }

    // Check for Answer Key line (e.g. "Kunci: B" or "Kunci: A, B, D" or "Kunci: Benar, Salah, Benar" or "Kunci: 25 unit")
    const keyLineMatch = line.match(/^(?:Kunci|Jawaban|Key)[:\=]?\s*(.*)/i);
    if (keyLineMatch && !inExplanation) {
      const rawVal = keyLineMatch[1].trim();

      // If Isian Singkat
      if (currentQuestion.detectedType === 'short') {
        currentQuestion.correctShortAnswer = rawVal;
      }
      // If Benar / Salah
      else if (currentQuestion.detectedType === 'matrix_bs' || rawVal.toLowerCase().includes('benar') || rawVal.toLowerCase().includes('salah')) {
        currentQuestion.detectedType = 'matrix_bs';
        const parts = rawVal.split(/[,;\/]/).map(p => p.trim());
        currentQuestion.bsKeys = parts.map(p => {
          const cleanP = p.replace(/^\d+[\:\-\s]*/, '').trim();
          return cleanP.toLowerCase().includes('salah') ? 'Salah' : 'Benar';
        });
      }
      // If Menjodohkan
      else if (currentQuestion.detectedType === 'matrix_match') {
        const parts = rawVal.split(/[,;]/).map(p => p.trim());
        currentQuestion.matchKeys = parts.map(p => p.replace(/^\d+[\:\-\s]*/, '').trim());
      }
      // If Multi-choice (e.g. "A, B, D" or "A,C")
      else if (rawVal.includes(',') || rawVal.includes(';') || rawVal.length > 2 || currentQuestion.detectedType === 'complex') {
        const keys = rawVal.toUpperCase().match(/[A-E]/g) || [];
        if (keys.length > 1) {
          currentQuestion.detectedType = 'complex';
          currentQuestion.correctAnswers = keys;
        } else if (keys.length === 1) {
          currentQuestion.correctAnswer = keys[0];
        }
      }
      // Single Choice
      else {
        const singleMatch = rawVal.match(/([A-Ea-e])/);
        if (singleMatch) {
          currentQuestion.correctAnswer = singleMatch[1].toUpperCase();
        }
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

    // Append to question text if no options or statements encountered yet
    if (currentQuestion.options.length === 0 && currentQuestion.numberedLines.length === 0) {
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
  const content = `FORMAT IMPORT SOAL ANBK (LENGKAP 5 TIPE SOAL)
==============================================

Petunjuk Umum:
1. Awali setiap nomor soal dengan "Soal 1:", "Soal 2:", dst.
2. Tambahkan baris "Tipe: ..." untuk menentukan jenis soal (Opsional):
   - Pilihan Ganda
   - Pilihan Ganda Kompleks
   - Benar Salah
   - Menjodohkan
   - Isian Singkat
3. Gunakan baris "Kunci: ..." untuk menentukan jawaban benar.
4. Gunakan baris "Pembahasan: ..." untuk pembahasan soal (Opsional).

----------------------------------------------

Soal 1:
Tipe: Pilihan Ganda
Diketahui sebuah segitiga siku-siku ABC siku-siku di titik B. Panjang sisi AB = 8 cm dan BC = 6 cm. Berapakah nilai sin(a) + cos(a)?
A. 1/5
B. 7/5
C. 12/5
D. 14/5
E. 2/5
Kunci: B
Pembahasan: sin(a) = 6/10 = 3/5, cos(a) = 8/10 = 4/5. Total = 7/5.

Soal 2:
Tipe: Pilihan Ganda Kompleks
Manakah di antara pernyataan berikut yang bernilai BENAR mengenai sistem tata surya kita? (Jawaban dapat lebih dari satu)
A. Planet Bumi merupakan planet ketiga dari Matahari.
B. Planet Mars memiliki dua satelit alami yaitu Phobos dan Deimos.
C. Planet Merkurius merupakan planet terbesar di sistem tata surya.
D. Matahari merupakan bintang pusat sistem tata surya.
E. Bulan mengorbit mengelilingi planet Mars.
Kunci: A, B, D
Pembahasan: Bumi adalah planet ke-3, Mars punya 2 satelit Phobos & Deimos, Matahari adalah bintang pusat.

Soal 3:
Tipe: Benar Salah
Tentukan apakah setiap pernyataan di bawah ini Benar atau Salah mengenai sifat-sifat bangun datar matematika:
1. Jumlah sudut dalam sebuah segitiga selalu 180 derajat.
2. Persegi panjang memiliki empat sisi yang sama panjang.
3. Lingkaran memiliki jumlah simetri lipat tak terhingga.
Kunci: Benar, Salah, Benar
Pembahasan: 1. Segitiga total 180 (Benar). 2. Sisi sama panjang adalah persegi (Salah). 3. Lingkaran tak terhingga simetri lipat (Benar).

Soal 4:
Tipe: Menjodohkan
Pasangkanlah nama ibu kota provinsi di Indonesia berikut ini dengan nama provinsinya yang sesuai:
1. Jawa Barat -> Bandung
2. Jawa Tengah -> Semarang
3. Jawa Timur -> Surabaya
Kunci: 1-Bandung, 2-Semarang, 3-Surabaya
Pembahasan: Pasangan ibu kota provinsi yang sesuai.

Soal 5:
Tipe: Isian Singkat
Berikut data penjualan unit laptop: Januari (15 unit), Februari (25 unit), Maret (20 unit), April (30 unit), dan Mei (35 unit). Berapakah rata-rata penjualan unit laptop per bulan?
Kunci: 25 unit
Variasi: 25 | 25 Unit | 25unit
Pembahasan: Rata-rata = (15 + 25 + 20 + 30 + 35) / 5 = 125 / 5 = 25 unit.

Soal 6:
Tipe: Matriks Klasifikasi
Header: Traits | Similarity | Difference
After reading the text, decide if each trait shows a similarity or a difference between Son Tinh and Thuy Tinh:
1. Both are not humans.
2. They can control the elements.
3. They love the king's daughter.
Kunci: Similarity, Similarity, Similarity
Pembahasan: Both are spirits (similarity), both control elements (similarity), both loved the princess (similarity).
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Template_Import_Soal_ANBK_5Tipe.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
