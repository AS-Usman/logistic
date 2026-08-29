import React from 'react';
import { 
  TrendingUp, 
  ShieldAlert, 
  CloudSun, 
  HeartPulse, 
  Bot, 
  Activity 
} from 'lucide-react';

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Smart Delay Risk Scoring',
    desc: 'Evaluate route vulnerability, weather hazards, traffic density, and carrier reliability in real time.',
    color: '#10b981'
  },
  {
    icon: ShieldAlert,
    title: 'Proactive Alert Matrix',
    desc: 'Receive early warnings on potential supply chain disruptions 6-12 hours before departure.',
    color: '#8b5cf6'
  },
  {
    icon: CloudSun,
    title: 'Weather-Aware Routing',
    desc: 'Automatically reroute cargo corridors around severe storms, extreme heat, or blizzard passes.',
    color: '#f59e0b'
  },
  {
    icon: HeartPulse,
    title: 'Fleet Health & Availability',
    desc: 'Monitor vehicle maintenance readiness, fuel burn efficiency, and driver safety scores.',
    color: '#0ea5e9'
  },
  {
    icon: Bot,
    title: 'AI Dispatch Automation',
    desc: 'Reduce manual dispatch workload with automated load balancing and predictive ETA adjustments.',
    color: '#ef4444'
  },
  {
    icon: Activity,
    title: 'Supply Chain Pulse',
    desc: 'Visualize live performance metrics across national and international freight lanes.',
    color: '#a855f7'
  }
];

export function FeaturesSection() {
  return (
    <section className="section" id="features">
      <div className="section-header">
        <span className="section-subtitle">Platform Capabilities</span>
        <h2 className="section-title">Intelligent Logistics Features</h2>
        <p className="section-desc">
          SupplyIQ provides an end-to-end intelligence stack for logistics managers, dispatchers, and fleet operators.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
        {FEATURES.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-md)',
                  background: `${feat.color}18`,
                  color: feat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20
                }}
              >
                <Icon size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
