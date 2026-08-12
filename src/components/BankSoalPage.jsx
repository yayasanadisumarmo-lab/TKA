import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit3, Eye, FileText, CheckCircle2, Layers, Search, Filter, Settings, CheckSquare, Lightbulb, FileSpreadsheet, Upload, Check, AlertTriangle, RefreshCw, PenTool, Target, Award } from 'lucide-react';
import { MAPEL_DATABASE } from '../data/subjects';
import { getBankSoal, deleteQuestionFromMapel, deleteMultipleQuestionsFromMapel, clearBankSoalMapel } from '../data/bankSoalStorage';
import { getExamSettingForMapel, saveExamSettingForMapel } from '../data/examSettingsStorage';
import MathText from './MathText';
import MathTutorialModal from './MathTutorialModal';
import ImportDocxModal from './ImportDocxModal';
import TambahSoalPage from './TambahSoalPage';

export default function BankSoalPage({ onGoToSchedule, initialQuestionToEdit = null }) {
  // Main Sub-Tab Mode: 'list' | 'editor'
  const [subTab, setSubTab] = useState(initialQuestionToEdit ? 'editor' : 'list');
  const [editingQuestion, setEditingQuestion] = useState(initialQuestionToEdit);

  const [selectedKategori, setSelectedKategori] = useState('sma-wajib');
  const [selectedMapelId, setSelectedMapelId] = useState('b-ing');
  const [bankData, setBankData] = useState({});
  const [examSettings, setExamSettings] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Bulk Selection State (for Checkboxes)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  // Load bank soal and active exam settings
  const loadBankData = () => {
    const data = getBankSoal();
    setBankData(data);
  };

  const loadExamSettings = (mId) => {
    const setting = getExamSettingForMapel(mId);
    setExamSettings(setting);
  };

  useEffect(() => {
    loadBankData();
  }, []);

  useEffect(() => {
    loadExamSettings(selectedMapelId);
  }, [selectedMapelId]);

  const currentMapelList = MAPEL_DATABASE[selectedKategori] || [];
  const currentMapelObj = currentMapelList.find(m => m.id === selectedMapelId) || currentMapelList[0] || { id: 'b-ing', label: 'Bahasa Inggris' };
  const mapelQuestions = bankData[currentMapelObj.id]?.questions || [];

  // Active question IDs selected for test in examSettingsStorage
  const examSelectedIds = examSettings?.selectedQuestionIds || [];

  const filteredQuestions = mapelQuestions.filter(q => 
    q.questionText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.stimulus?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset selection when changing mapel
  useEffect(() => {
    setSelectedQuestionIds([]);
  }, [selectedMapelId]);

  // Handlers for switching to editor mode
  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setSubTab('editor');
  };

  const handleOpenEditQuestion = (questionData) => {
    setEditingQuestion(questionData);
    setSubTab('editor');
  };

  const handleSaveEditorSuccess = () => {
    loadBankData();
    loadExamSettings(currentMapelObj.id);
    setEditingQuestion(null);
    setSubTab('list');
  };

  const handleCancelEditor = () => {
    setEditingQuestion(null);
    setSubTab('list');
  };

  // Bulk Selection Handlers
  const handleToggleSelectQuestion = (qId) => {
    setSelectedQuestionIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleSelectAll = () => {
    if (selectedQuestionIds.length === filteredQuestions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(filteredQuestions.map(q => q.id));
    }
  };

  // EXAM ASSIGNMENT HANDLERS
  const handleSetSelectedAsExamQuestions = () => {
    if (selectedQuestionIds.length === 0) return;

    saveExamSettingForMapel(currentMapelObj.id, {
      selectedQuestionIds: selectedQuestionIds,
      metodeSoal: 'manual',
      jumlahSoal: selectedQuestionIds.length
    });

    loadExamSettings(currentMapelObj.id);
    alert(`🎯 Berhasil! ${selectedQuestionIds.length} soal terpilih telah ditetapkan sebagai Soal Ujian Aktif untuk "${currentMapelObj.label}".`);
  };

  const handleToggleSingleQuestionForExam = (qId) => {
    let updatedIds;
    if (examSelectedIds.includes(qId)) {
      updatedIds = examSelectedIds.filter(id => id !== qId);
    } else {
      updatedIds = [...examSelectedIds, qId];
    }

    saveExamSettingForMapel(currentMapelObj.id, {
      selectedQuestionIds: updatedIds,
      metodeSoal: 'manual',
      jumlahSoal: updatedIds.length > 0 ? updatedIds.length : mapelQuestions.length
    });

    loadExamSettings(currentMapelObj.id);
  };

  // Delete Handlers
  const handleDeleteSingle = (qId) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus Soal No. ${qId}?`)) {
      deleteQuestionFromMapel(currentMapelObj.id, qId);
      setSelectedQuestionIds(prev => prev.filter(id => id !== qId));
      loadBankData();
      loadExamSettings(currentMapelObj.id);
    }
  };

  const handleDeleteSelectedBatch = () => {
    if (selectedQuestionIds.length === 0) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedQuestionIds.length} soal yang dicentang sekaligus?`)) {
      deleteMultipleQuestionsFromMapel(currentMapelObj.id, selectedQuestionIds);
      setSelectedQuestionIds([]);
      loadBankData();
      loadExamSettings(currentMapelObj.id);
      alert(`Berhasil menghapus ${selectedQuestionIds.length} soal!`);
    }
  };

  const handleClearAllQuestions = () => {
    if (mapelQuestions.length === 0) return;
    if (window.confirm(`⚠️ PERINGATAN: Apakah Anda yakin ingin MENGOSONGKAN SELURUH ${mapelQuestions.length} SOAL di "${currentMapelObj.label}"?`)) {
      clearBankSoalMapel(currentMapelObj.id);
      setSelectedQuestionIds([]);
      loadBankData();
      loadExamSettings(currentMapelObj.id);
      alert(`Seluruh soal di "${currentMapelObj.label}" telah berhasil dikosongkan.`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Banner Title & Unified Sub-Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-amber-300" />
            Pusat Bank Soal & Pembuatan Soal
          </h1>
          <p className="text-xs md:text-sm text-blue-100/90 font-medium mt-1">
            Kelola, pilih soal ujian, buat, dan impor soal ANBK untuk seluruh mata pelajaran dalam satu tempat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowTutorialModal(true)}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all text-xs md:text-sm flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            📖 Tutorial Rumus
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all text-xs md:text-sm flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            📥 Impor Soal Word (.docx)
          </button>

          <button
            onClick={() => onGoToSchedule && onGoToSchedule(currentMapelObj)}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all text-xs md:text-sm flex items-center justify-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            🎯 Atur Jadwal & Waktu Ujian
          </button>
        </div>
      </div>

      {/* Sub-Tab Mode Switcher Pills */}
      <div className="bg-blue-900/40 p-1.5 rounded-2xl flex items-center gap-2 mb-6 border border-blue-400/20 max-w-lg shadow-inner">
        <button
          onClick={() => { setEditingQuestion(null); setSubTab('list'); }}
          className={`flex-1 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            subTab === 'list'
              ? 'bg-white text-[#007bff] shadow-md'
              : 'text-blue-100 hover:text-white hover:bg-white/10'
          }`}
        >
          <BookOpen className="w-4 h-4" /> 📋 Daftar Soal Tersimpan ({mapelQuestions.length})
        </button>

        <button
          onClick={handleOpenAddQuestion}
          className={`flex-1 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            subTab === 'editor'
              ? 'bg-white text-[#007bff] shadow-md'
              : 'text-blue-100 hover:text-white hover:bg-white/10'
          }`}
        >
          <PenTool className="w-4 h-4 text-amber-400" />
          {editingQuestion ? '✏️ Edit Soal' : '+ Buat Soal Manual'}
        </button>
      </div>

      {/* VIEW MODE 1: DAFTAR SOAL TERSIMPAN */}
      {subTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Filter Mapel Selector Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4">
            
            <h3 className="font-bold text-slate-800 text-base border-b pb-3 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#007bff]" />
              Pilih Mata Pelajaran
            </h3>

            {/* Kategori Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Kategori Jenjang/Jenis</label>
              <select
                value={selectedKategori}
                onChange={(e) => {
                  setSelectedKategori(e.target.value);
                  const newList = MAPEL_DATABASE[e.target.value] || [];
                  if (newList.length > 0) setSelectedMapelId(newList[0].id);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 font-semibold outline-none focus:border-[#007bff] cursor-pointer"
              >
                <option value="sma-wajib">SMA/SMK - Mata Pelajaran Wajib</option>
                <option value="sma-pilihan">SMA/SMK - Mata Pelajaran Pilihan (47 Mapel)</option>
                <option value="smp">SMP / MTs Sederajat</option>
                <option value="sd">SD / MI Sederajat</option>
              </select>
            </div>

            {/* Mapel Items List Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Daftar Mapel ({currentMapelList.length} Mata Pelajaran)
              </label>
              <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-slate-50/50 p-1">
                {currentMapelList.map(item => {
                  const count = bankData[item.id]?.questions?.length || 0;
                  const isSelected = selectedMapelId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMapelId(item.id)}
                      className={`p-3 rounded-lg text-xs md:text-sm font-semibold cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#007bff] text-white shadow-md'
                          : 'hover:bg-white text-slate-700'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {count} Soal
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Daftar Soal Tersimpan for Selected Mapel */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-xl border border-slate-100 min-h-[500px]">
            
            {/* Header Box of Selected Subject */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 mb-6">
              <div>
                <span className="text-xs font-bold text-[#007bff] bg-blue-50 px-2.5 py-1 rounded-md uppercase">
                  BANK SOAL MATA PELAJARAN
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                  {currentMapelObj.label}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-700" />
                  Soal Ujian Terpilih: <strong>{examSelectedIds.length > 0 ? examSelectedIds.length : mapelQuestions.length} Soal</strong>
                </span>

                <button
                  onClick={handleOpenAddQuestion}
                  className="bg-[#007bff] hover:bg-[#0069d9] text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> + Tambah Soal Manual
                </button>
              </div>
            </div>

            {/* Search Box & Multi-Select Bar */}
            {mapelQuestions.length > 0 && (
              <div className="space-y-3 mb-5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari teks soal atau kata kunci..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-700 outline-none focus:border-[#007bff]"
                  />
                </div>

                {/* BATCH OPERATION ACTION BAR */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filteredQuestions.length > 0 && selectedQuestionIds.length === filteredQuestions.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-[#007bff] rounded cursor-pointer"
                    />
                    <span>Pilih Semua ({selectedQuestionIds.length}/{filteredQuestions.length} Terpilih)</span>
                  </label>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* BUTTON TO SET SELECTED QUESTIONS AS ACTIVE EXAM TEST QUESTIONS */}
                    {selectedQuestionIds.length > 0 && (
                      <button
                        onClick={handleSetSelectedAsExamQuestions}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-md flex items-center gap-1.5 active:scale-[0.99]"
                      >
                        <Target className="w-4 h-4" />
                        🎯 Gunakan ({selectedQuestionIds.length}) Soal Terpilih untuk Ujian
                      </button>
                    )}

                    {selectedQuestionIds.length > 0 && (
                      <button
                        onClick={handleDeleteSelectedBatch}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus Terpilih ({selectedQuestionIds.length})
                      </button>
                    )}

                    <button
                      onClick={handleClearAllQuestions}
                      className="bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5"
                      title="Kosongkan seluruh soal pada mapel ini"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Kosongkan Mapel Ini
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Question List */}
            {filteredQuestions.length > 0 ? (
              <div className="space-y-4">
                {filteredQuestions.map((q, idx) => {
                  const isChecked = selectedQuestionIds.includes(q.id);
                  const isExamSelected = examSelectedIds.includes(q.id) || (examSelectedIds.length === 0);

                  return (
                    <div
                      key={q.id || idx}
                      className={`p-4 md:p-5 rounded-2xl border-2 transition-all ${
                        isChecked
                          ? 'border-[#007bff] bg-blue-50/30 shadow-md'
                          : isExamSelected
                          ? 'border-emerald-300 bg-emerald-50/20 hover:bg-white hover:shadow-md'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b pb-2 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Checkbox for Bulk Operations */}
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelectQuestion(q.id)}
                            className="w-4 h-4 text-[#007bff] rounded cursor-pointer"
                          />

                          <span className="bg-[#007bff] text-white text-xs font-bold px-2.5 py-0.5 rounded-lg">
                            Soal No. {idx + 1}
                          </span>

                          {/* EXAM SELECTION BADGE / INDICATOR */}
                          <button
                            onClick={() => handleToggleSingleQuestionForExam(q.id)}
                            className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                              isExamSelected
                                ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                                : 'bg-slate-200 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                            }`}
                            title="Klik untuk memilih/membatalkan soal ini sebagai Soal Ujian"
                          >
                            <Target className="w-3.5 h-3.5" />
                            <span>{isExamSelected ? '✅ Soal Ujian Terpilih' : '⚪ Pilih untuk Ujian'}</span>
                          </button>

                          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                            Tipe: {q.type === 'single' ? 'PG' : q.type === 'complex' ? 'PG Kompleks' : q.type === 'matrix' ? 'Matriks' : 'Isian'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Edit Question Button */}
                          <button
                            onClick={() => handleOpenEditQuestion(q)}
                            className="bg-blue-50 hover:bg-blue-100 text-[#007bff] font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1 border border-blue-200 transition-colors"
                            title="Edit Soal Ini"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit Soal
                          </button>

                          {/* Delete Question Button */}
                          <button
                            onClick={() => handleDeleteSingle(q.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Hapus Soal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Stimulus / Question Preview */}
                      <div className="text-xs md:text-sm font-semibold text-slate-800 mb-3 line-clamp-3">
                        <MathText text={q.questionText || q.stimulus} />
                      </div>

                      {/* Options / Answer Summary */}
                      {q.type === 'single' && q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map(opt => (
                            <div
                              key={opt.key}
                              className={`p-2 rounded-lg border ${
                                opt.key === q.correctAnswer || opt.isCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              <span>{opt.key}. <MathText text={opt.text ? opt.text.split('\n')[0] : '(Opsi Gambar)'} /></span>
                              {(opt.key === q.correctAnswer || opt.isCorrect) && (
                                <span className="ml-1 text-[10px] text-emerald-700">✓ (Kunci)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {q.type === 'matrix' && (
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs text-slate-600">
                          📊 Tipe Soal Matriks/Tabel ({q.matrixRows?.length || 0} Baris Soal)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center bg-slate-50/70 rounded-2xl border-2 border-dashed border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 text-base">Belum Ada Soal Tersimpan untuk {currentMapelObj.label}</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Klik tombol di bawah untuk membuat atau mengimpor soal dari Word (.docx).
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md transition-all inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    Impor Dari File Word (.docx)
                  </button>

                  <button
                    onClick={handleOpenAddQuestion}
                    className="bg-[#007bff] hover:bg-[#0069d9] text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md transition-all inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Buat Soal Manual
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* VIEW MODE 2: FORM BUAT & EDIT SOAL MANUAL */}
      {subTab === 'editor' && (
        <TambahSoalPage
          initialMapel={{ ...currentMapelObj, editingQuestion }}
          onCancel={handleCancelEditor}
          onSaveSuccess={handleSaveEditorSuccess}
        />
      )}

      {/* FULL MATH TUTORIAL MODAL */}
      <MathTutorialModal
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
      />

      {/* IMPORT DOCX MODAL */}
      <ImportDocxModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        selectedMapelObj={currentMapelObj}
        onImportSuccess={loadBankData}
      />

    </div>
  );
}
