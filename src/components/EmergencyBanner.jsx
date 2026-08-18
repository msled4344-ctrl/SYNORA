import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, X, ShieldAlert } from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';

export const EmergencyBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { siteSettings } = useHealthData();
  const { language } = useLanguage();

  if (isDismissed) return null;

  return (
    <>
      <aside className="emergency-banner" aria-label="Emergency warning banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <AlertTriangle size={18} aria-hidden="true" />
          <span>
            {language === 'bn'
              ? 'জরুরি মেডিকেল সহায়তা প্রয়োজন? অবহেলা করবেন না।'
              : 'Medical Emergency? Do not delay.'}{' '}
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                textDecoration: 'underline',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: 'inherit',
              }}
            >
              {language === 'bn' ? 'জরুরি হেল্পলাইন নম্বর দেখুন' : 'View Emergency Helplines (999 / 911)'}
            </button>
          </span>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          style={{
            background: 'rgba(0,0,0,0.15)',
            border: 'none',
            color: '#ffffff',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
          aria-label="Dismiss banner"
        >
          <X size={14} />
        </button>
      </aside>

      {/* Emergency Helpline Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="emergency-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(10, 17, 40, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '520px',
              width: '100%',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '2px solid var(--status-danger)',
              boxShadow: 'var(--shadow-xl)',
              padding: '2rem',
              animation: 'modalSlide 0.25s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--status-danger-bg)',
                    color: 'var(--status-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 id="emergency-modal-title" style={{ fontSize: '1.25rem' }}>
                    {language === 'bn' ? 'জরুরি মেডিকেল সেবা' : 'Emergency Medical Helplines'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {language === 'bn' ? 'তাৎক্ষণিক হাসপাতালে যোগাযোগ করুন' : 'Immediate assistance for acute health crises'}
                  </p>
                </div>
              </div>
              <button
                className="btn-ghost btn-icon"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
              <a
                href={`tel:${siteSettings?.hotlines?.nationalEmergency || '999'}`}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  background: 'var(--status-danger-bg)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <PhoneCall size={22} color="var(--status-danger)" />
                  <div>
                    <strong style={{ color: 'var(--status-danger)', fontSize: '1.1rem' }}>
                      {siteSettings?.hotlines?.nationalEmergency || '999'}
                    </strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {language === 'bn' ? 'জাতীয় জরুরি সেবা (বাংলাদেশ)' : 'National Emergency Call Center (BD)'}
                    </div>
                  </div>
                </div>
                <span className="btn btn-danger btn-sm">
                  {language === 'bn' ? 'কল করুন' : 'Call Now'}
                </span>
              </a>

              <a
                href="tel:16263"
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <PhoneCall size={22} color="var(--brand-primary)" />
                  <div>
                    <strong style={{ color: 'var(--brand-primary)', fontSize: '1.1rem' }}>16263</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {language === 'bn' ? 'স্বাস্থ্য বাতায়ন (২৪ ঘণ্টা ডাক্তার পরামর্শ)' : 'National Health Call Center (24/7 Doctor)'}
                    </div>
                  </div>
                </div>
                <span className="btn btn-primary btn-sm">
                  {language === 'bn' ? 'কল করুন' : 'Call 16263'}
                </span>
              </a>

              <a
                href="tel:911"
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <PhoneCall size={22} color="var(--brand-blue)" />
                  <div>
                    <strong style={{ color: 'var(--brand-blue)', fontSize: '1.1rem' }}>911 / 112</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      International Emergency Dispatch
                    </div>
                  </div>
                </div>
                <span className="btn btn-secondary btn-sm">
                  Call 911
                </span>
              </a>
            </div>

            <div
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                background: 'var(--bg-tertiary)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              ⚠️ <strong>Warning Signs Requiring Urgent Hospitalization:</strong> Chest tightness radiating to the arm/jaw, acute difficulty breathing, loss of consciousness, uncontrollable bleeding, or severe allergic swelling.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
