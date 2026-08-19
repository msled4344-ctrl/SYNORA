import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Pill,
  Search,
  AlertCircle,
  Sparkles,
  Bot,
  ScanLine,
  RotateCcw,
} from 'lucide-react';
import { MedicineCard } from '../components/MedicineCard';
import { VoiceInputButton } from '../components/VoiceInputButton';
import { PrescriptionScannerModal } from '../components/PrescriptionScannerModal';
import { useLanguage } from '../context/LanguageContext';
import {
  searchMedicines,
  getMedicineCategories,
} from '../services/medicineService';

export const Medicine = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const { language } = useLanguage();

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showScannerModal, setShowScannerModal] = useState(false);

  // Synchronize with URL search parameters
  useEffect(() => {
    if (initialQuery !== searchTerm) {
      setSearchTerm(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Categories extracted dynamically from dataset
  const categories = useMemo(() => getMedicineCategories(), []);

  // Filtered and ranked medicines dynamically computed via clean medicine data layer
  const filteredMedicines = useMemo(() => {
    return searchMedicines({
      query: searchTerm,
      category: selectedCategory,
    });
  }, [searchTerm, selectedCategory]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    const newParams = {};
    if (val.trim()) newParams.q = val.trim();
    if (selectedCategory !== 'All') newParams.category = selectedCategory;
    setSearchParams(newParams);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const newParams = {};
    if (searchTerm.trim()) newParams.q = searchTerm.trim();
    if (cat !== 'All') newParams.category = cat;
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    const newParams = {};
    if (selectedCategory !== 'All') newParams.category = selectedCategory;
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSearchParams({});
  };

  const handleVoiceSearch = (transcript) => {
    if (transcript) {
      setSearchTerm(transcript);
      const newParams = { q: transcript };
      if (selectedCategory !== 'All') newParams.category = selectedCategory;
      setSearchParams(newParams);
    }
  };

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 className="section-title">
            {language === 'bn' ? 'ওষুধ তথ্য ও নিরাপত্তা নির্দেশিকা' : 'Medicine Information & Safety Guide'}
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '650px', margin: '0.5rem auto 0 auto', color: 'var(--text-muted)' }}>
            {language === 'bn'
              ? 'বাংলাদেশের জেনেরিক ও ব্র্যান্ড ওষুধের সঠিক তথ্য, ব্যবহার ও চিকিৎসাগত নিরাপত্তা নির্দেশিকা জানুন।'
              : 'Search verified medicine records, popular brand names, safety guidelines, and clinical indications.'}
          </p>
        </div>

        {/* Search & Prescription Scanner Bar */}
        <div
          className="card card-glass medicine-search-container"
          style={{
            maxWidth: '780px',
            margin: '0 auto 2rem auto',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
            {/* Prescription Scanner Icon Button on the LEFT side */}
            <div className="prescription-scan-trigger-wrapper" style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn-prescription-scan"
                onClick={() => setShowScannerModal(true)}
                aria-label="Scan Prescription"
                title={language === 'bn' ? 'প্রেসক্রিপশন স্ক্যান করুন' : 'Scan Prescription'}
              >
                <ScanLine size={21} />
                <span className="prescription-scan-pulse-dot" />
              </button>

              {/* Tooltip */}
              <div className="prescription-scan-tooltip">
                <Sparkles size={13} color="#00f5d4" />
                <span>{language === 'bn' ? 'প্রেসক্রিপশন স্ক্যান করুন' : 'Scan Prescription'}</span>
              </div>
            </div>

            <Search size={22} color="var(--brand-primary)" style={{ flexShrink: 0 }} />

            <input
              type="text"
              id="medicine-search-input"
              className="form-input"
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '1.05rem',
                boxShadow: 'none',
                padding: '0.6rem 0',
                flex: 1,
              }}
              placeholder={
                language === 'bn'
                  ? 'ওষুধ বা জেনেরিক নাম লিখুন (যেমন: Napa, Paracetamol, Losectil, গ্যাস, জ্বর)...'
                  : 'Search by Generic or Brand (e.g. Paracetamol, Napa, Omeprazole, fever, gas)...'
              }
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />

            {searchTerm && (
              <button
                type="button"
                className="btn-ghost btn-icon"
                onClick={handleClearSearch}
                aria-label="Clear search query"
                style={{ width: '32px', height: '32px', flexShrink: 0 }}
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

        {/* Prescription Scanner Modal */}
        <PrescriptionScannerModal
          isOpen={showScannerModal}
          onClose={() => setShowScannerModal(false)}
          onSearchMedicine={(medQuery) => {
            setSearchTerm(medQuery);
            const newParams = { q: medQuery };
            if (selectedCategory !== 'All') newParams.category = selectedCategory;
            setSearchParams(newParams);
          }}
        />

        {/* Dynamic Category Filter Pills */}
        <div
          className="medicine-category-pills"
          style={{
            display: 'flex',
            gap: '0.45rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '1.5rem',
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
                onClick={() => handleCategorySelect(cat)}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  borderRadius: 'var(--radius-full)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  fontSize: '0.85rem',
                  padding: '0.4rem 0.9rem',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Dynamic Medicine Counter & Info Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
          }}
        >
          <span id="medicine-results-count">
            {language === 'bn' ? (
              <>
                <strong>{filteredMedicines.length}</strong>টি যাচাইকৃত ওষুধ প্রদর্শিত হচ্ছে
              </>
            ) : (
              <>
                Showing <strong>{filteredMedicines.length}</strong> {filteredMedicines.length === 1 ? 'medicine' : 'medicines'}
              </>
            )}
            {(searchTerm || selectedCategory !== 'All') && (
              <span style={{ marginLeft: '0.5rem', fontSize: '0.82rem', color: 'var(--brand-primary)' }}>
                ({selectedCategory !== 'All' ? selectedCategory : ''}{searchTerm ? (selectedCategory !== 'All' ? ` • "${searchTerm}"` : `"${searchTerm}"`) : ''})
              </span>
            )}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn-ghost"
                style={{
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.5rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <RotateCcw size={13} />
                <span>{language === 'bn' ? 'ফিল্টার রিসেট' : 'Reset Filters'}</span>
              </button>
            )}

            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={14} color="var(--brand-primary)" />
              <span>{language === 'bn' ? 'যাচাইকৃত ডাটাবেজ' : 'Verified Dataset'}</span>
            </span>
          </div>
        </div>

        {/* Medicine Cards Grid or Professional Empty State */}
        {filteredMedicines.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '3.5rem 2rem',
              maxWidth: '620px',
              margin: '0 auto',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <AlertCircle
              size={52}
              color="var(--status-warning)"
              style={{ margin: '0 auto 1rem auto', opacity: 0.9 }}
            />
            <h3 style={{ marginBottom: '0.6rem', fontSize: '1.3rem', fontWeight: '700' }}>
              {language === 'bn' ? 'কোনো ওষুধ পাওয়া যায়নি' : 'No medicine found'}
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.96rem',
                marginBottom: '1.75rem',
                lineHeight: '1.6',
              }}
            >
              {language === 'bn' ? (
                <>
                  জেনেরিক নাম, ব্র্যান্ডের নাম বা উপসর্গের নাম দিয়ে আবার অনুসন্ধান করুন।
                  {searchTerm && (
                    <span style={{ display: 'block', marginTop: '0.35rem', color: 'var(--text-muted)' }}>
                      অনুসন্ধান টার্ম: "<strong>{searchTerm}</strong>"
                    </span>
                  )}
                </>
              ) : (
                <>
                  Try searching by generic name, brand name, or condition.
                  {searchTerm && (
                    <span style={{ display: 'block', marginTop: '0.35rem', color: 'var(--text-muted)' }}>
                      Search query: "<strong>{searchTerm}</strong>"
                    </span>
                  )}
                </>
              )}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleResetFilters}
              >
                <RotateCcw size={15} />
                <span>{language === 'bn' ? 'সব ওষুধ দেখুন (রিসেট)' : 'View All Medicines (Reset)'}</span>
              </button>

              {searchTerm && (
                <Link
                  to={`/ai-health?q=${encodeURIComponent(searchTerm)}`}
                  className="btn btn-primary btn-sm"
                >
                  <Bot size={16} />
                  <span>
                    {language === 'bn'
                      ? `সিনোরা এআই-কে জিজ্ঞাসা করুন`
                      : `Ask SYNORA AI Assistant`}
                  </span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
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
