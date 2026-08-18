import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, User, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            border: '4px solid var(--border-subtle)',
            borderTopColor: 'var(--brand-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem',
          }}
        />
        <p style={{ color: 'var(--text-muted)' }}>
          {language === 'bn' ? 'অনুমতি যাচাই করা হচ্ছে...' : 'Verifying administrative credentials...'}
        </p>
      </div>
    );
  }

  // If not authenticated or not in the admin whitelist, render Access Denied
  if (!currentUser || !isAdmin) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '680px', margin: '0 auto' }}>
        <div
          className="card card-glass"
          style={{
            padding: '3rem 2.25rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-2xl)',
            border: '1.5px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 20px 45px -10px rgba(239, 68, 68, 0.15)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(239, 68, 68, 0.12)',
              color: 'var(--status-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <ShieldAlert size={38} />
          </div>

          <div
            className="badge"
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              color: 'var(--status-danger)',
              marginBottom: '1rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              letterSpacing: '0.05em',
            }}
          >
            HTTP 403 • ACCESS RESTRICTED
          </div>

          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
            {language === 'bn' ? 'অ্যাডমিন প্যানেলে এক্সেস সীমাবদ্ধ' : 'Admin Panel Access Denied'}
          </h2>

          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '1.75rem' }}>
            {language === 'bn'
              ? 'এই অ্যাডমিন ড্যাশবোর্ডটি শুধুমাত্র অনুমোদিত সিনোরা মেডিকেল অ্যাডমিনের জন্য সংরক্ষিত। আপনার বর্তমান একাউন্টটিতে অ্যাডমিন পারমিশন নেই।'
              : 'This administrative management system is strictly restricted to authorized SYNORA medical personnel. Your current account does not have administrative clearance.'}
          </p>

          {currentUser && (
            <div
              style={{
                background: 'var(--bg-tertiary)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
              }}
            >
              <Lock size={15} color="var(--text-muted)" />
              <span>
                Authenticated as: <strong style={{ color: 'var(--text-primary)' }}>{currentUser.email}</strong> (Role: <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>User</span>)
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={16} />
              <span>{language === 'bn' ? 'হোমপেজে ফিরুন' : 'Return to Home'}</span>
            </Link>

            <Link to="/profile" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} />
              <span>{language === 'bn' ? 'আমার প্রোফাইল' : 'View Profile'}</span>
            </Link>

            {!currentUser && (
              <Link to="/login" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogIn size={16} />
                <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return children;
};
