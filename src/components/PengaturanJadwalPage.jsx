import React, { useState, useEffect } from 'react';
import { Settings, Clock, Calendar, Shuffle, CheckSquare, Save, Filter, BookOpen, AlertCircle, Users, CheckCircle2, UserCheck, GraduationCap, Search, Check, Plus, Trash2, Edit3, X } from 'lucide-react';
import { getMapelDatabase, saveMapelItem, deleteMapelItem } from '../data/subjects';
import { getBankSoal } from '../data/bankSoalStorage';
import { getExamSettingForMapel, saveExamSettingForMapel } from '../data/examSettingsStorage';
import { getSiswaData, parseTingkat } from '../data/siswaDatabase';

// Helper to auto-calculate end time (HH:MM) from start time + duration (minutes)
const calculateEndTime = (startStr, durationMinutes) => {
  if (!startStr) return '08:45';
  const [hStr, mStr] = startStr.split(':');
  let hours = parseInt(hStr, 10) || 0;
  let minutes = parseInt(mStr, 10) || 0;

  const totalMinutes = hours * 60 + minutes + parseInt(durationMinutes || 0, 10);
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

export default function PengaturanJadwalPage({ initialMapel, onSaveSuccess }) {
  const [selectedKategori, setSelectedKategori] = useState('sma-wajib');
  const [selectedMapelId, setSelectedMapelId] = useState(initialMapel?.id || 'b-ing');

  // Setting States
  const [durasiMenit, setDurasiMenit] = useState(75);
  const [tanggalUjian, setTanggalUjian] = useState('2026-08-15');
  const [jamMulai, setJamMulai] = useState('07:30');
  const [jamSelesai, setJamSelesai] = useState('08:45');
  const [jumlahSoal, setJumlahSoal] = useState(20);
  const [metodeSoal, setMetodeSoal] = useState('acak'); // 'acak' | 'manual'
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  // Student Selection States (Only applies to Siswa)
  const [allSiswaList, setAllSiswaList] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [filterStudentTingkat, setFilterStudentTingkat] = useState('all'); // 'all' | 'X' | 'XI' | 'XII'
  const [filterStudentJurusan, setFilterStudentJurusan] = useState('all'); // 'all' | 'TKR' | 'TKJ' | 'TAV'
  const [filterStudentKelas, setFilterStudentKelas] = useState('all');
  const [filterStudentSearch, setFilterStudentSearch] = useState('');

  const [bankData, setBankData] = useState({});
  const [mapelDb, setMapelDb] = useState(getMapelDatabase());
  const [showQuickMapelModal, setShowQuickMapelModal] = useState(false);
  const [editingQuickMapel, setEditingQuickMapel] = useState(null);
  const [quickMapelForm, setQuickMapelForm] = useState({ id: '', label: '' });

  const refreshMapelDb = () => {
    setMapelDb(getMapelDatabase());
  };

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

  useEffect(() => {
    if (initialMapel?.id) {
      setSelectedMapelId(initialMapel.id);
    }
  }, [initialMapel]);

  // Current selected subject list & object
  const currentMapelList = mapelDb[selectedKategori] || [];
  const currentMapelObj = currentMapelList.find(m => m.id === selectedMapelId) || currentMapelList[0] || { id: 'b-ing', label: 'Bahasa Inggris' };

  // Load bank soal, student database, and saved settings when mapel changes
  useEffect(() => {
    const bData = getBankSoal();
    setBankData(bData);

    const sList = getSiswaData();
    setAllSiswaList(sList);

    const savedSetting = getExamSettingForMapel(selectedMapelId);
    const dur = savedSetting.durasiMenit || 75;
    const start = savedSetting.jamMulai || '07:30';

    setDurasiMenit(dur);
    setTanggalUjian(savedSetting.tanggalUjian || '2026-08-15');
    setJamMulai(start);
    setJamSelesai(savedSetting.jamSelesai || calculateEndTime(start, dur));
    setJumlahSoal(savedSetting.jumlahSoal || 20);
    setMetodeSoal(savedSetting.metodeSoal || 'acak');
    setSelectedQuestionIds(savedSetting.selectedQuestionIds || []);
    
    // Default to all student IDs if no setting saved yet, or load saved student IDs
    if (savedSetting.selectedStudentIds && Array.isArray(savedSetting.selectedStudentIds)) {
      setSelectedStudentIds(savedSetting.selectedStudentIds);
    } else {
      setSelectedStudentIds(sList.map(s => s.id));
    }
  }, [selectedMapelId]);

  const mapelQuestions = bankData[currentMapelObj.id]?.questions || [];

  // Auto-recalculate end time when duration or start time changes
  const handleDurasiChange = (newDurasi) => {
    setDurasiMenit(newDurasi);
    setJamSelesai(calculateEndTime(jamMulai, newDurasi));
  };

  const handleJamMulaiChange = (newStart) => {
    setJamMulai(newStart);
    setJamSelesai(calculateEndTime(newStart, durasiMenit));
  };

  const handleToggleQuestionSelect = (qId) => {
    if (selectedQuestionIds.includes(qId)) {
      setSelectedQuestionIds(prev => prev.filter(id => id !== qId));
    } else {
      setSelectedQuestionIds(prev => [...prev, qId]);
    }
  };

  const handleSelectAllQuestions = () => {
    const allIds = mapelQuestions.map(q => q.id);
    setSelectedQuestionIds(allIds);
  };

  const handleDeselectAllQuestions = () => {
    setSelectedQuestionIds([]);
  };

  // Student Selection Handlers
  const filteredSiswaForSelection = allSiswaList.filter(s => {
    const sTingkat = parseTingkat(s.kelas);
    const matchTingkat = filterStudentTingkat === 'all' || sTingkat === filterStudentTingkat;

    let matchJurusan = true;
    if (filterStudentJurusan !== 'all') {
      const jur = (s.jurusan || '').toLowerCase();
      const kls = (s.kelas || '').toLowerCase();
      const targetJ = filterStudentJurusan.toLowerCase();
      matchJurusan = jur.includes(targetJ) || kls.includes(targetJ);
    }

    const matchKelas = filterStudentKelas === 'all' || s.kelas === filterStudentKelas;

    const query = filterStudentSearch.toLowerCase();
    const matchSearch = !query || 
      (s.nama && s.nama.toLowerCase().includes(query)) ||
      (s.nisn && s.nisn.toLowerCase().includes(query)) ||
      (s.nik && s.nik.toLowerCase().includes(query)) ||
      (s.kelas && s.kelas.toLowerCase().includes(query));

    return matchTingkat && matchJurusan && matchKelas && matchSearch;
  });

  const handleToggleStudentSelect = (sId) => {
    if (selectedStudentIds.includes(sId)) {
      setSelectedStudentIds(prev => prev.filter(id => id !== sId));
    } else {
      setSelectedStudentIds(prev => [...prev, sId]);
    }
  };

  const handleSelectAllFilteredStudents = () => {
    const filteredIds = filteredSiswaForSelection.map(s => s.id);
    setSelectedStudentIds(prev => Array.from(new Set([...prev, ...filteredIds])));
  };

  const handleDeselectAllFilteredStudents = () => {
    const filteredIds = new Set(filteredSiswaForSelection.map(s => s.id));
    setSelectedStudentIds(prev => prev.filter(id => !filteredIds.has(id)));
  };

  const isAllFilteredSelected = filteredSiswaForSelection.length > 0 &&
    filteredSiswaForSelection.every(s => selectedStudentIds.includes(s.id));

  const handleSave = (e) => {
    e.preventDefault();

    const payload = {
      durasiMenit: Number(durasiMenit),
      tanggalUjian,
      jamMulai,
      jamSelesai,
      jumlahSoal: Number(jumlahSoal),
      metodeSoal,
      selectedQuestionIds,
      selectedStudentIds,
      statusUjian: 'aktif'
    };

    saveExamSettingForMapel(currentMapelObj.id, payload);

    alert(`Pengaturan Ujian & Jadwal untuk "${currentMapelObj.label}" berhasil disimpan!\n• ${selectedStudentIds.length} Siswa Terdaftar sebagai Peserta Ujian.\n• Jam Selesai: ${jamSelesai}`);
    if (onSaveSuccess) onSaveSuccess();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Banner Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-amber-300" />
            Pengaturan Jadwal & Sesi Ujian Per Mapel
          </h1>
          <p className="text-xs md:text-sm text-blue-100/90 font-medium mt-1">
            Atur durasi waktu, tanggal pelaksanaan, jumlah soal, dan metode pengacakan/pemilihan soal per mata pelajaran.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#007bff] hover:bg-[#0069d9] active:scale-[0.99] text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all text-xs md:text-sm flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          Simpan Pengaturan Ujian
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Selector Mapel */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#007bff]" />
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

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Daftar Mapel ({currentMapelList.length} Mata Pelajaran)
            </label>
            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-slate-50/50 p-1">
              {currentMapelList.map(item => {
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

        {/* Right Column: Setting Form for Selected Subject */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Waktu & Tanggal Ujian */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-5">
            
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#007bff] bg-blue-50 px-2.5 py-1 rounded-md uppercase">
                  PENGATURAN WAKTU & JADWAL
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  {currentMapelObj.label}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* 1. Durasi Waktu Ujian */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                  <Clock className="w-4 h-4 text-[#007bff]" />
                  Durasi Waktu Ujian (Menit)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={durasiMenit}
                    onChange={(e) => handleDurasiChange(e.target.value)}
                    min={10}
                    max={300}
                    className="w-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-[#007bff]"
                  />
                  <span className="text-xs font-semibold text-slate-500">Menit</span>
                </div>

                {/* Preset Durasi Buttons */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[45, 60, 75, 90, 120].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleDurasiChange(m)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        Number(durasiMenit) === m
                          ? 'bg-blue-100 border-[#007bff] text-[#007bff] font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m} Menit
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Jadwal Tanggal Ujian */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 text-[#007bff]" />
                  Tanggal Pelaksanaan Ujian
                </label>
                <input
                  type="date"
                  value={tanggalUjian}
                  onChange={(e) => setTanggalUjian(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-[#007bff] cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Jam Mulai</label>
                    <input
                      type="time"
                      value={jamMulai}
                      onChange={(e) => handleJamMulaiChange(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1 flex items-center justify-between">
                      <span>Jam Selesai</span>
                      <span className="text-[10px] text-blue-600 font-bold">(Otomatis)</span>
                    </label>
                    <input
                      type="time"
                      value={jamSelesai}
                      onChange={(e) => setJamSelesai(e.target.value)}
                      className="w-full p-2 bg-blue-50/70 border border-blue-200 rounded-lg text-xs font-bold text-blue-900 outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Card 2: Jumlah Soal & Metode Pemilihan Soal */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-5">
            
            <div className="border-b pb-3">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
                PENGATURAN SOAL & PENGACAKAN
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                Pilihan Jumlah & Metode Soal
              </h3>
            </div>

            {/* Jumlah Soal Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Jumlah Soal yang Diujikan ke Peserta
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={jumlahSoal}
                  onChange={(e) => setJumlahSoal(e.target.value)}
                  min={1}
                  max={100}
                  className="w-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-[#007bff]"
                />
                <span className="text-xs font-semibold text-slate-500">Soal</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tersedia {mapelQuestions.length} soal di Bank Soal {currentMapelObj.label}
              </p>
            </div>

            {/* Metode Soal Toggle (Acak vs Manual) */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-3">
                Metode Pemilihan & Penyajian Soal:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Option 1: ACAK (Randomized) */}
                <label 
                  onClick={() => setMetodeSoal('acak')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    metodeSoal === 'acak'
                      ? 'border-[#007bff] bg-blue-50/60 ring-2 ring-blue-100'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="metode-soal"
                    checked={metodeSoal === 'acak'}
                    onChange={() => setMetodeSoal('acak')}
                    className="mt-1 text-[#007bff]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm mb-1">
                      <Shuffle className="w-4 h-4 text-[#007bff]" />
                      Acak Soal (Random)
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Sistem akan mengambil dan mengacak {jumlahSoal} soal secara otomatis dari Bank Soal untuk tiap siswa.
                    </p>
                  </div>
                </label>

                {/* Option 2: MANUAL (Guru Pilih Soal) */}
                <label 
                  onClick={() => setMetodeSoal('manual')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    metodeSoal === 'manual'
                      ? 'border-[#007bff] bg-blue-50/60 ring-2 ring-blue-100'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="metode-soal"
                    checked={metodeSoal === 'manual'}
                    onChange={() => setMetodeSoal('manual')}
                    className="mt-1 text-[#007bff]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm mb-1">
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                      Pilih Manual oleh Guru
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Guru/Proktor memilih secara spesifik soal mana saja dari Bank Soal yang akan diujikan.
                    </p>
                  </div>
                </label>

              </div>
            </div>

            {/* Manual Question Selector Box (Shown when metodeSoal === 'manual') */}
            {metodeSoal === 'manual' && (
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-bold text-slate-700">
                    Pilih Soal Spesifik dari Bank Soal ({selectedQuestionIds.length} terpilih)
                  </span>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleSelectAllQuestions}
                      className="text-[#007bff] font-semibold hover:underline"
                    >
                      Pilih Semua
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleDeselectAllQuestions}
                      className="text-slate-400 font-semibold hover:underline"
                    >
                      Batal Semua
                    </button>
                  </div>
                </div>

                {mapelQuestions.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {mapelQuestions.map((q, idx) => {
                      const isChecked = selectedQuestionIds.includes(q.id);
                      return (
                        <label
                          key={q.id}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 text-xs">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleQuestionSelect(q.id)}
                              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                            />
                            <span>Soal No. {idx + 1}: <strong>{q.questionText || q.stimulus}</strong></span>
                          </div>

                          <span className="text-[11px] font-bold text-[#007bff] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {q.type === 'single' ? 'PG' : q.type === 'complex' ? 'PG Kompleks' : q.type === 'matrix' ? 'Matriks' : 'Isian'}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400 italic">
                    Belum ada soal di Bank Soal untuk mata pelajaran ini. Buat soal terlebih dahulu di menu "Tambah Soal Baru".
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Card 3: PILIH PESERTA UJIAN (HANYA BERLAKU UNTUK SISWA) */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-5">
            
            <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md uppercase flex items-center gap-1.5 w-fit">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                  SASARAN PESERTA UJIAN (HANYA BERLAKU UNTUK SISWA)
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Pilih Peserta Siswa yang Berhak Mengikuti Ujian
                </h3>
              </div>

              {/* Stats Counter Badge */}
              <div className="bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-900 flex items-center gap-1.5 self-start sm:self-auto">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Terpilih: {selectedStudentIds.length} / {allSiswaList.length} Siswa</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Pilihlah tingkat kelas (X, XI, XII), jurusan (TKR, TKJ, TAV), atau rombel tertentu. Anda dapat mencentang <strong>"Pilih Semua"</strong> atau memilih siswa <strong>satu per satu</strong>.
            </p>

            {/* Filter Bar: Tingkat, Jurusan, Rombel & Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
              
              {/* Filter Tingkat (X, XI, XII) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tingkat Kelas</label>
                <select
                  value={filterStudentTingkat}
                  onChange={(e) => setFilterStudentTingkat(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">Semua Tingkat (X, XI, XII)</option>
                  <option value="X">Kelas X (Tingkat 10)</option>
                  <option value="XI">Kelas XI (Tingkat 11)</option>
                  <option value="XII">Kelas XII (Tingkat 12)</option>
                </select>
              </div>

              {/* Filter Jurusan */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jurusan / Keahlian</label>
                <select
                  value={filterStudentJurusan}
                  onChange={(e) => setFilterStudentJurusan(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">Semua Jurusan</option>
                  <option value="TKR">TKR - Teknik Kendaraan Ringan</option>
                  <option value="TKJ">TKJ - Teknik Komputer & Jaringan</option>
                  <option value="TAV">TAV - Teknik Audio Video</option>
                </select>
              </div>

              {/* Filter Rombel Spesifik */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rombel Kelas</label>
                <select
                  value={filterStudentKelas}
                  onChange={(e) => setFilterStudentKelas(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">Semua Rombel</option>
                  {Array.from(new Set(allSiswaList.map(s => s.kelas))).map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              {/* Search Box */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cari Nama / NISN</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filterStudentSearch}
                    onChange={(e) => setFilterStudentSearch(e.target.value)}
                    placeholder="Nama / NISN..."
                    className="w-full pl-8 pr-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>

            </div>

            {/* Quick Action Selection Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllFilteredStudents}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pilih Semua Sesuai Filter ({filteredSiswaForSelection.length} Siswa)
                </button>

                <button
                  type="button"
                  onClick={handleDeselectAllFilteredStudents}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 active:scale-[0.98]"
                >
                  Batal Pilih Semua
                </button>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Menampilkan {filteredSiswaForSelection.length} dari {allSiswaList.length} siswa
              </span>
            </div>

            {/* Student Table with Checkboxes */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="max-h-[380px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-800 font-extrabold sticky top-0 z-10">
                    <tr>
                      <th className="p-3 text-center w-10 border-r border-slate-200">
                        <input
                          type="checkbox"
                          checked={isAllFilteredSelected}
                          onChange={(e) => {
                            if (e.target.checked) handleSelectAllFilteredStudents();
                            else handleDeselectAllFilteredStudents();
                          }}
                          className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                          title="Centang / Hapus Centang Semua Siswa yang Tampil"
                        />
                      </th>
                      <th className="p-3 border-r border-slate-200 w-28">NISN / USER</th>
                      <th className="p-3 border-r border-slate-200">NAMA SISWA PESERTA</th>
                      <th className="p-3 border-r border-slate-200 text-center w-28">TINGKAT & KELAS</th>
                      <th className="p-3 border-r border-slate-200">JURUSAN</th>
                      <th className="p-3 border-r border-slate-200 text-center w-28">STATUS UJIAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                    {filteredSiswaForSelection.map((item, idx) => {
                      const isSelected = selectedStudentIds.includes(item.id);
                      const sTingkat = parseTingkat(item.kelas);

                      return (
                        <tr
                          key={item.id}
                          onClick={() => handleToggleStudentSelect(item.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-purple-50/60 font-semibold' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="p-3 text-center border-r border-slate-200" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleStudentSelect(item.id)}
                              className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                            />
                          </td>
                          <td className="p-3 font-mono font-bold text-blue-900 border-r border-slate-200 text-xs">
                            {item.nisn}
                          </td>
                          <td className="p-3 font-extrabold text-slate-900 border-r border-slate-200">
                            {item.nama}
                          </td>
                          <td className="p-3 border-r border-slate-200 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold border inline-block ${
                              sTingkat === 'XII'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : sTingkat === 'XI'
                                ? 'bg-blue-100 text-blue-900 border-blue-300'
                                : 'bg-purple-100 text-purple-900 border-purple-300'
                            }`}>
                              {item.kelas}
                            </span>
                          </td>
                          <td className="p-3 border-r border-slate-200 text-xs text-slate-600">
                            {item.jurusan}
                          </td>
                          <td className="p-3 text-center">
                            {isSelected ? (
                              <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-300 inline-flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" /> Terdaftar
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-400 font-medium px-2 py-0.5 rounded text-[10px]">
                                Non-Peserta
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {filteredSiswaForSelection.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-xs text-slate-400 italic">
                          Tidak ditemukan siswa yang sesuai dengan filter (Tingkat: {filterStudentTingkat}, Jurusan: {filterStudentJurusan}).
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

      </div>

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

