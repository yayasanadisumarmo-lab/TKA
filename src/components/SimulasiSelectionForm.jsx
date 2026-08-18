import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, Layers, FileText, Search, ChevronDown, ChevronUp, Play, ShieldCheck } from 'lucide-react';
import { JENJANG_OPTIONS, JENIS_MAPEL_OPTIONS, getMapelDatabase } from '../data/subjects';

export default function SimulasiSelectionForm({ onStartSimulasi, onAdminLoginTrigger }) {
  const [selectedJenjang, setSelectedJenjang] = useState('sma');
  const [selectedJenis, setSelectedJenis] = useState('wajib');
  const [selectedMapel, setSelectedMapel] = useState(null);
  
  // Custom dropdown state for Mata Pelajaran
  const [isMapelDropdownOpen, setIsMapelDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dropdownRef = useRef(null);

  const jenjangObj = JENJANG_OPTIONS.find(j => j.id === selectedJenjang) || JENJANG_OPTIONS[0];

  // Get mapel list based on jenjang & jenis from dynamic database
  const getMapelList = () => {
    const db = getMapelDatabase();
    if (jenjangObj.hasJenisMapel) {
      const key = `sma-${selectedJenis}`;
      return db[key] || [];
    }
    return db[selectedJenjang] || [];
  };

  const mapelList = getMapelList();
  
  // Filter mapel list by search query
  const filteredMapelList = mapelList.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMapelDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleJenjangChange = (e) => {
    const val = e.target.value;
    setSelectedJenjang(val);
    setSelectedMapel(null);
    setSearchQuery('');
  };

  const handleJenisChange = (e) => {
    const val = e.target.value;
    setSelectedJenis(val);
    setSelectedMapel(null);
    setSearchQuery('');
  };

  const handleSelectMapelItem = (item) => {
    setSelectedMapel(item);
    setIsMapelDropdownOpen(false);
    setSearchQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMapel) {
      setIsMapelDropdownOpen(true);
      return;
    }
    onStartSimulasi({
      jenjang: jenjangObj,
      jenis: jenjangObj.hasJenisMapel ? selectedJenis : null,
      mapel: selectedMapel
    });
  };

  return (
    <div className="w-full max-w-[540px] mx-auto my-8 md:my-12 px-4">
      {/* White Card Container */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-slate-100/80">
        
        {/* Top Graduation Icon Badge */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-[#3f7cbf] shadow-lg flex items-center justify-center p-3 ring-8 ring-blue-50">
            <img src="/logo-smk.png" alt="Logo SMK Adi Sumarmo" className="w-full h-full object-contain drop-shadow" />
          </div>
        </div>

        {/* Header Titles */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-[28px] font-extrabold text-slate-800 tracking-tight mb-2">
            Simulasi TKA
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-normal max-w-xs md:max-w-sm mx-auto leading-relaxed">
            Pilih jenjang dan mata pelajaran untuk memulai simulasi
          </p>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Jenjang Pendidikan */}
          <div>
            <label className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2">
              <Layers className="w-4 h-4 text-[#3574c4]" />
              Jenjang Pendidikan:
            </label>
            <div className="relative">
              <select
                value={selectedJenjang}
                onChange={handleJenjangChange}
                className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 focus:border-[#3b79c9] focus:ring-2 focus:ring-blue-100 rounded-2xl py-3.5 px-4 pr-10 text-slate-700 font-semibold text-sm transition-all duration-200 outline-none cursor-pointer shadow-sm"
              >
                {JENJANG_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#3b79c9]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z M7 14l5-5 5 5z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* 2. Jenis Mata Pelajaran (Conditional for SMA) */}
          {jenjangObj.hasJenisMapel && (
            <div>
              <label className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2">
                <FileText className="w-4 h-4 text-[#3574c4]" />
                Jenis Mata Pelajaran:
              </label>
              <div className="relative">
                <select
                  value={selectedJenis}
                  onChange={handleJenisChange}
                  className="w-full appearance-none bg-white border border-slate-200 hover:border-slate-300 focus:border-[#3b79c9] focus:ring-2 focus:ring-blue-100 rounded-2xl py-3.5 px-4 pr-10 text-slate-700 font-semibold text-sm transition-all duration-200 outline-none cursor-pointer shadow-sm"
                >
                  {JENIS_MAPEL_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#3b79c9]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z M7 14l5-5 5 5z"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* 3. Mata Pelajaran (Custom Searchable Select) */}
          <div className="relative" ref={dropdownRef}>
            <label className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2">
              <FileText className="w-4 h-4 text-[#3574c4]" />
              Mata Pelajaran:
            </label>

            {/* Dropdown Input / Selector Header */}
            <div
              onClick={() => setIsMapelDropdownOpen(!isMapelDropdownOpen)}
              className={`w-full bg-white border ${
                isMapelDropdownOpen ? 'border-[#3b79c9] ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
              } rounded-2xl py-3.5 px-4 flex items-center justify-between cursor-pointer transition-all duration-200 shadow-sm`}
            >
              <span className={`text-sm ${selectedMapel ? 'font-semibold text-slate-800' : 'text-slate-400 font-normal'}`}>
                {selectedMapel ? selectedMapel.label : 'Pilih mata pelajaran...'}
              </span>
              {isMapelDropdownOpen ? (
                <ChevronUp className="w-4 h-4 text-[#3b79c9]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#3b79c9]" />
              )}
            </div>

            {/* Dropdown Options Box with Search Filter */}
            {isMapelDropdownOpen && (
              <div className="absolute z-30 left-0 right-0 top-[calc(100%+6px)] bg-white border border-[#3b79c9] rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Search Bar inside Dropdown */}
                <div className="p-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400 ml-1" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari mata pelajaran..."
                    autoFocus
                    className="w-full bg-transparent border-none text-sm text-slate-700 placeholder-slate-400 focus:outline-none font-medium py-1"
                  />
                </div>

                {/* Filtered Item List */}
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                  {filteredMapelList.length > 0 ? (
                    filteredMapelList.map((item) => {
                      const isSelected = selectedMapel?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectMapelItem(item)}
                          className={`px-4 py-3 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-50/80 text-[#2a6cb0] font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium'
                          }`}
                        >
                          <span>{item.label}</span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#2a6cb0]"></span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400 italic">
                      Mata pelajaran tidak ditemukan
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#3d77be] hover:bg-[#3066a7] active:scale-[0.99] text-white font-bold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 text-base"
            >
              <Play className="w-4 h-4 fill-white" />
              Mulai Simulasi
            </button>
          </div>

        </form>

        {/* Discreet Access Link for Proktor & Guru */}
        {onAdminLoginTrigger && (
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onAdminLoginTrigger}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold inline-flex items-center gap-1.5 hover:underline transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              Portal Proktor & Guru (Admin)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
