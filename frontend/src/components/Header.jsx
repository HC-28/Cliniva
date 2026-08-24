import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Bell, ChevronDown, Shield, LogOut, User, Settings,
  X, Clock, Sun, Moon, CheckCheck, Trash2, CheckCircle2, AlertTriangle, AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useGlobalToast } from '../context/ToastContext';

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'critical', title: 'BioPod Critical Alert', text: 'Pod B-4 patient SpO2 dropped below 90%', time: '2m ago', read: false },
  { id: 2, type: 'warning', title: 'Medication Due', text: 'Dr. Torres prescribed Metoprolol 25mg refill', time: '14m ago', read: false },
  { id: 3, type: 'info', title: 'Telemetry Sync', text: 'All bio-sensors synchronized across 8 active pods', time: '45m ago', read: true },
  { id: 4, type: 'success', title: 'Consultation Confirmed', text: 'Dr. Lucas Chen confirmed tomorrow appointment', time: '1h ago', read: true },
];

export default function Header({ user, onLogout }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { toast } = useGlobalToast();

  const [searchFocus, setSearchFocus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocus(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const clearNotifications = () => {
    setNotifications([]);
    toast.info('Notifications cleared');
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <header
      style={{
        height: '64px',
        background: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
        transition: 'background 200ms ease, border-color 200ms ease',
      }}
    >
      {/* Search Bar */}
      <div ref={searchRef} style={{ flex: 1, maxWidth: '460px', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
            border: `1.5px solid ${
              searchFocus ? '#0284c7' : isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)'
            }`,
            borderRadius: '12px',
            padding: '0 14px',
            height: '38px',
            transition: 'all 200ms ease',
          }}
        >
          <Search size={14} color={searchFocus ? '#0284c7' : isDark ? '#94a3b8' : 'rgba(15, 23, 42, 0.35)'} strokeWidth={2} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            placeholder="Search patient, doctor, record..."
            style={{
              flex: 1,
              fontSize: '13px',
              color: isDark ? '#f8fafc' : '#0f172a',
              background: 'transparent',
              border: 'none',
              outline: 'none',
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ color: 'rgba(15,23,42,0.35)', cursor: 'pointer', background: 'none', border: 'none', padding: 0, display: 'flex' }}>
              <X size={13} />
            </button>
          )}
          <kbd
            style={{
              fontSize: '10px',
              color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.35)',
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.05)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'monospace',
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Live Health Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 10px #10b981',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
          SYSTEM LIVE
        </span>
      </div>

      {/* ── THEME SWITCHER BUTTON (Light / Dark Toggle) ── */}
      <button
        onClick={toggleTheme}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle Theme"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.04)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.09)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: isDark ? '#fbbf24' : '#0284c7',
          transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isDark ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
      </button>

      {/* ── NOTIFICATION CENTER ── */}
      <div ref={notifRef} style={{ position: 'relative' }}>
        <button
          onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: showNotifications
              ? 'rgba(2, 132, 199, 0.15)'
              : isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.04)',
            border: `1px solid ${
              showNotifications ? '#0284c7' : isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.09)'
            }`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 150ms ease',
            position: 'relative',
          }}
        >
          <Bell size={16} color={showNotifications ? '#0284c7' : isDark ? '#cbd5e1' : 'rgba(15, 23, 42, 0.6)'} strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#e11d48',
                boxShadow: '0 0 6px #e11d48',
              }}
            />
          )}
        </button>

        {showNotifications && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '340px',
              background: isDark ? '#1e293b' : '#ffffff',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)'}`,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.22)',
              animation: 'fadeIn 0.15s ease both',
              zIndex: 100,
            }}
          >
            <div
              style={{
                padding: '14px 18px',
                borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>Clinical Alerts</span>
                {unreadCount > 0 && (
                  <span style={{ fontSize: '11px', color: '#0284c7', background: 'rgba(2, 132, 199, 0.1)', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: 600 }}
                  >
                    <CheckCheck size={13} />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    title="Clear notifications"
                    style={{ background: 'none', border: 'none', color: 'rgba(15, 23, 42, 0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: isDark ? '#94a3b8' : 'rgba(15, 23, 42, 0.45)', fontSize: '13px' }}>
                  No active clinical alerts
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    style={{
                      padding: '12px 16px',
                      display: 'flex',
                      gap: '12px',
                      background: n.read ? 'transparent' : isDark ? 'rgba(2, 132, 199, 0.08)' : 'rgba(2, 132, 199, 0.03)',
                      borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)'}`,
                      cursor: 'pointer',
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(2, 132, 199, 0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : isDark ? 'rgba(2, 132, 199, 0.08)' : 'rgba(2, 132, 199, 0.03)'}
                  >
                    <div style={{ marginTop: '2px', flexShrink: 0 }}>
                      {n.type === 'critical' ? (
                        <AlertCircle size={15} color="#e11d48" />
                      ) : n.type === 'warning' ? (
                        <AlertTriangle size={15} color="#d97706" />
                      ) : (
                        <CheckCircle2 size={15} color="#0284c7" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: isDark ? '#f8fafc' : '#0f172a' }}>{n.title}</div>
                      <div style={{ fontSize: '12px', color: isDark ? '#94a3b8' : 'rgba(15, 23, 42, 0.65)', lineHeight: 1.4, marginTop: '2px' }}>
                        {n.text}
                      </div>
                      <div style={{ fontSize: '10.5px', color: isDark ? '#64748b' : 'rgba(15, 23, 42, 0.4)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={10} /> {n.time}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── PROFILE MENU ── */}
      <div ref={profileRef} style={{ position: 'relative' }}>
        <button
          onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: showProfile
              ? 'rgba(2, 132, 199, 0.12)'
              : isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.04)',
            border: `1px solid ${
              showProfile ? '#0284c7' : isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.09)'
            }`,
            borderRadius: '12px',
            padding: '4px 10px 4px 4px',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '10px',
              fontWeight: 800,
              color: '#fff',
            }}
          >
            {user?.avatar || <Shield size={14} color="#fff" />}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', lineHeight: 1.2 }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: '10px', color: '#0284c7', fontWeight: 600 }}>
              {user?.role || 'Clinician'}
            </div>
          </div>
          <ChevronDown
            size={12}
            color={isDark ? '#94a3b8' : 'rgba(15, 23, 42, 0.4)'}
            style={{ transform: showProfile ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}
          />
        </button>

        {showProfile && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '210px',
              background: isDark ? '#1e293b' : '#ffffff',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)'}`,
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.22)',
              animation: 'fadeIn 0.15s ease both',
              zIndex: 100,
            }}
          >
            <div style={{ padding: '12px 14px', borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)'}` }}>
              <div style={{ fontSize: '11px', color: isDark ? '#94a3b8' : 'rgba(15, 23, 42, 0.45)', textTransform: 'uppercase', fontWeight: 600 }}>
                Signed in as
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.email || 'user@cliniva.io'}
              </div>
            </div>

            <button
              onClick={onLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#e11d48',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(225, 29, 72, 0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
