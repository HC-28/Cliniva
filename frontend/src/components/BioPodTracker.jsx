import React, { useState } from 'react';
import { Activity, Users, Zap, AlertTriangle, Plus } from 'lucide-react';
import BedManagementModal from './BedManagementModal';
import { useTheme } from '../context/ThemeContext';

const PODS = [
  { id: 'A-1', status: 'occupied', patient: 'Aria Vasquez', doctor: 'Dr. Torres', ward: 'Neuro', severity: 'stable' },
  { id: 'A-2', status: 'empty', patient: null, doctor: null, ward: 'Neuro', severity: null },
  { id: 'A-3', status: 'occupied', patient: 'James Okafor', doctor: 'Dr. Chen', ward: 'Cardiac', severity: 'stable' },
  { id: 'A-4', status: 'stabilizing', patient: 'Mira Patel', doctor: 'Dr. Wu', ward: 'Trauma', severity: 'critical' },
  { id: 'B-1', status: 'occupied', patient: 'Marcus Chen', doctor: 'Dr. Torres', ward: 'Cardiac', severity: 'stable' },
  { id: 'B-2', status: 'empty', patient: null, doctor: null, ward: 'Ortho', severity: null },
  { id: 'B-3', status: 'occupied', patient: 'Lena Müller', doctor: 'Dr. Osei', ward: 'Neuro', severity: 'stable' },
  { id: 'B-4', status: 'stabilizing', patient: 'Yusuf Al-Rashid', doctor: 'Dr. Chen', ward: 'Pulmo', severity: 'warning' },
  { id: 'C-1', status: 'occupied', patient: 'Sofia Reyes', doctor: 'Dr. Wu', ward: 'Ortho', severity: 'stable' },
  { id: 'C-2', status: 'occupied', patient: 'Aiden Park', doctor: 'Dr. Torres', ward: 'Neuro', severity: 'stable' },
  { id: 'C-3', status: 'empty', patient: null, doctor: null, ward: 'Cardiac', severity: null },
  { id: 'C-4', status: 'occupied', patient: 'Chiara Rossi', doctor: 'Dr. Osei', ward: 'Trauma', severity: 'stable' },
];

const STATUS_CONFIG = {
  occupied: {
    bg: 'rgba(2,132,199,0.07)',
    border: 'rgba(2,132,199,0.22)',
    glow: 'rgba(2,132,199,0.08)',
    dot: '#0284c7',
    label: 'Occupied',
    icon: Users,
  },
  empty: {
    bg: 'rgba(15,23,42,0.03)',
    border: 'rgba(15,23,42,0.08)',
    glow: 'transparent',
    dot: 'rgba(15,23,42,0.2)',
    label: 'Empty',
    icon: null,
  },
  stabilizing: {
    bg: 'rgba(217,119,6,0.07)',
    border: 'rgba(217,119,6,0.25)',
    glow: 'rgba(217,119,6,0.07)',
    dot: '#d97706',
    label: 'Stabilizing',
    icon: Zap,
  },
};

const SEVERITY_COLORS = {
  stable: '#059669',
  warning: '#d97706',
  critical: '#e11d48',
};

