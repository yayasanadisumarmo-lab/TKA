import React from 'react';
import { AlertTriangle, Copy, Trash2, ShieldCheck, XCircle, FileText } from 'lucide-react';
import MathText from './MathText';

export default function DuplicateQuestionModal({
  isOpen,
  existingQuestion,
  newQuestion,
  onReplaceExisting,
  onKeepBoth,
  onCancel
}) {
  if (!isOpen || !existingQuestion || !newQuestion) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Alert */}
        <div className="flex items-center gap-3 border-b pb-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-xl text-slate-900 tracking-tight">
              Peringatan: Terdeteksi Soal Ganda / Sama!
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Soal yang baru saja Anda masukkan memiliki teks pertanyaan yang sama dengan soal yang sudah tersimpan di Bank Soal.
            </p>
          </div>
        </div>

        {/* Side-by-Side Comparison Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Card 1: Existing Question */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="text-[11px] font-black text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full uppercase">
              1. Soal Lama Tersimpan
            </span>
            <div className="text-xs font-semibold text-slate-800 line-clamp-3">
              <MathText text={existingQuestion.questionText || existingQuestion.stimulus} />
            </div>
            <div className="text-[11px] text-slate-500 italic">
              Kunci: <strong>{existingQuestion.correctAnswer || 'A'}</strong> | {existingQuestion.options?.length || 0} Opsi
            </div>
          </div>

          {/* Card 2: New Question */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
            <span className="text-[11px] font-black text-[#0052cc] bg-blue-100 px-2.5 py-0.5 rounded-full uppercase">
              2. Soal Baru Diinput
            </span>
            <div className="text-xs font-bold text-blue-950 line-clamp-3">
              <MathText text={newQuestion.questionText || newQuestion.stimulus} />
            </div>
            <div className="text-[11px] text-blue-800 italic">
              Kunci: <strong>{newQuestion.correctAnswer || 'A'}</strong> | {newQuestion.options?.length || 0} Opsi
            </div>
          </div>

        </div>

        {/* User Choice Explanation */}
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 font-medium">
          Silakan pilih tindakan yang ingin Anda lakukan terhadap kedua soal ini:
        </div>

        {/* 3 Decision Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Option 1: Replace / Delete Old */}
          <button
            onClick={onReplaceExisting}
            className="p-3.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs transition-all shadow-md flex flex-col items-center justify-center text-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Ganti Soal Lama</span>
            <span className="text-[10px] font-normal opacity-90">(Hapus yang lama)</span>
          </button>

          {/* Option 2: Keep Both */}
          <button
            onClick={onKeepBoth}
            className="p-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-amber-950 font-bold rounded-xl text-xs transition-all shadow-md flex flex-col items-center justify-center text-center gap-1"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Pertahankan Keduanya</span>
            <span className="text-[10px] font-normal opacity-90">(Simpan 2 soal)</span>
          </button>

          {/* Option 3: Cancel */}
          <button
            onClick={onCancel}
            className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all border border-slate-300 flex flex-col items-center justify-center text-center gap-1"
          >
            <XCircle className="w-4 h-4 text-slate-500" />
            <span>Batalkan Impor</span>
            <span className="text-[10px] font-normal text-slate-400">(Tidak ada perubahan)</span>
          </button>

        </div>

      </div>

    </div>
  );
}
