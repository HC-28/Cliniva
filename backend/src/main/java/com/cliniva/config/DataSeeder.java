package com.cliniva.config;

import com.cliniva.entity.*;
import com.cliniva.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DataSeeder — Populates demo accounts, multiple clinical personas,
 * EHR medical records, prescriptions, appointments, and HIPAA audit controls.
 * Designed with defensive error isolation so that any constraint violation
 * in one section never prevents the application from booting.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      PatientRepository patientRepository,
                      MedicalRecordRepository medicalRecordRepository,
                      AppointmentRepository appointmentRepository,
                      PrescriptionRepository prescriptionRepository,
                      AuditLogRepository auditLogRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("DataSeeder: Initializing clinical system data...");

        User admin = null;
        User doctorTorres = null;
        User doctorChen = null;
        User doctorWu = null;
        User nurseAiko = null;
        Patient patientAria = null;
        Patient patientMarcus = null;
        Patient patientMira = null;

        // 1. Seed Users
        try {
            admin = findOrSeedUser("Admin", "Director", "admin@cliniva.io", "admin123", User.UserRole.ADMIN, null, null);
            doctorTorres = findOrSeedUser("Reyna", "Torres", "doctor@cliniva.io", "doctor123", User.UserRole.DOCTOR, "Neurology", new BigDecimal("150.00"));
            doctorChen = findOrSeedUser("Lucas", "Chen", "chen@cliniva.io", "chen123", User.UserRole.DOCTOR, "Cardiology", new BigDecimal("180.00"));
            doctorWu = findOrSeedUser("Yara", "Wu", "wu@cliniva.io", "wu123", User.UserRole.DOCTOR, "Trauma Surgery", new BigDecimal("200.00"));
            nurseAiko = findOrSeedUser("Aiko", "Sato", "nurse@cliniva.io", "nurse123", User.UserRole.NURSE, null, null);

            User patientAriaUser = findOrSeedUser("Aria", "Vasquez", "patient@cliniva.io", "patient123", User.UserRole.PATIENT, null, null);
            User patientMarcusUser = findOrSeedUser("Marcus", "Chen", "marcus@cliniva.io", "marcus123", User.UserRole.PATIENT, null, null);
            User patientMiraUser = findOrSeedUser("Mira", "Patel", "mira@cliniva.io", "mira123", User.UserRole.PATIENT, null, null);

            // 2. Patient Profiles
            patientAria = findOrSeedPatient(patientAriaUser, "CLV-00001", doctorTorres, "O+", 29, 165, 58, "Penicillin");
            patientMarcus = findOrSeedPatient(patientMarcusUser, "CLV-00387", doctorChen, "A-", 45, 178, 76, "Sulfa drugs");
            patientMira = findOrSeedPatient(patientMiraUser, "CLV-00409", doctorWu, "B+", 28, 162, 54, "None");
            log.info("DataSeeder: Clinical users and patients initialized.");
        } catch (Exception e) {
            log.warn("DataSeeder: User/Patient seeding warning: {}", e.getMessage());
        }

        // 3. Seed Medical Records
        try {
            if (medicalRecordRepository.count() == 0 && patientAria != null && doctorTorres != null) {
                log.info("DataSeeder: Seeding EHR medical records for patient Aria Vasquez...");

                createRecord(patientAria, doctorTorres, LocalDate.of(2026, 7, 10), MedicalRecord.RecordType.CONSULTATION,
                        "Persistent tension headaches and light-induced migraine",
                        "Patient reports recurring cephalalgia lasting 3-4 hours, aggravated by monitor glare.",
                        "Tension headache with recurring migraine episodes. Normal neurological reflexes.",
                        "Prescribed Sertraline 50mg daily, recommend ergonomic display filter, sleep routine adjustment.",
                        "Return for neuro checkup in 4 weeks.", 76, 36.8, 120, 80, 98.5, false);

                createRecord(patientAria, doctorChen != null ? doctorChen : doctorTorres, LocalDate.of(2026, 6, 20), MedicalRecord.RecordType.FOLLOW_UP,
                        "Benign cardiac palpitations during high-exertion training",
                        "Occasional premature atrial beats noticed after endurance cycling.",
                        "Sinus arrhythmia with benign PVCs. Echocardiogram shows healthy ejection fraction (65%).",
                        "Continue low-dose Metoprolol 25mg twice daily. Avoid excessive caffeine.",
                        "Repeat 12-lead ECG in 3 months.", 68, 36.6, 118, 76, 99.0, false);

                createRecord(patientAria, doctorTorres, LocalDate.of(2026, 5, 14), MedicalRecord.RecordType.EMERGENCY,
                        "Acute cervical muscle spasm following motor accident",
                        "Rear-end minor collision. Soreness across upper trapezius and sternocleidomastoid.",
                        "Grade I whiplash without neural deficit or bony injury.",
                        "Short course NSAIDs, physical therapy referral, hot compress application.",
                        "Follow up if numbness or tingling develops in upper extremities.", 84, 37.0, 124, 82, 98.0, false);

                if (patientMarcus != null && doctorChen != null) {
                    createRecord(patientMarcus, doctorChen, LocalDate.of(2026, 8, 1), MedicalRecord.RecordType.CONSULTATION,
                            "Hypertensive review and lipid panel evaluation",
                            "Routine 6-month cardiovascular risk reassessment.",
                            "Stage 1 Essential Hypertension, controlled under medication.",
                            "Continue Amlodipine 5mg and Atorvastatin 10mg. Maintain low sodium diet.",
                            "Follow up in 6 months with fasting lipid panel.", 72, 36.7, 130, 84, 98.0, false);
                }
            }
        } catch (Exception e) {
            log.warn("DataSeeder: Medical record seeding warning: {}", e.getMessage());
        }

        // 4. Seed Appointments
        try {
            if (appointmentRepository.count() == 0 && patientAria != null && doctorTorres != null) {
                log.info("DataSeeder: Seeding appointments...");
                createAppointment(patientAria, doctorTorres, LocalDate.of(2026, 8, 25), LocalTime.of(10, 0),
                        Appointment.AppointmentStatus.CONFIRMED, "Neurology Follow-up Consultation", 30);
                if (doctorChen != null) {
                    createAppointment(patientAria, doctorChen, LocalDate.of(2026, 9, 5), LocalTime.of(14, 30),
                            Appointment.AppointmentStatus.SCHEDULED, "Cardiovascular Review & ECG Follow-up", 30);
                }
                if (doctorWu != null) {
                    createAppointment(patientAria, doctorWu, LocalDate.of(2026, 7, 15), LocalTime.of(9, 0),
                            Appointment.AppointmentStatus.COMPLETED, "Post-trauma Cervical Evaluation", 45);
                }
            }
        } catch (Exception e) {
            log.warn("DataSeeder: Appointment seeding warning: {}", e.getMessage());
        }

        // 5. Seed Prescriptions
        try {
            if (prescriptionRepository.count() == 0 && patientAria != null && doctorTorres != null) {
                log.info("DataSeeder: Seeding prescriptions...");
                createPrescription(patientAria, doctorTorres, "Sertraline", "Sertraline HCl", "50mg",
                        "Once daily", 90, "Take with food each morning.", Prescription.PrescriptionStatus.PRESCRIBED, 2);
                if (doctorChen != null) {
                    createPrescription(patientAria, doctorChen, "Metoprolol", "Metoprolol Tartrate", "25mg",
                            "Twice daily", 60, "Take morning and evening with water.", Prescription.PrescriptionStatus.DISPENSED, 1);
                    createPrescription(patientAria, doctorChen, "Atorvastatin", "Atorvastatin Calcium", "10mg",
                            "Once at night", 90, "Take before bedtime.", Prescription.PrescriptionStatus.DISPENSED, 3);
                }
            }
        } catch (Exception e) {
            log.warn("DataSeeder: Prescription seeding warning: {}", e.getMessage());
        }

        // 6. Seed HIPAA Compliance Audit Logs
        try {
            if (auditLogRepository.count() == 0) {
                log.info("DataSeeder: Seeding HIPAA compliance audit logs...");
                if (doctorTorres != null) {
                    auditLogRepository.save(new AuditLog(doctorTorres.getId(), doctorTorres.getFullName(), doctorTorres.getEmail(),
                            "DOCTOR", "VIEW_MEDICAL_RECORD", "CLV-00001", "MedicalRecord", "1", "192.168.1.104", "SUCCESS",
                            "Attending doctor reviewed neurological history before consultation"));
                }
                if (nurseAiko != null) {
                    auditLogRepository.save(new AuditLog(nurseAiko.getId(), nurseAiko.getFullName(), nurseAiko.getEmail(),
                            "NURSE", "VIEW_PATIENT_VITALS", "CLV-00001", "BioPod", "A-1", "192.168.1.112", "SUCCESS",
                            "Routine morning bio-telemetry check in Neuro Ward"));
                }
                if (admin != null) {
                    auditLogRepository.save(new AuditLog(admin.getId(), admin.getFullName(), admin.getEmail(),
                            "ADMIN", "EXPORT_AUDIT_REPORT", null, "AuditLog", "ALL", "10.0.0.5", "SUCCESS",
                            "Quarterly HIPAA security compliance audit log review"));
                }
                if (doctorChen != null) {
                    auditLogRepository.save(new AuditLog(doctorChen.getId(), doctorChen.getFullName(), doctorChen.getEmail(),
                            "DOCTOR", "CREATE_PRESCRIPTION", "CLV-00001", "Prescription", "2", "192.168.1.108", "SUCCESS",
                            "Issued refill for Metoprolol 25mg"));
                }
            }
        } catch (Exception e) {
            log.warn("DataSeeder: Audit log seeding warning: {}", e.getMessage());
        }

        log.info("DataSeeder: Completed startup data initialization.");
    }

    private User findOrSeedUser(String firstName, String lastName, String email, String password,
                                User.UserRole role, String specialization, BigDecimal fee) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setFirstName(firstName);
            u.setLastName(lastName);
            u.setEmail(email);
            u.setPassword(passwordEncoder.encode(password));
            u.setRole(role);
            u.setIsVerified(true);
            u.setIsActive(true);
            if (specialization != null) u.setSpecialization(specialization);
            if (fee != null) u.setConsultationFee(fee);
            return userRepository.save(u);
        });
    }

    private Patient findOrSeedPatient(User user, String patientId, User doctor, String bloodGroup,
                                      int age, int height, int weight, String allergies) {
        Patient existing = patientRepository.findByPatientId(patientId);
        if (existing != null) return existing;

        Patient p = new Patient();
        p.setUser(user);
        p.setPatientId(patientId);
        p.setPrimaryDoctor(doctor);
        p.setBloodGroup(bloodGroup);
        if (user != null) {
            user.setDateOfBirth(LocalDate.now().minusYears(age));
            userRepository.save(user);
        }
        p.setHeightCm((double) height);
        p.setWeightKg((double) weight);
        p.setAllergies(allergies);
        p.setIsActive(true);
        p.setEmergencyContactName("Marco Vasquez");
        p.setEmergencyContactPhone("+1-555-0101");
        p.setEmergencyContactRelation("Brother");
        return patientRepository.save(p);
    }

    private void createRecord(Patient patient, User doctor, LocalDate date, MedicalRecord.RecordType type,
                              String chiefComplaint, String presentIllness, String assessment,
                              String plan, String followUp, int hr, double temp, int sbp, int dbp, double spo2, boolean confidential) {
        MedicalRecord r = new MedicalRecord();
        r.setPatient(patient);
        r.setDoctor(doctor);
        r.setRecordDate(date);
        r.setRecordType(type);
        r.setChiefComplaint(chiefComplaint);
        r.setPresentIllness(presentIllness);
        r.setAssessment(assessment);
        r.setPlan(plan);
        r.setFollowUpInstructions(followUp);
        r.setHeartRate(hr);
        r.setTemperature(temp);
        r.setBloodPressureSystolic(sbp);
        r.setBloodPressureDiastolic(dbp);
        r.setOxygenSaturation(spo2);
        r.setIsConfidential(confidential);
        medicalRecordRepository.save(r);
    }

    private void createAppointment(Patient patient, User doctor, LocalDate date, LocalTime time,
                                   Appointment.AppointmentStatus status, String reason, int duration) {
        Appointment a = new Appointment();
        a.setPatient(patient);
        a.setDoctor(doctor);
        a.setAppointmentDate(date);
        a.setAppointmentTime(time);
        a.setStatus(status);
        a.setReason(reason);
        a.setDurationMinutes(duration);
        appointmentRepository.save(a);
    }

    private void createPrescription(Patient patient, User doctor, String medName, String genName,
                                    String dosage, String freq, int days, String instructions,
                                    Prescription.PrescriptionStatus status, int refills) {
        Prescription p = new Prescription();
        p.setPatient(patient);
        p.setDoctor(doctor);
        p.setMedicationName(medName);
        p.setGenericName(genName);
        p.setDosage(dosage);
        p.setFrequency(freq);
        p.setDurationDays(days);
        p.setInstructions(instructions);
        p.setStatus(status);
        p.setPrescriptionDate(LocalDate.now().minusDays(15));
        p.setStartDate(LocalDate.now().minusDays(15));
        p.setEndDate(LocalDate.now().plusDays(days - 15));
        p.setRefillsAllowed(refills);
        p.setRefillsUsed(0);
        p.setPrescribedQuantity(days);
        p.setTotalQuantity(days);
        p.setQuantityPerDose(1);
        p.setDispensedQuantity(days);
        prescriptionRepository.save(p);
    }
}
