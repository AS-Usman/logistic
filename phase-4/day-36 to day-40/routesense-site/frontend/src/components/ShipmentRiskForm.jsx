import React, { useState } from 'react';
import { useDelayPredictor } from '../hooks/useDelayPredictor';
import { 
  Calculator, 
  MapPin, 
  Truck, 
  Package, 
  CloudSun, 
  Award, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Zap,
  BookmarkPlus
} from 'lucide-react';

export function ShipmentRiskForm({ onSaveShipment, addToast }) {
  const [formData, setFormData] = useState({
    shipmentCode: 'RS-' + Math.floor(1000 + Math.random() * 9000),
    origin: 'New York, NY',
    destination: 'Chicago, IL',
    transportMode: 'truck',
    cargoCategory: 'standard',
    cargoWeight: 4500,
    distance: 1280,
    weatherCondition: 'rain',
    carrierRating: 'A',
    trafficCongestion: 45
  });

  // Real-time risk assessment using custom hook
  const riskAnalysis = useDelayPredictor(formData);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' || name === 'trafficCongestion' ? Number(value) : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const code = formData.shipmentCode || ('RS-' + Math.floor(1000 + Math.random() * 9000));
    const newShipment = {
      id: Date.now(),
      shipment_id: code,
      shipmentCode: code,
      origin: formData.origin,
      destination: formData.destination,
      distance: Number(formData.distance),
      weather: formData.weatherCondition || 'clear',
      weatherCondition: formData.weatherCondition,
      route_risk: riskAnalysis.riskLevel || 'Low',
      delivery_status: 'In Transit',
      delay_days: Math.round((riskAnalysis.estimatedDelayHours || 0) / 24) || 0,
      transportMode: formData.transportMode,
      cargoCategory: formData.cargoCategory,
      cargoWeight: formData.cargoWeight,
      carrierRating: formData.carrierRating,
      trafficCongestion: formData.trafficCongestion,
      riskAnalysis,
      timestamp: new Date().toISOString()
    };
    onSaveShipment(newShipment);
  };

  // SVG Gauge Calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskAnalysis.riskScore / 100) * circumference;

  const getGaugeColor = () => {
    if (riskAnalysis.riskScore >= 75) return 'var(--danger)';
    if (riskAnalysis.riskScore >= 52) return 'var(--warning)';
    if (riskAnalysis.riskScore >= 30) return 'var(--info)';
    return 'var(--success)';
  };

  return (
    <section className="section" id="predictor">
      <div className="section-header">
        <span className="section-subtitle">Core Intelligence Module</span>
        <h2 className="section-title">Shipment Delay Risk Predictor</h2>
        <p className="section-desc">
          Enter shipment metadata below. Our predictive engine evaluates environmental hazards, modal dynamics, and route metrics in real time.
        </p>
      </div>

      <div className="risk-predictor-wrapper">
        {/* Left Form Panel */}
        <div className="glass-card" style={{ padding: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Calculator size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Shipment Parameters</h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>Form ID: {formData.shipmentCode}</span>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label"><MapPin size={16} /> Origin Location</label>
                <input
                  type="text"
                  name="origin"
                  className="form-control"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="e.g. New York, NY"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label"><MapPin size={16} /> Destination</label>
                <input
                  type="text"
                  name="destination"
                  className="form-control"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g. Chicago, IL"
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label"><Truck size={16} /> Transport Mode</label>
                <select name="transportMode" className="form-select" value={formData.transportMode} onChange={handleChange}>
                  <option value="truck">Road Truck Freight</option>
                  <option value="air">Air Cargo Express</option>
                  <option value="rail">Rail Freight</option>
                  <option value="maritime">Ocean Maritime Shipping</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label"><Package size={16} /> Cargo Category</label>
                <select name="cargoCategory" className="form-select" value={formData.cargoCategory} onChange={handleChange}>
                  <option value="standard">Standard General Goods</option>
                  <option value="perishable">Perishable Food / Cold Chain</option>
                  <option value="electronics">High-Value Electronics</option>
                  <option value="hazardous">Hazardous Materials</option>
                  <option value="heavy">Heavy Machinery</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label"><CloudSun size={16} /> Weather Forecast</label>
                <select name="weatherCondition" className="form-select" value={formData.weatherCondition} onChange={handleChange}>
                  <option value="clear">☀️ Clear & Sunny</option>
                  <option value="rain">🌧️ Moderate Rain</option>
                  <option value="fog">🌫️ Dense Fog / Low Visibility</option>
                  <option value="snow">❄️ Heavy Snow / Ice</option>
                  <option value="storm">⛈️ Severe Thunderstorm / Hurricane</option>
                  <option value="heatwave">🌡️ Extreme Heatwave</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label"><Award size={16} /> Carrier Rating</label>
                <select name="carrierRating" className="form-select" value={formData.carrierRating} onChange={handleChange}>
                  <option value="A+">Tier 1 A+ (Premium Reliability)</option>
                  <option value="A">Tier 1 A (Standard Fleet)</option>
                  <option value="B">Tier 2 B (Average Performance)</option>
                  <option value="C">Tier 3 C (Higher Disruption)</option>
                  <option value="D">Tier 4 D (High Maintenance Risk)</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Distance (km)</label>
                <input
                  type="number"
                  name="distance"
                  min="50"
                  max="15000"
                  className="form-control"
                  value={formData.distance}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cargo Weight (kg)</label>
                <input
                  type="number"
                  name="cargoWeight"
                  min="100"
                  max="50000"
                  className="form-control"
                  value={formData.cargoWeight}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group range-slider-container">
              <div className="range-slider-header">
                <label className="form-label"><Activity size={16} /> Traffic Congestion Index</label>
                <strong style={{ color: 'var(--primary)' }}>{formData.trafficCongestion}% Density</strong>
              </div>
              <input
                type="range"
                name="trafficCongestion"
                min="0"
                max="100"
                className="range-slider"
                value={formData.trafficCongestion}
                onChange={handleChange}
              />
            </div>

            {/* Quick What-If Simulator Buttons */}
            <div style={{ background: 'var(--primary-light)', padding: 16, borderRadius: 'var(--radius-md)', marginBottom: 24, border: '1px solid var(--border-glow)' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Zap size={14} /> Quick What-If Scenario Simulator:
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setFormData(p => ({ ...p, weatherCondition: p.weatherCondition === 'clear' ? 'storm' : 'clear' }))}
                >
                  Toggle Storm / Clear
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setFormData(p => ({ ...p, transportMode: p.transportMode === 'truck' ? 'air' : 'truck' }))}
                >
                  Switch Air / Truck
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setFormData(p => ({ ...p, carrierRating: p.carrierRating === 'A+' ? 'D' : 'A+' }))}
                >
                  Toggle A+ / D Carrier
                </button>
              </div>
            </div>

            <button type="submit" className="btn" style={{ width: '100%' }}>
              <BookmarkPlus size={18} /> Save & Track Shipment
            </button>
          </form>
        </div>

        {/* Right Output Panel */}
        <div className="glass-card" style={{ padding: 36 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.3rem', textAlign: 'center', marginBottom: 6 }}>Live Risk Assessment</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textAlign: 'center' }}>
              Calculated real-time for {formData.origin} ➔ {formData.destination}
            </p>
          </div>

          <div className="risk-meter-container">
            <div className="risk-gauge">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle
                  className="risk-gauge-bg"
                  cx="90"
                  cy="90"
                  r={radius}
                />
                <circle
                  className="risk-gauge-circle risk-gauge-val"
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke={getGaugeColor()}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="risk-gauge-content">
                <span className="risk-score-num" style={{ color: getGaugeColor() }}>
                  {riskAnalysis.riskScore}%
                </span>
                <span className="risk-score-label">Delay Risk</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <span className={`badge badge-${riskAnalysis.badgeColor}`}>
                {riskAnalysis.riskLevel} Delay Exposure
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'center', marginTop: 16 }}>
              <div style={{ background: 'var(--bg-surface-solid)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Est. Delay Impact</span>
                <h4 style={{ fontSize: '1.3rem', color: 'var(--warning)', marginTop: 4 }}>
                  +{riskAnalysis.estimatedDelayHours} hrs
                </h4>
              </div>
              <div style={{ background: 'var(--bg-surface-solid)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Total Transit Time</span>
                <h4 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginTop: 4 }}>
                  {riskAnalysis.totalEstimatedHours} hrs
                </h4>
              </div>
            </div>
          </div>

          {/* Breakdown progress bars */}
          <div className="breakdown-list">
            <h4 style={{ fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Disruption Factor Breakdown
            </h4>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span>Weather & Atmospheric Impact ({riskAnalysis.weatherInfo.label})</span>
                <strong>{riskAnalysis.breakdown.weather}%</strong>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${riskAnalysis.breakdown.weather}%`, background: 'var(--secondary)' }}></div>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span>Traffic & Road Congestion Density</span>
                <strong>{riskAnalysis.breakdown.traffic}%</strong>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${riskAnalysis.breakdown.traffic}%`, background: 'var(--warning)' }}></div>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span>Carrier Rating Risk ({riskAnalysis.carrierInfo.label})</span>
                <strong>{riskAnalysis.breakdown.carrier}%</strong>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${riskAnalysis.breakdown.carrier}%`, background: 'var(--danger)' }}></div>
              </div>
            </div>
          </div>

          {/* AI Mitigation Strategy */}
          <div style={{ marginTop: 24 }}>
            <h4 style={{ fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
              AI Rerouting & Action Plan
            </h4>
            {riskAnalysis.recommendations.map((rec, i) => (
              <div key={i} className="recommendation-card">
                <Zap size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
