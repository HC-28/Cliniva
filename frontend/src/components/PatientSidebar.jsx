import React, { useState } from 'react';
import {
  Home, User, FileText, Pill, Calendar, CalendarPlus, LogOut,
} from 'lucide-react';
import ClinivaLogo from './ClinivaLogo';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { id: 'home',          icon: Home,         label: 'Home'            },
  { id: 'profile',       icon: User,         label: 'My Profile'      },
  { id: 'history',       icon: FileText,     label: 'Medical History' },
  { id: 'prescriptions', icon: Pill,         label: 'Prescriptions'   },
  { id: 'appointments',  icon: Calendar,     label: 'Appointments'    },
  { id: 'book',          icon: CalendarPlus, label: 'Book Appointment' },
];

export default function PatientSidebar({ activeNav, setActiveNav, user }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered]   = useState(null);
  const { isDark }              = useTheme();

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        width: expanded ? '230px' : '68px',
        minHeight: '100vh',
        background: isDark ? '#1e293b' : '#ffffff',
        borderRight: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1), background 200ms ease',
        overflow: 'hidden',
        flexShrink: 0,
        zIndex: 50,
        boxShadow: isDark ? '2px 0 20px rgba(0, 0, 0, 0.35)' : '2px 0 16px rgba(15, 23, 42, 0.05)',
      }}
    >
      {/* Brand */}
      <div style={{ padding: '0 16px', borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.07)'}`, display: 'flex', alignItems: 'center', height: '64px' }}>
        <ClinivaLogo size={34} showText={expanded} textColor={isDark ? '#f8fafc' : '#0f172a'} subtitle="Patient Portal" />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          const isHov = hovered === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: isActive
                  ? '#0284c7'
                  : isHov
                  ? isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(2, 132, 199, 0.06)'
                  : 'transparent',
                color: isActive ? '#ffffff' : isDark ? '#94a3b8' : 'rgba(15, 23, 42, 0.65)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <Icon size={18} color={isActive ? '#ffffff' : isDark ? '#cbd5e1' : '#64748b'} />
              </div>
              <span style={{
                fontSize: '13.5px',
                fontWeight: isActive ? 700 : 500,
                whiteSpace: 'nowrap',
                opacity: expanded ? 1 : 0,
                transition: 'opacity 150ms ease',
                color: isActive ? '#ffffff' : isDark ? '#f8fafc' : '#0f172a',
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
