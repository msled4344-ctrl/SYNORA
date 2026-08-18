import React from 'react';
import { FileText, AlertTriangle, ShieldAlert } from 'lucide-react';

export const Terms = () => {
  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Terms of Service & Medical Disclaimer</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Effective Date: August 2026
        </p>

        <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', lineHeight: '1.7' }}>
          {/* Prominent Medical Disclaimer */}
          <div
            style={{
              background: 'var(--status-warning-bg)',
              border: '1.5px solid rgba(245, 158, 11, 0.4)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--status-warning)', fontWeight: '700' }}>
              <ShieldAlert size={20} />
              <span>CRITICAL MEDICAL DISCLAIMER</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem' }}>
              SYNORA is an informational and educational digital healthcare platform powered by AI. <strong>SYNORA DOES NOT PROVIDE MEDICAL DIAGNOSES, PRESCRIPTIONS, OR DIRECT CLINICAL TREATMENT.</strong> The content and AI suggestions are not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified physician or registered healthcare provider with any medical questions.
            </p>
          </div>

          <section>
            <h3 style={{ color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>1. Emergency Situations</h3>
            <p>
              If you think you have a medical emergency (such as acute chest pain, signs of stroke, difficulty breathing, or severe bleeding), call your national emergency number (<strong>999 / 911 / 112</strong>) or go to the nearest emergency hospital immediately. Do not rely on SYNORA for acute emergency care.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>2. Medicine Information Use</h3>
            <p>
              The medicine database provided by SYNORA is compiled for educational reference. While we strive to maintain accurate, up-to-date information, pharmaceutical formulas and dosages must be verified with licensed medical practitioners and pharmacists.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>3. User Responsibilities</h3>
            <p>
              Users agree to provide truthful and accurate information when completing personal health assessments or baby care profiles. You are responsible for keeping your account credentials secure.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>4. Modifications to Service</h3>
            <p>
              We reserve the right to improve, update, or discontinue features of SYNORA to adhere to evolving healthcare best practices and regulatory standards.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
