import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const VARIANTS = {
  success: { icon: CheckCircle,    bg: 'rgba(5,150,105,0.1)',  border: 'rgba(5,150,105,0.25)',  color: '#059669', label: 'Success' },
  error:   { icon: XCircle,        bg: 'rgba(225,29,72,0.08)', border: 'rgba(225,29,72,0.22)',  color: '#e11d48', label: 'Error'   },
  warning: { icon: AlertTriangle,  bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.22)',  color: '#d97706', label: 'Warning' },
  info:    { icon: Info,           bg: 'rgba(2,132,199,0.07)', border: 'rgba(2,132,199,0.2)',   color: '#0284c7', label: 'Info'    },
};

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  const v = VARIANTS[toast.type] || VARIANTS.info;
  const Icon = v.icon;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        background: '#ffffff',
        border: `1px solid ${v.border}`,
        borderLeft: `3px solid ${v.color}`,
        borderRadius: '12px',
        padding: '12px 14px',
        boxShadow: '0 4px 20px rgba(15,23,42,0.12)',
        minWidth: '280px', maxWidth: '380px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(40px)',
        transition: 'all 280ms cubic-bezier(0.4,0,0.2,1)',
        cursor: 'default',
      }}
    >
      <div style={{ marginTop: '1px', flexShrink: 0 }}>
        <Icon size={16} color={v.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: v.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
          {v.label}
        </div>
        <div style={{ fontSize: '13px', color: '#0f172a', lineHeight: 1.45 }}>
          {toast.message}
        </div>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', color: 'rgba(15,23,42,0.35)', flexShrink: 0, marginTop: '1px' }}
        onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(15,23,42,0.35)'}
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div
      style={{
        position: 'fixed', bottom: '24px', right: '24px',
        display: 'flex', flexDirection: 'column', gap: '10px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}
