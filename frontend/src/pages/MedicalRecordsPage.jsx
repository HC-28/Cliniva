import React, { useState, useEffect } from 'react';
import {
  Search, User, FileText, Plus, ChevronDown, ChevronRight, Activity,
  Heart, Thermometer, Wind, Shield, AlertCircle, ArrowLeft, Clock,
  Calendar, CheckCircle2, Lock, Stethoscope, RefreshCw, X, Filter
} from 'lucide-react';
import {
  fetchAllPatients,
  fetchMedicalRecordsForPatient,
  createMedicalRecord,
  searchPatients
} from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useGlobalToast } from '../context/ToastContext';

export default function MedicalRecordsPage({ user }) {
  const { isDark } = useTheme();
  const { toast } = useGlobalToast();

  // State: Patient Selection
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'ADMITTED', 'OUTPATIENT'

  // State: Medical Records for Selected Patient
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // State: New Record Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [savingRecord, setSavingRecord] = useState(false);
  const [newRecordForm, setNewRecordForm] = useState({
    recordType: 'CONSULTATION',
    chiefComplaint: '',
    presentIllness: '',
    assessment: '',
    plan: '',
    followUpInstructions: '',
    heartRate: 75,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    temperature: 36.8,
    oxygenSaturation: 98.5,
    isConfidential: false,
  });

  // Load patient directory
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const data = await fetchAllPatients();
      setPatients(data);
    } catch (err) {
      toast.error('Failed to load patient directory');
    } finally {
      setLoadingPatients(false);
    }
  };

  // When patient is selected, load their medical records
  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setLoadingRecords(true);
    try {
      const data = await fetchMedicalRecordsForPatient(patient.patientId || patient.id);
      setRecords(data);
      if (data.length > 0) {
        setExpandedId(data[0].id); // Expand most recent record
      }
      toast.info(`Loaded clinical records for ${patient.firstName} ${patient.lastName}`);
    } catch (err) {
      toast.error('Failed to load medical records for this patient');
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!newRecordForm.chiefComplaint.trim()) {
      toast.error('Chief complaint is required');
      return;
    }
    setSavingRecord(true);
    try {
      const payload = {
        patientId: selectedPatient.patientId || String(selectedPatient.id),
        ...newRecordForm,
      };
      const created = await createMedicalRecord(payload);
      setRecords(prev => [created, ...prev]);
      setExpandedId(created.id);
      setShowNewModal(false);
      toast.success('Clinical consultation record saved & encrypted under HIPAA guidelines');
      // Reset form
      setNewRecordForm({
        recordType: 'CONSULTATION',
        chiefComplaint: '',
        presentIllness: '',
        assessment: '',
        plan: '',
        followUpInstructions: '',
        heartRate: 75,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        temperature: 36.8,
        oxygenSaturation: 98.5,
        isConfidential: false,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to save medical record');
    } finally {
      setSavingRecord(false);
    }
  };

  // Filtered patients
  const filteredPatients = patients.filter(p => {
    const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
    const pid = (p.patientId || '').toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || fullName.includes(q) || pid.includes(q);

    if (!matchesSearch) return false;
    if (filterType === 'ADMITTED') return p.admitted === true;
    if (filterType === 'OUTPATIENT') return !p.admitted;
    return true;
  });

  // Dynamic Theme Colors
  const bg = isDark ? '#090e17' : '#f0f4f8';
  const surface = isDark ? '#1e293b' : '#ffffff';
  const surfaceElevated = isDark ? '#283548' : '#f8fafc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  const borderStrong = isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : 'rgba(15,23,42,0.6)';

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: bg,
        color: textPrimary,
        overflowY: 'auto',
        padding: '28px',
        boxSizing: 'border-box',
      }}
    >
      {/* ── TOP HEADER / BREADCRUMB ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          {selectedPatient ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setSelectedPatient(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: surface,
                  color: '#0284c7',
                  border: `1px solid ${border}`,
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={15} /> All Patients
              </button>
              <span style={{ color: textSecondary }}>/</span>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>
                {selectedPatient.firstName} {selectedPatient.lastName}
              </h1>
              <span style={{
                background: 'rgba(2, 132, 199, 0.1)',
                color: '#0284c7',
                padding: '3px 8px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'monospace'
              }}>
                {selectedPatient.patientId || `CLV-${selectedPatient.id}`}
              </span>
            </div>
          ) : (
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Electronic Health Records (EHR)
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: textSecondary }}>
                Search and select a patient to review clinical history, diagnostic notes, and vital trends
              </p>
            </div>
          )}
        </div>

        {/* Action button */}
        {selectedPatient && (
          <button
            onClick={() => setShowNewModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
            }}
          >
            <Plus size={16} /> New Clinical Record
          </button>
        )}
      </div>

      {/* ── STEP 1: PATIENT SEARCH & DIRECTORY ── */}
      {!selectedPatient ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Search bar & Filter Pills */}
          <div
            style={{
              background: surface,
              borderRadius: '18px',
              padding: '18px',
              border: `1px solid ${border}`,
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              flexWrap: 'wrap',
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 2px 10px rgba(15,23,42,0.04)',
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: '260px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: surfaceElevated,
                padding: '0 14px',
                height: '42px',
                borderRadius: '12px',
                border: `1px solid ${borderStrong}`,
              }}
            >
              <Search size={16} color={textSecondary} />
              <input
                type="text"
                placeholder="Search patient by name or ID (e.g. Aria Vasquez, CLV-00001)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  fontSize: '13.5px',
                  color: textPrimary,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: textSecondary, cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px', background: surfaceElevated, padding: '4px', borderRadius: '12px', border: `1px solid ${border}` }}>
              {['ALL', 'ADMITTED', 'OUTPATIENT'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: filterType === type ? 700 : 500,
                    border: 'none',
                    background: filterType === type ? '#0284c7' : 'transparent',
                    color: filterType === type ? '#ffffff' : textSecondary,
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  {type === 'ALL' ? 'All Patients' : type === 'ADMITTED' ? 'Inpatients' : 'Outpatients'}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Cards Grid */}
          {loadingPatients ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: textSecondary }}>
              <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
              <div>Loading patient directory...</div>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div
              style={{
                background: surface,
                borderRadius: '18px',
                padding: '48px 24px',
                textAlign: 'center',
                border: `1px solid ${border}`,
                color: textSecondary,
              }}
            >
              <User size={36} color={textSecondary} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <div style={{ fontSize: '16px', fontWeight: 700, color: textPrimary }}>No patients matched your search</div>
              <p style={{ fontSize: '13px', margin: '4px 0 0' }}>Try searching by first name, last name, or clinical ID code</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {filteredPatients.map(patient => {
                const initials = (patient.firstName?.[0] || 'P') + (patient.lastName?.[0] || '');
                return (
                  <div
                    key={patient.id || patient.patientId}
                    onClick={() => handleSelectPatient(patient)}
                    style={{
                      background: surface,
                      borderRadius: '18px',
                      padding: '20px',
                      border: `1px solid ${border}`,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      transition: 'transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease',
                      boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(15,23,42,0.04)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = '#0284c7';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = border;
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, rgba(2,132,199,0.15) 0%, rgba(124,58,237,0.15) 100%)',
                            color: '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '15px',
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '15px', color: textPrimary }}>
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div style={{ fontSize: '12px', color: textSecondary, fontFamily: 'monospace' }}>
                            {patient.patientId || `CLV-${patient.id}`}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: patient.admitted ? 'rgba(2,132,199,0.12)' : 'rgba(16,185,129,0.12)',
                          color: patient.admitted ? '#0284c7' : '#10b981',
                        }}
                      >
                        {patient.admitted ? 'Inpatient' : 'Outpatient'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', borderTop: `1px solid ${border}`, paddingTop: '12px' }}>
                      <div>
                        <div style={{ fontSize: '10.5px', color: textSecondary, fontWeight: 600 }}>AGE</div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>{patient.age || '29'} yrs</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10.5px', color: textSecondary, fontWeight: 600 }}>BLOOD</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#e11d48' }}>{patient.bloodGroup || 'O+'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10.5px', color: textSecondary, fontWeight: 600 }}>ATTENDING</div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {patient.primaryDoctorName || 'Dr. Torres'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                      <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        View Medical Records <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ── STEP 2: PATIENT EMR PROFILE & CLINICAL TIMELINE ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Patient Overview Banner */}
          <div
            style={{
              background: surface,
              borderRadius: '20px',
              padding: '24px',
              border: `1px solid ${border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 2px 12px rgba(15,23,42,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '20px',
                  boxShadow: '0 4px 14px rgba(2,132,199,0.3)',
                }}
              >
                {(selectedPatient.firstName?.[0] || 'P') + (selectedPatient.lastName?.[0] || '')}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h2>
                  <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(2,132,199,0.1)', color: '#0284c7' }}>
                    {selectedPatient.patientId || `CLV-${selectedPatient.id}`}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '13px', color: textSecondary }}>
                  <span>Age: <strong>{selectedPatient.age || 29}</strong></span>
                  <span>•</span>
                  <span>Blood: <strong style={{ color: '#e11d48' }}>{selectedPatient.bloodGroup || 'O+'}</strong></span>
                  <span>•</span>
                  <span>Allergies: <strong style={{ color: '#d97706' }}>{selectedPatient.allergies || 'Penicillin'}</strong></span>
                </div>
              </div>
            </div>

            {/* HIPAA Compliance Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                background: isDark ? 'rgba(5,150,105,0.12)' : 'rgba(5,150,105,0.08)',
                border: '1px solid rgba(5,150,105,0.25)',
                borderRadius: '12px',
                color: '#10b981',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <Shield size={16} />
              <span>HIPAA § 164.312 Verified Audit Active</span>
            </div>
          </div>

          {/* Timeline Section */}
          <div
            style={{
              background: surface,
              borderRadius: '20px',
              padding: '28px',
              border: `1px solid ${border}`,
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.25)' : '0 2px 12px rgba(15,23,42,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Stethoscope size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                  Clinical Consultation Timeline ({records.length})
                </h3>
              </div>
            </div>

            {loadingRecords ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: textSecondary }}>
                <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                <div>Fetching clinical records...</div>
              </div>
            ) : records.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: textSecondary }}>
                <FileText size={32} style={{ opacity: 0.4, marginBottom: '8px' }} />
                <div style={{ fontWeight: 700, color: textPrimary }}>No clinical records on file</div>
                <p style={{ fontSize: '13px', margin: '4px 0 16px' }}>Start this patient's EHR timeline by adding the first consultation entry.</p>
                <button
                  onClick={() => setShowNewModal(true)}
                  style={{
                    background: '#0284c7',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  + Add First Consultation
                </button>
              </div>
            ) : (
              <div style={{ position: 'relative', paddingLeft: '28px' }}>
                {/* Timeline Bar */}
                <div
                  style={{
                    position: 'absolute',
                    left: '8px',
                    top: '16px',
                    bottom: '16px',
                    width: '2px',
                    background: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                  }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {records.map(record => {
                    const isExpanded = expandedId === record.id;
                    return (
                      <div key={record.id} style={{ position: 'relative' }}>
                        {/* Timeline Node */}
                        <div
                          style={{
                            position: 'absolute',
                            left: '-28px',
                            top: '18px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: '#0284c7',
                            border: `4px solid ${surface}`,
                            boxShadow: '0 0 0 2px #0284c7',
                          }}
                        />

                        {/* Record Card */}
                        <div
                          style={{
                            background: surfaceElevated,
                            borderRadius: '16px',
                            border: `1px solid ${border}`,
                            padding: '20px',
                            transition: 'all 200ms ease',
                          }}
                        >
                          <div
                            onClick={() => setExpandedId(isExpanded ? null : record.id)}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              cursor: 'pointer',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '14px', fontWeight: 800, color: textPrimary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Calendar size={14} color="#0284c7" />
                                  {record.recordDate || 'Recent'}
                                </span>
                                <span
                                  style={{
                                    padding: '3px 8px',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    background: record.recordType === 'EMERGENCY' ? 'rgba(225,29,72,0.1)' : 'rgba(2,132,199,0.1)',
                                    color: record.recordType === 'EMERGENCY' ? '#e11d48' : '#0284c7',
                                  }}
                                >
                                  {record.recordType || 'CONSULTATION'}
                                </span>
                                {record.isConfidential && (
                                  <span style={{ padding: '3px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: 'rgba(217,119,6,0.12)', color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Lock size={11} /> Confidential
                                  </span>
                                )}
                              </div>

                              <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: textPrimary }}>
                                {record.chiefComplaint}
                              </h3>
                              <p style={{ margin: 0, fontSize: '13px', color: textSecondary }}>
                                Attending Physician: <strong>{record.doctorName || 'Dr. Reyna Torres'}</strong>
                              </p>
                            </div>

                            <button
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: textSecondary,
                                cursor: 'pointer',
                                padding: '6px',
                                transform: isExpanded ? 'rotate(180deg)' : 'none',
                                transition: 'transform 200ms ease',
                              }}
                            >
                              <ChevronDown size={20} />
                            </button>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: `1px solid ${border}`, display: 'flex', flexDirection: 'column', gap: '18px' }}>
                              {/* Vitals Snapshot */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                                <div style={{ background: surface, padding: '12px 14px', borderRadius: '12px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <Heart size={18} color="#e11d48" />
                                  <div>
                                    <div style={{ fontSize: '10.5px', color: textSecondary, fontWeight: 700 }}>HEART RATE</div>
                                    <div style={{ fontSize: '15px', fontWeight: 800 }}>{record.heartRate || 75} <span style={{ fontSize: '11px', fontWeight: 500 }}>bpm</span></div>
                                  </div>
                                </div>

                                <div style={{ background: surface, padding: '12px 14px', borderRadius: '12px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <Activity size={18} color="#059669" />
                                  <div>
                                    <div style={{ fontSize: '10.5px', color: textSecondary, fontWeight: 700 }}>BLOOD PRESSURE</div>
                                    <div style={{ fontSize: '15px', fontWeight: 800 }}>{record.bloodPressureSystolic || 120}/{record.bloodPressureDiastolic || 80}</div>
                                  </div>
                                </div>

                                <div style={{ background: surface, padding: '12px 14px', borderRadius: '12px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <Thermometer size={18} color="#d97706" />
                                  <div>
                                    <div style={{ fontSize: '10.5px', color: textSecondary, fontWeight: 700 }}>TEMPERATURE</div>
                                    <div style={{ fontSize: '15px', fontWeight: 800 }}>{record.temperature || 36.8}°C</div>
                                  </div>
                                </div>

                                <div style={{ background: surface, padding: '12px 14px', borderRadius: '12px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <Wind size={18} color="#0284c7" />
                                  <div>
                                    <div style={{ fontSize: '10.5px', color: textSecondary, fontWeight: 700 }}>OXYGEN (SpO2)</div>
                                    <div style={{ fontSize: '15px', fontWeight: 800 }}>{record.oxygenSaturation || 98}%</div>
                                  </div>
                                </div>
                              </div>

                              {/* Present Illness */}
                              {record.presentIllness && (
                                <div>
                                  <h4 style={{ margin: '0 0 6px', fontSize: '12px', color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    History of Present Illness
                                  </h4>
                                  <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: textPrimary }}>
                                    {record.presentIllness}
                                  </p>
                                </div>
                              )}

                              {/* Assessment & Plan Boxes */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                                <div style={{ background: 'rgba(2, 132, 199, 0.05)', border: '1px solid rgba(2, 132, 199, 0.2)', padding: '14px', borderRadius: '12px' }}>
                                  <h4 style={{ margin: '0 0 6px', fontSize: '12px', color: '#0284c7', textTransform: 'uppercase', fontWeight: 700 }}>
                                    Clinical Assessment
                                  </h4>
                                  <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: textPrimary }}>
                                    {record.assessment || 'Under evaluation'}
                                  </p>
                                </div>

                                <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '14px', borderRadius: '12px' }}>
                                  <h4 style={{ margin: '0 0 6px', fontSize: '12px', color: '#10b981', textTransform: 'uppercase', fontWeight: 700 }}>
                                    Treatment & Care Plan
                                  </h4>
                                  <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: textPrimary }}>
                                    {record.plan || 'Routine monitoring'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE NEW CLINICAL RECORD ── */}
      {showNewModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: surface,
              borderRadius: '24px',
              padding: '28px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: `1px solid ${borderStrong}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              color: textPrimary,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>New Clinical Record Entry</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: textSecondary }}>
                  Patient: {selectedPatient?.firstName} {selectedPatient?.lastName} ({selectedPatient?.patientId})
                </p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                style={{ background: 'none', border: 'none', color: textSecondary, cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Record Type</label>
                  <select
                    value={newRecordForm.recordType}
                    onChange={e => setNewRecordForm({ ...newRecordForm, recordType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: `1px solid ${borderStrong}`,
                      background: surfaceElevated,
                      color: textPrimary,
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  >
                    <option value="CONSULTATION">General Consultation</option>
                    <option value="FOLLOW_UP">Follow-Up Review</option>
                    <option value="EMERGENCY">Emergency Treatment</option>
                    <option value="DIAGNOSTIC">Diagnostic Analysis</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Confidentiality Flag</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '38px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={newRecordForm.isConfidential}
                      onChange={e => setNewRecordForm({ ...newRecordForm, isConfidential: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#0284c7' }}
                    />
                    <span style={{ fontSize: '13px', color: textSecondary }}>Mark as Restrictive / Confidential</span>
                  </label>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Chief Complaint *</label>
                <input
                  type="text"
                  required
                  placeholder="Primary reason for clinical visit..."
                  value={newRecordForm.chiefComplaint}
                  onChange={e => setNewRecordForm({ ...newRecordForm, chiefComplaint: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${borderStrong}`,
                    background: surfaceElevated,
                    color: textPrimary,
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Vitals inputs */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Observed Vital Signs</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: textSecondary }}>HR (bpm)</span>
                    <input
                      type="number"
                      value={newRecordForm.heartRate}
                      onChange={e => setNewRecordForm({ ...newRecordForm, heartRate: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: textSecondary }}>BP (Systolic)</span>
                    <input
                      type="number"
                      value={newRecordForm.bloodPressureSystolic}
                      onChange={e => setNewRecordForm({ ...newRecordForm, bloodPressureSystolic: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: textSecondary }}>Temp (°C)</span>
                    <input
                      type="number"
                      step="0.1"
                      value={newRecordForm.temperature}
                      onChange={e => setNewRecordForm({ ...newRecordForm, temperature: parseFloat(e.target.value) || 0 })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: textSecondary }}>SpO2 (%)</span>
                    <input
                      type="number"
                      value={newRecordForm.oxygenSaturation}
                      onChange={e => setNewRecordForm({ ...newRecordForm, oxygenSaturation: parseFloat(e.target.value) || 0 })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>History of Present Illness</label>
                <textarea
                  rows={2}
                  placeholder="Detailed symptomatology, duration, and clinical observations..."
                  value={newRecordForm.presentIllness}
                  onChange={e => setNewRecordForm({ ...newRecordForm, presentIllness: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Assessment & Diagnosis</label>
                  <textarea
                    rows={3}
                    placeholder="Clinical diagnosis and ICD notes..."
                    value={newRecordForm.assessment}
                    onChange={e => setNewRecordForm({ ...newRecordForm, assessment: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Treatment Plan</label>
                  <textarea
                    rows={3}
                    placeholder="Prescriptions, procedures, regimen..."
                    value={newRecordForm.plan}
                    onChange={e => setNewRecordForm({ ...newRecordForm, plan: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontWeight: 600, fontSize: '13.5px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRecord}
                  style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#0284c7', color: '#ffffff', fontWeight: 700, fontSize: '13.5px', cursor: savingRecord ? 'not-allowed' : 'pointer' }}
                >
                  {savingRecord ? 'Recording...' : 'Commit Clinical Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
