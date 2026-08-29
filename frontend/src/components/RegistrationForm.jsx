import React, { useState } from 'react';
import { API_BASE } from '../lib/api';
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, ShieldCheck, XCircle, LogIn, LogOut } from 'lucide-react';

export function RegistrationForm({ addToast, user, setUser, logoutUser }) {
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPasswordCriteria = (pass) => ({
    minChar: pass.length >= 8,
    hasUpper: /[A-Z]/.test(pass),
    hasLower: /[a-z]/.test(pass),
    hasNumber: /\d/.test(pass),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\\/]/.test(pass),
  });

  const passwordCriteria = getPasswordCriteria(formData.password);

  const calculatePasswordStrength = (pass) => {
    const criteria = getPasswordCriteria(pass);
    const score = Object.values(criteria).filter(Boolean).length;

    const levels = [
      { width: '0%', color: 'transparent', label: '' },
      { width: '25%', color: 'var(--danger)', label: 'Weak (Missing rules)' },
      { width: '50%', color: 'var(--warning)', label: 'Fair' },
      { width: '75%', color: 'var(--info)', label: 'Good' },
      { width: '100%', color: 'var(--success)', label: 'Strong & Secure' }
    ];

    return levels[pass ? Math.min(4, score) : 0];
  };

  const strength = calculatePasswordStrength(formData.password);

  const validate = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Please enter your full name.';
    } else if (!/^[A-Za-z\s'-]{2,50}$/.test(formData.fullname.trim())) {
      newErrors.fullname = 'Name must be 2-50 letters only.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const rawPhone = formData.phone.trim();
    const cleanPhone = rawPhone.replace(/[\s-()]/g, '');
    
    if (!rawPhone) {
      newErrors.phone = 'Please enter your 10-digit mobile number.';
    } else if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'Must be a valid 10-digit Indian mobile number starting with 6-9.';
    }

    const pass = formData.password;
    const criteria = getPasswordCriteria(pass);

    if (!pass) {
      newErrors.password = 'Please create a strong password.';
    } else if (!criteria.minChar) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!criteria.hasUpper) {
      newErrors.password = 'Password must contain at least 1 uppercase letter.';
    } else if (!criteria.hasLower) {
      newErrors.password = 'Password must contain at least 1 lowercase letter.';
    } else if (!criteria.hasNumber) {
      newErrors.password = 'Password must contain at least 1 number.';
    } else if (!criteria.hasSpecial) {
      newErrors.password = 'Password must contain at least 1 special character.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please fix the highlighted errors before submitting.', 'error');
      return;
    }

    setLoading(true);
    const username = formData.fullname.trim();

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: username,
          password: formData.password
        })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        addToast(`Account created successfully for ${username}! You can now log in.`, 'success');
        setLoginData({ username: username, password: '' });
        setAuthMode('login');
        setFormData({ fullname: '', email: '', phone: '', password: '', confirmPassword: '' });
        setErrors({});
      } else {
        addToast(data.error || 'Registration failed', 'error');
      }
    } catch (err) {
      setLoading(false);
      console.error('Flask registration failed:', err);
      addToast('Registration failed. Please check the backend connection.', 'error');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.username.trim() || !loginData.password.trim()) {
      addToast('Please enter both username and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: loginData.username.trim(),
          password: loginData.password.trim()
        })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        addToast(data.message || `Welcome back, ${data.username}!`, 'success');
        if (setUser) {
          setUser({ username: data.username, user_id: data.user_id });
        }
      } else {
        addToast(data.error || 'Invalid username or password', 'error');
      }
    } catch (err) {
      setLoading(false);
      console.error('Flask login failed:', err);
      addToast('Login failed. Please check the backend connection.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="section" id="register">
      <div className="section-header">
        <span className="section-subtitle">Authentication Portal</span>
        <h2 className="section-title">
          {user ? 'Account Dashboard' : authMode === 'register' ? 'Create Your Account' : 'User Login'}
        </h2>
        <p className="section-desc">
          Sign up or log in to access Flask backend authentication, shipment delay predictions, and session security.
        </p>
      </div>

      <div className="glass-card" style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
        {user ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <User size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Logged in as {user.username}</h3>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', marginBottom: 24 }}>
              Active Flask Session authenticated on port 5000.
            </p>
            <button className="btn btn-outline" onClick={logoutUser} style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
              <LogOut size={18} /> Logout Session
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: 28 }}>
              <button
                className={`btn ${authMode === 'register' ? 'btn-secondary' : 'btn-outline'}`}
                style={{ flex: 1, borderRadius: 'var(--radius-sm) 0 0 0', borderBottom: 'none' }}
                onClick={() => setAuthMode('register')}
              >
                <ShieldCheck size={16} /> Register
              </button>
              <button
                className={`btn ${authMode === 'login' ? 'btn-secondary' : 'btn-outline'}`}
                style={{ flex: 1, borderRadius: '0 var(--radius-sm) 0 0', borderBottom: 'none' }}
                onClick={() => setAuthMode('login')}
              >
                <LogIn size={16} /> Login
              </button>
            </div>

            {authMode === 'register' ? (
              <form onSubmit={handleRegisterSubmit}>
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label"><User size={16} /> Full Name / Username</label>
                  <input
                    type="text"
                    name="fullname"
                    className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
                    placeholder="e.g. John Doe"
                    value={formData.fullname}
                    onChange={handleChange}
                  />
                  {errors.fullname && <span className="error-text">{errors.fullname}</span>}
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label className="form-label"><Mail size={16} /> Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                {/* Mobile Number */}
                <div className="form-group">
                  <label className="form-label"><Phone size={16} /> Mobile Number (India +91)</label>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="e.g. 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                {/* Password Input */}
                <div className="form-group">
                  <label className="form-label"><Lock size={16} /> Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{ paddingRight: 48 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {formData.password && (
                    <div style={{ marginTop: 8 }}>
                      <div className="strength-bar-track">
                        <div className="strength-bar-fill" style={{ width: strength.width, background: strength.color }}></div>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: strength.color, fontWeight: 600, marginTop: 4, display: 'block' }}>
                        {strength.label}
                      </span>
                    </div>
                  )}

                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label className="form-label"><Lock size={16} /> Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={{ paddingRight: 48 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)' }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>

                <button type="submit" className="btn" style={{ width: '100%', marginTop: 12 }} disabled={loading}>
                  <ShieldCheck size={18} /> {loading ? 'Registering...' : 'Create Account (Flask REST API)'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label className="form-label"><User size={16} /> Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Enter registered username"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label"><Lock size={16} /> Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                </div>

                <button type="submit" className="btn" style={{ width: '100%', marginTop: 16 }} disabled={loading}>
                  <LogIn size={18} /> {loading ? 'Authenticating...' : 'Log In (POST /login)'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </section>
  );
}
