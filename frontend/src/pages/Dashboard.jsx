import React, { useState, useCallback } from 'react';
import { Users, Activity, Calendar, TrendingUp, TrendingDown, ArrowUpRight, RefreshCw } from 'lucide-react';
import BioTelemetry from '../components/BioTelemetry';
import BioPodTracker from '../components/BioPodTracker';
import ProceduresList from '../components/ProceduresList';
import PatientPanel from '../components/PatientPanel';
import { fetchPatients, fetchBioPods, fetchProcedures } from '../services/api';
import { usePolling } from '../hooks/usePolling';

// ── Donut Chart ────────────────────────────────────────────
function DonutChart({ data, size = 80 }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const arcs = data.map(item => {
    const dash = (item.value / 100) * circ;
    const gap  = circ - dash;
    const el   = { ...item, dash, gap, offset };
    offset += dash;
    return el;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {arcs.map((arc, i) => (
        <circle key={i}
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={arc.color} strokeWidth="7"
          strokeDasharray={`${arc.dash} ${arc.gap}`}
          strokeDashoffset={-arc.offset} strokeLinecap="butt"
          style={{ filter: arc.color.startsWith('rgba') ? 'none' : `drop-shadow(0 0 3px ${arc.color}50)` }}
        />
      ))}
    </svg>
  );
}

// ── Mini Bar Chart ─────────────────────────────────────────
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '48px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <div style={{
            width: '100%', height: `${(d.value / max) * 40}px`,
            background: d.isToday
              ? 'linear-gradient(180deg, #0284c7 0%, rgba(2,132,199,0.25) 100%)'
              : 'rgba(15,23,42,0.07)',
            borderRadius: '3px 3px 0 0',
            boxShadow: d.isToday ? '0 0 6px rgba(2,132,199,0.25)' : 'none',
            transition: 'height 600ms cubic-bezier(0.4,0,0.2,1)',
          }} />
          <span style={{ fontSize: '8px', color: d.isToday ? '#0284c7' : 'rgba(15,23,42,0.3)', fontFamily: "'JetBrains Mono',monospace" }}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ stat, index }) {
  const [hovered, setHovered] = useState(false);
  const Icon      = stat.icon;
  const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#ffffff' : 'rgba(255,255,255,0.85)',
        border: `1px solid ${hovered ? `${stat.color}30` : 'rgba(15,23,42,0.09)'}`,
        borderRadius: '20px', padding: '18px 20px', cursor: 'default',
        transition: 'all 200ms ease',
        boxShadow: hovered ? `0 8px 32px ${stat.color}14, 0 2px 8px rgba(15,23,42,0.06)` : '0 2px 8px rgba(15,23,42,0.05)',
        animation: `fadeIn ${0.2 + index * 0.08}s ease both`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'rgba(15,23,42,0.45)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>
            {stat.label}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1 }}>
            {stat.value}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <TrendIcon size={11} color={stat.trend === 'up' ? '#059669' : '#d97706'} />
            <span style={{ fontSize: '11px', color: stat.trend === 'up' ? '#059669' : '#d97706', fontWeight: 500 }}>
              {stat.change} this week
            </span>
          </div>
        </div>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <DonutChart data={stat.donut} size={76} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.donutLabel}</div>
            <div style={{ fontSize: '8px', color: 'rgba(15,23,42,0.4)', marginTop: '1px' }}>{stat.donutSub}</div>
          </div>
        </div>
      </div>
      <MiniBarChart data={stat.chartData} />
    </div>
  );
}

