/**
 * CLINIVA — REST API Client Service
 * Fully dynamic interface bridging React Frontend to the Spring Boot REST API.
 * Falls back to a live-mutating simulation when the backend is offline.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const ENABLE_FALLBACK = import.meta.env.VITE_ENABLE_DEMO_FALLBACK !== 'false';

// ── Helper: build request headers with JWT token ──────────
function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('cliniva_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// ── DEMO USERS (used for fallback auth when backend is offline) ───
const DEMO_USERS = [
  { email: 'admin@cliniva.io',    password: 'admin123',   type: 'admin',   role: 'System Admin',     name: 'Dr. Admin Director', avatar: 'SA', userId: 1 },
  { email: 'doctor@cliniva.io',   password: 'doctor123',  type: 'doctor',  role: 'Attending Doctor', name: 'Dr. Reyna Torres',   avatar: 'RT', userId: 2, specialization: 'Neurology' },
  { email: 'chen@cliniva.io',     password: 'chen123',    type: 'doctor',  role: 'Attending Doctor', name: 'Dr. Lucas Chen',     avatar: 'LC', userId: 5, specialization: 'Cardiology' },
  { email: 'wu@cliniva.io',       password: 'wu123',      type: 'doctor',  role: 'Attending Doctor', name: 'Dr. Yara Wu',        avatar: 'YW', userId: 6, specialization: 'Trauma Surgery' },
  { email: 'nurse@cliniva.io',    password: 'nurse123',   type: 'nurse',   role: 'Head Nurse',       name: 'Nurse Aiko Sato',    avatar: 'AS', userId: 3 },
  { email: 'patient@cliniva.io',  password: 'patient123', type: 'patient', role: 'Patient',          name: 'Aria Vasquez',       avatar: 'AV', userId: 4, patientId: 'CLV-00001' },
  { email: 'marcus@cliniva.io',   password: 'marcus123',  type: 'patient', role: 'Patient',          name: 'Marcus Chen',        avatar: 'MC', userId: 7, patientId: 'CLV-00387' },
  { email: 'mira@cliniva.io',     password: 'mira123',    type: 'patient', role: 'Patient',          name: 'Mira Patel',         avatar: 'MP', userId: 8, patientId: 'CLV-00409' },
];

// ── AUTH ───────────────────────────────────────────────────────────

/**
 * loginUser — POST /api/auth/login
 * Returns { token, userId, email, name, type (role lowercased), avatar }
 * Fallback: matches against DEMO_USERS if backend is offline.
 */
export async function loginUser(email, password) {
  const normalised = email.trim().toLowerCase();
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalised, password }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    // Normalise: backend returns role as "patient", frontend uses type="patient"
    return { ...data, type: data.role };
  } catch (err) {
    if (!ENABLE_FALLBACK) throw err;
    // Fallback: check demo credentials locally
    await delay(500);
    const demo = DEMO_USERS.find(u => u.email === normalised && u.password === password);
    if (demo) {
      // Generate a fake token so localStorage.getItem('cliniva_token') returns something
      const fakeToken = `demo_${demo.type}_${Date.now()}`;
      return { token: fakeToken, userId: demo.userId, email: demo.email, name: demo.name, type: demo.type, avatar: demo.avatar };
    }
    throw new Error('Invalid email or password. Please try again.');
  }
}

/**
 * registerUser — POST /api/auth/register
 * Returns AuthResponse (same as login — auto-login after register).
 * Fallback: returns a simulated new patient account.
 */
export async function registerUser({ firstName, lastName, email, password, phoneNumber }) {
  const normalised = email.trim().toLowerCase();
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email: normalised, password, phoneNumber }),
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return { ...data, type: data.role };
  } catch (err) {
    if (!ENABLE_FALLBACK) throw err;
    // Fallback: simulate registration
    if (DEMO_USERS.find(u => u.email === normalised)) {
      throw new Error('An account with this email already exists.');
    }
    await delay(800);
    const fakeToken = `demo_patient_${Date.now()}`;
    const name = `${firstName} ${lastName}`;
    const avatar = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    return { token: fakeToken, userId: 999, email: normalised, name, type: 'patient', avatar };
  }
}