function PodCard({ pod, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const config = STATUS_CONFIG[pod.status];
  const Icon = config.icon;

  return (
    <div
      onClick={() => onClick(pod)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isSelected
          ? (pod.status === 'stabilizing' ? 'rgba(217,119,6,0.09)' : 'rgba(2,132,199,0.09)')
          : hovered ? config.bg : 'rgba(15,23,42,0.025)',
        border: `1px solid ${isSelected
          ? (pod.status === 'stabilizing' ? 'rgba(217,119,6,0.4)' : 'rgba(2,132,199,0.35)')
          : hovered ? config.border : 'rgba(15,23,42,0.07)'}`,
        borderRadius: '12px',
        padding: '10px',
        cursor: pod.status !== 'empty' ? 'pointer' : 'default',
        transition: 'all 200ms ease',
        boxShadow: isSelected ? `0 0 16px ${pod.status === 'stabilizing' ? 'rgba(217,119,6,0.12)' : 'rgba(2,132,199,0.10)'}` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Pod ID */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          fontWeight: 500,
          color: isSelected
            ? (pod.status === 'stabilizing' ? '#d97706' : '#0284c7')
            : 'rgba(15,23,42,0.4)',
          letterSpacing: '0.05em',
        }}>
          {pod.id}
        </span>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: config.dot,
          boxShadow: pod.status !== 'empty' ? `0 0 6px ${config.dot}` : 'none',
          animation: pod.status === 'stabilizing' ? 'glow-pulse 1.2s ease-in-out infinite' : 'none',
        }} />
      </div>

      {/* Content */}
      {pod.status !== 'empty' ? (
        <>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {pod.patient}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(15,23,42,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {pod.doctor}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{
              fontSize: '9px', fontWeight: 500,
              color: SEVERITY_COLORS[pod.severity],
              background: `${SEVERITY_COLORS[pod.severity]}18`,
              padding: '1px 5px', borderRadius: '100px',
            }}>
              {pod.severity?.toUpperCase()}
            </span>
            <span style={{ fontSize: '9px', color: 'rgba(15,23,42,0.35)' }}>{pod.ward}</span>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '6px 0' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1px dashed rgba(15,23,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', color: 'rgba(15,23,42,0.2)' }}>+</span>
          </div>
          <span style={{ fontSize: '9px', color: 'rgba(15,23,42,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available</span>
        </div>
      )}

      {/* Critical pulse overlay */}
      {pod.severity === 'critical' && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '12px',
          border: '1px solid rgba(244,63,94,0.3)',
          animation: 'glow-pulse 1s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}

export default function BioPodTracker({ onPodSelect, podsData, onPodsRefresh, pods }) {
  const { isDark } = useTheme();
  const [selectedPod,  setSelectedPod]  = useState(null);
  const [managingPod,  setManagingPod]  = useState(null); // opens modal

  const displayPods = podsData && podsData.length > 0 ? podsData : pods && pods.length > 0 ? pods : PODS;

  const handlePodClick = (pod) => {
    if (pod.status === 'empty') {
      // Empty pods open the Admit modal directly
      setManagingPod(pod);
      return;
    }
    setSelectedPod(pod.id === selectedPod?.id ? null : pod);
    onPodSelect && onPodSelect(pod);
  };

  const occupied = displayPods.filter(p => p.status === 'occupied').length;
  const stabilizing = displayPods.filter(p => p.status === 'stabilizing').length;
  const empty = displayPods.filter(p => p.status === 'empty').length;

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
          <div style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>Bio-Pod Ward Grid</div>
          <div style={{ fontSize: '11px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.45)', marginTop: '2px' }}>Real-time telemetry linked</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'Occupied', value: occupied, color: '#0284c7' },
            { label: 'Stabilizing', value: stabilizing, color: '#d97706' },
            { label: 'Empty', value: empty, color: 'rgba(15,23,42,0.3)' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: stat.color, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(15,23,42,0.38)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pod Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
      }}>
        {displayPods.map(pod => (
          <div key={pod.id} style={{ position: 'relative' }}>
            <PodCard
              pod={pod}
              isSelected={selectedPod?.id === pod.id}
              onClick={handlePodClick}
            />
            {/* Manage button on occupied/stabilizing pods */}
            {pod.status !== 'empty' && (
              <button
                onClick={(e) => { e.stopPropagation(); setManagingPod(pod); }}
                title="Manage pod"
                style={{
                  position: 'absolute', top: '6px', right: '6px',
                  width: '20px', height: '20px', borderRadius: '6px',
                  background: 'rgba(15,23,42,0.07)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(15,23,42,0.4)',
                  fontSize: '13px', fontWeight: 700, lineHeight: 1,
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.14)'; e.currentTarget.style.color = '#0f172a'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.07)'; e.currentTarget.style.color = 'rgba(15,23,42,0.4)'; }}
              >⋯</button>
            )}
            {/* Admit button on empty pods */}
            {pod.status === 'empty' && (
              <button
                onClick={() => setManagingPod(pod)}
                title="Admit patient"
                style={{
                  position: 'absolute', top: '6px', right: '6px',
                  width: '20px', height: '20px', borderRadius: '6px',
                  background: 'rgba(5,150,105,0.08)', border: '1px dashed rgba(5,150,105,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(5,150,105,0.7)',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(5,150,105,0.14)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(5,150,105,0.08)'; }}
              ><Plus size={11} /></button>
            )}
          </div>
        ))}
      </div>

      {/* Selected Pod Detail */}
      {selectedPod && (
        <div style={{
          background: 'rgba(2,132,199,0.05)',
          border: '1px solid rgba(2,132,199,0.14)',
          borderRadius: '12px',
          padding: '12px',
          animation: 'fadeIn 0.2s ease both',
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(2,132,199,0.8)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Selected — Pod {selectedPod.id}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { label: 'Patient',   value: selectedPod.patient },
              { label: 'Attending', value: selectedPod.doctor },
              { label: 'Ward',      value: selectedPod.ward },
              { label: 'Status',    value: selectedPod.severity?.toUpperCase() },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: '10px', color: 'rgba(15,23,42,0.4)', marginBottom: '1px' }}>{label}</div>
                <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bed Management Modal */}
      {managingPod && (
        <BedManagementModal
          pod={managingPod}
          allPods={displayPods}
          onClose={() => setManagingPod(null)}
          onActionComplete={() => {
            setManagingPod(null);
            setSelectedPod(null);
            if (onPodsRefresh) onPodsRefresh();
          }}
        />
      )}
    </div>
  );
}
