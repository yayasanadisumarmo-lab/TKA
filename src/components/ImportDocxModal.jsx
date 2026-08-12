import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Download, FileCode, Trash2, ArrowRight, Clipboard, Sparkles, Undo2, XCircle } from 'lucide-react';
import { parseDocxFile, parseRawQuestionText, generateSampleWordTemplate } from '../utils/docxParser';
import { saveQuestionToMapel, findDuplicateQuestionInMapel, replaceQuestionInMapel, undoImportBatch } from '../data/bankSoalStorage';
import MathText from './MathText';
import DuplicateQuestionModal from './DuplicateQuestionModal';

export default function ImportDocxModal({ isOpen, onClose, selectedMapelObj, onImportSuccess }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Duplicate Check Modal State
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [dupQueue, setDupQueue] = useState([]);
  const [currentDupItem, setCurrentDupItem] = useState(null);

  // Success & Undo Dialog State
  const [importedBatch, setImportedBatch] = useState(null); // { count, mapelLabel, mapelId, ids }

  if (!isOpen) return null;

  const mapelId = selectedMapelObj?.id || 'matematika';
  const mapelLabel = selectedMapelObj?.label || 'Matematika';

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);
    setErrorMsg('');
    setParsedQuestions([]);

    try {
      const results = await parseDocxFile(selectedFile);
      if (!results || results.length === 0) {
        setErrorMsg('Tidak dapat mengekstrak soal dari dokumen ini. Coba gunakan tab "Tempel Teks Soal" untuk menempelkan teks langsung.');
      } else {
        setParsedQuestions(results);
      }
    } catch (err) {
      console.error('Failed to parse file:', err);
      setErrorMsg('Gagal membaca file. Anda dapat menggunakan tab "Tempel Teks Soal" di atas untuk memasukkan soal.');
    } finally {
      setLoading(false);
    }
  };

  const handleParsePastedText = () => {
    if (!pastedText.trim()) {
      setErrorMsg('Silakan tempelkan teks soal ke dalam kotak di atas.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const results = parseRawQuestionText(pastedText);
      if (!results || results.length === 0) {
        setErrorMsg('Format teks belum dikenali. Pastikan setiap soal diawali dengan "Soal 1:", "Soal 2:", atau "1.", "2."');
      } else {
        setParsedQuestions(results);
      }
    } catch (err) {
      setErrorMsg('Gagal menganalisis teks soal.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSingleParsedQuestion = (indexToRemove) => {
    setParsedQuestions(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCommitImport = () => {
    if (parsedQuestions.length === 0) return;

    // Detect duplicates in parsedQuestions
    const duplicateItems = [];
    const nonDuplicates = [];
    const savedIds = [];

    parsedQuestions.forEach(q => {
      const existing = findDuplicateQuestionInMapel(mapelId, q.questionText || q.stimulus);
      if (existing) {
        duplicateItems.push({ existing, newQ: q });
      } else {
        nonDuplicates.push(q);
      }
    });

    // Save non-duplicates immediately
    nonDuplicates.forEach(q => {
      saveQuestionToMapel(mapelId, mapelLabel, q);
      savedIds.push(q.id);
    });

    if (duplicateItems.length > 0) {
      setDupQueue(duplicateItems);
      setCurrentDupItem(duplicateItems[0]);
      setShowDuplicateModal(true);
    } else {
      // Trigger custom Success & Undo Dialog
      setImportedBatch({
        count: nonDuplicates.length,
        mapelLabel,
        mapelId,
        ids: savedIds
      });
      if (onImportSuccess) onImportSuccess();
    }
  };

  const handleUndoImport = () => {
    if (importedBatch) {
      undoImportBatch(importedBatch.mapelId, importedBatch.ids);
      alert(`Impor ${importedBatch.count} soal ke Bank Soal "${importedBatch.mapelLabel}" telah DIBATALKAN & dihapus kembali.`);
      setImportedBatch(null);
      if (onImportSuccess) onImportSuccess();
      onClose();
    }
  };

  const handleConfirmFinish = () => {
    setImportedBatch(null);
    onClose();
  };

  // DUPLICATE DECISION HANDLERS FOR IMPORT QUEUE
  const advanceDupQueue = () => {
    const remaining = dupQueue.slice(1);
    setDupQueue(remaining);
    if (remaining.length > 0) {
      setCurrentDupItem(remaining[0]);
    } else {
      setShowDuplicateModal(false);
      alert(`Proses impor ke Bank Soal "${mapelLabel}" selesai!`);
      if (onImportSuccess) onImportSuccess();
      onClose();
    }
  };

  const handleReplaceExisting = () => {
    if (currentDupItem) {
      replaceQuestionInMapel(mapelId, currentDupItem.existing.id, currentDupItem.newQ);
    }
    advanceDupQueue();
  };

  const handleKeepBoth = () => {
    if (currentDupItem) {
      saveQuestionToMapel(mapelId, mapelLabel, currentDupItem.newQ);
    }
    advanceDupQueue();
  };

  const handleCancelDup = () => {
    setShowDuplicateModal(false);
    alert(`Impor soal tersisa dibatalkan.`);
    if (onImportSuccess) onImportSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-[#0052cc] text-white p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">Impor Soal Ke Bank Soal</h3>
              <p className="text-xs text-blue-100/90 font-medium">
                Mata Pelajaran Target: <strong>{mapelLabel}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-100 p-2 flex items-center gap-2 border-b border-slate-200 flex-shrink-0">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-white text-[#0052cc] shadow-md border border-blue-200'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <UploadCloud className="w-4 h-4" /> 📁 Unggah File Word (.docx / .txt)
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'paste'
                ? 'bg-white text-[#0052cc] shadow-md border border-blue-200'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Clipboard className="w-4 h-4" /> 📋 Tempel Teks Soal Langsung (100% Berhasil)
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* TAB 1: UPLOAD FILE WORD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {/* Download Template Banner */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-sm text-blue-950 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-[#0052cc]" /> Format / Template Soal Word (.docx / .txt)
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Unduh contoh format penulisan soal agar dokumen Word Anda dapat terbaca secara otomatis.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={generateSampleWordTemplate}
                  className="bg-white hover:bg-blue-100 text-[#0052cc] border border-blue-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                >
                  <Download className="w-4 h-4" /> Unduh Format Template
                </button>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block border-2 border-dashed border-slate-300 hover:border-[#0052cc] bg-slate-50/60 rounded-2xl p-6 text-center cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept=".docx, .doc, .txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0052cc] mx-auto flex items-center justify-center mb-2 shadow-xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-slate-800">
                    Pilih atau Tarik File Word <span className="text-[#0052cc] underline">(.docx)</span> ke sini
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Mendukung file Microsoft Word (.docx) atau file teks (.txt)</p>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE TEKS LANGSUNG */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 font-medium">
                💡 <strong>Tips Tempel Teks:</strong> Salin (Copy) seluruh soal dari dokumen Anda, lalu Tempelkan (Paste) ke dalam kotak di bawah ini dan klik tombol <strong>"Analisis Teks Soal"</strong>.
              </div>

              <textarea
                rows={8}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Tempelkan seluruh teks soal di sini... (Contoh: Soal 1: ... A. ... B. ... Kunci: B Pembahasan: ...)"
                className="w-full p-4 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 outline-none focus:border-[#0052cc] shadow-xs resize-none"
              />

              <button
                type="button"
                onClick={handleParsePastedText}
                className="w-full bg-[#0052cc] hover:bg-[#003da6] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> ⚡ Analisis & Deteksi Teks Soal
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span className="text-xs font-extrabold text-slate-700">Membaca & Menganalisis Dokumen Soal...</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedQuestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Hasil Deteksi ({parsedQuestions.length} Soal Siap Diimpor):
                </h4>

                <button
                  onClick={() => {
                    setFile(null);
                    setPastedText('');
                    setParsedQuestions([]);
                  }}
                  className="text-xs text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Reset Teks/File
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-slate-50/50 p-2">
                {parsedQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl shadow-xs space-y-1.5 text-xs relative group">
                    <div className="flex items-center justify-between font-extrabold text-slate-800">
                      <span className="flex items-center gap-2">
                        Soal No. {idx + 1}
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                          Kunci: {q.correctAnswer}
                        </span>
                      </span>

                      {/* INDIVIDUAL DELETE QUESTION BUTTON FROM PARSED PREVIEW */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSingleParsedQuestion(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1 text-[11px] font-bold"
                        title="Hapus soal ini dari daftar impor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Soal Ini</span>
                      </button>
                    </div>

                    <div className="text-slate-700 font-medium line-clamp-2">
                      <MathText text={q.questionText} />
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 font-semibold pt-1">
                      {q.options?.map(opt => (
                        <span
                          key={opt.key}
                          className={`px-2 py-0.5 rounded border ${
                            opt.key === q.correctAnswer ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          {opt.key}. <MathText text={opt.text} />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4 text-slate-500" />
            <span>Batalkan Impor</span>
          </button>

          <button
            disabled={parsedQuestions.length === 0}
            onClick={handleCommitImport}
            className={`font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 ${
              parsedQuestions.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.99]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Impor {parsedQuestions.length} Soal ke Bank Soal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* DUPLICATE DETECTED MODAL IN IMPORT QUEUE */}
      {currentDupItem && (
        <DuplicateQuestionModal
          isOpen={showDuplicateModal}
          existingQuestion={currentDupItem.existing}
          newQuestion={currentDupItem.newQ}
          onReplaceExisting={handleReplaceExisting}
          onKeepBoth={handleKeepBoth}
          onCancel={handleCancelDup}
        />
      )}

      {/* SUCCESS & UNDO DIALOG */}
      {importedBatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">
              Impor Berhasil!
            </h3>

            <p className="text-xs md:text-sm text-slate-600 font-medium">
              Berhasil mengimpor <strong>{importedBatch.count} soal</strong> ke dalam Bank Soal <strong>"{importedBatch.mapelLabel}"</strong>.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleConfirmFinish}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Ya, Simpan ke Bank Soal
              </button>

              <button
                onClick={handleUndoImport}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Undo2 className="w-4 h-4 text-rose-600" /> ↩️ Batalkan / Undo Impor Ini
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
