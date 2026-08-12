import React from 'react';

export default function SelesaiTesModal({ onConfirmFinish, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-slate-100 relative text-center animate-in fade-in zoom-in-95 duration-150">
        
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 text-left">
          Konfirmasi Tes
        </h3>

        <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed mb-8 text-left">
          Terimakasi telah berpartisipasi dalam tes ini. Silahkan tekan tombol{' '}
          <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">
            SELESAI TES
          </span>{' '}
          untuk mengakhiri tes. Atau tekan tombol{' '}
          <span className="bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">
            KEMBALI
          </span>{' '}
          untuk kembali ke halaman tes.
        </p>

        {/* Action Buttons matching Image 1 */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onConfirmFinish}
            className="bg-[#dc3545] hover:bg-[#c82333] active:scale-[0.98] text-white font-bold text-xs md:text-sm py-2.5 px-6 rounded-full shadow-md transition-all uppercase tracking-wide"
          >
            SELESAI TES
          </button>
          
          <button
            onClick={onCancel}
            className="bg-[#28a745] hover:bg-[#218838] active:scale-[0.98] text-white font-bold text-xs md:text-sm py-2.5 px-6 rounded-full shadow-md transition-all uppercase tracking-wide"
          >
            KEMBALI
          </button>
        </div>

      </div>
    </div>
  );
}
