import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateShipmentRisk } from '../hooks/useDelayPredictor';
import { API_BASE, apiRequest } from '../lib/api';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ToastContainer } from './Toast';

const DEFAULT_SHIPMENTS = [
  {
    id: 101,
    shipment_id: 'RS-9421',
    origin: 'New York, NY',
    destination: 'Chicago, IL',
    distance: 1280,
    weather: 'storm',
    route_risk: 'Moderate',
    delivery_status: 'In Transit',
    delay_days: 1
  },
  {
    id: 102,
    shipment_id: 'RS-5510',
    origin: 'Los Angeles, CA',
    destination: 'Dallas, TX',
    distance: 2300,
    weather: 'clear',
    route_risk: 'Low',
    delivery_status: 'Delivered',
    delay_days: 0
  },
  {
    id: 103,
    shipment_id: 'RS-3382',
    origin: 'Seattle, WA',
    destination: 'Denver, CO',
    distance: 2100,
    weather: 'snow',
    route_risk: 'Severe',
    delivery_status: 'Delayed',
    delay_days: 3
  }
].map((s) => ({ ...s, riskAnalysis: calculateShipmentRisk(s) }));


export function LayoutWrapper({ children }) {
  const { theme, toggleTheme } = useTheme();
  const [shipments, setShipments] = useLocalStorage('activeShipments', DEFAULT_SHIPMENTS);
  const [toasts, setToasts] = useState([]);
  const [user, setUser] = useLocalStorage('currentUser', null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync shipments & user profile with the Flask REST API on mount.
  useEffect(() => {
    apiRequest('/api/shipments')
      .then((resData) => {
        if (Array.isArray(resData)) {
          const formatted = resData.map((s) => ({
            ...s,
            riskAnalysis: calculateShipmentRisk(s)
          }));
          setShipments(formatted);
        }
      })
      .catch((err) => {
        console.error('Flask API unavailable:', err);
        addToast('Could not connect to the Flask backend. Check the API URL.', 'error');
      });

    apiRequest('/api/profile')
      .then((data) => {
        if (data?.username) setUser({ username: data.username, user_id: data.user_id });
      })
      .catch(() => {});
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveShipment = async (newShipment) => {
    const payload = {
      shipment_id: newShipment.shipment_id || newShipment.shipmentCode || ('RS-' + Math.floor(1000 + Math.random() * 9000)),
      origin: newShipment.origin,
      destination: newShipment.destination,
      distance: Number(newShipment.distance),
      weather: newShipment.weather || newShipment.weatherCondition || 'clear',
      route_risk: newShipment.route_risk || 'Low',
      delivery_status: newShipment.delivery_status || 'In Transit',
      delay_days: Number(newShipment.delay_days || 0)
    };

    try {
      const data = await apiRequest('/api/shipments', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const item = { ...data.shipment, ...newShipment, id: data.shipment.id, riskAnalysis: newShipment.riskAnalysis };
      setShipments((prev) => [item, ...prev.filter((s) => s.id !== item.id)]);
      addToast(`Shipment ${payload.shipment_id} saved to MySQL.`, 'success');
      return { ok: true, shipment: item };
    } catch (err) {
      console.error('Shipment save failed:', err);
      addToast(err.message || 'Unable to save shipment to the backend.', 'error');
      return { ok: false, error: err };
    }
  };

  const handleDeleteShipment = async (id) => {
    try {
      await apiRequest(`/api/shipments/${id}`, { method: 'DELETE' });
      setShipments((prev) => prev.filter((s) => s.id !== id && s.shipment_id !== id));
      addToast('Shipment deleted from MySQL.', 'info');
    } catch (err) {
      console.error('Shipment delete failed:', err);
      addToast(err.message || 'Unable to delete shipment.', 'error');
    }
  };

  const logoutUser = async () => {
    try {
      await apiRequest('/api/logout', { method: 'POST' });
    } catch (e) {
      console.error('Flask logout failed:', e);
    }
    setUser(null);
    addToast('Logged out successfully', 'info');
  };

  return (
    <div className="app">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        logoutUser={logoutUser}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        logoutUser={logoutUser}
      />

      <main>
        {typeof children === 'function'
          ? children({
              shipments,
              addToast,
              handleSaveShipment,
              handleDeleteShipment,
              user,
              setUser,
              logoutUser,
              toggleSidebar: () => setIsSidebarOpen(!isSidebarOpen)
            })
          : children}
      </main>
      <Footer />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
