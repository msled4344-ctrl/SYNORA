import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Pill,
  Search,
  Mic,
  ShieldCheck,
  AlertCircle,
  Filter,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { MedicineCard } from '../components/MedicineCard';
import { VoiceInputButton } from '../components/VoiceInputButton';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';

export const Medicine = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { medicines } = useHealthData();
  const { language, t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
    }
  }, [initialQuery]);

  const categories = [
    'All',
    'Fever & Pain',
    'Gastrointestinal',
    'Allergy & Cold',
    'Antibiotics',
    'Respiratory',
    'Emergency & First Aid',
    'Chronic Care',
  ];

  // Filtering medicines
  const filteredMedicines = medicines.filter((med) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      med.category?.toLowerCase() === selectedCategory.toLowerCase();

    const query = searchTerm.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesName = med.name?.toLowerCase().includes(query);
    const matchesGeneric = med.genericName?.toLowerCase().includes(query);
    const matchesBrand = (med.brandNames || []).some((b) =>
      b.toLowerCase().includes(query)
    );
    const matchesPurpose = med.purpose?.toLowerCase().includes(query);
    const matchesClass = med.therapeuticClass?.toLowerCase().includes(query);

    return matchesCategory && (matchesName || matchesGeneric || matchesBrand || matchesPurpose || matchesClass);
  });

  const handleVoiceSearch = (transcript) => {
    setSearchTerm(transcript);
    setSearchParams({ q: transcript });
  };

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <h1 className="section-title">
            {language === 'bn' ? 'ওষুধ তথ্য ও নিরাপত্তা নির্দেশিকা' : 'Medicine Information & Safety Guide'}
          </h1>
          <p className="section-desc">
            {language === 'bn'
              ? 'ব্র্যান্ড নাম বা জেনেরিক নাম লিখে সঠিক ব্যবহার, সেবন সতর্কতা, সাধারণ পার্শ্বপ্রতিক্রিয়া ও ডাক্তারের পরামর্শের নিয়ম জানুন।'
              : 'Search clinical precautions, generic formulations, standard indications, and dosage warnings.'}
          </p>
        </div>

        {/* Search & Voice Bar */}
        <div
          className="card card-glass"
          style={{
            maxWidth: '780px',
            margin: '0 auto 2.5rem auto',
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={22} color="var(--brand-primary)" style={{ marginLeft: '0.5rem' }} />
            <input
              type="text"
              className="form-input"
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '1.05rem',
                boxShadow: 'none',
                padding: '0.6rem 0',
              }}
              placeholder={
                language === 'bn'
                  ? 'ওষুধ বা জেনেরিক নাম লিখুন (যেমন: Napa, Paracetamol, Losectil, Flagyl)...'
                  : 'Search by Brand or Generic (e.g. Paracetamol, Napa, Omeprazole, Cetirizine)...'
              }
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchParams(e.target.value ? { q: e.target.value } : {});
              }}
            />

            {searchTerm && (
              <button
                type="button"
                className="btn-ghost btn-icon"
                onClick={() => {
                  setSearchTerm('');
                  setSearchParams({});
                }}
                style={{ width: '32px', height: '32px' }}
              >
                ✕
              </button>
            )}

            {/* Voice Search Button */}
            <VoiceInputButton
              onTranscriptComplete={handleVoiceSearch}
              placeholder="Speak medicine name (e.g. Paracetamol)..."
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div
          className="medicine-category-pills"
          style={{
            display: 'flex',
            gap: '0.45rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '1.75rem',
            justifyContent: 'flex-start',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Info Count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <span>
            Showing <strong>{filteredMedicines.length}</strong> verified medicines
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} color="var(--brand-primary)" />
            <span>Updated Daily</span>
          </span>
        </div>

        {/* Medicine Grid */}
        {filteredMedicines.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '3.5rem 2rem',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <AlertCircle size={44} color="var(--status-warning)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No Medicine Records Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              We could not find verified data matching "<strong>{searchTerm}</strong>". Check spelling or search by generic ingredient.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSearchParams({});
              }}
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))',
              gap: 'clamp(1rem, 2vw, 1.5rem)',
            }}
          >
            {filteredMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
