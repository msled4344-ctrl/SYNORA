import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialHealthTips,
  initialBabyCare,
  initialMedicines,
  initialHealthRatings,
  initialSiteSettings,
  generalWeatherGuidelines,
  generalHealthRules,
  medicalDisclaimer,
} from '../../server/data/seedData.js';
import { computeSynoraHealthScore } from '../services/healthRatingService';

const HealthDataContext = createContext();

const DEFAULT_USER_HEALTH_PROFILE = {
  age: 28,
  gender: 'Male',
  heightCm: 172,
  weightKg: 68,
  bpSystolic: 120,
  bpDiastolic: 80,
  fastingSugar: 95,
  diabetesStatus: 'no',
  conditions: ['Mild Seasonal Allergy'],
  allergies: ['Dust', 'Pollen'],
  currentMedications: ['Cetirizine 10mg as needed'],
  dailyActivity: 'moderate', // sedentary, moderate, active
  sleepHours: 7.5,
  waterLiters: 2.5,
  smoking: 'no',
  lastUpdated: new Date().toISOString(),
};

const DEFAULT_BABY_PROFILES = [
  {
    id: 'baby-aryan-01',
    name: 'Aryan Ahmed',
    gender: 'Boy',
    ageId: '6m',
    ageLabel: '6 Months',
    birthDate: '2026-02-15',
    weightKg: 7.8,
    heightCm: 67,
    allergies: 'None',
    feedingType: 'Breastfeeding + Starting soft purées',
  },
  {
    id: 'baby-zara-02',
    name: 'Zara Ahmed',
    gender: 'Girl',
    ageId: '2y',
    ageLabel: '2 Years',
    birthDate: '2024-06-10',
    weightKg: 12.2,
    heightCm: 86,
    allergies: 'Peanuts (Mild)',
    feedingType: 'Family table diet',
  }
];

