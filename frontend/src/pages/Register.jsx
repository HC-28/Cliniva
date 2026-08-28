import React, { useState } from 'react';
import {
  Shield, Eye, EyeOff, AlertCircle, ArrowRight,
  UserPlus, CheckCircle2, Lock, ArrowLeft, Stethoscope, HeartPulse, UserCheck, Sparkles
} from 'lucide-react';
import { registerUser } from '../services/api';
import ClinivaLogo from '../components/ClinivaLogo';

export default function Register({ onLogin, onSwitchToLogin }) {
  const [selectedRole, setSelectedRole] = useState('PATIENT'); // 'PATIENT' | 'DOCTOR' | 'NURSE'

  // Step 1 / Credentials
  const [firstName, setFirstName]             = useState('');
  const [lastName, setLastName]               = useState('');
  const [email, setEmail]                     = useState('');
  const [phone, setPhone]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Doctor / Nurse fields
  const [specialization, setSpecialization]   = useState('General Medicine');
  const [licenseNumber, setLicenseNumber]     = useState('');

  // Patient Fields - Step 2: Demographics & Clinical Profile
  const [dob, setDob]                         = useState('1998-05-14');
  const [gender, setGender]                   = useState('FEMALE');
  const [bloodGroup, setBloodGroup]           = useState('O+');
  const [heightCm, setHeightCm]               = useState('168');
  const [weightKg, setWeightKg]               = useState('62');

  // Patient Fields - Step 3: Emergency & Medical History
  const [emergencyName, setEmergencyName]     = useState('');
  const [emergencyPhone, setEmergencyPhone]   = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [allergies, setAllergies]             = useState('None known');
  const [consentTerms, setConsentTerms]       = useState(true);

  const [currentStep, setCurrentStep] = useState(1);
  const [showPass, setShowPass]       = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [staffSubmitted, setStaffSubmitted] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (currentStep === 1) {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
        setError('Please fill in all required account fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      if (selectedRole !== 'PATIENT') {
        // Direct submission for Staff with verification notice
        handleStaffSubmit();
        return;
      }

      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!consentTerms) {
        setError('You must accept the HIPAA Data Agreement to register.');
        return;
      }
      handlePatientSubmit();
    }
  };

  const handleStaffSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await registerUser({
        firstName,
        lastName,
        email,
        password,
        phoneNumber: phone,
        role: selectedRole,
        specialization,
        licenseNumber,
      });
      setStaffSubmitted(true);
    } catch (err) {
      setError(err.message || 'Staff registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const authData = await registerUser({
        firstName,
        lastName,
        email,
        password,
        phoneNumber: phone,
        role: 'PATIENT',
        dateOfBirth: dob,
        bloodGroup,
        emergencyContactName: emergencyName,
        emergencyContactPhone: emergencyPhone,
        emergencyContactRelation: emergencyRelation,
        allergies,
      });
      localStorage.setItem('cliniva_token', authData.token);
      localStorage.setItem('cliniva_user', JSON.stringify(authData));
      onLogin(authData);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
      {/* ── LEFT SECTION: Ultra-Clean Bespoke Dark Vector Telemetry Mesh ── */}
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

        {/* Center Showcase Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '520px', margin: '32px 0' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '100px',
              background: 'rgba(2, 132, 199, 0.2)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              marginBottom: '18px',
            }}
          >
            <UserPlus size={13} color="#38bdf8" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Role-Based Clinical Provisioning
            </span>
          </div>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.8px',
              margin: '0 0 16px 0',
              color: '#ffffff',
            }}
          >
            Join the Cliniva Autonomous Healthcare Network
          </h1>

          <p style={{ fontSize: '14.5px', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.6, margin: '0 0 28px 0' }}>
            Register as a patient for direct telehealth and telemetry monitoring, or submit verified credentials as attending clinical staff.
          </p>

          {/* Stepper / Features Matrix */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <HeartPulse size={15} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Patient Self-Service Portal</div>
                <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.55)' }}>Instant access to prescriptions, vitals telemetry & booking</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(124, 58, 237, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
                <Stethoscope size={15} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Clinical Staff Verification</div>
                <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.55)' }}>Doctor & Nurse registrations verified by Hospital Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Security */}
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
            <Lock size={13} color="#38bdf8" /> 256-Bit HIPAA Compliant Architecture
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={13} color="#10b981" /> SOC-2 Type II Certified
          </span>
        </div>
      </div>

      {/* ── RIGHT SECTION: High-End Registration Surface ── */}
      <div
        style={{
          flex: '1',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 40px',
          boxSizing: 'border-box',
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {staffSubmitted ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#0284c7' }}>
                <UserCheck size={32} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>
                Application Submitted!
              </h2>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                Your <strong>{selectedRole}</strong> credentials have been transmitted to the Hospital Administrator. Once verified, your account will be activated for clinical login.
              </p>
              <button
                onClick={onSwitchToLogin}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(2, 132, 199, 0.35)',
                }}
              >
                Return to Sign In &rarr;
              </button>
            </div>
          ) : (
            <>
              {/* Role Selection Tabs */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                  Select Account Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                  {[
                    { id: 'PATIENT', label: 'Patient' },
                    { id: 'DOCTOR',  label: 'Doctor' },
                    { id: 'NURSE',   label: 'Nurse' },
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => { setSelectedRole(r.id); setCurrentStep(1); setError(''); }}
                      style={{
                        padding: '8px 0',
                        borderRadius: '9px',
                        border: 'none',
                        background: selectedRole === r.id ? '#ffffff' : 'transparent',
                        color: selectedRole === r.id ? '#0284c7' : '#64748b',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxShadow: selectedRole === r.id ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 150ms ease',
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
                    {selectedRole === 'PATIENT' ? `Patient Onboarding (${currentStep}/3)` : `${selectedRole} Practitioner Registration`}
                  </h2>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0' }}>
                    {selectedRole === 'PATIENT' ? 'Instant access to patient dashboard' : 'Requires Hospital Administrator verification'}
                  </p>
                </div>
                {currentStep > 1 && selectedRole === 'PATIENT' && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#f1f5f9',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                )}
              </div>

              <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* ── STEP 1: All roles ── */}
                {currentStep === 1 && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          placeholder="e.g. Aria"
                          required
                          style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          placeholder="e.g. Vasquez"
                          required
                          style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Work Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder={selectedRole === 'PATIENT' ? 'patient@cliniva.io' : 'practitioner@hospital.org'}
                        required
                        style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Staff Specific Fields (Doctor/Nurse) */}
                    {selectedRole !== 'PATIENT' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                            {selectedRole === 'DOCTOR' ? 'Specialization' : 'Department'} *
                          </label>
                          <input
                            type="text"
                            value={specialization}
                            onChange={e => setSpecialization(e.target.value)}
                            placeholder="e.g. Cardiology / ICU"
                            required
                            style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                            Medical License # *
                          </label>
                          <input
                            type="text"
                            value={licenseNumber}
                            onChange={e => setLicenseNumber(e.target.value)}
                            placeholder="e.g. MED-89402"
                            required
                            style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Password *
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0 10px', height: '40px' }}>
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Min 6 chars"
                            required
                            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(v => !v)}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                          >
                            {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Confirm *
                        </label>
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          required
                          style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ── STEP 2 (Patient only) ── */}
                {currentStep === 2 && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={dob}
                          onChange={e => setDob(e.target.value)}
                          required
                          style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Biological Gender
                        </label>
                        <select
                          value={gender}
                          onChange={e => setGender(e.target.value)}
                          style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', background: '#ffffff', boxSizing: 'border-box' }}
                        >
                          <option value="FEMALE">Female</option>
                          <option value="MALE">Male</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Blood Group
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={e => setBloodGroup(e.target.value)}
                        style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', background: '#ffffff', boxSizing: 'border-box' }}
                      >
                        <option value="O+">O Positive (O+)</option>
                        <option value="O-">O Negative (O-)</option>
                        <option value="A+">A Positive (A+)</option>
                        <option value="A-">A Negative (A-)</option>
                        <option value="B+">B Positive (B+)</option>
                        <option value="B-">B Negative (B-)</option>
                        <option value="AB+">AB Positive (AB+)</option>
                        <option value="AB-">AB Negative (AB-)</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          value={heightCm}
                          onChange={e => setHeightCm(e.target.value)}
                          placeholder="168"
                          style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          value={weightKg}
                          onChange={e => setWeightKg(e.target.value)}
                          placeholder="62"
                          style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ── STEP 3 (Patient only) ── */}
                {currentStep === 3 && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Emergency Contact
                        </label>
                        <input
                          type="text"
                          value={emergencyName}
                          onChange={e => setEmergencyName(e.target.value)}
                          placeholder="e.g. Marco Vasquez"
                          style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={emergencyRelation}
                          onChange={e => setEmergencyRelation(e.target.value)}
                          placeholder="e.g. Spouse"
                          style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Emergency Phone
                      </label>
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={e => setEmergencyPhone(e.target.value)}
                        placeholder="+1 (555) 010-4821"
                        style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Drug Allergies
                      </label>
                      <input
                        type="text"
                        value={allergies}
                        onChange={e => setAllergies(e.target.value)}
                        placeholder="e.g. Penicillin, Sulfa"
                        style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', marginTop: '2px' }}>
                      <input
                        type="checkbox"
                        checked={consentTerms}
                        onChange={e => setConsentTerms(e.target.checked)}
                        style={{ width: '15px', height: '15px', marginTop: '2px', accentColor: '#0284c7' }}
                      />
                      <span style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                        I agree to the <strong>Cliniva Telehealth Consent & HIPAA Electronic Record Privacy Policy</strong>.
                      </span>
                    </label>
                  </>
                )}

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
                    <span style={{ fontSize: '12.5px', color: '#e11d48', fontWeight: 600 }}>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    height: '46px',
                    background: loading ? 'rgba(2, 132, 199, 0.6)' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(2, 132, 199, 0.35)',
                    marginTop: '4px',
                  }}
                >
                  {loading ? (
                    'Processing Registration...'
                  ) : selectedRole !== 'PATIENT' ? (
                    <>
                      <Shield size={15} />
                      <span>Submit for Admin Approval</span>
                    </>
                  ) : currentStep < 3 ? (
                    <>
                      <span>Continue to Step {currentStep + 1}</span>
                      <ArrowRight size={14} />
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Complete Patient Registration</span>
                    </>
                  )}
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '18px', marginBottom: 0 }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
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
                  Sign In &rarr;
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
