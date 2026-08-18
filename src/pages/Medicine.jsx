import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Pill,
  Search,
  Mic,
  ShieldCheck,
  AlertCircle,
  Filter,
  CheckCircle2,
  Sparkles,
  Bot,
  ArrowRight,
} from 'lucide-react';
import { MedicineCard } from '../components/MedicineCard';
import { VoiceInputButton } from '../components/VoiceInputButton';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';

const BENGALI_SYNONYMS = {
  'প্যারাসিটামল': ['paracetamol', 'napa', 'ace', 'fast', 'fever', 'pain'],
  'নাপা': ['paracetamol', 'napa', 'fever', 'pain'],
  'এইস': ['paracetamol', 'ace'],
  'জ্বর': ['paracetamol', 'fever', 'ibuprofen'],
  'ব্যথা': ['paracetamol', 'ibuprofen', 'pain'],
  'মাথা ব্যথা': ['paracetamol', 'ibuprofen', 'headache'],
  'মাথাব্যথা': ['paracetamol', 'ibuprofen', 'headache'],
  'সেকলো': ['omeprazole', 'seclo'],
  'লোসেকটিল': ['omeprazole', 'losectil'],
  'ওমেপ্রাজল': ['omeprazole'],
  'গ্যাস': ['omeprazole', 'gastrointestinal', 'gastric', 'heartburn'],
  'গ্যাস্ট্রিক': ['omeprazole', 'gastric', 'heartburn'],
  'বুক জ্বালা': ['omeprazole', 'heartburn', 'acid'],
  'অ্যালাট্রোল': ['cetirizine', 'alatrol'],
  'সেট্রিজিন': ['cetirizine'],
  'অ্যালার্জি': ['cetirizine', 'allergy'],
  'সর্দি': ['cetirizine', 'cold', 'rhinitis'],
  'হাঁচি': ['cetirizine', 'sneezing'],
  'মক্সাসিল': ['amoxicillin', 'moxacil'],
  'অ্যামোক্সিসিলিন': ['amoxicillin'],
  'অ্যান্টিবায়োটিক': ['antibiotics', 'amoxicillin', 'azithromycin'],
  'জিথ্রিন': ['azithromycin', 'zithrin'],
  'অ্যাজিথ্রোমাইসিন': ['azithromycin'],
  'ওরস্যালাইন': ['ors', 'saline', 'orsaline'],
  'স্যালাইন': ['ors', 'saline'],
  'ডায়রিয়া': ['ors', 'metronidazole', 'diarrhea'],
  'বমি': ['ors', 'vomiting'],
  'পানিশূন্যতা': ['ors', 'dehydration'],
  'ফ্লাজিল': ['metronidazole', 'flagyl'],
  'মেট্রোনিডাজল': ['metronidazole'],
  'আমাশয়': ['metronidazole', 'dysentery'],
  'ভেন্টোলিন': ['salbutamol', 'ventolin', 'inhaler'],
  'সালবুটামল': ['salbutamol'],
  'ইনহেলার': ['salbutamol', 'inhaler', 'asthma'],
  'হাঁপানি': ['salbutamol', 'montelukast', 'asthma'],
  'শ্বাসকষ্ট': ['salbutamol', 'montelukast', 'breathing'],
  'মোনাস': ['montelukast', 'monas'],
  'মন্টেলুকাস্ট': ['montelukast'],
  'আইবুপ্রোফেন': ['ibuprofen'],
  'ফ্লামিম্যাক্স': ['ibuprofen', 'flamimax'],
};

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

  const query = searchTerm.toLowerCase().trim();

  // Find synonym expansions if query has Bengali tokens
  let expandedQueries = [query];
  if (query) {
    for (const [bnKey, enTerms] of Object.entries(BENGALI_SYNONYMS)) {
      if (query.includes(bnKey.toLowerCase()) || bnKey.toLowerCase().includes(query)) {
        expandedQueries.push(...enTerms);
      }
    }
  }

  // Filtering medicines
  const filteredMedicines = medicines.filter((med) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      med.category?.toLowerCase() === selectedCategory.toLowerCase();

    if (!query) return matchesCategory;

    const medString = [
      med.name,
      med.genericName,
      ...(med.brandNames || []),
      med.purpose,
      med.indications,
      med.category,
      med.therapeuticClass,
      ...(med.dosageForms || []),
    ].join(' ').toLowerCase();

    const matchesQuery = expandedQueries.some((q) => medString.includes(q));

    return matchesCategory && matchesQuery;
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
              padding: '3rem 2rem',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <AlertCircle size={48} color="var(--status-warning)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ marginBottom: '0.6rem', fontSize: '1.25rem' }}>
              {language === 'bn' ? 'ডাটাবেজে তথ্য খুঁজে পাওয়া যায়নি' : 'No Database Record Found'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: '1.6' }}>
              {language === 'bn' ? (
                <>
                  দুঃখিত, আমাদের ডাটাবেজে "<strong>{searchTerm || selectedCategory}</strong>" সম্পর্কিত কোনো ওষুধের রেকর্ড খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক নাম বা জেনেরিক উপাদান দিয়ে আবার চেষ্টা করুন।
                </>
              ) : (
                <>
                  Sorry, we could not find verified medicine records matching "<strong>{searchTerm || selectedCategory}</strong>" in our database. Please check the spelling or search by generic ingredient.
                </>
              )}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSearchParams({});
                }}
              >
                {language === 'bn' ? 'সব ওষুধ দেখুন (রিসেট)' : 'View All Medicines (Reset)'}
              </button>

              {searchTerm && (
                <Link
                  to={`/ai-health?q=${encodeURIComponent(searchTerm)}`}
                  className="btn btn-primary btn-sm"
                >
                  <Bot size={16} />
                  <span>{language === 'bn' ? `সিনোরা এআই-কে জিজ্ঞাসা করুন` : `Ask SYNORA AI Assistant`}</span>
                </Link>
              )}
            </div>
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