/**
 * getCurrentUser — GET /api/auth/me
 * Used on page refresh to restore session from localStorage token.
 * Fallback: if backend is offline, tries to decode the fake demo token.
 */
export async function getCurrentUser() {
  const token = localStorage.getItem('cliniva_token');
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { ...data, type: data.role };
  } catch {
    if (!ENABLE_FALLBACK) return null;
    // Fallback: if it's a demo token, restore from localStorage
    const stored = localStorage.getItem('cliniva_user');
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  }
}

// ── Backend health check ───────────────────────────────────
export async function checkBackendConnection() {
  try {
    const res = await fetch(`${API_BASE_URL}/actuator/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
//  LIVE-MUTATING SIMULATION STATE
//  This simulates real backend changes between poll cycles.
//  When the real backend is connected, this entire block is bypassed.
// ═══════════════════════════════════════════════════════════

const SIM = {
  // Pod simulation state
  pods: [
    { id: 'A-1', status: 'occupied',    patient: 'Aria Vasquez',    doctor: 'Dr. Torres', ward: 'Neuro',   severity: 'stable'   },
    { id: 'A-2', status: 'empty',       patient: null,              doctor: null,          ward: 'Neuro',   severity: null       },
    { id: 'A-3', status: 'occupied',    patient: 'James Okafor',    doctor: 'Dr. Chen',   ward: 'Cardiac', severity: 'stable'   },
    { id: 'A-4', status: 'stabilizing', patient: 'Mira Patel',      doctor: 'Dr. Wu',     ward: 'Trauma',  severity: 'critical' },
    { id: 'B-1', status: 'occupied',    patient: 'Marcus Chen',     doctor: 'Dr. Torres', ward: 'Cardiac', severity: 'stable'   },
    { id: 'B-2', status: 'empty',       patient: null,              doctor: null,          ward: 'Ortho',   severity: null       },
    { id: 'B-3', status: 'occupied',    patient: 'Lena Müller',     doctor: 'Dr. Osei',   ward: 'Neuro',   severity: 'stable'   },
    { id: 'B-4', status: 'stabilizing', patient: 'Yusuf Al-Rashid', doctor: 'Dr. Chen',   ward: 'Pulmo',   severity: 'warning'  },
    { id: 'C-1', status: 'occupied',    patient: 'Sofia Reyes',     doctor: 'Dr. Wu',     ward: 'Ortho',   severity: 'stable'   },
    { id: 'C-2', status: 'occupied',    patient: 'Aiden Park',      doctor: 'Dr. Torres', ward: 'Neuro',   severity: 'stable'   },
    { id: 'C-3', status: 'empty',       patient: null,              doctor: null,          ward: 'Cardiac', severity: null       },
    { id: 'C-4', status: 'occupied',    patient: 'Chiara Rossi',    doctor: 'Dr. Osei',   ward: 'Trauma',  severity: 'stable'   },
  ],

  patients: [
    { id: 'CLV-00421', name: 'Aria Vasquez',    status: 'Pod A-1', age: 32, bloodGroup: 'O+',  severity: 'stable',   ward: 'Neuro',   admittedOn: '12 Aug 2026', doctor: 'Dr. R. Torres' },
    { id: 'CLV-00387', name: 'Marcus Chen',     status: 'Pod B-1', age: 45, bloodGroup: 'A-',  severity: 'stable',   ward: 'Cardiac', admittedOn: '10 Aug 2026', doctor: 'Dr. L. Chen'   },
    { id: 'CLV-00409', name: 'Mira Patel',      status: 'Pod A-4', age: 28, bloodGroup: 'B+',  severity: 'critical', ward: 'Trauma',  admittedOn: '15 Aug 2026', doctor: 'Dr. Y. Wu'     },
    { id: 'CLV-00366', name: 'James Okafor',    status: 'Pod A-3', age: 50, bloodGroup: 'AB-', severity: 'stable',   ward: 'Cardiac', admittedOn: '08 Aug 2026', doctor: 'Dr. A. Osei'   },
    { id: 'CLV-00391', name: 'Lena Müller',     status: 'Pod B-3', age: 37, bloodGroup: 'O-',  severity: 'stable',   ward: 'Neuro',   admittedOn: '13 Aug 2026', doctor: 'Dr. R. Torres' },
    { id: 'CLV-00402', name: 'Yusuf Al-Rashid', status: 'Pod B-4', age: 29, bloodGroup: 'A+',  severity: 'warning',  ward: 'Pulmo',   admittedOn: '14 Aug 2026', doctor: 'Dr. L. Chen'   },
  ],

  procedures: [
    { time: '08:30', patient: 'Aria Vasquez',    id: 'CLV-00421', procedure: 'Neuro-Cognitive Scan',          doctor: 'Dr. R. Torres', pod: 'A-1', type: 'neuro',   duration: '45min', status: 'in-progress' },
    { time: '09:15', patient: 'Marcus Chen',     id: 'CLV-00387', procedure: 'Cardiac Bio-Impedance',         doctor: 'Dr. L. Chen',   pod: 'B-1', type: 'cardiac', duration: '30min', status: 'upcoming'    },
    { time: '10:00', patient: 'Mira Patel',      id: 'CLV-00409', procedure: 'Trauma Stabilization Protocol', doctor: 'Dr. Y. Wu',     pod: 'A-4', type: 'trauma',  duration: '60min', status: 'upcoming'    },
    { time: '11:30', patient: 'James Okafor',    id: 'CLV-00366', procedure: 'Pulmonary Function Analysis',   doctor: 'Dr. A. Osei',   pod: 'A-3', type: 'pulmo',   duration: '20min', status: 'upcoming'    },
    { time: '13:00', patient: 'Lena Müller',     id: 'CLV-00391', procedure: 'Orthopedic Pressure Mapping',   doctor: 'Dr. R. Torres', pod: 'B-3', type: 'ortho',   duration: '25min', status: 'upcoming'    },
    { time: '14:45', patient: 'Yusuf Al-Rashid', id: 'CLV-00402', procedure: 'Serology & Bio-Panel',          doctor: 'Dr. L. Chen',   pod: 'B-4', type: 'lab',     duration: '15min', status: 'upcoming'    },
  ],

  // Telemetry per patient — mutates every call
  telemetry: {},

  // Simulate one small realistic change per poll cycle
  tick() {
    const rand = Math.random();

    // ~30% chance: flip a stabilizing pod to occupied (patient stabilized)
    if (rand < 0.30) {
      const stabilizing = this.pods.filter(p => p.status === 'stabilizing');
      if (stabilizing.length > 0) {
        const pod = stabilizing[Math.floor(Math.random() * stabilizing.length)];
        pod.status   = 'occupied';
        pod.severity = 'stable';
      }
    }
    // ~10% chance: flip an occupied pod to stabilizing (patient deteriorated)
    else if (rand < 0.40) {
      const occupied = this.pods.filter(p => p.status === 'occupied');
      if (occupied.length > 0) {
        const pod = occupied[Math.floor(Math.random() * occupied.length)];
        pod.status   = 'stabilizing';
        pod.severity = Math.random() > 0.5 ? 'warning' : 'critical';
      }
    }
    // ~10% chance: discharge a patient (occupied → empty)
    else if (rand < 0.50) {
      const occupied = this.pods.filter(p => p.status === 'occupied');
      if (occupied.length > 2) { // keep at least 2 occupied
        const pod = occupied[Math.floor(Math.random() * occupied.length)];
        pod.status   = 'empty';
        pod.patient  = null;
        pod.doctor   = null;
        pod.severity = null;
      }
    }
  },

  // Generate live telemetry for a patient
  getTelemetry(patientId) {
    if (!this.telemetry[patientId]) {
      this.telemetry[patientId] = {
        heartRate:   75 + Math.floor(Math.random() * 20),
        bloodOxygen: 96 + Math.floor(Math.random() * 4),
        temperature: 36.5 + Math.random() * 1.2,
        gForce:      1.5 + Math.random() * 1.5,
        heartData:   Array.from({ length: 14 }, () => 65 + Math.floor(Math.random() * 30)),
        tempData:    Array.from({ length: 10 }, () => 36.5 + Math.random() * 1.0),
      };
    }
    const t = this.telemetry[patientId];
    // Drift values slightly every call
    t.heartRate   = Math.max(55, Math.min(120, t.heartRate + Math.floor((Math.random() - 0.5) * 6)));
    t.bloodOxygen = Math.max(92, Math.min(100, t.bloodOxygen + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)));
    t.temperature = Math.max(36.0, Math.min(38.5, t.temperature + (Math.random() - 0.5) * 0.2));
    t.gForce      = Math.max(0.5, Math.min(5.5, t.gForce + (Math.random() - 0.5) * 0.4));
    t.heartData   = [...t.heartData.slice(1), t.heartRate];
    t.tempData    = [...t.tempData.slice(1), parseFloat(t.temperature.toFixed(1))];
    return { ...t, temperature: parseFloat(t.temperature.toFixed(1)) };
  },
};

// ── Simulated network delay ────────────────────────────────
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// ═══════════════════════════════════════════════════════════
//  PUBLIC API FUNCTIONS
// ═══════════════════════════════════════════════════════════

// ── PATIENT REST API ───────────────────────────────────────────────

// Fallback patient profile data
const SIM_PATIENT_PROFILE = {
  id: 4, patientId: 'CLV-00001', firstName: 'Aria', lastName: 'Vasquez',
  email: 'patient@cliniva.io', phoneNumber: '+1-555-0100', bloodGroup: 'O+',
  maritalStatus: 'SINGLE', age: 29, heightCm: 165, weightKg: 58,
  allergies: 'Penicillin', currentMedications: 'None', occupation: 'Graphic Designer',
  emergencyContactName: 'Marco Vasquez', emergencyContactPhone: '+1-555-0101',
  emergencyContactRelation: 'Brother',
  primaryDoctorName: 'Dr. Reyna Torres', primaryDoctorSpecialization: 'Neurology',
  admitted: false, followUpRequired: false,
};

export async function fetchMyProfile() {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/patients/me`, {
      headers: getHeaders(), signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(200);
    return { ...SIM_PATIENT_PROFILE };
  }
}

export async function updateMyProfile(updates) {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/patients/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Update failed');
    }
    return await res.json();
  } catch (err) {
    if (!ENABLE_FALLBACK) throw err;
    await delay(300);
    return { ...SIM_PATIENT_PROFILE, ...updates }; // Optimistic update in fallback
  }
}

