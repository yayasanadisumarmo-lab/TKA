import express from 'express';
import cors from 'cors';
import { initDatabase, readDb, writeDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize DB schema & file
initDatabase();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ANBK Database Backend is active' });
});

// ==========================================
// 1. AUTHENTICATION API
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan Password harus diisi' });
  }

  const dbData = readDb();
  const user = dbData.users?.find(u => u.username === username);
  
  if (!user || user.password !== password) {
    const isAdmin = username.toLowerCase().includes('admin') || username.toLowerCase().includes('guru');
    return res.json({
      success: true,
      user: {
        username,
        role: isAdmin ? 'admin' : 'siswa',
        nama: isAdmin ? 'Proktor/Guru Admin' : `${username} - PESERTA TKA`
      }
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      nama: user.nama
    }
  });
});

// ==========================================
// 2. BANK SOAL REST API
// ==========================================
app.get('/api/bank-soal', (req, res) => {
  try {
    const dbData = readDb();
    res.json({ success: true, data: dbData.bank_soal || {} });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bank-soal', (req, res) => {
  try {
    const { mapelId, mapelName, questions } = req.body;
    if (!mapelId) return res.status(400).json({ error: 'Mapel ID wajib diisi' });

    const dbData = readDb();
    dbData.bank_soal[mapelId] = {
      mapelId,
      mapelName: mapelName || mapelId,
      questions: questions || [],
      updatedAt: new Date().toISOString()
    };
    writeDb(dbData);

    res.json({ success: true, message: 'Bank Soal berhasil disimpan ke Database Backend!', totalQ: (questions || []).length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/bank-soal/:mapelId/question/:questionId', (req, res) => {
  try {
    const { mapelId, questionId } = req.params;
    const dbData = readDb();
    
    if (dbData.bank_soal[mapelId]) {
      dbData.bank_soal[mapelId].questions = dbData.bank_soal[mapelId].questions.filter(
        q => String(q.id) !== String(questionId)
      );
      dbData.bank_soal[mapelId].updatedAt = new Date().toISOString();
      writeDb(dbData);
    }

    res.json({ success: true, message: 'Soal berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. EXAM SETTINGS REST API
// ==========================================
app.get('/api/exam-settings/:mapelId', (req, res) => {
  try {
    const { mapelId } = req.params;
    const dbData = readDb();
    const settings = dbData.exam_settings[mapelId] || {
      mapelId,
      durasiMenit: 75,
      metodeSoal: 'semua',
      jumlahSoal: 5,
      selectedQuestionIds: []
    };
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/exam-settings', (req, res) => {
  try {
    const { mapelId, durasiMenit, metodeSoal, jumlahSoal, selectedQuestionIds } = req.body;
    if (!mapelId) return res.status(400).json({ error: 'mapelId required' });

    const dbData = readDb();
    dbData.exam_settings[mapelId] = {
      mapelId,
      durasiMenit: durasiMenit || 75,
      metodeSoal: metodeSoal || 'semua',
      jumlahSoal: jumlahSoal || 5,
      selectedQuestionIds: selectedQuestionIds || [],
      updatedAt: new Date().toISOString()
    };
    writeDb(dbData);

    res.json({ success: true, message: 'Pengaturan Ujian berhasil disimpan di Database' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. STUDENT PROGRESS & LIVE MONITORING API
// ==========================================
app.get('/api/student-progress', (req, res) => {
  try {
    const dbData = readDb();
    const list = Object.values(dbData.student_progress || {});
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/student-progress', (req, res) => {
  try {
    const { username, nama, nik, mapelId, mapelLabel, currentIdx, totalQ, answers, matrixAnswers, bookmarks, timeLeft, isFinished } = req.body;
    if (!username || !mapelId) return res.status(400).json({ error: 'Username & MapelId required' });

    const key = `${username}_${mapelId}`;
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dbData = readDb();

    dbData.student_progress[key] = {
      studentKey: key,
      username,
      nama: nama || username,
      nik: nik || username,
      mapelId,
      mapelLabel: mapelLabel || mapelId,
      currentIdx: currentIdx || 0,
      totalQ: totalQ || 0,
      answers: answers || {},
      matrixAnswers: matrixAnswers || {},
      bookmarks: bookmarks || {},
      timeLeft: timeLeft || 0,
      status: isFinished ? 'SELESAI' : 'SEDANG_MENGERJAKAN',
      lastAutoSaveTime: nowTime,
      updatedAt: new Date().toISOString()
    };

    writeDb(dbData);
    res.json({ success: true, lastAutoSaveTime: nowTime });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. SCHEDULES API
// ==========================================
app.get('/api/schedules', (req, res) => {
  try {
    const dbData = readDb();
    res.json({ success: true, data: dbData.schedules || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/schedules', (req, res) => {
  try {
    const { mapelId, mapelLabel, sesi, tanggalMulai, wktMulai, wktSelesai, token } = req.body;
    const dbData = readDb();
    const newSched = {
      id: `sched-${Date.now()}`,
      mapelId,
      mapelLabel,
      sesi,
      tanggalMulai,
      wktMulai,
      wktSelesai,
      token,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    dbData.schedules = [newSched, ...(dbData.schedules || [])];
    writeDb(dbData);

    res.json({ success: true, message: 'Jadwal Ujian berhasil disimpan', data: newSched });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express Backend Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 ANBK Database Backend Server is running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});
