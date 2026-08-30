import React, { useState, useEffect } from 'react';
import { Calendar, User, FileText, Pill, Stethoscope, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchDoctors, fetchMyAppointments } from '../services/api';

export default function DoctorDashboard({ user = { name: 'Doctor', role: 'Attending Doctor' } }) {
  const { isDark } = useTheme();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const appointments = [
    { time: '09:00', patient: 'Aria Vasquez', reason: 'Neuro Follow-up', status: 'Completed', avatar: 'AV' },
    { time: '10:30', patient: 'Marcus Chen', reason: 'Cardiac Follow-up', status: 'In Progress', avatar: 'MC' },
    { time: '11:45', patient: 'James Okafor', reason: 'Consultation', status: 'Upcoming', avatar: 'JO' },
    { time: '14:00', patient: 'Mira Patel', reason: 'Trauma Review', status: 'Upcoming', avatar: 'MP' },
    { time: '15:30', patient: 'Elena Vance', reason: 'EEG Review', status: 'Upcoming', avatar: 'EV' },
  ];

  const recentPatients = [
    { name: 'Aria Vasquez', ward: 'Neuro Ward · Pod 02', severity: 'green', status: 'Normal vitals' },
    { name: 'Marcus Chen', ward: 'Cardiac Ward · Pod 05', severity: 'green', status: 'Normal vitals' },
    { name: 'Mira Patel', ward: 'Trauma ICU · Pod 01', severity: 'red', status: 'Elevated HR (118 bpm)' },
    { name: 'James Okafor', ward: 'Cardiac Ward · Pod 04', severity: 'green', status: 'Post-op stable' },
    { name: 'Lena Müller', ward: 'Neuro Ward · Pod 08', severity: 'amber', status: 'SpO2 93%' },
  ];

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        minWidth: 0,
        padding: '28px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        background: isDark ? '#090e17' : '#f0f4f8',
        color: isDark ? '#f8fafc' : '#0f172a',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, letterSpacing: '-0.6px', color: isDark ? '#f8fafc' : '#0f172a' }}>
            {getGreeting()}, {user?.name || 'Dr. Torres'}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)' }}>
            Here is your active clinical summary and ward telemetry for today
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: isDark ? '#1e293b' : '#ffffff',
            padding: '8px 16px',
            borderRadius: '12px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.04)',
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
            Doctor Station Online
          </span>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        <div
          style={{
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '20px',
            padding: '22px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(15,23,42,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} color="#0284c7" />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', lineHeight: 1 }}>5</div>
            <div style={{ fontSize: '13px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)', marginTop: '4px', fontWeight: 600 }}>
              Today's Consultations
            </div>
          </div>
        </div>

        <div
          style={{
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '20px',
            padding: '22px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(15,23,42,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(124, 58, 237, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={22} color="#a855f7" />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', lineHeight: 1 }}>9</div>
            <div style={{ fontSize: '13px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)', marginTop: '4px', fontWeight: 600 }}>
              Patients Under Care
            </div>
          </div>
        </div>

        <div
          style={{
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '20px',
            padding: '22px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(15,23,42,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(217, 119, 6, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', lineHeight: 1 }}>2</div>
            <div style={{ fontSize: '13px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)', marginTop: '4px', fontWeight: 600 }}>
              Pending Diagnostic Reviews
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Schedule & Assigned Patients Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '22px' }}>
        {/* Today's Schedule Card */}
        <div
          style={{
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.35)' : '0 4px 16px rgba(15,23,42,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: isDark ? '#f8fafc' : '#0f172a' }}>
              Today's Consultation Schedule
            </h2>
            <span style={{ fontSize: '11.5px', color: '#0284c7', background: 'rgba(2, 132, 199, 0.12)', padding: '3px 10px', borderRadius: '10px', fontWeight: 700 }}>
              {appointments.length} Consultations
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {appointments.map((appt, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: isDark ? '#0f172a' : '#f8fafc',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
                }}
              >
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0284c7', width: '50px', fontFamily: "'JetBrains Mono', monospace" }}>
                  {appt.time}
                </div>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '9px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {appt.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {appt.patient}
                  </div>
                  <div style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b' }}>
                    {appt.reason}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '8px',
                    background: appt.status === 'Completed'
                      ? 'rgba(5, 150, 105, 0.15)'
                      : appt.status === 'In Progress'
                      ? 'rgba(217, 119, 6, 0.15)'
                      : 'rgba(2, 132, 199, 0.15)',
                    color: appt.status === 'Completed'
                      ? '#10b981'
                      : appt.status === 'In Progress'
                      ? '#f59e0b'
                      : '#0284c7',
                  }}
                >
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Patients Card */}
        <div
          style={{
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.35)' : '0 4px 16px rgba(15,23,42,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: isDark ? '#f8fafc' : '#0f172a' }}>
              My Inpatient Roster
            </h2>
            <span style={{ fontSize: '11.5px', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '3px 10px', borderRadius: '10px', fontWeight: 700 }}>
              Live Telemetry Linked
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentPatients.map((p, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: isDark ? '#0f172a' : '#f8fafc',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '9px',
                    background: 'rgba(2, 132, 199, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0284c7',
                    fontSize: '11px',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b' }}>
                    {p.ward} · <span style={{ color: p.severity === 'red' ? '#e11d48' : isDark ? '#94a3b8' : '#64748b' }}>{p.status}</span>
                  </div>
                </div>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: p.severity === 'red' ? '#e11d48' : p.severity === 'amber' ? '#f59e0b' : '#10b981',
                    boxShadow: p.severity === 'red' ? '0 0 8px #e11d48' : 'none',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
