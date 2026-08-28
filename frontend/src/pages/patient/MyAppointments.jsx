import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle2, XCircle, ArrowRight, Plus } from 'lucide-react';
import { fetchMyAppointments, cancelAppointment } from '../../services/api';
import { useGlobalToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export default function MyAppointments({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useGlobalToast();
  const { isDark } = useTheme();

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await fetchMyAppointments();
      setAppointments(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id, 'Patient requested cancellation');
      toast.success('Appointment cancelled successfully');
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
    } catch (err) {
      toast.error(err.message || 'Failed to cancel appointment');
    }
  };

  const upcomingApps = appointments.filter(a => ['CONFIRMED', 'SCHEDULED'].includes(a.status));
  const pastApps = appointments.filter(a => ['COMPLETED', 'CANCELLED'].includes(a.status));
  const displayed = activeTab === 'upcoming' ? upcomingApps : pastApps;

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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            My Consultations & Appointments
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: textSecondary }}>
            Review your scheduled clinical sessions, department locations, and booking history
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: surface, padding: '4px', borderRadius: '12px', border: `1px solid ${border}` }}>
            <button
              onClick={() => setActiveTab('upcoming')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'upcoming' ? '#0284c7' : 'transparent',
                color: activeTab === 'upcoming' ? '#ffffff' : textSecondary,
                fontWeight: activeTab === 'upcoming' ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              Upcoming ({upcomingApps.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'past' ? '#0284c7' : 'transparent',
                color: activeTab === 'past' ? '#ffffff' : textSecondary,
                fontWeight: activeTab === 'past' ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              History ({pastApps.length})
            </button>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('book')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '9px 18px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13.5px',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
            }}
          >
            <Plus size={16} /> Book New
          </button>
        </div>
      </div>

      {/* Appointment Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: textSecondary }}>
          Loading your appointment schedule...
        </div>
      ) : displayed.length === 0 ? (
        <div
          style={{
            background: surface,
            borderRadius: '20px',
            padding: '48px 24px',
            textAlign: 'center',
            border: `1px solid ${border}`,
            color: textSecondary,
          }}
        >
          <Calendar size={40} color={textSecondary} style={{ opacity: 0.4, marginBottom: '12px' }} />
          <div style={{ fontWeight: 700, fontSize: '16px', color: textPrimary }}>
            No {activeTab === 'upcoming' ? 'upcoming appointments' : 'past visits'} found
          </div>
          <p style={{ fontSize: '13px', margin: '4px 0 16px' }}>
            {activeTab === 'upcoming' ? 'Need to see a specialist? Book your appointment online.' : 'Completed appointments will appear here.'}
          </p>
          {activeTab === 'upcoming' && (
            <button
              onClick={() => onNavigate && onNavigate('book')}
              style={{
                background: '#0284c7',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Book Appointment
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {displayed.map(app => {
            const dateParts = app.appointmentDate ? app.appointmentDate.split('-') : ['2026', '08', '25'];
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const monthName = months[parseInt(dateParts[1], 10) - 1] || 'AUG';
            const dayNum = dateParts[2] || '25';

            return (
              <div
                key={app.id}
                style={{
                  background: surface,
                  borderRadius: '18px',
                  padding: '22px',
                  border: `1px solid ${border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(15,23,42,0.04)',
                  flexWrap: 'wrap',
                }}
              >
                {/* Date Block */}
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '16px',
                    background: 'rgba(2, 132, 199, 0.1)',
                    border: '1px solid rgba(2, 132, 199, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>{monthName}</span>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: textPrimary, lineHeight: 1 }}>{dayNum}</span>
                  <span style={{ fontSize: '10px', color: textSecondary }}>{dateParts[0]}</span>
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: textPrimary }}>
                      {app.doctorName || 'Dr. Reyna Torres'}
                    </h3>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: app.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.12)' : app.status === 'CANCELLED' ? 'rgba(225, 29, 72, 0.12)' : 'rgba(2, 132, 199, 0.12)',
                        color: app.status === 'CONFIRMED' ? '#10b981' : app.status === 'CANCELLED' ? '#e11d48' : '#0284c7',
                      }}
                    >
                      {app.status || 'SCHEDULED'}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: textSecondary, marginBottom: '8px' }}>
                    {app.doctorSpecialization || 'Neurology'} • {app.reason || 'General Clinical Review'}
                  </div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: textSecondary, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={14} color="#0284c7" /> {app.appointmentTime || '10:00 AM'} ({app.durationMinutes || 30} mins)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={14} color="#7c3aed" /> Main Clinical Wing • Ward 3B
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {['CONFIRMED', 'SCHEDULED'].includes(app.status) && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleCancel(app.id)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        border: `1px solid ${borderStrong}`,
                        background: surfaceElevated,
                        color: '#e11d48',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel Visit
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
