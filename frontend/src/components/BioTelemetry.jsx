import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Heart, Wind, Thermometer, TrendingDown } from 'lucide-react';
import { fetchTelemetry, connectTelemetryStream } from '../services/api';
import { usePolling } from '../hooks/usePolling';

// Mini sparkline chart using SVG
function Sparkline({ data, color, width = 120, height = 40 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#grad-${color.replace('#','')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      {data.length > 0 && (() => {
        const lastX = (data.length - 1) * step;
        const lastY = height - ((data[data.length - 1] - min) / range) * (height - 8) - 4;
        return <circle cx={lastX} cy={lastY} r="3" fill={color} />;
      })()}
    </svg>
  );
}

// Radial gauge for blood oxygen
function OxygenGauge({ value }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference * 0.75;
  const offset = circumference * 0.75 - progress;
  const rotation = -225;
  const color = value >= 98 ? '#10b981' : value >= 94 ? '#f59e0b' : '#f43f5e';

  return (
    <svg width="110" height="90" viewBox="0 0 110 90">
      <g transform="translate(55, 68)">
        {/* Track */}
        <circle
          cx={0} cy={0} r={radius}
          fill="none"
          stroke="rgba(15,23,42,0.08)"
          strokeWidth="7"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeLinecap="round"
          transform={`rotate(${rotation})`}
        />
        {/* Progress */}
        <circle
          cx={0} cy={0} r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(${rotation})`}
          style={{ filter: `drop-shadow(0 0 6px ${color}50)` }}
        />
        {/* Value */}
        <text x={0} y={-6} textAnchor="middle" fill="#0f172a" fontSize="18" fontWeight="700" fontFamily="'Plus Jakarta Sans', sans-serif">
          {value}
        </text>
        <text x={0} y={10} textAnchor="middle" fill="rgba(15,23,42,0.4)" fontSize="9" fontFamily="'Plus Jakarta Sans', sans-serif">
          SpO₂ %
        </text>
      </g>
    </svg>
  );
}

// G-Force visualization bar
function GForceBar({ value, max = 6 }) {
  const pct = (value / max) * 100;
  const color = value < 2 ? '#10b981' : value < 4 ? '#f59e0b' : '#f43f5e';
  const label = value < 2 ? 'Nominal' : value < 4 ? 'Elevated' : 'Critical';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', color: 'rgba(15,23,42,0.5)' }}>G-Force Stabilization</span>
        <span style={{ fontSize: '12px', color, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>
          {value.toFixed(1)}G
        </span>
      </div>
      <div style={{
        height: '6px', background: 'rgba(15,23,42,0.07)', borderRadius: '100px',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          borderRadius: '100px',
          boxShadow: `0 0 8px ${color}60`,
          transition: 'width 600ms cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
        <span style={{ fontSize: '10px', color }}>● {label}</span>
        <span style={{ fontSize: '10px', color: 'rgba(15,23,42,0.3)' }}>Max {max}G</span>
      </div>
    </div>
  );
}

// Animated heart rate number
function LiveHeartRate({ bpm }) {
  const [displayed, setDisplayed] = useState(bpm);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const jitter = Math.floor(Math.random() * 5 - 2);
      setDisplayed(b => b + jitter);
      setFlash(true);
      setTimeout(() => setFlash(false), 100);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '32px',
      fontWeight: 700,
      color: flash ? '#e11d48' : '#0284c7',
      transition: 'color 100ms ease',
      letterSpacing: '-1px',
    }}>
      {displayed}
    </span>
  );
}

export default function BioTelemetry({ patientId = 'CLV-00421', patientName = 'Aria Vasquez' }) {
  const [vitals, setVitals]       = useState(null);
  const [usingSSE, setUsingSSE]   = useState(false);
  const sseRef                    = useRef(null);

  // ── SSE: try real-time push first ────────────────────────
  useEffect(() => {
    if (sseRef.current) { sseRef.current.close(); }

    const source = connectTelemetryStream(
      patientId,
      (data) => { setVitals(data); setUsingSSE(true);  },
      ()     => {                  setUsingSSE(false); }, // fallback to polling on error
    );
    sseRef.current = source;

    return () => { source.close(); setUsingSSE(false); };
  }, [patientId]);

  // ── Polling fallback: only active when SSE is NOT connected ──
  const fetcher = useCallback(() => fetchTelemetry(patientId), [patientId]);
  const { data: polledVitals } = usePolling(fetcher, 3000, { immediate: !usingSSE });

  // Merge: prefer SSE data, fall back to polled data
  const data        = vitals ?? polledVitals;
  const heartData   = data?.heartData   ?? [72, 76, 74, 78, 75, 79, 77, 82, 80, 78, 83, 79, 77, 81];
  const tempData    = data?.tempData    ?? [36.8, 36.9, 36.7, 37.0, 37.1, 36.9, 37.2, 37.0, 36.8, 37.1];
  const gForce      = data?.gForce      ?? 1.8;
  const heartRate   = data?.heartRate   ?? 79;
  const bloodOxygen = data?.bloodOxygen ?? 98;
  const temperature = data?.temperature ?? 37.1;

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(15,23,42,0.09)',
      borderRadius: '20px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      animation: 'fadeIn 0.4s ease both',
      boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Patient Bio-Telemetry</div>
          <div style={{ fontSize: '11px', color: 'rgba(15,23,42,0.45)', marginTop: '2px' }}>{patientName} · {patientId}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%', background: '#10b981',
            boxShadow: '0 0 8px rgba(16,185,129,0.7)',
            animation: 'glow-pulse 1.5s ease-in-out infinite',
          }} />
          <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 500 }}>Monitoring</span>
        </div>
      </div>

      {/* Heart Rate */}
      <div style={{
        background: 'rgba(2,132,199,0.05)',
        border: '1px solid rgba(2,132,199,0.15)',
        borderRadius: '14px',
        padding: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
              <Heart size={13} color="#e11d48" strokeWidth={2} />
              <span style={{ fontSize: '11px', color: 'rgba(15,23,42,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Heart Rate</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <LiveHeartRate bpm={heartRate} />
              <span style={{ fontSize: '13px', color: 'rgba(15,23,42,0.4)', fontFamily: "'JetBrains Mono',monospace" }}>bpm</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '11px', fontWeight: 500 }}>
            <TrendingDown size={12} /> Normal range
          </div>
        </div>
        <Sparkline data={heartData} color="#f43f5e" width={200} height={38} />
      </div>

      {/* SpO2 + Temperature Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {/* Blood Oxygen */}
        <div style={{
          background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.15)',
          borderRadius: '14px', padding: '14px', textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
            <Wind size={12} color="#059669" />
            <span style={{ fontSize: '11px', color: 'rgba(15,23,42,0.5)' }}>Blood Oxygen</span>
          </div>
          <OxygenGauge value={bloodOxygen} />
        </div>

        {/* Temperature */}
        <div style={{
          background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.15)',
          borderRadius: '14px', padding: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Thermometer size={12} color="#d97706" />
            <span style={{ fontSize: '11px', color: 'rgba(15,23,42,0.5)' }}>Body Temp</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '10px' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '26px', fontWeight: 700, color: '#d97706' }}>{temperature.toFixed(1)}</span>
            <span style={{ fontSize: '12px', color: 'rgba(15,23,42,0.4)' }}>°C</span>
          </div>
          <Sparkline data={tempData} color="#f59e0b" width={90} height={30} />
        </div>
      </div>

      {/* G-Force Stabilization */}
      <div style={{
        background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)',
        borderRadius: '14px', padding: '14px',
      }}>
        <GForceBar value={gForce} />
      </div>
    </div>
  );
}
