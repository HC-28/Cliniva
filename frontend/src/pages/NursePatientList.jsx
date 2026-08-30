import React, { useState, useEffect } from 'react';
import { fetchAllPatients } from '../services/api';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import { User, Activity, AlertCircle } from 'lucide-react';

export default function NursePatientList({ user }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, toast, removeToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllPatients();
        // For nurses, show all admitted patients by default, or specific ones. Let's show admitted ones grouped by doctor for demo.
        setPatients(data.filter(p => p.admitted));
      } catch (err) {
        toast.error('Failed to load patient list');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Group by primary doctor as a proxy for 'ward'
  const groupedPatients = patients.reduce((acc, p) => {
    const doc = p.primaryDoctorSpecialization || 'General Ward';
    if (!acc[doc]) acc[doc] = [];
    acc[doc].push(p);
    return acc;
  }, {});

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: '#f0f4f8' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Ward Patients</h1>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(15,23,42,0.5)' }}>Admitted patients currently under care</p>
      </div>

      {loading ? (
        <p>Loading patient list...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Object.keys(groupedPatients).map(ward => (
            <div key={ward}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#0284c7" />
                {ward} Ward
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {groupedPatients[ward].map(p => (
                  <div key={p.id} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>{p.firstName} {p.lastName}</div>
                          <div style={{ fontSize: '12px', color: '#64748b', fontFamily: '"JetBrains Mono", monospace' }}>{p.patientId}</div>
                        </div>
                      </div>
                      {p.followUpRequired && (
                        <div style={{ color: '#d97706', display: 'flex', alignItems: 'center', background: '#d9770615', padding: '4px 8px', borderRadius: '12px', gap: '4px' }}>
                          <AlertCircle size={14} />
                          <span style={{ fontSize: '11px', fontWeight: 600 }}>Needs Review</span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>ATTENDING</div>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{p.primaryDoctorName}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>VITALS</div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#059669' }}>Stable</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedPatients).length === 0 && <p style={{ color: '#64748b' }}>No admitted patients found.</p>}
        </div>
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
