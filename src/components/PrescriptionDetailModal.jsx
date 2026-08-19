import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Pill,
  FileText,
  Trash2,
  Printer,
  AlertTriangle,
  Eye,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PrescriptionDetailModal = ({ prescription, isOpen, onClose, onDelete }) => {
  const { language } = useLanguage();
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(6, 11, 25, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.75rem, 2.5vw, 1.5rem)',
        overflowY: 'auto',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '840px',
          width: '100%',
          maxHeight: 'min(92dvh, 880px)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-glass)',
          padding: 0,
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--brand-primary-light) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '700' }}>
                {language === 'bn' ? 'প্রেসক্রিপশন বিবরণ' : 'Prescription Details'}
              </h2>
              <span
                className="badge badge-teal"
                style={{ fontSize: '0.75rem', fontWeight: '700' }}
              >
                #{prescription.id?.slice(-6) || 'RX'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={13} /> {prescription.scanDate || 'N/A'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={13} /> {prescription.scanTime || ''}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handlePrint}
              title="Print Summary"
            >
              <Printer size={15} />
              <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
            </button>

            <button
              type="button"
              className="btn-ghost btn-icon"
              onClick={onClose}
              aria-label="Close modal"
              style={{ borderRadius: '50%' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: 'clamp(1rem, 2.5vw, 1.75rem)', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Row: Original Image Preview + Patient & Doctor Info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: prescription.prescriptionImage
                ? 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))'
                : 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '1rem',
            }}
          >
            {/* Prescription Image thumbnail if stored */}
            {prescription.prescriptionImage && (
              <div
                className="card"
                style={{
                  background: '#070c1a',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  maxHeight: '200px',
                }}
              >
                <img
                  src={prescription.prescriptionImage}
                  alt="Original Prescription"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '180px',
                    objectFit: 'contain',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  onClick={() => setShowImageZoom(true)}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.5rem',
                    background: 'rgba(10, 17, 40, 0.85)',
                  }}
                  onClick={() => setShowImageZoom(true)}
                >
                  <Eye size={13} />
                  <span>View Original</span>
                </button>
              </div>
            )}

            {/* Patient Info Card */}
            <div
              className="card"
              style={{
                background: 'var(--bg-tertiary)',
                padding: '1.15rem',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.6rem', color: 'var(--brand-primary)' }}>
                <User size={17} />
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700' }}>
                  {language === 'bn' ? 'রোগীর বিবরণ' : 'Patient Info'}
                </h4>
              </div>
              <div style={{ fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Name: </span>
                  <strong>{prescription.patientInfo?.name || 'Not detected'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Age / Gender: </span>
                  <span>
                    {prescription.patientInfo?.age ? `${prescription.patientInfo.age} yrs` : '--'} / {prescription.patientInfo?.gender || '--'}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Prescription Date: </span>
                  <span>{prescription.patientInfo?.prescriptionDate || prescription.scanDate}</span>
                </div>
              </div>
            </div>

            {/* Doctor Info Card */}
            <div
              className="card"
              style={{
                background: 'var(--bg-tertiary)',
                padding: '1.15rem',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.6rem', color: 'var(--brand-primary)' }}>
                <Stethoscope size={17} />
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700' }}>
                  {language === 'bn' ? 'চিকিৎসক' : 'Prescribing Doctor'}
                </h4>
              </div>
              <div style={{ fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Doctor: </span>
                  <strong>{prescription.doctorInfo?.name || 'Not detected'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Specialization: </span>
                  <span>{prescription.doctorInfo?.specialization || prescription.doctorInfo?.qualification || '--'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Hospital: </span>
                  <span>{prescription.doctorInfo?.hospital || '--'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Medicines List Section */}
          <div
            className="card"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Pill size={18} color="var(--brand-primary)" />
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700' }}>
                {language === 'bn'
                  ? `প্রেসক্রিপশনের ওষুধ (${prescription.medicines?.length || 0}টি)`
                  : `Prescribed Medications (${prescription.medicines?.length || 0})`}
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {prescription.medicines?.map((med, idx) => (
                <div
                  key={med.id || idx}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1.15rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.98rem' }}>
                        {idx + 1}. {med.name}
                      </span>
                      {med.strength && med.strength !== 'As advised' && (
                        <span className="badge badge-teal" style={{ fontSize: '0.74rem' }}>
                          {med.strength}
                        </span>
                      )}
                      {med.form && (
                        <span className="badge" style={{ background: 'var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                          {med.form}
                        </span>
                      )}
                    </div>
                  </div>

                  {med.genericName && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Generic: <strong>{med.genericName}</strong>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
                    {med.frequency && (
                      <span style={{ background: 'var(--bg-card)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        ⏱️ {med.frequency} {med.timing ? `(${med.timing})` : ''}
                      </span>
                    )}
                    {med.mealInstruction && med.mealInstruction !== 'Not specified' && (
                      <span style={{ background: 'var(--bg-card)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', color: 'var(--brand-primary)' }}>
                        🍽️ {med.mealInstruction}
                      </span>
                    )}
                    {med.duration && (
                      <span style={{ background: 'var(--bg-card)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        📅 {med.duration}
                      </span>
                    )}
                    {med.quantity && (
                      <span style={{ background: 'var(--bg-card)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        Qty: {med.quantity}
                      </span>
                    )}
                  </div>

                  {med.instructions && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                      📝 {med.instructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Diagnosis & Lab Tests Section */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1rem',
            }}
          >
            <div
              className="card"
              style={{
                background: 'var(--bg-tertiary)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <h5 style={{ margin: '0 0 0.4rem 0', fontSize: '0.88rem', color: 'var(--brand-primary)', fontWeight: '700' }}>
                {language === 'bn' ? 'ডায়াগনোসিস / সমস্যা' : 'Diagnosis & Chief Complaint'}
              </h5>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                {prescription.diagnosis || 'None specified'}
              </p>
            </div>

            <div
              className="card"
              style={{
                background: 'var(--bg-tertiary)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <h5 style={{ margin: '0 0 0.4rem 0', fontSize: '0.88rem', color: 'var(--brand-primary)', fontWeight: '700' }}>
                {language === 'bn' ? 'পরামর্শকৃত পরীক্ষা' : 'Advised Diagnostic Tests'}
              </h5>
              {prescription.tests && prescription.tests.length > 0 ? (
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {prescription.tests.map((test, i) => (
                    <span key={i} className="badge badge-teal" style={{ fontSize: '0.78rem' }}>
                      {test}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  No diagnostic tests noted
                </p>
              )}
            </div>

            {prescription.doctorNotes && (
              <div
                className="card"
                style={{
                  background: 'var(--bg-tertiary)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  gridColumn: '1 / -1',
                }}
              >
                <h5 style={{ margin: '0 0 0.4rem 0', fontSize: '0.88rem', color: 'var(--brand-primary)', fontWeight: '700' }}>
                  {language === 'bn' ? 'ডাক্তারের পরামর্শ' : "Doctor's Advice & Clinical Notes"}
                </h5>
                <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {prescription.doctorNotes}
                </p>
              </div>
            )}
          </div>

          {/* Safety Disclaimer */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.07)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertTriangle size={15} color="var(--status-warning)" style={{ flexShrink: 0 }} />
            <span>
              {prescription.confidenceNotice ||
                'AI/OCR-generated interpretation. Please verify all information with the original prescription and a registered healthcare professional.'}
            </span>
          </div>

          {/* Footer with Delete Action */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            {confirmDelete ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--status-danger)' }}>
                  {language === 'bn' ? 'মুছে ফেলতে নিশ্চিত?' : 'Confirm delete prescription?'}
                </span>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ background: 'var(--status-danger)', color: '#ffffff' }}
                  onClick={() => {
                    onDelete(prescription.id);
                    onClose();
                  }}
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--status-danger)' }}
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={15} />
                <span>{language === 'bn' ? 'প্রেসক্রিপশন মুছে ফেলুন' : 'Delete Prescription'}</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Full Image Zoom Modal */}
      {showImageZoom && prescription.prescriptionImage && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(0, 0, 0, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowImageZoom(false)}
        >
          <button
            type="button"
            className="btn-ghost btn-icon"
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#ffffff' }}
            onClick={() => setShowImageZoom(false)}
          >
            <X size={24} />
          </button>
          <img
            src={prescription.prescriptionImage}
            alt="Full Prescription View"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
