import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LayoutWrapper } from '../components/LayoutWrapper';
import { RegistrationForm } from '../components/RegistrationForm';

export function RegisterPage() {
  return (
    <LayoutWrapper>
      {({ addToast, user, setUser, logoutUser }) => (
        <RegistrationForm addToast={addToast} user={user} setUser={setUser} logoutUser={logoutUser} />
      )}
    </LayoutWrapper>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RegisterPage />
  </React.StrictMode>
);
