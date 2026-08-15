import React, { useState } from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Truck, CloudRain } from 'lucide-react';

const DASHBOARD_DATA = {
  operations: {
    title: 'Total Deliveries',
    value: '1,280',
    change: '+8.4% vs last week',
    secondary: { label: 'On-time Score', value: '94.8%', change: '+4.2% quality gain' },
    tertiary: { label: 'Active Routes', value: '312', change: '+14 routes added' },
    chartTitle: 'Weekly Shipment Throughput',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [65, 72, 88, 79, 94, 108, 98]
  },
  risk: {
    title: 'Risk Exposure Rate',
    value: '23.4%',
    change: '-12% high-risk routes',
    secondary: { label: 'Critical Alerts', value: '8', change: '-5 critical alerts' },
    tertiary: { label: 'Safe Corridors', value: '86.2%', change: '+7% network safety' },
    chartTitle: 'Risk Signal Frequency (Incidents)',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [18, 14, 20, 10, 12, 8, 5]
  },
  fleet: {
    title: 'Fleet Readiness',
    value: '89.5%',
    change: '+5.2% availability',
    secondary: { label: 'Fuel Efficiency', value: '18.4 km/l', change: '+1.2 km/l optimized' },
    tertiary: { label: 'Active Vehicles', value: '48', change: '+4 vehicles dispatched' },
    chartTitle: 'Fleet Utilization Index',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [76, 84, 90, 92, 88, 85, 82]
  },
  weather: {
    title: 'Weather Disruption Rate',
    value: '11.8%',
    change: 'Light delay exposure',
    secondary: { label: 'Severe Storm Alerts', value: '2', change: '-2 active warnings' },
    tertiary: { label: 'Clear Route Corridors', value: '71.5%', change: '+12% smooth transit' },
    chartTitle: 'Weather Delay Risk Signals',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [8, 11, 7, 13, 6, 9, 4]
  }
};

export function OperationsDashboard() {
  const [activeTab, setActiveTab] = useState('operations');
  const currentData = DASHBOARD_DATA[activeTab];

  return (
    <section className="section" id="dashboard">
      <div className="section-header">
        <span className="section-subtitle">Real-Time Intelligence</span>
        <h2 className="section-title">Operations Analytics Dashboard</h2>
        <p className="section-desc">
          Monitor network throughput, risk signal trends, fleet utilization, and weather impact patterns in real time.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="tab-container">
          <button
            className={`tab-btn ${activeTab === 'operations' ? 'active' : ''}`}
            onClick={() => setActiveTab('operations')}
          >
            Operations
          </button>
          <button
            className={`tab-btn ${activeTab === 'risk' ? 'active' : ''}`}
            onClick={() => setActiveTab('risk')}
          >
            Risk Exposure
          </button>
          <button
            className={`tab-btn ${activeTab === 'fleet' ? 'active' : ''}`}
            onClick={() => setActiveTab('fleet')}
          >
            Fleet Health
          </button>
          <button
            className={`tab-btn ${activeTab === 'weather' ? 'active' : ''}`}
            onClick={() => setActiveTab('weather')}
          >
            Weather Impact
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 28 }}>
        {/* Metric Cards Stack */}
        <div style={{ display: 'grid', gap: 18 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-subtle)', fontWeight: 600, letterSpacing: '0.05em' }}>
              {currentData.title}
            </span>
            <h3 style={{ fontSize: '2.4rem', margin: '6px 0', color: 'var(--primary)' }}>
              {currentData.value}
            </h3>
            <span className="badge badge-success">{currentData.change}</span>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-subtle)', fontWeight: 600, letterSpacing: '0.05em' }}>
              {currentData.secondary.label}
            </span>
            <h3 style={{ fontSize: '2.4rem', margin: '6px 0', color: 'var(--text-main)' }}>
              {currentData.secondary.value}
            </h3>
            <span className="badge badge-info">{currentData.secondary.change}</span>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-subtle)', fontWeight: 600, letterSpacing: '0.05em' }}>
              {currentData.tertiary.label}
            </span>
            <h3 style={{ fontSize: '2.4rem', margin: '6px 0', color: 'var(--accent)' }}>
              {currentData.tertiary.value}
            </h3>
            <span className="badge badge-success">{currentData.tertiary.change}</span>
          </div>
        </div>

        {/* Dynamic Chart Card */}
        <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <BarChart3 size={22} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.25rem' }}>{currentData.chartTitle}</h3>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
              7-Day Rolling Trend Analysis
            </span>
          </div>

          <div className="chart-bars-grid">
            {currentData.values.map((val, idx) => (
              <div key={idx} className="chart-column">
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>{val}</span>
                <div
                  className="chart-bar-fill"
                  style={{ height: `${val}%` }}
                ></div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{currentData.labels[idx]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