export const HealthDataProvider = ({ children }) => {
  // 1. Health Tips
  const [healthTips, setHealthTips] = useState(() => {
    const saved = localStorage.getItem('synora_health_tips');
    return saved ? JSON.parse(saved) : initialHealthTips;
  });

  // 2. Baby Care Age Brackets
  const [babyCare, setBabyCare] = useState(() => {
    const saved = localStorage.getItem('synora_baby_care');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length >= 14) return parsed;
    }
    return initialBabyCare;
  });

  // 3. Medicines Directory
  const [medicines, setMedicines] = useState(() => {
    const saved = localStorage.getItem('synora_medicines');
    return saved ? JSON.parse(saved) : initialMedicines;
  });

  // 4. Health Ratings Configuration
  const [healthRatings, setHealthRatings] = useState(() => {
    const saved = localStorage.getItem('synora_health_ratings');
    return saved ? JSON.parse(saved) : initialHealthRatings;
  });

  // 5. Site Settings
  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('synora_site_settings');
    return saved ? JSON.parse(saved) : initialSiteSettings;
  });

  // 6. Contact Inquiries
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('synora_contacts');
    return saved ? JSON.parse(saved) : [
      {
        id: 'contact-1',
        name: 'Fatima Begum',
        email: 'fatima.b@example.com',
        phone: '+880 1912-334455',
        subject: 'Baby vaccination inquiry for 6-month infant',
        message: 'Can I reschedule the PCV vaccine if my baby has a slight runny nose?',
        status: 'unread',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'contact-2',
        name: 'Tanvir Hossain',
        email: 'tanvir.h@example.com',
        phone: '+880 1715-998877',
        subject: 'Medicine information update request',
        message: 'Please add more detailed storage warnings for pediatric antibiotic suspensions.',
        status: 'resolved',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      }
    ];
  });

  // 7. User Health Profile
  const [healthProfile, setHealthProfile] = useState(() => {
    const saved = localStorage.getItem('synora_user_health_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER_HEALTH_PROFILE;
  });

  // 8. User Baby Profiles
  const [babyProfiles, setBabyProfiles] = useState(() => {
    const saved = localStorage.getItem('synora_user_baby_profiles');
    return saved ? JSON.parse(saved) : DEFAULT_BABY_PROFILES;
  });

  const [activeBabyId, setActiveBabyId] = useState(() => {
    return DEFAULT_BABY_PROFILES[0]?.id || null;
  });

  // 9. AI Conversations History
  const [aiChats, setAiChats] = useState(() => {
    const saved = localStorage.getItem('synora_ai_chats');
    return saved ? JSON.parse(saved) : [];
  });

  // 10. Health Score Historical Timeline
  const [scoreHistory, setScoreHistory] = useState(() => {
    const saved = localStorage.getItem('synora_score_history');
    if (saved) return JSON.parse(saved);
    // Initial timeline demo points
    return [
      { date: '2026-06-15', score: 72, note: 'Initial Assessment' },
      { date: '2026-07-20', score: 78, note: 'Increased daily water & walking' },
      { date: '2026-08-15', score: 86, note: 'Optimal BP and regular sleep' },
    ];
  });

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem('synora_health_tips', JSON.stringify(healthTips));
  }, [healthTips]);

  useEffect(() => {
    localStorage.setItem('synora_baby_care', JSON.stringify(babyCare));
  }, [babyCare]);

  useEffect(() => {
    localStorage.setItem('synora_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('synora_health_ratings', JSON.stringify(healthRatings));
  }, [healthRatings]);

  useEffect(() => {
    localStorage.setItem('synora_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('synora_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('synora_user_health_profile', JSON.stringify(healthProfile));
  }, [healthProfile]);

  useEffect(() => {
    localStorage.setItem('synora_user_baby_profiles', JSON.stringify(babyProfiles));
  }, [babyProfiles]);

  useEffect(() => {
    localStorage.setItem('synora_ai_chats', JSON.stringify(aiChats));
  }, [aiChats]);

  useEffect(() => {
    localStorage.setItem('synora_score_history', JSON.stringify(scoreHistory));
  }, [scoreHistory]);

  // Try fetching latest data from backend server if available
  useEffect(() => {
    const fetchRemoteData = async () => {
      try {
        const res = await fetch('/api/seed');
        if (res.ok) {
          const data = await res.json();
          if (data.healthTips && !localStorage.getItem('synora_health_tips')) setHealthTips(data.healthTips);
          if (data.babyCare && !localStorage.getItem('synora_baby_care')) setBabyCare(data.babyCare);
          if (data.medicines && !localStorage.getItem('synora_medicines')) setMedicines(data.medicines);
          if (data.healthRatings && !localStorage.getItem('synora_health_ratings')) setHealthRatings(data.healthRatings);
          if (data.siteSettings && !localStorage.getItem('synora_site_settings')) setSiteSettings(data.siteSettings);
        }
      } catch (err) {
        // Backend offline or local mode - using local seed data
      }
    };
    fetchRemoteData();
  }, []);

  // Update Health Profile
  const updateHealthProfile = (newProfile) => {
    const updated = {
      ...healthProfile,
      ...newProfile,
      lastUpdated: new Date().toISOString(),
    };
    setHealthProfile(updated);

    // Compute updated score and add to history
    const scoreResult = computeSynoraHealthScore(updated);
    const newHistoryEntry = {
      date: new Date().toISOString().split('T')[0],
      score: scoreResult.score,
      note: 'Profile Updated',
    };
    setScoreHistory((prev) => [newHistoryEntry, ...prev.slice(0, 9)]);
    return updated;
  };

  // Baby Profiles Management
  const addBabyProfile = (baby) => {
    const newBaby = {
      id: `baby-${Date.now()}`,
      ...baby,
    };
    setBabyProfiles((prev) => [...prev, newBaby]);
    setActiveBabyId(newBaby.id);
    return newBaby;
  };

  const updateBabyProfile = (id, data) => {
    setBabyProfiles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...data } : b))
    );
  };

  const deleteBabyProfile = (id) => {
    setBabyProfiles((prev) => prev.filter((b) => b.id !== id));
    if (activeBabyId === id) {
      const remaining = babyProfiles.filter((b) => b.id !== id);
      setActiveBabyId(remaining[0]?.id || null);
    }
  };

  // Health Tips Management (Admin)
  const addHealthTip = (tip) => {
    const newTip = { id: `tip-${Date.now()}`, updatedAt: new Date().toISOString(), ...tip };
    setHealthTips((prev) => [newTip, ...prev]);
    return newTip;
  };

  const updateHealthTip = (id, tip) => {
    setHealthTips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...tip, updatedAt: new Date().toISOString() } : t))
    );
  };

  const deleteHealthTip = (id) => {
    setHealthTips((prev) => prev.filter((t) => t.id !== id));
  };

  // Baby Care Content Management (Admin)
  const addBabyCareBracket = (bracket) => {
    const newBracket = { id: `baby-${Date.now()}`, updatedAt: new Date().toISOString(), ...bracket };
    setBabyCare((prev) => [...prev, newBracket]);
    return newBracket;
  };

  const updateBabyCareBracket = (id, bracket) => {
    setBabyCare((prev) =>
      prev.map((b) => (b.id === id || b.ageId === id ? { ...b, ...bracket, updatedAt: new Date().toISOString() } : b))
    );
  };

  const deleteBabyCareBracket = (id) => {
    setBabyCare((prev) => prev.filter((b) => b.id !== id && b.ageId !== id));
  };

  // Medicine Management (Admin)
  const addMedicine = (med) => {
    const newMed = { id: `med-${Date.now()}`, updatedAt: new Date().toISOString(), ...med };
    setMedicines((prev) => [newMed, ...prev]);
    return newMed;
  };

  const updateMedicine = (id, med) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...med, updatedAt: new Date().toISOString() } : m))
    );
  };

  const deleteMedicine = (id) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  // Health Rating Brackets Management (Admin)
  const updateHealthRatingBracket = (id, data) => {
    setHealthRatings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
  };

  // Contact Messages Management
  const submitContactMessage = async (msg) => {
    const newContact = {
      id: `contact-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
      ...msg,
    };
    setContacts((prev) => [newContact, ...prev]);

    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
    } catch (e) {
      // Offline mode fallback - already saved in local state
    }

    return newContact;
  };

  const updateContactStatus = (id, status) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const deleteContactMessage = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // AI Chat History Management
  const saveAiConversation = (conversation) => {
    const newChat = {
      id: `chat-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...conversation,
    };
    setAiChats((prev) => [newChat, ...prev]);
    return newChat;
  };

  const deleteAiConversation = (id) => {
    setAiChats((prev) => prev.filter((c) => c.id !== id));
  };

  const clearAllAiChats = () => {
    setAiChats([]);
  };

  // Reset to initial Seed Data
  const resetAllDataToDefault = () => {
    setHealthTips(initialHealthTips);
    setBabyCare(initialBabyCare);
    setMedicines(initialMedicines);
    setHealthRatings(initialHealthRatings);
    setSiteSettings(initialSiteSettings);
    localStorage.removeItem('synora_health_tips');
    localStorage.removeItem('synora_baby_care');
    localStorage.removeItem('synora_medicines');
    localStorage.removeItem('synora_health_ratings');
    localStorage.removeItem('synora_site_settings');
  };

  return (
    <HealthDataContext.Provider
      value={{
        healthTips,
        babyCare,
        medicines,
        healthRatings,
        siteSettings,
        contacts,
        healthProfile,
        babyProfiles,
        activeBabyId,
        setActiveBabyId,
        aiChats,
        scoreHistory,
        generalWeatherGuidelines,
        generalHealthRules,
        medicalDisclaimer,
        updateHealthProfile,
        addBabyProfile,
        updateBabyProfile,
        deleteBabyProfile,
        addHealthTip,
        updateHealthTip,
        deleteHealthTip,
        addBabyCareBracket,
        updateBabyCareBracket,
        deleteBabyCareBracket,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        updateHealthRatingBracket,
        submitContactMessage,
        updateContactStatus,
        deleteContactMessage,
        saveAiConversation,
        deleteAiConversation,
        clearAllAiChats,
        setSiteSettings,
        resetAllDataToDefault,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => useContext(HealthDataContext);
