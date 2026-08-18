import React, { useState } from 'react';
import { Pill, AlertCircle, Info, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MedicineCard = ({ medicine }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { language } = useLanguage();

  if (!medicine) return null;

  return (
    <>
      <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <span
              className="badge"
              style={{
                background: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                marginBottom: '0.4rem',
              }}
            >
              {medicine.category || 'General'}
            </span>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>{medicine.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {medicine.genericName}
            </p>
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary)',
            }}
          >
            <Pill size={20} />
          </div>
        </div>

        {/* Brand Names Chips */}
        {medicine.brandNames && medicine.brandNames.length > 0 && (
          <div style={{ marginBottom: '0.9rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Common Brand Names:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {medicine.brandNames.map((brand, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: '500',
                  }}
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Purpose / Uses */}
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1 }}>
          {medicine.purpose}
        </p>

        {/* Prescription Tag & View Details Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span
            style={{
              fontSize: '0.78rem',
              color: medicine.prescriptionRequired ? 'var(--status-warning)' : 'var(--status-success)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: '600',
            }}
          >
            {medicine.prescriptionRequired ? (
              <>
                <AlertCircle size={14} /> Prescription Needed
              </>
            ) : (
              <>
                <CheckCircle2 size={14} /> Over-the-Counter (OTC)
              </>
            )}
          </span>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setShowDetailModal(true)}
          >
            <Info size={14} />
            {language === 'bn' ? 'বিস্তারিত গাইড' : 'View Safety Guide'}
          </button>
        </div>
      </div>

      {/* Comprehensive Medicine Modal */}
      {showDetailModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(10, 17, 40, 0.7)',
            backdropFilter: 'blur(6px)',
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
              maxHeight: 'min(90dvh, 800px)',
              overflowY: 'auto',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              padding: 'clamp(1.25rem, 3vw, 2rem)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
                  {medicine.therapeuticClass}
                </span>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>{medicine.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Generic Formulation: <strong>{medicine.genericName}</strong>
                </p>
              </div>
              <button
                className="btn-ghost btn-icon"
                onClick={() => setShowDetailModal(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Safety Warning Header */}
            <div
              style={{
                background: 'var(--status-warning-bg)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--status-warning)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                marginBottom: '1.5rem',
              }}
            >
              <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Informational Reference Only:</strong> Do not adjust dosage or self-medicate without consulting a registered medical practitioner or pharmacist.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Indications */}
              <div>
                <h4 style={{ color: 'var(--brand-primary)', marginBottom: '0.35rem' }}>Indications & Uses</h4>
                <p style={{ fontSize: '0.92rem' }}>{medicine.indications || medicine.purpose}</p>
              </div>

              {/* Dosage Forms & Guidelines */}
              <div>
                <h4 style={{ color: 'var(--brand-primary)', marginBottom: '0.35rem' }}>Dosage & Administration Guidelines</h4>
                <p style={{ fontSize: '0.92rem', marginBottom: '0.4rem' }}>{medicine.dosageGuidelines}</p>
                {medicine.dosageForms && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {medicine.dosageForms.map((form, i) => (
                      <span key={i} className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        {form}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Precautions & Warnings */}
              <div>
                <h4 style={{ color: 'var(--status-warning)', marginBottom: '0.35rem' }}>Important Precautions</h4>
                <p style={{ fontSize: '0.92rem' }}>{medicine.precautions}</p>
              </div>

              {/* Side Effects */}
              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.35rem' }}>Common Side Effects</h4>
                <p style={{ fontSize: '0.92rem' }}>{medicine.sideEffects}</p>
              </div>

              {/* Overdose Warning */}
              {medicine.overdoseWarning && (
                <div style={{ background: 'var(--status-danger-bg)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <h4 style={{ color: 'var(--status-danger)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                    Overdose Critical Warning
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{medicine.overdoseWarning}</p>
                </div>
              )}

              {/* Storage & Doctor Advice */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <strong style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    Storage Instructions:
                  </strong>
                  <span style={{ fontSize: '0.88rem' }}>{medicine.storage}</span>
                </div>
                <div>
                  <strong style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                    When to Consult Doctor:
                  </strong>
                  <span style={{ fontSize: '0.88rem' }}>{medicine.whenToSeeDoctor}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Close Safety Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
