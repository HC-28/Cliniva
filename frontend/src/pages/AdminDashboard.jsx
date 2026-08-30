import React, { useState } from 'react';
import usePolling from '../hooks/usePolling';
import { fetchBioPods, fetchProcedures } from '../services/api';
import BioPodTracker from '../components/BioPodTracker';
import ProceduresList from '../components/ProceduresList';
import { Download, Bed, Activity, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useGlobalToast } from '../context/ToastContext';

export default function AdminDashboard({ user }) {
  const { isDark } = useTheme();
  const { toast } = useGlobalToast();
  const { data: podsData, refresh: refreshPods } = usePolling(fetchBioPods, 8000);
  const { data: proceduresData } = usePolling(fetchProcedures, 20000);

  const pods = podsData || [];
  const occupied = pods.filter(p => p.status?.toLowerCase() === 'occupied').length;
  const stabilizing = pods.filter(p => p.status?.toLowerCase() === 'stabilizing').length;
  const empty = pods.filter(p => p.status?.toLowerCase() === 'empty' || p.status?.toLowerCase() === 'available').length;
  const occupancyRate = Math.round((occupied / (pods.length || 12)) * 100);

  const handleExport = () => {
    toast.info('Exporting Hospital Clinical Audit Log (CSV)...');
    setTimeout(() => {
      toast.success('Hospital telemetry log downloaded');
    }, 400);
  };

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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, letterSpacing: '-0.6px', color: isDark ? '#f8fafc' : '#0f172a' }}>
            Mission Control Dashboard
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)' }}>
            Hospital operations, bio-pod telemetry, and surgical capacity overview
          </p>
        </div>

        <button
          onClick={handleExport}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
            border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1'}`,
            padding: '9px 16px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '13.5px',
          }}
        >
          <Download size={15} color="#0284c7" /> Export Audit Log
        </button>
      </div>

      {/* Top 4 Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div
          style={{
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
            <Bed size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', lineHeight: 1 }}>{occupied}/12</div>
            <div style={{ fontSize: '13px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)', marginTop: '4px', fontWeight: 600 }}>Active Pod Beds</div>
          </div>
        </div>

        <div
          style={{
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', lineHeight: 1 }}>{occupancyRate}%</div>
            <div style={{ fontSize: '13px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)', marginTop: '4px', fontWeight: 600 }}>Occupancy Rate</div>
          </div>
        </div>

        <div
          style={{
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(124, 58, 237, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', lineHeight: 1 }}>247</div>
            <div style={{ fontSize: '13px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)', marginTop: '4px', fontWeight: 600 }}>Registered Patients</div>
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
