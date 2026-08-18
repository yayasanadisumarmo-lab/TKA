import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Plus, Trash2, Edit3, RefreshCw, Shield, GraduationCap, CheckCircle2, X, Eye, KeyRound, BookOpen, Layers, FolderPlus } from 'lucide-react';
import { getGuruData, saveGuruItem, deleteGuruItem, resetGuruData, resetGuruPassword, DEFAULT_TEACHER_PASSWORD } from '../data/guruDatabase';
import { getSiswaData, saveSiswaItem, deleteSiswaItem, resetSiswaData } from '../data/siswaDatabase';
import { getMapelDatabase, saveMapelItem, deleteMapelItem, resetMapelDatabase } from '../data/subjects';

export default function PengaturanDatabasePage() {
  // Main Sub-Tab Switcher: 'guru' | 'siswa' | 'mapel'
  const [subTab, setSubTab] = useState('guru');

  // Database States
  const [guruList, setGuruList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [mapelDb, setMapelDb] = useState({});

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWali, setFilterWali] = useState('all');
  const [filterKelas, setFilterKelas] = useState('all');
  const [selectedMapelCat, setSelectedMapelCat] = useState('sma-wajib');

  // Modal States Guru
  const [showGuruModal, setShowGuruModal] = useState(false);
  const [editingGuru, setEditingGuru] = useState(null);
  const [guruForm, setGuruForm] = useState({
    niy: '',
    nama: '',
    mapel: '',
    jabatan: 'Guru / Staf',
    waliKelas: '-',
    tempatLahir: 'KARANGANYAR',
    tglLahir: '',
    gender: 'Laki-laki',
    statusNikah: 'Nikah',
    agama: 'Islam',
    alamat: ''
  });

  // Modal Detail Biodata Guru & Siswa
  const [selectedDetailGuru, setSelectedDetailGuru] = useState(null);
  const [selectedDetailSiswa, setSelectedDetailSiswa] = useState(null);

  // Modal States Siswa
  const [showSiswaModal, setShowSiswaModal] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState(null);
  const [siswaForm, setSiswaForm] = useState({
    nisn: '',
    nik: '',
    nama: '',
    kelas: 'X TKR A',
    jurusan: 'Teknik Kendaraan Ringan',
    tglLahir: '',
    asalSmp: '',
    namaIbu: '',
    sesi: 'Sesi 1 (07:30 - 09:30)'
  });

  // Modal States Mapel
  const [showMapelModal, setShowMapelModal] = useState(false);
  const [editingMapel, setEditingMapel] = useState(null);
  const [mapelForm, setMapelForm] = useState({
    id: '',
    label: '',
    categoryKey: 'sma-wajib'
  });

  // Load Data
  const loadAllData = () => {
    setGuruList(getGuruData());
    setSiswaList(getSiswaData());
    setMapelDb(getMapelDatabase());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Mapel Handlers
  const handleOpenAddMapel = () => {
    setEditingMapel(null);
    setMapelForm({
      id: '',
      label: '',
      categoryKey: selectedMapelCat
    });
    setShowMapelModal(true);
  };

  const handleOpenEditMapel = (item) => {
    setEditingMapel(item);
    setMapelForm({
      id: item.id || '',
      label: item.label || '',
      categoryKey: selectedMapelCat
    });
    setShowMapelModal(true);
  };

  const handleSaveMapel = (e) => {
    e.preventDefault();
    if (!mapelForm.label.trim()) {
      alert('Nama Mata Pelajaran tidak boleh kosong!');
      return;
    }
    saveMapelItem(mapelForm.categoryKey, {
      id: mapelForm.id,
      label: mapelForm.label
    });
    loadAllData();
    setShowMapelModal(false);
  };

  const handleDeleteMapel = (mapelId, label) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus mata pelajaran "${label}"?`)) {
      deleteMapelItem(selectedMapelCat, mapelId);
      loadAllData();
    }
  };

  const handleResetMapel = () => {
    if (window.confirm('⚠️ Reset Daftar Mata Pelajaran ke Data Master Asli (Wajib & 47 Pilihan)?')) {
      resetMapelDatabase();
      loadAllData();
    }
  };

  // Guru Handlers
  const handleOpenAddGuru = () => {
    setEditingGuru(null);
    setGuruForm({
      niy: '',
      nama: '',
      mapel: '',
      jabatan: 'Guru / Staf',
      waliKelas: '-',
      tempatLahir: 'KARANGANYAR',
      tglLahir: '',
      gender: 'Laki-laki',
      statusNikah: 'Nikah',
      agama: 'Islam',
      alamat: ''
    });
    setShowGuruModal(true);
  };

  const handleOpenEditGuru = (item) => {
    setEditingGuru(item);
    setGuruForm({
      niy: item.niy || '',
      nama: item.nama || '',
      mapel: item.mapel || '',
      jabatan: item.jabatan || '',
      waliKelas: item.waliKelas || '-',
      tempatLahir: item.tempatLahir || 'KARANGANYAR',
      tglLahir: item.tglLahir || '',
      gender: item.gender || 'Laki-laki',
      statusNikah: item.statusNikah || 'Nikah',
      agama: item.agama || 'Islam',
      alamat: item.alamat || ''
    });
    setShowGuruModal(true);
  };

  const handleSaveGuru = (e) => {
    e.preventDefault();
    if (!guruForm.nama.trim()) {
      alert('Nama Guru/Proktor tidak boleh kosong!');
      return;
    }
    saveGuruItem({
      id: editingGuru?.id,
      ...guruForm
    });
    loadAllData();
    setShowGuruModal(false);
  };

  const handleDeleteGuru = (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data Guru "${nama}"?`)) {
      deleteGuruItem(id);
      loadAllData();
    }
  };

  const handleResetGuru = () => {
    if (window.confirm('⚠️ Reset Data Guru ke Data Asli Dokumen Lengkap (51 Guru/Proktor)? Perubahan custom akan dikembalikan.')) {
      resetGuruData();
      loadAllData();
    }
  };

  const handleResetPasswordGuru = (guruId, nama) => {
    if (window.confirm(`🔑 Reset password Guru "${nama}" ke password default "${DEFAULT_TEACHER_PASSWORD}"?`)) {
      resetGuruPassword(guruId);
      loadAllData();
      alert(`✅ Password Guru "${nama}" telah di-reset kembali ke: ${DEFAULT_TEACHER_PASSWORD}`);
    }
  };

  // Siswa Handlers
  const handleOpenAddSiswa = () => {
    setEditingSiswa(null);
    setSiswaForm({
      nisn: '',
      nik: '',
      nama: '',
      kelas: 'X TKR A',
      jurusan: 'Teknik Kendaraan Ringan',
      tglLahir: '',
      asalSmp: '',
      namaIbu: '',
      sesi: 'Sesi 1 (07:30 - 09:30)'
    });
    setShowSiswaModal(true);
  };

  const handleOpenEditSiswa = (item) => {
    setEditingSiswa(item);
    setSiswaForm({
      nisn: item.nisn || '',
      nik: item.nik || '',
      nama: item.nama || '',
      kelas: item.kelas || 'X TKR A',
      jurusan: item.jurusan || 'Teknik Kendaraan Ringan',
      tglLahir: item.tglLahir || '',
      asalSmp: item.asalSmp || '',
      namaIbu: item.namaIbu || '',
      sesi: item.sesi || 'Sesi 1 (07:30 - 09:30)'
    });
    setShowSiswaModal(true);
  };

  const handleSaveSiswa = (e) => {
    e.preventDefault();
    if (!siswaForm.nama.trim() || !siswaForm.nisn.trim()) {
      alert('NISN dan Nama Siswa tidak boleh kosong!');
      return;
    }
    saveSiswaItem({
      id: editingSiswa?.id,
      ...siswaForm
    });
    loadAllData();
    setShowSiswaModal(false);
  };

  const handleDeleteSiswa = (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data siswa "${nama}"?`)) {
      deleteSiswaItem(id);
      loadAllData();
    }
  };

  const handleResetSiswa = () => {
    if (window.confirm('⚠️ Reset Data Siswa Peserta Ujian ke Master Kelas X.TKR.A (30 Siswa)?')) {
      resetSiswaData();
      loadAllData();
    }
  };

  // Filtering Guru
  const filteredGuru = guruList.filter(g => {
    const query = searchQuery.toLowerCase();
    const matchSearch = (g.nama && g.nama.toLowerCase().includes(query)) ||
                        (g.niy && g.niy.toLowerCase().includes(query)) ||
                        (g.mapel && g.mapel.toLowerCase().includes(query)) ||
                        (g.jabatan && g.jabatan.toLowerCase().includes(query)) ||
                        (g.alamat && g.alamat.toLowerCase().includes(query)) ||
                        (g.waliKelas && g.waliKelas.toLowerCase().includes(query));
    
    if (filterWali === 'wali') return matchSearch && g.waliKelas && g.waliKelas !== '-';
    if (filterWali === 'non-wali') return matchSearch && (!g.waliKelas || g.waliKelas === '-');
    return matchSearch;
  });

  // Filtering Siswa
  const filteredSiswa = siswaList.filter(s => {
    const query = searchQuery.toLowerCase();
    const matchSearch = (s.nama && s.nama.toLowerCase().includes(query)) ||
                        (s.nisn && s.nisn.toLowerCase().includes(query)) ||
                        (s.nik && s.nik.toLowerCase().includes(query)) ||
                        (s.kelas && s.kelas.toLowerCase().includes(query)) ||
                        (s.asalSmp && s.asalSmp.toLowerCase().includes(query)) ||
                        (s.namaIbu && s.namaIbu.toLowerCase().includes(query)) ||
                        (s.jurusan && s.jurusan.toLowerCase().includes(query));
    
    if (filterKelas !== 'all') {
      return matchSearch && s.kelas === filterKelas;
    }
    return matchSearch;
  });

  const totalWaliKelasCount = guruList.filter(g => g.waliKelas && g.waliKelas !== '-').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-amber-300" />
            Pengaturan Master Data & Database
          </h1>
          <p className="text-xs md:text-sm text-blue-100/90 font-medium mt-1">
            Kelola data terpisah Guru/Proktor/Admin dan Data Siswa Peserta Ujian SMK Adi Sumarmo.
          </p>
        </div>
      </div>

      {/* Sub-Tab Navigation Switcher */}
      <div className="bg-blue-900/40 p-1.5 rounded-2xl flex flex-wrap items-center gap-2 mb-6 border border-blue-400/20 max-w-3xl shadow-inner">
        <button
          onClick={() => { setSubTab('guru'); setSearchQuery(''); }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            subTab === 'guru'
              ? 'bg-white text-[#007bff] shadow-md'
              : 'text-blue-100 hover:text-white hover:bg-white/10'
          }`}
        >
          <UserCheck className="w-4.5 h-4.5" />
          Data Guru / Admin ({guruList.length})
        </button>

        <button
          onClick={() => { setSubTab('siswa'); setSearchQuery(''); }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            subTab === 'siswa'
              ? 'bg-white text-purple-700 shadow-md'
              : 'text-blue-100 hover:text-white hover:bg-white/10'
          }`}
        >
          <GraduationCap className="w-4.5 h-4.5" />
          Data Siswa ({siswaList.length})
        </button>

        <button
          onClick={() => { setSubTab('mapel'); setSearchQuery(''); }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            subTab === 'mapel'
              ? 'bg-white text-amber-600 shadow-md'
              : 'text-blue-100 hover:text-white hover:bg-white/10'
          }`}
        >
          <BookOpen className="w-4.5 h-4.5" />
          Master Mapel (Wajib & Pilihan)
        </button>
      </div>

      {/* TAB 1: DATA GURU / PROKTOR / ADMIN */}
      {subTab === 'guru' && (
        <div className="space-y-6">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Total Guru & Tendik</span>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">{guruList.length} Orang</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#007bff] flex items-center justify-center font-bold">
                👨‍🏫
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Tugas Wali Kelas</span>
                <h3 className="text-2xl font-black text-emerald-600 mt-0.5">{totalWaliKelasCount} Guru</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                🏫
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Status Data Database</span>
                <h3 className="text-sm font-extrabold text-blue-700 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Complete (51 Record Master)
                </h3>
              </div>
              <button
                onClick={handleResetGuru}
                className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 border border-slate-200"
                title="Reset Data ke Master Dokumen (51 Guru)"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Main Card Data Guru Table */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Master Data Guru, NIY, Biodata & Tugas Tambahan
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Tabel terpisah berisi NIY, Nama, Tempat/Tgl Lahir, Agama, Alamat, Mapel, Jabatan, dan Wali Kelas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAddGuru}
                  className="bg-[#007bff] hover:bg-[#0069d9] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4" /> + Tambah Guru Baru
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari NIY, nama guru, mata pelajaran, jabatan, atau alamat..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 outline-none focus:border-[#007bff]"
                />
              </div>

              <select
                value={filterWali}
                onChange={(e) => setFilterWali(e.target.value)}
                className="w-full sm:w-auto p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Semua Guru ({guruList.length})</option>
                <option value="wali">Hanya Wali Kelas ({totalWaliKelasCount})</option>
                <option value="non-wali">Tanpa Tugas Wali Kelas</option>
              </select>
            </div>

            {/* Guru Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-h-[520px]">
                <table className="w-full text-left text-xs md:text-sm border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-800 font-extrabold sticky top-0 z-10">
                    <tr>
                      <th className="p-3 text-center w-10 border-r border-slate-200">NO</th>
                      <th className="p-3 border-r border-slate-200 w-32">NIY</th>
                      <th className="p-3 border-r border-slate-200 min-w-[180px]">NAMA GURU & GELAR</th>
                      <th className="p-3 border-r border-slate-200 min-w-[150px]">MATA PELAJARAN</th>
                      <th className="p-3 border-r border-slate-200">JABATAN / TUGAS TAMBAHAN</th>
                      <th className="p-3 border-r border-slate-200 text-center w-28">WALI KELAS</th>
                      <th className="p-3 border-r border-slate-200 min-w-[160px]">TTL / BIODATA</th>
                      <th className="p-3 text-center w-24">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                    {filteredGuru.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 text-center font-bold text-slate-400 border-r border-slate-200">
                          {idx + 1}
                        </td>
                        <td className="p-3 font-mono font-bold text-blue-950 border-r border-slate-200 text-xs">
                          {item.niy || '-'}
                        </td>
                        <td className="p-3 font-extrabold text-slate-900 border-r border-slate-200">
                          <button
                            type="button"
                            onClick={() => setSelectedDetailGuru(item)}
                            className="hover:text-[#007bff] text-left underline decoration-dotted underline-offset-2"
                            title="Klik untuk lihat detail biodata lengkap"
                          >
                            {item.nama}
                          </button>
                        </td>
                        <td className="p-3 border-r border-slate-200 text-slate-700 text-xs">
                          {item.mapel || '-'}
                        </td>
                        <td className="p-3 border-r border-slate-200 text-slate-700 text-xs">
                          {item.jabatan && item.jabatan !== '-' ? (
                            <span className="bg-blue-50 text-[#007bff] font-bold px-2 py-0.5 rounded text-[11px] border border-blue-200 inline-block">
                              {item.jabatan}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">-</span>
                          )}
                        </td>
                        <td className="p-3 border-r border-slate-200 text-center">
                          {item.waliKelas && item.waliKelas !== '-' ? (
                            <span className="bg-emerald-100 text-emerald-900 font-extrabold px-2.5 py-0.5 rounded text-xs border border-emerald-300 inline-block">
                              {item.waliKelas}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">-</span>
                          )}
                        </td>
                        <td className="p-3 border-r border-slate-200 text-xs text-slate-600">
                          <div>{item.tempatLahir}, {item.tglLahir}</div>
                          <div className="text-[10px] text-slate-400 font-bold">{item.gender} • {item.agama}</div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedDetailGuru(item)}
                              className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                              title="Lihat Biodata Lengkap"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleResetPasswordGuru(item.id, item.nama)}
                              className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                              title={`Reset Password Guru ke Default (${DEFAULT_TEACHER_PASSWORD})`}
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditGuru(item)}
                              className="p-1 text-[#007bff] hover:bg-blue-50 rounded"
                              title="Edit Data Guru"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteGuru(item.id, item.nama)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Hapus Guru"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: DATA SISWA PESERTA UJIAN */}
      {subTab === 'siswa' && (
        <div className="space-y-6">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Total Peserta Terdaftar</span>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">{siswaList.length} Siswa</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                🎓
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Jumlah Rombel Kelas</span>
                <h3 className="text-2xl font-black text-purple-700 mt-0.5">7 Rombel</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                🏫
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Status Data Database</span>
                <h3 className="text-sm font-extrabold text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Complete ({siswaList.length} Siswa Master)
                </h3>
              </div>
              <button
                onClick={handleResetSiswa}
                className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 border border-slate-200"
                title="Reset Data Siswa ke Master All Kelas"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Main Card Data Siswa Table */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Daftar Siswa Peserta Ujian (Semua Rombel X)
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Tabel data terpisah siswa berisi NISN, NIK, Nama Lengkap, Tanggal Lahir, Asal SMP/MTs, Nama Ibu, dan Sesi.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAddSiswa}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4" /> + Tambah Siswa Baru
                </button>
              </div>
            </div>

            {/* Search & Class Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari NISN, NIK, nama siswa, asal SMP, nama ibu, atau kelas..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 outline-none focus:border-[#007bff]"
                />
              </div>

              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="w-full sm:w-auto p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Semua Rombel ({siswaList.length} Siswa)</option>
                <optgroup label="Tingkat X (Kelas 10)">
                  <option value="X TKR A">Kelas X TKR A (30 Siswa)</option>
                  <option value="X TKR B">Kelas X TKR B (30 Siswa)</option>
                  <option value="X TKR C">Kelas X TKR C (29 Siswa)</option>
                  <option value="X TKR D">Kelas X TKR D (28 Siswa)</option>
                  <option value="X TKR E">Kelas X TKR E TEFA (26 Siswa)</option>
                  <option value="X TKJ">Kelas X TKJ (33 Siswa)</option>
                  <option value="X TAV">Kelas X TAV (4 Siswa)</option>
                </optgroup>
                <optgroup label="Tingkat XI (Kelas 11)">
                  <option value="XI TKR A">Kelas XI TKR A</option>
                  <option value="XI TKJ">Kelas XI TKJ</option>
                  <option value="XI TAV">Kelas XI TAV</option>
                </optgroup>
                <optgroup label="Tingkat XII (Kelas 12)">
                  <option value="XII TKR A">Kelas XII TKR A</option>
                  <option value="XII TKJ">Kelas XII TKJ</option>
                  <option value="XII TAV">Kelas XII TAV</option>
                </optgroup>
              </select>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-h-[520px]">
                <table className="w-full text-left text-xs md:text-sm border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-800 font-extrabold sticky top-0 z-10">
                    <tr>
                      <th className="p-3 text-center w-10 border-r border-slate-200">NO</th>
                      <th className="p-3 border-r border-slate-200 w-32">NISN / USERNAME</th>
                      <th className="p-3 border-r border-slate-200 w-36">NIK</th>
                      <th className="p-3 border-r border-slate-200 min-w-[180px]">NAMA SISWA</th>
                      <th className="p-3 border-r border-slate-200 text-center w-24">KELAS</th>
                      <th className="p-3 border-r border-slate-200 min-w-[150px]">ASAL SMP / MTS</th>
                      <th className="p-3 border-r border-slate-200 min-w-[160px]">TGL LAHIR & NAMA IBU</th>
                      <th className="p-3 border-r border-slate-200 text-center min-w-[130px]">SESI UJIAN</th>
                      <th className="p-3 text-center w-24">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                    {filteredSiswa.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 text-center font-bold text-slate-400 border-r border-slate-200">
                          {idx + 1}
                        </td>
                        <td className="p-3 font-mono font-bold text-blue-900 border-r border-slate-200 text-xs">
                          {item.nisn}
                        </td>
                        <td className="p-3 font-mono text-slate-600 border-r border-slate-200 text-[11px]">
                          {item.nik || '-'}
                        </td>
                        <td className="p-3 font-extrabold text-slate-900 border-r border-slate-200">
                          <button
                            type="button"
                            onClick={() => setSelectedDetailSiswa(item)}
                            className="hover:text-purple-700 text-left underline decoration-dotted underline-offset-2"
                            title="Klik untuk lihat detail biodata siswa"
                          >
                            {item.nama}
                          </button>
                        </td>
                        <td className="p-3 border-r border-slate-200 text-center">
                          <span className="bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded text-xs border border-purple-200 inline-block">
                            {item.kelas}
                          </span>
                        </td>
                        <td className="p-3 border-r border-slate-200 text-slate-700 text-xs">
                          {item.asalSmp || '-'}
                        </td>
                        <td className="p-3 border-r border-slate-200 text-xs text-slate-600">
                          <div>{item.tglLahir || '-'}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">Ibu: {item.namaIbu || '-'}</div>
                        </td>
                        <td className="p-3 border-r border-slate-200 text-center text-xs text-slate-600 font-semibold">
                          {item.sesi}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedDetailSiswa(item)}
                              className="p-1 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded"
                              title="Lihat Detail Siswa"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditSiswa(item)}
                              className="p-1 text-[#007bff] hover:bg-blue-50 rounded"
                              title="Edit Data Siswa"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSiswa(item.id, item.nama)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Hapus Siswa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: MASTER MATA PELAJARAN (WAJIB & PILIHAN) */}
      {subTab === 'mapel' && (
        <div className="space-y-6">
          
          {/* Stats Bar Mapel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Total Mapel di Kategori Ini</span>
                <h3 className="text-2xl font-black text-amber-600 mt-0.5">
                  {(mapelDb[selectedMapelCat] || []).length} Mata Pelajaran
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                📚
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Kategori Aktif</span>
                <h3 className="text-sm font-extrabold text-blue-900 mt-1">
                  {selectedMapelCat === 'sma-wajib' ? 'SMA/SMK - Wajib' :
                   selectedMapelCat === 'sma-pilihan' ? 'SMA/SMK - Pilihan (47 Mapel)' :
                   selectedMapelCat === 'smp' ? 'SMP / MTs' : 'SD / MI'}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#007bff] flex items-center justify-center font-bold">
                🏷️
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Status Master Mapel</span>
                <h3 className="text-sm font-extrabold text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Active & Synchronized
                </h3>
              </div>
              <button
                onClick={handleResetMapel}
                className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 border border-slate-200"
                title="Reset Daftar Mapel ke Master Asli (47 Mapel Pilihan)"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Main Card Master Mapel */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Pengaturan Master Mata Pelajaran (Tambah / Hapus / Edit)
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Atur ketersediaan mata pelajaran wajib dan pilihan untuk simulasi ujian siswa & bank soal.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAddMapel}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4" /> + Tambah Mapel Baru
                </button>
              </div>
            </div>

            {/* Category Selector Pills & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedMapelCat('sma-wajib')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMapelCat === 'sma-wajib'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  📘 Mapel Wajib (SMA/SMK)
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMapelCat('sma-pilihan')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMapelCat === 'sma-pilihan'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  📙 Mapel Pilihan (SMA/SMK - 47 Mapel)
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMapelCat('smp')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMapelCat === 'smp'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  📗 SMP / MTs
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMapelCat('sd')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMapelCat === 'sd'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  📕 SD / MI
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari mata pelajaran..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff]"
                />
              </div>

            </div>

            {/* Mapel Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs md:text-sm border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-800 font-extrabold sticky top-0 z-10">
                    <tr>
                      <th className="p-3 text-center w-12 border-r border-slate-200">NO</th>
                      <th className="p-3 border-r border-slate-200 w-44">KODE / ID MAPEL</th>
                      <th className="p-3 border-r border-slate-200">NAMA MATA PELAJARAN</th>
                      <th className="p-3 border-r border-slate-200 text-center w-40">KATEGORI JENIS</th>
                      <th className="p-3 text-center w-28">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                    {(mapelDb[selectedMapelCat] || [])
                      .filter(m => m.label.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 text-center font-bold text-slate-400 border-r border-slate-200">
                            {idx + 1}
                          </td>
                          <td className="p-3 font-mono font-bold text-amber-900 border-r border-slate-200 text-xs">
                            {item.id}
                          </td>
                          <td className="p-3 font-extrabold text-slate-900 border-r border-slate-200">
                            {item.label}
                          </td>
                          <td className="p-3 border-r border-slate-200 text-center">
                            <span className={`px-2.5 py-0.5 rounded text-xs font-bold border inline-block ${
                              selectedMapelCat === 'sma-wajib'
                                ? 'bg-blue-50 text-blue-900 border-blue-200'
                                : 'bg-amber-50 text-amber-900 border-amber-200'
                            }`}>
                              {selectedMapelCat === 'sma-wajib' ? 'Mata Pelajaran Wajib' :
                               selectedMapelCat === 'sma-pilihan' ? 'Mata Pelajaran Pilihan' :
                               selectedMapelCat === 'smp' ? 'SMP Sederajat' : 'SD Sederajat'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditMapel(item)}
                                className="p-1 text-[#007bff] hover:bg-blue-50 rounded"
                                title="Edit Nama Mapel"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMapel(item.id, item.label)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                title="Hapus Mapel ini"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                    {(mapelDb[selectedMapelCat] || []).length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-xs text-slate-400 italic">
                          Belum ada mata pelajaran dalam kategori ini. Klik "+ Tambah Mapel Baru" untuk menambahkan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL GURU / PROKTOR (FORM LENGKAP) */}
      {showGuruModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#007bff]" />
                {editingGuru ? 'Edit Biodata Guru / Proktor' : 'Tambah Guru / Proktor Baru'}
              </h3>
              <button onClick={() => setShowGuruModal(false)} className="text-slate-400 hover:text-slate-700 font-bold p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuru} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIY (Nomor Induk Yayasan)</label>
                  <input
                    type="text"
                    value={guruForm.niy}
                    onChange={(e) => setGuruForm({ ...guruForm, niy: e.target.value })}
                    placeholder="Contoh: 690421960702"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Guru & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={guruForm.nama}
                    onChange={(e) => setGuruForm({ ...guruForm, nama: e.target.value })}
                    placeholder="Contoh: Saptono,S.Pd."
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran yang Diampu</label>
                  <input
                    type="text"
                    value={guruForm.mapel}
                    onChange={(e) => setGuruForm({ ...guruForm, mapel: e.target.value })}
                    placeholder="Contoh: Komli TKR / Matematika"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan / Tugas Tambahan</label>
                  <input
                    type="text"
                    value={guruForm.jabatan}
                    onChange={(e) => setGuruForm({ ...guruForm, jabatan: e.target.value })}
                    placeholder="Contoh: Kepala Sekolah / Tatib"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wali Kelas (Opsional)</label>
                  <input
                    type="text"
                    value={guruForm.waliKelas}
                    onChange={(e) => setGuruForm({ ...guruForm, waliKelas: e.target.value })}
                    placeholder="Contoh: XII TKR C"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={guruForm.tempatLahir}
                    onChange={(e) => setGuruForm({ ...guruForm, tempatLahir: e.target.value })}
                    placeholder="KARANGANYAR"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="text"
                    value={guruForm.tglLahir}
                    onChange={(e) => setGuruForm({ ...guruForm, tglLahir: e.target.value })}
                    placeholder="21-04-1969"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={guruForm.gender}
                    onChange={(e) => setGuruForm({ ...guruForm, gender: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff] cursor-pointer"
                  >
                    <option value="Laki-laki">Laki-laki (L)</option>
                    <option value="Perempuan">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Agama</label>
                  <input
                    type="text"
                    value={guruForm.agama}
                    onChange={(e) => setGuruForm({ ...guruForm, agama: e.target.value })}
                    placeholder="Islam / Kristen"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap Rumah</label>
                <textarea
                  rows={2}
                  value={guruForm.alamat}
                  onChange={(e) => setGuruForm({ ...guruForm, alamat: e.target.value })}
                  placeholder="PAULAN TIMUR RT 04 RW 02 COLOMADU KARANGANYAR..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowGuruModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#007bff] hover:bg-[#0069d9] text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Simpan Biodata Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL BIODATA GURU LENGKAP */}
      {selectedDetailGuru && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#007bff] flex items-center justify-center font-extrabold text-base">
                  👨‍🏫
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedDetailGuru.nama}</h3>
                  <p className="text-xs text-blue-900 font-mono font-bold">NIY: {selectedDetailGuru.niy || '-'}</p>
                </div>
              </div>

              <button onClick={() => setSelectedDetailGuru(null)} className="text-slate-400 hover:text-slate-700 font-bold p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mata Pelajaran</span>
                <span className="font-extrabold text-slate-800 text-xs block">{selectedDetailGuru.mapel || '-'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tugas Wali Kelas</span>
                <span className="font-extrabold text-emerald-800 text-xs block">{selectedDetailGuru.waliKelas || '-'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jabatan / Tugas Tambahan</span>
                <span className="font-extrabold text-[#007bff] text-xs block">{selectedDetailGuru.jabatan || '-'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jenis Kelamin & Agama</span>
                <span className="font-bold text-slate-800 text-xs block">{selectedDetailGuru.gender} • {selectedDetailGuru.agama}</span>
              </div>

              <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tempat & Tanggal Lahir</span>
                <span className="font-bold text-slate-800 text-xs block">{selectedDetailGuru.tempatLahir}, {selectedDetailGuru.tglLahir || '-'}</span>
              </div>

              <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alamat Rumah Lengkap</span>
                <span className="font-medium text-slate-700 text-xs block leading-relaxed">{selectedDetailGuru.alamat || '-'}</span>
              </div>
            </div>

            <div className="flex justify-end border-t pt-3">
              <button
                type="button"
                onClick={() => setSelectedDetailGuru(null)}
                className="bg-[#007bff] text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL BIODATA SISWA LENGKAP */}
      {selectedDetailSiswa && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-base">
                  🎓
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedDetailSiswa.nama}</h3>
                  <p className="text-xs text-purple-900 font-mono font-bold">NISN: {selectedDetailSiswa.nisn}</p>
                </div>
              </div>

              <button onClick={() => setSelectedDetailSiswa(null)} className="text-slate-400 hover:text-slate-700 font-bold p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NIK Siswa</span>
                <span className="font-mono font-bold text-slate-800 text-xs block">{selectedDetailSiswa.nik || '-'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kelas & Jurusan</span>
                <span className="font-extrabold text-purple-900 text-xs block">{selectedDetailSiswa.kelas} ({selectedDetailSiswa.jurusan})</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tanggal Lahir</span>
                <span className="font-bold text-slate-800 text-xs block">{selectedDetailSiswa.tglLahir || '-'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nama Ibu Kandung</span>
                <span className="font-extrabold text-slate-800 text-xs block">{selectedDetailSiswa.namaIbu || '-'}</span>
              </div>

              <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Asal Sekolah SMP / MTs</span>
                <span className="font-bold text-slate-800 text-xs block">{selectedDetailSiswa.asalSmp || '-'}</span>
              </div>

              <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sesi Ujian ANBK</span>
                <span className="font-bold text-blue-900 text-xs block">{selectedDetailSiswa.sesi}</span>
              </div>
            </div>

            <div className="flex justify-end border-t pt-3">
              <button
                type="button"
                onClick={() => setSelectedDetailSiswa(null)}
                className="bg-purple-600 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SISWA (FORM LENGKAP) */}
      {showSiswaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                {editingSiswa ? 'Edit Data Siswa Peserta' : 'Tambah Siswa Peserta Baru'}
              </h3>
              <button onClick={() => setShowSiswaModal(false)} className="text-slate-400 hover:text-slate-700 font-bold p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSiswa} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NISN / Username *</label>
                  <input
                    type="text"
                    required
                    value={siswaForm.nisn}
                    onChange={(e) => setSiswaForm({ ...siswaForm, nisn: e.target.value })}
                    placeholder="Contoh: 119642455"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIK Siswa</label>
                  <input
                    type="text"
                    value={siswaForm.nik}
                    onChange={(e) => setSiswaForm({ ...siswaForm, nik: e.target.value })}
                    placeholder="3309110807110000"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  value={siswaForm.nama}
                  onChange={(e) => setSiswaForm({ ...siswaForm, nama: e.target.value })}
                  placeholder="Contoh: AIRLANGGA PUTRA AL GOZALI"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                  <input
                    type="text"
                    value={siswaForm.kelas}
                    onChange={(e) => setSiswaForm({ ...siswaForm, kelas: e.target.value })}
                    placeholder="X TKR A"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="text"
                    value={siswaForm.tglLahir}
                    onChange={(e) => setSiswaForm({ ...siswaForm, tglLahir: e.target.value })}
                    placeholder="07/08/2011"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asal SMP / MTs</label>
                  <input
                    type="text"
                    value={siswaForm.asalSmp}
                    onChange={(e) => setSiswaForm({ ...siswaForm, asalSmp: e.target.value })}
                    placeholder="Smp N 2 Colomadu"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Ibu Kandung</label>
                  <input
                    type="text"
                    value={siswaForm.namaIbu}
                    onChange={(e) => setSiswaForm({ ...siswaForm, namaIbu: e.target.value })}
                    placeholder="Yuliani"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sesi Ujian</label>
                <select
                  value={siswaForm.sesi}
                  onChange={(e) => setSiswaForm({ ...siswaForm, sesi: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-purple-600 cursor-pointer"
                >
                  <option value="Sesi 1 (07:30 - 09:30)">Sesi 1 (07:30 - 09:30)</option>
                  <option value="Sesi 2 (10:00 - 12:00)">Sesi 2 (10:00 - 12:00)</option>
                  <option value="Sesi 3 (13:00 - 15:00)">Sesi 3 (13:00 - 15:00)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowSiswaModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Simpan Data Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MATA PELAJARAN (TAMBAH / EDIT MAPEL) */}
      {showMapelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                {editingMapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <button onClick={() => setShowMapelModal(false)} className="text-slate-400 hover:text-slate-700 font-bold p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMapel} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Jenis Mata Pelajaran *</label>
                <select
                  value={mapelForm.categoryKey}
                  onChange={(e) => setMapelForm({ ...mapelForm, categoryKey: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="sma-wajib">SMA/SMK - Mata Pelajaran Wajib</option>
                  <option value="sma-pilihan">SMA/SMK - Mata Pelajaran Pilihan</option>
                  <option value="smp">SMP / MTs Sederajat</option>
                  <option value="sd">SD / MI Sederajat</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode / ID Mata Pelajaran (Unique Slug)</label>
                <input
                  type="text"
                  value={mapelForm.id}
                  onChange={(e) => setMapelForm({ ...mapelForm, id: e.target.value })}
                  placeholder="Contoh: pkk / b-ing / matematika"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Kosongkan untuk membuat kode ID otomatis dari nama mapel.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Mata Pelajaran *</label>
                <input
                  type="text"
                  required
                  value={mapelForm.label}
                  onChange={(e) => setMapelForm({ ...mapelForm, label: e.target.value })}
                  placeholder="Contoh: Projek Kreatif dan Kewirausahaan (PKK)"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowMapelModal(false)}
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

