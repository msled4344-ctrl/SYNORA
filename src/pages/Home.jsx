import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Bot,
  Baby,
  Pill,
  Activity,
  Phone,
  Mic,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Search,
  BookOpen,
  UserCheck,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';

export const Home = () => {
  const navigate = useNavigate();
  const { healthTips, babyCare, medicines } = useHealthData();
  const { language, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicine?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickTools = [
    {
      title: language === 'bn' ? 'সিনোরা এআই স্বাস্থ্য সহায়িকা' : 'SYNORA AI Health Assistant',
      desc: language === 'bn' ? 'ভয়েস বা টাইপ করে যেকোনো স্বাস্থ্য প্রশ্ন করুন এবং তাত্ক্ষণিক নিরাপদ পরামর্শ পান।' : 'Ask healthcare questions in plain language with voice or text support.',
      icon: Bot,
      link: '/ai-health',
      badge: 'Voice Enabled',
      badgeColor: 'var(--brand-primary)',
    },
    {
      title: language === 'bn' ? 'বয়সভিত্তিক বেবি কেয়ার' : 'Age-Based Baby Care',
      desc: language === 'bn' ? '১ মাস থেকে ১০ বছর বয়সী শিশুর খাবার, ঘুম, টিকা ও স্বাস্থ্য বিকাশ গাইড।' : 'Milestones, feeding schedules, vaccine charts & safety from 1 month to 10 years.',
      icon: Baby,
      link: '/baby-care',
      badge: '1m - 10y',
      badgeColor: 'var(--brand-teal)',
    },
    {
      title: language === 'bn' ? 'যাচাইকৃত ওষুধ তথ্য' : 'Verified Medicine Info',
      desc: language === 'bn' ? 'ব্র্যান্ড বা জেনেরিক নাম লিখে ওষুধের সঠিক ব্যবহার, সতর্কতা ও পার্শ্বপ্রতিক্রিয়া জানুন।' : 'Lookup uses, precautions, side effects, and safe storage instructions.',
      icon: Pill,
      link: '/medicine',
      badge: 'Safety Verified',
      badgeColor: 'var(--brand-blue)',
    },
    {
      title: language === 'bn' ? 'স্বাস্থ্য প্রোফাইল ও ওয়েলনেস স্কোর' : 'Health Profile & Wellness Score',
      desc: language === 'bn' ? 'আপনার বয়স, রক্তচাপ ও ওজন অনুযায়ী সিনোরা হেলথ স্কোর ও পরামর্শ জানুন।' : 'Calculate your personalized wellness index and get lifestyle recommendations.',
      icon: Activity,
      link: '/health-score',
      badge: 'Personalized',
      badgeColor: 'var(--status-success)',
    },
    {
      title: language === 'bn' ? 'দৈনন্দিন স্বাস্থ্য টিপস' : 'Daily Preventive Health Tips',
      desc: language === 'bn' ? 'পর্যাপ্ত পানি, ঘুম, রক্তচাপ ও পুষ্টি সংক্রান্ত সহজ ও কার্যকর স্বাস্থ্য নির্দেশনা।' : 'Actionable daily guides for hydration, restorative sleep, and heart vitality.',
      icon: BookOpen,
      link: '#tips-section',
      badge: 'Daily Wellness',
      badgeColor: 'var(--status-info)',
    },
    {
      title: language === 'bn' ? 'যোগাযোগ ও সহায়তা' : 'Contact & Support',
      desc: language === 'bn' ? 'স্বাস্থ্য পরামর্শ কেন্দ্র ও সিনোরা বিশেষজ্ঞ টিমের সাথে সরাসরি যোগাযোগ করুন।' : 'Reach out to our clinical support team or emergency health dispatch.',
      icon: Phone,
      link: '/contact',
      badge: '24/7 Helpline',
      badgeColor: 'var(--text-muted)',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="section" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(1.75rem, 4vw, 3.5rem)',
              alignItems: 'center',
            }}
          >
            {/* Left Content */}
            <div>
              <h1 className="hero-main-title">
                {language === 'bn' ? (
                  <>
                    <span className="hero-word-crazy hero-word-bn">সবার</span>{' '}
                    <span className="hero-phrase-sub">জন্য সহজ ও নিরাপদ</span>
                    <br className="hero-title-break" />
                    <span className="hero-gradient-text">স্মার্ট স্বাস্থ্য সেবা</span>
                  </>
                ) : (
                  <>
                    <span className="hero-word-crazy">Your</span>{' '}
                    <span className="hero-phrase-sub">Friendly Digital</span>
                    <br className="hero-title-break" />
                    <span className="hero-gradient-text">Healthcare Companion</span>
                  </>
                )}
              </h1>

              <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.7' }}>
                {language === 'bn'
                  ? 'টাইপ করতে অসুবিধা হলেও সহজে মুখে কথা বলে স্বাস্থ্য পরামর্শ নিন। শিশুর সঠিক যত্ন, ওষুধের নিরাপত্তা তথ্য এবং নিজস্ব হেলথ স্কোর জানুন এক জায়গায়।'
                  : 'SYNORA makes digital health simple for everyone. Speak naturally with voice input, access age-specific child care, verify medicine safety, and track your daily wellness.'}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <Link to="/ai-health" className="btn btn-primary btn-lg">
                  <Mic size={20} />
                  <span>{t('askAi')}</span>
                  <ArrowRight size={18} />
                </Link>

                <Link to="/medicine" className="btn btn-secondary btn-lg">
                  <Pill size={20} color="var(--brand-primary)" />
                  <span>{t('exploreTools')}</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={18} color="var(--brand-primary)" />
                  <span>Medical Guardrails</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mic size={18} color="var(--brand-primary)" />
                  <span>Voice-First Accessible</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={18} color="var(--brand-primary)" />
                  <span>Bangla & English</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Showcase Card */}
            <div className="hero-showcase-wrapper">
              <div className="card card-glass hero-ai-showcase-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div className="showcase-bot-icon">
                      <Bot size={24} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>SYNORA AI Assistant</h4>
                      <span className="showcase-status-indicator">
                        <span className="status-pulse-dot"></span>
                        {language === 'bn' ? 'অনলাইন ও সক্রিয়' : 'Online & Ready to Help'}
                      </span>
                    </div>
                  </div>
                  <span className="badge badge-teal showcase-badge">
                    <Sparkles size={12} /> {language === 'bn' ? 'ভয়েস ও টেক্সট' : 'Voice & Text'}
                  </span>
                </div>

                {/* Simulated Conversation Bubble */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="showcase-user-bubble">
                    {language === 'bn'
                      ? 'আমার সর্দি লেগেছে এবং হালকা গলা ব্যথা করছে, কী করা উচিত?'
                      : 'I have a mild fever and cold. What home care steps should I follow?'}
                  </div>

                  <div className="showcase-ai-bubble">
                    {language === 'bn' ? (
                      <div>
                        <strong>সিনোরা এআই পরামর্শ:</strong> প্রচুর কুসুম গরম পানি ও আদা চা পান করুন, গরম পানির ভাপ নিন এবং বিশ্রাম দিন। প্রয়োজনে প্যারাসিটামল (ভরা পেটে) নেওয়া যেতে পারে। ৩ দিনের বেশি থাকলে ডাক্তার দেখান।
                      </div>
                    ) : (
                      <div>
                        <strong>SYNORA AI Guidance:</strong> Stay well hydrated with warm ginger tea, try steam inhalation twice daily, and rest. Over-the-counter paracetamol can be used for fever. If fever persists &gt; 3 days, see a physician.
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Try AI Input */}
                <form onSubmit={handleSearchSubmit} className="showcase-search-form">
                  <input
                    type="text"
                    className="form-input showcase-input"
                    placeholder={
                      language === 'bn'
                        ? 'ওষুধ বা স্বাস্থ্য বিষয় লিখে খুঁজুন...'
                        : 'Search any medicine or healthcare query...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary showcase-search-btn" title="Search Consultation">
                    <Search size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Healthcare Tools Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {language === 'bn' ? 'সিনোরা আপনাকে যেভাবে সহায়তা করে' : 'Everything You Need for Everyday Health'}
            </h2>
            <p className="section-desc">
              {language === 'bn'
                ? 'জটিল মেডিকেল ফর্ম নয়, সাধারণ মানুষের ব্যবহার উপযোগী পরিষ্কার ও সহজ সেবা।'
                : 'Accessible digital healthcare modules built to empower you and your family with clarity and safety.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(1rem, 2.5vw, 1.5rem)',
            }}
          >
            {quickTools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={idx}
                  to={tool.link}
                  className="card card-hover"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--brand-primary-light)',
                          color: 'var(--brand-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={24} />
                      </div>
                      <span
                        className="badge"
                        style={{
                          background: `${tool.badgeColor}15`,
                          color: tool.badgeColor,
                          border: `1px solid ${tool.badgeColor}30`,
                        }}
                      >
                        {tool.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{tool.title}</h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {tool.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: 'var(--brand-primary)',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      marginTop: '1.5rem',
                    }}
                  >
                    <span>{language === 'bn' ? 'টুলটি ব্যবহার করুন' : 'Open Tool'}</span>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Baby Care Highlight Section */}
      <section className="section">
        <div className="container">
          <div
            className="card card-glass"
            style={{
              padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--brand-primary-light) 100%)',
              borderColor: 'rgba(0, 168, 150, 0.3)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                alignItems: 'center',
              }}
            >
              <div>
                <span className="badge badge-teal" style={{ marginBottom: '0.75rem' }}>
                  {language === 'bn' ? 'বেবি কেয়ার হাব' : 'Baby Care Hub (1m - 10y)'}
                </span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '1rem' }}>
                  {language === 'bn' ? 'আপনার শিশুর বেড়ে ওঠা হোক নিরাপদ ও সঠিক' : 'Comprehensive Age-Specific Baby & Child Guidance'}
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
                  {language === 'bn'
                    ? 'নবজাতকের বুকের দুধের নিয়ম থেকে শুরু করে প্রথম সলিড খাবার, টিকা সূচি, মাইলস্টোন ও বিপদ চিহ্ন—সব তথ্য সংরক্ষিত বয়স অনুযায়ী।'
                    : 'From exclusive breastfeeding in month 1 to toddler solids, vaccination charts, speech milestones, and emergency red flags, get organized pediatrician-reviewed advice.'}
                </p>

                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                  <span className="badge" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                    🍼 Feeding & Weaning
                  </span>
                  <span className="badge" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                    💉 EPI Vaccine Schedule
                  </span>
                  <span className="badge" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                    ⚠️ Red Flag Alerts
                  </span>
                </div>

                <Link to="/baby-care" className="btn btn-primary">
                  <Baby size={18} />
                  <span>{language === 'bn' ? 'বেবি কেয়ার গাইড দেখুন' : 'Explore Baby Care Guide'}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Age Pills Preview */}
              <div className="card" style={{ padding: 'clamp(1rem, 2vw, 1.5rem)', background: 'var(--bg-card)' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1.05rem' }}>
                  {language === 'bn' ? 'বয়সভিত্তিক দ্রুত লিংক' : 'Select Child Age:'}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))', gap: '0.6rem' }}>
                  {babyCare.slice(0, 8).map((item) => (
                    <Link
                      key={item.ageId}
                      to={`/baby-care?age=${item.ageId}`}
                      className="btn btn-secondary btn-sm"
                      style={{ justifyContent: 'flex-start', fontSize: '0.85rem' }}
                    >
                      <Baby size={14} color="var(--brand-primary)" />
                      <span>{item.ageLabel}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Tips Section */}
      <section id="tips-section" className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {language === 'bn' ? 'সুস্থ জীবনের জন্য সহজ স্বাস্থ্য টিপস' : 'Evidence-Informed Everyday Wellness'}
            </h2>
            <p className="section-desc">
              {language === 'bn'
                ? 'সুস্থ থাকতে প্রতিদিনের ছোট ছোট অভ্যাস কীভাবে বড় ভূমিকা রাখে জেনে নিন।'
                : 'Simple, practical health guidance curated to improve everyday vitality and prevent chronic conditions.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(1rem, 2.5vw, 1.5rem)',
            }}
          >
            {healthTips.slice(0, 6).map((tip) => (
              <div key={tip.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', padding: 'clamp(1.25rem, 2.5vw, 1.5rem)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-teal">{tip.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tip.readTime || '3 min'}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{tip.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1 }}>
                  {tip.description}
                </p>
                <div
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  <strong>Tip:</strong> {tip.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SYNORA Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {language === 'bn' ? 'সাধারণ মানুষের জন্য বিশেষভাবে নির্মিত' : 'Built for Everyone — Simple, Safe & Trustworthy'}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 'clamp(1rem, 2vw, 1.5rem)' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--brand-primary-light)',
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Mic size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>
                {language === 'bn' ? 'ভয়েস ইনপুট ও সহজ ব্যবহার' : 'Voice-First Accessibility'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {language === 'bn'
                  ? 'টাইপ করতে না জানলেও শুধু মাইক্রোফোন চেপে কথা বললেই প্রশ্ন এআই সিস্টেমে চলে যাবে।'
                  : 'Designed specifically for users who may have difficulty typing. Speak naturally with real-time speech-to-text.'}
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--brand-blue-light)',
                  color: 'var(--brand-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>
                {language === 'bn' ? 'চিকিৎসা নিরাপত্তা ও সতর্কতা' : 'Clinical Safety Guardrails'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {language === 'bn'
                  ? 'কোনো বিপজ্জনক মনগড়া প্রেসক্রিপশন নয়। জরুরি লক্ষণ চিহ্নিত করে সঠিক হাসপাতালে যাওয়ার পরামর্শ প্রদান।'
                  : 'We never fabricate dosages or pretend to diagnose. Serious symptoms immediately trigger urgent emergency guidance.'}
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--status-success-bg)',
                  color: 'var(--status-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <UserCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>
                {language === 'bn' ? 'ব্যক্তিগত স্বাস্থ্য সুরক্ষা' : 'Privacy-First Architecture'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {language === 'bn'
                  ? 'আপনার স্বাস্থ্য সংক্রান্ত ব্যক্তিগত তথ্য সুরক্ষিত থাকে এবং অন্য কারো সাথে শেয়ার করা হয় না।'
                  : 'Your health records and consultations are strictly private, secured by role-based access control.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency CTA Banner */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, var(--brand-navy) 0%, #1e3a8a 100%)',
              color: '#ffffff',
              padding: '2.5rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <h3 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {language === 'bn' ? 'জরুরি চিকিৎসা সহায়তা প্রয়োজন?' : 'Need Urgent Medical Advice or Emergency Care?'}
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', maxWidth: '600px' }}>
                {language === 'bn'
                  ? 'তীব্র বুকে ব্যথা, শ্বাসকষ্ট বা মারাত্মক রক্তপাতের মতো পরিস্থিতিতে দেরি না করে তাৎক্ষণিক জরুরি হেল্পলাইনে কল করুন।'
                  : 'For acute emergencies such as chest crushing pain, breathing difficulty, or trauma, contact emergency services immediately.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="tel:999" className="btn btn-danger btn-lg">
                <Phone size={20} />
                <span>Call Emergency (999)</span>
              </a>
              <Link to="/contact" className="btn btn-secondary btn-lg" style={{ background: '#ffffff', color: 'var(--brand-navy)' }}>
                <span>{t('navContact')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