// ── APPOINTMENTS ───────────────────────────────────────────────────

const SIM_DOCTORS = [
  { id: 2, name: 'Dr. Reyna Torres', specialization: 'Neurology', consultationFee: 150 },
  { id: 3, name: 'Dr. Lucas Chen',   specialization: 'Cardiology', consultationFee: 180 },
  { id: 4, name: 'Dr. Yara Wu',      specialization: 'Trauma Surgery', consultationFee: 200 },
];

const SIM_APPOINTMENTS = [
  { id: 1, doctorName: 'Dr. Reyna Torres', doctorSpecialization: 'Neurology',
    appointmentDate: '2026-08-25', appointmentTime: '10:00:00',
    status: 'CONFIRMED', reason: 'Routine neurological checkup', durationMinutes: 30 },
  { id: 2, doctorName: 'Dr. Lucas Chen', doctorSpecialization: 'Cardiology',
    appointmentDate: '2026-09-02', appointmentTime: '14:30:00',
    status: 'SCHEDULED', reason: 'Cardiac follow-up', durationMinutes: 30 },
  { id: 3, doctorName: 'Dr. Yara Wu', doctorSpecialization: 'Trauma Surgery',
    appointmentDate: '2026-07-15', appointmentTime: '09:00:00',
    status: 'COMPLETED', reason: 'Post-trauma review', durationMinutes: 45 },
];

