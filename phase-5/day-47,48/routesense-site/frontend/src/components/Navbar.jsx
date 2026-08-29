import React, { useState } from 'react';
import { Truck, Moon, Sun, Menu, X, ShieldAlert, SlidersHorizontal } from 'lucide-react';

export function Navbar({ theme, toggleTheme, user, logoutUser, onToggleSidebar }) {
  const [isOpen, setIsOpen] = useState(false);

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  // Streamlined primary top bar navigation links
  const navLinks = [
    { label: 'Home', href: '/index.html' },
    { label: 'Risk Predictor', href: '/predictor.html' },
    { label: 'Active Shipments', href: '/shipments.html' },
    { label: 'Dashboard', href: '/dashboard.html' },
    { label: user ? `Account (${user.username})` : 'Register / Login', href: '/register.html' },
  ];

  const isLinkActive = (href) => {
    if (href === '/index.html' && (currentPath === '/' || currentPath === '/index.html')) return true;
    return currentPath.includes(href);
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Sidebar Drawer Toggle Button */}
        {onToggleSidebar && (
          <button
            className="btn btn-outline btn-icon"
            onClick={onToggleSidebar}
            title="Open Hidable Sidebar Tools"
            aria-label="Open Sidebar Drawer"
            style={{ borderColor: 'var(--border-glow)' }}
          >
            <SlidersHorizontal size={18} />
          </button>
        )}

        <a href="/index.html" className="brand">
          <Truck size={28} style={{ color: 'var(--primary)' }} />
          <span>SupplyIQ</span>
        </a>
      </div>

      <ul className={`nav-menu ${isOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className={`nav-link ${isLinkActive(link.href) ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-controls">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
              👤 {user.username}
            </span>
            {logoutUser && (
              <button
                className="btn btn-outline btn-sm"
                onClick={logoutUser}
                title="Logout Flask Session"
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                Logout
              </button>
            )}
          </div>
        ) : (
          <div className="badge badge-success" style={{ display: 'none', md: 'flex' }}>
            <ShieldAlert size={14} /> Network Active
          </div>
        )}

        <button
          className="btn btn-outline btn-icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
