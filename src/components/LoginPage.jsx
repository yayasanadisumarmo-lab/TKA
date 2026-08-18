import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, KeyRound, Check, X, AlertCircle } from 'lucide-react';
import { getGuruData, updateGuruPassword, validatePasswordStrength, DEFAULT_TEACHER_PASSWORD } from '../data/guruDatabase';
import { getSiswaData } from '../data/siswaDatabase';

export default function LoginPage({ mode = 'siswa', selectedConfig, onBack, onLoginSuccess }) {
  const isAdminLoginMode = mode === 'admin';
  const [username, setUsername] = useState(isAdminLoginMode ? 'admin' : '119642455');
  const [password, setPassword] = useState(isAdminLoginMode ? 'admin' : '12345');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password Change Modal State for Guru
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [targetGuru, setTargetGuru] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalError, setModalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Username / NISN dan Password harus diisi!');
      return;
    }

    if (!isAdminLoginMode) {
      // Siswa Login Flow - Search student database for actual NISN / NIK match
      const inputNisn = username.trim();
      const siswaList = getSiswaData();
      const matchedSiswa = siswaList.find(s => 
        (s.nisn && s.nisn.trim() === inputNisn) ||
        (s.nik && s.nik.trim() === inputNisn) ||
        (s.nama && s.nama.trim().toUpperCase() === inputNisn.toUpperCase())
      );

      onLoginSuccess({
        username: matchedSiswa ? matchedSiswa.nisn : inputNisn,
        studentData: matchedSiswa || {
          nisn: inputNisn,
          nama: `${inputNisn} - PESERTA TKA`,
          kelas: 'X TKR A',
          jurusan: 'Teknik Kendaraan Ringan',
          gender: 'Laki-laki',
          tglLahir: '07/08/2011'
        },
        role: 'siswa',
        selectedConfig
      });
      return;
    }

    // Admin / Guru Login Flow
    const inputUpper = username.trim().toUpperCase();

    // 1. Check Super Admin credentials (Username: 'admin', Password: 'admin')
    if (inputUpper === 'ADMIN' && (password === 'admin' || password === 'admin123' || password === 'S4l4m2Periode' || password === 'ANBK2026*')) {
      onLoginSuccess({
        username: 'Administrator (Super Admin)',
        niy: 'ADMIN',
        role: 'admin',
        selectedConfig
      });
      return;
    }

    // 2. Check Teacher Database by NIY or Name
    const guruList = getGuruData();
    const matchedGuru = guruList.find(g => 
      (g.niy && g.niy.trim().toUpperCase() === inputUpper) ||
      (g.nama && g.nama.trim().toUpperCase() === inputUpper)
    );

    if (!matchedGuru) {
      setErrorMsg('NIY / Username Guru tidak ditemukan! Pastikan NIY sesuai data master.');
      return;
    }

    const currentTeacherPassword = matchedGuru.password || DEFAULT_TEACHER_PASSWORD;

    if (password !== currentTeacherPassword) {
      setErrorMsg('Password salah! Untuk pertama kali login, gunakan password default "S4l4m2Periode".');
      return;
    }

    // Check if user must change password (default password or reset flag)
    if (password === DEFAULT_TEACHER_PASSWORD || matchedGuru.isMustChangePassword) {
      setTargetGuru(matchedGuru);
      setNewPassword('');
      setConfirmPassword('');
      setModalError('');
      setShowChangePasswordModal(true);
      return;
    }

    // Successful login for Guru (Role 'guru')
    onLoginSuccess({
      username: matchedGuru.nama,
      niy: matchedGuru.niy,
      guruId: matchedGuru.id,
      mapel: matchedGuru.mapel,
      jabatan: matchedGuru.jabatan,
      role: 'guru',
      selectedConfig
    });
  };

  const handleSaveNewPassword = (e) => {
    e.preventDefault();
    setModalError('');

    if (newPassword !== confirmPassword) {
      setModalError('Konfirmasi password baru tidak cocok!');
      return;
    }

    if (newPassword === DEFAULT_TEACHER_PASSWORD) {
      setModalError('Password baru tidak boleh sama dengan password default!');
      return;
    }

    const val = validatePasswordStrength(newPassword);
    if (!val.valid) {
      setModalError(val.message);
      return;
    }

    // Save password
    updateGuruPassword(targetGuru.id, newPassword);
    setShowChangePasswordModal(false);

    // Continue Login as Guru
    onLoginSuccess({
      username: targetGuru.nama,
      niy: targetGuru.niy,
      guruId: targetGuru.id,
      mapel: targetGuru.mapel,
      jabatan: targetGuru.jabatan,
      role: 'guru',
      selectedConfig
    });
  };

  // Password Requirements Checker
  const isLenValid = newPassword.length >= 4 && newPassword.length <= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-between relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Slanted Top Header Banner */}
      <div className="w-full bg-[#3574c4] relative pt-6 pb-28 md:pb-36 px-6 md:px-12 clip-path-banner shadow-lg">
        <div 
          className="absolute inset-0 bg-[#285d9d] origin-top-left -skew-y-3 transform pointer-events-none opacity-90"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)' }}
        ></div>

        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <img 
              src="/logo-smk.png" 
              alt="Logo SMK Adi Sumarmo" 
              className="w-12 h-12 object-contain drop-shadow" 
            />

            <div>
              <h1 className="text-xl md:text-2xl font-black text-white leading-tight tracking-wide">
                SMK Adi Sumarmo
              </h1>
              <p className="text-xs text-blue-100 font-semibold tracking-wide uppercase">
                APLIKASI ANBK
              </p>
            </div>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full transition-all border border-white/20 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Pilih Mapel
            </button>
          )}
        </div>
      </div>

      {/* Floating Center Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 -mt-20 md:-mt-24 relative z-20 pb-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-[450px] border border-slate-100">
          
          <div className="mb-6 text-left">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isAdminLoginMode ? 'Login Guru & Proktor' : 'Selamat Datang Peserta'}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
              {isAdminLoginMode 
                ? 'Masuk menggunakan Username "admin" (Password: admin) atau NIY Guru.'
                : 'Silakan login dengan menggunakan username NISN dan password yang anda miliki'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* NIY / Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAdminLoginMode ? 'NIY (Nomor Induk Yayasan) / Username' : 'Username NISN / NIK'}
              </label>
              <div className="relative border-b-2 border-slate-200 focus-within:border-[#007bff] transition-colors py-2 flex items-center gap-3">
                <User className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isAdminLoginMode ? 'Contoh NIY: 690421960702' : 'P130100230'}
                  className="w-full bg-transparent text-sm md:text-base font-semibold text-slate-800 focus:outline-none placeholder-slate-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative border-b-2 border-slate-200 focus-within:border-[#007bff] transition-colors py-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <Lock className="w-5 h-5 text-slate-600 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm md:text-base font-semibold text-slate-800 focus:outline-none placeholder-slate-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#007bff] hover:bg-[#0069d9] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-200 text-sm md:text-base tracking-wide"
              >
                {isAdminLoginMode ? 'Masuk Portal Guru / Proktor' : 'Login Ujian'}
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* MODAL WAJIB GANTI PASSWORD UNTUK GURU */}
      {showChangePasswordModal && targetGuru && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Wajib Ganti Password Baru</h3>
                <p className="text-xs text-slate-500 font-medium">Halo, <strong>{targetGuru.nama}</strong>! Demi keamanan, ubah password default Anda.</p>
              </div>
            </div>

            <form onSubmit={handleSaveNewPassword} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Password Baru (Maksimal 8 Karakter)</label>
                <input
                  type="password"
                  required
                  maxLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ulangi Password Baru</label>
                <input
                  type="password"
                  required
                  maxLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang password baru..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007bff]"
                />
              </div>

              {/* Requirement Indicators */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px] font-semibold">
                <p className="font-bold text-slate-700 mb-1">Ketentuan Password Baru:</p>
                
                <div className={`flex items-center gap-1.5 ${isLenValid ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {isLenValid ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Panjang 4 hingga 8 karakter</span>
                </div>

                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {hasUpper ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Minimal 1 Huruf Besar (A-Z)</span>
                </div>

                <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {hasLower ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Minimal 1 Huruf Kecil (a-z)</span>
                </div>

                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {hasNumber ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span>Minimal 1 Angka (0-9)</span>
                </div>
              </div>

              {modalError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                  {modalError}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#007bff] hover:bg-[#0069d9] text-white font-bold py-3 rounded-xl text-xs shadow-md active:scale-[0.99]"
                >
                  Simpan Password Baru & Masuk
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white">
        © 2026 Kementerian Pendidikan Dasar dan Menengah – SMK Adi Sumarmo ANBK
      </footer>

    </div>
  );
}
