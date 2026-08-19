import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Activity,
  Heart,
  Baby,
  Bot,
  Shield,
  Save,
  Check,
  Upload,
  Camera,
  Moon,
  Sun,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  FileText,
  ScanLine,
  Stethoscope,
  Pill,
  Calendar,
  Clock,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHealthData } from '../context/HealthDataContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { calculateBMI, evaluateBloodPressure } from '../services/healthRatingService';
import { PrescriptionDetailModal } from '../components/PrescriptionDetailModal';

export const Profile = () => {
  const { currentUser, updateProfileData, isAdmin } = useAuth();
  const {
    healthProfile,
    updateHealthProfile,
    babyProfiles,
    deleteBabyProfile,
    aiChats,
    deleteAiConversation,
    prescriptions,
    deletePrescription,
    getUserPrescriptions,
  } = useHealthData();
  const { theme, toggleTheme } = useTheme();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState('health'); // health, personal, babies, aichats, prescriptions
  const [formData, setFormData] = useState({ ...healthProfile });
  const [personalName, setPersonalName] = useState(currentUser?.displayName || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.photoURL || '');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const userPrescriptions = getUserPrescriptions(currentUser?.uid);

  // Live calculations
  const liveBmi = calculateBMI(formData.weightKg, formData.heightCm);
  const liveBp = evaluateBloodPressure(formData.bpSystolic, formData.bpDiastolic);

  const handleHealthFormSubmit = (e) => {
    e.preventDefault();
    updateHealthProfile(formData);
    setSaveSuccessMessage('Health profile updated successfully! Your SYNORA Wellness Score has been recalculated.');
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const handlePersonalUpdate = (e) => {
    e.preventDefault();
    updateProfileData({
      displayName: personalName,
      photoURL: avatarUrl,
    });
    setSaveSuccessMessage('Personal profile details updated.');
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Profile Banner */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--brand-primary-light) 100%)',
            borderColor: 'rgba(0, 168, 150, 0.3)',
            padding: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.displayName || 'User'}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--brand-primary)',
                  boxShadow: 'var(--shadow-md)',
                }}
              />
              <label
                htmlFor="avatar-upload"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: 'var(--brand-primary)',
                  color: '#ffffff',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
                title="Change Avatar"
              >
                <Camera size={14} />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.6rem', margin: 0, fontWeight: '700' }}>
                  {currentUser?.displayName || 'User Profile'}
                </h1>
                <span
                  className="badge"
                  style={{
                    background: isAdmin ? 'rgba(30, 144, 255, 0.12)' : 'var(--brand-primary-light)',
                    color: isAdmin ? 'var(--brand-blue)' : 'var(--brand-primary)',
                    fontWeight: '700',
                    fontSize: '0.78rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    border: isAdmin ? '1px solid rgba(30, 144, 255, 0.25)' : '1px solid rgba(0, 168, 150, 0.25)',
                  }}
                >
                  {isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {currentUser?.email}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={toggleTheme} title="Cycle Light, Dark & Aurora Theme">
              {theme === 'light' ? (
                <>
                  <Moon size={16} />
                  <span>{language === 'bn' ? 'ডার্ক মোড' : 'Dark Theme'}</span>
                </>
              ) : theme === 'dark' ? (
                <>
                  <Sparkles size={16} color="#00f5d4" />
                  <span>{language === 'bn' ? 'অরোরা মোড' : 'Aurora Theme'}</span>
                </>
              ) : (
                <>
                  <Sun size={16} color="#f59e0b" />
                  <span>{language === 'bn' ? 'লাইট মোড' : 'Light Theme'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccessMessage && (
          <div
            className="badge badge-success"
            style={{
              width: '100%',
              padding: '0.9rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.92rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Check size={18} />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div
          className="profile-tabs-scroll"
          style={{
            display: 'flex',
            gap: '0.45rem',
            overflowX: 'auto',
            borderBottom: '1.5px solid var(--border-subtle)',
            paddingBottom: '0.35rem',
            marginBottom: '2rem',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'health' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('health')}
            style={{ flexShrink: 0 }}
          >
            <Activity size={16} />
            <span>My Health Information</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'personal' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('personal')}
            style={{ flexShrink: 0 }}
          >
            <User size={16} />
            <span>Personal Details</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'babies' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('babies')}
            style={{ flexShrink: 0 }}
          >
            <Baby size={16} />
            <span>My Children ({babyProfiles.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'prescriptions' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('prescriptions')}
            style={{ flexShrink: 0 }}
          >
            <FileText size={16} />
            <span>
              {language === 'bn'
                ? `প্রেসক্রিপশন ইতিহাস (${userPrescriptions.length})`
                : `Prescription History (${userPrescriptions.length})`}
            </span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'aichats' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('aichats')}
            style={{ flexShrink: 0 }}
          >
            <Bot size={16} />
            <span>AI Consultations ({aiChats.length})</span>
          </button>
        </div>

        {/* Tab 1: Health Information Form */}
        {activeTab === 'health' && (
          <form onSubmit={handleHealthFormSubmit} className="card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', margin: 0 }}>My Health Biometrics & Vitals</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  This information powers your personalized SYNORA Wellness Score and AI recommendations.
                </p>
              </div>

              {/* Real-time Indicator Badges */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {liveBmi && (
                  <span className="badge" style={{ background: `${liveBmi.badgeColor}20`, color: liveBmi.badgeColor }}>
                    BMI: {liveBmi.value} ({liveBmi.category})
                  </span>
                )}
                {liveBp && (
                  <span className="badge" style={{ background: `${liveBp.color}20`, color: liveBp.color }}>
                    BP: {liveBp.category}
                  </span>
                )}
              </div>
            </div>

            {/* Section A: Basic Vitals */}
            <h4 style={{ color: 'var(--brand-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
              1. Biometrics & Core Vitals
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div className="form-group">
                <label className="form-label">Age (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="120"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || '' })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 172"
                  value={formData.heightCm || ''}
                  onChange={(e) => setFormData({ ...formData, heightCm: parseFloat(e.target.value) || '' })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  placeholder="e.g. 68"
                  value={formData.weightKg || ''}
                  onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || '' })}
                />
              </div>
            </div>

            {/* Section B: Cardiovascular & Sugar */}
            <h4 style={{ color: 'var(--brand-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
              2. Blood Pressure & Metabolic Status
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div className="form-group">
                <label className="form-label">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 120"
                  value={formData.bpSystolic || ''}
                  onChange={(e) => setFormData({ ...formData, bpSystolic: parseInt(e.target.value, 10) || '' })}
                />
                <span className="form-hint">Upper number (Standard &lt; 120)</span>
              </div>

              <div className="form-group">
                <label className="form-label">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 80"
                  value={formData.bpDiastolic || ''}
                  onChange={(e) => setFormData({ ...formData, bpDiastolic: parseInt(e.target.value, 10) || '' })}
                />
                <span className="form-hint">Lower number (Standard &lt; 80)</span>
              </div>

              <div className="form-group">
                <label className="form-label">Fasting Sugar (mmol/L)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="e.g. 5.5"
                  value={formData.fastingSugar || ''}
                  onChange={(e) => setFormData({ ...formData, fastingSugar: parseFloat(e.target.value) || '' })}
                />
                <span className="form-hint">Normal: 4.0 – 6.0</span>
              </div>

              <div className="form-group">
                <label className="form-label">Diabetes Status</label>
                <select
                  className="form-select"
                  value={formData.diabetesStatus}
                  onChange={(e) => setFormData({ ...formData, diabetesStatus: e.target.value })}
                >
                  <option value="no">Non-Diabetic</option>
                  <option value="pre">Pre-Diabetic</option>
                  <option value="type2">Type 2 Diabetes</option>
                  <option value="type1">Type 1 Diabetes</option>
                </select>
              </div>
            </div>

            {/* Section C: Lifestyle & Daily Habits */}
            <h4 style={{ color: 'var(--brand-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
              3. Lifestyle, Sleep & Hydration
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div className="form-group">
                <label className="form-label">Daily Physical Activity</label>
                <select
                  className="form-select"
                  value={formData.dailyActivity}
                  onChange={(e) => setFormData({ ...formData, dailyActivity: e.target.value })}
                >
                  <option value="sedentary">Sedentary (Mostly sitting, desk job)</option>
                  <option value="moderate">Moderate (30 min walk / exercise)</option>
                  <option value="active">Active (Intense workout / physical work)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Average Sleep (Hours/Night)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={formData.sleepHours || ''}
                  onChange={(e) => setFormData({ ...formData, sleepHours: parseFloat(e.target.value) || '' })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Daily Water Intake (Liters)</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={formData.waterLiters || ''}
                  onChange={(e) => setFormData({ ...formData, waterLiters: parseFloat(e.target.value) || '' })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Smoking / Tobacco Use</label>
                <select
                  className="form-select"
                  value={formData.smoking}
                  onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                >
                  <option value="no">Non-Smoker</option>
                  <option value="occasional">Occasional</option>
                  <option value="yes">Daily Smoker</option>
                </select>
              </div>
            </div>

            {/* Section D: Allergies & Medications */}
            <h4 style={{ color: 'var(--brand-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
              4. Allergies & Current Medications
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Known Allergies (Comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dust, Penicillin, Peanuts"
                  value={(formData.allergies || []).join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allergies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Medications (Comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Omeprazole 20mg, Amlodipine 5mg"
                  value={(formData.currentMedications || []).join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentMedications: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary btn-lg">
                <Save size={18} />
                <span>Save Health Information</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Personal Details */}
        {activeTab === 'personal' && (
          <form onSubmit={handlePersonalUpdate} className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Personal Profile Information</h3>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={personalName}
                onChange={(e) => setPersonalName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                disabled
                value={currentUser?.email || ''}
                style={{ opacity: 0.7 }}
              />
              <span className="form-hint">Email is linked to authentication.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Avatar Image URL (or upload above)</label>
              <input
                type="text"
                className="form-input"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="card" style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--bg-tertiary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{language === 'bn' ? 'থিম ও প্রদর্শন' : 'Theme & Display'}</h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {language === 'bn'
                      ? '৩টি থিম মোড: লাইট (হোয়াইট), ডার্ক ও অরোরা সাইবার'
                      : '3-State Theme System: Light (White), Dark & Cyber Aurora'}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={toggleTheme}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  {theme === 'light' ? (
                    <>
                      <Moon size={16} />
                      <span>{language === 'bn' ? 'ডার্ক মোড' : 'Dark Mode'}</span>
                    </>
                  ) : theme === 'dark' ? (
                    <>
                      <Sparkles size={16} color="#00f5d4" />
                      <span>{language === 'bn' ? 'অরোরা সাইবার' : 'Aurora Cyber'}</span>
                    </>
                  ) : (
                    <>
                      <Sun size={16} color="#f59e0b" />
                      <span>{language === 'bn' ? 'লাইট মোড' : 'Light Mode'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Update Personal Details
            </button>
          </form>
        )}

        {/* Tab 3: Baby Profiles Manager */}
        {activeTab === 'babies' && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Registered Children Profiles</h3>
            </div>

            {babyProfiles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No child profiles saved yet. Add a child from the Baby Care section.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem' }}>
                {babyProfiles.map((baby) => (
                  <div key={baby.id} className="card" style={{ background: 'var(--bg-tertiary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className="badge badge-teal">{baby.ageLabel || baby.ageId}</span>
                      <button
                        type="button"
                        className="btn-ghost btn-icon"
                        onClick={() => deleteBabyProfile(baby.id)}
                        style={{ color: 'var(--status-danger)' }}
                        title="Delete Child Profile"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{baby.name}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Gender: <strong>{baby.gender}</strong>
                    </div>
                    {baby.weightKg && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Weight: {baby.weightKg} kg | Height: {baby.heightCm || '--'} cm
                      </div>
                    )}
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      Feeding: {baby.feedingType || 'General'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: AI Consultations */}
        {activeTab === 'aichats' && (
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Previous AI Healthcare Consultations</h3>

            {aiChats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No saved AI conversations yet. Use the AI Health assistant to begin.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {aiChats.map((chat) => (
                  <div
                    key={chat.id}
                    style={{
                      background: 'var(--bg-tertiary)',
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        "{chat.preview}..."
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Recorded on: {new Date(chat.timestamp).toLocaleString()} • {chat.messageCount || 2} messages
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--status-danger)' }}
                      onClick={() => deleteAiConversation(chat.id)}
                    >
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Prescription History */}
        {activeTab === 'prescriptions' && (
          <div className="card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '700' }}>
                  {language === 'bn' ? 'সংরক্ষিত প্রেসক্রিপশন ইতিহাস' : 'Scanned Prescription History'}
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  {language === 'bn'
                    ? 'আপনার ডিজিটালাইজড প্রেসক্রিপশন, ওষুধের তালিকা ও ডাক্তারের পরামর্শের নিরাপদ আর্কাইভ।'
                    : 'Personalized archive of extracted medications, dosages, and doctor advice.'}
                </p>
              </div>

              <Link
                to="/medicine"
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <ScanLine size={16} />
                <span>{language === 'bn' ? 'নতুন প্রেসক্রিপশন স্ক্যান' : 'Scan New Prescription'}</span>
              </Link>
            </div>

            {userPrescriptions.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3.5rem 1.5rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed var(--border-strong)',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--brand-primary-light)',
                    color: 'var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto',
                  }}
                >
                  <FileText size={28} />
                </div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>
                  {language === 'bn' ? 'কোনো সংরক্ষিত প্রেসক্রিপশন নেই' : 'No Prescriptions Scanned Yet'}
                </h4>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    maxWidth: '460px',
                    margin: '0 auto 1.5rem auto',
                    lineHeight: '1.6',
                  }}
                >
                  {language === 'bn'
                    ? 'ওষুধ পেজ থেকে ডাক্তারের প্রেসক্রিপশন স্ক্যান করে আপনার ওষুধের তালিকা, মাত্রা ও সেবন নিয়ম স্বয়ংক্রিয়ভাবে সংরক্ষণ করুন।'
                    : 'Use our AI Prescription Scanner on the Medicines page to extract and safely store your prescription data.'}
                </p>
                <Link to="/medicine" className="btn btn-primary btn-sm">
                  <ScanLine size={16} />
                  <span>{language === 'bn' ? 'ওষুধ পেজে যান ও স্ক্যান করুন' : 'Go to Medicine Page & Scan'}</span>
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                  gap: '1.25rem',
                }}
              >
                {userPrescriptions.map((rx, idx) => {
                  const medCount = rx.medicines?.length || 0;
                  const docName = rx.doctorInfo?.name && rx.doctorInfo.name !== 'Information could not be clearly detected'
                    ? rx.doctorInfo.name
                    : null;
                  const previewMeds = (rx.medicines || [])
                    .slice(0, 3)
                    .map((m) => m.name)
                    .filter((n) => n && n !== 'Information could not be clearly detected');

                  return (
                    <div
                      key={rx.id}
                      className="card"
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'var(--transition-normal)',
                      }}
                    >
                      <div>
                        {/* Top Header */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.75rem',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                          }}
                        >
                          <span
                            className="badge badge-teal"
                            style={{ fontWeight: '700', fontSize: '0.78rem' }}
                          >
                            Prescription #{String(userPrescriptions.length - idx).padStart(3, '0')}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {rx.scanDate} • {rx.scanTime}
                          </span>
                        </div>

                        {/* Doctor Info */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.6rem' }}>
                          <Stethoscope size={16} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div style={{ fontSize: '0.9rem' }}>
                            <strong>{docName || 'Registered Medical Practitioner'}</strong>
                            {rx.doctorInfo?.hospital && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {rx.doctorInfo.hospital}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Diagnosis / Summary */}
                        {rx.diagnosis && rx.diagnosis !== 'Not specified' && (
                          <div
                            style={{
                              fontSize: '0.84rem',
                              color: 'var(--text-secondary)',
                              marginBottom: '0.75rem',
                              lineHeight: '1.5',
                            }}
                          >
                            <span style={{ color: 'var(--text-muted)' }}>Condition: </span>
                            <strong>{rx.diagnosis}</strong>
                          </div>
                        )}

                        {/* Medicines Count & Chips */}
                        <div style={{ marginBottom: '1rem' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.84rem',
                              fontWeight: '600',
                              color: 'var(--brand-primary)',
                              marginBottom: '0.35rem',
                            }}
                          >
                            <Pill size={14} />
                            <span>
                              {language === 'bn'
                                ? `${medCount}টি ওষুধ নির্ধারিত`
                                : `${medCount} Prescribed Medicine${medCount > 1 ? 's' : ''}`}
                            </span>
                          </div>

                          {previewMeds.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                              {previewMeds.map((medName, i) => (
                                <span
                                  key={i}
                                  style={{
                                    fontSize: '0.75rem',
                                    background: 'var(--bg-card)',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-secondary)',
                                  }}
                                >
                                  {medName}
                                </span>
                              ))}
                              {medCount > 3 && (
                                <span
                                  style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    padding: '0.15rem 0.35rem',
                                  }}
                                >
                                  +{medCount - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid var(--border-subtle)',
                          marginTop: '0.5rem',
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setSelectedPrescription(rx)}
                          style={{ fontSize: '0.82rem' }}
                        >
                          <Eye size={14} />
                          <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                        </button>

                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--status-danger)', fontSize: '0.82rem' }}
                          onClick={() => {
                            if (window.confirm(language === 'bn' ? 'প্রেসক্রিপশনটি মুছে ফেলতে চান?' : 'Delete this prescription from your history?')) {
                              deletePrescription(rx.id);
                            }
                          }}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                          <span>{language === 'bn' ? 'মুছুন' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prescription Detail Modal */}
      <PrescriptionDetailModal
        prescription={selectedPrescription}
        isOpen={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
        onDelete={(id) => {
          deletePrescription(id);
          setSelectedPrescription(null);
        }}
      />
    </div>
  );
};
