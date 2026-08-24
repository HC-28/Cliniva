import React from 'react';

export default function ClinivaLogo({ size = 36, showText = true, textColor = '#0f172a', subtitle = 'Enterprise Healthcare' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', userSelect: 'none' }}>
      {/* High-definition SVG Medical Heart & Neural Pulse Logo */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          borderRadius: `${Math.round(size * 0.28)}px`,
          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.35), 0 2px 6px rgba(124, 58, 237, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient shimmer gloss */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
            borderRadius: `${Math.round(size * 0.28)}px ${Math.round(size * 0.28)}px 0 0`,
          }}
        />

        {/* Pulse & Cross Icon */}
        <svg
          width={Math.round(size * 0.62)}
          height={Math.round(size * 0.62)}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}
        >
          {/* Medical Cross Base */}
          <path
            d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z"
            fill="rgba(255, 255, 255, 0.15)"
          />
          {/* ECG Pulse Wave */}
          <path
            d="M3 12H7L9 7L13 17L15 11L17 13H21"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Active Vital Spark */}
          <circle cx="9" cy="7" r="1.5" fill="#38bdf8" />
          <circle cx="13" cy="17" r="1.5" fill="#a78bfa" />
        </svg>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div
            style={{
              fontSize: `${Math.round(size * 0.52)}px`,
              fontWeight: 800,
              letterSpacing: '-0.6px',
              color: textColor,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Cliniva</span>
            <span
              style={{
                fontSize: `${Math.max(9, Math.round(size * 0.24))}px`,
                fontWeight: 700,
                color: '#0284c7',
                background: 'rgba(2, 132, 199, 0.10)',
                padding: '2px 6px',
                borderRadius: '6px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Plus
            </span>
          </div>
          {subtitle && (
            <span
              style={{
                fontSize: `${Math.max(10, Math.round(size * 0.28))}px`,
                color: textColor === '#ffffff' ? 'rgba(255,255,255,0.65)' : 'rgba(15, 23, 42, 0.45)',
                fontWeight: 500,
                marginTop: '4px',
                letterSpacing: '-0.1px',
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
