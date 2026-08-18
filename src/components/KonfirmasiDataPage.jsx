import React, { useState } from 'react';
import { getExamSettingForMapel } from '../data/examSettingsStorage';

export default function KonfirmasiDataPage({ selectedConfig, loginUser, onConfirmData }) {
  // Random token generator matching ANBK UI
  const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const studentObj = loginUser?.studentData || {};
  const nisn = studentObj.nisn || loginUser?.username || '119642455';
  const namaSiswa = studentObj.nama || `${nisn} - PESERTA TKA`;
  const kelas = studentObj.kelas ? `${studentObj.kelas} (${studentObj.jurusan || 'Teknik Kendaraan Ringan'})` : 'X TKR A';
  const defaultGender = (studentObj.gender && (studentObj.gender.toLowerCase().includes('p') || studentObj.gender.toLowerCase().includes('perempuan')))
    ? 'Perempuan' 
    : 'Laki-Laki';

  // Extract birthdate if available (e.g. "07/08/2011" or "2011-08-07")
  let initHari = '';
  let initBulan = '';
  let initTahun = '';
  if (studentObj.tglLahir) {
    const parts = studentObj.tglLahir.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        initTahun = parts[0];
        initBulan = parts[1];
        initHari = parts[2];
      } else {
        // MM/DD/YYYY or DD/MM/YYYY
        initHari = String(parts[0]).padStart(2, '0');
        initBulan = String(parts[1]).padStart(2, '0');
        initTahun = parts[2];
      }
    }
  }

  // Fetch Exam Schedule Settings for the selected Mapel
  const mapelId = selectedConfig?.mapel?.id || 'b-ing';
  const mapelLabel = selectedConfig?.mapel?.label || 'Matematika';
  const examSetting = getExamSettingForMapel(mapelId);

  const jamMulai = examSetting.jamMulai || '07:30';
  const jamSelesai = examSetting.jamSelesai || '08:45';
  const durasiMenit = examSetting.durasiMenit || 75;
  const jamPelaksanaan = `${jamMulai} - ${jamSelesai} WIB (${durasiMenit} Menit)`;

  const [displayToken, setDisplayToken] = useState('ANBK26');
  const [jenisKelamin, setJenisKelamin] = useState(defaultGender);
  const [namaPesertaInput, setNamaPesertaInput] = useState('');
  const [hariLahir, setHariLahir] = useState(initHari);
  const [bulanLahir, setBulanLahir] = useState(initBulan);
  const [tahunLahir, setTahunLahir] = useState(initTahun);
  const [inputToken, setInputToken] = useState('');
  const [tokenError, setTokenError] = useState('');

  const handleRefreshToken = () => {
    const newToken = generateToken();
    setDisplayToken(newToken);
    setTokenError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputToken.trim().toUpperCase() !== displayToken) {
      setTokenError(`Token salah! Gunakan token aktif: ${displayToken}`);
      return;
    }
    setTokenError('');
    onConfirmData({
      nisn,
      nama: namaPesertaInput || namaSiswa,
      kelas,
      jenisKelamin,
      tglLahir: `${hariLahir || '15'}-${bulanLahir || '08'}-${tahunLahir || '2008'}`,
      token: displayToken,
      mapelLabel,
      jamPelaksanaan
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Token Box with Refresh Button */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex items-center justify-start gap-4">
          <span className="text-base md:text-lg font-bold text-slate-700">
            Token : <strong className="text-slate-900 tracking-wider font-mono bg-amber-100 px-3 py-1 rounded-lg border border-amber-300">{displayToken}</strong>
          </span>
          <button
            type="button"
            onClick={handleRefreshToken}
            className="bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-semibold py-2 px-5 rounded-xl shadow-sm transition-all active:scale-95"
          >
            Refresh Token
          </button>
        </div>

        {/* Right Column: Konfirmasi data Peserta Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 relative overflow-hidden">
          
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 border-b pb-4">
            Konfirmasi data Peserta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
            
            {/* 1. NISN / Kode NIK */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1 text-xs">NISN / Kode NIK</label>
              <div className="text-blue-950 font-mono font-extrabold text-sm py-1.5 border-b border-slate-200">
                {nisn}
              </div>
            </div>

            {/* 2. Nama Peserta (System Data) */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1 text-xs">Nama Peserta (Data Dapodik)</label>
              <div className="text-slate-900 font-extrabold text-sm py-1.5 border-b border-slate-200">
                {namaSiswa}
              </div>
            </div>

            {/* 3. Kelas & Jurusan */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1 text-xs">Kelas & Rombel</label>
              <div className="text-purple-900 font-bold py-1.5 border-b border-slate-200 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded text-xs border border-purple-200 font-black">
                  {kelas}
                </span>
              </div>
            </div>

            {/* 4. Mata Ujian */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1 text-xs">Mata Ujian</label>
              <div className="text-slate-900 font-extrabold py-1.5 border-b border-slate-200">
                {mapelLabel}
              </div>
            </div>

            {/* 5. Jam Pelaksanaan (Sesuai Setting Ujian) */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1 text-xs">Jam Pelaksanaan Ujian (Sesuai Setting)</label>
              <div className="text-emerald-700 font-extrabold py-1.5 border-b border-slate-200 flex items-center gap-1.5">
                <span>🕒 {jamPelaksanaan}</span>
              </div>
            </div>

            {/* 6. Jenis Kelamin */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1 text-xs">Jenis Kelamin</label>
              <select
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 font-bold outline-none cursor-pointer focus:border-[#007bff]"
              >
                <option value="Laki-Laki">Laki-Laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* 7. Nama Peserta Input (Ketikkan Ulang Konfirmasi) */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1 text-xs">Ketikkan Nama Peserta untuk Konfirmasi</label>
              <input
                type="text"
                value={namaPesertaInput}
                onChange={(e) => setNamaPesertaInput(e.target.value)}
                placeholder="Ketikkan Nama Peserta di sini"
                className="w-full border-b border-slate-300 py-2 text-slate-900 placeholder-slate-400 font-bold outline-none focus:border-[#007bff]"
              />
            </div>

            {/* 8. Tanggal Lahir */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1 text-xs">Tanggal Lahir Peserta</label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={hariLahir}
                  onChange={(e) => setHariLahir(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold outline-none"
                >
                  <option value="">Hari</option>
                  {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <select
                  value={bulanLahir}
                  onChange={(e) => setBulanLahir(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold outline-none"
                >
                  <option value="">Bulan</option>
                  {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map((m, idx) => (
                    <option key={m} value={String(idx + 1).padStart(2, '0')}>{m}</option>
                  ))}
                </select>

                <select
                  value={tahunLahir}
                  onChange={(e) => setTahunLahir(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold outline-none"
                >
                  <option value="">Tahun</option>
                  {Array.from({ length: 25 }, (_, i) => String(2015 - i)).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 9. Token Input */}
            <div className="pt-2">
              <label className="block text-[#007bff] font-extrabold mb-1 text-xs">Token Ujian</label>
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value.toUpperCase())}
                placeholder="KETIKKAN TOKEN DI SINI"
                className="w-full border-b-2 border-slate-300 py-2 text-slate-900 placeholder-slate-400 font-mono font-extrabold outline-none focus:border-[#007bff] uppercase tracking-wider text-sm"
              />
              {tokenError && (
                <p className="text-rose-600 text-xs mt-1.5 font-extrabold bg-rose-50 p-2 rounded-lg border border-rose-200">{tokenError}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#007bff] hover:bg-[#0069d9] active:scale-[0.99] text-white font-extrabold py-3.5 px-6 rounded-full shadow-lg transition-all text-sm md:text-base tracking-wide"
              >
                Submit
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
