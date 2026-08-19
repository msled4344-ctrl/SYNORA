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

const DEFAULT_PRESCRIPTIONS = [
  {
    id: 'rx-demo-001',
    userId: 'synora-user-01',
    prescriptionImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    patientInfo: {
      name: 'Rahim Ahmed',
      age: '28',
      gender: 'Male',
      prescriptionDate: '18 August 2026',
    },
    doctorInfo: {
      name: 'Dr. Sharmin Akter',
      qualification: 'MBBS, FCPS (Medicine)',
      specialization: 'Internal Medicine Specialist',
      hospital: 'Square Hospital, Dhaka',
      contact: '+880 1711-223344',
    },
    medicines: [
      {
        id: 'rx-med-1',
        name: 'Napa Extend 665mg',
        genericName: 'Paracetamol',
        strength: '665mg',
        form: 'Tablet',
        quantity: '10 Tablets',
        frequency: '1+0+1',
        timing: 'Morning & Night',
        duration: '5 Days',
        instructions: 'Take after meal for mild fever & body ache',
        mealInstruction: 'After Food',
      },
      {
        id: 'rx-med-2',
        name: 'Seclo 20mg',
        genericName: 'Omeprazole',
        strength: '20mg',
        form: 'Capsule',
        quantity: '14 Capsules',
        frequency: '1+0+1',
        timing: 'Morning & Evening',
        duration: '7 Days',
        instructions: 'Take 30 minutes before breakfast and dinner',
        mealInstruction: 'Before Food',
      },
      {
        id: 'rx-med-3',
        name: 'Alatrol 10mg',
        genericName: 'Cetirizine',
        strength: '10mg',
        form: 'Tablet',
        quantity: '7 Tablets',
        frequency: '0+0+1',
        timing: 'Night',
        duration: '7 Days',
        instructions: 'Take at bedtime for allergic runny nose',
        mealInstruction: 'After Food',
      },
      {
        id: 'rx-med-4',
        name: 'Monas 10mg',
        genericName: 'Montelukast',
        strength: '10mg',
        form: 'Tablet',
        quantity: '10 Tablets',
        frequency: '0+0+1',
        timing: 'Night',
        duration: '10 Days',
        instructions: 'Take at night for airway comfort',
        mealInstruction: 'After Food',
      }
    ],
    diagnosis: 'Acute Upper Respiratory Tract Congestion with Acidity',
    tests: ['Complete Blood Count (CBC)', 'Serum IgE'],
    doctorNotes: 'Drink plenty of warm water. Avoid cold drinks, ice, and dusty environments. Practice steam inhalation twice daily.',
    followUpDate: 'After 7 Days if symptoms persist',
    unclearItems: [],
    confidenceNotice: 'AI/OCR-generated interpretation. This is not a replacement for a doctor\'s advice. Always verify with original prescription.',
    scanDate: '19 August 2026',
    scanTime: '10:30 PM',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
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

  // 11. Prescriptions History (Isolated per User)
  const [prescriptions, setPrescriptions] = useState(() => {
    const saved = localStorage.getItem('synora_user_prescriptions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PRESCRIPTIONS;
      }
    }
    return DEFAULT_PRESCRIPTIONS;
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

  useEffect(() => {
    localStorage.setItem('synora_user_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

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

  // Prescription History Management (Isolated per User)
  const savePrescription = (prescriptionData, userId = 'synora-user-01') => {
    const now = new Date();
    const newPrescription = {
      id: `rx-${Date.now()}`,
      userId: userId || 'synora-user-01',
      prescriptionImage: prescriptionData.prescriptionImage || '',
      patientInfo: prescriptionData.patientInfo || {
        name: 'Information could not be clearly detected',
        age: '',
        gender: '',
        prescriptionDate: '',
      },
      doctorInfo: prescriptionData.doctorInfo || {
        name: 'Information could not be clearly detected',
        qualification: '',
        specialization: '',
        hospital: '',
        contact: '',
      },
      medicines: Array.isArray(prescriptionData.medicines) ? prescriptionData.medicines : [],
      diagnosis: prescriptionData.diagnosis || 'Not specified',
      tests: Array.isArray(prescriptionData.tests) ? prescriptionData.tests : [],
      doctorNotes: prescriptionData.doctorNotes || '',
      followUpDate: prescriptionData.followUpDate || '',
      unclearItems: Array.isArray(prescriptionData.unclearItems) ? prescriptionData.unclearItems : [],
      confidenceNotice: prescriptionData.confidenceNotice || 'AI/OCR-generated interpretation. This is not a replacement for a doctor\'s advice. Always verify with original prescription.',
      scanDate: prescriptionData.scanDate || now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      scanTime: prescriptionData.scanTime || now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setPrescriptions((prev) => [newPrescription, ...prev]);
    return newPrescription;
  };

  const deletePrescription = (id) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePrescription = (id, updatedData) => {
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updatedData, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const getPrescriptionById = (id) => {
    return prescriptions.find((p) => p.id === id) || null;
  };

  const getUserPrescriptions = (userId) => {
    if (!userId) return prescriptions;
    return prescriptions.filter((p) => p.userId === userId || !p.userId);
  };

  // Reset to initial Seed Data
  const resetAllDataToDefault = () => {
    setHealthTips(initialHealthTips);
    setBabyCare(initialBabyCare);
    setMedicines(initialMedicines);
    setHealthRatings(initialHealthRatings);
    setSiteSettings(initialSiteSettings);
    setPrescriptions(DEFAULT_PRESCRIPTIONS);
    localStorage.removeItem('synora_health_tips');
    localStorage.removeItem('synora_baby_care');
    localStorage.removeItem('synora_medicines');
    localStorage.removeItem('synora_health_ratings');
    localStorage.removeItem('synora_site_settings');
    localStorage.removeItem('synora_user_prescriptions');
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
        prescriptions,
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
        savePrescription,
        deletePrescription,
        updatePrescription,
        getPrescriptionById,
        getUserPrescriptions,
        setSiteSettings,
        resetAllDataToDefault,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => useContext(HealthDataContext);
