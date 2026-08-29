import React from 'react';
import { ShieldCheck, Cpu, Globe2, Sparkles } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="section" id="about" style={{ background: 'var(--primary-light)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        <div className="glass-card" style={{ padding: 40, border: '1px solid var(--border-glow)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: 12 }}>
            <Sparkles size={16} /> Empowering Modern Supply Chains
          </div>
          <h2 className="section-title" style={{ fontSize: '2.2rem', marginBottom: 18 }}>
            Built for Freight Operators, Dispatchers & Planners
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
            SupplyIQ turns raw telematics, weather feeds, and traffic congestion data into real-time actionable logistics intelligence. Our platform bridges the gap between static route planning and dynamic real-world disruptions.
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            With predictive delay scoring, adaptive rerouting recommendations, fleet condition monitoring, and instant risk alerts, SupplyIQ ensures deliveries arrive safely, on schedule, and at peak efficiency.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <Cpu size={32} style={{ color: 'var(--primary)', marginBottom: 12 }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>Machine Learning ETA</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
              Self-correcting ETA predictions based on historical corridor performance.
            </p>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <Globe2 size={32} style={{ color: 'var(--secondary)', marginBottom: 12 }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>Global Corridor Coverage</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
              Real-time monitoring across road, rail, air, and ocean freight networks.
            </p>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <ShieldCheck size={32} style={{ color: 'var(--success)', marginBottom: 12 }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>Risk Prevention</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
              Reduce delay penalties and cargo degradation with early proactive interventions.
            </p>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <Sparkles size={32} style={{ color: 'var(--accent)', marginBottom: 12 }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>Automated Dispatch</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
              Seamlessly balance fleet driver workloads and prevent burnout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
