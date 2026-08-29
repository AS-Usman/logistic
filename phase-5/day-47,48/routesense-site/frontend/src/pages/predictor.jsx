import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LayoutWrapper } from '../components/LayoutWrapper';
import { ShipmentRiskForm } from '../components/ShipmentRiskForm';

export function PredictorPage() {
  return (
    <LayoutWrapper>
      {({ handleSaveShipment, addToast }) => (
        <ShipmentRiskForm onSaveShipment={handleSaveShipment} addToast={addToast} />
      )}
    </LayoutWrapper>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PredictorPage />
  </React.StrictMode>
);
