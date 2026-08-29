import React, { useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Mail, 
  Activity, 
  ShieldAlert, 
  Moon, 
  Sun, 
  Truck, 
  User, 
  LogOut, 
  Server, 
  Home, 
  Calculator, 
  Package, 
  LayoutDashboard,
  ExternalLink
} from 'lucide-react';

export function Sidebar({ isOpen, onClose, theme, toggleTheme, user, logoutUser }) {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div className="sidebar-backdrop" onClick={onClose} />

      {/* Slide-out Sidebar Drawer */}
      <aside className="sidebar-drawer">
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Truck size={24} style={{ color: 'var(--primary)' }} />
            <span>SupplyIQ Tools</span>
          </div>
          <button className="btn btn-outline btn-icon" onClick={onClose} title="Close Sidebar">
            <X size={20} />
          </button>
        </div>

        {/* User Status Card */}
        {user ? (
          <div className="glass-card sidebar-user-card">
            <div className="sidebar-user-avatar">
              <User size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '0.9rem', display: 'block' }}>{user.username}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Active Flask Session</span>
            </div>
            {logoutUser && (
              <button className="btn btn-outline btn-sm" onClick={logoutUser} title="Logout">
                <LogOut size={16} />
              </button>
            )}
          </div>
        ) : (
          <div className="glass-card sidebar-user-card" style={{ background: 'var(--primary-light)' }}>
            <ShieldAlert size={20} style={{ color: 'var(--primary)' }} />
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '0.88rem', display: 'block' }}>Guest Session</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Log in to persist predictions</span>
            </div>
            <a href="/register.html" className="btn btn-sm">Login</a>
          </div>
        )}

        {/* Secondary Features Section */}
        <div className="sidebar-section">
          <span className="sidebar-section-title">Secondary Features & Support</span>
          <ul className="sidebar-links">
            <li>
              <a href="/features.html" className={`sidebar-link ${currentPath.includes('/features.html') ? 'active' : ''}`} onClick={onClose}>
                <Sparkles size={18} />
                <span>Platform Features</span>
              </a>
            </li>
            <li>
              <a href="/contact.html" className={`sidebar-link ${currentPath.includes('/contact.html') ? 'active' : ''}`} onClick={onClose}>
                <Mail size={18} />
                <span>Contact Support</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Quick System Navigation */}
        <div className="sidebar-section">
          <span className="sidebar-section-title">Core Navigation</span>
          <ul className="sidebar-links">
            <li>
              <a href="/index.html" className={`sidebar-link ${currentPath === '/' || currentPath === '/index.html' ? 'active' : ''}`} onClick={onClose}>
                <Home size={18} />
                <span>Home Page</span>
              </a>
            </li>
            <li>
              <a href="/predictor.html" className={`sidebar-link ${currentPath.includes('/predictor.html') ? 'active' : ''}`} onClick={onClose}>
                <Calculator size={18} />
                <span>Risk Predictor</span>
              </a>
            </li>
            <li>
              <a href="/shipments.html" className={`sidebar-link ${currentPath.includes('/shipments.html') ? 'active' : ''}`} onClick={onClose}>
                <Package size={18} />
                <span>Active Shipments</span>
              </a>
            </li>
            <li>
              <a href="/dashboard.html" className={`sidebar-link ${currentPath.includes('/dashboard.html') ? 'active' : ''}`} onClick={onClose}>
                <LayoutDashboard size={18} />
                <span>Operations Dashboard</span>
              </a>
            </li>
          </ul>
        </div>

        {/* System Utility Controls */}
        <div className="sidebar-section">
          <span className="sidebar-section-title">System & Utilities</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Theme Toggle */}
            <button className="btn btn-outline" onClick={toggleTheme} style={{ justifyContent: 'space-between', width: '100%' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem' }}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </span>
              <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>Toggle</span>
            </button>

            {/* Flask API Health Badge */}
            <div className="sidebar-status-box">
              <Server size={18} style={{ color: 'var(--success)' }} />
              <div>
                <strong style={{ fontSize: '0.82rem', display: 'block' }}>Flask REST API</strong>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>Port 5000 • MySQL Online</span>
              </div>
            </div>

            {/* Node API Health Badge */}
            <div className="sidebar-status-box">
              <Activity size={18} style={{ color: 'var(--secondary)' }} />
              <div>
                <strong style={{ fontSize: '0.82rem', display: 'block' }}>Node Express Server</strong>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>Port 5001 • Standby</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <span>SupplyIQ v1.0 • Monorepo</span>
        </div>
      </aside>
    </>
  );
}
