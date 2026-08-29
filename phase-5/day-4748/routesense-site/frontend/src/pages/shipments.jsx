import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LayoutWrapper } from '../components/LayoutWrapper';
import { ActiveShipmentsTable } from '../components/ActiveShipmentsTable';

export function ShipmentsPage() {
  return (
    <LayoutWrapper>
      {({ shipments, handleDeleteShipment, addToast }) => (
        <ActiveShipmentsTable
          shipments={shipments}
          onDeleteShipment={handleDeleteShipment}
          addToast={addToast}
        />
      )}
    </LayoutWrapper>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ShipmentsPage />
  </React.StrictMode>
);
