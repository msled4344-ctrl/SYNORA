import React, { useState, useEffect } from 'react';
import {
  Pill,
  AlertCircle,
  Info,
  ShieldAlert,
  CheckCircle2,
  X,
  Baby,
  HeartPulse,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MedicineCard = ({ medicine }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { language } = useLanguage();

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowDetailModal(false);
      }
    };
    if (showDetailModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showDetailModal]);

  if (!medicine) return null;

  const isAntibiotic =
    medicine.isAntibiotic ||
    medicine.category?.toLowerCase() === 'antibiotics' ||
    medicine.therapeuticClass?.toLowerCase().includes('antibiotic');

  const prescriptionRequired = medicine.prescriptionRequired || isAntibiotic;

  return (
    <>
      <div
        className="card card-hover"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: isAntibiotic ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--border-subtle)',
          background: isAntibiotic ? 'linear-gradient(180deg, rgba(239, 68, 68, 0.03) 0%, var(--bg-card) 100%)' : 'var(--bg-card)',
        }}
      >
        {/* Top Badges & Icon */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
            <span
              className="badge"
              style={{
                background: isAntibiotic ? 'rgba(239, 68, 68, 0.12)' : 'var(--brand-primary-light)',
                color: isAntibiotic ? '#ef4444' : 'var(--brand-primary)',
                fontWeight: '600',
                fontSize: '0.75rem',
              }}
            >
              {medicine.category || 'General'}
            </span>

            {isAntibiotic && (
              <span
                className="badge"
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#d97706',
                  fontWeight: '600',
                  fontSize: '0.72rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <ShieldAlert size={12} />
                {language === 'bn' ? 'অ্যান্টিবায়োটিক' : 'Antibiotic'}
              </span>
            )}
          </div>

          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: isAntibiotic ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isAntibiotic ? '#ef4444' : 'var(--brand-primary)',
              flexShrink: 0,
            }}
          >
            <Pill size={19} />
          </div>
        </div>

        {/* Medicine Name & Generic Name */}
        <div style={{ marginBottom: '0.65rem' }}>
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              lineHeight: '1.3',
              marginBottom: '0.2rem',
              color: 'var(--text-primary)',
            }}
          >
            {medicine.name}
          </h3>
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              lineHeight: '1.35',
            }}
          >
            {medicine.genericName}
          </p>
        </div>

        {/* Brand Names Chips */}
        {medicine.brandNames && medicine.brandNames.length > 0 && (
          <div style={{ marginBottom: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '0.3rem',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {language === 'bn' ? 'জনপ্রিয় ব্র্যান্ড সমূহ:' : 'Common Brand Names:'}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {medicine.brandNames.slice(0, 5).map((brand, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.12rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {brand}
                </span>
              ))}
              {medicine.brandNames.length > 5 && (
                <span
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.12rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: '600',
                    color: 'var(--brand-primary)',
                  }}
                >
                  +{medicine.brandNames.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Common Uses */}
        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            flex: 1,
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {medicine.commonUses || medicine.purpose}
        </p>

        {/* Bottom Bar: Status Tag & Safety Guide Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            gap: '0.5rem',
            marginTop: 'auto',
          }}
        >
          <span
            style={{
              fontSize: '0.76rem',
              color: prescriptionRequired ? '#ef4444' : 'var(--status-success)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: '600',
              whiteSpace: 'nowrap',
            }}
          >
            {prescriptionRequired ? (
              <>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{language === 'bn' ? 'প্রেসক্রিপশন আবশ্যক' : 'Prescription'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                <span>{language === 'bn' ? 'ওটিসি (OTC)' : 'OTC Available'}</span>
              </>
            )}
          </span>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setShowDetailModal(true)}
            style={{
              fontSize: '0.8rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <Info size={14} />
            <span>{language === 'bn' ? 'নিরাপত্তা গাইড' : 'View Safety Guide'}</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Medicine Safety Guide Modal */}
      {showDetailModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`med-title-${medicine.id}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDetailModal(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            background: 'rgba(10, 17, 40, 0.78)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '680px',
              width: '100%',
              maxHeight: 'min(90dvh, 820px)',
              overflowY: 'auto',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              padding: 'clamp(1.25rem, 3.5vw, 2rem)',
              border: isAntibiotic ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--border-subtle)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span
                    className="badge"
                    style={{
                      background: 'var(--brand-primary-light)',
                      color: 'var(--brand-primary)',
                      fontWeight: '600',
                    }}
                  >
                    {medicine.category}
                  </span>
                  {medicine.therapeuticClass && (
                    <span
                      className="badge"
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {medicine.therapeuticClass}
                    </span>
                  )}
                  <span
                    className="badge"
                    style={{
                      background: prescriptionRequired ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                      color: prescriptionRequired ? '#ef4444' : 'var(--status-success)',
                      fontWeight: '600',
                    }}
                  >
                    {prescriptionRequired ? (language === 'bn' ? 'প্রেসক্রিপশন প্রয়োজন' : 'Prescription Required') : (language === 'bn' ? 'ওটিসি (OTC)' : 'Over-the-Counter')}
                  </span>
                </div>

                <h2 id={`med-title-${medicine.id}`} style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.2rem' }}>
                  {medicine.name}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  <strong>{language === 'bn' ? 'জেনেরিক নাম:' : 'Generic Name:'}</strong> {medicine.genericName}
                </p>
              </div>

              <button
                type="button"
                className="btn-ghost btn-icon"
                onClick={() => setShowDetailModal(false)}
                aria-label="Close safety guide"
                style={{ flexShrink: 0, marginTop: '-0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Antibiotics Strict Warning Banner */}
            {isAntibiotic && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: '#f87171',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  marginBottom: '1.25rem',
                  lineHeight: '1.5',
                }}
              >
                <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#ef4444' }} />
                <div>
                  <strong style={{ color: '#ef4444', display: 'block', marginBottom: '0.2rem' }}>
                    {language === 'bn' ? 'অ্যান্টিবায়োটিক সতর্কবার্তা:' : 'Antibiotic Safety Notice:'}
                  </strong>
                  {language === 'bn'
                    ? 'রেজিস্টার্ড চিকিৎসকের প্রেসক্রিপশন ছাড়া অ্যান্টিবায়োটিক সেবন করবেন না। অ্যান্টিবায়োটিক রেজিস্ট্যান্স প্রতিরোধে সম্পূর্ণ কোর্স সম্পন্ন করুন।'
                    : 'Do not use antibiotics without a prescription from a registered physician. Complete the full prescribed course to prevent antimicrobial resistance.'}
                </div>
              </div>
            )}

            {/* Informational Reference Banner */}
            <div
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                padding: '0.75rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.55rem',
                marginBottom: '1.25rem',
                lineHeight: '1.45',
              }}
            >
              <Stethoscope size={16} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>{language === 'bn' ? 'চিকিৎসা নির্দেশিকা:' : 'Informational Healthcare Reference:'}</strong>{' '}
                {language === 'bn'
                  ? 'ডোজ বয়স, শারীরিক অবস্থা, ফর্মুলেশন এবং অন্যান্য ওষুধের ওপর নির্ভর করে। সর্বদা অনুমোদিত পণ্যের নির্দেশিকা বা চিকিৎসকের পরামর্শ মেনে চলুন।'
                  : 'Dosage depends on age, medical condition, formulation, and other medicines. Follow the approved product label or a registered physician/pharmacist\'s instructions. Never self-medicate.'}
              </div>
            </div>

            {/* Modal Body Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* 1. Common Brand Names */}
              {medicine.brandNames && medicine.brandNames.length > 0 && (
                <div>
                  <h4 style={{ color: 'var(--brand-primary)', fontSize: '0.92rem', marginBottom: '0.4rem', fontWeight: '600' }}>
                    {language === 'bn' ? 'উপলব্ধ ব্র্যান্ড সমূহ' : 'Available Brand Names'}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {medicine.brandNames.map((brand, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-subtle)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Common Uses */}
              <div>
                <h4 style={{ color: 'var(--brand-primary)', fontSize: '0.92rem', marginBottom: '0.35rem', fontWeight: '600' }}>
                  {language === 'bn' ? 'সাধারণ ব্যবহার ও নির্দেশিকা' : 'Common Uses & Indications'}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                  {medicine.commonUses || medicine.purpose || medicine.indications}
                </p>
              </div>

              {/* 3. General Safety Guide */}
              {medicine.safetyGuide && (
                <div>
                  <h4 style={{ color: 'var(--brand-primary)', fontSize: '0.92rem', marginBottom: '0.35rem', fontWeight: '600' }}>
                    {language === 'bn' ? 'সাধারণ নিরাপত্তা নির্দেশিকা' : 'General Safety Guide'}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {medicine.safetyGuide}
                  </p>
                </div>
              )}

              {/* 4. Pregnancy & Breastfeeding Warning */}
              {medicine.pregnancyBreastfeedingWarning && (
                <div
                  style={{
                    background: 'rgba(168, 85, 247, 0.08)',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <h4
                    style={{
                      color: '#c084fc',
                      fontSize: '0.88rem',
                      marginBottom: '0.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <HeartPulse size={16} />
                    {language === 'bn' ? 'গর্ভাবস্থা ও স্তন্যদানকালীন সতর্কতা' : 'Pregnancy & Breastfeeding Warning'}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.55' }}>
                    {medicine.pregnancyBreastfeedingWarning}
                  </p>
                </div>
              )}

              {/* 5. Children Warning */}
              {medicine.childrenWarning && (
                <div
                  style={{
                    background: 'rgba(14, 165, 233, 0.08)',
                    border: '1px solid rgba(14, 165, 233, 0.25)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <h4
                    style={{
                      color: '#38bdf8',
                      fontSize: '0.88rem',
                      marginBottom: '0.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Baby size={16} />
                    {language === 'bn' ? 'শিশু ও অপ্রাপ্তবয়স্কদের সতর্কতা' : 'Children & Pediatric Warning'}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.55' }}>
                    {medicine.childrenWarning}
                  </p>
                </div>
              )}

              {/* 6. Emergency / Overdose Warning */}
              {medicine.emergencyWarning && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <h4
                    style={{
                      color: '#f87171',
                      fontSize: '0.88rem',
                      marginBottom: '0.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <AlertTriangle size={16} />
                    {language === 'bn' ? 'জরুরি অবস্থা ও অতিরিক্ত মাত্রা সতর্কতা' : 'Emergency & Overdose Warning'}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.55' }}>
                    {medicine.emergencyWarning}
                  </p>
                </div>
              )}

              {/* 7. Storage Instructions */}
              {medicine.storage && (
                <div
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <strong
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      display: 'block',
                      marginBottom: '0.2rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {language === 'bn' ? 'সংরক্ষণ নির্দেশাবলী:' : 'Storage Instructions:'}
                  </strong>
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {medicine.storage}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDetailModal(false)}
                style={{ minWidth: '110px' }}
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close Guide'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