export async function fetchMyAppointments() {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/appointments`, {
      headers: getHeaders(), signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(200);
    return [...SIM_APPOINTMENTS];
  }
}

export async function fetchDoctors() {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/appointments/doctors`, {
      headers: getHeaders(), signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(150);
    return [...SIM_DOCTORS];
  }
}

export async function bookAppointment({ doctorId, appointmentDate, appointmentTime, reason, notes }) {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/appointments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ doctorId, appointmentDate, appointmentTime, reason, notes }),
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Booking failed');
    return data;
  } catch (err) {
    if (!ENABLE_FALLBACK) throw err;
    await delay(500);
    const doctor = SIM_DOCTORS.find(d => d.id === doctorId) || SIM_DOCTORS[0];
    return {
      id: Date.now(), doctorName: doctor.name, doctorSpecialization: doctor.specialization,
      appointmentDate, appointmentTime, status: 'SCHEDULED', reason, notes, durationMinutes: 30,
    };
  }
}

export async function cancelAppointment(appointmentId, reason) {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Cancel failed');
    return data;
  } catch (err) {
    if (!ENABLE_FALLBACK) throw err;
    await delay(300);
    return { id: appointmentId, status: 'CANCELLED', reason };
  }
}

// ── PRESCRIPTIONS ──────────────────────────────────────────────────

