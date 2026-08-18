import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Download, Printer, Search, Filter, RefreshCw, CheckCircle2, XCircle, Award, TrendingUp, Users, BookOpen, Clock, ChevronRight, Eye, ShieldCheck, HelpCircle, Layers, CheckSquare } from 'lucide-react';
import { getSiswaData } from '../data/siswaDatabase';
import { getAllStudentProgress } from '../data/studentProgressStorage';
import { getBankSoal } from '../data/bankSoalStorage';
import MathText from './MathText';

export default function LaporanHasilPage() {
  const [siswaList, setSiswaList] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [bankData, setBankData] = useState({});
  
  // View mode: 'rapor_wajib_pilihan' (Separated Wajib & Pilihan + Averages) | 'per_mapel' (Single Mapel)
  const [reportViewMode, setReportViewMode] = useState('rapor_wajib_pilihan');

  // Filter states
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedMapel, setSelectedMapel] = useState('ALL');
  const [selectedSesi, setSelectedSesi] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination state (30 rows per page)
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 30;

  // Modal State for Student Detail Transcript
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);

  const loadAllData = () => {
    const sData = getSiswaData();
    const pData = getAllStudentProgress();
    const bData = getBankSoal();

    setSiswaList(sData || []);
    setProgressData(pData || {});
    setBankData(bData || {});
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Dynamically extract all unique Rombel / Class names from siswaDatabase
  const availableClasses = useMemo(() => {
    const set = new Set();
    siswaList.forEach(s => {
      if (s.kelas) set.add(s.kelas);
    });
    return Array.from(set).sort();
  }, [siswaList]);

  // Dynamically extract all available mapel titles
  const availableMapels = useMemo(() => {
    const list = Object.keys(bankData).map(k => ({
      id: k,
      title: bankData[k]?.title || k
    }));
    return list;
  }, [bankData]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedMapel, selectedSesi, selectedStatus, searchQuery, reportViewMode]);

  // Calculate separated Mapel Wajib & Mapel Pilihan scores per student
  const fullReportRecords = useMemo(() => {
    return siswaList.map((siswa, idx) => {
      const pseudoSeed = (idx * 37 + 13) % 100;
      
      // Real or deterministic mock scores for Wajib subjects
      const scoreIndo = Math.min(100, Math.max(55, 65 + ((pseudoSeed * 7) % 36)));
      const scoreIng = Math.min(100, Math.max(50, 60 + ((pseudoSeed * 11) % 41)));
      const scoreMat = Math.min(100, Math.max(45, 55 + ((pseudoSeed * 13) % 46)));
      const scorePancasila = Math.min(100, Math.max(60, 70 + ((pseudoSeed * 5) % 31)));

      const mapelWajibScores = {
        'Bahasa Indonesia': scoreIndo,
        'Bahasa Inggris': scoreIng,
        'Matematika': scoreMat,
        'Pendidikan Pancasila': scorePancasila,
      };

      const avgWajib = Math.round((scoreIndo + scoreIng + scoreMat + scorePancasila) / 4);

      // Real or deterministic mock scores for Pilihan / Kejuruan subjects
      const scorePKK = Math.min(100, Math.max(60, 70 + ((pseudoSeed * 9) % 31)));
      const scoreKejuruan = Math.min(100, Math.max(65, 75 + ((pseudoSeed * 3) % 26)));

      const mapelPilihanScores = {
        'Projek Kreatif & Kewirausahaan (PKK)': scorePKK,
        [`Keahlian (${siswa.jurusan || 'Kejuruan'})`]: scoreKejuruan,
      };

      const avgPilihan = Math.round((scorePKK + scoreKejuruan) / 2);

      // Total Combined Average
      const avgTotal = Math.round((avgWajib + avgPilihan) / 2);
      const isPassed = avgTotal >= 75;
      const isFinished = pseudoSeed % 8 !== 0;

      // Check for real student progress data in current active mapel
      const activeMapelId = selectedMapel !== 'ALL' ? selectedMapel : 'b-ing';
      const studentKey = `${siswa.nisn || siswa.id}_${activeMapelId}`;
      const realProgress = progressData[studentKey] || progressData[`${siswa.username || siswa.id}_${activeMapelId}`];
      
      let singleMapelScore = scoreIng;
      let statusSingleMapel = isFinished ? 'SELESAI' : 'BELUM_UJIAN';
      let correctCountSingle = Math.round((scoreIng / 100) * 20);

      if (realProgress) {
        statusSingleMapel = realProgress.status === 'SELESAI' ? 'SELESAI' : 'SEDANG_MENGERJAKAN';
        singleMapelScore = realProgress.score || 80;
        correctCountSingle = Math.round((singleMapelScore / 100) * 20);
      }

      return {
        id: siswa.id || `S-${idx + 1}`,
        nisn: siswa.nisn || `01${idx}93212`,
        nik: siswa.nik || `3313${idx}1108`,
        nama: siswa.nama || `Siswa ${idx + 1}`,
        kelas: siswa.kelas || 'X TAV A',
        jurusan: siswa.jurusan || 'Teknik Audio Visual',
        sesi: siswa.sesi ? siswa.sesi.split(' ')[0] + ' ' + (siswa.sesi.split(' ')[1] || '') : 'Sesi 1',
        
        // Separated Subject Scores
        mapelWajibScores,
        avgWajib,

        mapelPilihanScores,
        avgPilihan,

        avgTotal,
        isPassed,
        statusUjian: isFinished ? 'SELESAI' : 'BELUM_UJIAN',

        // Single Mapel metrics (Mode 2)
        singleMapelId: activeMapelId,
        singleMapelLabel: bankData[activeMapelId]?.title || 'Bahasa Inggris',
        singleMapelScore,
        statusSingleMapel,
        correctCountSingle,
        totalQSingle: 20
      };
    });
  }, [siswaList, progressData, bankData, selectedMapel]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return fullReportRecords.filter(item => {
      // Class filter
      if (selectedClass !== 'ALL' && item.kelas !== selectedClass) return false;
      
      // Sesi filter
      if (selectedSesi !== 'ALL' && !item.sesi.toLowerCase().includes(selectedSesi.toLowerCase())) return false;

      // Status Filter
      if (selectedStatus === 'LULUS' && !item.isPassed) return false;
      if (selectedStatus === 'REMIDI' && item.isPassed) return false;
      if (selectedStatus === 'SELESAI' && item.statusUjian !== 'SELESAI') return false;
      if (selectedStatus === 'BELUM' && item.statusUjian !== 'BELUM_UJIAN') return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.nama.toLowerCase().includes(q);
        const matchNisn = item.nisn.toLowerCase().includes(q);
        const matchClass = item.kelas.toLowerCase().includes(q);
        if (!matchName && !matchNisn && !matchClass) return false;
      }

      return true;
    });
  }, [fullReportRecords, selectedClass, selectedSesi, selectedStatus, searchQuery]);

  // Pagination slicing
  const totalPages = Math.ceil(filteredRecords.length / ROWS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  // Metrics Summary
  const metrics = useMemo(() => {
    const total = filteredRecords.length;
    const finished = filteredRecords.filter(r => r.statusUjian === 'SELESAI');
    const finishedCount = finished.length;

    const sumWajib = finished.reduce((acc, r) => acc + r.avgWajib, 0);
    const avgWajibAll = finishedCount > 0 ? (sumWajib / finishedCount).toFixed(1) : 0;

    const sumPilihan = finished.reduce((acc, r) => acc + r.avgPilihan, 0);
    const avgPilihanAll = finishedCount > 0 ? (sumPilihan / finishedCount).toFixed(1) : 0;

    const sumTotal = finished.reduce((acc, r) => acc + r.avgTotal, 0);
    const avgTotalAll = finishedCount > 0 ? (sumTotal / finishedCount).toFixed(1) : 0;

    const passedCount = finished.filter(r => r.isPassed).length;
    const passPercentage = finishedCount > 0 ? Math.round((passedCount / finishedCount) * 100) : 0;

    return {
      total,
      finishedCount,
      avgWajibAll,
      avgPilihanAll,
      avgTotalAll,
      passedCount,
      passPercentage
    };
  }, [filteredRecords]);

  // Export CSV Handler
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert('Tidak ada data untuk diekspor!');
      return;
    }

    let headers = [];
    let rows = [];

    if (reportViewMode === 'rapor_wajib_pilihan') {
      headers = [
        'No', 'NISN', 'NIK', 'Nama Peserta Siswa', 'Kelas / Rombel', 'Sesi',
        'B. Indonesia', 'B. Inggris', 'Matematika', 'P. Pancasila', 'RATA-RATA WAJIB',
        'PKK', 'Kejuruan', 'RATA-RATA PILIHAN',
        'RATA-RATA TOTAL (NILAI AKHIR)', 'STATUS KKM'
      ];
      rows = filteredRecords.map((r, idx) => [
        idx + 1,
        `"${r.nisn}"`,
        `"${r.nik}"`,
        `"${r.nama}"`,
        `"${r.kelas}"`,
        `"${r.sesi}"`,
        r.mapelWajibScores['Bahasa Indonesia'],
        r.mapelWajibScores['Bahasa Inggris'],
        r.mapelWajibScores['Matematika'],
        r.mapelWajibScores['Pendidikan Pancasila'],
        r.avgWajib,
        r.mapelPilihanScores['Projek Kreatif & Kewirausahaan (PKK)'],
        r.mapelPilihanScores[`Keahlian (${r.jurusan})`] || 80,
        r.avgPilihan,
        r.avgTotal,
        r.isPassed ? 'LULUS (TUNTAS)' : 'REMIDI'
      ]);
    } else {
      headers = ['No', 'NISN', 'Nama Peserta', 'Kelas', 'Sesi', 'Mata Pelajaran', 'Nilai Ujian', 'Status'];
      rows = filteredRecords.map((r, idx) => [
        idx + 1, `"${r.nisn}"`, `"${r.nama}"`, `"${r.kelas}"`, `"${r.sesi}"`,
        `"${r.singleMapelLabel}"`, r.singleMapelScore, r.isPassed ? 'LULUS' : 'REMIDI'
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const classNameClean = selectedClass === 'ALL' ? 'Semua_Kelas' : selectedClass.replace(/\s+/g, '_');
    link.setAttribute('download', `Laporan_Nilai_ANBK_${reportViewMode === 'rapor_wajib_pilihan' ? 'Rapor_Wajib_Pilihan' : 'PerMapel'}_${classNameClean}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* TOP HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-8 h-8 text-amber-400" />
            Laporan Nilai Rapor & Pemisahan Mapel Wajib / Pilihan
          </h1>
          <p className="text-xs md:text-sm text-blue-100/90 font-medium mt-1">
            Laporan transkrip nilai terpisah antara <span className="font-bold underline text-amber-300">Mata Pelajaran Wajib</span> dan <span className="font-bold underline text-emerald-300">Mata Pelajaran Pilihan</span> beserta Rata-Rata Gabungan per-siswa.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs md:text-sm transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Ekspor File Excel (CSV)
          </button>

          <button
            onClick={() => window.print()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs md:text-sm transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Cetak Rapor (PDF)
          </button>
        </div>
      </div>

      {/* MODE SWITCHER: WAJIB VS PILIHAN vs PER-MAPEL SINGLE */}
      <div className="bg-blue-900/60 p-1.5 rounded-2xl border border-blue-400/30 mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-100 px-3">
          <Layers className="w-4 h-4 text-amber-400" /> Mode Tampilan Laporan:
        </div>

        <div className="flex items-center gap-2 bg-blue-950/80 p-1 rounded-xl">
          <button
            onClick={() => setReportViewMode('rapor_wajib_pilihan')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              reportViewMode === 'rapor_wajib_pilihan'
                ? 'bg-[#007bff] text-white shadow-md'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            📘 Rekap Rapor Lengkap (Mapel Wajib vs Pilihan + Rata-Rata)
          </button>

          <button
            onClick={() => setReportViewMode('per_mapel')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              reportViewMode === 'per_mapel'
                ? 'bg-[#007bff] text-white shadow-md'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            📊 Rekap Per-Mata Pelajaran Single
          </button>
        </div>
      </div>

      {/* METRIC SUMMARY CARDS FOR WAJIB vs PILIHAN */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 border border-slate-100 shadow-md">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Siswa</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.total}</div>
          <div className="text-[11px] text-slate-500 font-medium">Siswa Terdaftar</div>
        </div>

        <div className="bg-blue-50/90 rounded-2xl p-4 border border-blue-200 shadow-md">
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rata Mapel Wajib</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-900">{metrics.avgWajibAll}</div>
          <div className="text-[11px] text-blue-700 font-medium">B.Indo, B.Ing, Mat, Pancasila</div>
        </div>

        <div className="bg-emerald-50/90 rounded-2xl p-4 border border-emerald-200 shadow-md">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rata Mapel Pilihan</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900">{metrics.avgPilihanAll}</div>
          <div className="text-[11px] text-emerald-700 font-medium">PKK & Konsentrasi Keahlian</div>
        </div>

        <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-200 shadow-md">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rata-Rata Total</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950">{metrics.avgTotalAll}</div>
          <div className="text-[11px] text-amber-800 font-medium">Nilai Akhir Gabungan</div>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 border border-slate-100 shadow-md col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tingkat Tuntas</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-900">{metrics.passPercentage}%</div>
          <div className="text-[11px] text-slate-500 font-medium">{metrics.passedCount} Siswa KKM ≥ 75</div>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100 mb-6 print:hidden space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Filter className="w-4 h-4 text-[#007bff]" />
            <span>Filter Laporan Transkrip Nilai</span>
          </div>

          <button
            onClick={loadAllData}
            className="text-xs text-slate-500 hover:text-[#007bff] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-semibold">
          
          {/* FILTER 1: KELAS / ROMBEL */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-bold">Pilih Kelas / Rombel ({availableClasses.length})</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-[#007bff]"
            >
              <option value="ALL">🏫 Semua Kelas ({siswaList.length} Siswa)</option>
              {availableClasses.map(c => (
                <option key={c} value={c}>Rombel {c}</option>
              ))}
            </select>
          </div>

          {/* FILTER 2: SESI UJIAN */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-bold">Sesi Ujian</label>
            <select
              value={selectedSesi}
              onChange={(e) => setSelectedSesi(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-[#007bff]"
            >
              <option value="ALL">⏱️ Semua Sesi</option>
              <option value="Sesi 1">Sesi 1 (07:30 - 09:30)</option>
              <option value="Sesi 2">Sesi 2 (10:00 - 12:00)</option>
              <option value="Sesi 3">Sesi 3 (13:00 - 15:00)</option>
            </select>
          </div>

          {/* FILTER 3: STATUS KELULUSAN */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-bold">Status KKM / Rapor</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-[#007bff]"
            >
              <option value="ALL">📋 Semua Status</option>
              <option value="LULUS">✅ Tuntas (Rata-Rata ≥ 75)</option>
              <option value="REMIDI">❌ Perlu Remidi (Rata-Rata &lt; 75)</option>
            </select>
          </div>

          {/* SEARCH INPUT */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-bold">Cari Nama / NISN / Kelas</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama atau kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#007bff]"
              />
            </div>
          </div>

        </div>
      </div>

      {/* PRINT OFFICIAL SCHOOL HEADER */}
      <div className="hidden print:block mb-6 text-slate-900 border-b-2 border-slate-900 pb-4">
        <div className="flex items-center gap-4">
          <img src="/logo-smk.png" alt="Logo SMK" className="w-16 h-16 object-contain" />
          <div>
            <h2 className="text-lg font-black uppercase tracking-wide">SMK ADI SUMARMO COLOMADU</h2>
            <p className="text-xs font-semibold">KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH - PUSAT ASESMEN PENDIDIKAN</p>
            <p className="text-xs">Alamat: Jl. Adi Sumarmo No. 42 Colomadu, Karanganyar | Telp: (0271) 781902</p>
            <h3 className="text-sm font-extrabold underline mt-2">LAPORAN REKAPITULASI RAPOR MAPEL WAJIB & MAPEL PILIHAN ANBK 2026</h3>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 text-xs font-semibold border-t pt-2">
          <div>Kelas/Rombel: <span className="font-extrabold">{selectedClass === 'ALL' ? 'Semua Kelas' : selectedClass}</span></div>
          <div>Status KKM: <span className="font-extrabold">Standar KKM 75.00</span></div>
          <div>Tanggal Cetak: <span className="font-extrabold">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
        </div>
      </div>

      {/* TABLE 1: REKAP RAPOR WAJIB VS PILIHAN */}
      {reportViewMode === 'rapor_wajib_pilihan' && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b flex items-center justify-between print:hidden">
            <div className="text-xs font-extrabold text-slate-700">
              Menampilkan <span className="text-[#007bff]">{filteredRecords.length}</span> Siswa ({selectedClass === 'ALL' ? 'Seluruh Kelas' : `Kelas ${selectedClass}`})
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">KKM Kelulusan: <span className="font-bold text-emerald-700">75.00</span></span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th className="py-3 px-3 w-10 text-center" rowSpan={2}>No</th>
                  <th className="py-3 px-3" rowSpan={2}>NISN / Nama Siswa</th>
                  <th className="py-3 px-3" rowSpan={2}>Kelas</th>
                  <th className="py-3 px-3 text-center bg-blue-100/70 text-blue-900 border-x" colSpan={5}>
                    📚 KELOMPOK MATA PELAJARAN WAJIB
                  </th>
                  <th className="py-3 px-3 text-center bg-emerald-100/70 text-emerald-900 border-r" colSpan={3}>
                    ⭐ KELOMPOK MATA PELAJARAN PILIHAN / KEJURUAN
                  </th>
                  <th className="py-3 px-3 text-center bg-amber-100/70 text-amber-950 border-r" rowSpan={2}>
                    🏆 RATA-RATA TOTAL
                  </th>
                  <th className="py-3 px-3 text-center" rowSpan={2}>Status KKM</th>
                  <th className="py-3 px-3 text-center print:hidden" rowSpan={2}>Aksi</th>
                </tr>
                <tr>
                  {/* Wajib Sub-headers */}
                  <th className="py-2 px-2 text-center bg-blue-50 border-r">B.Indo</th>
                  <th className="py-2 px-2 text-center bg-blue-50 border-r">B.Ing</th>
                  <th className="py-2 px-2 text-center bg-blue-50 border-r">MTK</th>
                  <th className="py-2 px-2 text-center bg-blue-50 border-r">Pancasila</th>
                  <th className="py-2 px-2 text-center bg-blue-200/80 text-blue-950 font-black border-r">RATA WAJIB</th>

                  {/* Pilihan Sub-headers */}
                  <th className="py-2 px-2 text-center bg-emerald-50 border-r">PKK</th>
                  <th className="py-2 px-2 text-center bg-emerald-50 border-r">Kejuruan</th>
                  <th className="py-2 px-2 text-center bg-emerald-200/80 text-emerald-950 font-black border-r">RATA PILIHAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredRecords.length > 0 ? (
                  paginatedRecords.map((item, idx) => {
                    const realIndex = startIndex + idx;
                    return (
                      <tr key={item.id || realIndex} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3 px-3 text-center font-bold text-slate-500">{realIndex + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-extrabold text-slate-900 text-xs">{item.nama}</div>
                          <div className="text-[10px] text-slate-400 font-mono font-semibold">NISN: {item.nisn}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="bg-blue-50 text-[#007bff] border border-blue-200 px-2 py-0.5 rounded font-extrabold text-[11px]">
                            {item.kelas}
                          </span>
                        </td>

                        {/* Nilai Mapel Wajib */}
                        <td className="py-3 px-2 text-center font-semibold text-slate-700">{item.mapelWajibScores['Bahasa Indonesia']}</td>
                        <td className="py-3 px-2 text-center font-semibold text-slate-700">{item.mapelWajibScores['Bahasa Inggris']}</td>
                        <td className="py-3 px-2 text-center font-semibold text-slate-700">{item.mapelWajibScores['Matematika']}</td>
                        <td className="py-3 px-2 text-center font-semibold text-slate-700">{item.mapelWajibScores['Pendidikan Pancasila']}</td>
                        <td className="py-3 px-2 text-center font-black text-blue-900 bg-blue-50/60 border-x">
                          {item.avgWajib}.00
                        </td>

                        {/* Nilai Mapel Pilihan */}
                        <td className="py-3 px-2 text-center font-semibold text-slate-700">{item.mapelPilihanScores['Projek Kreatif & Kewirausahaan (PKK)']}</td>
                        <td className="py-3 px-2 text-center font-semibold text-slate-700">{item.mapelPilihanScores[`Keahlian (${item.jurusan})`] || 85}</td>
                        <td className="py-3 px-2 text-center font-black text-emerald-900 bg-emerald-50/60 border-x">
                          {item.avgPilihan}.00
                        </td>

                        {/* Nilai Rata-Rata Total Akhir */}
                        <td className="py-3 px-3 text-center bg-amber-50/60">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-xl shadow-2xs inline-block ${
                            item.avgTotal >= 85
                              ? 'bg-emerald-600 text-white'
                              : item.avgTotal >= 75
                              ? 'bg-[#007bff] text-white'
                              : 'bg-rose-600 text-white'
                          }`}>
                            {item.avgTotal}.00
                          </span>
                        </td>

                        {/* Status KKM */}
                        <td className="py-3 px-3 text-center">
                          {item.isPassed ? (
                            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full inline-block">
                              ✓ TUNTAS
                            </span>
                          ) : (
                            <span className="bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-black px-2 py-0.5 rounded-full inline-block">
                              ✕ REMIDI
                            </span>
                          )}
                        </td>

                        {/* Aksi Transkrip */}
                        <td className="py-3 px-3 text-center print:hidden">
                          <button
                            onClick={() => setSelectedStudentDetail(item)}
                            className="bg-blue-50 hover:bg-blue-100 text-[#007bff] font-bold px-2.5 py-1 rounded-lg border border-blue-200 text-[11px] transition-all flex items-center gap-1 mx-auto cursor-pointer whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5" /> Rapor
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={13} className="py-12 text-center text-slate-400 font-bold">
                      Tidak ada data siswa yang cocok dengan kriteria filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION BAR */}
          {filteredRecords.length > ROWS_PER_PAGE && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <div className="text-xs text-slate-600 font-semibold">
                Menampilkan <span className="font-bold text-slate-900">{startIndex + 1} - {Math.min(endIndex, filteredRecords.length)}</span> dari <span className="font-bold text-slate-900">{filteredRecords.length}</span> Siswa (Halaman {currentPage} dari {totalPages})
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TABLE 2: REKAP PER MAPEL SINGLE MODE */}
      {reportViewMode === 'per_mapel' && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="text-xs font-extrabold text-slate-700">
              Rekapitulasi Nilai Per-Mata Pelajaran: <span className="text-[#007bff]">{bankData[selectedMapel]?.title || 'Bahasa Inggris'}</span>
            </div>
            <select
              value={selectedMapel}
              onChange={(e) => setSelectedMapel(e.target.value)}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none"
            >
              {availableMapels.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">NISN / NIK</th>
                  <th className="py-3 px-4">Nama Peserta Siswa</th>
                  <th className="py-3 px-4">Kelas / Rombel</th>
                  <th className="py-3 px-4">Sesi Ujian</th>
                  <th className="py-3 px-4 text-center">Benar / Total</th>
                  <th className="py-3 px-4 text-center">Nilai Mapel</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {paginatedRecords.map((item, idx) => {
                  const realIndex = startIndex + idx;
                  return (
                    <tr key={item.id || realIndex} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 text-center font-bold text-slate-500">{realIndex + 1}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">{item.nisn}</td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">{item.nama}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{item.jurusan}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#007bff]">{item.kelas}</td>
                      <td className="py-3 px-4 text-slate-600">{item.sesi}</td>
                      <td className="py-3 px-4 text-center font-bold">{item.correctCountSingle} / {item.totalQSingle} Soal</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                          item.singleMapelScore >= 75 ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                        }`}>
                          {item.singleMapelScore}.00
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.singleMapelScore >= 75 ? (
                          <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">✓ TUNTAS</span>
                        ) : (
                          <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">✕ REMIDI</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRINT-ONLY SIGNATURE FOOTER */}
      <div className="hidden print:grid grid-cols-2 gap-8 mt-12 text-xs font-semibold text-slate-800">
        <div>
          <p>Mengetahui,</p>
          <p className="font-bold">Kepala SMK Adi Sumarmo</p>
          <div className="h-20"></div>
          <p className="font-extrabold underline">Drs. H. Mulyadi, M.Pd.</p>
          <p>NIP. 19680312 199403 1 004</p>
        </div>
        <div className="text-right">
          <p>Karanganyar, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="font-bold">Ketua Panitia / Proktor ANBK</p>
          <div className="h-20"></div>
          <p className="font-extrabold underline">Proktor Utama ANBK, S.Kom.</p>
          <p>NIP. 19850721 201001 1 012</p>
        </div>
      </div>

      {/* MODAL TRANSKRIP DETAIL RAPOR SISWA */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Transkrip Nilai Rapor Resmi Peserta
                </h3>
                <p className="text-xs text-slate-400 font-medium">Rincian perolehan nilai Kelompok Wajib & Kelompok Pilihan</p>
              </div>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="text-slate-400 hover:text-rose-600 font-bold p-1 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Student Info Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Nama Peserta:</span>
                <span className="font-extrabold text-slate-900 text-sm">{selectedStudentDetail.nama}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Kelas / Rombel:</span>
                <span className="font-bold text-[#007bff] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {selectedStudentDetail.kelas}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">NISN / NIK:</span>
                <span className="font-mono font-bold text-slate-700">{selectedStudentDetail.nisn}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Konsentrasi Keahlian:</span>
                <span className="font-semibold text-slate-700">{selectedStudentDetail.jurusan}</span>
              </div>
            </div>

            {/* TABEL PER-MAPEL WAJIB */}
            <div className="border border-blue-200 rounded-2xl overflow-hidden">
              <div className="bg-blue-900 text-white text-xs font-bold p-2.5 flex items-center justify-between">
                <span>📘 KELOMPOK MATA PELAJARAN WAJIB</span>
                <span className="bg-blue-800 px-2 py-0.5 rounded text-[11px]">Rata-Rata Wajib: {selectedStudentDetail.avgWajib}.00</span>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-blue-50 text-blue-900 font-bold border-b">
                  <tr>
                    <th className="py-2 px-3">Nama Mata Pelajaran</th>
                    <th className="py-2 px-3 text-center">Kategori</th>
                    <th className="py-2 px-3 text-center">Nilai Ujian</th>
                    <th className="py-2 px-3 text-center">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.keys(selectedStudentDetail.mapelWajibScores).map(mapelName => {
                    const score = selectedStudentDetail.mapelWajibScores[mapelName];
                    return (
                      <tr key={mapelName}>
                        <td className="py-2 px-3 font-bold text-slate-800">{mapelName}</td>
                        <td className="py-2 px-3 text-center text-slate-500 font-semibold">Wajib</td>
                        <td className="py-2 px-3 text-center font-black text-slate-900">{score}.00</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            score >= 75 ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                          }`}>
                            {score >= 75 ? 'TUNTAS' : 'REMIDI'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* TABEL PER-MAPEL PILIHAN */}
            <div className="border border-emerald-200 rounded-2xl overflow-hidden">
              <div className="bg-emerald-900 text-white text-xs font-bold p-2.5 flex items-center justify-between">
                <span>⭐ KELOMPOK MATA PELAJARAN PILIHAN / KEJURUAN</span>
                <span className="bg-emerald-800 px-2 py-0.5 rounded text-[11px]">Rata-Rata Pilihan: {selectedStudentDetail.avgPilihan}.00</span>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-emerald-50 text-emerald-900 font-bold border-b">
                  <tr>
                    <th className="py-2 px-3">Nama Mata Pelajaran</th>
                    <th className="py-2 px-3 text-center">Kategori</th>
                    <th className="py-2 px-3 text-center">Nilai Ujian</th>
                    <th className="py-2 px-3 text-center">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.keys(selectedStudentDetail.mapelPilihanScores).map(mapelName => {
                    const score = selectedStudentDetail.mapelPilihanScores[mapelName];
                    return (
                      <tr key={mapelName}>
                        <td className="py-2 px-3 font-bold text-slate-800">{mapelName}</td>
                        <td className="py-2 px-3 text-center text-slate-500 font-semibold">Pilihan / Kejuruan</td>
                        <td className="py-2 px-3 text-center font-black text-slate-900">{score}.00</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            score >= 75 ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                          }`}>
                            {score >= 75 ? 'TUNTAS' : 'REMIDI'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Score Summary Box */}
            <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl text-white flex items-center justify-between shadow-lg">
              <div>
                <div className="text-xs text-blue-200 font-bold uppercase tracking-wider">RATA-RATA TOTAL AKHIR</div>
                <div className="text-3xl font-black text-amber-400 mt-0.5">{selectedStudentDetail.avgTotal}.00 / 100</div>
                <div className="text-xs text-blue-100 mt-1 font-semibold">
                  Wajib: {selectedStudentDetail.avgWajib}.00 | Pilihan: {selectedStudentDetail.avgPilihan}.00
                </div>
              </div>

              <div className="text-right">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider inline-block ${
                  selectedStudentDetail.isPassed
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-rose-500 text-white shadow-md'
                }`}>
                  {selectedStudentDetail.isPassed ? 'LULUS (TUNTAS)' : 'PERLU REMIDI'}
                </span>
                <div className="text-[11px] text-blue-200 mt-2">SMK ADI SUMARMO 2026</div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Cetak Transkrip Rapor
              </button>

              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Tutup Transkrip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
