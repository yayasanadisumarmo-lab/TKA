import React from 'react';
import { getExamSettingForMapel } from '../data/examSettingsStorage';

export default function KonfirmasiTesPage({ confirmData, onStartExam }) {
  const mapelTitle = confirmData?.mapelLabel || confirmData?.selectedConfig?.mapel?.label || 'Bahasa Inggris';
  const mapelId = confirmData?.selectedConfig?.mapel?.id || 'b-ing';

  const setting = getExamSettingForMapel(mapelId);

  // Format date display
  const dateObj = setting.tanggalUjian ? new Date(setting.tanggalUjian) : new Date();
  const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()} ${setting.jamMulai || '07:30'} - ${setting.jamSelesai || '11:30'}`;

  return (
    <div className="w-full flex items-center justify-center py-12 md:py-20 px-4 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Floating Center Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-[480px] border border-slate-100 relative overflow-hidden">
        
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 mb-8 text-left">
          Konfirmasi Tes
        </h2>

        <div className="space-y-5 text-xs md:text-sm">
          
          {/* Nama Tes */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Nama Tes</label>
            <div className="text-slate-800 font-bold text-base py-1 border-b border-slate-200">
              {mapelTitle}
            </div>
          </div>

          {/* Status Tes */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Status Tes</label>
            <div className="text-slate-800 font-bold text-base py-1 border-b border-slate-200 flex items-center justify-between">
              <span>Tes Baru</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded font-bold uppercase">
                {setting.metodeSoal === 'acak' ? 'Soal Acak' : 'Soal Dipilih Proktor'}
              </span>
            </div>
          </div>

          {/* Waktu Tes */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Jadwal Waktu Tes</label>
            <div className="text-slate-800 font-bold text-base py-1 border-b border-slate-200">
              {formattedDate}
            </div>
          </div>

          {/* Alokasi Waktu Tes & Jumlah Soal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Alokasi Waktu Tes</label>
              <div className="text-slate-800 font-bold text-base py-1 border-b border-slate-200">
                {setting.durasiMenit || 75} Menit
              </div>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Jumlah Soal</label>
              <div className="text-slate-800 font-bold text-base py-1 border-b border-slate-200">
                {setting.jumlahSoal || 20} Soal
              </div>
            </div>
          </div>

          {/* Mulai Button */}
          <div className="pt-6">
            <button
              onClick={onStartExam}
              className="w-full bg-[#007bff] hover:bg-[#0069d9] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-full shadow-lg transition-all text-sm md:text-base tracking-wide"
            >
              Mulai Ujian
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
