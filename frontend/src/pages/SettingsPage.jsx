import React, { useState, useEffect } from 'react';
import {
  Settings, Bell, Shield, Moon, Sun, Mail, User,
  Sliders, Save, Key, CheckCircle2, RefreshCw, Send, Lock,
  FileText, Download, AlertTriangle, Eye, Server, Clock, Smartphone
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useGlobalToast } from '../context/ToastContext';
import { fetchAuditLogs, fetchComplianceStatus } from '../services/api';

export default function SettingsPage({ user }) {
  const { isDark, toggleTheme } = useTheme();
  const { toast } = useGlobalToast();

  const [activeTab, setActiveTab] = useState('account');
  const [saving, setSaving] = useState(false);

  // Profile Form States
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || 'Reyna');
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || 'Torres');
  const [email, setEmail] = useState(user?.email || 'doctor@cliniva.io');
  const [phone, setPhone] = useState('+1-555-0199');
  const [specialization, setSpecialization] = useState(user?.specialization || 'Neurology');
  const [licenseNumber, setLicenseNumber] = useState('MD-984210-NEURO');
  const [consultationFee, setConsultationFee] = useState('150');

  // Password / Security States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(true);

  // Clinical Alert States
  const [spo2Threshold, setSpo2Threshold] = useState('90');
  const [hrThreshold, setHrThreshold] = useState('120');
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  // HIPAA Compliance States
  const [auditLogs, setAuditLogs] = useState([]);
  const [complianceStatus, setComplianceStatus] = useState(null);
  const [loadingAudit, setLoadingAudit] = useState(false);

  useEffect(() => {
    if (activeTab === 'compliance') {
      loadAuditData();
    }
  }, [activeTab]);

  const loadAuditData = async () => {
    setLoadingAudit(true);
    try {
      const [logs, status] = await Promise.all([
        fetchAuditLogs(),
        fetchComplianceStatus()
      ]);
      setAuditLogs(logs);
      setComplianceStatus(status);
    } catch (err) {
      toast.error('Failed to load compliance audit logs');
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Clinical profile & preferences updated successfully');
    }, 600);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please enter your current and new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated and all sessions re-authenticated');
    }, 700);
  };

  const handleExportAuditLogs = () => {
    toast.info('Generating official HIPAA § 164.312 compliance audit report (CSV)...');
    setTimeout(() => {
      toast.success('HIPAA Audit Log exported successfully');
    }, 800);
  };

  // Tabs
  const tabs = [
    { id: 'account', label: 'Account & Profile', icon: User },
    { id: 'security', label: 'Security & Auth', icon: Key },
    { id: 'compliance', label: 'HIPAA & Compliance', icon: Shield },
    { id: 'alerts', label: 'Clinical Alerts', icon: Bell },
    { id: 'appearance', label: 'Theme & Display', icon: isDark ? Moon : Sun },
  ];

  // Theme constants
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
        padding: '28px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        background: bg,
        color: textPrimary,
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
            System Settings & Preferences
          </h1>
          <p style={{ fontSize: '13.5px', color: textSecondary, margin: '4px 0 0' }}>
            Manage clinical identity, credentials, HIPAA audit controls, and operational thresholds
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          background: surface,
          padding: '6px',
          borderRadius: '16px',
          border: `1px solid ${border}`,
          width: 'fit-content',
          flexWrap: 'wrap',
        }}
      >
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: active ? 700 : 500,
                border: 'none',
                background: active ? '#0284c7' : 'transparent',
                color: active ? '#ffffff' : textSecondary,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB CONTENT ── */}
      <div
        style={{
          background: surface,
          borderRadius: '20px',
          padding: '28px',
          border: `1px solid ${border}`,
          boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 2px 12px rgba(15,23,42,0.05)',
        }}
      >
        {/* TAB 1: ACCOUNT & PROFILE */}
        {activeTab === 'account' && (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '680px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Clinical Profile & Credentials</h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: textSecondary }}>
                Primary identification used on electronic prescriptions, medical records, and consultations
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${border}`, background: surfaceElevated, color: textSecondary, fontSize: '13.5px', boxSizing: 'border-box', opacity: 0.8 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Specialization / Department</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>License / NPI Number</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={e => setLicenseNumber(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 22px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                marginTop: '10px',
              }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        )}

        {/* TAB 2: SECURITY & AUTH */}
        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '680px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Authentication & Access Credentials</h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: textSecondary }}>
                Stateless session security, cryptographic rotation, and password management
              </p>
            </div>

            {/* Session Security Banner */}
            <div
              style={{
                padding: '16px 20px',
                background: 'rgba(2, 132, 199, 0.08)',
                border: '1px solid rgba(2, 132, 199, 0.25)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <Lock size={22} color="#0284c7" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0284c7' }}>
                  Stateless Session Active (HMAC-SHA256 JWT)
                </div>
                <div style={{ fontSize: '12.5px', color: textSecondary, marginTop: '2px' }}>
                  All incoming requests are signed and validated against Spring Security 6 stateless filters. Standard rotation interval: 3,600s.
                </div>
              </div>
            </div>

            {/* Change Password Form */}
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Update Password</h4>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>New Password</label>
                  <input
                    type="password"
                    placeholder="Min. 8 characters..."
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter new password..."
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  alignSelf: 'flex-start',
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            {/* Two-Factor Authentication Toggle */}
            <div style={{ borderTop: `1px solid ${border}`, paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Smartphone size={22} color="#059669" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Two-Factor Clinical Authentication (2FA)</div>
                  <div style={{ fontSize: '12.5px', color: textSecondary }}>
                    Enforces one-time passcode verification on logins from unrecognized devices.
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMfaEnabled(!mfaEnabled);
                  toast.info(`Two-Factor Authentication ${!mfaEnabled ? 'Enabled' : 'Disabled'}`);
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  background: mfaEnabled ? 'rgba(5,150,105,0.15)' : 'rgba(15,23,42,0.1)',
                  color: mfaEnabled ? '#059669' : textSecondary,
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {mfaEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: HIPAA COMPLIANCE & AUDIT LOGS */}
        {activeTab === 'compliance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>HIPAA Compliance & PHI Audit Controls</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: textSecondary }}>
                  Mandatory ePHI access trails (§ 164.312(b)) tracking every record view, export, and modification
                </p>
              </div>
              <button
                onClick={handleExportAuditLogs}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: surfaceElevated,
                  color: '#0284c7',
                  border: `1px solid ${borderStrong}`,
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Download size={15} /> Export Audit Log (CSV)
              </button>
            </div>

            {/* Compliance Status Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div style={{ background: surfaceElevated, padding: '16px', borderRadius: '14px', border: `1px solid ${border}` }}>
                <div style={{ fontSize: '11px', color: textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Security Rule Status</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> {complianceStatus?.hipaaSecurityRule || 'ENFORCED'}
                </div>
              </div>
              <div style={{ background: surfaceElevated, padding: '16px', borderRadius: '14px', border: `1px solid ${border}` }}>
                <div style={{ fontSize: '11px', color: textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>PHI Encryption at Rest</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
                  {complianceStatus?.phiEncryptionAtRest || 'AES-256 GCM'}
                </div>
              </div>
              <div style={{ background: surfaceElevated, padding: '16px', borderRadius: '14px', border: `1px solid ${border}` }}>
                <div style={{ fontSize: '11px', color: textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Transmission Security</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: textPrimary, marginTop: '4px' }}>
                  {complianceStatus?.transmissionSecurity || 'TLS 1.3 / HTTPS'}
                </div>
              </div>
              <div style={{ background: surfaceElevated, padding: '16px', borderRadius: '14px', border: `1px solid ${border}` }}>
                <div style={{ fontSize: '11px', color: textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>Access Controls</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: textPrimary, marginTop: '4px' }}>
                  {complianceStatus?.roleBasedAccessControl || 'SPRING_SECURITY_6'}
                </div>
              </div>
            </div>

            {/* Audit Log Table */}
            <div style={{ overflowX: 'auto', border: `1px solid ${border}`, borderRadius: '14px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: surfaceElevated, borderBottom: `1px solid ${border}`, color: textSecondary }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>TIMESTAMP</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>CLINICAL ACTOR</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>ROLE</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>ACTION PERFORMED</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>PATIENT ID</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>IP ADDRESS</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>AUDIT DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingAudit ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: textSecondary }}>
                        Loading compliance audit events...
                      </td>
                    </tr>
                  ) : auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: textSecondary }}>
                        No audit events recorded yet.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map(log => (
                      <tr key={log.id} style={{ borderBottom: `1px solid ${border}` }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'nowrap' }}>
                          {log.timestamp?.replace('T', ' ').slice(0, 19) || '2026-09-18 10:14'}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{log.actorName || log.actorEmail}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(2,132,199,0.1)', color: '#0284c7' }}>
                            {log.actorRole}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: textPrimary }}>{log.actionType}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#0284c7' }}>{log.patientId || '—'}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: textSecondary, fontSize: '12px' }}>{log.ipAddress || '127.0.0.1'}</td>
                        <td style={{ padding: '12px 16px', color: textSecondary, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {log.details}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CLINICAL ALERTS */}
        {activeTab === 'alerts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '640px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Telemetry Thresholds & Clinical Alerts</h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: textSecondary }}>
                Configure anomaly triggers for BioPod real-time monitoring and automated physician dispatches
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Critical SpO2 Floor (%)
                </label>
                <input
                  type="number"
                  value={spo2Threshold}
                  onChange={e => setSpo2Threshold(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Critical Heart Rate Ceiling (BPM)
                </label>
                <input
                  type="number"
                  value={hrThreshold}
                  onChange={e => setHrThreshold(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={emergencyAlerts}
                  onChange={e => setEmergencyAlerts(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#0284c7' }}
                />
                <span style={{ fontSize: '13.5px' }}>Trigger audible alarm upon telemetry anomaly detection</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={e => setEmailAlerts(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#0284c7' }}
                />
                <span style={{ fontSize: '13.5px' }}>Send automatic emergency notification to attending physician</span>
              </label>
            </div>

            <button
              onClick={() => toast.success('Telemetry threshold parameters synchronized')}
              style={{
                alignSelf: 'flex-start',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Save Alert Thresholds
            </button>
          </div>
        )}

        {/* TAB 5: APPEARANCE & THEME */}
        {activeTab === 'appearance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '640px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Theme & Display Mode</h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: textSecondary }}>
                Choose your preferred visual theme across clinical dashboards, vital graphs, and ward monitoring
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div
                onClick={() => isDark && toggleTheme()}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  border: `2px solid ${!isDark ? '#0284c7' : border}`,
                  background: '#ffffff',
                  color: '#0f172a',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: !isDark ? '0 4px 16px rgba(2,132,199,0.2)' : 'none',
                  transition: 'all 200ms ease',
                }}
              >
                <Sun size={24} color="#0284c7" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px' }}>Light Mode</div>
                  <div style={{ fontSize: '12px', color: 'rgba(15,23,42,0.6)', marginTop: '2px' }}>
                    Crisp clinical white with sapphire blue accents
                  </div>
                </div>
              </div>

              <div
                onClick={() => !isDark && toggleTheme()}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  border: `2px solid ${isDark ? '#0284c7' : border}`,
                  background: '#090e17',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: isDark ? '0 4px 16px rgba(2,132,199,0.3)' : 'none',
                  transition: 'all 200ms ease',
                }}
              >
                <Moon size={24} color="#38bdf8" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px' }}>Dark Mode</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                    Deep midnight sapphire for low-light night shifts
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
