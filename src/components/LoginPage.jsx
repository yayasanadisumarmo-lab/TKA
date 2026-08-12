import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage({ mode = 'siswa', selectedConfig, onBack, onLoginSuccess }) {
  const isAdmin = mode === 'admin';
  const [username, setUsername] = useState(isAdmin ? 'admin' : 'P130100230');
  const [password, setPassword] = useState(isAdmin ? 'admin123' : '12345');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Username dan Password harus diisi!');
      return;
    }

    setErrorMsg('');
    
    onLoginSuccess({
      username,
      role: isAdmin ? 'admin' : 'siswa',
      selectedConfig
    });
  };

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
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-[440px] border border-slate-100">
          
          <div className="mb-6 text-left">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isAdmin ? 'Login Proktor & Guru' : 'Selamat Datang'}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
              {isAdmin 
                ? 'Masuk dengan kredensial Proktor/Guru untuk mengelola Bank Soal & Peserta'
                : 'Silakan login dengan menggunakan username dan password yang anda miliki'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isAdmin ? 'Username Admin' : 'Username Nisn / NIK'}
              </label>
              <div className="relative border-b-2 border-slate-200 focus-within:border-[#007bff] transition-colors py-2 flex items-center gap-3">
                <User className="w-5 h-5 text-slate-600 flex-shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isAdmin ? 'admin' : 'P130100230'}
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
                    placeholder="•••••"
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
              <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>
            )}

            {/* Selected Config Info Pill (Shows full Jenjang Label: SMA/MA/SMK/MAK/Sederajat) */}
            {selectedConfig && !isAdmin && (
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs text-blue-900 font-medium flex justify-between items-center gap-2">
                <span>Mapel Dituju: <strong>{selectedConfig.mapel?.label}</strong></span>
                <span className="bg-blue-200 text-blue-900 px-2.5 py-0.5 rounded font-bold text-[11px] whitespace-nowrap">
                  {selectedConfig.jenjang?.label || 'SMA/MA/SMK/MAK/Sederajat'}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#007bff] hover:bg-[#0069d9] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-200 text-sm md:text-base tracking-wide"
              >
                {isAdmin ? 'Masuk ke Portal Admin' : 'Login'}
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white">
        © 2026 Kementerian Pendidikan Dasar dan Menengah – SMK Adi Sumarmo ANBK
      </footer>

    </div>
  );
}
