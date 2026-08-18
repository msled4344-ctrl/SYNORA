import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>SYNORA Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Last Updated: August 2026 • Version 1.0
        </p>

        <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', lineHeight: '1.7' }}>
          <section>
            <h3 style={{ color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>1. Our Privacy Commitment</h3>
            <p>
              SYNORA is dedicated to protecting your health and personal data. We recognize that health biometrics, infant development details, and medical consultations are sensitive and strictly confidential.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>2. Information We Collect</h3>
            <p>
              We only collect data that you voluntarily provide to power your personalized healthcare experience:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li><strong>Account Information:</strong> Name, email address, profile avatar.</li>
              <li><strong>Personal Health Biometrics:</strong> Age, height, weight, blood pressure, fasting sugar, known allergies, and current medications (used solely to compute your wellness score and contextualize AI health tips).</li>
              <li><strong>Child / Baby Profiles:</strong> Nickname, age bracket, feeding schedule, and developmental notes for personalized care guidance.</li>
              <li><strong>AI Health Voice Transcripts:</strong> Audio processed via native browser speech recognition for question answering.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>3. How Your Data Is Secured</h3>
            <p>
              We enforce strict Firebase Security Rules, end-to-end HTTPS encryption, and role-based access control. Your health data is partitioned per user UID and is never shared, sold, or exposed to unauthorized parties.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>4. User Data Control</h3>
            <p>
              You maintain full control over your health profile. You can view, modify, or permanently delete your health records and AI chat history at any time from your Profile and AI Health pages.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--brand-primary)', marginBottom: '0.5rem' }}>5. Contact Our Privacy Officer</h3>
            <p>
              If you have questions regarding data privacy or wish to request data erasure, contact us at: <a href="mailto:privacy@synora.health" style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>privacy@synora.health</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
