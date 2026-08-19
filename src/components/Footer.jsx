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

// Modern SVG WhatsApp icon component
const WhatsAppIcon = ({ size = 14, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export const Footer = () => {
  const { siteSettings } = useHealthData();
  const { t, language } = useLanguage();

  const teamMembers = [
    {
      id: 'sumon',
      name: 'Sumon Parvez',
      role: language === 'bn' ? 'ওয়েবসাইট নির্মাতা ও ডেভেলপার' : 'Created & Developed by',
      subtitle: language === 'bn' ? 'এআই সিস্টেম ও পূর্ণাঙ্গ প্ল্যাটফর্ম' : 'AI Healthcare & Full-Stack Platform',
      avatar: 'SP',
      avatarClass: 'team-avatar-lead',
      roleClass: 'role-pill-lead',
      verified: true,
      contacts: [
        {
          type: 'phone',
          icon: PhoneCall,
          href: 'tel:01743444324',
          title: language === 'bn' ? 'ফোন: 01743444324' : 'Direct Phone: 01743444324',
          ariaLabel: 'Call Sumon Parvez at 01743444324',
          accent: 'phone',
        },
        {
          type: 'whatsapp',
          icon: WhatsAppIcon,
          href: 'https://wa.me/8801743444324',
          title: language === 'bn' ? 'হোয়াটসঅ্যাপ: 01743444324' : 'WhatsApp: 01743444324',
          ariaLabel: 'Chat with Sumon Parvez on WhatsApp',
          accent: 'whatsapp',
        },
        {
          type: 'email',
          icon: Mail,
          href: 'mailto:msled4344@gmail.com',
          title: language === 'bn' ? 'ইমেইল: msled4344@gmail.com' : 'Email: msled4344@gmail.com',
          ariaLabel: 'Email Sumon Parvez at msled4344@gmail.com',
          accent: 'email',
        },
        {
          type: 'facebook',
          icon: Facebook,
          href: 'https://www.facebook.com/sumon.parvez.289496',
          title: language === 'bn' ? 'ফেসবুক প্রোফাইল' : 'Facebook Profile',
          ariaLabel: 'Visit Sumon Parvez Facebook Profile',
          accent: 'facebook',
        },
      ],
    },
    {
      id: 'nusrat',
      name: 'Nusrat Jahan Sumiya',
      role: language === 'bn' ? 'আইডিয়া' : 'Idea',
      subtitle: language === 'bn' ? 'স্বাস্থ্য প্রযুক্তি কনসেপ্ট' : 'Healthcare Concept & Vision',
      avatar: 'NS',
      avatarClass: 'team-avatar-idea',
      roleClass: 'role-pill-idea-subtle',
      contacts: [
        {
          type: 'phone',
          icon: PhoneCall,
          href: 'tel:01343852079',
          title: language === 'bn' ? 'ফোন: 01343-852079' : 'Phone: 01343-852079',
          ariaLabel: 'Call Nusrat Jahan Sumiya at 01343852079',
          accent: 'phone',
        },
        {
          type: 'whatsapp',
          icon: WhatsAppIcon,
          href: 'https://wa.me/8801343852079',
          title: language === 'bn' ? 'হোয়াটসঅ্যাপ: 01343-852079' : 'WhatsApp: 01343-852079',
          ariaLabel: 'Chat with Nusrat Jahan Sumiya on WhatsApp',
          accent: 'whatsapp',
        },
      ],
    },
    {
      id: 'najmul',
      name: 'Najmul Haque',
      role: language === 'bn' ? 'ইউআই/ইউএক্স ডিজাইনার' : 'UI/UX Designer',
      subtitle: language === 'bn' ? 'ইন্টারফেস ডিজাইন' : 'User Experience & Interface',
      avatar: 'NH',
      avatarClass: 'team-avatar-design',
      roleClass: 'role-pill-design-subtle',
      contacts: [
        {
          type: 'phone',
          icon: PhoneCall,
          href: 'tel:01735911132',
          title: language === 'bn' ? 'ফোন: 01735-911132' : 'Phone: 01735-911132',
          ariaLabel: 'Call Najmul Haque at 01735911132',
          accent: 'phone',
        },
        {
          type: 'whatsapp',
          icon: WhatsAppIcon,
          href: 'https://wa.me/8801735911132',
          title: language === 'bn' ? 'হোয়াটসঅ্যাপ: 01735-911132' : 'WhatsApp: 01735-911132',
          ariaLabel: 'Chat with Najmul Haque on WhatsApp',
          accent: 'whatsapp',
        },
      ],
    },
  ];

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

        {/* Compact, Modern Profile & Team Bar */}
        <div className="team-profile-strip" aria-label="SYNORA Contributors & Team">
          {teamMembers.map((member) => (
            <div key={member.id} className={`team-profile-item ${member.id === 'sumon' ? 'team-profile-lead' : ''}`}>
              <div className={`team-profile-avatar ${member.avatarClass || ''}`} aria-hidden="true">
                {member.avatar}
              </div>

              <div className="team-profile-info">
                <div className="team-profile-name-row">
                  <span className="team-profile-name">{member.name}</span>
                  {member.verified && (
                    <CheckCircle2 size={13} className="team-profile-verified" title="Verified Creator" />
                  )}
                  <span className={`team-profile-role ${member.roleClass || ''}`}>{member.role}</span>
                </div>
                {member.subtitle && (
                  <span className="team-profile-sub">{member.subtitle}</span>
                )}
              </div>

              <div className="team-profile-actions">
                {member.contacts.map((c, i) => {
                  const IconComp = c.icon;
                  const isExternal = c.href.startsWith('http');
                  return (
                    <a
                      key={i}
                      href={c.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className={`team-icon-btn team-icon-${c.accent}`}
                      title={c.title}
                      aria-label={c.ariaLabel}
                    >
                      <IconComp size={14} />
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
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
