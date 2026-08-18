import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    brandName: 'SYNORA',
    tagline: 'Your Simple AI Healthcare Companion',
    navHome: 'Home',
    navAi: 'Ask AI Doctor',
    navBaby: 'Baby Care',
    navMedicine: 'Medicines',
    navScore: 'Health Score',
    navContact: 'Contact',
    navProfile: 'My Health',
    navAdmin: 'Admin',
    login: 'Sign In',
    signup: 'Sign Up',
    logout: 'Log Out',
    askAi: 'Ask SYNORA AI',
    exploreTools: 'Explore Health Tools',
    emergencyCaution: 'Emergency Medical Hotline: Call 999 / 911 immediately in life-threatening situations.',
    voiceInput: 'Voice Input',
    listening: 'Listening... Speak clearly',
    speak: 'Tap to Speak',
    send: 'Send',
    searchMedicinePlaceholder: 'Search medicine by Brand or Generic name (e.g. Paracetamol, Napa, Omeprazole)...',
    babyAgeSelect: 'Select Baby Age',
    saveProfile: 'Save Health Profile',
    calculateScore: 'Calculate SYNORA Wellness Score',
    disclaimer: 'SYNORA is an informational digital healthcare assistant, not a replacement for a certified doctor. Always seek qualified medical advice for severe illnesses.',
  },
  bn: {
    brandName: 'সিনোরা (SYNORA)',
    tagline: 'আপনার সহজ এআই স্বাস্থ্য সহায়িকা',
    navHome: 'হোম',
    navAi: 'এআই ডাক্তার',
    navBaby: 'শিশু যত্ন',
    navMedicine: 'ওষুধ তথ্য',
    navScore: 'হেলথ স্কোর',
    navContact: 'যোগাযোগ',
    navProfile: 'আমার প্রোফাইল',
    navAdmin: 'অ্যাডমিন',
    login: 'লগইন',
    signup: 'সাইন আপ',
    logout: 'লগআউট',
    askAi: 'সিনোরা এআইকে জিজ্ঞাসা করুন',
    exploreTools: 'স্বাস্থ্য সেবা টুলস',
    emergencyCaution: 'জরুরি মেডিকেল হেল্পলাইন: যেকোনো আশঙ্কাজনক অবস্থায় অবিলম্বে ৯৯৯ অথবা ৯১১-এ কল করুন।',
    voiceInput: 'ভয়েস ইনপুট',
    listening: 'শুনছি... আপনার প্রশ্ন বলুন',
    speak: 'কথা বলতে চাপুন',
    send: 'পাঠান',
    searchMedicinePlaceholder: 'ওষুধ বা জেনেরিক নাম লিখে খুঁজুন (যেমন: Paracetamol, Napa, Seclo)...',
    babyAgeSelect: 'শিশুর বয়স নির্বাচন করুন',
    saveProfile: 'স্বাস্থ্য তথ্য সংরক্ষণ করুন',
    calculateScore: 'সিনোরা ওয়েলনেস স্কোর দেখুন',
    disclaimer: 'সিনোরা একটি স্বাস্থ্য তথ্য সহায়িকা এবং কোনো ডাক্তারের বিকল্প নয়। জরুরি বা জটিল স্বাস্থ্য সমস্যায় বিশেষজ্ঞ চিকিৎসকের পরামর্শ নিন।',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('synora_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('synora_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
