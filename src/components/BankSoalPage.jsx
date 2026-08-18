import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Edit3, Eye, FileText, CheckCircle2, Layers, Search, Filter, Settings, CheckSquare, Lightbulb, FileSpreadsheet, Upload, Check, AlertTriangle, RefreshCw, PenTool, Target, Award, Shuffle, Dice5, X } from 'lucide-react';
import { getMapelDatabase, saveMapelItem, deleteMapelItem } from '../data/subjects';
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
  const [randomCount, setRandomCount] = useState(10);

  // Bulk Selection State (for Checkboxes)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  // Quick Mapel Management State
  const [mapelDb, setMapelDb] = useState(getMapelDatabase());
  const [showQuickMapelModal, setShowQuickMapelModal] = useState(false);
  const [editingQuickMapel, setEditingQuickMapel] = useState(null);
  const [quickMapelForm, setQuickMapelForm] = useState({ id: '', label: '' });

  const refreshMapelDb = () => {
    setMapelDb(getMapelDatabase());
  };

  // Quick Mapel Handlers
  const handleOpenAddQuickMapel = () => {
    setEditingQuickMapel(null);
    setQuickMapelForm({ id: '', label: '' });
    setShowQuickMapelModal(true);
  };

  const handleOpenEditQuickMapel = (item) => {
    setEditingQuickMapel(item);
    setQuickMapelForm({ id: item.id, label: item.label });
    setShowQuickMapelModal(true);
  };

  const handleSaveQuickMapel = (e) => {
    e.preventDefault();
    if (!quickMapelForm.label.trim()) {
      alert('Nama Mata Pelajaran tidak boleh kosong!');
      return;
    }
    saveMapelItem(selectedKategori, {
      id: quickMapelForm.id,
      label: quickMapelForm.label
    });
    refreshMapelDb();
    setShowQuickMapelModal(false);
  };

  const handleDeleteQuickMapel = (mapelId, label, e) => {
    e.stopPropagation();
    if (window.confirm(`Apakah Anda yakin ingin menghapus mata pelajaran "${label}" dari kategori ini?`)) {
      deleteMapelItem(selectedKategori, mapelId);
      refreshMapelDb();
    }
  };

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

  const currentMapelList = mapelDb[selectedKategori] || [];
  const currentMapelObj = currentMapelList.find(m => m.id === selectedMapelId) || currentMapelList[0] || { id: 'b-ing', label: 'Bahasa Inggris' };
  const mapelQuestions = bankData[currentMapelObj.id]?.questions || [];

  // Active question IDs selected for test in examSettingsStorage
  const examSelectedIds = examSettings?.selectedQuestionIds || [];

  // Pagination State (15 questions per page)
  const [currentPage, setCurrentPage] = useState(1);
  const QUESTIONS_PER_PAGE = 15;

  const filteredQuestions = mapelQuestions.filter(q => 
    q.questionText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.stimulus?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset selection & page when changing mapel or search query or category
  useEffect(() => {
    setSelectedQuestionIds([]);
    setCurrentPage(1);
  }, [selectedMapelId, searchQuery, selectedKategori]);

  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

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
    alert(`Berhasil! ${selectedQuestionIds.length} soal terpilih telah ditetapkan sebagai Soal Ujian Aktif untuk "${currentMapelObj.label}".`);
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

  // RANDOM QUESTION SELECTION HANDLER
  const handleRandomSelect = () => {
    if (mapelQuestions.length === 0) {
      alert('Tidak ada soal tersedia untuk diacak.');
      return;
    }
    const count = Math.min(Math.max(1, randomCount), mapelQuestions.length);
    // Fisher-Yates shuffle then pick first N
    const shuffled = [...mapelQuestions].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, count);
    const pickedIds = picked.map(q => q.id);

    setSelectedQuestionIds(pickedIds);

    saveExamSettingForMapel(currentMapelObj.id, {
      selectedQuestionIds: pickedIds,
      metodeSoal: 'acak',
      jumlahSoal: count
    });

    loadExamSettings(currentMapelObj.id);
    alert(`Berhasil memilih ${count} soal secara ACAK dari ${mapelQuestions.length} soal tersedia untuk "${currentMapelObj.label}".`);
  };

  // RESET / CANCEL RANDOM SELECTION
  const handleResetRandomSelect = () => {
    setSelectedQuestionIds([]);
    saveExamSettingForMapel(currentMapelObj.id, {
      selectedQuestionIds: [],
      metodeSoal: 'acak',
      jumlahSoal: mapelQuestions.length
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
    if (window.confirm(`PERINGATAN: Apakah Anda yakin ingin MENGOSONGKAN SELURUH ${mapelQuestions.length} SOAL di "${currentMapelObj.label}"?`)) {
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
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
            Tutorial Rumus
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all text-xs md:text-sm flex items-center justify-center gap-2"
          >
            Impor Soal Text (.txt)
          </button>

          <button
            onClick={() => onGoToSchedule && onGoToSchedule(currentMapelObj)}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all text-xs md:text-sm flex items-center justify-center gap-2"
          >
            Atur Jadwal & Waktu Ujian
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
          Daftar Soal Tersimpan ({mapelQuestions.length})
        </button>

        <button
          onClick={handleOpenAddQuestion}
          className={`flex-1 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            subTab === 'editor'
              ? 'bg-white text-[#007bff] shadow-md'
              : 'text-blue-100 hover:text-white hover:bg-white/10'
          }`}
        >
          {editingQuestion ? 'Edit Soal' : '+ Buat Soal Manual'}
        </button>
      </div>

      {/* VIEW MODE 1: DAFTAR SOAL TERSIMPAN */}
      {subTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Filter Mapel Selector Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">
                Pilih Mata Pelajaran
              </h3>
              <button
                type="button"
                onClick={handleOpenAddQuickMapel}
                className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 text-xs font-black py-1 px-3 rounded-lg shadow-xs transition-all flex items-center gap-1"
                title="Tambah Mata Pelajaran Baru ke Kategori Ini"
              >
                <Plus className="w-3.5 h-3.5" /> + Tambah Mapel
              </button>
            </div>

            {/* Kategori Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Kategori Jenjang/Jenis</label>
              <select
                value={selectedKategori}
                onChange={(e) => {
                  setSelectedKategori(e.target.value);
                  const newList = mapelDb[e.target.value] || [];
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-500">
                  Daftar Mapel ({currentMapelList.length} Mata Pelajaran)
                </label>
              </div>

              <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-slate-50/50 p-1">
                {currentMapelList.map(item => {
                  const count = bankData[item.id]?.questions?.length || 0;
                  const isSelected = selectedMapelId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMapelId(item.id)}
                      className={`p-3 rounded-lg text-xs md:text-sm font-semibold cursor-pointer transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-[#007bff] text-white shadow-md'
                          : 'hover:bg-white text-slate-700'
                      }`}
                    >
                      <span className="truncate pr-2">{item.label}</span>
                      
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Quick Edit Icon */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleOpenEditQuickMapel(item); }}
                          className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                            isSelected ? 'text-white hover:bg-white/20' : 'text-slate-400 hover:text-[#007bff] hover:bg-slate-100'
                          }`}
                          title="Edit nama mapel ini"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Delete Icon */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteQuickMapel(item.id, item.label, e)}
                          className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                            isSelected ? 'text-white hover:bg-white/20' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title="Hapus mapel ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Count Badge */}
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {count} Soal
                        </span>
                      </div>
                    </div>
                  );
                })}

                {currentMapelList.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-400 italic">
                    Belum ada mata pelajaran. Klik "+ Tambah Mapel" di atas.
                  </div>
                )}
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
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-300">
                  Soal Ujian Terpilih: <strong>{examSelectedIds.length > 0 ? examSelectedIds.length : mapelQuestions.length} Soal</strong>
                </span>

                <button
                  onClick={handleOpenAddQuestion}
                  className="bg-[#007bff] hover:bg-[#0069d9] text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  + Tambah Soal Manual
                </button>
              </div>
            </div>

            {/* Search Box & Multi-Select Bar */}
            {mapelQuestions.length > 0 && (
              <div className="space-y-3 mb-5">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari teks soal atau kata kunci..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-700 outline-none focus:border-[#007bff]"
                  />
                </div>

                {/* RANDOM QUESTION PICKER CARD */}
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-indigo-950">Pilih Soal Acak</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Sistem akan memilih soal secara acak dari {mapelQuestions.length} soal tersedia</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white border border-indigo-200 rounded-xl overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setRandomCount(prev => Math.max(1, prev - 1))}
                        className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 font-bold text-sm transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={mapelQuestions.length}
                        value={randomCount}
                        onChange={(e) => setRandomCount(Math.max(1, Math.min(mapelQuestions.length, parseInt(e.target.value) || 1)))}
                        className="w-14 text-center text-sm font-extrabold text-indigo-900 outline-none border-x border-indigo-200 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => setRandomCount(prev => Math.min(mapelQuestions.length, prev + 1))}
                        className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 font-bold text-sm transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">soal</span>

                    <button
                      onClick={handleRandomSelect}
                      disabled={mapelQuestions.length === 0}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-[0.99]"
                    >
                      Acak Sekarang
                    </button>

                    {examSelectedIds.length > 0 && (
                      <button
                        onClick={handleResetRandomSelect}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 active:scale-[0.99]"
                      >
                        Reset Pilihan
                      </button>
                    )}
                  </div>
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
                        Gunakan ({selectedQuestionIds.length}) Soal Terpilih untuk Ujian
                      </button>
                    )}

                    {selectedQuestionIds.length > 0 && (
                      <button
                        onClick={handleDeleteSelectedBatch}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm flex items-center gap-1.5"
                      >
                        Hapus Terpilih ({selectedQuestionIds.length})
                      </button>
                    )}

                    <button
                      onClick={handleClearAllQuestions}
                      className="bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5"
                      title="Kosongkan seluruh soal pada mapel ini"
                    >
                      Kosongkan Mapel Ini
                    </button>
                  </div>
                </div>
              </div>
            )}            {/* Question List */}
            {filteredQuestions.length > 0 ? (
              <div className="space-y-4">
                {paginatedQuestions.map((q, idx) => {
                  const realIndex = startIndex + idx;
                  const isChecked = selectedQuestionIds.includes(q.id);
                  const isExamSelected = examSelectedIds.includes(q.id) || (examSelectedIds.length === 0);

                  return (
                    <div
                      key={q.id || realIndex}
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
                            Soal No. {realIndex + 1}
                          </span>

                          {/* EXAM SELECTION BADGE / INDICATOR */}
                          <button
                            onClick={() => handleToggleSingleQuestionForExam(q.id)}
                            className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold transition-all cursor-pointer ${
                              isExamSelected
                                ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                                : 'bg-slate-200 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                            }`}
                            title="Klik untuk memilih/membatalkan soal ini sebagai Soal Ujian"
                          >
                            <span>{isExamSelected ? 'Soal Ujian Terpilih' : 'Pilih untuk Ujian'}</span>
                          </button>

                          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                            Tipe: {q.type === 'single' ? 'PG' : q.type === 'complex' ? 'PG Kompleks' : q.type === 'matrix' ? 'Matriks' : 'Isian'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Edit Question Button */}
                          <button
                            onClick={() => handleOpenEditQuestion(q)}
                            className="bg-blue-50 hover:bg-blue-100 text-[#007bff] font-bold px-3 py-1 rounded-lg text-xs border border-blue-200 transition-colors"
                            title="Edit Soal Ini"
                          >
                            Edit Soal
                          </button>

                          {/* Delete Question Button */}
                          <button
                            onClick={() => handleDeleteSingle(q.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Hapus Soal"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>

                      {/* Stimulus / Question Preview */}
                      <div className="text-xs md:text-sm font-semibold text-slate-800 mb-2 leading-relaxed">
                        <MathText text={q.questionText || q.stimulus} />
                      </div>

                      {/* Stimulus Image if attached */}
                      {(q.stimulusImage || q.image) && (
                        <div className="my-3">
                          <img
                            src={q.stimulusImage || q.image}
                            alt={`Gambar Soal No. ${realIndex + 1}`}
                            className="max-h-56 md:max-h-72 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1.5 shadow-xs"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const parent = e.target.parentElement;
                              if (parent && !parent.querySelector('.image-error-msg')) {
                                const errBox = document.createElement('div');
                                errBox.className = 'image-error-msg p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900 flex items-center justify-between';
                                errBox.innerHTML = '<span>⚠️ Gambar soal sementara (blob) telah kadaluarsa karena halaman diperbarui. Klik <b>"Edit Soal"</b> untuk mengunggah gambar permanen.</span>';
                                parent.appendChild(errBox);
                              }
                            }}
                          />
                        </div>
                      )}

                      {/* Options / Answer Summary */}
                      {q.type === 'single' && q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options
                            .filter(opt => (opt.text && opt.text.trim().length > 0) || opt.image)
                            .map((opt, optIdx) => (
                              <div
                                key={opt.key || optIdx}
                                className={`p-2 rounded-lg border ${
                                  opt.key === q.correctAnswer || opt.isCorrect
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                    : 'bg-white border-slate-200 text-slate-600'
                                }`}
                              >
                                <span>{opt.key}. <MathText text={opt.text ? opt.text.split('\n')[0] : '(Opsi Gambar)'} /></span>
                                {(opt.key === q.correctAnswer || opt.isCorrect) && (
                                  <span className="ml-1 text-[10px] text-emerald-700">(Kunci)</span>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                      {q.type === 'matrix' && (
                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 overflow-x-auto">
                          <div className="flex items-center justify-between font-bold text-slate-800 border-b pb-1.5">
                            <span>Tipe Matriks / Tabel ({q.matrixRows?.length || 0} Baris Soal)</span>
                            {q.matrixHeaders && (
                              <span className="text-[11px] font-mono text-[#007bff] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                {q.matrixHeaders[0] || 'Soal'} | {q.matrixHeaders[1] || 'Kategori 1'} | {q.matrixHeaders[2] || 'Kategori 2'}
                              </span>
                            )}
                          </div>
                          {q.matrixRows && q.matrixRows.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              {q.matrixRows.map((r, rIdx) => (
                                <div key={r.id || rIdx} className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                                  <span className="font-semibold text-slate-800 flex-1 truncate">{rIdx + 1}. <MathText text={r.text} /></span>
                                  <span className="font-extrabold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md whitespace-nowrap flex-shrink-0">
                                    Kunci: {r.correct}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* PAGINATION CONTROLS (10 items per page) */}
                {filteredQuestions.length > QUESTIONS_PER_PAGE && (
                  <div className="mt-6 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-600 font-semibold">
                      Menampilkan <span className="font-bold text-slate-900">{startIndex + 1} - {Math.min(endIndex, filteredQuestions.length)}</span> dari <span className="font-bold text-slate-900">{filteredQuestions.length}</span> Soal (Halaman {currentPage} dari {totalPages})
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage(prev => Math.max(prev - 1, 1));
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        ‹ Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            currentPage === page
                              ? 'bg-[#007bff] text-white shadow-md scale-105'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-[#007bff]'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage(prev => Math.min(prev + 1, totalPages));
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        Next ›
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center bg-slate-50/70 rounded-2xl border-2 border-dashed border-slate-200">
                <h4 className="font-bold text-slate-700 text-base">Belum Ada Soal Tersimpan untuk {currentMapelObj.label}</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Klik tombol di bawah untuk membuat atau mengimpor soal dari file teks (.txt).
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md transition-all inline-flex items-center gap-1.5"
                  >
                    Impor Dari File Teks (.txt)
                  </button>

                  <button
                    onClick={handleOpenAddQuestion}
                    className="bg-[#007bff] hover:bg-[#0069d9] text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md transition-all inline-flex items-center gap-1.5"
                  >
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
          initialMapel={{ ...currentMapelObj, categoryKey: selectedKategori, editingQuestion }}
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

      {/* QUICK MAPEL ADD & EDIT MODAL */}
      {showQuickMapelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                {editingQuickMapel ? 'Edit Nama Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <button onClick={() => setShowQuickMapelModal(false)} className="text-slate-400 hover:text-slate-700 font-bold p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickMapel} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Jenis Mapel</label>
                <div className="p-2.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-800 border border-slate-200">
                  {selectedKategori === 'sma-wajib' ? 'SMA/SMK - Mata Pelajaran Wajib' :
                   selectedKategori === 'sma-pilihan' ? 'SMA/SMK - Mata Pelajaran Pilihan' :
                   selectedKategori === 'smp' ? 'SMP / MTs Sederajat' : 'SD / MI Sederajat'}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode / ID Mapel (Slug)</label>
                <input
                  type="text"
                  value={quickMapelForm.id}
                  onChange={(e) => setQuickMapelForm({ ...quickMapelForm, id: e.target.value })}
                  placeholder="Contoh: pkk / dkv / fisika"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Kosongkan untuk membuat kode ID otomatis dari nama mapel.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Mata Pelajaran *</label>
                <input
                  type="text"
                  required
                  value={quickMapelForm.label}
                  onChange={(e) => setQuickMapelForm({ ...quickMapelForm, label: e.target.value })}
                  placeholder="Contoh: Projek Kreatif dan Kewirausahaan (PKK)"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowQuickMapelModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs shadow-md"
                >
                  Simpan Mata Pelajaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
