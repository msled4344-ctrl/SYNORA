import React from 'react';
import { NavLink } from 'react-router-dom';
import { HeartPulse, Bot, Baby, Pill, Activity, User, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Taskbar = () => {
  const { language, t } = useLanguage();

  const items = [
    { path: '/', label: t('navHome'), icon: HeartPulse, keyName: 'home' },
    {
      path: '/ai-health',
      label: language === 'bn' ? 'এআই ডাক্তার' : 'Ask AI',
      icon: Bot,
      isAi: true,
      keyName: 'ai',
    },
    { path: '/baby-care', label: t('navBaby'), icon: Baby, keyName: 'baby' },
    { path: '/medicine', label: t('navMedicine'), icon: Pill, keyName: 'medicine' },
    { path: '/health-score', label: t('navScore'), icon: Activity, keyName: 'score' },
    { path: '/profile', label: t('navProfile'), icon: User, keyName: 'profile' },
  ];

  return (
    <nav className="taskbar" aria-label="Interactive Quick Navigation">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `taskbar-item taskbar-item-${item.keyName} ${isActive ? 'active' : ''} ${
                item.isAi ? 'taskbar-item-ai' : ''
              }`
            }
          >
            <div className="taskbar-icon-wrap">
              <Icon size={19} />
              {item.isAi && <Sparkles size={11} className="taskbar-ai-sparkle" />}
            </div>
            <span className="taskbar-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
