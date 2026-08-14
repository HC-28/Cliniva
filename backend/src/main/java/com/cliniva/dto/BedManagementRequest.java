package com.cliniva.dto;

/**
 * Cliniva Platform — BedManagementRequest
 * Payload for the Admit, Discharge, and Transfer operations.
 *
 * Admit:
 *   { "action": "ADMIT", "patientName": "John Doe", "patientClinicalId": "CLV-00499",
 *     "attendingPhysician": "Dr. R. Torres", "wardName": "Neuro", "clinicalSeverity": "stable" }
 *
 * Discharge:
 *   { "action": "DISCHARGE" }
 *
 * Transfer:
 *   { "action": "TRANSFER", "targetPodCode": "B-2" }
 */
public class BedManagementRequest {

    private String action;            // ADMIT | DISCHARGE | TRANSFER
    private String patientName;
    private String patientClinicalId;
    private String attendingPhysician;
    private String wardName;
    private String clinicalSeverity;  // stable | warning | critical
    private String targetPodCode;     // for TRANSFER only

    public String getAction()              { return action; }
    public void   setAction(String v)      { this.action = v; }

    public String getPatientName()              { return patientName; }
    public void   setPatientName(String v)      { this.patientName = v; }

    public String getPatientClinicalId()              { return patientClinicalId; }
    public void   setPatientClinicalId(String v)      { this.patientClinicalId = v; }

    public String getAttendingPhysician()              { return attendingPhysician; }
    public void   setAttendingPhysician(String v)      { this.attendingPhysician = v; }

    public String getWardName()              { return wardName; }
    public void   setWardName(String v)      { this.wardName = v; }

    public String getClinicalSeverity()              { return clinicalSeverity; }
    public void   setClinicalSeverity(String v)      { this.clinicalSeverity = v; }

    public String getTargetPodCode()              { return targetPodCode; }
    public void   setTargetPodCode(String v)      { this.targetPodCode = v; }
}
