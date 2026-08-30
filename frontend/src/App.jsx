import React, { useState, useEffect, lazy, Suspense } from 'react';
import './styles/global.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PatientSidebar from './components/PatientSidebar';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { getCurrentUser } from './services/api';

// ── Clinical dashboards (Admin / Doctor / Nurse) ──────────
const AdminDashboard    = lazy(() => import('./pages/AdminDashboard'));
const DoctorDashboard   = lazy(() => import('./pages/DoctorDashboard'));
const NurseDashboard    = lazy(() => import('./pages/NurseDashboard'));
const PatientRegistry   = lazy(() => import('./pages/PatientRegistry'));
const StaffManagement   = lazy(() => import('./pages/StaffManagement'));
const MyPatients        = lazy(() => import('./pages/MyPatients'));
const MedicalRecordsPage= lazy(() => import('./pages/MedicalRecordsPage'));
const NursePatientList  = lazy(() => import('./pages/NursePatientList'));
const SettingsPage      = lazy(() => import('./pages/SettingsPage'));

// ── Patient portal pages ───────────────────────────────────
const PatientHome       = lazy(() => import('./pages/patient/PatientHome'));
const MyProfile         = lazy(() => import('./pages/patient/MyProfile'));
const MedicalHistory    = lazy(() => import('./pages/patient/MedicalHistory'));
const MyPrescriptions   = lazy(() => import('./pages/patient/MyPrescriptions'));
const MyAppointments    = lazy(() => import('./pages/patient/MyAppointments'));
const BookAppointment   = lazy(() => import('./pages/patient/BookAppointment'));

// ── Loading fallback ───────────────────────────────────────
function PageLoader() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '14px' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid rgba(2,132,199,0.15)', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '12px', color: 'rgba(15,23,42,0.4)', fontFamily: "'JetBrains Mono',monospace" }}>LOADING...</span>
    </div>
  );
}

// ── CLINICAL SHELL (Admin, Doctor, Nurse) ──────────────────
function ClinicalShell({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const { isDark } = useTheme();

  const renderPage = () => {
    switch (user.type) {
      // Admin pages
      case 'admin':
        switch (activeNav) {
          case 'dashboard': return <AdminDashboard user={user} />;
          case 'patients':  return <PatientRegistry user={user} />;
          case 'staff':     return <StaffManagement user={user} />;
          case 'settings':  return <SettingsPage user={user} />;
          default:          return <AdminDashboard user={user} />;
        }

      // Doctor pages
      case 'doctor':
        switch (activeNav) {
          case 'dashboard': return <DoctorDashboard user={user} />;
          case 'patients':  return <MyPatients user={user} />;
          case 'records':   return <MedicalRecordsPage user={user} />;
          case 'settings':  return <SettingsPage user={user} />;
          default:          return <DoctorDashboard user={user} />;
        }

      // Nurse pages
      case 'nurse':
        switch (activeNav) {
          case 'dashboard': return <NurseDashboard user={user} />;
          case 'patients':  return <NursePatientList user={user} />;
          case 'settings':  return <SettingsPage user={user} />;
          default:          return <NurseDashboard user={user} />;
        }

      default: return <AdminDashboard user={user} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: isDark ? '#090e17' : '#f0f4f8' }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} userType={user.type} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header user={user} onLogout={onLogout} />
        <main style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          <Suspense fallback={<PageLoader />}>
            {renderPage()}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

// ── PATIENT SHELL ──────────────────────────────────────────
function PatientShell({ user, onLogout }) {
  const [activeNav, setActiveNav] = useState('home');
  const { isDark } = useTheme();

  const renderPage = () => {
    switch (activeNav) {
      case 'home':          return <PatientHome user={user} onNavigate={setActiveNav} />;
      case 'profile':       return <MyProfile user={user} />;
      case 'history':       return <MedicalHistory user={user} />;
      case 'prescriptions': return <MyPrescriptions user={user} />;
      case 'appointments':  return <MyAppointments user={user} onNavigate={setActiveNav} />;
      case 'book':          return <BookAppointment user={user} onNavigate={setActiveNav} />;
      case 'settings':      return <SettingsPage user={user} />;
      default:              return <PatientHome user={user} onNavigate={setActiveNav} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: isDark ? '#090e17' : '#f0f4f8' }}>
      <PatientSidebar activeNav={activeNav} setActiveNav={setActiveNav} user={user} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header user={user} onLogout={onLogout} isPatient />
        <main style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          <Suspense fallback={<PageLoader />}>
            {renderPage()}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

// ── ROOT APP CONTENT ───────────────────────────────────────
function AppContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cliniva_user');
    const token = localStorage.getItem('cliniva_token');
    if (stored && token) {
      try {
        const user = JSON.parse(stored);
        getCurrentUser().then(fresh => {
          if (fresh) {
            localStorage.setItem('cliniva_user', JSON.stringify(fresh));
            setCurrentUser(fresh);
          }
        }).catch(() => {});
        setCurrentUser(user);
      } catch {
        localStorage.removeItem('cliniva_user');
        localStorage.removeItem('cliniva_token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cliniva_token');
    localStorage.removeItem('cliniva_user');
    setCurrentUser(null);
  };

  if (!currentUser) {
    if (showRegister) {
      return (
        <Register
          onLogin={(user) => { setCurrentUser(user); setShowRegister(false); }}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLogin={setCurrentUser}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  if (currentUser.type === 'patient') {
    return <PatientShell user={currentUser} onLogout={handleLogout} />;
  }

  return <ClinicalShell user={currentUser} onLogout={handleLogout} />;
}

// ── MAIN APP WITH PROVIDERS ────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
