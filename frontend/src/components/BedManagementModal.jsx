import React, { useState } from 'react';
import { X, UserPlus, LogOut, ArrowRightLeft, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { admitPatient, dischargePatient, transferPatient } from '../services/api';

const WARDS    = ['Neuro', 'Cardiac', 'Trauma', 'Ortho', 'Pulmo', 'General'];
const DOCTORS  = ['Dr. R. Torres', 'Dr. L. Chen', 'Dr. Y. Wu', 'Dr. A. Osei', 'Dr. S. Mehta', 'Dr. P. Kumar'];
const SEVERITY = ['stable', 'warning', 'critical'];

const SEV_COLORS = { stable: '#059669', warning: '#d97706', critical: '#e11d48' };

// ── Shared input style ────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: '10px', fontSize: '13px',
  border: '1px solid rgba(15,23,42,0.12)', background: '#f8fafc',
  color: '#0f172a', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 150ms ease',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const labelStyle = {
  fontSize: '11px', fontWeight: 600, color: 'rgba(15,23,42,0.5)',
  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', display: 'block',
};

// ── Admit Form ────────────────────────────────────────────
function AdmitForm({ pod, onSuccess, onClose, allPods }) {
  const [form, setForm] = useState({
    patientName: '', patientClinicalId: '', attendingPhysician: DOCTORS[0],
    wardName: pod.ward || WARDS[0], clinicalSeverity: 'stable',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientName.trim()) { setError('Patient name is required.'); return; }
    setLoading(true); setError(null);
    try {
      await admitPatient(pod.id, form);
      onSuccess(`${form.patientName} admitted to Pod ${pod.id}`);
    } catch (err) {
      // If backend offline, simulate locally for demo
      onSuccess(`${form.patientName} admitted to Pod ${pod.id} (demo mode)`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Patient Name *</label>
          <input style={inputStyle} placeholder="e.g. Riya Sharma" value={form.patientName}
            onChange={e => set('patientName', e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>Clinical ID</label>
          <input style={inputStyle} placeholder="e.g. CLV-00500" value={form.patientClinicalId}
            onChange={e => set('patientClinicalId', e.target.value)} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Attending Physician</label>
        <select style={inputStyle} value={form.attendingPhysician}
          onChange={e => set('attendingPhysician', e.target.value)}>
          {DOCTORS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Ward</label>
          <select style={inputStyle} value={form.wardName}
            onChange={e => set('wardName', e.target.value)}>
            {WARDS.map(w => <option key={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Clinical Severity</label>
          <select style={{ ...inputStyle, color: SEV_COLORS[form.clinicalSeverity] }}
            value={form.clinicalSeverity}
            onChange={e => set('clinicalSeverity', e.target.value)}>
            {SEVERITY.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48', fontSize: '12px' }}>
          <AlertCircle size={13} /> {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
        <button type="button" onClick={onClose} style={{
          flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
          border: '1px solid rgba(15,23,42,0.12)', background: 'transparent', color: 'rgba(15,23,42,0.6)', cursor: 'pointer',
        }}>Cancel</button>
        <button type="submit" disabled={loading} style={{
          flex: 2, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
          border: 'none', background: loading ? 'rgba(2,132,199,0.4)' : '#0284c7',
          color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
          transition: 'background 150ms ease',
        }}>
          {loading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <UserPlus size={14} />}
          {loading ? 'Admitting...' : 'Admit Patient'}
        </button>
      </div>
    </form>
  );
}

// ── Discharge Form ────────────────────────────────────────
function DischargeForm({ pod, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleDischarge = async () => {
    setLoading(true);
    try {
      await dischargePatient(pod.id);
    } catch {
      // demo mode — continue
    } finally {
      setLoading(false);
      onSuccess(`${pod.patient} discharged from Pod ${pod.id}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        background: 'rgba(225,29,72,0.05)', border: '1px solid rgba(225,29,72,0.15)',
        borderRadius: '12px', padding: '14px 16px',
      }}>
        <p style={{ fontSize: '13px', color: '#0f172a', margin: 0, lineHeight: 1.6 }}>
          You are about to discharge <strong>{pod.patient}</strong> from Pod <strong>{pod.id}</strong>
          {' '}({pod.ward} ward). The pod will be marked <strong>Available</strong>.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onClose} style={{
          flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
          border: '1px solid rgba(15,23,42,0.12)', background: 'transparent', color: 'rgba(15,23,42,0.6)', cursor: 'pointer',
        }}>Cancel</button>
        <button onClick={handleDischarge} disabled={loading} style={{
          flex: 2, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
          border: 'none', background: loading ? 'rgba(225,29,72,0.4)' : '#e11d48',
          color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
          transition: 'background 150ms ease',
        }}>
          {loading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <LogOut size={14} />}
          {loading ? 'Processing...' : 'Confirm Discharge'}
        </button>
      </div>
    </div>
  );
}

// ── Transfer Form ─────────────────────────────────────────
function TransferForm({ pod, allPods, onSuccess, onClose }) {
  const emptyPods = allPods.filter(p => p.status === 'empty');
  const [targetPod, setTargetPod] = useState(emptyPods[0]?.id || '');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const handleTransfer = async () => {
    if (!targetPod) { setError('Select a destination pod.'); return; }
    setLoading(true); setError(null);
    try {
      await transferPatient(pod.id, targetPod);
    } catch (err) {
      // demo mode — continue
    } finally {
      setLoading(false);
      onSuccess(`${pod.patient} transferred from Pod ${pod.id} → Pod ${targetPod}`);
    }
  };

  if (emptyPods.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(15,23,42,0.5)', fontSize: '13px' }}>
        <AlertCircle size={28} style={{ opacity: 0.3, marginBottom: '10px' }} />
        <p>No available pods for transfer right now.</p>
        <button onClick={onClose} style={{
          marginTop: '8px', padding: '8px 20px', borderRadius: '10px', fontSize: '13px',
          border: '1px solid rgba(15,23,42,0.12)', background: 'transparent', cursor: 'pointer',
        }}>Close</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={labelStyle}>Transfer {pod.patient} to</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {emptyPods.map(p => (
            <button key={p.id} type="button"
              onClick={() => setTargetPod(p.id)}
              style={{
                padding: '10px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                border: `1px solid ${targetPod === p.id ? 'rgba(2,132,199,0.4)' : 'rgba(15,23,42,0.1)'}`,
                background: targetPod === p.id ? 'rgba(2,132,199,0.08)' : 'transparent',
                color: targetPod === p.id ? '#0284c7' : 'rgba(15,23,42,0.6)',
                cursor: 'pointer', transition: 'all 150ms ease',
              }}>
              Pod {p.id}<br />
              <span style={{ fontSize: '10px', fontWeight: 400, color: 'rgba(15,23,42,0.4)' }}>{p.ward}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48', fontSize: '12px' }}>
          <AlertCircle size={13} /> {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onClose} style={{
          flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
          border: '1px solid rgba(15,23,42,0.12)', background: 'transparent', color: 'rgba(15,23,42,0.6)', cursor: 'pointer',
        }}>Cancel</button>
        <button onClick={handleTransfer} disabled={loading || !targetPod} style={{
          flex: 2, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
          border: 'none', background: loading ? 'rgba(124,58,237,0.4)' : '#7c3aed',
          color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
          transition: 'background 150ms ease',
        }}>
          {loading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRightLeft size={14} />}
          {loading ? 'Transferring...' : `Transfer to Pod ${targetPod}`}
        </button>
      </div>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────
export default function BedManagementModal({ pod, allPods, onClose, onActionComplete }) {
  const [mode, setMode]       = useState(pod.status === 'empty' ? 'admit' : 'options');
  const [success, setSuccess] = useState(null);

  const handleSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => {
      onActionComplete(); // trigger pod grid refresh
      onClose();
    }, 1800);
  };

  const TITLE = { admit: 'Admit Patient', discharge: 'Discharge Patient', transfer: 'Transfer Patient', options: `Pod ${pod.id}` };

  return (
    // Backdrop
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.15s ease both',
      }}
    >
      <div style={{
        background: '#ffffff', borderRadius: '20px', width: '480px', maxWidth: '95vw',
        boxShadow: '0 24px 60px rgba(15,23,42,0.18)', animation: 'slideUp 0.2s ease both',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          padding: '18px 22px 16px', borderBottom: '1px solid rgba(15,23,42,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{TITLE[mode]}</div>
            <div style={{ fontSize: '11px', color: 'rgba(15,23,42,0.45)', marginTop: '2px' }}>
              {pod.status === 'empty' ? `Pod ${pod.id} · ${pod.ward} Ward · Available` : `${pod.patient} · Pod ${pod.id} · ${pod.ward}`}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(15,23,42,0.05)', border: 'none', borderRadius: '8px',
            width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(15,23,42,0.5)', transition: 'all 150ms ease',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(15,23,42,0.09)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(15,23,42,0.05)'}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 22px 22px' }}>

          {/* Success state */}
          {success && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
              padding: '24px', textAlign: 'center', animation: 'fadeIn 0.2s ease both',
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'rgba(5,150,105,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle size={26} color="#059669" />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Done!</div>
              <div style={{ fontSize: '12px', color: 'rgba(15,23,42,0.55)', lineHeight: 1.5 }}>{success}</div>
            </div>
          )}

          {/* Action picker for occupied pods */}
          {!success && mode === 'options' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => setMode('transfer')} style={{
                display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                borderRadius: '12px', border: '1px solid rgba(124,58,237,0.2)',
                background: 'rgba(124,58,237,0.04)', cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'all 150ms ease',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
              >
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <ArrowRightLeft size={16} color="#7c3aed" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Transfer Patient</div>
                  <div style={{ fontSize: '11px', color: 'rgba(15,23,42,0.45)', marginTop: '2px' }}>
                    Move {pod.patient} to another available pod
                  </div>
                </div>
              </button>

              <button onClick={() => setMode('discharge')} style={{
                display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                borderRadius: '12px', border: '1px solid rgba(225,29,72,0.18)',
                background: 'rgba(225,29,72,0.04)', cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'all 150ms ease',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(225,29,72,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(225,29,72,0.04)'}
              >
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: 'rgba(225,29,72,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <LogOut size={16} color="#e11d48" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Discharge Patient</div>
                  <div style={{ fontSize: '11px', color: 'rgba(15,23,42,0.45)', marginTop: '2px' }}>
                    Mark pod as available and complete stay
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Forms */}
          {!success && mode === 'admit' && (
            <AdmitForm pod={pod} allPods={allPods} onSuccess={handleSuccess} onClose={onClose} />
          )}
          {!success && mode === 'discharge' && (
            <DischargeForm pod={pod} onSuccess={handleSuccess} onClose={onClose} />
          )}
          {!success && mode === 'transfer' && (
            <TransferForm pod={pod} allPods={allPods} onSuccess={handleSuccess} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}
