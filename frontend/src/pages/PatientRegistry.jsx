import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, User, HeartPulse } from 'lucide-react';
import { fetchAllPatients } from '../services/api';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';

export default function PatientRegistry({ user }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const { toasts, toast, removeToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllPatients();
        setPatients(data);
      } catch (err) {
        toast.error('Failed to load patient registry');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredPatients = patients.filter(p =>
    p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.primaryDoctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Patient Registry</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(15,23,42,0.5)' }}>Manage and monitor all registered patients</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '8px 16px', width: '300px' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by name, ID, or doctor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', marginLeft: '12px', flex: 1, fontSize: '14px' }}
          />
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading patients...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '16px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>PATIENT ID</th>
                <th style={{ padding: '16px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>NAME & AGE</th>
                <th style={{ padding: '16px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>BLOOD</th>
                <th style={{ padding: '16px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>PRIMARY DOCTOR</th>
                <th style={{ padding: '16px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>DEPARTMENT</th>
                <th style={{ padding: '16px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>STATUS</th>
                <th style={{ padding: '16px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(p => (
                <React.Fragment key={p.id}>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', fontSize: '14px', fontFamily: '"JetBrains Mono", monospace' }}>{p.patientId}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.firstName} {p.lastName}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{p.age} years</div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#e11d48', fontWeight: 600 }}>{p.bloodGroup}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{p.primaryDoctorName}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{p.primaryDoctorSpecialization}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: p.admitted ? '#0284c715' : '#e2e8f0', color: p.admitted ? '#0284c7' : '#64748b', display: 'inline-block', marginBottom: p.followUpRequired ? '4px' : 0 }}>
                        {p.admitted ? 'Admitted' : 'Outpatient'}
                      </span>
                      {p.followUpRequired && (
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: '#d9770615', color: '#d97706', display: 'block' }}>
                          Follow-up Required
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                        <ChevronDown size={18} color="#64748b" style={{ transform: expandedId === p.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </button>
                    </td>
                  </tr>
                  {expandedId === p.id && (
                    <tr style={{ background: '#f8fafc' }}>
                      <td colSpan={7} style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', gap: '40px' }}>
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Email Address</div>
                            <div style={{ fontSize: '14px', fontWeight: 500 }}>{p.email}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Emergency Contact</div>
                            <div style={{ fontSize: '14px', fontWeight: 500 }}>N/A</div>
                          </div>
                          <div>
                            <button style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                              View Full Profile
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredPatients.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
