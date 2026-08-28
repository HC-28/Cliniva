import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Pill, ChevronRight, Activity, Clock, Heart, Shield, ArrowUpRight } from 'lucide-react';
import { fetchMyAppointments, fetchMyPrescriptions } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export default function PatientHome({ user, onNavigate }) {
  const { isDark } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [apps, rxs] = await Promise.all([
          fetchMyAppointments().catch(() => []),
          fetchMyPrescriptions().catch(() => [])
        ]);
        if (isMounted) {
          setAppointments(apps.filter(a => ['CONFIRMED', 'SCHEDULED'].includes(a.status)));
          setPrescriptions(rxs);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const bg = isDark ? '#090e17' : '#f0f4f8';
  const surface = isDark ? '#1e293b' : '#ffffff';
  const surfaceElevated = isDark ? '#283548' : '#f8fafc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  const borderStrong = isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : 'rgba(15,23,42,0.6)';

  const userName = user?.name || 'Aria Vasquez';

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '28px',
        overflowY: 'auto',
        background: bg,
        color: textPrimary,
        boxSizing: 'border-box',
      }}
    >
      {/* ── HERO BANNER ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 8px 32px rgba(2,132,199,0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Welcome back, {userName}! 👋
            </h1>
            <p style={{ margin: '6px 0 0', opacity: 0.9, fontSize: '15px' }}>
              Your verified clinical summary & personal care dashboard
            </p>
          </div>

          {/* Health Score Gauge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', padding: '12px 20px', borderRadius: '18px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.85, fontWeight: 600 }}>
                Health Vitality
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Optimal Range</div>
            </div>
            <div style={{ position: 'relative', width: '56px', height: '56px' }}>
              <svg style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }} viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeDasharray="88, 100" strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px', fontFamily: 'monospace' }}>
                88
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '18px' }}>
          <div>
            <div style={{ fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', fontWeight: 600 }}>NEXT APPOINTMENT</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>
              {appointments[0] ? `${appointments[0].appointmentDate || 'Aug 25'} • 10:00 AM` : 'No upcoming visits'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', fontWeight: 600 }}>ACTIVE PRESCRIPTIONS</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>
              {prescriptions.length || 3} Medications
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', fontWeight: 600 }}>SECURITY STATUS</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={16} /> HIPAA Encrypted
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTION CARDS ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div
          onClick={() => onNavigate && onNavigate('book')}
          style={{
            background: surface,
            borderRadius: '18px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            border: `1px solid ${border}`,
            boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(15,23,42,0.04)',
            transition: 'transform 150ms ease, border-color 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#0284c7'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = border; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(2,132,199,0.12)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: textPrimary }}>Book Appointment</div>
              <div style={{ fontSize: '12px', color: textSecondary, marginTop: '2px' }}>Schedule visits with specialists</div>
            </div>
          </div>
          <ChevronRight size={18} color={textSecondary} />
        </div>

        <div
          onClick={() => onNavigate && onNavigate('history')}
          style={{
            background: surface,
            borderRadius: '18px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            border: `1px solid ${border}`,
            boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(15,23,42,0.04)',
            transition: 'transform 150ms ease, border-color 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#7c3aed'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = border; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(124,58,237,0.12)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: textPrimary }}>Medical History</div>
              <div style={{ fontSize: '12px', color: textSecondary, marginTop: '2px' }}>Lab tests, reports, and records</div>
            </div>
          </div>
          <ChevronRight size={18} color={textSecondary} />
        </div>

        <div
          onClick={() => onNavigate && onNavigate('prescriptions')}
          style={{
            background: surface,
            borderRadius: '18px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            border: `1px solid ${border}`,
            boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(15,23,42,0.04)',
            transition: 'transform 150ms ease, border-color 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#059669'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = border; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(5,150,105,0.12)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: textPrimary }}>My Prescriptions</div>
              <div style={{ fontSize: '12px', color: textSecondary, marginTop: '2px' }}>Dosages and refill status</div>
            </div>
          </div>
          <ChevronRight size={18} color={textSecondary} />
        </div>
      </div>

      {/* ── 2 COLUMN MAIN CONTENT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Left Column: Upcoming Appointments */}
        <div
          style={{
            background: surface,
            borderRadius: '20px',
            padding: '24px',
            border: `1px solid ${border}`,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 10px rgba(15,23,42,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>Upcoming Consultations</h2>
            <button
              onClick={() => onNavigate && onNavigate('book')}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12.5px',
              }}
            >
              Book New
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px',
                borderRadius: '14px',
                background: surfaceElevated,
                borderLeft: '4px solid #0284c7',
                border: `1px solid ${border}`,
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(2,132,199,0.15)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                RT
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>Dr. Reyna Torres</div>
                <div style={{ fontSize: '12px', color: textSecondary }}>Neurology Checkup & Follow-up</div>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 600, padding: '4px 10px', borderRadius: '8px', background: 'rgba(2,132,199,0.1)', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> Aug 25, 10:00 AM
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px',
                borderRadius: '14px',
                background: surfaceElevated,
                borderLeft: '4px solid #7c3aed',
                border: `1px solid ${border}`,
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(124,58,237,0.15)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                LC
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>Dr. Lucas Chen</div>
                <div style={{ fontSize: '12px', color: textSecondary }}>Cardiovascular ECG Review</div>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 600, padding: '4px 10px', borderRadius: '8px', background: 'rgba(124,58,237,0.1)', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> Sep 5, 2:30 PM
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Active Medications */}
        <div
          style={{
            background: surface,
            borderRadius: '20px',
            padding: '24px',
            border: `1px solid ${border}`,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 2px 10px rgba(15,23,42,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>Active Prescriptions</h2>
            <button
              onClick={() => onNavigate && onNavigate('prescriptions')}
              style={{
                background: 'transparent',
                color: '#0284c7',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '12px', background: surfaceElevated, border: `1px solid ${border}` }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(5,150,105,0.12)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pill size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>Sertraline 50mg</div>
                <div style={{ fontSize: '12px', color: textSecondary }}>Once daily in morning • 2 refills left</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(5,150,105,0.12)', color: '#10b981' }}>
                ACTIVE
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '12px', background: surfaceElevated, border: `1px solid ${border}` }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(5,150,105,0.12)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pill size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>Metoprolol 25mg</div>
                <div style={{ fontSize: '12px', color: textSecondary }}>Twice daily with meals • 1 refill left</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(5,150,105,0.12)', color: '#10b981' }}>
                ACTIVE
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '12px', background: surfaceElevated, border: `1px solid ${border}` }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(5,150,105,0.12)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pill size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: textPrimary }}>Atorvastatin 10mg</div>
                <div style={{ fontSize: '12px', color: textSecondary }}>Once at night before sleep • 3 refills left</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(5,150,105,0.12)', color: '#10b981' }}>
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
