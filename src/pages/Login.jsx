import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SynoraLogo } from '../components/SynoraLogo';

export const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, resetPassword, loading, authError } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [resetSent, setResetSent] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setErrorMessage('Google authentication failed.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
      setTimeout(() => {
        setResetSent(false);
        setShowResetModal(false);
      }, 3000);
    } catch (err) {
      alert('Password reset failed. Please verify your email.');
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        <div className="card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)' }}>
          {/* Logo Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <SynoraLogo size={42} />
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>
              {language === 'bn' ? 'লগইন করুন' : 'Welcome Back'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Access your personalized health assistant & records
            </p>
          </div>

          {(errorMessage || authError) && (
            <div
              className="badge badge-danger"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMessage || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="patient@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-primary)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem', marginBottom: '1rem' }}
              disabled={loading}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Social / Google Login */}
          <div style={{ position: 'relative', textAlign: 'center', margin: '1.25rem 0' }}>
            <span
              style={{
                background: 'var(--bg-card)',
                padding: '0 0.75rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              or continue with
            </span>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '1px',
                background: 'var(--border-subtle)',
              }}
            ></div>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', gap: '0.6rem' }}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>
              Sign Up
            </Link>
          </div>

          {/* Quick Verified Accounts Helper */}
          <div
            style={{
              marginTop: '1.75rem',
              padding: '1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quick Test Authorized Logins:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'space-between', padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                onClick={() => {
                  setEmail('msled4344@gmail.com');
                  setPassword('Password123!');
                }}
              >
                <span>msled4344@gmail.com</span>
                <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>Admin</span>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'space-between', padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                onClick={() => {
                  setEmail('sumonkin523@gmail.com');
                  setPassword('Password123!');
                }}
              >
                <span>sumonkin523@gmail.com</span>
                <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>Admin</span>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'space-between', padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                onClick={() => {
                  setEmail('sumonraja4344@gmail.com');
                  setPassword('Password123!');
                }}
              >
                <span>sumonraja4344@gmail.com</span>
                <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>Admin</span>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'space-between', padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                onClick={() => {
                  setEmail('patient.care@example.com');
                  setPassword('Password123!');
                }}
              >
                <span>patient.care@example.com</span>
                <span className="badge" style={{ fontSize: '0.65rem', background: 'var(--bg-card)' }}>User</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(10, 17, 40, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Reset Password</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Enter your registered email address to receive password reset instructions.
            </p>

            {resetSent ? (
              <div className="badge badge-success" style={{ padding: '0.75rem', width: '100%', marginBottom: '1rem' }}>
                Reset instructions dispatched!
              </div>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowResetModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
