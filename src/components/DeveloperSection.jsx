import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/* Custom SVG Icons for WhatsApp, Gmail & Facebook */
const WhatsAppIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const GmailIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
  </svg>
);

const FacebookIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const DeveloperSection = () => {
  const { language } = useLanguage();

  const team = [
    {
      id: 'sp',
      initials: 'SP',
      name: 'Sumon Parvez',
      roleBn: 'তৈরি ও ডেভেলপমেন্ট',
      roleEn: 'Created & Developed',
      titleBn: 'স্বাস্থ্য এআই আর্কিটেকচার ও ফুল-স্ট্যাক প্ল্যাটফর্ম',
      titleEn: 'Healthcare AI Architecture & Full-Stack Platform',
      badgeClass: 'badge-creator',
      avatarClass: 'avatar-creator',
      isCreator: true,
      contacts: [
        {
          type: 'phone',
          icon: <Phone size={13} />,
          href: 'tel:01743444324',
          title: 'Call: 01743444324',
          btnClass: 'btn-phone',
        },
        {
          type: 'whatsapp',
          icon: <WhatsAppIcon size={14} />,
          href: 'https://wa.me/8801743444324',
          title: 'WhatsApp: 01743444324',
          btnClass: 'btn-whatsapp',
          target: '_blank',
        },
        {
          type: 'gmail',
          icon: <GmailIcon size={13} />,
          href: 'mailto:msled4344@gmail.com',
          title: 'Email: msled4344@gmail.com',
          btnClass: 'btn-gmail',
        },
        {
          type: 'facebook',
          icon: <FacebookIcon size={13} />,
          href: 'https://www.facebook.com/sumon.parvez.289496',
          title: 'Facebook: Sumon Parvez',
          btnClass: 'btn-facebook',
          target: '_blank',
        },
      ],
    },
    {
      id: 'ns',
      initials: 'NS',
      name: 'Nusrat Jahan Sumiya',
      roleBn: 'আইডিয়া ও কনসেপ্ট',
      roleEn: 'Concept & Idea',
      titleBn: 'স্বাস্থ্য প্রযুক্তি ভাবনা ও ক্লিনিক্যাল কনসেপ্ট',
      titleEn: 'Healthcare Concept & Clinical Vision',
      badgeClass: 'badge-idea',
      avatarClass: 'avatar-idea',
      contacts: [
        {
          type: 'phone',
          icon: <Phone size={13} />,
          href: 'tel:01343852079',
          title: 'Call: 01343-852079',
          btnClass: 'btn-phone',
        },
        {
          type: 'whatsapp',
          icon: <WhatsAppIcon size={14} />,
          href: 'https://wa.me/8801343852079',
          title: 'WhatsApp: 01343-852079',
          btnClass: 'btn-whatsapp',
          target: '_blank',
        },
      ],
    },
    {
      id: 'nh',
      initials: 'NH',
      name: 'Najmul Haque',
      roleBn: 'ইউআই/ইউএক্স ডিজাইন',
      roleEn: 'UI/UX Design',
      titleBn: 'ইউজার এক্সপেরিয়েন্স ও প্রোডাক্ট ইন্টারফেস',
      titleEn: 'User Experience & Product Interface',
      badgeClass: 'badge-design',
      avatarClass: 'avatar-design',
      contacts: [
        {
          type: 'phone',
          icon: <Phone size={13} />,
          href: 'tel:01735911132',
          title: 'Call: 01735-911132',
          btnClass: 'btn-phone',
        },
        {
          type: 'whatsapp',
          icon: <WhatsAppIcon size={14} />,
          href: 'https://wa.me/8801735911132',
          title: 'WhatsApp: 01735-911132',
          btnClass: 'btn-whatsapp',
          target: '_blank',
        },
      ],
    },
  ];

  return (
    <section className="dev-compact-section" aria-label="Platform Architecture & Team Credits">
      {/* Refined Minimal Header */}
      <div className="dev-compact-header">
        <div className="dev-compact-pill">
          <Sparkles size={12} className="dev-compact-sparkle" />
          <span>{language === 'bn' ? 'প্রকৌশল ও উদ্ভাবন দল' : 'INNOVATION & ARCHITECTURE CREDITS'}</span>
        </div>
        <h3 className="dev-compact-title">
          {language === 'bn' ? 'সিনোরা স্বাস্থ্য দলের কারিগরবৃন্দ' : 'Crafted by Healthcare AI Engineers & Designers'}
        </h3>
      </div>

      {/* Compact 3-Column Grid */}
      <div className="dev-compact-grid">
        {team.map((member) => (
          <div
            key={member.id}
            className={`dev-compact-card ${member.isCreator ? 'dev-card-creator' : ''}`}
          >
            {/* Logo / Avatar */}
            <div className="dev-compact-avatar-wrap">
              <div className={`dev-compact-avatar ${member.avatarClass}`}>
                <span>{member.initials}</span>
              </div>
              {member.isCreator && (
                <span className="dev-compact-status-dot" title="Active Developer & Systems Architect" />
              )}
            </div>

            {/* Content Body */}
            <div className="dev-compact-body">
              {/* Line 1: Name + Available Social / Contact Icons Beside It */}
              <div className="dev-compact-name-row">
                <div className="dev-compact-name-box">
                  <h4 className="dev-compact-name">{member.name}</h4>
                  {member.isCreator && (
                    <CheckCircle2
                      size={15}
                      className="dev-compact-verified"
                      title="Verified Lead Platform Creator"
                    />
                  )}
                </div>

                {/* Social & Contact Icon Buttons */}
                <div className="dev-compact-actions">
                  {member.contacts.map((contact, idx) => (
                    <a
                      key={idx}
                      href={contact.href}
                      target={contact.target || '_self'}
                      rel={contact.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className={`dev-icon-btn ${contact.btnClass}`}
                      title={contact.title}
                      aria-label={contact.title}
                    >
                      {contact.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Line 2: Role & Subtitle */}
              <div className="dev-compact-meta-row">
                <span className={`dev-compact-badge ${member.badgeClass}`}>
                  {language === 'bn' ? member.roleBn : member.roleEn}
                </span>
                <span className="dev-compact-meta-sep">•</span>
                <span className="dev-compact-subtitle">
                  {language === 'bn' ? member.titleBn : member.titleEn}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
