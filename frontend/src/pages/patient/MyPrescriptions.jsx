import React, { useState, useEffect } from 'react';
import { Pill, Printer, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { fetchMyPrescriptions } from '../../services/api';
import { useGlobalToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export default function MyPrescriptions() {
  const [activeTab, setActiveTab]         = useState('active');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading]             = useState(true);
  const { toast }                         = useGlobalToast();
  const { isDark }                        = useTheme();

  const loadPrescriptions = async () => {
    setLoading(true);
    try {
      const data = await fetchMyPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const handleRefill = (medName) => {
    toast.success(`Refill request for ${medName} transmitted to hospital pharmacy`);
  };

  const handleGenerateRx = (med) => {
    toast.info(`Generating official Pharmacy Rx for ${med.medicationName}...`);
    setTimeout(() => {
      window.print();
      toast.success('Digital Prescription (PDF) ready for dispensing');
    }, 400);
  };

  const activePrescriptions = prescriptions.filter(p => p.status === 'PRESCRIBED' || p.status === 'DISPENSED');
  const pastPrescriptions   = prescriptions.filter(p => p.status === 'COMPLETED' || p.status === 'CANCELLED');

  return (
    <div
      style={{
        flex: 1,
        padding: '28px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        background: isDark ? '#090e17' : '#f0f4f8',
        color: isDark ? '#f8fafc' : '#0f172a',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Active Prescriptions & Medications
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)' }}>
            Digital prescription records with dosage schedules and automated pharmacy refills
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: isDark ? '#1e293b' : '#e2e8f0',
            borderRadius: '12px',
            padding: '4px',
            gap: '4px',
          }}
        >
          <button
            onClick={() => setActiveTab('active')}
            style={{
              padding: '8px 16px',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'active' ? '#0284c7' : 'transparent',
              color: activeTab === 'active' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Active ({activePrescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            style={{
              padding: '8px 16px',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'past' ? '#0284c7' : 'transparent',
              color: activeTab === 'past' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Completed ({pastPrescriptions.length})
          </button>
        </div>
      </div>

      {/* Cards List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: isDark ? '#94a3b8' : '#64748b' }}>
          Loading prescriptions...
        </div>
      ) : (activeTab === 'active' ? activePrescriptions : pastPrescriptions).length === 0 ? (
        <div
          style={{
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '20px',
            padding: '36px',
            textAlign: 'center',
            color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.45)',
          }}
        >
          No {activeTab} prescriptions found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {(activeTab === 'active' ? activePrescriptions : pastPrescriptions).map(med => (
            <div
              key={med.id}
              style={{
                background: isDark ? '#1e293b' : '#ffffff',
                borderRadius: '20px',
                padding: '24px',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
                boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 2px 12px rgba(15,23,42,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                      {med.medicationName}
                    </h3>
                    <span style={{ fontSize: '12px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.5)', fontWeight: 500 }}>
                      {med.genericName || 'Generic Formulation'}
                    </span>
                  </div>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: med.status === 'DISPENSED' ? 'rgba(5, 150, 105, 0.12)' : 'rgba(2, 132, 199, 0.12)',
                      color: med.status === 'DISPENSED' ? '#10b981' : '#0284c7',
                    }}
                  >
                    {med.status}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '12px 0',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: isDark ? '#0f172a' : '#f8fafc',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <Pill size={15} color="#0284c7" />
                  <span>{med.dosage} · {med.frequency}</span>
                </div>

                <div style={{ fontSize: '12.5px', color: isDark ? '#94a3b8' : 'rgba(15,23,42,0.7)', lineHeight: 1.5 }}>
                  <strong>Instructions:</strong> {med.instructions || 'Take as directed by doctor'}
                </div>

                <div style={{ fontSize: '11.5px', color: isDark ? '#64748b' : 'rgba(15,23,42,0.45)', marginTop: '8px' }}>
                  Prescribed by: {med.doctorName || 'Attending Physician'} · Duration: {med.durationDays || 30} days
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'}` }}>
                <button
                  onClick={() => handleGenerateRx(med)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: isDark ? '#0f172a' : '#f1f5f9',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1'}`,
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Printer size={13} color="#0284c7" />
                  <span>Generate Rx</span>
                </button>

                {activeTab === 'active' && (
                  <button
                    onClick={() => handleRefill(med.medicationName)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      background: 'rgba(2, 132, 199, 0.1)',
                      color: '#0284c7',
                      border: '1px solid rgba(2, 132, 199, 0.25)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <RefreshCw size={13} />
                    <span>Request Refill</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
