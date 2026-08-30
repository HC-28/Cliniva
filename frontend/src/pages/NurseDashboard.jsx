import React from 'react';
import usePolling from '../hooks/usePolling';
import { fetchBioPods, fetchProcedures } from '../services/api';
import BioPodTracker from '../components/BioPodTracker';
import ProceduresList from '../components/ProceduresList';
import { Bed, AlertTriangle, CheckCircle, Activity, HeartPulse } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function NurseDashboard({ user = { name: 'Nurse' } }) {
  const { isDark } = useTheme();
  const { data: podsData, refresh: refreshPods } = usePolling(fetchBioPods, 8000);
  const { data: proceduresData } = usePolling(fetchProcedures, 20000);

  const pods = podsData || [];
  const occupied = pods.filter(p => p.status?.toLowerCase() === 'occupied').length;
  const stabilizing = pods.filter(p => p.status?.toLowerCase() === 'stabilizing').length;
  const empty = pods.filter(p => p.status?.toLowerCase() === 'empty' || p.status?.toLowerCase() === 'available').length;

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        overflowY: 'auto',
        padding: '28px',
        backgroundColor: isDark ? '#090e17' : '#f0f4f8',
        color: isDark ? '#f8fafc' : '#0f172a',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, letterSpacing: '-0.6px', color: isDark ? '#f8fafc' : '#0f172a' }}>
            Nurse Ward Station
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)' }}>
            Real-time telemetry monitoring for in-patient bio-pods
          </p>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        <div
          style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
            <Bed size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', lineHeight: 1 }}>{occupied}</div>
            <div style={{ fontSize: '13px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)', marginTop: '4px', fontWeight: 600 }}>Occupied Pods</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', lineHeight: 1 }}>{stabilizing}</div>
            <div style={{ fontSize: '13px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)', marginTop: '4px', fontWeight: 600 }}>Stabilizing Cases</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', lineHeight: 1 }}>{empty}</div>
            <div style={{ fontSize: '13px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)', marginTop: '4px', fontWeight: 600 }}>Available Pods</div>
          </div>
        </div>
      </div>

      {/* Trackers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '22px' }}>
        <BioPodTracker pods={pods} onUpdate={refreshPods} />
        <ProceduresList procedures={proceduresData || []} />
      </div>
    </div>
  );
}