const SIM_PRESCRIPTIONS = [
  { id: 1, medicationName: 'Sertraline', genericName: 'Sertraline HCl', dosage: '50mg',
    frequency: 'Once daily', durationDays: 90, instructions: 'Take with food in the morning.',
    status: 'PRESCRIBED', prescriptionDate: '2026-07-10',
    startDate: '2026-07-10', endDate: '2026-10-08',
    doctorName: 'Dr. Reyna Torres', refillsAllowed: 2, refillsUsed: 0, isControlledSubstance: false },
  { id: 2, medicationName: 'Metoprolol', genericName: 'Metoprolol Tartrate', dosage: '25mg',
    frequency: 'Twice daily', durationDays: 60, instructions: 'Take with or without food.',
    status: 'DISPENSED', prescriptionDate: '2026-06-20',
    startDate: '2026-06-20', endDate: '2026-08-19',
    doctorName: 'Dr. Lucas Chen', refillsAllowed: 1, refillsUsed: 1, isControlledSubstance: false },
];

export async function fetchMyPrescriptions() {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/prescriptions`, {
      headers: getHeaders(), signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(200);
    return [...SIM_PRESCRIPTIONS];
  }
}

// ── MEDICAL RECORDS ────────────────────────────────────────────────

const SIM_MEDICAL_RECORDS = [
  { id: 1, doctorName: 'Dr. Reyna Torres', recordDate: '2026-07-10', recordType: 'CONSULTATION',
    chiefComplaint: 'Persistent headaches and dizziness',
    presentIllness: 'Patient reports recurring headaches for the past 3 weeks, mostly in the morning.',
    assessment: 'Tension headache with possible migraine component.',
    plan: 'Prescribed Sertraline, recommend stress management techniques and follow up in 4 weeks.',
    heartRate: 78, temperature: 36.8, bloodPressureSystolic: 120, bloodPressureDiastolic: 80,
    oxygenSaturation: 98, isConfidential: false },
  { id: 2, doctorName: 'Dr. Lucas Chen', recordDate: '2026-06-20', recordType: 'FOLLOW_UP',
    chiefComplaint: 'Cardiac palpitations', presentIllness: 'Occasional irregular heartbeat.',
    assessment: 'Mild arrhythmia. Benign in nature.',
    plan: 'Continue Metoprolol. Follow-up ECG in 2 months.',
    heartRate: 65, temperature: 36.5, bloodPressureSystolic: 118, bloodPressureDiastolic: 76,
    oxygenSaturation: 99, isConfidential: false },
];

export async function fetchMyMedicalRecords() {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/medical-records`, {
      headers: getHeaders(), signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(200);
    return [...SIM_MEDICAL_RECORDS];
  }
}

