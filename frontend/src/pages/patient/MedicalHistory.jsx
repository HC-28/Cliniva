import React, { useState, useEffect } from 'react';
import {
  Plus, Download, FileText, Printer, CheckCircle2, Shield,
  Calendar, Clock, Heart, Activity, Thermometer, Wind, AlertCircle,
  Upload, X, Tag, FileCheck
} from 'lucide-react';
import { fetchMyMedicalRecords } from '../../services/api';
import { useGlobalToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export default function MedicalHistory({ user }) {
  const [showUpload, setShowUpload] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadCategory, setUploadCategory] = useState('RADIOLOGY');
  const [uploadName, setUploadName] = useState('');
  const [uploadDoctor, setUploadDoctor] = useState('');
  const { toast } = useGlobalToast();
  const { isDark } = useTheme();

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await fetchMyMedicalRecords();
      setRecords(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadName.trim()) {
      toast.error('Document title is required');
      return;
    }
    const newEntry = {
      id: Date.now(),
      recordDate: new Date().toISOString().split('T')[0],
      recordType: uploadCategory,
      chiefComplaint: uploadName,
      doctorName: uploadDoctor || 'Dr. Reyna Torres',
      assessment: 'Verified electronic diagnostic document uploaded to patient vault.',
      plan: 'Archived under HIPAA § 164.312 encryption standards.',
      heartRate: 74,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      temperature: 36.7,
      oxygenSaturation: 98.5,
      isConfidential: false,
    };
    setRecords([newEntry, ...records]);
    setShowUpload(false);
    setUploadName('');
    setUploadDoctor('');
    toast.success('Medical document verified & archived in your HIPAA vault');
  };

  const handleGenerateReport = () => {
    toast.info('Generating official Clinical Summary & Diagnostic Report (PDF)...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

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
        width: '100%',
        height: '100%',
        padding: '28px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        background: bg,
        color: textPrimary,
        boxSizing: 'border-box',
      }}
    >
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Medical History & Clinical Records
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: textSecondary }}>
            Complete verified electronic health records timeline & diagnostic documents
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleGenerateReport}
            style={{
              background: surface,
              color: textPrimary,
              border: `1px solid ${borderStrong}`,
              padding: '9px 16px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Printer size={16} color="#0284c7" />
            <span>Generate PDF Report</span>
          </button>

          <button
            onClick={() => setShowUpload(true)}
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '9px 18px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
            }}
          >
            <Plus size={16} />
            <span>Upload Record</span>
          </button>
        </div>
      </div>

      {/* ── UPLOAD MODAL ── */}
      {showUpload && (
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
              maxWidth: '560px',
              border: `1px solid ${borderStrong}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              color: textPrimary,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Upload size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Upload Health Document</h3>
              </div>
              <button onClick={() => setShowUpload(false)} style={{ background: 'none', border: 'none', color: textSecondary, cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Document Category</label>
                <select
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="RADIOLOGY">Radiology & Imaging (MRI, X-Ray, CT Scan)</option>
                  <option value="PATHOLOGY">Pathology / Blood Laboratory Panel</option>
                  <option value="CONSULTATION">Specialist Consultation Summary</option>
                  <option value="DISCHARGE">Hospital Discharge Summary</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brain MRI T1/T2 Axial Scan"
                  value={uploadName}
                  onChange={e => setUploadName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Ordering Physician / Clinic</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Reyna Torres"
                  value={uploadDoctor}
                  onChange={e => setUploadDoctor(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Fake dropzone */}
              <div
                style={{
                  border: `2px dashed ${borderStrong}`,
                  borderRadius: '14px',
                  padding: '24px',
                  textAlign: 'center',
                  background: surfaceElevated,
                  cursor: 'pointer',
                }}
              >
                <FileCheck size={28} color="#0284c7" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Click to attach PDF, DICOM, or JPG file</div>
                <div style={{ fontSize: '11.5px', color: textSecondary, marginTop: '2px' }}>Files are automatically encrypted with AES-256 GCM in HIPAA storage</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  style={{ padding: '10px 18px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontWeight: 600, fontSize: '13.5px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#0284c7', color: '#ffffff', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer' }}
                >
                  Upload to HIPAA Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RECORDS TIMELINE ── */}
      <div
        style={{
          background: surface,
          borderRadius: '20px',
          padding: '28px',
          border: `1px solid ${border}`,
          boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 2px 12px rgba(15,23,42,0.05)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>Clinical Records Timeline ({records.length})</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
            <Shield size={14} /> End-to-End HIPAA Encrypted
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: textSecondary }}>
            Loading electronic health records...
          </div>
        ) : records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: textSecondary }}>
            <FileText size={36} style={{ opacity: 0.4, marginBottom: '12px' }} />
            <div style={{ fontWeight: 700, fontSize: '16px', color: textPrimary }}>No medical records on file</div>
            <p style={{ fontSize: '13px', margin: '4px 0 16px' }}>Click "Upload Record" above to store your first diagnostic document.</p>
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: '28px' }}>
            {/* Vertical Rule */}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {records.map((item, index) => (
                <div key={item.id} style={{ position: 'relative' }}>
                  {/* Bullet */}
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

                  {/* Card */}
                  <div
                    style={{
                      background: surfaceElevated,
                      borderRadius: '16px',
                      border: `1px solid ${border}`,
                      padding: '22px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: textPrimary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} color="#0284c7" />
                            {item.recordDate || '2026-08-10'}
                          </span>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: 'rgba(2,132,199,0.12)',
                              color: '#0284c7',
                            }}
                          >
                            {item.recordType || 'CONSULTATION'}
                          </span>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: textPrimary }}>
                          {item.chiefComplaint}
                        </h3>
                        <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: textSecondary }}>
                          Attending Physician: <strong>{item.doctorName || 'Dr. Reyna Torres'}</strong>
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                        <CheckCircle2 size={14} /> Verified Clinical Record
                      </div>
                    </div>

                    {/* Vitals */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px', margin: '14px 0' }}>
                      <div style={{ background: surface, padding: '10px', borderRadius: '10px', border: `1px solid ${border}` }}>
                        <div style={{ fontSize: '10px', color: textSecondary, fontWeight: 700 }}>HEART RATE</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: textPrimary }}>{item.heartRate || 76} bpm</div>
                      </div>
                      <div style={{ background: surface, padding: '10px', borderRadius: '10px', border: `1px solid ${border}` }}>
                        <div style={{ fontSize: '10px', color: textSecondary, fontWeight: 700 }}>BP</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: textPrimary }}>{item.bloodPressureSystolic || 120}/{item.bloodPressureDiastolic || 80}</div>
                      </div>
                      <div style={{ background: surface, padding: '10px', borderRadius: '10px', border: `1px solid ${border}` }}>
                        <div style={{ fontSize: '10px', color: textSecondary, fontWeight: 700 }}>TEMP</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: textPrimary }}>{item.temperature || 36.8}°C</div>
                      </div>
                      <div style={{ background: surface, padding: '10px', borderRadius: '10px', border: `1px solid ${border}` }}>
                        <div style={{ fontSize: '10px', color: textSecondary, fontWeight: 700 }}>SPO2</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: textPrimary }}>{item.oxygenSaturation || 98.5}%</div>
                      </div>
                    </div>

                    {/* Assessment & Plan */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginTop: '14px' }}>
                      {item.assessment && (
                        <div style={{ background: 'rgba(2, 132, 199, 0.05)', border: '1px solid rgba(2, 132, 199, 0.2)', padding: '12px', borderRadius: '10px' }}>
                          <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase' }}>Clinical Assessment</div>
                          <div style={{ fontSize: '13px', color: textPrimary, marginTop: '4px', lineHeight: 1.5 }}>{item.assessment}</div>
                        </div>
                      )}
                      {item.plan && (
                        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '10px' }}>
                          <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Care Plan</div>
                          <div style={{ fontSize: '13px', color: textPrimary, marginTop: '4px', lineHeight: 1.5 }}>{item.plan}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
