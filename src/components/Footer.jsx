import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  Code2,
  Phone,
  MessageSquare,
  Facebook,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Palette,
  Users,
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { siteSettings } = useHealthData();
  const { t, language } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
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

        {/* SYNORA Core Innovation & Development Team Section */}
        <div className="synora-team-showcase">
          {/* Main Creator & Developer Card */}
          <div className="creator-showcase-container">
            <div className="creator-profile-side">
              <div className="creator-avatar-wrap">
                <div className="creator-avatar-monogram">SP</div>
                <div className="creator-status-dot" title="Active Developer"></div>
              </div>
              
              <div className="creator-info-text">
                <div className="creator-role-tag">
                  <Sparkles size={12} className="creator-sparkle-icon" />
                  <span>{language === 'bn' ? 'ওয়েবসাইট নির্মাতা ও ডেভেলপার' : 'Created & Developed by'}</span>
                </div>
                <div className="creator-name-row">
                  <h3 className="creator-main-name">Sumon Parvez</h3>
                  <span className="creator-verified-badge" title="Verified Creator">
                    <CheckCircle2 size={16} />
                  </span>
                </div>
                <p className="creator-bio-line">
                  {language === 'bn'
                    ? 'SYNORA ডিজিটাল স্বাস্থ্য প্রযুক্তি ও এআই সিস্টেমের সার্বিক নির্মাতা'
                    : 'Healthcare AI Architecture & Full-Stack Platform Development'}
                </p>
              </div>
            </div>

            {/* Quick Interactive Contact Cards */}
            <div className="creator-contact-grid">
              {/* Phone */}
              <a
                href="tel:01743444324"
                className="creator-contact-card creator-card-phone"
                title="Call Sumon Parvez"
              >
                <div className="creator-icon-box phone-box">
                  <PhoneCall size={17} />
                </div>
                <div className="creator-card-meta">
                  <span className="creator-card-label">{language === 'bn' ? 'মোবাইল ফোন' : 'Direct Phone'}</span>
                  <span className="creator-card-val">01743444324</span>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:msled4344@gmail.com"
                className="creator-contact-card creator-card-email"
                title="Email Sumon Parvez"
              >
                <div className="creator-icon-box email-box">
                  <Mail size={17} />
                </div>
                <div className="creator-card-meta">
                  <span className="creator-card-label">{language === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Email Address'}</span>
                  <span className="creator-card-val">msled4344@gmail.com</span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/8801743444324"
                target="_blank"
                rel="noopener noreferrer"
                className="creator-contact-card creator-card-whatsapp"
                title="Chat on WhatsApp"
              >
                <div className="creator-icon-box whatsapp-box">
                  <MessageSquare size={17} />
                </div>
                <div className="creator-card-meta">
                  <span className="creator-card-label">WhatsApp</span>
                  <span className="creator-card-val">01743444324</span>
                </div>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/sumon.parvez.289496"
                target="_blank"
                rel="noopener noreferrer"
                className="creator-contact-card creator-card-facebook"
                title="View Facebook Profile"
              >
                <div className="creator-icon-box facebook-box">
                  <Facebook size={17} />
                </div>
                <div className="creator-card-meta">
                  <span className="creator-card-label">Facebook Profile</span>
                  <span className="creator-card-val creator-link-val">
                    <span>Connect</span>
                    <ExternalLink size={12} />
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Sub Team Grid: Idea & UI/UX Designer */}
          <div className="team-members-subgrid">
            {/* 1. Idea - Nusrat Jahan Sumiya */}
            <div className="team-member-card team-card-idea">
              <div className="team-card-top">
                <div className="team-avatar-wrap">
                  <div className="team-avatar-monogram monogram-idea">NS</div>
                </div>
                <div className="team-meta-info">
                  <div className="team-role-pill role-pill-idea">
                    <Lightbulb size={12} />
                    <span>{language === 'bn' ? 'আইডিয়া' : 'Idea'}</span>
                  </div>
                  <h4 className="team-member-name">Nusrat Jahan Sumiya</h4>
                  <p className="team-member-sub">
                    {language === 'bn' ? 'স্বাস্থ্য প্রযুক্তি ভাবনা ও কনসেপ্ট' : 'Healthcare Concept & Vision'}
                  </p>
                </div>
              </div>

              <div className="team-card-actions">
                <a
                  href="tel:01343852079"
                  className="team-contact-btn btn-call"
                  title="Call Nusrat Jahan Sumiya"
                >
                  <PhoneCall size={15} />
                  <span>01343-852079</span>
                </a>

                <a
                  href="https://wa.me/8801343852079"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-contact-btn btn-whatsapp"
                  title="WhatsApp Nusrat Jahan Sumiya"
                >
                  <MessageSquare size={15} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* 2. UI/UX Designer - Najmul Haque */}
            <div className="team-member-card team-card-design">
              <div className="team-card-top">
                <div className="team-avatar-wrap">
                  <div className="team-avatar-monogram monogram-design">NH</div>
                </div>
                <div className="team-meta-info">
                  <div className="team-role-pill role-pill-design">
                    <Palette size={12} />
                    <span>{language === 'bn' ? 'ইউআই/ইউএক্স ডিজাইনার' : 'UI/UX Designer'}</span>
                  </div>
                  <h4 className="team-member-name">Najmul Haque</h4>
                  <p className="team-member-sub">
                    {language === 'bn' ? 'ইন্টারফেস ও ইউজার এক্সপেরিয়েন্স ডিজাইন' : 'User Experience & Product Interface'}
                  </p>
                </div>
              </div>

              <div className="team-card-actions">
                <a
                  href="tel:01735911132"
                  className="team-contact-btn btn-call"
                  title="Call Najmul Haque"
                >
                  <PhoneCall size={15} />
                  <span>01735-911132</span>
                </a>

                <a
                  href="https://wa.me/8801735911132"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-contact-btn btn-whatsapp"
                  title="WhatsApp Najmul Haque"
                >
                  <MessageSquare size={15} />
                  <span>WhatsApp</span>
                </a>
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
