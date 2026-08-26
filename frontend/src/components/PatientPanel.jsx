import React, { useState, useEffect, useRef } from 'react';
import { X, Activity, Pill, Brain, ChevronRight, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

// Holographic DNA helix visualizer using SVG paths
function HolographicVisualizer({ patientId }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const raf = setInterval(() => {
      setPhase(p => (p + 0.02) % (Math.PI * 2));
    }, 30);
    return () => clearInterval(raf);
  }, []);

  const width = 200;
  const height = 140;
  const cx = width / 2;
  const cy = height / 2;
  const r = 50;
  const waves = 3;
  const segments = 40;

  // Generate sinusoidal helix paths
  const topPath = Array.from({ length: segments }, (_, i) => {
    const t = (i / (segments - 1)) * Math.PI * waves + phase;
    const x = (i / (segments - 1)) * width;
    const y = cy + Math.sin(t) * 45 * (1 - Math.abs((i / (segments - 1)) - 0.5) * 0.3);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  const bottomPath = Array.from({ length: segments }, (_, i) => {
    const t = (i / (segments - 1)) * Math.PI * waves + phase + Math.PI;
    const x = (i / (segments - 1)) * width;
    const y = cy + Math.sin(t) * 45 * (1 - Math.abs((i / (segments - 1)) - 0.5) * 0.3);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  // Cross-links
  const crossLinks = Array.from({ length: 12 }, (_, i) => {
    const pct = (i / 11);
    const t1 = pct * Math.PI * waves + phase;
    const t2 = pct * Math.PI * waves + phase + Math.PI;
    const x = pct * width;
    const y1 = cy + Math.sin(t1) * 45 * (1 - Math.abs(pct - 0.5) * 0.3);
    const y2 = cy + Math.sin(t2) * 45 * (1 - Math.abs(pct - 0.5) * 0.3);
    const mid = (y1 + y2) / 2;
    const visible = Math.abs(y1 - y2) > 5;
    const alpha = visible ? Math.min(1, (Math.abs(y1 - y2) / 60)) * 0.5 : 0;
    const color = i % 3 === 0 ? '#0284c7' : i % 3 === 1 ? '#7c3aed' : '#059669';
    return { x, y1, y2, alpha, color, visible };
  });

  return (
    <div style={{
      position: 'relative',
      background: 'rgba(240,244,248,0.6)',
      borderRadius: '14px',
      border: '1px solid rgba(2,132,199,0.12)',
      overflow: 'hidden',
      padding: '4px',
    }}>
      {/* Scan line effect */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(2,132,199,0.3), transparent)',
        animation: 'scan-line 2.5s linear infinite',
        pointerEvents: 'none',
      }} />

      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="strand1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0" />
            <stop offset="20%" stopColor="#0284c7" stopOpacity="0.7" />
            <stop offset="80%" stopColor="#7c3aed" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="strand2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0" />
            <stop offset="20%" stopColor="#7c3aed" stopOpacity="0.7" />
            <stop offset="80%" stopColor="#059669" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background grid */}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={0} y1={(i / 6) * height} x2={width} y2={(i / 6) * height}
            stroke="rgba(15,23,42,0.05)" strokeWidth="1" />
        ))}

        {/* Cross links */}
        {crossLinks.map((link, i) => link.visible && (
          <line key={i}
            x1={link.x} y1={link.y1} x2={link.x} y2={link.y2}
            stroke={link.color} strokeWidth="1.5" strokeOpacity={link.alpha}
            strokeLinecap="round"
            filter="url(#glow)"
          />
        ))}

        {/* Helix strands */}
        <path d={topPath} fill="none" stroke="url(#strand1)" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)" />
        <path d={bottomPath} fill="none" stroke="url(#strand2)" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow)" />

        {/* Data points on helix */}
        {crossLinks.map((link, i) => (
          <g key={`dot-${i}`}>
            <circle cx={link.x} cy={link.y1} r="2.5" fill={link.color} fillOpacity={link.alpha * 1.8} filter="url(#glow)" />
            <circle cx={link.x} cy={link.y2} r="2.5" fill={link.color} fillOpacity={link.alpha * 1.8} filter="url(#glow)" />
          </g>
        ))}

        {/* Center label */}
        <text x={width / 2} y={height / 2 + 4} textAnchor="middle"
          fill="rgba(2,132,199,0.45)" fontSize="7" fontFamily="'JetBrains Mono',monospace" letterSpacing="0.1em">
          BIO-HELIX SCAN · {patientId}
        </text>
      </svg>
    </div>
  );
}

const DIAGNOSES = [
  { code: 'G35.1', name: 'Vestibular Dysregulation', severity: 'moderate', active: true },
  { code: 'R00.8', name: 'Cardiac Rhythm Variance', severity: 'stable', active: true },
  { code: 'J96.01', name: 'Acute Hypoxic Episode', severity: 'resolved', active: false },
];

const MEDICATIONS = [
  { name: 'Norepinephrine IV', dose: '0.2 mcg/kg/min', schedule: 'Continuous', color: '#0284c7' },
  { name: 'Methylprednisolone', dose: '40mg', schedule: 'Q8H', color: '#7c3aed' },
  { name: 'Enoxaparin', dose: '60mg', schedule: 'Q12H', color: '#059669' },
];

const SEVERITY_CONF = {
  moderate: { color: '#d97706', label: 'MODERATE' },
  stable: { color: '#059669', label: 'STABLE' },
  critical: { color: '#e11d48', label: 'CRITICAL' },
  resolved: { color: 'rgba(15,23,42,0.3)', label: 'RESOLVED' },
};

