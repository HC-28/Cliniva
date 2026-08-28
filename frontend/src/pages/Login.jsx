import React, { useState } from 'react';
import {
  Shield, Eye, EyeOff, AlertCircle, Activity,
  Lock, ArrowRight, CheckCircle2, Clock, HeartPulse, Stethoscope
} from 'lucide-react';
import { loginUser } from '../services/api';
import ClinivaLogo from '../components/ClinivaLogo';

const DEMO_USERS = [
  { email: 'admin@cliniva.io',    password: 'admin123',  type: 'admin',   role: 'System Admin',     name: 'Dr. Admin',        avatar: 'SA' },
  { email: 'doctor@cliniva.io',   password: 'doctor123', type: 'doctor',  role: 'Attending Doctor', name: 'Dr. Reyna Torres', avatar: 'RT' },
  { email: 'nurse@cliniva.io',    password: 'nurse123',  type: 'nurse',   role: 'Head Nurse',       name: 'Nurse Aiko Sato',  avatar: 'AS' },
  { email: 'patient@cliniva.io',  password: 'patient123',type: 'patient', role: 'Patient',          name: 'Aria Vasquez',     avatar: 'AV' },
];

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsPending(false);
    setLoading(true);
    try {
      const authData = await loginUser(email, password);
      localStorage.setItem('cliniva_token', authData.token);
      localStorage.setItem('cliniva_user', JSON.stringify(authData));
      onLogin(authData);
    } catch (err) {
      if (err.message && err.message.includes('PENDING_APPROVAL')) {
        setIsPending(true);
      } else {
        setError(err.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setError('');
    setIsPending(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        overflow: 'hidden',
        background: '#080d1a',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* ── LEFT SECTION: Bespoke Vector ECG & Telemetry Command Center ── */}
      <div
        style={{
          flex: '1.15',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 56px',
          color: '#ffffff',
          background: 'radial-gradient(ellipse 80% 80% at 20% -10%, rgba(2, 132, 199, 0.28) 0%, transparent 65%), radial-gradient(ellipse 60% 60% at 85% 90%, rgba(124, 58, 237, 0.22) 0%, transparent 60%), #080d1a',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Background ECG Grid Lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.8,
            pointerEvents: 'none',
          }}
        />

        {/* Top Header & Brand */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <ClinivaLogo size={44} textColor="#ffffff" subtitle="Hospital Operating System" />
        </div>

        {/* Center Hero Messaging & Live Telemetry Card */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '520px', margin: '36px 0' }}>
          {/* Live Status Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '100px',
              background: 'rgba(5, 150, 105, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.45)',
              marginBottom: '18px',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 10px #10b981',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              BioTelemetry Engine Online
            </span>
          </div>

          <h1
            style={{
              fontSize: '34px',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-1px',
              margin: '0 0 16px 0',
              color: '#ffffff',
            }}
          >
            Autonomous Clinical Care & Vital Telemetry
          </h1>

          <p
            style={{
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.72)',
              lineHeight: 1.6,
              margin: '0 0 28px 0',
            }}
          >
            Centralized hospital intelligence delivering real-time patient telemetry, automated ward pod monitoring, and HIPAA-compliant record management.
          </p>

          {/* Live Stream Telemetry Widget */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '18px',
              padding: '18px 22px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="#38bdf8" />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#ffffff' }}>BioPod 04 — Active Stream</span>
              </div>
              <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                STABLE
              </span>
            </div>

            {/* Vital Signs Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', paddingTop: '6px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600 }}>HEART RATE</div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>74 <span style={{ fontSize: '11px', fontWeight: 500 }}>BPM</span></div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600 }}>OXYGEN (SpO2)</div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>99% <span style={{ fontSize: '11px', fontWeight: 500 }}>Normal</span></div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600 }}>BLOOD PRESSURE</div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#c084fc', marginTop: '2px' }}>120/80</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Accreditation */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={13} color="#38bdf8" /> 256-Bit Encrypted Healthcare Platform
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={13} color="#10b981" /> HIPAA & SOC-2 Type II Certified
          </span>
        </div>
      </div>

      {/* ── RIGHT SECTION: High-End Authentication Surface ── */}
      <div
        style={{
          flex: '1',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px 40px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.6px', margin: 0 }}>
              Sign in to Cliniva
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '6px 0 0' }}>
              Enter your clinical credentials or select a demo profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email field */}
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Work Email Address
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0 14px',
                  height: '46px',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease',
                }}
              >
                <input
                  id="cliniva-email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); setIsPending(false); }}
                  placeholder="name@cliniva.io"
                  required
                  autoComplete="email"
                  style={{
                    flex: 1,
                    fontSize: '14px',
                    color: '#0f172a',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                  }}
                  onFocus={e => {
                    e.currentTarget.parentElement.style.borderColor = '#0284c7';
                    e.currentTarget.parentElement.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.12)';
                  }}
                  onBlur={e => {
                    e.currentTarget.parentElement.style.borderColor = '#e2e8f0';
                    e.currentTarget.parentElement.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                  Password
                </label>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0 14px',
                  height: '46px',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease',
                }}
              >
                <input
                  id="cliniva-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); setIsPending(false); }}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    flex: 1,
                    fontSize: '14px',
                    color: '#0f172a',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                  }}
                  onFocus={e => {
                    e.currentTarget.parentElement.style.borderColor = '#0284c7';
                    e.currentTarget.parentElement.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.12)';
                  }}
                  onBlur={e => {
                    e.currentTarget.parentElement.style.borderColor = '#e2e8f0';
                    e.currentTarget.parentElement.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    color: '#94a3b8',
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    display: 'flex',
                    cursor: 'pointer',
                  }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Pending Verification Notice */}
            {isPending && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  background: 'rgba(2, 132, 199, 0.08)',
                  border: '1px solid rgba(2, 132, 199, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                }}
              >
                <Clock size={18} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0284c7' }}>Application Pending Review</div>
                  <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px', lineHeight: 1.4 }}>
                    Your clinical credentials are being verified by the Hospital Administrator. You will receive an email once activated.
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(225, 29, 72, 0.08)',
                  border: '1px solid rgba(225, 29, 72, 0.25)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                }}
              >
                <AlertCircle size={15} color="#e11d48" />
                <span style={{ fontSize: '13px', color: '#e11d48', fontWeight: 600 }}>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="cliniva-login-btn"
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '48px',
                background: loading ? 'rgba(2, 132, 199, 0.6)' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                borderRadius: '12px',
                fontSize: '14.5px',
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.35)',
                transition: 'all 200ms ease',
                marginTop: '4px',
              }}
            >
              {loading ? (
                'Signing in securely...'
              ) : (
                <>
                  <Shield size={16} />
                  <span>Sign in to Dashboard</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div
            style={{
              marginTop: '28px',
              padding: '16px',
              borderRadius: '16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Instant Demo Access
              </span>
              <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>1-Click Auto-Fill</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {DEMO_USERS.map(u => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => fillDemo(u)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: email === u.email ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    background: email === u.email ? 'rgba(2, 132, 199, 0.08)' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={e => { if (email !== u.email) e.currentTarget.style.background = '#f1f5f9'; }}
                  onMouseLeave={e => { if (email !== u.email) e.currentTarget.style.background = '#ffffff'; }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '7px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      fontWeight: 800,
                      color: '#ffffff',
                      flexShrink: 0,
                    }}
                  >
                    {u.avatar}
                  </div>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {u.name}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                      {u.type.charAt(0).toUpperCase() + u.type.slice(1)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Registration Link */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '22px', marginBottom: 0 }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              style={{
                background: 'none',
                border: 'none',
                color: '#0284c7',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 700,
                padding: 0,
              }}
            >
              Register (Patient / Doctor / Nurse) &rarr;
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
