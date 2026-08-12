import React, { useState } from 'react';

export default function KonfirmasiDataPage({ selectedConfig, loginUser, onConfirmData }) {
  // Random token generator matching Image 1 ("Token : SXSWML")
  const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const [displayToken, setDisplayToken] = useState('SXSWML');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-Laki');
  const [namaPesertaInput, setNamaPesertaInput] = useState('');
  const [hariLahir, setHariLahir] = useState('');
  const [bulanLahir, setBulanLahir] = useState('');
  const [tahunLahir, setTahunLahir] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [tokenError, setTokenError] = useState('');

  const mapelLabel = selectedConfig?.mapel?.label || 'Bahasa Inggris';
  const username = loginUser?.username || 'P130100230';
  const userFull = `${username} - PESERTA TKA`;

  const handleRefreshToken = () => {
    const newToken = generateToken();
    setDisplayToken(newToken);
    setTokenError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputToken.trim().toUpperCase() !== displayToken) {
      setTokenError(`Token salah! Gunakan token: ${displayToken}`);
      return;
    }
    setTokenError('');
    onConfirmData({
      username,
      nama: namaPesertaInput || userFull,
      jenisKelamin,
      tglLahir: `${hariLahir || '15'}-${bulanLahir || '08'}-${tahunLahir || '2008'}`,
      token: displayToken,
      mapelLabel
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Token Box with Refresh Button matching Image 1 */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex items-center justify-start gap-4">
          <span className="text-base md:text-lg font-bold text-slate-700">
            Token : <strong className="text-slate-900 tracking-wider font-mono">{displayToken}</strong>
          </span>
          <button
            type="button"
            onClick={handleRefreshToken}
            className="bg-[#007bff] hover:bg-[#0069d9] text-white text-xs font-semibold py-1.5 px-4 rounded-md shadow-sm transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Right Column: Konfirmasi data Peserta Form matching Image 1 */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-2xl p-8 border border-slate-100 relative overflow-hidden">
          
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
            Konfirmasi data Peserta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
            
            {/* Kode NIK */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Kode NIK</label>
              <div className="text-slate-800 font-medium py-1.5 border-b border-slate-200">
                {username}
              </div>
            </div>

            {/* Nama Peserta (System) */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Nama Peserta</label>
              <div className="text-slate-800 font-medium py-1.5 border-b border-slate-200">
                {userFull}
              </div>
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Jenis Kelamin</label>
              <select
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value)}
                className="w-full bg-white border-b border-slate-200 py-2 text-slate-800 font-medium outline-none cursor-pointer focus:border-[#007bff]"
              >
                <option value="Laki-Laki">Laki-Laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Mata Ujian */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Mata Ujian</label>
              <div className="text-slate-800 font-medium py-1.5 border-b border-slate-200">
                {mapelLabel}
              </div>
            </div>

            {/* Nama Peserta Input */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Nama Peserta</label>
              <input
                type="text"
                value={namaPesertaInput}
                onChange={(e) => setNamaPesertaInput(e.target.value)}
                placeholder="Ketikkan Nama Peserta"
                className="w-full border-b border-slate-200 py-2 text-slate-800 placeholder-slate-400 font-medium outline-none focus:border-[#007bff]"
              />
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Tanggal Lahir</label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={hariLahir}
                  onChange={(e) => setHariLahir(e.target.value)}
                  className="bg-slate-100 border-none rounded p-2 text-slate-700 font-medium outline-none"
                >
                  <option value="">Hari</option>
                  {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <select
                  value={bulanLahir}
                  onChange={(e) => setBulanLahir(e.target.value)}
                  className="bg-slate-100 border-none rounded p-2 text-slate-700 font-medium outline-none"
                >
                  <option value="">Bulan</option>
                  {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map((m, idx) => (
                    <option key={m} value={String(idx + 1).padStart(2, '0')}>{m}</option>
                  ))}
                </select>

                <select
                  value={tahunLahir}
                  onChange={(e) => setTahunLahir(e.target.value)}
                  className="bg-slate-100 border-none rounded p-2 text-slate-700 font-medium outline-none"
                >
                  <option value="">Tahun</option>
                  {Array.from({ length: 25 }, (_, i) => String(2015 - i)).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Token Input */}
            <div className="pt-2">
              <label className="block text-[#007bff] font-bold mb-1">Token</label>
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value.toUpperCase())}
                placeholder="Ketikkan token di sini"
                className="w-full border-b border-slate-200 py-2 text-slate-800 placeholder-slate-400 font-medium outline-none focus:border-[#007bff] uppercase"
              />
              {tokenError && (
                <p className="text-red-500 text-xs mt-1 font-semibold">{tokenError}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#007bff] hover:bg-[#0069d9] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-full shadow-lg transition-all text-sm md:text-base"
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
