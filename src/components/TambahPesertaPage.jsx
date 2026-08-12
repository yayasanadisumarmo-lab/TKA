import React, { useState } from 'react';
import { User, Building, Key, CreditCard, Save } from 'lucide-react';

export default function TambahPesertaPage({ onCancel, onSaveSuccess }) {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nisn, setNisn] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');
  
  const [jenjang, setJenjang] = useState('');
  const [kelas, setKelas] = useState('');
  const [ruangan, setRuangan] = useState('');
  const [sesi, setSesi] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!namaLengkap || !nisn) {
      alert('Nama Lengkap dan NISN wajib diisi!');
      return;
    }
    alert(`Peserta baru ${namaLengkap} (NISN: ${nisn}) telah berhasil ditambahkan! Kredensial telah dibuat otomatis.`);
    if (onSaveSuccess) onSaveSuccess();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-blue-100/80 mb-2 font-medium">
        <span>Dashboard</span>
        <span>›</span>
        <span>Manajemen Peserta</span>
        <span>›</span>
        <span className="text-white font-bold">Tambah Peserta</span>
      </div>

      {/* Title Banner */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Tambah Peserta Baru</h1>
        <p className="text-xs md:text-sm text-blue-100/90 font-medium mt-1">
          Masukkan data peserta ANBK. Pastikan NISN dan data diri sesuai dengan data pokok pendidikan (Dapodik).
        </p>
      </div>

      {/* Main Form Layout matching Screenshot 2 */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Data Pribadi & Penempatan Ujian */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Data Pribadi Peserta */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 border-b pb-3 mb-5">
              <div className="p-2 bg-blue-50 text-[#007bff] rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Data Pribadi Peserta</h3>
            </div>

            <div className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Masukkan nama sesuai ijazah"
                  className="w-full p-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 font-medium outline-none focus:border-[#007bff] focus:bg-white"
                />
              </div>

              {/* NISN & Jenis Kelamin Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">NISN / Nomor Induk *</label>
                  <input
                    type="text"
                    required
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    placeholder="10 digit angka NISN"
                    className="w-full p-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 font-medium outline-none focus:border-[#007bff] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Jenis Kelamin *</label>
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="jk"
                        checked={jenisKelamin === 'Laki-laki'}
                        onChange={() => setJenisKelamin('Laki-laki')}
                        className="w-4 h-4 text-[#007bff] focus:ring-[#007bff]"
                      />
                      Laki-laki
                    </label>

                    <label className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="jk"
                        checked={jenisKelamin === 'Perempuan'}
                        onChange={() => setJenisKelamin('Perempuan')}
                        className="w-4 h-4 text-[#007bff] focus:ring-[#007bff]"
                      />
                      Perempuan
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Penempatan Ujian */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 border-b pb-3 mb-5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Penempatan Ujian</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Jenjang */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Jenjang Pendidikan *</label>
                <select
                  value={jenjang}
                  onChange={(e) => setJenjang(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 font-semibold outline-none focus:border-[#007bff] cursor-pointer"
                >
                  <option value="">Pilih Jenjang</option>
                  <option value="SMA/MA/SMK">SMA/MA/SMK/MAK</option>
                  <option value="SMP/MTs">SMP/MTs</option>
                  <option value="SD/MI">SD/MI</option>
                </select>
              </div>

              {/* Kelas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Kelas *</label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 font-semibold outline-none focus:border-[#007bff] cursor-pointer"
                >
                  <option value="">Pilih Kelas</option>
                  <option value="XII IPA 1">XII IPA 1</option>
                  <option value="XII IPS 2">XII IPS 2</option>
                  <option value="IX-A">IX-A</option>
                </select>
              </div>

              {/* Ruang Ujian */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Ruang Ujian *</label>
                <select
                  value={ruangan}
                  onChange={(e) => setRuangan(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 font-semibold outline-none focus:border-[#007bff] cursor-pointer"
                >
                  <option value="">Pilih Ruangan</option>
                  <option value="Lab Komputer 1">Lab Komputer 1</option>
                  <option value="Lab Komputer 2">Lab Komputer 2</option>
                  <option value="Ruang Utama">Ruang Utama</option>
                </select>
              </div>

              {/* Sesi Ujian */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Sesi Ujian *</label>
                <select
                  value={sesi}
                  onChange={(e) => setSesi(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 font-semibold outline-none focus:border-[#007bff] cursor-pointer"
                >
                  <option value="">Pilih Sesi</option>
                  <option value="Sesi 1 (07.30 - 09.30)">Sesi 1 (07.30 - 09.30)</option>
                  <option value="Sesi 2 (10.00 - 12.00)">Sesi 2 (10.00 - 12.00)</option>
                  <option value="Sesi 3 (13.00 - 15.00)">Sesi 3 (13.00 - 15.00)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Action Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#007bff] hover:bg-[#0069d9] active:scale-[0.99] text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all text-xs md:text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Simpan Peserta
            </button>
          </div>

        </div>

        {/* Right Column: Information & Card Illustration matching Screenshot 2 */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Informasi Login Otomatis */}
          <div className="bg-blue-50/80 rounded-2xl p-6 border border-blue-100 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Key className="w-4 h-4 text-[#007bff]" />
              Informasi Login Otomatis
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kredensial ini akan dibuat otomatis dan dapat dicetak melalui menu Kartu Peserta.
            </p>

            <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-500">
                <span>Username</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">Generated auto</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Password</span>
                <span className="font-bold text-slate-800">••••••</span>
              </div>
            </div>
          </div>

          {/* Card 2: Panduan Input Graphic Preview Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-blue-900/20 bg-gradient-to-tr from-[#1a4478] to-[#2c6cb8] p-6 text-white min-h-[220px] flex flex-col justify-end">
            <div className="absolute top-4 right-4 text-white/20">
              <CreditCard className="w-20 h-20" />
            </div>

            <div className="relative z-10">
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block mb-2 text-blue-100 border border-white/20">
                KARTU PESERTA ANBK 2026
              </div>
              <h4 className="font-bold text-base text-white">Panduan Input</h4>
              <p className="text-xs text-blue-100/90 leading-relaxed mt-1">
                Pastikan alokasi ruang dan sesi merata untuk menghindari penumpukan beban server lokal.
              </p>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
}
