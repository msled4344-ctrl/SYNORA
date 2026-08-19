import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';
import { DeveloperSection } from './DeveloperSection';

export const Footer = () => {
  const { siteSettings } = useHealthData();
  const { t, language } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        {/* Developer & Engineering Showcase Section (Top) */}
        <DeveloperSection />

        <div className="footer-top-divider" />

        {/* Footer Navigation & Info Grid */}
        <div className="footer-grid">
          {/* Brand Col */}
          <div>
            <Link to="/" className="logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <div className="logo-icon">
                <HeartPulse size={22} strokeWidth={2.5} />
              </div>
              <span className="logo-text">
                <span className="logo-text-syn">SYN</span>
                <span className="logo-text-accent">ORA</span>
                <span className="logo-ai-badge">AI</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '1.25rem', maxWidth: '340px' }}>
              {language === 'bn'
                ? 'সাধারণ মানুষের জন্য সহজ, নিরাপদ ও নির্ভরযোগ্য ডিজিটাল স্বাস্থ্য প্ল্যাটফর্ম ও এআই হেলথ অ্যাসিস্ট্যান্ট।'
                : 'A simple, trustworthy, accessible digital healthcare companion designed for ordinary people and everyday wellness.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--brand-primary)' }}>
              <ShieldCheck size={18} />
              <span>{language === 'bn' ? 'তথ্য ও গোপনীয়তা সুরক্ষিত' : 'Strict Data Privacy & Security'}</span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {language === 'bn' ? 'স্বাস্থ্য সেবা টুলস' : 'Healthcare Tools'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/ai-health" style={{ color: 'var(--text-secondary)' }}>
                  {t('navAi')} (Voice Enabled)
                </Link>
              </li>
              <li>
                <Link to="/baby-care" style={{ color: 'var(--text-secondary)' }}>
                  {t('navBaby')} (1m - 10y)
                </Link>
              </li>
              <li>
                <Link to="/medicine" style={{ color: 'var(--text-secondary)' }}>
                  {t('navMedicine')}
                </Link>
              </li>
              <li>
                <Link to="/health-score" style={{ color: 'var(--text-secondary)' }}>
                  {t('navScore')} Calculator
                </Link>
              </li>
              <li>
                <Link to="/profile" style={{ color: 'var(--text-secondary)' }}>
                  My Health Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {language === 'bn' ? 'আইনি ও নীতিমালা' : 'Trust & Legal'}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/privacy" style={{ color: 'var(--text-secondary)' }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" style={{ color: 'var(--text-secondary)' }}>
                  Terms of Use & Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--text-secondary)' }}>
                  {t('navContact')} SYNORA
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: 'var(--text-muted)' }}>
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Hotline Info */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {language === 'bn' ? 'জরুরি হেল্পলাইন' : 'Emergency Hotlines'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneCall size={16} color="var(--status-danger)" />
                <span>
                  Emergency: <strong>{siteSettings?.hotlines?.nationalEmergency || '999'} / 911</strong>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneCall size={16} color="var(--brand-primary)" />
                <span>
                  Health Hotline: <strong>{siteSettings?.hotlines?.healthCallCenter || '16263'}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--brand-blue)" />
                <span>{siteSettings?.contact?.email || 'care@synora.health'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{siteSettings?.contact?.address || 'Dhaka / Global Center'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer & Copyright */}
        <div className="footer-bottom">
          <div style={{ maxWidth: '750px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            <strong>Medical Disclaimer:</strong> {t('disclaimer')}
          </div>
          <div style={{ fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} SYNORA Healthcare Technologies.
          </div>
        </div>
      </div>
    </footer>
  );
};

