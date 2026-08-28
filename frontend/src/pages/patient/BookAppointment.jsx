import React, { useState, useEffect } from 'react';
import {
  Activity, Heart, Zap, User, CheckCircle2, Calendar, Clock,
  ArrowRight, ArrowLeft, Shield, DollarSign, Stethoscope, ChevronRight
} from 'lucide-react';
import { fetchDoctors, bookAppointment } from '../../services/api';
import { useGlobalToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export default function BookAppointment({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState('Neurology');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const { toast } = useGlobalToast();
  const { isDark } = useTheme();

  const loadDoctors = async () => {
    try {
      const data = await fetchDoctors();
      setDoctors(data);
      if (data.length > 0) {
        setSelectedDoc(data[0].id);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load doctors');
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleBook = async () => {
    if (!selectedDoc) {
      toast.error('Please choose a specialist physician');
      return;
    }
    setBooking(true);
    try {
      const timeParts = selectedTime.split(' ');
      let hh = parseInt(timeParts[0].split(':')[0], 10);
      if (timeParts[1] === 'PM' && hh !== 12) hh += 12;
      if (timeParts[1] === 'AM' && hh === 12) hh = 0;
      const mm = timeParts[0].split(':')[1];
      const formattedTime = `${hh.toString().padStart(2, '0')}:${mm}:00`;

      await bookAppointment({
        doctorId: selectedDoc,
        appointmentDate,
        appointmentTime: formattedTime,
        reason: reason || 'Routine specialist consultation',
        notes: ''
      });

      const ref = `CLV-APT-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingRef(ref);
      setIsBooked(true);
      toast.success('Appointment scheduled and confirmed!');
    } catch (err) {
      toast.error(err.message || 'Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

  const departments = [
    { id: 'Neurology', name: 'Neurology', icon: Activity, desc: 'Brain, spinal cord, and nervous system care' },
    { id: 'Cardiology', name: 'Cardiology', icon: Heart, desc: 'Heart conditions, rhythm, and cardiovascular health' },
    { id: 'Trauma Surgery', name: 'Trauma & Emergency', icon: Zap, desc: 'Acute critical injury and post-op review' },
  ];

  const times = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'];

  const bg = isDark ? '#090e17' : '#f0f4f8';
  const surface = isDark ? '#1e293b' : '#ffffff';
  const surfaceElevated = isDark ? '#283548' : '#f8fafc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  const borderStrong = isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : 'rgba(15,23,42,0.6)';

  const chosenDoctorObj = doctors.find(d => d.id === selectedDoc) || doctors[0];

  if (isBooked) {
    return (
      <div style={{ flex: 1, padding: '28px', background: bg, color: textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
        <div
          style={{
            background: surface,
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '520px',
            width: '100%',
            textAlign: 'center',
            border: `1px solid ${border}`,
            boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.4)' : '0 4px 20px rgba(15,23,42,0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>Appointment Confirmed!</h2>
          <p style={{ margin: 0, fontSize: '13.5px', color: textSecondary, lineHeight: 1.5 }}>
            Your consultation with <strong>{chosenDoctorObj?.name || 'Dr. Reyna Torres'}</strong> has been scheduled for <strong>{appointmentDate} at {selectedTime}</strong>.
          </p>

          <div style={{ background: surfaceElevated, border: `1px dashed ${borderStrong}`, padding: '12px 24px', borderRadius: '12px', marginTop: '8px' }}>
            <div style={{ fontSize: '11px', color: textSecondary, fontWeight: 700 }}>CLINICAL BOOKING PASS</div>
            <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace', color: '#0284c7', marginTop: '2px' }}>
              {bookingRef}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', width: '100%' }}>
            <button
              onClick={() => onNavigate && onNavigate('appointments')}
              style={{
                flex: 1,
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              View My Appointments
            </button>
            <button
              onClick={() => { setIsBooked(false); setStep(1); }}
              style={{
                flex: 1,
                background: surfaceElevated,
                color: textPrimary,
                border: `1px solid ${borderStrong}`,
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Schedule Specialist Consultation
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: textSecondary }}>
          Choose your clinical department, attending physician, and preferred consultation slot
        </p>
      </div>

      {/* Stepper Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '500px' }}>
        {[1, 2, 3].map((s, idx) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step >= s ? '#0284c7' : surfaceElevated,
                  color: step >= s ? '#ffffff' : textSecondary,
                  border: `1px solid ${step >= s ? '#0284c7' : borderStrong}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '13px',
                }}
              >
                {s}
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: step === s ? 700 : 500, color: step === s ? textPrimary : textSecondary }}>
                {s === 1 ? 'Specialist' : s === 2 ? 'Date & Time' : 'Review & Confirm'}
              </span>
            </div>
            {idx < 2 && <div style={{ flex: 1, height: '2px', background: step > s ? '#0284c7' : border }} />}
          </React.Fragment>
        ))}
      </div>

      {/* ── STEP 1: SPECIALIST & DEPARTMENT ── */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '780px' }}>
          {/* Department Choice */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {departments.map(dept => {
              const Icon = dept.icon;
              const isSelected = selectedDept === dept.id;
              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  style={{
                    background: surface,
                    border: `2px solid ${isSelected ? '#0284c7' : border}`,
                    borderRadius: '16px',
                    padding: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'all 150ms ease',
                    boxShadow: isSelected ? '0 4px 16px rgba(2,132,199,0.2)' : 'none',
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: isSelected ? '#0284c7' : surfaceElevated, color: isSelected ? '#ffffff' : '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{dept.name}</div>
                    <div style={{ fontSize: '12px', color: textSecondary, marginTop: '2px' }}>{dept.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Doctor List */}
          <div style={{ background: surface, borderRadius: '20px', padding: '24px', border: `1px solid ${border}` }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Available Specialists</h3>
            {loadingDocs ? (
              <div style={{ color: textSecondary, padding: '20px 0' }}>Loading doctors...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {doctors.map(doc => {
                  const isSelected = selectedDoc === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc.id)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '14px',
                        border: `1.5px solid ${isSelected ? '#0284c7' : border}`,
                        background: isSelected ? 'rgba(2,132,199,0.06)' : surfaceElevated,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                          {doc.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '15px' }}>{doc.name}</div>
                          <div style={{ fontSize: '12.5px', color: textSecondary }}>
                            {doc.specialization || 'Clinical Specialist'} • Verified Senior Consultant
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0284c7' }}>
                          ${doc.consultationFee || 150}
                        </div>
                        <div style={{ fontSize: '11px', color: textSecondary }}>Consultation Fee</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setStep(2)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '11px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Continue to Date & Time <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: DATE & TIME SELECTION ── */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '780px' }}>
          <div style={{ background: surface, borderRadius: '20px', padding: '24px', border: `1px solid ${border}`, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Select Consultation Date</h3>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Appointment Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={appointmentDate}
                onChange={e => setAppointmentDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: `1.5px solid ${borderStrong}`,
                  background: surfaceElevated,
                  color: textPrimary,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <h3 style={{ margin: '10px 0 0', fontSize: '16px', fontWeight: 700 }}>Available Time Slots</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              {times.map(t => {
                const isSelected = selectedTime === t;
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '10px',
                      border: `1.5px solid ${isSelected ? '#0284c7' : border}`,
                      background: isSelected ? '#0284c7' : surfaceElevated,
                      color: isSelected ? '#ffffff' : textPrimary,
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Reason for Consultation (Optional)</label>
              <textarea
                rows={2}
                placeholder="Briefly describe your symptoms or reason for visit..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: `1px solid ${borderStrong}`, background: surfaceElevated, color: textPrimary, fontSize: '13.5px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => setStep(1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: surface,
                color: textPrimary,
                border: `1px solid ${borderStrong}`,
                padding: '11px 20px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '11px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Review Booking <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: REVIEW & CONFIRM ── */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px' }}>
          <div style={{ background: surface, borderRadius: '20px', padding: '28px', border: `1px solid ${border}`, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Consultation Summary</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: surfaceElevated, padding: '14px', borderRadius: '12px', border: `1px solid ${border}` }}>
                <div style={{ fontSize: '11px', color: textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>SPECIALIST</div>
                <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '4px' }}>{chosenDoctorObj?.name || 'Dr. Reyna Torres'}</div>
                <div style={{ fontSize: '12px', color: textSecondary }}>{chosenDoctorObj?.specialization || 'Neurology'}</div>
              </div>

              <div style={{ background: surfaceElevated, padding: '14px', borderRadius: '12px', border: `1px solid ${border}` }}>
                <div style={{ fontSize: '11px', color: textSecondary, fontWeight: 700, textTransform: 'uppercase' }}>APPOINTMENT DATE & TIME</div>
                <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '4px' }}>{appointmentDate}</div>
                <div style={{ fontSize: '12px', color: textSecondary }}>{selectedTime} • 30 mins</div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${border}`, paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', color: textSecondary }}>Consultation Fee (Pay at Facility or Online)</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#0284c7' }}>${chosenDoctorObj?.consultationFee || 150}.00</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                <Shield size={16} /> Verified Cliniva Physician
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => setStep(2)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: surface,
                color: textPrimary,
                border: `1px solid ${borderStrong}`,
                padding: '11px 20px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              onClick={handleBook}
              disabled={booking}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: booking ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
              }}
            >
              {booking ? 'Confirming Visit...' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
