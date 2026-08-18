import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  TrendingUp,
  Calendar,
  HeartPulse,
  BellRing,
  ShieldAlert,
  Stethoscope,
  Lightbulb,
} from 'lucide-react';
import { HealthScoreGauge } from '../components/HealthScoreGauge';
import { computeSynoraHealthScore, matchRatingBracket } from '../services/healthRatingService';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';

export const HealthScore = () => {
  const { healthProfile, healthRatings, scoreHistory } = useHealthData();
  const { language, t } = useLanguage();

  const scoreResult = computeSynoraHealthScore(healthProfile);
  const matchedBracket = matchRatingBracket(scoreResult.score, healthRatings);

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <h1 className="section-title">
            {language === 'bn' ? 'আপনার সিনোরা হেলথ স্কোর ও পরামর্শ' : 'Your Personal SYNORA Health Status'}
          </h1>
          <p className="section-desc">
            {language === 'bn'
              ? 'আপনার রক্তচাপ, উচ্চতা-ওজন (BMI), ঘুম ও দৈনন্দিন অভ্যাসের ভিত্তিতে সাধারণ সুস্থতা স্কোর ও নিয়মিত স্বাস্থ্য নির্দেশনা।'
              : 'An informational wellness indicator calculated from your vitals, lifestyle metrics, and reported health history.'}
          </p>
        </div>

        {/* Informational Disclaimer Alert */}
        <div
          style={{
            background: 'var(--brand-primary-light)',
            border: '1px solid rgba(0, 168, 150, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}
        >
          <ShieldCheck size={22} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            <strong>Wellness Indicator Notice:</strong> The SYNORA Health Score is an educational lifestyle metric designed to encourage preventive care. It is <strong>NOT a clinical medical diagnosis</strong> or a guarantee of health status.
          </div>
        </div>

        {/* Main Grid: Left Gauge, Right Recommendations */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
            marginBottom: '3rem',
          }}
        >
          {/* Gauge Widget */}
          <div>
            <HealthScoreGauge
              score={scoreResult.score}
              breakdown={scoreResult.breakdown}
              bmi={scoreResult.bmi}
              bpStatus={scoreResult.bpStatus}
            />

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/profile" className="btn btn-outline btn-sm">
                Update Health Biometrics & Vitals
              </Link>
            </div>
          </div>

          {/* Actionable Recommendations & Admin Custom Messages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {(() => {
              const statusStr = (matchedBracket?.status || '').toLowerCase();
              const badgeColorStr = (matchedBracket?.badgeColor || '').toLowerCase();
              const isAlertCondition =
                scoreResult.score < 65 ||
                badgeColorStr.includes('ef4444') ||
                badgeColorStr.includes('f59e0b') ||
                badgeColorStr.includes('red') ||
                badgeColorStr.includes('orange') ||
                statusStr.includes('risk') ||
                statusStr.includes('attention') ||
                statusStr.includes('critical') ||
                statusStr.includes('needs');

              const isCritical =
                scoreResult.score < 45 ||
                badgeColorStr.includes('ef4444') ||
                statusStr.includes('critical') ||
                statusStr.includes('high risk');

              return (
                <div
                  className={`card health-rec-showcase ${
                    isAlertCondition
                      ? isCritical
                        ? 'health-rec-critical'
                        : 'health-rec-warning'
                      : 'health-rec-normal'
                  }`}
                >
                  {/* Top Status Header */}
                  <div className="health-rec-topbar">
                    {isAlertCondition ? (
                      <div className={`health-status-pill ${isCritical ? 'pill-critical' : 'pill-warning'}`}>
                        <span className="alert-pulse-dot"></span>
                        <AlertTriangle size={15} />
                        <span>
                          {isCritical
                            ? language === 'bn'
                              ? 'জরুরি স্বাস্থ্য ঝুঁকি সতর্কতা'
                              : 'CRITICAL HEALTH ALERT'
                            : language === 'bn'
                            ? 'স্বাস্থ্য পর্যবেক্ষণ ও সতর্কতা'
                            : 'HEALTH ATTENTION REQUIRED'}
                        </span>
                      </div>
                    ) : (
                      <div className="health-status-pill pill-normal">
                        <ShieldCheck size={15} />
                        <span>{language === 'bn' ? 'চমৎকার স্বাস্থ্য বজায় রয়েছে' : 'OPTIMAL HEALTH STATUS'}</span>
                      </div>
                    )}

                    <div className="health-bracket-meta">
                      <span className="health-score-indicator-badge">
                        {language === 'bn' ? 'স্কোর' : 'Score'}: <strong>{scoreResult.score}%</strong>
                      </span>
                      <span className="health-range-text">
                        {matchedBracket.status} ({matchedBracket.minScore}% - {matchedBracket.maxScore}%)
                      </span>
                    </div>
                  </div>

                  {/* Main Headline */}
                  <div className="health-rec-header-row">
                    <div className="health-rec-title-wrap">
                      {isAlertCondition ? (
                        <div className={`rec-icon-box ${isCritical ? 'rec-icon-critical' : 'rec-icon-warning'}`}>
                          <BellRing size={24} className="alert-bell-anim" />
                        </div>
                      ) : (
                        <div className="rec-icon-box rec-icon-normal">
                          <HeartPulse size={24} />
                        </div>
                      )}
                      <div>
                        <h3 className="health-rec-main-title">
                          {isAlertCondition
                            ? language === 'bn'
                              ? 'আপনার স্বাস্থ্য সংক্রান্ত জরুরি পরামর্শ ও করণীয়'
                              : 'Priority Health Action Plan & Guidance'
                            : language === 'bn'
                            ? 'ব্যক্তিগত সুস্থতা ও নিয়মিত স্বাস্থ্য গাইড'
                            : 'Personalized Health Recommendations'}
                        </h3>
                        <p className="health-rec-sub-desc">
                          {isAlertCondition
                            ? language === 'bn'
                              ? 'আপনার ভাইটাল ও জীবনযাপনের কিছু রিস্ক ফ্যাক্টর শনাক্ত হয়েছে — সুস্থ থাকতে নিচের পরামর্শগুলো গুরুত্ব সহকারে অনুসরণ করুন।'
                              : 'Elevated risk factors detected in your vitals or lifestyle habits. Follow these priority medical steps.'
                            : language === 'bn'
                            ? 'আপনার স্বাস্থ্য সূচক ইতিবাচক ধারায় রয়েছে — দীর্ঘমেয়াদী সুস্থতা ধরে রাখতে নিচের অভ্যাসগুলো বজায় রাখুন।'
                            : 'Your vitals and lifestyle habits are in a healthy range. Maintain your vitality with these steps.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Highlight Banner */}
                  <div className={`health-banner-box ${isAlertCondition ? (isCritical ? 'banner-critical' : 'banner-warning') : 'banner-normal'}`}>
                    <div className="banner-icon-wrap">
                      {isAlertCondition ? <ShieldAlert size={20} /> : <Sparkles size={20} />}
                    </div>
                    <div className="banner-content">
                      <strong className="banner-heading">
                        {isAlertCondition
                          ? language === 'bn'
                            ? 'ক্লিনিক্যাল বিশ্লেষণ ও সতর্কতা:'
                            : 'Clinical Health Observation:'
                          : language === 'bn'
                          ? 'সুস্থতার সার্বিক মূল্যায়ন:'
                          : 'Wellness Assessment:'}
                      </strong>
                      <span className="banner-message">{matchedBracket.message}</span>
                    </div>
                  </div>

                  {/* Interactive Actionable Steps List */}
                  <div className="health-steps-container">
                    <div className="steps-header-row">
                      <h4 className="steps-title">
                        {isAlertCondition
                          ? language === 'bn'
                            ? 'জরুরি করণীয় পদক্ষেপসমূহ:'
                            : 'Actionable Priority Steps:'
                          : language === 'bn'
                          ? 'দৈনন্দিন স্বাস্থ্য সুরক্ষার ধাপসমূহ:'
                          : 'Recommended Wellness Steps:'}
                      </h4>
                      <span className="steps-count-badge">
                        {(matchedBracket.recommendations || []).length} {language === 'bn' ? 'টি পদক্ষেপ' : 'Actions'}
                      </span>
                    </div>

                    <div className="steps-cards-list">
                      {(matchedBracket.recommendations || []).map((rec, idx) => (
                        <div
                          key={idx}
                          className={`health-action-step-card ${
                            isAlertCondition ? (isCritical ? 'step-critical' : 'step-warning') : 'step-normal'
                          }`}
                        >
                          <div className="step-number-col">
                            <span className="step-num-pill">
                              {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                            </span>
                          </div>
                          <div className="step-body-col">
                            <div className="step-tag-row">
                              <span className={`step-priority-pill ${isAlertCondition ? 'pill-alert-priority' : 'pill-normal-priority'}`}>
                                {isAlertCondition
                                  ? language === 'bn'
                                    ? `জরুরি ধাপ #${idx + 1}`
                                    : `Priority Step 0${idx + 1}`
                                  : language === 'bn'
                                  ? `স্বাস্থ্য অভ্যাস #${idx + 1}`
                                  : `Wellness Habit 0${idx + 1}`}
                              </span>
                            </div>
                            <p className="step-text-content">{rec}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Wellness Tip Box */}
                  {matchedBracket.tips && matchedBracket.tips.length > 0 && (
                    <div className={`health-daily-tip-box ${isAlertCondition ? 'tip-alert' : 'tip-normal'}`}>
                      <div className="tip-icon-wrap">
                        <Lightbulb size={18} />
                      </div>
                      <div className="tip-body">
                        <h4 className="tip-title">
                          {language === 'bn' ? 'আজকের বিশেষ স্বাস্থ্য পরামর্শ:' : 'Daily Wellness & Prevention Tip:'}
                        </h4>
                        <ul className="tip-bullet-list">
                          {matchedBracket.tips.map((t, idx) => (
                            <li key={idx}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Urgent Doctor / AI Guidance CTA Bar */}
                  {isAlertCondition ? (
                    <div className={`health-emergency-callout ${isCritical ? 'callout-critical' : 'callout-warning'}`}>
                      <div className="callout-left">
                        <div className="callout-icon">
                          <Stethoscope size={20} />
                        </div>
                        <div className="callout-text">
                          <strong>{language === 'bn' ? 'বিশেষ সতর্কতা:' : 'Medical Advisory:'}</strong>{' '}
                          {language === 'bn'
                            ? 'ঝুঁকি এড়াতে অবিলম্বে আপনার নিকটস্থ রেজিস্টার্ড চিকিৎসকের সাথে পরামর্শ করুন বা সিনোরা এআই-তে ভয়েস বা মেসেজ পাঠিয়ে বিস্তারিত গাইডেন্স নিন।'
                            : 'Schedule a consultation with a certified doctor to evaluate your vitals or consult SYNORA AI immediately.'}
                        </div>
                      </div>
                      <Link to="/ai-health" className="btn btn-primary btn-sm callout-action-btn">
                        <Sparkles size={14} /> {language === 'bn' ? 'এআই ডক্টরের পরামর্শ নিন' : 'Consult AI Doctor'}
                      </Link>
                    </div>
                  ) : (
                    <div className="health-emergency-callout callout-normal">
                      <div className="callout-left">
                        <div className="callout-icon">
                          <Sparkles size={20} />
                        </div>
                        <div className="callout-text">
                          <strong>{language === 'bn' ? 'সুস্থতা বজায় রাখুন:' : 'Keep Thriving:'}</strong>{' '}
                          {language === 'bn'
                            ? 'আপনার যেকোনো পুষ্টি, ফিটনেস বা স্বাস্থ্য প্রশ্ন থাকলে সিনোরা এআই হেলথ অ্যাসিস্ট্যান্টকে জিজ্ঞেস করুন।'
                            : 'Have questions about nutrition, workouts, or preventive wellness? Ask SYNORA AI anytime.'}
                        </div>
                      </div>
                      <Link to="/ai-health" className="btn btn-primary btn-sm callout-action-btn">
                        <Sparkles size={14} /> {language === 'bn' ? 'এআই হেলথ চ্যাট' : 'Chat with AI'}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Historical Score Progress Timeline */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={22} color="var(--brand-primary)" />
            <h3 style={{ margin: 0 }}>Health Score Progress Timeline</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
            {scoreHistory.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-tertiary)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <Calendar size={13} />
                  <span>{item.date}</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }}>
                  {item.score}%
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {item.note || 'Assessment Recorded'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
