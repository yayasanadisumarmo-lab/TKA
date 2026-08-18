import React from 'react';
import { ShieldCheck, LogOut, KeyRound } from 'lucide-react';

export default function Header({ loggedInUser, activePage, onChangePage, onReset, onAdminLoginTrigger }) {
  const isAdmin = loggedInUser?.role === 'admin';
  const isGuru = loggedInUser?.role === 'guru';
  const isStaff = isAdmin || isGuru;

  const roleLabel = isAdmin ? 'Super Admin' : (isGuru ? 'Guru' : 'Siswa');

  return (
    <header className="w-full bg-[#2e63a5] text-white py-3 px-4 md:px-8 shadow-md sticky top-0 z-40 border-b border-blue-900/20 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Logo Tut Wuri + SMK Adi Sumarmo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div 
            onClick={onReset}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <img 
              src="/logo-smk.png" 
              alt="Logo SMK Adi Sumarmo" 
              className="w-11 h-11 object-contain drop-shadow group-hover:scale-105 transition-transform duration-200" 
            />

            <div>
              <h1 className="text-base md:text-lg font-extrabold tracking-wide text-white leading-tight">
                SMK Adi Sumarmo
              </h1>
              <p className="text-[11px] text-blue-100 font-semibold tracking-wider uppercase">
                APLIKASI ANBK
              </p>
            </div>
          </div>
        </div>

        {/* Center / Navigation Menu Switcher (VISIBLE WHEN LOGGED IN AS GURU / ADMIN) */}
        {isStaff && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 bg-blue-900/40 p-1 rounded-full border border-blue-400/20 text-xs font-bold animate-in fade-in zoom-in-95 duration-200">
            
            {/* Simulasi Ujian (Guru & Admin) */}
            <button
              onClick={() => onChangePage('simulasi')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activePage === 'simulasi' ? 'bg-[#007bff] text-white shadow-sm' : 'text-blue-100 hover:text-white'
              }`}
            >
              🎓 Simulasi Ujian
            </button>

            {/* Bank & Kelola Soal (Guru & Admin) */}
            <button
              onClick={() => onChangePage('bank_soal')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activePage === 'bank_soal' || activePage === 'tambah_soal' ? 'bg-[#007bff] text-white shadow-sm' : 'text-blue-100 hover:text-white'
              }`}
            >
              📚 Bank & Kelola Soal
            </button>

            {/* Live Progress (Guru & Admin) */}
            <button
              onClick={() => onChangePage('live_monitoring')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activePage === 'live_monitoring' ? 'bg-[#007bff] text-white shadow-sm' : 'text-blue-100 hover:text-white'
              }`}
            >
              📊 Live Progress
            </button>

            {/* Pengaturan Jadwal (Guru & Admin) */}
            <button
              onClick={() => onChangePage('pengaturan_jadwal')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activePage === 'pengaturan_jadwal' ? 'bg-[#007bff] text-white shadow-sm' : 'text-blue-100 hover:text-white'
              }`}
            >
              ⚙️ Pengaturan Jadwal
            </button>

            {/* Laporan Hasil Ujian & Nilai (Guru & Admin) */}
            <button
              onClick={() => onChangePage('laporan_hasil')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activePage === 'laporan_hasil' ? 'bg-[#007bff] text-white shadow-sm font-bold' : 'text-blue-100 hover:text-white'
              }`}
            >
              📑 Laporan Hasil Ujian
            </button>

            {/* Menu Setting Master Data (HANYA UNTUK SUPER ADMIN BISA KEMANA-MANA) */}
            {isAdmin && (
              <button
                onClick={() => onChangePage('pengaturan_database')}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  activePage === 'pengaturan_database' ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold' : 'text-amber-200 hover:text-white'
                }`}
              >
                ⚙️ Master Setting (Admin)
              </button>
            )}
          </div>
        )}

        {/* Right: Logged In User Badge */}
        {loggedInUser && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-white bg-blue-900/30 px-3 py-1.5 rounded-full border border-blue-400/20">
                <span className="max-w-[140px] truncate">{loggedInUser.username || 'P130100230'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                  isAdmin ? 'bg-amber-400 text-amber-950' : (isGuru ? 'bg-blue-200 text-blue-950' : 'bg-emerald-300 text-emerald-950')
                }`}>
                  {roleLabel}
                </span>
              </div>
              <button
                onClick={onReset}
                title="Keluar / Logout"
                className="text-xs text-blue-200 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
