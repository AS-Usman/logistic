import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Zap, Activity, Navigation } from 'lucide-react';

const GREETINGS = [
  'Welcome to SupplyIQ',
  'Predict Shipment Delay Risk Live',
  'Weather-Aware Logistics Intelligence',
  'Proactive Supply Chain Routing'
];

export function Hero() {
  const [greetingIndex, setGreetingIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-pill">
          <Zap size={16} />
          <span>{GREETINGS[greetingIndex]}</span>
        </div>

        <h1 className="hero-title">
          SupplyIQ — <span>Delivery Delay & Route Risk Predictor</span>
        </h1>

        <p className="hero-desc">
          SupplyIQ harnesses real-time weather analytics, traffic density signals, carrier reliability scoring, and route topography to calculate shipment delay risk scores and deliver instant proactive rerouting.
        </p>

        <div className="hero-actions">
          <a href="/predictor.html" className="btn">
            Predict Delay Risk <ArrowRight size={18} />
          </a>
          <a href="/dashboard.html" className="btn btn-outline">
            Operations Insights
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <h4>98.4%</h4>
            <p>ETA Accuracy Rate</p>
          </div>
          <div className="stat-item">
            <h4>4.2 hrs</h4>
            <p>Avg Delay Prevented</p>
          </div>
          <div className="stat-item">
            <h4>12.5k+</h4>
            <p>Routes Analyzed Daily</p>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="glass-card hero-card-preview animate-float">
          <div className="hero-floating-badge animate-pulse-glow">
            <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
            <div>
              <strong style={{ fontSize: '0.85rem', display: 'block' }}>Live Route Protection</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>AI reroutes active</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Navigation size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem' }}>Chicago ➔ Dallas Express</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Shipment #RS-8849</span>
              </div>
            </div>
            <span className="badge badge-success">Low Delay Risk</span>
          </div>

          <div style={{ background: 'var(--bg-surface-solid)', padding: 18, borderRadius: 'var(--radius-md)', marginBottom: 18, border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
              <span>Predicted ETA On-Time</span>
              <strong style={{ color: 'var(--success)' }}>14:30 EST (96% Confidence)</strong>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: '88%', background: 'var(--success)' }}></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.82rem' }}>
            <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', border: '1px solid var(--border-glow)' }}>
              <div style={{ color: 'var(--text-subtle)' }}>Weather Condition</div>
              <strong style={{ color: 'var(--text-main)' }}>☀️ Clear (22°C)</strong>
            </div>
            <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', border: '1px solid var(--border-glow)' }}>
              <div style={{ color: 'var(--text-subtle)' }}>Carrier Rating</div>
              <strong style={{ color: 'var(--text-main)' }}>Tier 1 (A+ Premium)</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