export async function fetchMedicalRecordsForPatient(patientId) {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/medical-records/patient/${patientId}`, {
      headers: getHeaders(), signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(200);
    // Return sample records tagged for this patient
    return SIM_MEDICAL_RECORDS.map(r => ({ ...r, patientId }));
  }
}

export async function createMedicalRecord(recordData) {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/medical-records`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(recordData),
      signal: AbortSignal.timeout(6000),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create record');
    return data;
  } catch (err) {
    if (!ENABLE_FALLBACK) throw err;
    await delay(300);
    const newRecord = {
      id: Date.now(),
      recordDate: new Date().toISOString().split('T')[0],
      ...recordData,
    };
    SIM_MEDICAL_RECORDS.unshift(newRecord);
    return newRecord;
  }
}

export async function searchPatients(query) {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/patients/search?query=${encodeURIComponent(query)}`, {
      headers: getHeaders(), signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(150);
    const q = query.toLowerCase();
    return SIM_ALL_PATIENTS.filter(p =>
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.patientId.toLowerCase().includes(q)
    );
  }
}

// ── HIPAA & COMPLIANCE ─────────────────────────────────────────────

const SIM_AUDIT_LOGS = [
  { id: 101, timestamp: '2026-09-18T10:14:22', actorName: 'Dr. Reyna Torres', actorRole: 'DOCTOR', actionType: 'VIEW_MEDICAL_RECORD', patientId: 'CLV-00001', resourceType: 'MedicalRecord', ipAddress: '192.168.1.104', status: 'SUCCESS', details: 'Pre-consultation neurological history review' },
  { id: 102, timestamp: '2026-09-18T09:45:10', actorName: 'Nurse Aiko Sato', actorRole: 'NURSE', actionType: 'VIEW_PATIENT_VITALS', patientId: 'CLV-00001', resourceType: 'BioPod', ipAddress: '192.168.1.112', status: 'SUCCESS', details: 'Morning bio-telemetry ward check' },
  { id: 103, timestamp: '2026-09-18T08:30:00', actorName: 'Dr. Admin Director', actorRole: 'ADMIN', actionType: 'EXPORT_AUDIT_REPORT', patientId: null, resourceType: 'AuditLog', ipAddress: '10.0.0.5', status: 'SUCCESS', details: 'Quarterly HIPAA security compliance audit log review' },
  { id: 104, timestamp: '2026-09-17T16:20:45', actorName: 'Dr. Lucas Chen', actorRole: 'DOCTOR', actionType: 'CREATE_PRESCRIPTION', patientId: 'CLV-00001', resourceType: 'Prescription', ipAddress: '192.168.1.108', status: 'SUCCESS', details: 'Issued refill for Metoprolol 25mg' },
  { id: 105, timestamp: '2026-09-17T14:10:12', actorName: 'Aria Vasquez', actorRole: 'PATIENT', actionType: 'PATIENT_SELF_EHR_VIEW', patientId: 'CLV-00001', resourceType: 'MedicalRecord', ipAddress: '127.0.0.1', status: 'SUCCESS', details: 'Patient accessed self-service medical history portal' }
];

export async function fetchAuditLogs(patientId) {
  try {
    const url = patientId
      ? `${API_BASE_URL}/api/v1/compliance/audit-logs?patientId=${encodeURIComponent(patientId)}`
      : `${API_BASE_URL}/api/v1/compliance/audit-logs`;
    const res = await fetch(url, { headers: getHeaders(), signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(200);
    if (patientId) return SIM_AUDIT_LOGS.filter(l => l.patientId === patientId);
    return [...SIM_AUDIT_LOGS];
  }
}

export async function fetchComplianceStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/compliance/status`, { headers: getHeaders(), signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    return {
      hipaaSecurityRule: 'ENFORCED',
      phiEncryptionAtRest: 'AES-256',
      auditLoggingStatus: 'ACTIVE',
      transmissionSecurity: 'TLS-1.3 / HTTPS',
      roleBasedAccessControl: 'SPRING_SECURITY_6',
      lastAudited: new Date().toISOString(),
      emergencyAccessProtocol: 'ENABLED'
    };
  }
}

