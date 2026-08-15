import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LayoutWrapper } from '../components/LayoutWrapper';
import { OperationsDashboard } from '../components/OperationsDashboard';

export function DashboardPage() {
  return (
    <LayoutWrapper>
      <OperationsDashboard />
    </LayoutWrapper>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DashboardPage />
  </React.StrictMode>
);
