import React, { useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignRight, Image as ImageIcon, Table, Sigma, UploadCloud, Lightbulb, Save, Trash2, Plus, Check, CheckSquare, FileText, Layers, Eye, BookOpen } from 'lucide-react';
import { MAPEL_DATABASE } from '../data/subjects';
import { saveQuestionToMapel, findDuplicateQuestionInMapel, replaceQuestionInMapel } from '../data/bankSoalStorage';
import MathText from './MathText';
import MathTutorialModal from './MathTutorialModal';
import DuplicateQuestionModal from './DuplicateQuestionModal';

export default function TambahSoalPage({ initialMapel, onCancel, onSaveSuccess }) {
  const [kategoriMapel, setKategoriMapel] = useState('Mata Pelajaran Wajib');
  
  const getSubjectList = (cat) => {
    if (cat === 'Mata Pelajaran Wajib') {
      return MAPEL_DATABASE['sma-wajib'] || [];
    }
    return MAPEL_DATABASE['sma-pilihan'] || [];
  };

  const currentSubjectList = getSubjectList(kategoriMapel);
  const [mapel, setMapel] = useState(initialMapel?.label || currentSubjectList[0]?.label || 'Matematika');
  
  // Prefill if editing existing question
  const editingQuestion = initialMapel?.editingQuestion || null;

  const getInitialTypeLabel = (q) => {
    if (!q) return 'Pilihan Ganda (PG)';
    if (q.type === 'complex') return 'Pilihan Ganda Kompleks';
    if (q.type === 'matrix') return 'Menjodohkan / Matriks';
    if (q.type === 'short') return 'Isian Singkat';
    return 'Pilihan Ganda (PG)';
  };

  const [tipeSoal, setTipeSoal] = useState(getInitialTypeLabel(editingQuestion));
  const [teksSoal, setTeksSoal] = useState(editingQuestion?.questionText || editingQuestion?.stimulus || '');
  const [soalImage, setSoalImage] = useState(editingQuestion?.stimulusImage || null);
  const [showMathModal, setShowMathModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);

  // Duplicate Modal State
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [existingDupQuestion, setExistingDupQuestion] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [pendingMapelObj, setPendingMapelObj] = useState(null);

  // 1. Single Choice & Multi Choice Options state
  const [options, setOptions] = useState(() => {
    if (editingQuestion?.options && editingQuestion.options.length > 0) {
      return editingQuestion.options.map(o => ({
        id: o.key,
        text: o.text || '',
        image: o.image || null,
        isCorrect: o.key === editingQuestion.correctAnswer || Boolean(o.isCorrect) || (editingQuestion.correctAnswers?.includes(o.key))
      }));
    }
    return [
      { id: 'A', text: '', image: null, isCorrect: true },
      { id: 'B', text: '', image: null, isCorrect: false },
      { id: 'C', text: '', image: null, isCorrect: false },
      { id: 'D', text: '', image: null, isCorrect: false },
      { id: 'E', text: '', image: null, isCorrect: false },
    ];
  });

  // 2. Matrix Table State (Menjodohkan / Matriks)
  const [matrixHeaders, setMatrixHeaders] = useState(editingQuestion?.matrixHeaders || ['Pernyataan / Soal', 'Benar (Sesuai)', 'Salah (Tidak Sesuai)']);
  const [matrixRows, setMatrixRows] = useState(editingQuestion?.matrixRows || [
    { id: 'row-1', text: 'Pernyataan Soal Pertama', correct: 'Benar (Sesuai)' },
    { id: 'row-2', text: 'Pernyataan Soal Kedua', correct: 'Salah (Tidak Sesuai)' },
    { id: 'row-3', text: 'Pernyataan Soal Ketiga', correct: 'Benar (Sesuai)' },
  ]);

  // 3. Short Answer State (Isian Singkat)
  const [kunciIsian, setKunciIsian] = useState(editingQuestion?.correctShortAnswer || '');
  const [variasiIsian, setVariasiIsian] = useState(editingQuestion?.variations || '');

  const handleKategoriChange = (e) => {
    const newCat = e.target.value;
    setKategoriMapel(newCat);
    const newList = getSubjectList(newCat);
    if (newList.length > 0) {
      setMapel(newList[0].label);
    }
  };

  // Insert LaTeX Formula Snippet into teksSoal
  const handleInsertFormula = (snippet) => {
    setTeksSoal(prev => prev + (prev ? ' ' : '') + snippet);
    setShowMathModal(false);
    setShowTutorialModal(false);
  };

  // Option Handlers for PG & PG Kompleks
  const handleOptionTextChange = (id, val) => {
    setOptions(prev => prev.map(o => o.id === id ? { ...o, text: val } : o));
  };

  const handleSetSingleCorrectOption = (id) => {
    setOptions(prev => prev.map(o => ({ ...o, isCorrect: o.id === id })));
  };

  const handleToggleMultiCorrectOption = (id) => {
    setOptions(prev => prev.map(o => o.id === id ? { ...o, isCorrect: !o.isCorrect } : o));
  };

  const handleAddOption = () => {
    const nextChar = String.fromCharCode(65 + options.length);
    setOptions(prev => [...prev, { id: nextChar, text: '', image: null, isCorrect: false }]);
  };

  const handleDeleteOption = (id) => {
    if (options.length <= 2) {
      alert('Pilihan jawaban minimal 2 opsi!');
      return;
    }
    setOptions(prev => prev.filter(o => o.id !== id));
  };

  const handleOptionImageUpload = (id, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setOptions(prev => prev.map(o => o.id === id ? { ...o, image: imageUrl } : o));
    }
  };

  const handleRemoveOptionImage = (id) => {
    setOptions(prev => prev.map(o => o.id === id ? { ...o, image: null } : o));
  };

  // Matrix Row Handlers
  const handleAddMatrixRow = () => {
    const nextId = `row-${matrixRows.length + 1}`;
    setMatrixRows(prev => [...prev, { id: nextId, text: '', correct: matrixHeaders[1] }]);
  };

  const handleUpdateMatrixRowText = (id, val) => {
    setMatrixRows(prev => prev.map(r => r.id === id ? { ...r, text: val } : r));
  };

  const handleUpdateMatrixRowCorrect = (id, val) => {
    setMatrixRows(prev => prev.map(r => r.id === id ? { ...r, correct: val } : r));
  };

  const handleDeleteMatrixRow = (id) => {
    if (matrixRows.length <= 1) {
      alert('Tabel matriks minimal 1 baris!');
      return;
    }
    setMatrixRows(prev => prev.filter(r => r.id !== id));
  };

  const handleSoalImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSoalImage(URL.createObjectURL(file));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    const selectedMapelObj = currentSubjectList.find(m => m.label === mapel) || { 
      id: mapel.toLowerCase().replace(/\s+/g, '-'), 
      label: mapel 
    };

    let typeCode = 'single';
    if (tipeSoal === 'Pilihan Ganda Kompleks') typeCode = 'complex';
    if (tipeSoal === 'Menjodohkan / Matriks') typeCode = 'matrix';
    if (tipeSoal === 'Isian Singkat') typeCode = 'short';

    let questionPayload = {
      id: editingQuestion?.id || Date.now(),
      type: typeCode,
      stimulus: teksSoal || 'Teks Stimulus Soal Baru',
      stimulusImage: soalImage,
      questionText: teksSoal || 'Pertanyaan Soal Baru',
      explanation: 'Pembahasan Soal Baru'
    };

    if (typeCode === 'single') {
      const correctOpt = options.find(o => o.isCorrect)?.id || 'A';
      questionPayload.options = options.map(o => ({ key: o.id, text: o.text, image: o.image, isCorrect: o.isCorrect }));
      questionPayload.correctAnswer = correctOpt;
    } else if (typeCode === 'complex') {
      const correctKeys = options.filter(o => o.isCorrect).map(o => o.id);
      questionPayload.options = options.map(o => ({ key: o.id, text: o.text, image: o.image, isCorrect: o.isCorrect }));
      questionPayload.correctAnswers = correctKeys;
    } else if (typeCode === 'matrix') {
      questionPayload.matrixHeaders = matrixHeaders;
      questionPayload.matrixRows = matrixRows;
    } else if (typeCode === 'short') {
      questionPayload.correctShortAnswer = kunciIsian;
      questionPayload.variations = variasiIsian;
    }

    // CHECK FOR DUPLICATE QUESTION IN BANK SOAL (ONLY IF NOT EDITING SAME QUESTION)
    if (!editingQuestion) {
      const existingDup = findDuplicateQuestionInMapel(selectedMapelObj.id, teksSoal);
      if (existingDup) {
        setExistingDupQuestion(existingDup);
        setPendingPayload(questionPayload);
        setPendingMapelObj(selectedMapelObj);
        setShowDuplicateModal(true);
        return;
      }
    }

    // Save directly if not duplicate or if editing
    saveQuestionToMapel(selectedMapelObj.id, selectedMapelObj.label, questionPayload);
    alert(`Soal ${tipeSoal} untuk "${mapel}" berhasil ${editingQuestion ? 'diperbarui' : 'disimpan'} ke Bank Soal!`);

    if (onSaveSuccess) {
      onSaveSuccess(selectedMapelObj);
    }
  };

  // DUPLICATE DECISION HANDLERS
  const handleReplaceExistingDuplicate = () => {
    if (pendingMapelObj && existingDupQuestion && pendingPayload) {
      replaceQuestionInMapel(pendingMapelObj.id, existingDupQuestion.id, pendingPayload);
      alert(`Soal lama telah diganti dengan soal baru di Bank Soal "${pendingMapelObj.label}"!`);
      setShowDuplicateModal(false);
      if (onSaveSuccess) onSaveSuccess(pendingMapelObj);
    }
  };

  const handleKeepBothDuplicates = () => {
    if (pendingMapelObj && pendingPayload) {
      saveQuestionToMapel(pendingMapelObj.id, pendingMapelObj.label, pendingPayload);
      alert(`Kedua soal berhasil dipertahankan di Bank Soal "${pendingMapelObj.label}"!`);
      setShowDuplicateModal(false);
      if (onSaveSuccess) onSaveSuccess(pendingMapelObj);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Title Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {editingQuestion ? '✏️ Edit Soal' : 'Tambah Soal Baru'}
          </h1>
          <p className="text-xs md:text-sm text-blue-100/90 font-medium mt-0.5">
            {editingQuestion ? 'Perbarui konten & opsi soal tersimpan.' : `Buat soal baru dengan tipe ${tipeSoal} untuk bank soal ANBK.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowTutorialModal(true)}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold px-4 py-2 rounded-xl text-xs md:text-sm transition-all shadow-md flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            📖 Tutorial Penulisan Rumus
          </button>

          <button
            onClick={onCancel}
            className="bg-white text-slate-700 hover:bg-slate-100 font-bold px-4 py-2 rounded-xl text-xs md:text-sm transition-all shadow-sm"
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            className="bg-[#007bff] hover:bg-[#0069d9] text-white font-bold px-5 py-2 rounded-xl text-xs md:text-sm transition-all shadow-md flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            {editingQuestion ? 'Simpan Perubahan' : 'Simpan Soal'}
          </button>
        </div>
      </div>

      {/* Main 2-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Konten Soal & Dynamic Option Editor */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Konten Soal */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">Konten Soal</h3>
              
              <div className="flex items-center gap-2 text-slate-500">
                <button
                  type="button"
                  title="Tutorial Penulisan Rumus"
                  onClick={() => setShowTutorialModal(true)}
                  className="bg-amber-50 text-amber-900 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 border border-amber-300"
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  Tutorial Rumus
                </button>

                <button
                  type="button"
                  title="Sisipkan Rumus Matematika"
                  onClick={() => setShowMathModal(true)}
                  className="bg-blue-50 text-[#007bff] hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 border border-blue-200"
                >
                  <Sigma className="w-4 h-4" />
                  + Rumus Matematika
                </button>
              </div>
            </div>

            {/* Rich Text Toolbar */}
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center gap-1 mb-3 text-slate-600">
              <button className="p-1.5 hover:bg-white rounded font-bold text-xs"><Bold className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 hover:bg-white rounded italic text-xs"><Italic className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 hover:bg-white rounded underline text-xs"><Underline className="w-3.5 h-3.5" /></button>
              <span className="w-px h-4 bg-slate-300 mx-1"></span>
              <button className="p-1.5 hover:bg-white rounded"><List className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 hover:bg-white rounded"><ListOrdered className="w-3.5 h-3.5" /></button>
              <span className="w-px h-4 bg-slate-300 mx-1"></span>
              <button className="p-1.5 hover:bg-white rounded"><AlignLeft className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 hover:bg-white rounded"><AlignRight className="w-3.5 h-3.5" /></button>
            </div>

            {/* Textarea */}
            <textarea
              rows={5}
              value={teksSoal}
              onChange={(e) => setTeksSoal(e.target.value)}
              placeholder="Ketik teks soal di sini... Gunakan $...$ untuk rumus matematika, misal: Diketahui $f(x) = x^2 - 6x + 8$..."
              className="w-full p-4 border border-slate-200 rounded-xl focus:border-[#007bff] outline-none text-sm text-slate-800 font-medium resize-none shadow-xs"
            />

            {/* Live Formula Preview Box */}
            {teksSoal && (
              <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2">
                  <Eye className="w-3.5 h-3.5 text-[#007bff]" /> Pratinjau Tampilan Rumus Soal:
                </div>
                <div className="text-sm font-semibold text-slate-900 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  <MathText text={teksSoal} />
                </div>
              </div>
            )}

            {/* Image Upload Dropzone for Main Soal */}
            <div className="mt-4">
              {soalImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 p-2 bg-slate-50">
                  <img src={soalImage} alt="Soal Stimulus" className="max-h-48 rounded-xl mx-auto object-contain" />
                  <button
                    onClick={() => setSoalImage(null)}
                    className="absolute top-4 right-4 bg-rose-600 text-white p-1.5 rounded-full hover:bg-rose-700 shadow-md"
                    title="Hapus Gambar Stimulus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-slate-300 hover:border-[#007bff] bg-slate-50/60 rounded-2xl p-6 text-center cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSoalImageUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#007bff] mx-auto flex items-center justify-center mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-slate-700">
                    Tarik & Lepas gambar atau <span className="text-[#007bff] underline">Telusuri</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Maks 2MB (JPG, PNG)</p>
                </label>
              )}
            </div>
          </div>

          {/* DYNAMIC EDITOR CARD FOR EACH QUESTION TYPE */}
          
          {/* TYPE 1: PILIHAN GANDA (PG - SINGLE CHOICE) */}
          {tipeSoal === 'Pilihan Ganda (PG)' && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Pilihan Jawaban (Pilihan Ganda)</h3>
                  <p className="text-xs text-slate-400 font-medium">Pilih 1 Opsi Jawaban Benar (Gunakan Radio)</p>
                </div>
                <span className="text-xs text-slate-500 font-medium bg-blue-50 text-[#007bff] px-2.5 py-1 rounded-full font-bold">
                  1 Jawaban Benar
                </span>
              </div>

              <div className="space-y-4">
                {options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      opt.isCorrect ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="correct-option"
                          checked={opt.isCorrect}
                          onChange={() => handleSetSingleCorrectOption(opt.id)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="font-bold text-slate-800 text-xs md:text-sm">
                          Pilihan {opt.id}
                        </span>
                      </label>

                      <div className="flex items-center gap-2">
                        {opt.isCorrect && (
                          <span className="bg-emerald-700 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1">
                            <Check className="w-3 h-3" /> JAWABAN BENAR
                          </span>
                        )}

                        <label className="text-xs font-semibold text-[#007bff] hover:text-[#0056b3] bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 border border-blue-200">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>{opt.image ? 'Ganti Gambar' : '+ Upload Gambar Opsi'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleOptionImageUpload(opt.id, e)}
                            className="hidden"
                          />
                        </label>

                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteOption(opt.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                            title="Hapus Opsi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                      placeholder={`Ketikkan teks pilihan ${opt.id}... (Bisa rumus misal $7/5$)`}
                      className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 font-medium outline-none focus:border-[#007bff] resize-none mb-2"
                    />

                    {opt.text && (
                      <div className="text-xs font-semibold text-slate-700 bg-white p-2 rounded border border-slate-100 mb-2">
                        Pratinjau Opsi: <MathText text={opt.text} />
                      </div>
                    )}

                    {opt.image && (
                      <div className="relative mt-2 p-2 bg-white rounded-xl border border-blue-200 inline-block group">
                        <img
                          src={opt.image}
                          alt={`Gambar Opsi ${opt.id}`}
                          className="h-28 rounded-lg object-contain bg-slate-50 border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionImage(opt.id)}
                          className="absolute top-3 right-3 bg-rose-600 text-white p-1 rounded-full hover:bg-rose-700 shadow-md transition-all"
                          title="Hapus Gambar Opsi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="w-full border-2 border-dashed border-blue-300 hover:border-[#007bff] text-[#007bff] hover:bg-blue-50 font-bold py-3 rounded-xl text-xs md:text-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Tambah Pilihan Jawaban
                </button>
              </div>

            </div>
          )}

          {/* TYPE 2: PILIHAN GANDA KOMPLEKS */}
          {tipeSoal === 'Pilihan Ganda Kompleks' && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Pilihan Jawaban (Pilihan Ganda Kompleks)</h3>
                  <p className="text-xs text-slate-400 font-medium">Bisa memilih lebih dari 1 Opsi Jawaban Benar (Centang Checkbox)</p>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5 text-amber-600" /> Multi-Jawaban Benar
                </span>
              </div>

              <div className="space-y-4">
                {options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      opt.isCorrect ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={opt.isCorrect}
                          onChange={() => handleToggleMultiCorrectOption(opt.id)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer rounded"
                        />
                        <span className="font-bold text-slate-800 text-xs md:text-sm">
                          Pilihan {opt.id} (Centang Jika Benar)
                        </span>
                      </label>

                      <div className="flex items-center gap-2">
                        {opt.isCorrect && (
                          <span className="bg-emerald-700 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1">
                            <Check className="w-3 h-3" /> KUNCI JAWABAN BENAR
                          </span>
                        )}

                        <label className="text-xs font-semibold text-[#007bff] hover:text-[#0056b3] bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 border border-blue-200">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>{opt.image ? 'Ganti Gambar' : '+ Upload Gambar Opsi'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleOptionImageUpload(opt.id, e)}
                            className="hidden"
                          />
                        </label>

                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteOption(opt.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                            title="Hapus Opsi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                      placeholder={`Ketikkan teks opsi ${opt.id}...`}
                      className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 font-medium outline-none focus:border-[#007bff] resize-none mb-2"
                    />

                    {opt.text && (
                      <div className="text-xs font-semibold text-slate-700 bg-white p-2 rounded border border-slate-100 mb-2">
                        Pratinjau Opsi: <MathText text={opt.text} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="w-full border-2 border-dashed border-blue-300 hover:border-[#007bff] text-[#007bff] hover:bg-blue-50 font-bold py-3 rounded-xl text-xs md:text-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Tambah Pilihan Jawaban Kompleks
                </button>
              </div>

            </div>
          )}

          {/* TYPE 3: MENJODOHKAN / MATRIKS */}
          {tipeSoal === 'Menjodohkan / Matriks' && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-5">
              <div className="border-b pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Editor Tabel Matriks / Menjodohkan</h3>
                  <p className="text-xs text-slate-400 font-medium">Susun kolom kategori dan baris pernyataan soal</p>
                </div>
                <span className="text-xs font-bold text-purple-800 bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-full">
                  Tipe Matriks / Tabel
                </span>
              </div>

              {/* Header Kolom Form */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs text-slate-700">Nama Header Kolom Matriks:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Header Kolom 1 (Soal/Pernyataan)</label>
                    <input
                      type="text"
                      value={matrixHeaders[0]}
                      onChange={(e) => setMatrixHeaders([e.target.value, matrixHeaders[1], matrixHeaders[2]])}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Header Kolom 2 (Kategori A)</label>
                    <input
                      type="text"
                      value={matrixHeaders[1]}
                      onChange={(e) => setMatrixHeaders([matrixHeaders[0], e.target.value, matrixHeaders[2]])}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Header Kolom 3 (Kategori B)</label>
                    <input
                      type="text"
                      value={matrixHeaders[2]}
                      onChange={(e) => setMatrixHeaders([matrixHeaders[0], matrixHeaders[1], e.target.value])}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Baris Pernyataan Soal Matriks */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-700">Daftar Baris Pernyataan & Kunci Jawaban Benar:</h4>
                {matrixRows.map((row, idx) => (
                  <div key={row.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <span className="font-bold text-xs text-slate-500 w-6">{idx + 1}.</span>
                    <input
                      type="text"
                      value={row.text}
                      onChange={(e) => handleUpdateMatrixRowText(row.id, e.target.value)}
                      placeholder={`Pernyataan Soal ${idx + 1}...`}
                      className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff]"
                    />

                    <select
                      value={row.correct}
                      onChange={(e) => handleUpdateMatrixRowCorrect(row.id, e.target.value)}
                      className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold rounded-lg text-xs outline-none cursor-pointer"
                    >
                      <option value={matrixHeaders[1]}>Kunci: {matrixHeaders[1]}</option>
                      <option value={matrixHeaders[2]}>Kunci: {matrixHeaders[2]}</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDeleteMatrixRow(row.id)}
                      className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50"
                      title="Hapus Baris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddMatrixRow}
                className="w-full border-2 border-dashed border-purple-300 hover:border-purple-600 text-purple-700 hover:bg-purple-50 font-bold py-3 rounded-xl text-xs md:text-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Tambah Baris Pernyataan Matriks
              </button>
            </div>
          )}

          {/* TYPE 4: ISIAN SINGKAT */}
          {tipeSoal === 'Isian Singkat' && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4">
              <div className="border-b pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Kunci Jawaban Isian Singkat</h3>
                  <p className="text-xs text-slate-400 font-medium">Tentukan kata/angka kunci jawaban yang dianggap benar oleh sistem</p>
                </div>
                <span className="text-xs font-bold text-blue-800 bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-full">
                  Isian Singkat / Essay
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kunci Jawaban Utama</label>
                <input
                  type="text"
                  value={kunciIsian}
                  onChange={(e) => setKunciIsian(e.target.value)}
                  placeholder="Ketik kunci jawaban (misal: 57, Semarang, atau 3/5)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-[#007bff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Variasi Jawaban Diterima (Opsional)</label>
                <textarea
                  rows={2}
                  value={variasiIsian}
                  onChange={(e) => setVariasiIsian(e.target.value)}
                  placeholder="Ketik variasi alternatif jawaban (dipisahkan koma)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff] resize-none"
                />
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Metadata & Panduan */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Metadata Soal */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-800 text-base border-b pb-3">Metadata Soal</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Kategori Mata Pelajaran</label>
              <select
                value={kategoriMapel}
                onChange={handleKategoriChange}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 font-semibold outline-none focus:border-[#007bff] cursor-pointer"
              >
                <option value="Mata Pelajaran Wajib">Mata Pelajaran Wajib</option>
                <option value="Mata Pelajaran Pilihan">Mata Pelajaran Pilihan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Mata Pelajaran ({currentSubjectList.length} Mapel)
              </label>
              <select
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 font-semibold outline-none focus:border-[#007bff] cursor-pointer"
              >
                {currentSubjectList.map(item => (
                  <option key={item.id} value={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Tipe Soal</label>
              <select
                value={tipeSoal}
                onChange={(e) => setTipeSoal(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 font-bold text-[#007bff] outline-none focus:border-[#007bff] cursor-pointer"
              >
                <option value="Pilihan Ganda (PG)">Pilihan Ganda (PG)</option>
                <option value="Pilihan Ganda Kompleks">Pilihan Ganda Kompleks</option>
                <option value="Menjodohkan / Matriks">Menjodohkan / Matriks</option>
                <option value="Isian Singkat">Isian Singkat</option>
              </select>
            </div>

          </div>

          {/* Card 2: Panduan Penulisan Rumus Banner */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 text-xs text-slate-700 flex items-start gap-3 shadow-xs">
            <BookOpen className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-amber-950 mb-1">Buka Tutorial Rumus Lengkap</h4>
              <p className="text-slate-600 leading-relaxed mb-3">
                Pelajari cara membuat rumus pecahan, akar, matriks, limit, dan turunan secara lengkap dengan contoh siap salin.
              </p>
              <button
                type="button"
                onClick={() => setShowTutorialModal(true)}
                className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-extrabold px-4 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" /> Buka Panduan Tutorial ➔
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* MATH FORMULA TEMPLATE HELPER MODAL */}
      {showMathModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Sigma className="w-5 h-5 text-[#007bff]" />
                Template Rumus Matematika Cepat
              </h3>
              <button onClick={() => setShowMathModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg px-2">✕</button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Klik salah satu template di bawah ini untuk menyisipkan rumus matematika ke dalam teks soal:
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleInsertFormula('$\\frac{a}{b}$')}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#007bff] rounded-xl text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-800">Pecahan</div>
                <div className="text-xs text-[#007bff] font-mono mt-1">$\\frac&#123;a&#125;&#123;b&#125;$</div>
              </button>

              <button
                type="button"
                onClick={() => handleInsertFormula('$\\sqrt{x}$')}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#007bff] rounded-xl text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-800">Akar Kuadrat</div>
                <div className="text-xs text-[#007bff] font-mono mt-1">$\\sqrt&#123;x&#125;$</div>
              </button>

              <button
                type="button"
                onClick={() => handleInsertFormula('$x^2 + y^2 = r^2$')}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#007bff] rounded-xl text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-800">Pangkat / Eksponen</div>
                <div className="text-xs text-[#007bff] font-mono mt-1">$x^2 + y^2 = r^2$</div>
              </button>

              <button
                type="button"
                onClick={() => handleInsertFormula('$\\sin(\\alpha) + \\cos(\\alpha)$')}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#007bff] rounded-xl text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-800">Trigonometri</div>
                <div className="text-xs text-[#007bff] font-mono mt-1">$\\sin(\\alpha) + \\cos(\\alpha)$</div>
              </button>

              <button
                type="button"
                onClick={() => handleInsertFormula('$$\\int_{a}^{b} f(x)\\,dx$$')}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#007bff] rounded-xl text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-800">Integral</div>
                <div className="text-xs text-[#007bff] font-mono mt-1">$\\int_&#123;a&#125;^&#123;b&#125; f(x)dx$</div>
              </button>

              <button
                type="button"
                onClick={() => handleInsertFormula('$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$')}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#007bff] rounded-xl text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-800">Limit</div>
                <div className="text-xs text-[#007bff] font-mono mt-1">$\\lim_&#123;x \\to 0&#125;$</div>
              </button>

              <button
                type="button"
                onClick={() => handleInsertFormula('$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$')}
                className="col-span-2 p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#007bff] rounded-xl text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-800">Matriks 2x2</div>
                <div className="text-xs text-[#007bff] font-mono mt-1">$$\\begin&#123;pmatrix&#125; a & b \\\\ c & d \\end&#123;pmatrix&#125;$$</div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowMathModal(false);
                  setShowTutorialModal(true);
                }}
                className="text-xs font-bold text-[#007bff] hover:underline flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" /> Buka Tutorial Lengkap ➔
              </button>

              <button
                type="button"
                onClick={() => setShowMathModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL INTERACTIVE MATH TUTORIAL MODAL */}
      <MathTutorialModal
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
        onInsertCode={handleInsertFormula}
      />

      {/* DUPLICATE QUESTION MODAL */}
      <DuplicateQuestionModal
        isOpen={showDuplicateModal}
        existingQuestion={existingDupQuestion}
        newQuestion={pendingPayload}
        onReplaceExisting={handleReplaceExistingDuplicate}
        onKeepBoth={handleKeepBothDuplicates}
        onCancel={() => setShowDuplicateModal(false)}
      />

    </div>
  );
}
