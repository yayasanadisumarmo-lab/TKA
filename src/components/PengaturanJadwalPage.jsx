import React, { useState, useEffect } from 'react';
import { Settings, Clock, Calendar, Shuffle, CheckSquare, Save, Filter, BookOpen, AlertCircle } from 'lucide-react';
import { MAPEL_DATABASE } from '../data/subjects';
import { getBankSoal } from '../data/bankSoalStorage';
import { getExamSettingForMapel, saveExamSettingForMapel } from '../data/examSettingsStorage';

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

  const [bankData, setBankData] = useState({});

  useEffect(() => {
    if (initialMapel?.id) {
      setSelectedMapelId(initialMapel.id);
    }
  }, [initialMapel]);

  // Current selected subject list & object
  const currentMapelList = MAPEL_DATABASE[selectedKategori] || [];
  const currentMapelObj = currentMapelList.find(m => m.id === selectedMapelId) || currentMapelList[0] || { id: 'b-ing', label: 'Bahasa Inggris' };

  // Load bank soal and saved settings when mapel changes
  useEffect(() => {
    const bData = getBankSoal();
    setBankData(bData);

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
      statusUjian: 'aktif'
    };

    saveExamSettingForMapel(selectedMapelObj.id, payload);

    alert(`Pengaturan Ujian & Jadwal untuk "${currentMapelObj.label}" berhasil disimpan!\n(Jam Selesai otomatis diatur ke ${jamSelesai})`);
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
          <h3 className="font-bold text-slate-800 text-base border-b pb-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#007bff]" />
            Pilih Mata Pelajaran
          </h3>

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
                    className={`p-3 rounded-lg text-xs md:text-sm font-semibold cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#007bff] text-white shadow-md'
                        : 'hover:bg-white text-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                  </div>
                );
              })}
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

        </div>

      </div>

    </div>
  );
}
