import React from 'react';
import { Link } from 'react-router-dom';

export const SynoraLogoIcon = ({ size = 38, className = '' }) => {
  return (
    <div
      className={`logo-icon ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <linearGradient id="synoraLogoGrad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="45%" stopColor="#00A896" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="synoraPulseLineGrad" x1="10" y1="32" x2="54" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>
          <filter id="synoraLogoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Shield / Squircle Base */}
        <rect x="3" y="3" width="58" height="58" rx="16" fill="url(#synoraLogoGrad)" />
        
        {/* Subtle Glass Rim */}
        <rect x="4.5" y="4.5" width="55" height="55" rx="14.5" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.5" />

        {/* Medical Cross Ambient Background */}
        <path d="M32 15v34M15 32h34" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="5.5" strokeLinecap="round" />

        {/* Vital Heartbeat & ECG Pulse Line */}
        <path
          d="M12 32h10l3.5-9 6.5 18 5.5-12 3 3h11.5"
          stroke="url(#synoraPulseLineGrad)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#synoraLogoGlow)"
        />

        {/* AI Sparkle */}
        <path
          d="M47 13c0 3.5 2 5.5 5.5 5.5-3.5 0-5.5 2-5.5 5.5 0-3.5-2-5.5-5.5-5.5 3.5 0 5.5-2 5.5-5.5z"
          fill="#FFFFFF"
        />

        {/* Subtle Vital Node */}
        <circle cx="19" cy="46" r="2.2" fill="#FFFFFF" opacity="0.9" />
      </svg>
    </div>
  );
};

export const SynoraLogo = ({ size = 38, showText = true, asLink = true, to = '/', className = '' }) => {
  const content = (
    <>
      <SynoraLogoIcon size={size} />
      {showText && (
        <span className="logo-text">
          <span className="logo-text-syn">SYN</span>
          <span className="logo-text-accent">ORA</span>
          <span className="logo-ai-badge">AI</span>
        </span>
      )}
    </>
  );

  if (asLink) {
    return (
      <Link to={to} className={`logo ${className}`}>
        {content}
      </Link>
    );
  }

  return <div className={`logo ${className}`}>{content}</div>;
};

export default SynoraLogo;
