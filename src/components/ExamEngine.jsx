import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Grid, ChevronLeft, ChevronRight, Bookmark, RotateCcw, Info, LogOut, CheckCircle2, Shuffle, CheckCheck, CheckSquare, FileText, AlertCircle, XCircle } from 'lucide-react';
import { MOCK_EXAMS } from '../data/mockQuestions';
import { getBankSoal } from '../data/bankSoalStorage';
import { getExamSettingForMapel } from '../data/examSettingsStorage';
import { autoSaveStudentProgress, getSavedStudentProgress } from '../data/studentProgressStorage';
import SelesaiTesModal from './SelesaiTesModal';
import MathText from './MathText';

// Deterministic seed-based pseudo-random generator using student username
const createPRNG = (seedStr) => {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = strCode(seedStr.charCodeAt(i) + ((hash << 5) - hash));
  }
  function strCode(n) { return n | 0; }
  
  return function() {
    hash = (hash + 0x6D2B79F5) | 0;
    let t = Math.imul(hash ^ (hash >>> 15), 1 | hash);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffleWithSeed = (array, seedStr) => {
  const rng = createPRNG(seedStr || 'default-user-seed');
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function ExamEngine({ sessionData, onFinishExam, onReviewResults }) {
  const mapelObj = sessionData.selectedConfig?.mapel;
  const mapelKey = mapelObj?.id || 'b-ing';
  const username = sessionData.nik || sessionData.nama || 'P130100230';
  const namaSiswa = sessionData.namaPeserta || sessionData.nama || username;

  // Load Exam Settings & Custom Bank Questions if available
  const examSetting = useMemo(() => getExamSettingForMapel(mapelKey), [mapelKey]);
  const customBank = useMemo(() => getBankSoal()[mapelKey]?.questions, [mapelKey]);

  // Base raw questions (custom bank or fallback mock)
  const rawQuestions = (customBank && customBank.length > 0) 
    ? customBank 
    : (MOCK_EXAMS[mapelKey]?.questions || MOCK_EXAMS['b-ing']?.questions || []);

  // Filter or randomize questions based on settings
  const filteredQuestions = useMemo(() => {
    if (examSetting.metodeSoal === 'manual' && examSetting.selectedQuestionIds?.length > 0) {
      return rawQuestions.filter(q => examSetting.selectedQuestionIds.includes(q.id));
    }
    return rawQuestions;
  }, [rawQuestions, examSetting]);

  // STUDENT-SPECIFIC RANDOM SHUFFLED QUESTIONS SEQUENCE
  const questions = useMemo(() => {
    const studentSeed = `${username}-${mapelKey}`;
    const shuffled = shuffleWithSeed(filteredQuestions, studentSeed);
    const targetCount = examSetting.jumlahSoal || shuffled.length;
    return shuffled.slice(0, targetCount);
  }, [filteredQuestions, username, mapelKey, examSetting]);

  // Check saved progress from previous session
  const savedBackup = useMemo(() => getSavedStudentProgress(username, mapelKey), [username, mapelKey]);

  const [currentIdx, setCurrentIdx] = useState(savedBackup?.currentIdx || 0);
  const [answers, setAnswers] = useState(savedBackup?.answers || {});
  const [matrixAnswers, setMatrixAnswers] = useState(savedBackup?.matrixAnswers || {});
  const [bookmarks, setBookmarks] = useState(savedBackup?.bookmarks || {});
  const [fontSize, setFontSize] = useState('medium');
  const [timeLeft, setTimeLeft] = useState(savedBackup?.timeLeft || (examSetting.durasiMenit || 75) * 60);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState(savedBackup?.lastAutoSaveTime || '');
  const [zoomedImage, setZoomedImage] = useState(null);

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTriggerFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // AUTO-SAVE ON EVERY CHANGE
  useEffect(() => {
    const rec = autoSaveStudentProgress({
      username,
      nama: namaSiswa,
      nik: sessionData.nik || username,
      mapelId: mapelKey,
      mapelLabel: mapelObj?.label || 'Bahasa Inggris',
      currentIdx,
      totalQ: questions.length,
      answers,
      matrixAnswers,
      bookmarks,
      timeLeft
    });

    setLastAutoSaveTime(rec.lastAutoSaveTime);
  }, [answers, matrixAnswers, bookmarks, currentIdx, timeLeft, username, namaSiswa, mapelKey, mapelObj, questions.length]);

  const currentQ = questions[currentIdx] || questions[0];
  const totalQ = questions.length;

  // Calculate detailed progress stats (which numbers answered/unanswered)
  const answeredNumbers = [];
  const unansweredNumbers = [];
  const raguNumbers = [];

  questions.forEach((q, idx) => {
    const qNum = idx + 1;
    const ansVal = answers[q.id];
    const isAnsArray = Array.isArray(ansVal);
    const hasSingleAns = ansVal !== undefined && ansVal !== '' && (isAnsArray ? ansVal.length > 0 : true);
    const hasMatrixAns = matrixAnswers[q.id] && Object.keys(matrixAnswers[q.id]).length > 0;
    
    if (hasSingleAns || hasMatrixAns) {
      answeredNumbers.push(qNum);
    } else {
      unansweredNumbers.push(qNum);
    }

    if (bookmarks[q.id]) {
      raguNumbers.push(qNum);
    }
  });

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getFontSizeClass = () => {
    if (fontSize === 'small') return 'text-xs md:text-sm';
    if (fontSize === 'large') return 'text-base md:text-lg leading-relaxed';
    return 'text-sm md:text-base leading-relaxed';
  };

  // Handlers for single, complex (multiple), matrix, and short answer
  const handleSingleAnswer = (key) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: key }));
  };

  const handleComplexToggleAnswer = (key) => {
    setAnswers(prev => {
      const currentSelected = prev[currentQ.id] || [];
      const isArray = Array.isArray(currentSelected);
      const arr = isArray ? [...currentSelected] : [currentSelected];
      
      if (arr.includes(key)) {
        return { ...prev, [currentQ.id]: arr.filter(k => k !== key) };
      } else {
        return { ...prev, [currentQ.id]: [...arr, key] };
      }
    });
  };

  const handleShortTextChange = (textVal) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: textVal }));
  };

  const handleMatrixSelection = (rowId, selectedCol) => {
    setMatrixAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        ...(prev[currentQ.id] || {}),
        [rowId]: selectedCol
      }
    }));
  };

  const toggleBookmark = () => {
    setBookmarks(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const handleTriggerFinish = () => {
    setShowFinishModal(true);
  };

  const handleConfirmFinishExam = () => {
    autoSaveStudentProgress({
      username,
      nama: namaSiswa,
      nik: sessionData.nik || username,
      mapelId: mapelKey,
      mapelLabel: mapelObj?.label || 'Bahasa Inggris',
      currentIdx,
      totalQ: questions.length,
      answers,
      matrixAnswers,
      bookmarks,
      timeLeft,
      isFinished: true
    });

    setShowFinishModal(false);
    onReviewResults({
      examData: {
        title: mapelObj?.label || 'Bahasa Inggris',
        questions
      },
      answers,
      matrixAnswers
    });
  };

  // Render Question Type Badge
  const renderTypeBadge = () => {
    const qType = currentQ.type;
    if (qType === 'complex') {
      return (
        <div className="mb-4 inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-lg text-xs font-extrabold tracking-wide uppercase shadow-xs">
          <CheckSquare className="w-4 h-4 text-amber-600" />
          Tipe Soal: Pilihan Ganda Kompleks (Bisa Lebih Dari Satu)
        </div>
      );
    }
    if (qType === 'matrix') {
      return (
        <div className="mb-4 inline-flex items-center gap-1.5 bg-purple-50 text-purple-900 border border-purple-200 px-3 py-1 rounded-lg text-xs font-extrabold tracking-wide uppercase shadow-xs">
          <Grid className="w-4 h-4 text-purple-600" />
          Tipe Soal: Menjodohkan / Matriks
        </div>
      );
    }
    if (qType === 'short') {
      return (
        <div className="mb-4 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-lg text-xs font-extrabold tracking-wide uppercase shadow-xs">
          <FileText className="w-4 h-4 text-emerald-600" />
          Tipe Soal: Isian Singkat
        </div>
      );
    }
    // Default single choice
    return (
      <div className="mb-4 inline-flex items-center gap-1.5 bg-blue-50 text-[#007bff] border border-blue-200 px-3 py-1 rounded-lg text-xs font-extrabold tracking-wide uppercase shadow-xs">
        <CheckCircle2 className="w-4 h-4 text-[#007bff]" />
        Tipe Soal: Pilihan Ganda (PG)
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-2 md:my-4 px-2 md:px-4 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Main Container Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 md:p-6 mb-4">
        
        {/* Top Actions & Bar inside Card */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 mb-3">
          
          {/* Left: Soal nomor X & Ukuran font */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold text-slate-800">
                Soal nomor {currentIdx + 1}
              </h2>
              <span className="bg-blue-100 text-[#007bff] text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Shuffle className="w-3 h-3" /> Urutan Diacak Peserta
              </span>

              {/* LIVE AUTO-SAVE BADGE */}
              {lastAutoSaveTime && (
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Auto-Save: {lastAutoSaveTime}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Ukuran font soal:</span>
              <button onClick={() => setFontSize('small')} className={`px-1.5 py-0.5 rounded font-bold ${fontSize === 'small' ? 'bg-[#007bff] text-white' : 'hover:bg-slate-100'}`}>A</button>
              <button onClick={() => setFontSize('medium')} className={`px-1.5 py-0.5 rounded font-bold ${fontSize === 'medium' ? 'bg-[#007bff] text-white' : 'hover:bg-slate-100'}`}>A</button>
              <button onClick={() => setFontSize('large')} className={`px-1.5 py-0.5 rounded font-bold text-sm ${fontSize === 'large' ? 'bg-[#007bff] text-white' : 'hover:bg-slate-100'}`}>A</button>
            </div>
          </div>

          {/* Right: INFORMASI SOAL, Sisa Waktu, Daftar Soal */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfoModal(true)}
                className="bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm"
              >
                <Info className="w-3.5 h-3.5" />
                INFORMASI SOAL
              </button>

              <div className="bg-white border-2 border-red-500 text-red-600 px-3 py-1 rounded-md text-xs font-bold font-mono shadow-xs">
                Sisa Waktu : {formatTime(timeLeft)}
              </div>

              <button
                onClick={() => setIsGridOpen(true)}
                className="bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm"
              >
                <Grid className="w-3.5 h-3.5" />
                Daftar Soal ▦
              </button>
            </div>

            <div className="text-xs text-slate-500 font-semibold text-right">
              {mapelObj?.label || 'Bahasa Inggris'}
            </div>
          </div>

        </div>

        {/* PROMINENT LIVE ANSWER PROGRESS BAR & NUMBER BREAKDOWN */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-extrabold text-slate-700 flex items-center gap-1">
              📊 Status Pengisian:
            </span>

            {/* Answered Numbers List */}
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Sudah Diisi ({answeredNumbers.length}): {answeredNumbers.length > 0 ? `No. ${answeredNumbers.join(', ')}` : 'Belum ada'}
            </span>

            {/* Unanswered Numbers List */}
            <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              Belum Diisi ({unansweredNumbers.length}): {unansweredNumbers.length > 0 ? `No. ${unansweredNumbers.join(', ')}` : 'Semua terisi!'}
            </span>
          </div>

          {raguNumbers.length > 0 && (
            <span className="text-amber-900 font-bold bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
              🟨 Ragu-ragu ({raguNumbers.length}): No. {raguNumbers.join(', ')}
            </span>
          )}
        </div>

        {/* CLEAN 2-COLUMN LAYOUT: SISI KIRI (SEMUA SOAL & GAMBAR), SISI KANAN (KHUSUS JAWABAN) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* SISI KIRI: SELURUH TEKS SOAL, STIMULUS, RUMUS, DAN GAMBAR */}
          <div className="lg:col-span-6 border-r-0 lg:border-r border-slate-200 pr-0 lg:pr-6 min-h-[400px] max-h-[520px] overflow-y-auto space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b pb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#007bff]" /> Teks Soal & Stimulus:
              </span>
              <span>Soal No. {currentIdx + 1}</span>
            </div>

            {currentQ.stimulusSubtext && (
              <div className="inline-block bg-rose-100 text-rose-800 text-xs font-extrabold px-2.5 py-1 rounded">
                {currentQ.stimulusSubtext}
              </div>
            )}

            {currentQ.stimulusImage && (
              <div
                className="p-2 bg-slate-50 border border-slate-200 rounded-2xl cursor-zoom-in group relative"
                onClick={() => setZoomedImage(currentQ.stimulusImage)}
                title="Klik untuk memperbesar gambar stimulus"
              >
                <img src={currentQ.stimulusImage} alt="Gambar Soal" className="max-h-80 md:max-h-[380px] w-full rounded-xl mx-auto object-contain bg-white p-1" />
                <div className="mt-2 text-center text-xs font-bold text-[#007bff] bg-blue-50/90 py-1 px-3 rounded-lg border border-blue-200 flex items-center justify-center gap-1">
                  🔍 Klik gambar untuk memperbesar (Zoom Ukuran Penuh)
                </div>
              </div>
            )}

            {/* Stimulus Context if distinct from questionText */}
            {currentQ.stimulus && currentQ.stimulus !== currentQ.questionText && (
              <div className={`p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 ${getFontSizeClass()}`}>
                <MathText text={currentQ.stimulus} />
              </div>
            )}

            {/* Main Question Text */}
            <div className={`font-bold text-slate-900 leading-relaxed ${getFontSizeClass()}`}>
              <MathText text={currentQ.questionText || currentQ.stimulus} />
            </div>
          </div>

          {/* SISI KANAN: KHUSUS PILIHAN & INPUT JAWABAN PESERTA */}
          <div className="lg:col-span-6 min-h-[400px] max-h-[520px] overflow-y-auto pl-0 lg:pl-2 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b pb-1">
              Pilihan & Lembar Jawaban Peserta:
            </div>

            {/* PROMINENT TIPE SOAL BADGE */}
            {renderTypeBadge()}

            {/* 1. SINGLE CHOICE (PILIHAN GANDA PG) */}
            {currentQ.type === 'single' && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options
                  .filter(opt => (opt.text && opt.text.trim().length > 0) || opt.image)
                  .map(opt => {
                  const isSelected = answers[currentQ.id] === opt.key;
                  return (
                    <div
                      key={opt.key}
                      onClick={() => handleSingleAnswer(opt.key)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-150 flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-[#007bff] bg-blue-50/70 shadow-md font-semibold'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <div className="mt-1 flex-shrink-0">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-[#007bff] border-2 border-[#007bff] flex items-center justify-center text-white text-xs font-black">
                            ✓
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white"></div>
                        )}
                      </div>

                      <div className="text-xs md:text-sm text-slate-800 leading-relaxed flex-1">
                        <span className="font-bold text-blue-900 mr-2">{opt.key}.</span>
                        <MathText text={opt.text} />
                        {opt.image && (
                          <div
                            className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl hover:border-[#007bff] transition-all cursor-zoom-in group"
                            onClick={(e) => {
                              e.stopPropagation();
                              setZoomedImage(opt.image);
                            }}
                            title={`Klik untuk memperbesar gambar opsi ${opt.key}`}
                          >
                            <img
                              src={opt.image}
                              alt={`Opsi ${opt.key}`}
                              className="max-h-64 md:max-h-80 w-full rounded-lg object-contain bg-white p-1 shadow-xs"
                            />
                            <div className="mt-1 text-[11px] font-bold text-[#007bff] bg-blue-50/90 py-1 px-2 rounded-lg text-center border border-blue-200 flex items-center justify-center gap-1">
                              🔍 Klik untuk memperbesar gambar opsi {opt.key}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. COMPLEX MULTI CHOICE (PILIHAN GANDA KOMPLEKS) */}
            {currentQ.type === 'complex' && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options
                  .filter(opt => (opt.text && opt.text.trim().length > 0) || opt.image)
                  .map(opt => {
                  const currentSelected = answers[currentQ.id] || [];
                  const isSelected = Array.isArray(currentSelected) 
                    ? currentSelected.includes(opt.key) 
                    : currentSelected === opt.key;

                  return (
                    <div
                      key={opt.key}
                      onClick={() => handleComplexToggleAnswer(opt.key)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-150 flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/80 shadow-md font-semibold'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <div className="mt-1 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-5 h-5 text-amber-600 rounded cursor-pointer"
                        />
                      </div>

                      <div className="text-xs md:text-sm text-slate-800 leading-relaxed flex-1">
                        <span className="font-bold text-amber-900 mr-2">{opt.key}.</span>
                        <MathText text={opt.text} />
                        {opt.image && (
                          <div
                            className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl hover:border-amber-500 transition-all cursor-zoom-in group"
                            onClick={(e) => {
                              e.stopPropagation();
                              setZoomedImage(opt.image);
                            }}
                            title={`Klik untuk memperbesar gambar opsi ${opt.key}`}
                          >
                            <img
                              src={opt.image}
                              alt={`Opsi ${opt.key}`}
                              className="max-h-64 md:max-h-80 w-full rounded-lg object-contain bg-white p-1 shadow-xs"
                            />
                            <div className="mt-1 text-[11px] font-bold text-amber-800 bg-amber-50 py-1 px-2 rounded-lg text-center border border-amber-200 flex items-center justify-center gap-1">
                              🔍 Klik untuk memperbesar gambar opsi {opt.key}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. MATRIX CATEGORIZATION TABLE (MENJODOHKAN / MATRIKS / BENAR - SALAH) */}
            {currentQ.type === 'matrix' && currentQ.matrixHeaders && (
              <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                <table className="w-full text-left text-xs md:text-sm border-collapse">
                  <thead className="bg-slate-100 border-b-2 border-slate-200 text-slate-800 font-extrabold">
                    <tr>
                      <th className="p-3 text-center w-12 border-r border-slate-200">#</th>
                      <th className="p-3 border-r border-slate-200">{currentQ.matrixHeaders[0] || 'Pernyataan'}</th>
                      <th className="p-3 text-center w-28 md:w-36 border-r border-slate-200 bg-blue-50/60 text-[#007bff]">
                        {currentQ.matrixHeaders[1]?.replace(/\s*\(.*?\)/g, '') || 'Benar'}
                      </th>
                      <th className="p-3 text-center w-28 md:w-36 bg-rose-50/60 text-rose-700">
                        {currentQ.matrixHeaders[2]?.replace(/\s*\(.*?\)/g, '') || 'Salah'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {currentQ.matrixRows?.map((row, rIdx) => {
                      const userChoice = matrixAnswers[currentQ.id]?.[row.id];
                      const col1Name = currentQ.matrixHeaders[1];
                      const col2Name = currentQ.matrixHeaders[2];

                      const isCol1Selected = userChoice === col1Name;
                      const isCol2Selected = userChoice === col2Name;

                      const rowLabel = String.fromCharCode(65 + rIdx); // A., B., C...

                      const col1Clean = col1Name?.replace(/\s*\(.*?\)/g, '') || 'Benar';
                      const col2Clean = col2Name?.replace(/\s*\(.*?\)/g, '') || 'Salah';

                      return (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                          {/* Row Letter (#) */}
                          <td className="p-3 text-center font-bold text-slate-500 border-r border-slate-200 bg-slate-50/50">
                            {rowLabel}.
                          </td>

                          {/* Statement Content */}
                          <td className="p-3 font-semibold border-r border-slate-200 leading-relaxed">
                            <MathText text={row.text} />
                          </td>

                          {/* Option Column 1 (Benar) */}
                          <td
                            onClick={() => handleMatrixSelection(row.id, col1Name)}
                            className={`p-3 text-center border-r border-slate-200 cursor-pointer select-none transition-all ${
                              isCol1Selected ? 'bg-blue-100/90 font-bold' : 'hover:bg-blue-50/60'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <input
                                type="radio"
                                name={`matrix-${currentQ.id}-${row.id}`}
                                checked={isCol1Selected}
                                onChange={() => handleMatrixSelection(row.id, col1Name)}
                                className="w-5 h-5 text-[#007bff] focus:ring-[#007bff] cursor-pointer"
                              />
                              <span className={`text-xs font-extrabold ${isCol1Selected ? 'text-blue-950' : 'text-slate-600'}`}>
                                {col1Clean}
                              </span>
                            </div>
                          </td>

                          {/* Option Column 2 (Salah) */}
                          <td
                            onClick={() => handleMatrixSelection(row.id, col2Name)}
                            className={`p-3 text-center cursor-pointer select-none transition-all ${
                              isCol2Selected ? 'bg-rose-100/90 font-bold' : 'hover:bg-rose-50/60'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <input
                                type="radio"
                                name={`matrix-${currentQ.id}-${row.id}`}
                                checked={isCol2Selected}
                                onChange={() => handleMatrixSelection(row.id, col2Name)}
                                className="w-5 h-5 text-rose-600 focus:ring-rose-500 cursor-pointer"
                              />
                              <span className={`text-xs font-extrabold ${isCol2Selected ? 'text-rose-950' : 'text-slate-600'}`}>
                                {col2Clean}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* 4. SHORT ANSWER INPUT (ISIAN SINGKAT) */}
            {currentQ.type === 'short' && (
              <div className="space-y-3 p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <label className="block text-xs font-extrabold text-emerald-950">
                  Tuliskan Jawaban Singkat Anda:
                </label>
                <input
                  type="text"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleShortTextChange(e.target.value)}
                  placeholder="Ketikkan jawaban di sini..."
                  className="w-full p-3.5 bg-white border border-emerald-300 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-emerald-600 shadow-sm"
                />
                <p className="text-[11px] text-slate-500 italic">
                  Jawaban Anda akan otomatis tersimpan saat mengetik.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* COMPLETE BOTTOM NAVIGATION ACTION BAR (PREVIOUS, RAGU, NEXT, FINISH) */}
        <div className="pt-6 border-t mt-6 flex flex-wrap items-center justify-between gap-3">
          
          {/* 1. Tombol Soal Sebelumnya */}
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all ${
              currentIdx === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#dc3545] hover:bg-[#c82333] text-white shadow-md active:scale-95'
            }`}
          >
            ❮ Soal sebelumnya
          </button>

          {/* 2. Tombol Ragu-ragu */}
          <button
            onClick={toggleBookmark}
            className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 transition-all ${
              bookmarks[currentQ.id]
                ? 'bg-amber-400 text-amber-950 font-black shadow-md ring-2 ring-amber-500'
                : 'bg-[#ffc107] hover:bg-[#e0a800] text-amber-950 shadow-sm'
            }`}
          >
            <span className="w-3.5 h-3.5 border-2 border-amber-950 bg-white rounded-xs"></span>
            Ragu-ragu
          </button>

          {/* 3. Tombol Soal Berikutnya & Selesai Ujian Button */}
          <div className="flex items-center gap-2">
            <button
              disabled={currentIdx === totalQ - 1}
              onClick={() => setCurrentIdx(prev => Math.min(totalQ - 1, prev + 1))}
              className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all ${
                currentIdx === totalQ - 1
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                  : 'bg-[#007bff] hover:bg-[#0069d9] text-white shadow-md active:scale-95'
              }`}
            >
              Soal berikutnya ❯
            </button>

            <button
              onClick={handleTriggerFinish}
              className="bg-[#28a745] hover:bg-[#218838] text-white px-6 py-2.5 rounded-full font-bold text-xs md:text-sm shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
            >
              Selesai Ujian ✓
            </button>
          </div>

        </div>

      </div>

      {/* INFORMASI SOAL MODAL */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#007bff]" />
                Informasi & Progress Ujian Peserta
              </h3>
              <button onClick={() => setShowInfoModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg px-2">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p><strong>Mata Pelajaran:</strong> {mapelObj?.label || 'Bahasa Inggris'}</p>
                <p><strong>Nama Peserta:</strong> {namaSiswa}</p>
                <p><strong>Total Soal:</strong> {totalQ} Soal</p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                <p className="font-bold mb-1 text-emerald-900">✅ Soal Sudah Diisi ({answeredNumbers.length} Soal):</p>
                <p className="font-mono">{answeredNumbers.length > 0 ? `Nomor: ${answeredNumbers.join(', ')}` : 'Belum ada soal yang diisi.'}</p>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950">
                <p className="font-bold mb-1 text-rose-900">❌ Soal Belum Diisi ({unansweredNumbers.length} Soal):</p>
                <p className="font-mono">{unansweredNumbers.length > 0 ? `Nomor: ${unansweredNumbers.join(', ')}` : 'Semua soal telah berhasil diisi!'}</p>
              </div>

              {raguNumbers.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-950">
                  <p className="font-bold mb-1 text-amber-900">🟨 Ditandai Ragu-ragu ({raguNumbers.length} Soal):</p>
                  <p className="font-mono">Nomor: {raguNumbers.join(', ')}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t text-right">
              <button
                onClick={() => setShowInfoModal(false)}
                className="bg-[#007bff] hover:bg-[#0069d9] text-white font-bold px-5 py-2 rounded-xl text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selesai Tes Confirmation Modal */}
      {showFinishModal && (
        <SelesaiTesModal
          onConfirmFinish={handleConfirmFinishExam}
          onCancel={() => setShowFinishModal(false)}
        />
      )}

      {/* Grid Modal Navigation (Daftar Soal) */}
      {isGridOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Grid className="w-5 h-5 text-[#007bff]" />
                Daftar Nomor Soal & Status Pengisian
              </h3>
              <button onClick={() => setIsGridOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg px-2">✕</button>
            </div>

            {/* Stats Summary Legend inside Grid Modal */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-[11px] font-bold text-center">
              <div className="p-2 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl">
                <div>Sudah Diisi ({answeredNumbers.length})</div>
                <div className="text-[10px] text-emerald-700 mt-0.5 truncate">{answeredNumbers.length > 0 ? `No. ${answeredNumbers.join(',')}` : '-'}</div>
              </div>

              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl">
                <div>Belum Diisi ({unansweredNumbers.length})</div>
                <div className="text-[10px] text-rose-700 mt-0.5 truncate">{unansweredNumbers.length > 0 ? `No. ${unansweredNumbers.join(',')}` : '-'}</div>
              </div>

              <div className="p-2 bg-amber-100 border border-amber-300 text-amber-950 rounded-xl">
                <div>Ragu-ragu ({raguNumbers.length})</div>
                <div className="text-[10px] text-amber-800 mt-0.5 truncate">{raguNumbers.length > 0 ? `No. ${raguNumbers.join(',')}` : '-'}</div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-6">
              {questions.map((q, idx) => {
                const ansVal = answers[q.id];
                const isAnsArray = Array.isArray(ansVal);
                const hasSingleAns = ansVal !== undefined && ansVal !== '' && (isAnsArray ? ansVal.length > 0 : true);
                const hasMatrixAns = matrixAnswers[q.id] && Object.keys(matrixAnswers[q.id]).length > 0;
                const hasAns = hasSingleAns || hasMatrixAns;
                const isRaguragu = bookmarks[q.id];

                let btnBg = 'bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200';
                if (isRaguragu) btnBg = 'bg-amber-400 border-amber-500 text-amber-950 font-black shadow-xs';
                else if (hasAns) btnBg = 'bg-[#007bff] border-[#007bff] text-white font-bold shadow-xs';

                if (idx === currentIdx) {
                  btnBg += ' ring-2 ring-offset-2 ring-[#007bff]';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setIsGridOpen(false);
                    }}
                    className={`h-11 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center justify-center relative ${btnBg}`}
                  >
                    <span>{idx + 1}</span>
                    {hasAns && !isRaguragu && <span className="text-[9px] text-blue-100">✓ Terisi</span>}
                    {isRaguragu && <span className="text-[9px] text-amber-950 font-black">Ragu</span>}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t text-right">
              <button
                onClick={() => setIsGridOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE ZOOM MODAL (LIGHTBOX) */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              className="bg-white/20 hover:bg-white/40 text-white font-black px-4 py-2 rounded-xl text-xs backdrop-blur-md transition-all shadow-lg border border-white/30"
            >
              ✕ Tutup (Esc)
            </button>
          </div>

          <div
            className="max-w-5xl max-h-[85vh] p-3 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImage}
              alt="Gambar Diperbesar"
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl"
            />
            <div className="mt-2 text-xs font-bold text-slate-500 flex items-center gap-1">
              🔍 Tampilan Ukuran Penuh (Resolusi Tinggi)
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
