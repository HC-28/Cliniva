import React, { useState } from 'react';
import {
  LayoutDashboard, Users, UserCog, Settings,
  FileText, Activity, ShieldCheck, HeartPulse
} from 'lucide-react';
import ClinivaLogo from './ClinivaLogo';
import { useTheme } from '../context/ThemeContext';

const NAV_BY_ROLE = {
  admin: [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Mission Control', badge: null },
    { id: 'patients',  icon: Users,           label: 'Patient Registry', badge: 'Active' },
    { id: 'staff',     icon: UserCog,         label: 'Staff Approvals', badge: 'Pending' },
    { id: 'settings',  icon: Settings,        label: 'Settings',        badge: null },
  ],
  doctor: [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Doctor Station',   badge: null },
    { id: 'patients',  icon: Users,           label: 'My Patients',     badge: null },
    { id: 'records',   icon: FileText,        label: 'Medical Records', badge: null },
    { id: 'settings',  icon: Settings,        label: 'Settings',        badge: null },
  ],
  nurse: [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Ward Overview',   badge: null },
    { id: 'patients',  icon: Users,           label: 'Patient Vitals',  badge: null },
    { id: 'settings',  icon: Settings,        label: 'Settings',        badge: null },
  ],
};

export default function Sidebar({ activeNav, setActiveNav, userType = 'admin' }) {
  const [expanded, setExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { isDark } = useTheme();
  const navItems = NAV_BY_ROLE[userType] || NAV_BY_ROLE.admin;

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        width: expanded ? '240px' : '72px',
        minHeight: '100vh',
        background: isDark ? '#1e293b' : '#ffffff',
        borderRight: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: '0',
        transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1), background 200ms ease',
        overflow: 'hidden',
        flexShrink: 0,
        zIndex: 50,
        position: 'relative',
        boxShadow: isDark ? '2px 0 20px rgba(0, 0, 0, 0.35)' : '2px 0 16px rgba(15, 23, 42, 0.05)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '12px',
          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.07)'}`,
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <ClinivaLogo size={34} showText={expanded} textColor={isDark ? '#f8fafc' : '#0f172a'} subtitle="Clinical OS" />
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          const isHovered = hoveredItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: isActive
                  ? '#0284c7'
                  : isHovered
                  ? isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(2, 132, 199, 0.06)'
                  : 'transparent',
                color: isActive
                  ? '#ffffff'
                  : isDark ? '#94a3b8' : 'rgba(15, 23, 42, 0.65)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                width: '100%',
                textAlign: 'left',
                position: 'relative',
              }}
            >
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} color={isActive ? '#ffffff' : isDark ? '#cbd5e1' : '#64748b'} />
              </div>

              <span
                style={{
                  fontSize: '13.5px',
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap',
                  opacity: expanded ? 1 : 0,
                  transition: 'opacity 150ms ease',
                  color: isActive ? '#ffffff' : isDark ? '#f8fafc' : '#0f172a',
                }}
              >
                {item.label}
              </span>

              {item.badge && expanded && (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(2, 132, 199, 0.12)',
                    color: isActive ? '#ffffff' : '#0284c7',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div
        style={{
          padding: '16px',
          borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.07)'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0, boxShadow: '0 0 8px #10b981' }} />
        {expanded && (
          <span style={{ fontSize: '11px', color: isDark ? '#94a3b8' : 'rgba(15, 23, 42, 0.5)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Encrypted Gateway
          </span>
        )}
      </div>
    </aside>
  );
}