export default function PatientPanel({ selectedPod, onClose }) {
  const patient = selectedPod ? {
    name: selectedPod.patient,
    id: selectedPod.id === 'CLV-00421' ? 'CLV-00421' : `CLV-00${Math.floor(Math.random() * 900) + 100}`,
    pod: selectedPod.id,
    doctor: selectedPod.doctor,
    ward: selectedPod.ward,
    age: 32,
    bloodGroup: 'O+',
    admittedOn: '12 Aug 2026',
  } : {
    name: 'Aria Vasquez',
    id: 'CLV-00421',
    pod: 'A-1',
    doctor: 'Dr. R. Torres',
    ward: 'Neuro',
    age: 32,
    bloodGroup: 'O+',
    admittedOn: '12 Aug 2026',
  };

  return (
    <div style={{
      width: '320px',
      flexShrink: 0,
      background: '#ffffff',
      borderLeft: '1px solid rgba(15,23,42,0.09)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'slideInRight 0.3s ease both',
      boxShadow: '-4px 0 20px rgba(15,23,42,0.06)',
    }}>
      {/* Panel Header */}
      <div style={{
        padding: '18px 20px 14px',
        borderBottom: '1px solid rgba(15,23,42,0.07)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(2,132,199,0.75)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            Patient Quick-View
          </div>
          {onClose && (
            <button onClick={onClose} style={{ color: 'rgba(15,23,42,0.35)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '2px', transition: 'color 150ms ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(15,23,42,0.35)'}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Patient Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(2,132,199,0.12) 0%, rgba(124,58,237,0.12) 100%)',
            border: '1px solid rgba(2,132,199,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            fontSize: '18px', fontWeight: 700, color: '#0284c7',
          }}>
            {patient.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{patient.name}</div>
            <div style={{ fontSize: '11px', color: '#0284c7', fontFamily: "'JetBrains Mono',monospace", marginTop: '2px' }}>{patient.id}</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(15,23,42,0.45)', background: 'rgba(15,23,42,0.05)', padding: '1px 6px', borderRadius: '100px' }}>
                Age {patient.age}
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(15,23,42,0.45)', background: 'rgba(15,23,42,0.05)', padding: '1px 6px', borderRadius: '100px' }}>
                {patient.bloodGroup}
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(5,150,105,0.85)', background: 'rgba(5,150,105,0.09)', padding: '1px 6px', borderRadius: '100px' }}>
                Pod {patient.pod}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px' }}>
          {[
            { label: 'Admitted', value: patient.admittedOn },
            { label: 'Attending', value: patient.doctor },
            { label: 'Ward', value: patient.ward },
            { label: 'Coverage', value: 'Full Plan' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'rgba(15,23,42,0.03)', border: '1px solid rgba(15,23,42,0.07)',
              borderRadius: '10px', padding: '8px 10px',
            }}>
              <div style={{ fontSize: '10px', color: 'rgba(15,23,42,0.38)', marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '11.5px', color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* Holographic Visualizer */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(15,23,42,0.45)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Diagnostic Visualizer
          </div>
          <HolographicVisualizer patientId={patient.id} />
        </div>

        {/* Active Diagnoses */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(15,23,42,0.45)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Brain size={11} /> Active Diagnoses
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {DIAGNOSES.map(dx => {
              const conf = SEVERITY_CONF[dx.severity];
              return (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'rgba(15,23,42,0.03)', border: '1px solid rgba(15,23,42,0.07)',
                  borderRadius: '10px', padding: '9px 11px',
                }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50',
                    background: conf.color, flexShrink: 0, borderRadius: '50%',
                    boxShadow: dx.active ? `0 0 5px ${conf.color}80` : 'none',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', color: dx.active ? '#0f172a' : 'rgba(15,23,42,0.4)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dx.name}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(15,23,42,0.35)', fontFamily: "'JetBrains Mono',monospace", marginTop: '1px' }}>{dx.code}</div>
                  </div>
                  <span style={{
                    fontSize: '9px', fontWeight: 600, letterSpacing: '0.04em',
                    color: conf.color, background: `${conf.color}18`, padding: '2px 6px', borderRadius: '100px',
                    flexShrink: 0,
                  }}>
                    {conf.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Medications */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(15,23,42,0.45)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Pill size={11} /> Medications
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {MEDICATIONS.map(med => (
              <div key={med.name} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(15,23,42,0.03)', border: '1px solid rgba(15,23,42,0.07)',
                borderRadius: '10px', padding: '9px 11px',
              }}>
                <div style={{
                  width: '3px', height: '30px', borderRadius: '100px',
                  background: med.color, flexShrink: 0,
                  boxShadow: `0 0 5px ${med.color}50`,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{med.name}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(15,23,42,0.45)', marginTop: '1px' }}>
                    <span style={{ color: med.color }}>{med.dose}</span> · {med.schedule}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', paddingBottom: '8px' }}>
          <button style={{
            flex: 1, padding: '9px 0', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
            color: '#0284c7', background: 'rgba(2,132,199,0.07)', border: '1px solid rgba(2,132,199,0.2)',
            cursor: 'pointer', transition: 'all 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(2,132,199,0.14)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(2,132,199,0.07)'; }}
          >
            Full Record
          </button>
          <button style={{
            flex: 1, padding: '9px 0', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
            color: '#0f172a', background: 'rgba(15,23,42,0.05)', border: '1px solid rgba(15,23,42,0.09)',
            cursor: 'pointer', transition: 'all 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.09)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.05)'; }}
          >
            Prescribe
          </button>
        </div>
      </div>
    </div>
  );
}
