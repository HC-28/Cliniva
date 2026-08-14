package com.cliniva.dto;

import com.cliniva.entity.Appointment;

public class AppointmentDto {
    private Long id;
    private String patientName;
    private String patientId;
    private String doctorName;
    private String doctorSpecialization;
    private String appointmentDate;
    private String appointmentTime;
    private String status;
    private String reason;
    private String notes;
    private String diagnosis;
    private Integer durationMinutes;
    private boolean isEmergency;

    public static AppointmentDto from(Appointment a) {
        AppointmentDto dto = new AppointmentDto();
        dto.id = a.getId();
        if (a.getPatient() != null && a.getPatient().getUser() != null) {
            dto.patientName = a.getPatient().getUser().getFullName();
            dto.patientId = a.getPatient().getPatientId();
        }
        if (a.getDoctor() != null) {
            dto.doctorName = a.getDoctor().getFullName();
            dto.doctorSpecialization = a.getDoctor().getSpecialization();
        }
        dto.appointmentDate = a.getAppointmentDate() != null ? a.getAppointmentDate().toString() : null;
        dto.appointmentTime = a.getAppointmentTime() != null ? a.getAppointmentTime().toString() : null;
        dto.status = a.getStatus() != null ? a.getStatus().name() : null;
        dto.reason = a.getReason();
        dto.notes = a.getNotes();
        dto.diagnosis = a.getDiagnosis();
        dto.durationMinutes = a.getDurationMinutes();
        dto.isEmergency = Boolean.TRUE.equals(a.getIsEmergency());
        return dto;
    }

    public Long getId() { return id; }
    public String getPatientName() { return patientName; }
    public String getPatientId() { return patientId; }
    public String getDoctorName() { return doctorName; }
    public String getDoctorSpecialization() { return doctorSpecialization; }
    public String getAppointmentDate() { return appointmentDate; }
    public String getAppointmentTime() { return appointmentTime; }
    public String getStatus() { return status; }
    public String getReason() { return reason; }
    public String getNotes() { return notes; }
    public String getDiagnosis() { return diagnosis; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public boolean isEmergency() { return isEmergency; }
}
