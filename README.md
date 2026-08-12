# Simulasi TKA – SMK Adi Sumarmo

Aplikasi simulasi ujian TKA (Tes Kemampuan Akademik) berbasis web untuk **SMK Adi Sumarmo**, dibangun menggunakan **Vite + React + TailwindCSS** dengan backend **Node.js + Express**.

---

## 🚀 Cara Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Frontend (Vite Dev Server)
```bash
npm run dev
```
Frontend berjalan di: `http://localhost:5173`

### 3. Jalankan Backend Database Server (Terminal Terpisah)
```bash
npm run server
```
Backend API berjalan di: `http://localhost:5000/api`

---

## 🏗️ Struktur Project

```
TKAsimulasi/
├── src/                    # Source code React frontend
│   ├── api/                # API Client (menghubungkan ke backend)
│   ├── components/         # Komponen UI React
│   ├── data/               # Storage layer (localStorage + backend sync)
│   └── App.jsx             # Main Application
├── server/                 # Backend Node.js + Express
│   ├── index.js            # REST API Server (port 5000)
│   └── db.js               # Database module (JSON file storage)
├── public/                 # Static assets (logo, dll)
└── package.json
```

---

## 📡 API Endpoints

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| `GET` | `/api/health` | Cek status server |
| `POST` | `/api/auth/login` | Login siswa/admin |
| `GET/POST` | `/api/bank-soal` | Kelola bank soal |
| `GET/POST` | `/api/exam-settings/:mapelId` | Pengaturan ujian |
| `GET/POST` | `/api/student-progress` | Progress siswa live |
| `GET/POST` | `/api/schedules` | Jadwal ujian |

---

## 🔑 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| **Proktor / Guru (Admin)** | `admin` | `admin123` |
| **Siswa** | `P130100230` | `12345` |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, KaTeX (render matematika)
- **Backend**: Node.js, Express.js
- **Database**: JSON File Storage (offline-ready, auto-backup)
- **UI Icons**: Lucide React

---

© 2026 Yayasan Pendidikan Adi Sumarmo – SMK Adi Sumarmo Colomadu
