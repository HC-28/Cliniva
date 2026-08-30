import React, { useState, useEffect } from 'react';
import { fetchStaff } from '../services/api';
import { useGlobalToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Award, Mail, Stethoscope, Check, X, Clock, UserCheck, AlertCircle } from 'lucide-react';

export default function StaffManagement({ user }) {
  const { isDark } = useTheme();
  const { toast } = useGlobalToast();
  const [staff, setStaff] = useState([]);
  const [pendingStaff, setPendingStaff] = useState([
    { id: 101, name: 'Dr. Kevin Vance', email: 'k.vance@cardio.med', role: 'DOCTOR', specialization: 'Interventional Cardiology', licenseNumber: 'MED-NY-89421', registeredAt: 'Today, 14:20' },
    { id: 102, name: 'Nurse Clara Dupont', email: 'clara.dupont@cliniva.io', role: 'NURSE', specialization: 'Trauma & ICU Nursing', licenseNumber: 'RN-88310', registeredAt: 'Yesterday' },
  ]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING'); // DOCTOR | NURSE | PENDING

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStaff();
        setStaff(data);
      } catch (err) {
        toast.error('Failed to load staff list');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleApprove = (id, name, role) => {
    setPendingStaff(prev => prev.filter(s => s.id !== id));
    toast.success(`Approved ${name} as active ${role}. Account is now unlocked.`);
    // Add to active staff list
    setStaff(prev => [
      ...prev,
      {
        id,
        name,
        role,
        department: role === 'DOCTOR' ? 'Cardiology' : 'General Ward',
        specialization: 'Licensed Practitioner',
        experience: 'Active',
        isActive: true,
      }
    ]);
  };

  const handleReject = (id, name) => {
    setPendingStaff(prev => prev.filter(s => s.id !== id));
    toast.info(`Rejected registration application for ${name}.`);
  };

  const toggleStatus = (id) => {
    toast.success('Personnel status updated');
    setStaff(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const filteredStaff = staff.filter(s => s.role === activeTab);

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        padding: '28px',
        overflowY: 'auto',
        backgroundColor: isDark ? '#090e17' : '#f0f4f8',
        color: isDark ? '#f8fafc' : '#0f172a',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', color: isDark ? '#f8fafc' : '#0f172a' }}>
            Clinical Staff Directory & Approvals
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)' }}>
            Review doctor & nurse credential verifications, role authorizations, and ward staffing
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', background: isDark ? '#1e293b' : '#e2e8f0', borderRadius: '14px', padding: '4px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'transparent'}` }}>
          <button
            onClick={() => setActiveTab('PENDING')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'PENDING' ? (isDark ? '#0284c7' : '#ffffff') : 'transparent',
              color: activeTab === 'PENDING' ? (isDark ? '#ffffff' : '#0f172a') : (isDark ? '#94a3b8' : '#64748b'),
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: activeTab === 'PENDING' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 150ms ease',
            }}
          >
            <Clock size={14} /> Pending Approvals
            {pendingStaff.length > 0 && (
              <span style={{ fontSize: '10.5px', background: activeTab === 'PENDING' ? 'rgba(255,255,255,0.3)' : '#e11d48', color: '#ffffff', padding: '1px 6px', borderRadius: '10px', fontWeight: 800 }}>
                {pendingStaff.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('DOCTOR')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'DOCTOR' ? (isDark ? '#0284c7' : '#ffffff') : 'transparent',
              color: activeTab === 'DOCTOR' ? (isDark ? '#ffffff' : '#0f172a') : (isDark ? '#94a3b8' : '#64748b'),
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: activeTab === 'DOCTOR' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 150ms ease',
            }}
          >
            Doctors
          </button>

          <button
            onClick={() => setActiveTab('NURSE')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'NURSE' ? (isDark ? '#0284c7' : '#ffffff') : 'transparent',
              color: activeTab === 'NURSE' ? (isDark ? '#ffffff' : '#0f172a') : (isDark ? '#94a3b8' : '#64748b'),
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: activeTab === 'NURSE' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 150ms ease',
            }}
          >
            Nurses
          </button>
        </div>
      </div>

      {/* Main Table / List Container */}
      <div
        style={{
          background: isDark ? '#1e293b' : '#ffffff',
          borderRadius: '20px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
          overflow: 'hidden',
          boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.35)' : '0 2px 12px rgba(15,23,42,0.05)',
        }}
      >
        {activeTab === 'PENDING' ? (
          <div>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="#0284c7" />
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
                Healthcare Practitioner Registration Applications (Require Admin Authorization)
              </span>
            </div>

            {pendingStaff.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b' }}>
                <UserCheck size={36} color="#10b981" style={{ marginBottom: '10px' }} />
                <div style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>All Staff Registrations Verified</div>
                <p style={{ fontSize: '13px', margin: '4px 0 0' }}>No pending applications waiting for credential review.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: isDark ? '#0f172a' : '#f8fafc', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, textAlign: 'left' }}>
                    <th style={{ padding: '14px 20px', fontSize: '11.5px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700 }}>APPLICANT</th>
                    <th style={{ padding: '14px 20px', fontSize: '11.5px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700 }}>ROLE</th>
                    <th style={{ padding: '14px 20px', fontSize: '11.5px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700 }}>SPECIALIZATION / LICENSE</th>
                    <th style={{ padding: '14px 20px', fontSize: '11.5px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700 }}>SUBMITTED</th>
                    <th style={{ padding: '14px 20px', fontSize: '11.5px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingStaff.map(applicant => (
                    <tr key={applicant.id} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
                          {applicant.name}
                        </div>
                        <div style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b' }}>
                          {applicant.email}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '8px', background: applicant.role === 'DOCTOR' ? 'rgba(2, 132, 199, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: applicant.role === 'DOCTOR' ? '#0284c7' : '#10b981' }}>
                          {applicant.role}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#f8fafc' : '#0f172a' }}>
                          {applicant.specialization}
                        </div>
                        <div style={{ fontSize: '11.5px', color: isDark ? '#94a3b8' : '#64748b', fontFamily: 'monospace' }}>
                          Lic #{applicant.licenseNumber}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '12.5px', color: isDark ? '#94a3b8' : '#64748b' }}>
                        {applicant.registeredAt}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleApprove(applicant.id, applicant.name, applicant.role)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: '#059669',
                              color: '#ffffff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(applicant.id, applicant.name)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: isDark ? 'rgba(225, 29, 72, 0.2)' : 'rgba(225, 29, 72, 0.1)',
                              color: '#e11d48',
                              border: '1px solid rgba(225, 29, 72, 0.3)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: isDark ? '#0f172a' : '#f8fafc', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, textAlign: 'left' }}>
                <th style={{ padding: '14px 20px', fontSize: '11.5px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700 }}>PERSONNEL</th>
                <th style={{ padding: '14px 20px', fontSize: '11.5px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700 }}>DEPARTMENT / SPECIALIZATION</th>
                <th style={{ padding: '14px 20px', fontSize: '11.5px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700 }}>EXPERIENCE</th>
                <th style={{ padding: '14px 20px', fontSize: '11.5px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700 }}>STATUS</th>
                <th style={{ padding: '14px 20px', fontSize: '11.5px', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700, textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map(member => (
                <tr key={member.id} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 800,
                        }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{member.name}</div>
                        <div style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b' }}>{member.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: isDark ? '#cbd5e1' : '#334155' }}>
                    <div>{member.department || 'General Practice'}</div>
                    <div style={{ fontSize: '11.5px', color: isDark ? '#94a3b8' : '#64748b' }}>{member.specialization}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: isDark ? '#cbd5e1' : '#334155' }}>
                    {member.experience || '8+ Years'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '8px', background: member.isActive ? 'rgba(5, 150, 105, 0.15)' : 'rgba(100, 116, 139, 0.15)', color: member.isActive ? '#10b981' : '#64748b' }}>
                      {member.isActive ? 'Active Duty' : 'Off-Duty'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => toggleStatus(member.id)}
                      style={{
                        background: isDark ? '#0f172a' : '#f1f5f9',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1'}`,
                        color: isDark ? '#f8fafc' : '#0f172a',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
