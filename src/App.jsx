import React, { useState } from 'react';
import Header from './components/Header';
import SimulasiSelectionForm from './components/SimulasiSelectionForm';
import LoginPage from './components/LoginPage';
import KonfirmasiDataPage from './components/KonfirmasiDataPage';
import KonfirmasiTesPage from './components/KonfirmasiTesPage';
import ExamEngine from './components/ExamEngine';
import ReviuHasilPage from './components/ReviuHasilPage';
import BankSoalPage from './components/BankSoalPage';
import LiveMonitoringPage from './components/LiveMonitoringPage';
import PengaturanJadwalPage from './components/PengaturanJadwalPage';
import TambahPesertaPage from './components/TambahPesertaPage';

export default function App() {
  // Main view mode: 'simulasi' | 'bank_soal' | 'live_monitoring' | 'pengaturan_jadwal' | 'tambah_peserta'
  const [activeTab, setActiveTab] = useState('simulasi');

  // Sub-step inside 'simulasi': 'select' | 'login' | 'admin_login' | 'confirm' | 'confirm_tes' | 'exam' | 'review'
  const [step, setStep] = useState('select');
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [loginUser, setLoginUser] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [reviewResultData, setReviewResultData] = useState(null);
  const [activeMapelForSchedule, setActiveMapelForSchedule] = useState(null);

  // Handlers for Simulasi flow - GO TO SEPARATE LOGIN SISWA PAGE AFTER MAPEL SELECTION
  const handleStartSimulasi = (config) => {
    setSelectedConfig(config);
    setStep('login');
  };

  const handleLoginSuccess = (userAuth) => {
    setLoginUser(userAuth);
    if (userAuth.role === 'admin') {
      setActiveTab('live_monitoring');
    } else {
      setStep('confirm'); // Move from Login Siswa -> Konfirmasi Data Peserta
    }
  };

  const handleConfirmData = (data) => {
    setSessionData(data);
    setStep('confirm_tes');
  };

  const handleStartExam = () => {
    setStep('exam');
  };

  const handleReviewResults = (reviewData) => {
    setReviewResultData(reviewData);
    setStep('review');
  };

  const handleResetToHome = () => {
    setActiveTab('simulasi');
    setStep('select');
    setSelectedConfig(null);
    setLoginUser(null);
    setSessionData(null);
    setReviewResultData(null);
  };

  const handleTriggerAdminLogin = () => {
    setActiveTab('simulasi');
    setStep('admin_login');
  };

  const handleGoToScheduleFromBank = (mapelObj) => {
    setActiveMapelForSchedule(mapelObj);
    setActiveTab('pengaturan_jadwal');
  };

  if ((step === 'login' || step === 'admin_login') && activeTab === 'simulasi') {
    return (
      <LoginPage
        mode={step === 'admin_login' ? 'admin' : 'siswa'}
        selectedConfig={selectedConfig}
        onBack={() => setStep('select')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-dot-pattern font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Bar with Navigation Tabs */}
      <Header 
        loggedInUser={loginUser}
        activePage={activeTab}
        onChangePage={(tab) => {
          setActiveTab(tab);
          if (tab === 'simulasi' && !selectedConfig) setStep('select');
        }}
        onReset={handleResetToHome}
        onAdminLoginTrigger={handleTriggerAdminLogin}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start items-center py-4">
        
        {/* TAB 1: SIMULASI UJIAN (SISWA) */}
        {activeTab === 'simulasi' && (
          <>
            {step === 'select' && (
              <SimulasiSelectionForm 
                onStartSimulasi={handleStartSimulasi} 
                onAdminLoginTrigger={handleTriggerAdminLogin}
              />
            )}

            {step === 'confirm' && selectedConfig && (
              <KonfirmasiDataPage
                selectedConfig={selectedConfig}
                loginUser={loginUser}
                onConfirmData={handleConfirmData}
              />
            )}

            {step === 'confirm_tes' && sessionData && (
              <KonfirmasiTesPage
                confirmData={sessionData}
                onStartExam={handleStartExam}
              />
            )}

            {step === 'exam' && sessionData && (
              <ExamEngine
                sessionData={{
                  ...sessionData,
                  selectedConfig
                }}
                onFinishExam={handleResetToHome}
                onReviewResults={handleReviewResults}
              />
            )}

            {step === 'review' && reviewResultData && (
              <ReviuHasilPage
                examData={reviewResultData.examData}
                answers={reviewResultData.answers}
                matrixAnswers={reviewResultData.matrixAnswers}
                onFinishReview={handleResetToHome}
              />
            )}
          </>
        )}

        {/* TAB 2: BANK & KELOLA SOAL (PROKTOR/GURU) */}
        {(activeTab === 'bank_soal' || activeTab === 'tambah_soal') && loginUser?.role === 'admin' && (
          <BankSoalPage
            onGoToSchedule={handleGoToScheduleFromBank}
          />
        )}

        {/* TAB 3: LIVE MONITORING & PROGRESS PESERTA (PROKTOR/GURU) */}
        {activeTab === 'live_monitoring' && loginUser?.role === 'admin' && (
          <LiveMonitoringPage />
        )}

        {/* TAB 4: PENGATURAN JADWAL & SESI UJIAN (PROKTOR/GURU) */}
        {activeTab === 'pengaturan_jadwal' && loginUser?.role === 'admin' && (
          <PengaturanJadwalPage
            initialMapel={activeMapelForSchedule}
            onSaveSuccess={() => setActiveTab('bank_soal')}
          />
        )}

        {/* TAB 5: TAMBAH PESERTA BARU (PROKTOR/GURU) */}
        {activeTab === 'tambah_peserta' && loginUser?.role === 'admin' && (
          <TambahPesertaPage
            onCancel={() => setActiveTab('simulasi')}
            onSaveSuccess={() => setActiveTab('simulasi')}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-3.5 text-center text-xs text-blue-100/90 border-t border-white/10 bg-[#28528e]/60 backdrop-blur-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Kementerian Pendidikan Dasar dan Menengah – Pusat Asesmen Pendidikan (SMK Adi Sumarmo)</p>
          <div className="flex items-center gap-4 text-blue-200/80 font-medium">
            <button 
              onClick={handleTriggerAdminLogin}
              className="text-blue-200 hover:text-white underline font-semibold flex items-center gap-1"
            >
              🔒 Login Proktor / Guru
            </button>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Panduan Aplikasi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
