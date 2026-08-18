import React from 'react';
import { Activity, ShieldCheck, Heart, Zap, Sparkles } from 'lucide-react';
import { matchRatingBracket } from '../services/healthRatingService';
import { useHealthData } from '../context/HealthDataContext';

export const HealthScoreGauge = ({ score = 85, breakdown = {}, bmi = null, bpStatus = null }) => {
  const { healthRatings } = useHealthData();
  const bracket = matchRatingBracket(score, healthRatings);

  // SVG circular gauge calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="card card-hover" style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
        <Sparkles size={18} color="var(--brand-primary)" />
        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          SYNORA Wellness Index
        </span>
      </div>

      {/* Circular Gauge */}
      <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 1.5rem auto' }}>
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="var(--border-subtle)"
            strokeWidth="14"
          />
          {/* Animated fill circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke={bracket?.badgeColor || 'var(--brand-primary)'}
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease',
            }}
          />
        </svg>

        {/* Center score text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            {score}%
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500', marginTop: '4px' }}>
            Wellness Score
          </span>
        </div>
      </div>

      {/* Bracket Status Badge */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span
          className="badge"
          style={{
            background: `${bracket?.badgeColor || '#00A896'}18`,
            color: bracket?.badgeColor || '#00A896',
            border: `1.5px solid ${bracket?.badgeColor || '#00A896'}40`,
            fontSize: '0.9rem',
            padding: '0.4rem 1rem',
          }}
        >
          {bracket?.status || 'Good Health'}
        </span>
      </div>

      <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
        {bracket?.message || 'Based on your parameters, your indicators are recorded.'}
      </p>

      {/* Sub-Metric Cards: BMI & BP */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
            <Activity size={14} color="var(--brand-primary)" />
            <span>Body Mass Index (BMI)</span>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {bmi ? `${bmi.value} kg/m²` : '23.0 (Normal)'}
          </div>
          <div style={{ fontSize: '0.75rem', color: bmi?.badgeColor || 'var(--status-success)', fontWeight: '600' }}>
            {bmi ? bmi.category : 'Healthy Range'}
          </div>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
            <Heart size={14} color="var(--status-danger)" />
            <span>Blood Pressure</span>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {bpStatus ? bpStatus.category : '120/80 mmHg'}
          </div>
          <div style={{ fontSize: '0.75rem', color: bpStatus?.color || 'var(--status-success)', fontWeight: '600' }}>
            {bpStatus ? bpStatus.status.toUpperCase() : 'OPTIMAL'}
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: '500' }}>Vital Signs & Biometrics</span>
            <span style={{ fontWeight: '600' }}>{breakdown.vitals || 85}%</span>
          </div>
          <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${breakdown.vitals || 85}%`,
                height: '100%',
                background: 'var(--brand-primary)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.8s ease',
              }}
            ></div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: '500' }}>Daily Lifestyle & Sleep</span>
            <span style={{ fontWeight: '600' }}>{breakdown.lifestyle || 80}%</span>
          </div>
          <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${breakdown.lifestyle || 80}%`,
                height: '100%',
                background: 'var(--brand-blue)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.8s ease',
              }}
            ></div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: '500' }}>Chronic Health Stability</span>
            <span style={{ fontWeight: '600' }}>{breakdown.chronic || 90}%</span>
          </div>
          <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${breakdown.chronic || 90}%`,
                height: '100%',
                background: 'var(--status-success)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.8s ease',
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
