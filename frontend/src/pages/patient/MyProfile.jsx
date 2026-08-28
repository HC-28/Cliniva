import React, { useState, useEffect } from 'react';
import { Pencil, Plus, X } from 'lucide-react';
import { fetchMyProfile, updateMyProfile } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/Toast';

export default function MyProfile({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toasts, toast, removeToast } = useToast();

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await fetchMyProfile();
      setProfile(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateMyProfile(profile);
      setProfile(updated);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', overflowY: 'auto', backgroundColor: '#f0f4f8', fontFamily: '"Plus Jakarta Sans", sans-serif', minHeight: '100vh', color: '#0f172a' },
    header: { display: 'flex', flexDirection: 'column', gap: '4px' },
    title: { margin: 0, fontSize: '24px', fontWeight: 'bold' },
    subtitle: { margin: 0, fontSize: '15px', color: 'rgba(15,23,42,0.45)' },
    card: { backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(15,23,42,0.06)' },
    profileTop: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', position: 'relative' },
    avatarCircle: { width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold' },
    profileInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
    profileName: { margin: 0, fontSize: '20px', fontWeight: 'bold' },
    patientId: { margin: 0, fontSize: '14px', color: 'rgba(15,23,42,0.45)', fontFamily: '"JetBrains Mono", monospace' },
    editBtn: { position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', padding: '8px' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '13px', fontWeight: '600', color: 'rgba(15,23,42,0.6)' },
    input: { padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '15px', fontFamily: 'inherit', color: '#0f172a', outline: 'none' },
    select: { padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '15px', fontFamily: 'inherit', color: '#0f172a', outline: 'none', backgroundColor: '#fff' },
    saveBtn: { width: '100%', padding: '14px', backgroundColor: saving ? '#94a3b8' : '#0284c7', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Profile</h1>
        <p style={styles.subtitle}>Manage your personal and medical information</p>
      </div>

      {loading ? (
        <div style={styles.card}>
          <p>Loading profile...</p>
        </div>
      ) : profile && (
        <div style={styles.card}>
          <div style={styles.profileTop}>
            <div style={styles.avatarCircle}>{profile.firstName[0]}{profile.lastName[0]}</div>
            <div style={styles.profileInfo}>
              <h2 style={styles.profileName}>{profile.firstName} {profile.lastName}</h2>
              <p style={styles.patientId}>Patient ID: {profile.patientId}</p>
            </div>
            <button style={styles.editBtn}><Pencil size={20} /></button>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>First Name</label>
              <input style={styles.input} name="firstName" value={profile.firstName || ''} onChange={handleChange} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Last Name</label>
              <input style={styles.input} name="lastName" value={profile.lastName || ''} onChange={handleChange} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Blood Group</label>
              <select style={styles.select} name="bloodGroup" value={profile.bloodGroup || ''} onChange={handleChange}>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone</label>
              <input style={styles.input} name="phoneNumber" value={profile.phoneNumber || ''} onChange={handleChange} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input style={styles.input} name="email" value={profile.email || ''} onChange={handleChange} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Emergency Contact</label>
              <input style={styles.input} name="emergencyContactName" value={profile.emergencyContactName || ''} onChange={handleChange} />
            </div>
          </div>
          <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