// ── ALL PATIENTS (for admin/doctor/nurse views) ────────────────────

const SIM_ALL_PATIENTS = [
  { id: 1, patientId: 'CLV-00421', firstName: 'Aria', lastName: 'Vasquez', age: 32, bloodGroup: 'O+',
    primaryDoctorName: 'Dr. R. Torres', primaryDoctorSpecialization: 'Neurology',
    email: 'aria.vasquez@email.com', admitted: true, followUpRequired: true },
  { id: 2, patientId: 'CLV-00387', firstName: 'Marcus', lastName: 'Chen', age: 45, bloodGroup: 'A-',
    primaryDoctorName: 'Dr. L. Chen', primaryDoctorSpecialization: 'Cardiology',
    email: 'marcus.chen@email.com', admitted: true, followUpRequired: false },
  { id: 3, patientId: 'CLV-00409', firstName: 'Mira', lastName: 'Patel', age: 28, bloodGroup: 'B+',
    primaryDoctorName: 'Dr. Y. Wu', primaryDoctorSpecialization: 'Trauma Surgery',
    email: 'mira.patel@email.com', admitted: true, followUpRequired: true },
  { id: 4, patientId: 'CLV-00366', firstName: 'James', lastName: 'Okafor', age: 50, bloodGroup: 'AB-',
    primaryDoctorName: 'Dr. A. Osei', primaryDoctorSpecialization: 'Cardiology',
    email: 'james.okafor@email.com', admitted: false, followUpRequired: false },
  { id: 5, patientId: 'CLV-00391', firstName: 'Lena', lastName: 'Müller', age: 37, bloodGroup: 'O-',
    primaryDoctorName: 'Dr. R. Torres', primaryDoctorSpecialization: 'Neurology',
    email: 'lena.muller@email.com', admitted: true, followUpRequired: true },
  { id: 6, patientId: 'CLV-00402', firstName: 'Yusuf', lastName: 'Al-Rashid', age: 29, bloodGroup: 'A+',
    primaryDoctorName: 'Dr. L. Chen', primaryDoctorSpecialization: 'Pulmonology',
    email: 'yusuf.alrashid@email.com', admitted: true, followUpRequired: false },
];

export async function fetchAllPatients() {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/patients`, {
      headers: getHeaders(), signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(200);
    return [...SIM_ALL_PATIENTS];
  }
}

// ── STAFF (for admin view) ─────────────────────────────────────────

const SIM_STAFF = [
  { id: 2, firstName: 'Reyna', lastName: 'Torres', email: 'doctor@cliniva.io', role: 'DOCTOR',
    specialization: 'Neurology', experienceYears: 12, isActive: true },
  { id: 3, firstName: 'Aiko', lastName: 'Sato', email: 'nurse@cliniva.io', role: 'NURSE',
    certification: 'RN, BSN', isActive: true },
  { id: 5, firstName: 'Lucas', lastName: 'Chen', email: 'lchen@cliniva.io', role: 'DOCTOR',
    specialization: 'Cardiology', experienceYears: 8, isActive: true },
  { id: 6, firstName: 'Amara', lastName: 'Osei', email: 'aosei@cliniva.io', role: 'DOCTOR',
    specialization: 'Cardiology', experienceYears: 15, isActive: true },
];

export async function fetchStaff() {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/staff`, {
      headers: getHeaders(), signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(200);
    return [...SIM_STAFF];
  }
}

