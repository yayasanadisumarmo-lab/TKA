import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, CheckCircle2, Clock, UserCheck, AlertTriangle, Search, ShieldCheck } from 'lucide-react';
import { getAllStudentProgress } from '../data/studentProgressStorage';

export default function LiveMonitoringPage() {
  const [progressData, setProgressData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchProgress = () => {
    const data = getAllStudentProgress();
    setProgressData(data);
  };

  useEffect(() => {
    fetchProgress();
    // Auto refresh live progress every 3 seconds
    const interval = setInterval(fetchProgress, 3000);
    return () => clearInterval(interval);
  }, []);

  const progressList = Object.values(progressData);

  const filteredList = progressList.filter(item => {
    const matchesSearch = item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.mapelLabel?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && item.status === filterStatus;
  });

  const totalMengerjakan = progressList.filter(i => i.status === 'SEDANG_MENGERJAKAN').length;
  const totalSelesai = progressList.filter(i => i.status === 'SELESAI').length;

  const formatTime = (secs) => {
    if (!secs) return '00:00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-emerald-400 animate-pulse" />
            Live Monitoring & Progress Ujian Peserta
          </h1>
          <p className="text-xs md:text-sm text-blue-100/90 font-medium mt-1">
            Fitur Auto-Save aktif otomatis. Proktor/Guru dapat melihat posisi nomor soal terakhir dan progres jawaban peserta secara real-time.
          </p>
        </div>

        <button
          onClick={fetchProgress}
          className="bg-[#007bff] hover:bg-[#0069d9] active:scale-[0.99] text-white font-bold py-2.5 px-5 rounded-xl shadow-lg transition-all text-xs md:text-sm flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Progress Live
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#007bff] flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Peserta Terdaftar</p>
            <h3 className="text-2xl font-black text-slate-800">{progressList.length} Peserta</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Sedang Mengerjakan (Active)</p>
            <h3 className="text-2xl font-black text-emerald-600">{totalMengerjakan} Peserta</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Telah Selesai Ujian</p>
            <h3 className="text-2xl font-black text-purple-600">{totalSelesai} Peserta</h3>
          </div>
        </div>
      </div>

      {/* Main Progress Table Card */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Nama / NIK / Mapel..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-700 outline-none focus:border-[#007bff]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'ALL' ? 'bg-[#007bff] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({progressList.length})
            </button>
            <button
              onClick={() => setFilterStatus('SEDANG_MENGERJAKAN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'SEDANG_MENGERJAKAN' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Aktif ({totalMengerjakan})
            </button>
            <button
              onClick={() => setFilterStatus('SELESAI')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === 'SELESAI' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Selesai ({totalSelesai})
            </button>
          </div>

        </div>

        {/* Live Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-[#2e63a5] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 text-center">NO</th>
                <th className="py-3.5 px-4">PESERTA UJIAN</th>
                <th className="py-3.5 px-4">MATA PELAJARAN</th>
                <th className="py-3.5 px-4 text-center">POSISI SOAL TERAKHIR</th>
                <th className="py-3.5 px-4">PROGRES JAWABAN</th>
                <th className="py-3.5 px-4 text-center">AUTO-SAVE TERAKHIR</th>
                <th className="py-3.5 px-4 text-center">SISA WAKTU</th>
                <th className="py-3.5 px-4 text-center">STATUS LIVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">
              {filteredList.length > 0 ? (
                filteredList.map((item, idx) => {
                  const pct = Math.round((item.answeredCount / (item.totalQ || 20)) * 100);
                  return (
                    <tr key={item.studentKey || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900">{item.nama}</div>
                        <div className="text-[11px] text-slate-400 font-mono">Username: {item.username}</div>
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-800">
                        {item.mapelLabel}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="bg-blue-50 text-[#007bff] font-extrabold px-3 py-1 rounded-lg border border-blue-200">
                          Soal No. {item.currentQuestionNum} / {item.totalQ}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center justify-between text-xs mb-1 font-bold">
                          <span>{item.answeredCount} / {item.totalQ} Terjawab</span>
                          <span className="text-slate-500">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border">
                          <div
                            className={`h-full transition-all duration-300 ${
                              pct === 100 ? 'bg-emerald-500' : 'bg-[#007bff]'
                            }`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center font-mono text-xs font-semibold text-slate-600">
                        {item.lastAutoSaveTime} WIB
                      </td>

                      <td className="py-4 px-4 text-center font-mono font-bold text-rose-600">
                        {formatTime(item.timeLeft)}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {item.status === 'SELESAI' ? (
                          <span className="bg-purple-100 text-purple-800 font-extrabold px-3 py-1 rounded-full text-xs border border-purple-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> SELESAI
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full text-xs border border-emerald-200 inline-flex items-center gap-1 animate-pulse">
                            <Activity className="w-3.5 h-3.5" /> LIVE (MENGERJAKAN)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                    Belum ada aktivitas peserta ujian. Bila siswa mulai login dan menjawab soal, data progres auto-save akan otomatis muncul di sini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
