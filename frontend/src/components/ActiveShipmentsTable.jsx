import React, { useState } from 'react';
import { Search, Filter, Trash2, Eye, ShieldAlert, Truck, AlertTriangle } from 'lucide-react';

export function ActiveShipmentsTable({ shipments, onDeleteShipment, addToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedShipment, setSelectedShipment] = useState(null);

  const filteredShipments = shipments.filter((s) => {
    const code = s.shipment_id || s.shipmentCode || '';
    const origin = s.origin || '';
    const destination = s.destination || '';
    const matchesSearch =
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.toLowerCase().includes(searchTerm.toLowerCase());

    const risk = (s.route_risk || (s.riskAnalysis && s.riskAnalysis.riskLevel) || 'low').toLowerCase();

    if (filterLevel === 'all') return matchesSearch;
    if (filterLevel === 'high') return matchesSearch && (risk === 'high' || risk === 'severe');
    return matchesSearch && risk === filterLevel;
  });

  return (
    <section className="section" id="active-shipments">
      <div className="section-header">
        <span className="section-subtitle">Live Operations Monitor</span>
        <h2 className="section-title">Active Tracked Shipments</h2>
        <p className="section-desc">
          Review all currently tracked shipments, real-time risk scores, predicted ETA delays, and active mitigation alerts.
        </p>
      </div>

      <div className="glass-card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: 280 }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: 44 }}
              placeholder="Search code, origin, destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Filter size={16} style={{ color: 'var(--text-subtle)' }} />
            <button
              className={`btn btn-sm ${filterLevel === 'all' ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => setFilterLevel('all')}
            >
              All ({shipments.length})
            </button>
            <button
              className={`btn btn-sm ${filterLevel === 'low' ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => setFilterLevel('low')}
            >
              Low Risk
            </button>
            <button
              className={`btn btn-sm ${filterLevel === 'moderate' ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => setFilterLevel('moderate')}
            >
              Moderate
            </button>
            <button
              className={`btn btn-sm ${filterLevel === 'high' ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => setFilterLevel('high')}
            >
              High / Severe
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="shipments-table">
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Route Corridor</th>
                <th>Status</th>
                <th>Weather</th>
                <th>Delay Risk</th>
                <th>Est. Delay</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 40, color: 'var(--text-subtle)' }}>
                    No shipments match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => {
                  const ra = shipment.riskAnalysis || {};
                  const code = shipment.shipment_id || shipment.shipmentCode || `#${shipment.id}`;
                  const weatherVal = shipment.weather || shipment.weatherCondition || 'clear';
                  const riskLabel = shipment.route_risk || ra.riskLevel || 'Low';
                  const statusLabel = shipment.delivery_status || 'In Transit';
                  const delayDisplay = shipment.delay_days !== undefined && shipment.delay_days !== null
                    ? `${shipment.delay_days} days`
                    : `+${ra.estimatedDelayHours || 0} hrs`;

                  return (
                    <tr key={shipment.id || code}>
                      <td>
                        <strong style={{ color: 'var(--primary)' }}>{code}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{shipment.origin} ➔ {shipment.destination}</div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{shipment.distance} km</span>
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                          {statusLabel}
                        </span>
                      </td>
                      <td>
                        <span>{ra.weatherInfo?.icon || '🌤️'} {weatherVal}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${ra.badgeColor || (riskLabel === 'Severe' ? 'danger' : riskLabel === 'High' ? 'warning' : 'success')}`}>
                          {ra.riskScore ? `${ra.riskScore}% (${riskLabel})` : riskLabel}
                        </span>
                      </td>
                      <td>
                        <strong>{delayDisplay}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            className="btn btn-outline btn-icon"
                            style={{ width: 34, height: 34 }}
                            onClick={() => setSelectedShipment(shipment)}
                            title="View Risk Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn btn-outline btn-icon"
                            style={{ width: 34, height: 34, borderColor: 'var(--danger-bg)', color: 'var(--danger)' }}
                            onClick={() => {
                              onDeleteShipment(shipment.id || shipment.shipment_id);
                              addToast(`Shipment ${code} removed`, 'info');
                            }}
                            title="Remove Shipment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {selectedShipment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-card" style={{ maxWidth: 560, width: '100%', padding: 32, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: '1.4rem' }}>{selectedShipment.shipmentCode} Risk Details</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                  {selectedShipment.origin} to {selectedShipment.destination}
                </span>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedShipment(null)}
              >
                Close
              </button>
            </div>

            <div style={{ background: 'var(--bg-surface-solid)', padding: 18, borderRadius: 'var(--radius-md)', marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Calculated Risk Score</span>
                <strong style={{ color: 'var(--primary)' }}>{selectedShipment.riskAnalysis?.riskScore}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Predicted Arrival Delay</span>
                <strong style={{ color: 'var(--warning)' }}>+{selectedShipment.riskAnalysis?.estimatedDelayHours} Hours</strong>
              </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
              Recommended Mitigation Strategy
            </h4>
            <div className="recommendation-card">
              <ShieldAlert size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>
                {selectedShipment.riskAnalysis?.recommendations[0] || 'Maintain current route metrics and schedule.'}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
