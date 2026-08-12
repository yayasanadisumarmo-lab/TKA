import React from 'react';
import { BarChart2, User, Key, CheckCircle, ArrowLeft, CheckCircle2, XCircle, HelpCircle, Award } from 'lucide-react';
import MathText from './MathText';

export default function ReviuHasilPage({ examData, answers, matrixAnswers, onFinishReview }) {
  const mapelTitle = examData?.title || 'Bahasa Inggris';
  const questions = examData?.questions || [];

  // Calculate results for all questions
  let correctCount = 0;
  let wrongCount = 0;
  let kosongCount = 0;

  const processedQuestions = questions.map((q, idx) => {
    const uAnsKey = answers?.[q.id];
    const userMatrix = matrixAnswers?.[q.id];

    let userText = '';
    let keyText = '';
    let isCorrect = false;
    let isKosong = false;

    if (q.type === 'single') {
      const foundOpt = q.options?.find(o => o.key === uAnsKey);
      if (uAnsKey) {
        userText = `(${uAnsKey}) ${foundOpt ? foundOpt.text.split('\n')[0] : ''}`;
        isCorrect = uAnsKey === q.correctAnswer || foundOpt?.isCorrect === true;
      } else {
        isKosong = true;
        userText = '() Kosong';
      }

      const keyOpt = q.options?.find(o => o.key === q.correctAnswer || o.isCorrect);
      const keyLetter = q.correctAnswer || keyOpt?.key || 'B';
      keyText = `(${keyLetter}) ${keyOpt ? keyOpt.text.split('\n')[0] : ''}`;

    } else if (q.type === 'complex') {
      const currentSelected = Array.isArray(uAnsKey) ? uAnsKey : (uAnsKey ? [uAnsKey] : []);
      if (currentSelected.length > 0) {
        userText = `Opsi Terpilih: (${currentSelected.join(', ')})`;
        const targetCorrects = (q.correctAnswers || q.options?.filter(o => o.isCorrect).map(o => o.key) || []).sort().join(',');
        const userCorrects = currentSelected.sort().join(',');
        isCorrect = targetCorrects === userCorrects;
      } else {
        isKosong = true;
        userText = '() Kosong';
      }

      const keys = q.correctAnswers || q.options?.filter(o => o.isCorrect).map(o => o.key) || [];
      keyText = `Opsi Benar: (${keys.join(', ')})`;

    } else if (q.type === 'matrix') {
      if (userMatrix && Object.keys(userMatrix).length > 0) {
        userText = q.matrixRows?.map(r => `${r.text}: ${userMatrix[r.id] || '-'}`).join('\n');
        const allCorrect = q.matrixRows?.every(r => userMatrix[r.id] === r.correct);
        isCorrect = allCorrect;
      } else {
        isKosong = true;
        userText = '() Kosong';
      }

      keyText = q.matrixRows?.map(r => `${r.text}: ${r.correct}`).join('\n');

    } else if (q.type === 'short') {
      if (uAnsKey && String(uAnsKey).trim()) {
        const cleanUser = String(uAnsKey).trim().toLowerCase();
        const cleanKey = String(q.correctShortAnswer || '').trim().toLowerCase();
        const vars = (q.variations || '').toLowerCase().split(',').map(v => v.trim());

        userText = String(uAnsKey);
        isCorrect = cleanUser === cleanKey || vars.includes(cleanUser);
      } else {
        isKosong = true;
        userText = '() Kosong';
      }

      keyText = q.correctShortAnswer || 'Kunci Jawaban Singkat';
    }

    if (isKosong) {
      kosongCount++;
    } else if (isCorrect) {
      correctCount++;
    } else {
      wrongCount++;
    }

    return {
      q,
      idx,
      userText,
      keyText,
      isCorrect,
      isKosong
    };
  });

  const totalQuestions = questions.length || 1;
  const finalScore = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Main Review Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 md:p-10">
        
        {/* Top Title & Mapel Badge */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#0052cc] p-2.5 mx-auto flex items-center justify-center shadow-lg mb-4">
            <img src="/logo-smk.png" alt="Logo SMK Adi Sumarmo" className="w-full h-full object-contain drop-shadow" />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            Reviu Hasil Simulasi Ujian
          </h2>

          <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-[#0052cc] border border-blue-200 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold">
            <span>📖 {mapelTitle}</span>
          </div>
        </div>

        {/* TOP SUMMARY STAT CARDS (BENAR, SALAH, KOSONG, SKOR AKHIR) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          
          {/* Card 1: BENAR */}
          <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl p-4 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center mb-2 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Benar</span>
            <h3 className="text-2xl md:text-3xl font-black text-emerald-700 mt-0.5">
              {correctCount} <span className="text-xs font-semibold text-emerald-600">Soal</span>
            </h3>
          </div>

          {/* Card 2: SALAH */}
          <div className="bg-rose-50/80 border-2 border-rose-300 rounded-2xl p-4 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-rose-500 text-white mx-auto flex items-center justify-center mb-2 shadow-xs">
              <XCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Salah</span>
            <h3 className="text-2xl md:text-3xl font-black text-rose-700 mt-0.5">
              {wrongCount} <span className="text-xs font-semibold text-rose-600">Soal</span>
            </h3>
          </div>

          {/* Card 3: KOSONG */}
          <div className="bg-slate-100 border-2 border-slate-300 rounded-2xl p-4 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-slate-400 text-white mx-auto flex items-center justify-center mb-2 shadow-xs">
              <HelpCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tidak Dijawab</span>
            <h3 className="text-2xl md:text-3xl font-black text-slate-700 mt-0.5">
              {kosongCount} <span className="text-xs font-semibold text-slate-500">Soal</span>
            </h3>
          </div>

          {/* Card 4: SKOR TOTAL */}
          <div className="bg-blue-50/80 border-2 border-[#0052cc] rounded-2xl p-4 text-center shadow-md">
            <div className="w-10 h-10 rounded-full bg-[#0052cc] text-white mx-auto flex items-center justify-center mb-2 shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Nilai Akhir</span>
            <h3 className="text-2xl md:text-3xl font-black text-[#0052cc] mt-0.5">
              {finalScore} <span className="text-xs font-semibold text-blue-700">/ 100</span>
            </h3>
          </div>

        </div>

        {/* Table Container */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs mb-8">
          
          {/* Table Header Bar */}
          <div className="bg-[#1d64d8] text-white font-bold text-xs md:text-sm grid grid-cols-12 py-3.5 px-4 items-center uppercase tracking-wider">
            <div className="col-span-1 text-center">NO.</div>
            <div className="col-span-5 flex items-center gap-1.5 pl-2">
              <User className="w-4 h-4" />
              JAWABAN ANDA
            </div>
            <div className="col-span-4 flex items-center gap-1.5 pl-2">
              <Key className="w-4 h-4" />
              KUNCI JAWABAN
            </div>
            <div className="col-span-2 text-center">
              STATUS
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-200 bg-white">
            {processedQuestions.map((item) => (
              <div key={item.q.id} className="grid grid-cols-12 p-4 gap-3 items-stretch text-xs md:text-sm">
                
                {/* Column 1: NO */}
                <div className="col-span-1 font-extrabold text-slate-800 text-center flex items-center justify-center text-sm">
                  {item.idx + 1}
                </div>

                {/* Column 2: JAWABAN ANDA */}
                <div className="col-span-5 flex items-center">
                  <div className={`w-full p-4 rounded-xl font-medium min-h-[64px] flex items-center whitespace-pre-line leading-snug ${
                    item.isKosong
                      ? 'bg-[#f0f4f8] text-slate-500 italic border-l-4 border-l-slate-400'
                      : item.isCorrect
                      ? 'bg-emerald-50/70 text-emerald-950 border-l-4 border-l-emerald-600 font-semibold'
                      : 'bg-rose-50/80 text-rose-900 border-l-4 border-l-red-500 font-semibold'
                  }`}>
                    <MathText text={item.userText} />
                  </div>
                </div>

                {/* Column 3: KUNCI JAWABAN */}
                <div className="col-span-4 flex items-center">
                  <div className="w-full p-4 rounded-xl bg-emerald-50/80 text-emerald-950 border-l-4 border-l-emerald-600 font-semibold min-h-[64px] flex items-center whitespace-pre-line leading-snug">
                    <MathText text={item.keyText} />
                  </div>
                </div>

                {/* Column 4: STATUS (BENAR / SALAH / KOSONG) */}
                <div className="col-span-2 flex items-center justify-center">
                  {item.isKosong ? (
                    <span className="bg-slate-200 text-slate-700 font-extrabold px-3 py-1.5 rounded-full text-xs flex items-center gap-1 border border-slate-300">
                      <HelpCircle className="w-3.5 h-3.5" /> KOSONG
                    </span>
                  ) : item.isCorrect ? (
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1.5 rounded-full text-xs flex items-center gap-1 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> BENAR
                    </span>
                  ) : (
                    <span className="bg-rose-100 text-rose-800 font-extrabold px-3 py-1.5 rounded-full text-xs flex items-center gap-1 border border-rose-300">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" /> SALAH
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Bottom Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onFinishReview}
            className="bg-[#0052cc] hover:bg-[#003da6] active:scale-[0.99] text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2"
          >
            <span>Selesai Reviu</span>
            <CheckCircle className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
