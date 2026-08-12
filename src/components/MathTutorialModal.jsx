import React, { useState } from 'react';
import { BookOpen, Copy, Check, Sigma, HelpCircle, Lightbulb, Code2 } from 'lucide-react';
import MathText from './MathText';

export default function MathTutorialModal({ isOpen, onClose, onInsertCode }) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [activeTab, setActiveTab] = useState('dasar');

  if (!isOpen) return null;

  const handleCopyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const tutorialCategories = [
    {
      id: 'dasar',
      title: '⚡ Dasar Penulisan',
      description: 'Aturan umum pembungkus rumus matematika dalam teks soal.',
      examples: [
        {
          label: 'Rumus Inline (Menyatu dalam Paragraf)',
          code: 'Diketahui $f(x) = x^2 - 6x + 8$ dan nilai $\\sin(\\alpha) = \\frac{3}{5}$.',
          desc: 'Bungkus dengan tanda $...$ agar rumus menyatu rapi dalam kalimat.'
        },
        {
          label: 'Rumus Blok Terpusat (Baris Tersendiri)',
          code: '$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$',
          desc: 'Bungkus dengan tanda $$...$$ agar rumus ditampilkan besar di tengah baris.'
        }
      ]
    },
    {
      id: 'aljabar',
      title: '🔢 Aritmatika & Aljabar',
      description: 'Rumus pecahan, pangkat, subskrip, dan operasi aljabar.',
      examples: [
        { label: 'Pecahan', code: '$\\frac{7}{5}$', desc: '\\frac{pembilang}{penyebut}' },
        { label: 'Pangkat / Eksponen', code: '$x^2 + y^2 = 25$', desc: 'Gunakan tanda ^ untuk pangkat' },
        { label: 'Subskrip / Suku ke-n', code: '$U_{10} = a + (n-1)b$', desc: 'Gunakan tanda _ untuk indeks bawah' },
        { label: 'Simbol Plus Minus / Kali / Bagi', code: '$x = \\frac{-b \\pm \\sqrt{D}}{2a}$', desc: '\\pm untuk ±, \\times untuk ×' }
      ]
    },
    {
      id: 'trigonometri',
      title: '📐 Trigonometri & Geometri',
      description: 'Fungsi trigonometri, sudut derajat, dan huruf Yunani.',
      examples: [
        { label: 'Trigonometri Dasar', code: '$\\sin(\\alpha) + \\cos(\\beta) = 1$', desc: '\\sin, \\cos, \\tan, \\cot' },
        { label: 'Sudut & Derajat', code: '$\\theta = 90^\\circ$', desc: '^\\circ untuk lambang derajat °' },
        { label: 'Huruf Yunani', code: '$\\alpha, \\beta, \\gamma, \\theta, \\pi, \\omega$', desc: '\\alpha (α), \\beta (β), \\pi (π)' },
        { label: 'Persamaan Segitiga', code: '$\\sin(\\alpha) = \\frac{\\text{depan}}{\\text{miring}}$', desc: '\\text{...} untuk teks biasa di rumus' }
      ]
    },
    {
      id: 'akar',
      title: '📊 Akar & Logaritma',
      description: 'Penulisan bentuk akar dan logaritma.',
      examples: [
        { label: 'Akar Kuadrat', code: '$\\sqrt{x^2 + y^2}$', desc: '\\sqrt{nilai}' },
        { label: 'Akar Pangkat n', code: '$\\sqrt[3]{27} = 3$', desc: '\\sqrt[n]{nilai}' },
        { label: 'Logaritma Basis n', code: '$\\log_2(64) = 6$', desc: '\\log_b(x)' }
      ]
    },
    {
      id: 'matriks',
      title: '🧩 Matriks & Vektor',
      description: 'Susunan tabel matriks dan notasi vektor.',
      examples: [
        {
          label: 'Matriks 2x2',
          code: '$$\\begin{pmatrix} 4 & 2 \\\\ 1 & 3 \\end{pmatrix}$$',
          desc: '& memisahkan kolom, \\\\ memisahkan baris'
        },
        {
          label: 'Determinan Matriks',
          code: '$\\det(A) = (4 \\times 3) - (2 \\times 1) = 10$',
          desc: 'Det atau notasi kurung lurus |A|'
        },
        {
          label: 'Notasi Vektor',
          code: '$\\vec{u} = 3\\hat{i} + 4\\hat{j}$',
          desc: '\\vec{v} untuk tanda panah vektor'
        }
      ]
    },
    {
      id: 'kalkulus',
      title: '📈 Limit & Kalkulus',
      description: 'Penulisan limit, turunan, dan integral.',
      examples: [
        { label: 'Limit Fungsi', code: '$$\\lim_{x \\to \\infty} \\frac{1}{x} = 0$$', desc: '\\lim_{x \\to a}' },
        { label: 'Integral Tentu', code: '$$\\int_{0}^{\\pi} \\sin(x) \\, dx = 2$$', desc: '\\int_{bawah}^{atas}' },
        { label: 'Turunan (Diferensial)', code: '$\\frac{df}{dx} = 2x - 6$', desc: '\\frac{df}{dx}' }
      ]
    }
  ];

  const currentCategory = tutorialCategories.find(c => c.id === activeTab) || tutorialCategories[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-[#0052cc] text-white p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">Tutorial & Panduan Penulisan Rumus Matematika</h3>
              <p className="text-xs text-blue-100/90 font-medium">
                Petunjuk lengkap penulisan rumus LaTeX (KaTeX) untuk soal ANBK
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

        {/* Category Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 p-2 flex items-center gap-1.5 overflow-x-auto flex-shrink-0">
          {tutorialCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                activeTab === cat.id
                  ? 'bg-white text-[#0052cc] shadow-md border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Category Banner */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#0052cc] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-sm text-blue-950">{currentCategory.title}</h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5">{currentCategory.description}</p>
            </div>
          </div>

          {/* Examples Grid */}
          <div className="space-y-4">
            {currentCategory.examples.map((ex, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-slate-200 hover:border-blue-300 rounded-2xl p-4 shadow-xs transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-[#0052cc]" />
                    {ex.label}
                  </span>

                  <div className="flex items-center gap-2">
                    {onInsertCode && (
                      <button
                        onClick={() => onInsertCode(ex.code)}
                        className="bg-blue-50 hover:bg-blue-100 text-[#0052cc] border border-blue-200 text-xs font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Sigma className="w-3.5 h-3.5" /> Sisipkan ke Soal
                      </button>
                    )}

                    <button
                      onClick={() => handleCopyCode(ex.code, idx)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                        copiedIdx === idx
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Tersalin!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Salin Kode
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Code Box */}
                <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-3 rounded-xl overflow-x-auto border border-slate-800">
                  <code>{ex.code}</code>
                </div>

                {/* Description & Render Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 block mb-0.5">Penjelasan:</span>
                    <span className="text-slate-700">{ex.desc}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block mb-1">Hasil Tampilan di Soal Siswa:</span>
                    <div className="text-sm font-bold text-slate-900">
                      <MathText text={ex.code} />
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between flex-shrink-0">
          <span className="text-xs font-semibold text-slate-500">
            💡 Tips: Ketik langsung kode rumus menggunakan tanda <code>$...$</code> saat membuat soal.
          </span>

          <button
            onClick={onClose}
            className="bg-[#0052cc] hover:bg-[#003da6] text-white font-bold px-6 py-2 rounded-xl text-xs shadow-md transition-all"
          >
            Tutup Tutorial
          </button>
        </div>

      </div>

    </div>
  );
}
