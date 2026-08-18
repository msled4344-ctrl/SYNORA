import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HeartPulse,
  Bot,
  Baby,
  Pill,
  Activity,
  Phone,
  Globe,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { path: '/', label: t('navHome'), icon: HeartPulse, keyName: 'home' },
    { path: '/ai-health', label: t('navAi'), icon: Bot, isHighlight: true, keyName: 'ai' },
    { path: '/baby-care', label: t('navBaby'), icon: Baby, keyName: 'baby' },
    { path: '/medicine', label: t('navMedicine'), icon: Pill, keyName: 'medicine' },
    { path: '/health-score', label: t('navScore'), icon: Activity, keyName: 'score' },
    { path: '/contact', label: t('navContact'), icon: Phone, keyName: 'contact' },
  ];

  return (
    <header className="header">
      <div className="container header-inner">
        {/* Brand Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">
            <HeartPulse size={22} strokeWidth={2.5} />
          </div>
          <span className="logo-text">
            <span className="logo-text-syn">SYN</span>
            <span className="logo-text-accent">ORA</span>
            <span className="logo-ai-badge">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            const customKeyClass = link.keyName ? `nav-link-${link.keyName}` : '';
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${customKeyClass} ${isActive ? 'active' : ''} ${link.isHighlight ? 'nav-link-ai-highlight' : ''}`}
              >
                <span className="nav-icon-container">
                  <Icon size={18} />
                </span>
                <span className="nav-label-text">{link.label}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              className={`nav-link nav-link-admin ${location.pathname === '/admin' ? 'active' : ''}`}
              style={{ color: 'var(--brand-blue)', fontWeight: '600' }}
            >
              <span className="nav-icon-container">
                <Shield size={18} />
              </span>
              <span className="nav-label-text">{t('navAdmin')}</span>
            </Link>
          )}
        </nav>

        {/* Header Right Actions - Strictly Language Switcher Only */}
        <div className="header-actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-language-toggle"
            onClick={toggleLanguage}
            title="Toggle English / বাংলা"
            style={{ padding: '0.4rem 0.65rem', fontSize: '0.88rem', fontWeight: '600' }}
          >
            <span className="nav-icon-container">
              <Globe size={16} />
            </span>
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
