import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, 'anbk_database.json');

// Default initial state
const defaultState = {
  users: [
    { id: 'u-admin', username: 'admin', password: 'admin123', role: 'admin', nama: 'Proktor Utama (Admin)' },
    { id: 'u-siswa1', username: 'P130100230', password: '12345', role: 'siswa', nama: 'P130100230 - PESERTA TKA' }
  ],
  bank_soal: {},
  exam_settings: {},
  student_progress: {},
  schedules: []
};

// Ensure JSON database file exists
export function initDatabase() {
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify(defaultState, null, 2), 'utf8');
    console.log(`[DB] File database created at: ${dbFilePath}`);
  } else {
    console.log(`[DB] Database loaded from: ${dbFilePath}`);
  }
}

export function readDb() {
  initDatabase();
  try {
    const raw = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[DB Error] Failed to read database JSON, resetting to default', err);
    fs.writeFileSync(dbFilePath, JSON.stringify(defaultState, null, 2), 'utf8');
    return defaultState;
  }
}

export function writeDb(data) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB Error] Failed to write database JSON', err);
  }
}
