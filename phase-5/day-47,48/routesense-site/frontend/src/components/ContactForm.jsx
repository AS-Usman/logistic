import React, { useState } from 'react';
import { Send, Mail, User, MessageSquare } from 'lucide-react';

export function ContactForm({ addToast }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please fill out all fields correctly.', 'error');
      return;
    }
    addToast('Thank you for contacting RouteSense! We will get back to you shortly.', 'success');
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
  };

  return (
    <section className="section" id="contact">
      <div className="section-header">
        <span className="section-subtitle">Get in Touch</span>
        <h2 className="section-title">Contact RouteSense Support</h2>
        <p className="section-desc">
          Have questions about API integrations, fleet telemetry setup, or custom enterprise solutions? Contact our team.
        </p>
      </div>

      <div className="glass-card" style={{ maxWidth: 620, margin: '0 auto', padding: 40 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label"><User size={16} /> Your Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label"><Mail size={16} /> Your Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Your Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label"><MessageSquare size={16} /> Your Message</label>
            <textarea
              rows="5"
              className={`form-control ${errors.message ? 'is-invalid' : ''}`}
              placeholder="Write your message here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
            {errors.message && <span className="error-text">{errors.message}</span>}
          </div>

          <button type="submit" className="btn" style={{ width: '100%', marginTop: 10 }}>
            <Send size={18} /> Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
