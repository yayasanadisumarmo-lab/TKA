const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchFromApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API Client] Server connection warning (${endpoint}):`, err.message);
    return null; // Return null so fallback storage can handle offline mode
  }
}

// 1. Bank Soal Sync
export async function syncBankSoalToBackend(mapelId, mapelName, questions) {
  return await fetchFromApi('/bank-soal', {
    method: 'POST',
    body: JSON.stringify({ mapelId, mapelName, questions })
  });
}

export async function fetchBankSoalFromBackend() {
  const result = await fetchFromApi('/bank-soal');
  return result?.data || null;
}

// 2. Exam Settings Sync
export async function syncExamSettingsToBackend(settingsData) {
  return await fetchFromApi('/exam-settings', {
    method: 'POST',
    body: JSON.stringify(settingsData)
  });
}

export async function fetchExamSettingsFromBackend(mapelId) {
  const result = await fetchFromApi(`/exam-settings/${mapelId}`);
  return result?.data || null;
}

// 3. Student Progress & Auto-Save Sync
export async function syncStudentProgressToBackend(progressData) {
  return await fetchFromApi('/student-progress', {
    method: 'POST',
    body: JSON.stringify(progressData)
  });
}

export async function fetchStudentProgressFromBackend() {
  const result = await fetchFromApi('/student-progress');
  return result?.data || null;
}

// 4. Schedules Sync
export async function syncScheduleToBackend(scheduleData) {
  return await fetchFromApi('/schedules', {
    method: 'POST',
    body: JSON.stringify(scheduleData)
  });
}

export async function fetchSchedulesFromBackend() {
  const result = await fetchFromApi('/schedules');
  return result?.data || null;
}
