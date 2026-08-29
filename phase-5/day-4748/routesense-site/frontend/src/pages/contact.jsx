import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LayoutWrapper } from '../components/LayoutWrapper';
import { ContactForm } from '../components/ContactForm';

export function ContactPage() {
  return (
    <LayoutWrapper>
      {({ addToast }) => <ContactForm addToast={addToast} />}
    </LayoutWrapper>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContactPage />
  </React.StrictMode>
);
