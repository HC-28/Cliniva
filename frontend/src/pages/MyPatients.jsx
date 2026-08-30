import React, { useState, useEffect } from 'react';
import { fetchAllPatients } from '../services/api';
import { useGlobalToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { User, Droplet, Clock, X, ChevronRight } from 'lucide-react';

export default function MyPatients({ user }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { toast } = useGlobalToast();
  const { isDark } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllPatients();
        const doctorNameStr = user?.name || 'Dr. Reyna Torres';
        const myPats = data.filter(p => {
          const docName = (p.primaryDoctorName || '').toLowerCase();
          const usrName = doctorNameStr.toLowerCase();
          return docName.includes(usrName.split(' ').pop()) || usrName.includes(docName.split(' ').pop());
        });
        setPatients(myPats.length > 0 ? myPats : data); // Fallback to all patients if none match exact name
      } catch (err) {
        toast.error('Failed to load your patients');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const bg = isDark ? '#090e17' : '#f0f4f8';
  const surface = isDark ? '#1e293b' : '#ffffff';
  const surfaceElevated = isDark ? '#283548' : '#f8fafc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  const borderStrong = isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : 'rgba(15,23,42,0.6)';

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: bg, color: textPrimary, width: '100%', height: '100%' }}>
      <div style={{ flex: 1, padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>My Assigned Patients</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: textSecondary }}>
            Active clinical roster assigned to your care schedule
          </p>
        </div>

        {loading ? (
          <p style={{ color: textSecondary }}>Loading your patients...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {patients.map(p => (
              <div
                key={p.id || p.patientId}
                onClick={() => setSelectedPatient(p)}
                style={{
                  background: surface,
                  borderRadius: '16px',
                  border: selectedPatient?.id === p.id ? '2px solid #0284c7' : `1px solid ${border}`,
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(15,23,42,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: textPrimary }}>
                      {p.firstName} {p.lastName}
                    </div>
                    <div style={{ fontSize: '12px', color: textSecondary, fontFamily: 'monospace' }}>
                      {p.patientId}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: p.admitted ? 'rgba(2,132,199,0.12)' : 'rgba(16,185,129,0.12)',
                      color: p.admitted ? '#0284c7' : '#10b981',
                    }}
                  >
                    {p.admitted ? 'Inpatient' : 'Outpatient'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: textSecondary }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={14} /> {p.age || 29}y
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e11d48', fontWeight: 600 }}>
                    <Droplet size={14} /> {p.bloodGroup || 'O+'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPatient && (
        <div style={{ width: '380px', borderLeft: `1px solid ${border}`, background: surface, padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Patient Overview</h2>
            <button onClick={() => setSelectedPatient(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)', color: '#fff', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              {(selectedPatient.firstName?.[0] || 'P') + (selectedPatient.lastName?.[0] || '')}
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{selectedPatient.firstName} {selectedPatient.lastName}</h3>
            <p style={{ margin: '4px 0 0', color: textSecondary, fontFamily: 'monospace', fontSize: '12px' }}>{selectedPatient.patientId}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: surfaceElevated, padding: '14px', borderRadius: '12px', border: `1px solid ${border}` }}>
              <div style={{ fontSize: '11px', color: textSecondary, marginBottom: '2px', fontWeight: 600 }}>CONTACT EMAIL</div>
              <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{selectedPatient.email || 'patient@cliniva.io'}</div>
            </div>
            <div style={{ background: surfaceElevated, padding: '14px', borderRadius: '12px', border: `1px solid ${border}` }}>
              <div style={{ fontSize: '11px', color: textSecondary, marginBottom: '2px', fontWeight: 600 }}>ADMISSION STATUS</div>
              <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{selectedPatient.admitted ? 'Admitted (Neuro Pod A-1)' : 'Outpatient Routine Care'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
