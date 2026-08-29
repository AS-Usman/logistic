import React from 'react';
import { Truck, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: 'var(--bg-surface-solid)', borderTop: '1px solid var(--border-light)', padding: '50px 8% 30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
          <Truck size={26} /> SupplyIQ
        </div>

        <div style={{ display: 'flex', gap: 24, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <a href="/index.html" style={{ textDecoration: 'none', color: 'inherit' }}>Home</a>
          <a href="/predictor.html" style={{ textDecoration: 'none', color: 'inherit' }}>Risk Predictor</a>
          <a href="/shipments.html" style={{ textDecoration: 'none', color: 'inherit' }}>Active Monitor</a>
          <a href="/dashboard.html" style={{ textDecoration: 'none', color: 'inherit' }}>Dashboard</a>
          <a href="/contact.html" style={{ textDecoration: 'none', color: 'inherit' }}>Support</a>
        </div>

        <button className="btn btn-outline btn-icon" onClick={scrollToTop} title="Back to Top">
          <ArrowUp size={20} />
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 20, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
        © {new Date().getFullYear()} SupplyIQ — Delivery Delay & Route Risk Predictor. All rights reserved.
      </div>
    </footer>
  );
}