// ── Live Timestamp ─────────────────────────────────────────
function LiveStamp({ lastUpdated, isRefreshing }) {
  if (!lastUpdated) return null;
  const timeStr = lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {isRefreshing ? (
        <RefreshCw size={11} color="#0284c7" style={{ animation: 'spin 0.7s linear infinite' }} />
      ) : (
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669', animation: 'glow-pulse 2s ease-in-out infinite' }} />
      )}
      <span style={{ fontSize: '11px', color: 'rgba(15,23,42,0.4)', fontFamily: "'JetBrains Mono',monospace" }}>
        {isRefreshing ? 'Syncing...' : `Updated ${timeStr}`}
      </span>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────
export default function Dashboard() {
  const [selectedPod, setSelectedPod] = useState(null);
  const [showPanel,   setShowPanel]   = useState(true);

  // ── Polled data feeds ────────────────────────────────────
  // Wrap in useCallback so usePolling's useEffect dep array is stable
  const fetchPods      = useCallback(fetchBioPods,    []);
  const fetchPats      = useCallback(fetchPatients,   []);
  const fetchProcs     = useCallback(fetchProcedures, []);

  const {
    data: pods, loading: podsLoading,
    isRefreshing: podsRefreshing, lastUpdated: podsUpdated,
    error: podsError, refresh: refreshPods,
  } = usePolling(fetchPods, 8000);   // pods refresh every 8s

  const {
    data: patients, loading: patientsLoading,
    error: patientsError,
  } = usePolling(fetchPats, 30000);  // patients list refresh every 30s

  const {
    data: procedures, loading: procsLoading,
    error: procsError,
  } = usePolling(fetchProcs, 20000); // procedures refresh every 20s

  const loading = podsLoading && patientsLoading && procsLoading;

  const handlePodSelect = (pod) => {
    if (pod.status !== 'empty') {
      setSelectedPod(pod);
      setShowPanel(true);
    }
  };

  // ── Derived stats ────────────────────────────────────────
  const safePatients   = patients   || [];
  const safePods       = pods       || [];
  const safeProcedures = procedures || [];

  const occupiedCount    = safePods.filter(p => p.status === 'occupied').length;
  const stabilizingCount = safePods.filter(p => p.status === 'stabilizing').length;
  const activePodsCount  = occupiedCount + stabilizingCount;

  const dynamicStats = [
    {
      label: 'Total Patients',
      value: safePatients.length || '—',
      change: '+12', trend: 'up', color: '#0284c7', icon: Users,
      chartData: [
        { label: 'M', value: 38, isToday: false }, { label: 'T', value: 42, isToday: false },
        { label: 'W', value: 35, isToday: false }, { label: 'T', value: 49, isToday: false },
        { label: 'F', value: 44, isToday: false }, { label: 'S', value: 38, isToday: false },
        { label: 'S', value: safePatients.length || 6, isToday: true },
      ],
      donut: [
        { value: Math.round((safePatients.length / 300) * 100) || 62, color: '#0284c7' },
        { value: 24, color: '#7c3aed' },
        { value: 14, color: 'rgba(15,23,42,0.08)' },
      ],
      donutLabel: `${Math.round((safePatients.length / 300) * 100) || 62}%`,
      donutSub: 'Capacity',
    },
    {
      label: 'Active Pods',
      value: safePods.length ? `${activePodsCount}/12` : '—',
      change: '+2', trend: 'up', color: '#7c3aed', icon: Activity,
      chartData: [
        { label: 'M', value: 6, isToday: false }, { label: 'T', value: 8, isToday: false },
        { label: 'W', value: 7, isToday: false }, { label: 'T', value: 9, isToday: false },
        { label: 'F', value: 10, isToday: false }, { label: 'S', value: 8, isToday: false },
        { label: 'S', value: activePodsCount || 9, isToday: true },
      ],
      donut: [
        { value: Math.round((activePodsCount / 12) * 100) || 75, color: '#7c3aed' },
        { value: Math.round((stabilizingCount / 12) * 100) || 17, color: '#d97706' },
        { value: 8, color: 'rgba(15,23,42,0.08)' },
      ],
      donutLabel: `${Math.round((activePodsCount / 12) * 100) || 75}%`,
      donutSub: 'Occupied',
    },
    {
      label: 'Procedures Today',
      value: safeProcedures.length || '—',
      change: '-3', trend: 'down', color: '#059669', icon: Calendar,
      chartData: [
        { label: 'M', value: 28, isToday: false }, { label: 'T', value: 31, isToday: false },
        { label: 'W', value: 25, isToday: false }, { label: 'T', value: 37, isToday: false },
        { label: 'F', value: 41, isToday: false }, { label: 'S', value: 29, isToday: false },
        { label: 'S', value: safeProcedures.length || 34, isToday: true },
      ],
      donut: [
        { value: 55, color: '#059669' },
        { value: 35, color: '#d97706' },
        { value: 10, color: 'rgba(15,23,42,0.08)' },
      ],
      donutLabel: '55%',
      donutSub: 'Completed',
    },
  ];

  // ── Loading skeleton ─────────────────────────────────────
  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(2,132,199,0.15)', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '13px', color: 'rgba(15,23,42,0.45)', fontFamily: "'JetBrains Mono',monospace" }}>LOADING DASHBOARD...</span>
      </div>
    );
  }

  const hasError = podsError || patientsError || procsError;

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {/* Main scroll area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Page Title */}
        <div style={{ animation: 'fadeIn 0.2s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                Mission Control
              </h1>
              <p style={{ fontSize: '12px', color: 'rgba(15,23,42,0.45)', marginTop: '4px' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LiveStamp lastUpdated={podsUpdated} isRefreshing={podsRefreshing} />
              <button
                onClick={refreshPods}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                  color: '#0284c7', background: 'rgba(2,132,199,0.07)', border: '1px solid rgba(2,132,199,0.2)',
                  cursor: 'pointer', transition: 'all 150ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(2,132,199,0.14)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(2,132,199,0.07)'; }}
              >
                <ArrowUpRight size={13} /> Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Backend offline banner */}
        {hasError && (
          <div style={{ background: 'rgba(225,29,72,0.06)', border: '1px solid rgba(225,29,72,0.18)', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px' }}>⚠️</span>
            <span style={{ fontSize: '12px', color: '#e11d48', fontWeight: 500 }}>
              Backend unreachable — live simulation active. Data updates every 8s automatically.
            </span>
          </div>
        )}

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {dynamicStats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
        </div>

        {/* Telemetry + Pod Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'min(340px, 100%) 1fr', gap: '16px', alignItems: 'start', flexWrap: 'wrap' }}>
          <BioTelemetry
            patientId={safePatients.find(p => p.name === selectedPod?.patient)?.id || 'CLV-00421'}
            patientName={selectedPod?.patient || 'Aria Vasquez'}
          />
          <BioPodTracker onPodSelect={handlePodSelect} podsData={safePods} onPodsRefresh={refreshPods} />
        </div>

        {/* Procedures */}
        <ProceduresList proceduresData={safeProcedures} />
      </div>

      {/* Patient Side Panel */}
      {showPanel && (
        <PatientPanel selectedPod={selectedPod} onClose={() => setShowPanel(false)} />
      )}
    </div>
  );
}