// ── LEGACY PATIENTS ───────────────────────────────────────────────
export async function fetchPatients() {
  try {
    const res = await fetch(`${API_BASE_URL}/hms/api/patients`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(150);
    return [...SIM.patients];
  }
}

// ── BIO-PODS ───────────────────────────────────────────────
export async function fetchBioPods() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/clinical/wards/pods`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    // Normalise backend field names → frontend field names
    return data.map(p => ({
      id:       p.podCode,
      status:   (p.podStatus || '').toLowerCase(),
      patient:  p.patientName,
      doctor:   p.attendingPhysician,
      ward:     p.wardName,
      severity: p.clinicalSeverity,
    }));
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(200);
    SIM.tick(); // mutate state on each poll
    return SIM.pods.map(p => ({ ...p })); // return a copy
  }
}

// ── PROCEDURES ─────────────────────────────────────────────
export async function fetchProcedures() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/clinical/procedures/scheduled`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    // Normalise backend field names → frontend field names
    return data.map(p => ({
      time:     p.scheduledTime,
      patient:  p.patientName,
      id:       p.patientClinicalId,
      procedure: p.procedureName,
      doctor:   p.attendingPhysician,
      pod:      p.podCode,
      type:     p.procedureType,
      duration: p.estimatedDuration,
      status:   p.procedureStatus,
    }));
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(150);
    return [...SIM.procedures];
  }
}

// ── LIVE TELEMETRY (REST polling fallback) ─────────────────
export async function fetchTelemetry(patientId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/telemetry/vitals/${patientId}/latest`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Failed');
    const d = await res.json();
    return {
      heartRate:   d.heartRate,
      bloodOxygen: d.bloodOxygen,
      temperature: d.temperature,
      gForce:      d.gForce,
      heartData:   d.heartData,
      tempData:    d.tempData,
    };
  } catch {
    if (!ENABLE_FALLBACK) throw new Error('Backend unavailable');
    await delay(100);
    return SIM.getTelemetry(patientId);
  }
}

// ── LIVE TELEMETRY (SSE push stream) ──────────────────────
/**
 * Opens an SSE connection to /api/v1/telemetry/vitals/{patientId}/stream.
 * The backend pushes a "vitals" event every 2 seconds.
 *
 * Usage:
 *   const source = connectTelemetryStream('CLV-00421',
 *     (vitals) => setVitals(vitals),
 *     (err)    => console.error(err)
 *   );
 *   // Cleanup: source.close();
 *
 * @returns EventSource instance (call .close() to disconnect)
 */
export function connectTelemetryStream(patientId, onVitals, onError) {
  const url = `${API_BASE_URL}/api/v1/telemetry/vitals/${patientId}/stream`;
  const source = new EventSource(url, { withCredentials: true });

  source.addEventListener('vitals', (event) => {
    try {
      const data = JSON.parse(event.data);
      onVitals({
        heartRate:   data.heartRate,
        bloodOxygen: data.bloodOxygen,
        temperature: data.temperature,
        gForce:      data.gForce,
        heartData:   data.heartData   || [],
        tempData:    data.tempData    || [],
      });
    } catch (e) {
      if (onError) onError(e);
    }
  });

  source.onerror = (e) => {
    if (onError) onError(e);
  };

  return source;
}

// ═══════════════════════════════════════════════════════════
//  BED MANAGEMENT — Admit / Discharge / Transfer
// ═══════════════════════════════════════════════════════════

const BED_BASE = `${API_BASE_URL}/api/v1/clinical/wards/pods`;

/**
 * POST /api/v1/clinical/wards/pods/{podId}/admit
 * Admits a patient to an empty pod.
 */
export async function admitPatient(podId, { patientName, patientClinicalId, attendingPhysician, wardName, clinicalSeverity }) {
  const res = await fetch(`${BED_BASE}/${podId}/admit`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ patientName, patientClinicalId, attendingPhysician, wardName, clinicalSeverity }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Admission failed');
  }
  return res.json();
}

/**
 * POST /api/v1/clinical/wards/pods/{podId}/discharge
 * Discharges the patient from a pod.
 */
export async function dischargePatient(podId) {
  const res = await fetch(`${BED_BASE}/${podId}/discharge`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Discharge failed');
  }
  return res.json();
}

/**
 * POST /api/v1/clinical/wards/pods/{podId}/transfer
 * Transfers patient from podId to targetPodCode.
 */
export async function transferPatient(fromPodId, targetPodCode) {
  const res = await fetch(`${BED_BASE}/${fromPodId}/transfer`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ targetPodCode }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Transfer failed');
  }
  return res.json();
}
