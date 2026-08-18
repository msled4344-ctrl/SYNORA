import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Baby, Plus, X, Heart, Sparkles, ShieldCheck, Check } from 'lucide-react';
import { BabyCareViewer } from '../components/BabyCareViewer';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';

export const BabyCare = () => {
  const [searchParams] = useSearchParams();
  const initialAgeParam = searchParams.get('age') || '6m';

  const { babyProfiles, addBabyProfile } = useHealthData();
  const { language, t } = useLanguage();

  const [showAddBabyModal, setShowAddBabyModal] = useState(false);
  const [babyForm, setBabyForm] = useState({
    name: '',
    gender: 'Boy',
    ageId: '6m',
    birthDate: '',
    weightKg: '',
    heightCm: '',
    allergies: '',
    feedingType: 'Breastfeeding',
  });

  const handleAddBabySubmit = (e) => {
    e.preventDefault();
    if (!babyForm.name.trim()) return;

    addBabyProfile({
      name: babyForm.name.trim(),
      gender: babyForm.gender,
      ageId: babyForm.ageId,
      birthDate: babyForm.birthDate || new Date().toISOString().split('T')[0],
      weightKg: parseFloat(babyForm.weightKg) || null,
      heightCm: parseFloat(babyForm.heightCm) || null,
      allergies: babyForm.allergies || 'None reported',
      feedingType: babyForm.feedingType,
    });

    setShowAddBabyModal(false);
    setBabyForm({
      name: '',
      gender: 'Boy',
      ageId: '6m',
      birthDate: '',
      weightKg: '',
      heightCm: '',
      allergies: '',
      feedingType: 'Breastfeeding',
    });
  };

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.25rem)', fontWeight: '800', letterSpacing: '-0.025em', lineHeight: '1.2', marginBottom: '0.6rem' }}>
              {language === 'bn' ? 'বয়সভিত্তিক বেবি কেয়ার ও বিকাশ' : 'Age-Based Baby Care & Development'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '680px' }}>
              {language === 'bn'
                ? '১ মাস থেকে ১০ বছর বয়স পর্যন্ত শিশুর সঠিক পুষ্টি, ঘুম, টিকা সূচি, বিকাশের মাইলস্টোন এবং জরুরি সতর্ক সংকেত।'
                : 'Pediatrician-informed guidance for infants, toddlers, and children spanning nutrition, vaccination charts, developmental milestones, and safety.'}
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowAddBabyModal(true)}
          >
            <Plus size={18} />
            <span>{language === 'bn' ? 'নতুন শিশুর প্রোফাইল যোগ করুন' : 'Add Child Profile'}</span>
          </button>
        </div>

        {/* Baby Care Viewer Component */}
        <BabyCareViewer
          initialAgeId={initialAgeParam}
          onAddBabyClick={() => setShowAddBabyModal(true)}
        />
      </div>

      {/* Add Baby Profile Modal */}
      {showAddBabyModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            background: 'rgba(10, 17, 40, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              padding: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--brand-primary-light)',
                    color: 'var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Baby size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>
                  {language === 'bn' ? 'নতুন শিশুর প্রোফাইল ফর্ম' : 'Create Baby Profile'}
                </h3>
              </div>
              <button
                type="button"
                className="btn-ghost btn-icon"
                onClick={() => setShowAddBabyModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddBabySubmit}>
              <div className="form-group">
                <label className="form-label">
                  {language === 'bn' ? 'শিশুর নাম / ডাকনাম *' : "Baby's Name or Nickname *"}
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Aryan, Zara, Liam"
                  value={babyForm.name}
                  onChange={(e) => setBabyForm({ ...babyForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={babyForm.gender}
                    onChange={(e) => setBabyForm({ ...babyForm, gender: e.target.value })}
                  >
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Current Age Bracket *</label>
                  <select
                    className="form-select"
                    value={babyForm.ageId}
                    onChange={(e) => setBabyForm({ ...babyForm, ageId: e.target.value })}
                  >
                    <option value="1m">1 Month (Newborn)</option>
                    <option value="2m">2 Months</option>
                    <option value="3m">3 Months</option>
                    <option value="4m">4 Months</option>
                    <option value="5m">5 Months</option>
                    <option value="6m">6 Months</option>
                    <option value="7m">7 Months</option>
                    <option value="8m">8 Months</option>
                    <option value="9m">9 Months</option>
                    <option value="1y">1 Year (12m)</option>
                    <option value="2y">2 Years</option>
                    <option value="3y">3 Years</option>
                    <option value="4y">4 Years</option>
                    <option value="5y">5 Years</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Weight (kg) (Optional)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    placeholder="e.g. 7.5"
                    value={babyForm.weightKg}
                    onChange={(e) => setBabyForm({ ...babyForm, weightKg: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Height (cm) (Optional)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    placeholder="e.g. 68"
                    value={babyForm.heightCm}
                    onChange={(e) => setBabyForm({ ...babyForm, heightCm: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Feeding Routine</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Exclusive Breastfeeding / Formula / Solid purees"
                  value={babyForm.feedingType}
                  onChange={(e) => setBabyForm({ ...babyForm, feedingType: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Known Allergies or Medical Notes</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. None, Milk allergy, Sensitive skin"
                  value={babyForm.allergies}
                  onChange={(e) => setBabyForm({ ...babyForm, allergies: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddBabyModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Save Baby Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
