import React, { useState } from 'react';
import {
  Baby,
  Utensils,
  Sun,
  CloudRain,
  Wind,
  ThermometerSun,
  Sparkles,
  Award,
  ShieldCheck,
  AlertTriangle,
  Syringe,
  PlusCircle,
  CheckCircle,
  FileText,
  BookOpen,
  Info,
  Calendar,
  Activity,
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';

export const BabyCareViewer = ({ initialAgeId = '1m', onAddBabyClick }) => {
  const {
    babyCare,
    babyProfiles,
    activeBabyId,
    setActiveBabyId,
    generalWeatherGuidelines = {},
    generalHealthRules = [],
    medicalDisclaimer = '',
  } = useHealthData();

  const { language } = useLanguage();

  const [selectedAgeId, setSelectedAgeId] = useState(initialAgeId);
  const [activeTab, setActiveTab] = useState('feeding'); // feeding, weather, hygiene, development, health, warning, rules
  const [selectedWeatherType, setSelectedWeatherType] = useState('hot'); // hot, cold, rainy, pollution

  React.useEffect(() => {
    if (initialAgeId) {
      setSelectedAgeId(initialAgeId);
    }
  }, [initialAgeId]);

  // Find active care content
  const currentContent = babyCare.find((b) => b.ageId === selectedAgeId) || babyCare[0] || {};
  const currentAgeIndex = babyCare.findIndex((b) => b.ageId === selectedAgeId);
  const previousAgeContent = currentAgeIndex > 0 ? babyCare[currentAgeIndex - 1] : null;

  // Active Baby profile if any
  const currentBaby = babyProfiles.find((b) => b.id === activeBabyId);

  const handleBabySwitch = (babyId) => {
    setActiveBabyId(babyId);
    const baby = babyProfiles.find((b) => b.id === babyId);
    if (baby && baby.ageId) {
      setSelectedAgeId(baby.ageId);
    }
  };

  const tabs = [
    { id: 'feeding', label: language === 'bn' ? 'খাবার ও পুষ্টি' : 'Feeding & Nutrition', icon: Utensils },
    { id: 'weather', label: language === 'bn' ? 'আবহাওয়া ও পরিবেশ' : 'Environment & Weather', icon: Sun },
    { id: 'hygiene', label: language === 'bn' ? 'পরিচ্ছন্নতা ও নিরাপত্তা' : 'Hygiene & Safety', icon: ShieldCheck },
    { id: 'development', label: language === 'bn' ? 'বিকাশ ও উদ্দীপনা' : 'Development & Play', icon: Award },
    { id: 'health', label: language === 'bn' ? 'টিকা ও স্বাস্থ্য পর্যবেক্ষণ' : 'Health & Vaccines', icon: Syringe },
    { id: 'warning', label: language === 'bn' ? 'জরুরি বিপদ চিহ্ন' : 'Danger Signs', icon: AlertTriangle },
    { id: 'rules', label: language === 'bn' ? 'সার্বজনীন ১০ নিয়ম' : 'General Health Rules', icon: BookOpen },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Baby Profiles Quick Switch Bar (Multi-baby support) */}
      <div
        className="card card-glass"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--brand-primary-light)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Baby size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
              {language === 'bn' ? 'সক্রিয় শিশুর প্রোফাইল' : 'Active Child Profile'}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
              {babyProfiles.map((baby) => {
                const isActive = baby.id === activeBabyId;
                return (
                  <button
                    key={baby.id}
                    type="button"
                    onClick={() => handleBabySwitch(baby.id)}
                    className="btn btn-sm"
                    style={{
                      background: isActive ? 'var(--brand-primary)' : 'var(--bg-tertiary)',
                      color: isActive ? '#ffffff' : 'var(--text-primary)',
                      border: isActive ? 'none' : '1px solid var(--border-subtle)',
                      fontWeight: isActive ? '700' : '500',
                    }}
                  >
                    {isActive && <CheckCircle size={14} />}
                    {baby.name} ({baby.ageLabel || baby.ageId})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {onAddBabyClick && (
          <button type="button" className="btn btn-outline btn-sm" onClick={onAddBabyClick}>
            <PlusCircle size={16} />
            <span>{language === 'bn' ? '+ নতুন শিশু যোগ করুন' : '+ Add Child Profile'}</span>
          </button>
        )}
      </div>

      {/* Age Selector Horizontal Carousel */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            {language === 'bn' ? 'বয়সের পর্যায় নির্বাচন করুন (১ মাস থেকে ৫ বছর):' : 'Select Age Bracket (1 Month to 5 Years):'}
          </label>
          <span style={{ fontSize: '0.82rem', color: 'var(--brand-primary)', fontWeight: '700' }}>
            {currentContent.ageLabel || selectedAgeId}
          </span>
        </div>

        <div
          className="baby-age-scroll"
          style={{
            display: 'flex',
            gap: '0.45rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
          }}
        >
          {babyCare.map((item) => {
            const isSelected = item.ageId === selectedAgeId;
            return (
              <button
                key={item.id || item.ageId}
                type="button"
                onClick={() => setSelectedAgeId(item.ageId)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--brand-navy)' : 'var(--bg-card)',
                  color: isSelected ? '#ffffff' : 'var(--text-primary)',
                  border: isSelected ? '1.5px solid var(--brand-navy)' : '1px solid var(--border-subtle)',
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: '0.86rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                }}
              >
                {item.ageLabel || item.ageId}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Header Banner with Progression Context */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--brand-primary-light) 0%, var(--bg-card) 100%)',
          borderColor: 'rgba(0, 168, 150, 0.25)',
          padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-teal">{currentContent.ageLabel}</span>
            {currentBaby && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                • Showing verified guidelines for <strong>{currentBaby.name}</strong>
              </span>
            )}
          </div>

          {previousAgeContent && (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              Progressing from: <strong>{previousAgeContent.ageLabel}</strong>
            </div>
          )}
        </div>

        <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.45rem)', marginBottom: '0.5rem' }}>{currentContent.title}</h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '900px', lineHeight: '1.65' }}>
          {currentContent.description}
        </p>
      </div>

      {/* Categorized Tab Navigation */}
      <div
        className="baby-tabs-scroll"
        style={{
          display: 'flex',
          gap: '0.35rem',
          overflowX: 'auto',
          borderBottom: '1.5px solid var(--border-subtle)',
          paddingBottom: '0.25rem',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isWarning = tab.id === 'warning';
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.7rem 1rem',
                border: 'none',
                background: 'transparent',
                borderBottom: isActive
                  ? isWarning
                    ? '3px solid var(--status-danger)'
                    : '3px solid var(--brand-primary)'
                  : '3px solid transparent',
                color: isActive
                  ? isWarning
                    ? 'var(--status-danger)'
                    : 'var(--brand-primary)'
                  : 'var(--text-secondary)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Icon size={17} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="card" style={{ padding: '2rem' }}>
        {/* 1. Feeding & Nutrition */}
        {activeTab === 'feeding' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Utensils size={22} color="var(--brand-primary)" />
              <h3 style={{ margin: 0 }}>Feeding & Nutritional Recommendations</h3>
            </div>

            <div
              style={{
                fontSize: '1rem',
                lineHeight: '1.8',
                color: 'var(--text-primary)',
                whiteSpace: 'pre-line',
                marginBottom: '1.5rem',
              }}
            >
              {currentContent.feeding || currentContent.nutrition}
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--brand-primary)' }}>
              <strong>Pediatric Nutrition Principle:</strong> Never force-feed. Encourage joyful exploration of healthy foods while keeping breast milk or whole balanced meals age-appropriate.
            </div>
          </div>
        )}

        {/* 2. Environment & Weather */}
        {activeTab === 'weather' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Sun size={22} color="#f59e0b" />
              <h3 style={{ margin: 0 }}>Weather, Clothing & Environment Management</h3>
            </div>

            {currentContent.weather && (
              <div
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.8',
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-line',
                  marginBottom: '2rem',
                }}
              >
                {currentContent.weather}
              </div>
            )}

            <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--brand-navy)' }}>
              Seasonal & Environmental Guidelines for Children:
            </h4>

            {/* Weather Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${selectedWeatherType === 'hot' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedWeatherType('hot')}
              >
                <ThermometerSun size={15} />
                <span>Hot Weather</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${selectedWeatherType === 'cold' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedWeatherType('cold')}
              >
                <Wind size={15} />
                <span>Cold Weather</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${selectedWeatherType === 'rainy' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedWeatherType('rainy')}
              >
                <CloudRain size={15} />
                <span>Rainy & Humid</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${selectedWeatherType === 'pollution' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedWeatherType('pollution')}
              >
                <AlertTriangle size={15} />
                <span>Air Pollution & Smoke</span>
              </button>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              {selectedWeatherType === 'hot' && (
                <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.8', fontSize: '0.92rem' }}>
                  {(generalWeatherGuidelines.hotWeather || [
                    'Keep children hydrated with clean water.',
                    'Avoid prolonged direct sunlight during peak noon hours.',
                    'Dress in light, breathable cotton layers.',
                  ]).map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              )}

              {selectedWeatherType === 'cold' && (
                <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.8', fontSize: '0.92rem' }}>
                  {(generalWeatherGuidelines.coldWeather || [
                    'Use appropriate warm layers without overheating.',
                    'Keep the child dry and comfortably warm.',
                    'Avoid cold wind exposure.',
                  ]).map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              )}

              {selectedWeatherType === 'rainy' && (
                <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.8', fontSize: '0.92rem' }}>
                  {(generalWeatherGuidelines.rainyHumid || [
                    'Keep clothes, bedding, and diapers dry.',
                    'Maintain clean surroundings to avoid mold.',
                    'Use mosquito protection.',
                  ]).map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              )}

              {selectedWeatherType === 'pollution' && (
                <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.8', fontSize: '0.92rem' }}>
                  {(generalWeatherGuidelines.airPollution || [
                    'Keep children strictly away from cigarette smoke.',
                    'Reduce outdoor exertion when AQI is poor.',
                    'Keep indoor air ventilated and clean.',
                  ]).map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* 3. Hygiene & Safety */}
        {activeTab === 'hygiene' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <ShieldCheck size={22} color="var(--status-success)" />
              <h3 style={{ margin: 0 }}>Hygiene, Bathing & Preventive Child Safety</h3>
            </div>

            {currentContent.hygiene && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--brand-primary)' }}>Hygiene & Bathing:</h4>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.8', whiteSpace: 'pre-line', color: 'var(--text-primary)' }}>
                  {currentContent.hygiene}
                </div>
              </div>
            )}

            {currentContent.safety && (
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--brand-blue)' }}>Childproofing & Safety:</h4>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.8', whiteSpace: 'pre-line', color: 'var(--text-primary)' }}>
                  {currentContent.safety}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Development & Activity */}
        {activeTab === 'development' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Award size={22} color="var(--brand-primary)" />
              <h3 style={{ margin: 0 }}>Developmental Benchmarks & Stimulation Activities</h3>
            </div>

            <div style={{ fontSize: '1rem', lineHeight: '1.8', whiteSpace: 'pre-line', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              {currentContent.development || currentContent.milestones}
            </div>

            {currentContent.physicalActivity && (
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--brand-primary)' }}>Daily Physical Activity:</h4>
                <div style={{ fontSize: '0.92rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                  {currentContent.physicalActivity}
                </div>
              </div>
            )}

            {currentContent.sleep && (
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--brand-blue)' }}>Sleep & Rest Architecture:</h4>
                <div style={{ fontSize: '0.92rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                  {currentContent.sleep}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. Health & Vaccines */}
        {activeTab === 'health' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <Syringe size={22} color="var(--status-info)" />
              <h3 style={{ margin: 0 }}>Vaccine Schedule & Health Monitoring</h3>
            </div>

            {currentContent.vaccines && (
              <div style={{ background: 'var(--status-info-bg)', color: 'var(--text-primary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid rgba(2, 132, 199, 0.2)' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--status-info)', marginBottom: '0.4rem' }}>Immunization Schedule:</h4>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line' }}>
                  {currentContent.vaccines}
                </p>
              </div>
            )}

            {currentContent.health && (
              <div style={{ fontSize: '0.95rem', lineHeight: '1.8', whiteSpace: 'pre-line', color: 'var(--text-primary)' }}>
                {currentContent.health}
              </div>
            )}
          </div>
        )}

        {/* 6. Danger Signs & Red Flags */}
        {activeTab === 'warning' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <AlertTriangle size={22} color="var(--status-danger)" />
              <h3 style={{ margin: 0, color: 'var(--status-danger)' }}>Red Flag Danger Signs — Seek Immediate Pediatric Review</h3>
            </div>

            <div
              style={{
                background: 'var(--status-danger-bg)',
                border: '1.5px solid rgba(239, 68, 68, 0.3)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                lineHeight: '1.8',
                fontSize: '1rem',
                whiteSpace: 'pre-line',
              }}
            >
              {currentContent.warningSigns || 'Seek urgent medical attention if the baby has difficulty breathing, fast breathing, refuses feeding, high fever, or becomes unresponsive.'}
            </div>
          </div>
        )}

        {/* 7. General Health Rules */}
        {activeTab === 'rules' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <BookOpen size={22} color="var(--brand-primary)" />
              <h3 style={{ margin: 0 }}>SYNORA 10 Universal Child Health Rules</h3>
            </div>

            <ol style={{ paddingLeft: '1.5rem', lineHeight: '2', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {(generalHealthRules || []).map((rule, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                  <strong>{rule}</strong>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Practical Parent Tip Footer */}
        {currentContent.tips && (
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <Sparkles size={20} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              <strong>Pediatric Parenting Tip:</strong> {currentContent.tips}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
