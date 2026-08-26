import React, { useState } from 'react';
import { Clock, ChevronRight, Circle, Stethoscope, FlaskConical, Brain, Heart, Bone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PROCEDURES = [
  {
    time: '08:30',
    patient: 'Aria Vasquez',
    id: 'CLV-00421',
    procedure: 'Neuro-Cognitive Scan',
    doctor: 'Dr. R. Torres',
    pod: 'A-1',
    type: 'neuro',
    duration: '45min',
    status: 'in-progress',
  },
  {
    time: '09:15',
    patient: 'Marcus Chen',
    id: 'CLV-00387',
    procedure: 'Cardiac Bio-Impedance',
    doctor: 'Dr. L. Chen',
    pod: 'B-1',
    type: 'cardiac',
    duration: '30min',
    status: 'upcoming',
  },
  {
    time: '10:00',
    patient: 'Mira Patel',
    id: 'CLV-00409',
    procedure: 'Trauma Stabilization Protocol',
    doctor: 'Dr. Y. Wu',
    pod: 'A-4',
    type: 'trauma',
    duration: '60min',
    status: 'upcoming',
  },
  {
    time: '11:30',
    patient: 'James Okafor',
    id: 'CLV-00366',
    procedure: 'Pulmonary Function Analysis',
    doctor: 'Dr. A. Osei',
    pod: 'A-3',
    type: 'pulmo',
    duration: '20min',
    status: 'upcoming',
  },
  {
    time: '13:00',
    patient: 'Lena Müller',
    id: 'CLV-00391',
    procedure: 'Orthopedic Pressure Mapping',
    doctor: 'Dr. R. Torres',
    pod: 'B-3',
    type: 'ortho',
    duration: '25min',
    status: 'upcoming',
  },
  {
    time: '14:45',
    patient: 'Yusuf Al-Rashid',
    id: 'CLV-00402',
    procedure: 'Serology & Bio-Panel',
    doctor: 'Dr. L. Chen',
    pod: 'B-4',
    type: 'lab',
    duration: '15min',
    status: 'upcoming',
  },
];

const TYPE_CONFIG = {
  neuro: { color: '#7c3aed', icon: Brain, label: 'Neurology' },
  cardiac: { color: '#e11d48', icon: Heart, label: 'Cardiology' },
  trauma: { color: '#d97706', icon: Stethoscope, label: 'Trauma' },
  pulmo: { color: '#0284c7', icon: Circle, label: 'Pulmonology' },
  ortho: { color: '#059669', icon: Bone, label: 'Orthopedics' },
  lab: { color: '#8b5cf6', icon: FlaskConical, label: 'Laboratory' },
};

const STATUS_CONFIG = {
  'in-progress': { color: '#059669', label: 'In Progress', bg: 'rgba(5,150,105,0.09)' },
  'upcoming': { color: 'rgba(15,23,42,0.45)', label: 'Scheduled', bg: 'rgba(15,23,42,0.05)' },
  'completed': { color: 'rgba(15,23,42,0.3)', label: 'Done', bg: 'transparent' },
};

function ProcedureRow({ proc, index }) {
  const [hovered, setHovered] = useState(false);
  const typeConf = TYPE_CONFIG[proc.type];
  const statusConf = STATUS_CONFIG[proc.status];
  const Icon = typeConf.icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '11px 14px',
        borderRadius: '12px',
        background: hovered ? 'rgba(15,23,42,0.03)' : proc.status === 'in-progress' ? 'rgba(5,150,105,0.04)' : 'transparent',
        border: `1px solid ${proc.status === 'in-progress' ? 'rgba(5,150,105,0.15)' : hovered ? 'rgba(15,23,42,0.07)' : 'transparent'}`,
        cursor: 'pointer',
        transition: 'all 150ms ease',
        animation: `fadeIn ${0.3 + index * 0.06}s ease both`,
      }}
    >
      {/* Time */}
      <div style={{ textAlign: 'right', flexShrink: 0, width: '36px' }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', fontWeight: 500, color: proc.status === 'in-progress' ? '#059669' : 'rgba(15,23,42,0.6)', lineHeight: 1.2 }}>
          {proc.time}
        </div>
        <div style={{ fontSize: '9px', color: 'rgba(15,23,42,0.3)', marginTop: '2px' }}>{proc.duration}</div>
      </div>

      {/* Type Icon */}
      <div style={{
        width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
        background: `${typeConf.color}12`,
        border: `1px solid ${typeConf.color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={15} color={typeConf.color} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {proc.procedure}
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(15,23,42,0.45)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proc.patient}</span>
          <span style={{ color: 'rgba(15,23,42,0.2)' }}>·</span>
          <span style={{ color: typeConf.color, flexShrink: 0 }}>{proc.pod}</span>
        </div>
      </div>

      {/* Doctor + Status */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '11px', color: 'rgba(15,23,42,0.5)', marginBottom: '4px', whiteSpace: 'nowrap' }}>
          {proc.doctor}
        </div>
        <div style={{
          fontSize: '9px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
          color: statusConf.color, background: statusConf.bg,
          padding: '2px 6px', borderRadius: '100px',
          whiteSpace: 'nowrap',
        }}>
          {statusConf.label}
        </div>
      </div>

      <ChevronRight size={13} color="rgba(15,23,42,0.2)" style={{ flexShrink: 0, opacity: hovered ? 1 : 0, transition: 'opacity 150ms ease' }} />
    </div>
  );
}

export default function ProceduresList({ proceduresData, procedures }) {
  const { isDark } = useTheme();
  const [filter, setFilter] = useState('all');

  const displayProcedures = proceduresData && proceduresData.length > 0 ? proceduresData : procedures && procedures.length > 0 ? procedures : PROCEDURES;
  const filtered = filter === 'all' ? displayProcedures : displayProcedures.filter(p => p.type === filter);

  return (
    <div style={{
      background: isDark ? '#1e293b' : '#ffffff',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.09)'}`,
      borderRadius: '20px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      animation: 'fadeIn 0.45s ease both',
      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.35)' : '0 2px 12px rgba(15,23,42,0.06)',
      color: isDark ? '#f8fafc' : '#0f172a',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>Scheduled Procedures</div>
          <div style={{ fontSize: '11px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.45)', marginTop: '2px' }}>Active Surgical & Diagnostic Pipeline</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} color="rgba(15,23,42,0.3)" />
          <span style={{ fontSize: '11px', color: 'rgba(15,23,42,0.38)', fontFamily: "'JetBrains Mono',monospace" }}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
        {[{ key: 'all', label: 'All' }, ...Object.entries(TYPE_CONFIG).map(([k, v]) => ({ key: k, label: v.label }))].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 500,
              cursor: 'pointer', transition: 'all 150ms ease', whiteSpace: 'nowrap',
              background: filter === tab.key ? 'rgba(2,132,199,0.1)' : 'rgba(15,23,42,0.04)',
              border: `1px solid ${filter === tab.key ? 'rgba(2,132,199,0.25)' : 'rgba(15,23,42,0.08)'}`,
              color: filter === tab.key ? '#0284c7' : 'rgba(15,23,42,0.5)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Procedure rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
        {filtered.map((proc, i) => (
          <ProcedureRow key={proc.id + proc.time} proc={proc} index={i} />
        ))}
      </div>
    </div>
  );
}
