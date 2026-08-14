-- Persistent Seed Data for PostgreSQL
-- Password hash: BCrypt for 'password' -> $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

-- 1. Insert Hardcoded Staff (ADMIN, DOCTOR, NURSE)
-- Using ON CONFLICT (email) DO NOTHING to ensure idempotence across restarts
INSERT INTO users (first_name, last_name, email, password, phone_number, role, is_verified, is_active, is_deleted, login_attempts, created_at, updated_at) 
VALUES
('Admin', 'System', 'admin@hms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0100', 'ADMIN', TRUE, TRUE, FALSE, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dr. John', 'Doe', 'doctor@hms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0200', 'DOCTOR', TRUE, TRUE, FALSE, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nurse Jane', 'Smith', 'nurse@hms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0300', 'NURSE', TRUE, TRUE, FALSE, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Sample Patient (Optional, patients will register themselves)
INSERT INTO users (first_name, last_name, email, password, phone_number, role, is_verified, is_active, is_deleted, login_attempts, created_at, updated_at) 
VALUES
('Patient', 'Test', 'patient@hms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0400', 'PATIENT', TRUE, TRUE, FALSE, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Departments
-- Using ON CONFLICT (id) DO NOTHING isn't possible here without IDs, so we use name if unique or just rely on manual management
-- For simplicity in this env, we use simple inserts or check existence
INSERT INTO departments (id, department_name, description, location, total_beds, available_beds, doctors_count, nurses_count, is_emergency_department, is_active_department, is_active, is_deleted)
SELECT 1, 'General Medicine', 'General medical care and consultations', 'Building A, Floor 2', 20, 18, 5, 10, FALSE, TRUE, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE id = 1);

INSERT INTO departments (id, department_name, description, location, total_beds, available_beds, doctors_count, nurses_count, is_emergency_department, is_active_department, is_active, is_deleted)
SELECT 2, 'Surgery', 'Surgical procedures and recovery', 'Building B, Floor 3', 15, 12, 8, 12, FALSE, TRUE, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE id = 2);

-- 4. Sample Patient Profile (Links to patient@hms.com)
INSERT INTO patients (id, user_id, patient_id, blood_group, marital_status, primary_doctor_id, department_id, follow_up_required, is_active, is_deleted)
SELECT 1, (SELECT id FROM users WHERE email = 'patient@hms.com'), 'PAT001', 'O+', 'SINGLE', (SELECT id FROM users WHERE email = 'doctor@hms.com'), 1, FALSE, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE id = 1);

-- 5. Sample Appointment
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, appointment_time, status, reason, is_emergency, is_active, is_deleted)
SELECT 1, 1, (SELECT id FROM users WHERE email = 'doctor@hms.com'), '2025-11-10', '10:00:00', 'SCHEDULED', 'Routine checkup', FALSE, TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE id = 1);

-- ══════════════════════════════════════════════════════════════
--  6. Bio-Pod Grid Seed Data (12 pods across 3 wards)
--     pod_status: OCCUPIED | EMPTY | STABILIZING
--     clinical_severity: stable | warning | critical | (null for empty)
-- ══════════════════════════════════════════════════════════════
INSERT INTO cliniva.bio_pods (pod_code, pod_status, ward_name, patient_name, attending_physician, clinical_severity, is_active, is_deleted)
SELECT * FROM (VALUES
  ('A-1', 'OCCUPIED',    'Neuro',   'Aria Vasquez',    'Dr. R. Torres', 'stable',   TRUE, FALSE),
  ('A-2', 'EMPTY',       'Neuro',   NULL,              NULL,            NULL,        TRUE, FALSE),
  ('A-3', 'OCCUPIED',    'Cardiac', 'James Okafor',    'Dr. A. Osei',   'stable',   TRUE, FALSE),
  ('A-4', 'STABILIZING', 'Trauma',  'Mira Patel',      'Dr. Y. Wu',     'critical', TRUE, FALSE),
  ('B-1', 'OCCUPIED',    'Cardiac', 'Marcus Chen',     'Dr. L. Chen',   'stable',   TRUE, FALSE),
  ('B-2', 'EMPTY',       'Ortho',   NULL,              NULL,            NULL,        TRUE, FALSE),
  ('B-3', 'OCCUPIED',    'Neuro',   'Lena Müller',     'Dr. R. Torres', 'stable',   TRUE, FALSE),
  ('B-4', 'STABILIZING', 'Pulmo',   'Yusuf Al-Rashid', 'Dr. L. Chen',   'warning',  TRUE, FALSE),
  ('C-1', 'OCCUPIED',    'Ortho',   'Sofia Reyes',     'Dr. Y. Wu',     'stable',   TRUE, FALSE),
  ('C-2', 'OCCUPIED',    'Neuro',   'Aiden Park',      'Dr. R. Torres', 'stable',   TRUE, FALSE),
  ('C-3', 'EMPTY',       'Cardiac', NULL,              NULL,            NULL,        TRUE, FALSE),
  ('C-4', 'OCCUPIED',    'Trauma',  'Chiara Rossi',    'Dr. A. Osei',   'stable',   TRUE, FALSE)
) AS v(pod_code, pod_status, ward_name, patient_name, attending_physician, clinical_severity, is_active, is_deleted)
WHERE NOT EXISTS (SELECT 1 FROM cliniva.bio_pods WHERE pod_code = v.pod_code);

-- ══════════════════════════════════════════════════════════════
--  7. Clinical Procedures Schedule (Today's date for demo)
-- ══════════════════════════════════════════════════════════════
INSERT INTO cliniva.clinical_procedures (patient_name, patient_clinical_id, procedure_name, procedure_type, attending_physician, pod_code, scheduled_time, estimated_duration, procedure_status, scheduled_date, is_active, is_deleted)
SELECT * FROM (VALUES
  ('Aria Vasquez',    'CLV-00421', 'Neuro-Cognitive Scan',          'neuro',   'Dr. R. Torres', 'A-1', '08:30', '45min', 'in-progress', CURRENT_DATE, TRUE, FALSE),
  ('Marcus Chen',     'CLV-00387', 'Cardiac Bio-Impedance',         'cardiac', 'Dr. L. Chen',   'B-1', '09:15', '30min', 'upcoming',    CURRENT_DATE, TRUE, FALSE),
  ('Mira Patel',      'CLV-00409', 'Trauma Stabilization Protocol', 'trauma',  'Dr. Y. Wu',     'A-4', '10:00', '60min', 'upcoming',    CURRENT_DATE, TRUE, FALSE),
  ('James Okafor',    'CLV-00366', 'Pulmonary Function Analysis',   'pulmo',   'Dr. A. Osei',   'A-3', '11:30', '20min', 'upcoming',    CURRENT_DATE, TRUE, FALSE),
  ('Lena Müller',     'CLV-00391', 'Orthopedic Pressure Mapping',   'ortho',   'Dr. R. Torres', 'B-3', '13:00', '25min', 'upcoming',    CURRENT_DATE, TRUE, FALSE),
  ('Yusuf Al-Rashid', 'CLV-00402', 'Serology & Bio-Panel',          'lab',     'Dr. L. Chen',   'B-4', '14:45', '15min', 'upcoming',    CURRENT_DATE, TRUE, FALSE)
) AS v(patient_name, patient_clinical_id, procedure_name, procedure_type, attending_physician, pod_code, scheduled_time, estimated_duration, procedure_status, scheduled_date, is_active, is_deleted)
WHERE NOT EXISTS (SELECT 1 FROM cliniva.clinical_procedures WHERE scheduled_date = CURRENT_DATE AND patient_clinical_id = v.patient_clinical_id);