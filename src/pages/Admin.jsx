import React, { useState } from 'react';
import {
  Shield,
  BarChart3,
  BookOpen,
  Baby,
  Pill,
  Activity,
  Mail,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Save,
  RotateCcw,
  Users,
  Search,
  Eye,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';

export const Admin = () => {
  const { currentUser, isAdmin } = useAuth();
  const {
    healthTips,
    addHealthTip,
    updateHealthTip,
    deleteHealthTip,
    babyCare,
    addBabyCareBracket,
    updateBabyCareBracket,
    deleteBabyCareBracket,
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    healthRatings,
    updateHealthRatingBracket,
    contacts,
    updateContactStatus,
    deleteContactMessage,
    siteSettings,
    setSiteSettings,
    resetAllDataToDefault,
  } = useHealthData();

  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState('overview'); // overview, tips, babycare, medicines, ratings, contacts, settings
  const [successNotice, setSuccessNotice] = useState(null);

  // Modals / Editors state
  const [editingTip, setEditingTip] = useState(null);
  const [editingBaby, setEditingBaby] = useState(null);
  const [editingMed, setEditingMed] = useState(null);
  const [settingsForm, setSettingsForm] = useState({ ...siteSettings });

  const triggerNotice = (msg) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  // Restrict Non-Admin Access
  if (!isAdmin) {
    return (
      <div className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <div className="card card-glass" style={{ padding: '3rem 2rem', borderRadius: 'var(--radius-2xl)', border: '1.5px solid rgba(239, 68, 68, 0.3)' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.12)',
                color: 'var(--status-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <Lock size={32} />
            </div>

            <div className="badge" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--status-danger)', marginBottom: '1rem', fontSize: '0.8rem', fontWeight: '700' }}>
              403 • ACCESS RESTRICTED
            </div>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>Administrator Clearance Required</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              The SYNORA Administration Panel is strictly restricted to authorized medical directors. Your account (<strong style={{ color: 'var(--text-primary)' }}>{currentUser?.email || 'Guest'}</strong>) does not have administrative access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Admin Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Healthcare Operations Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Logged in as: <strong>{currentUser?.displayName}</strong> ({currentUser?.email})
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (window.confirm('Reset all CMS content back to initial seed data?')) {
                  resetAllDataToDefault();
                  triggerNotice('Database reset to initial healthcare seed data.');
                }
              }}
            >
              <RotateCcw size={16} />
              <span>Reset Seed Data</span>
            </button>
          </div>
        </div>

        {/* Global Success Notification */}
        {successNotice && (
          <div className="badge badge-success" style={{ width: '100%', padding: '0.9rem 1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.92rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Admin Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            borderBottom: '1.5px solid var(--border-subtle)',
            paddingBottom: '0.25rem',
            marginBottom: '2rem',
          }}
        >
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={16} />
            <span>Overview & Stats</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'tips' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('tips')}
          >
            <BookOpen size={16} />
            <span>Health Tips ({healthTips.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'babycare' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('babycare')}
          >
            <Baby size={16} />
            <span>Baby Care ({babyCare.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'medicines' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('medicines')}
          >
            <Pill size={16} />
            <span>Medicines ({medicines.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'ratings' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('ratings')}
          >
            <Activity size={16} />
            <span>Rating Engine Rules</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'contacts' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('contacts')}
          >
            <Mail size={16} />
            <span>Inquiries ({contacts.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'settings' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={16} />
            <span>Site Hotlines</span>
          </button>
        </div>

        {/* 1. Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Total Consultations</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }}>
                  1,420
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--status-success)', marginTop: '0.2rem' }}>+18% this week</div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Baby Care Views</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--brand-teal)' }}>
                  865
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--status-success)', marginTop: '0.2rem' }}>Active 1m - 10y</div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Medicine Searches</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--brand-blue)' }}>
                  2,130
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--status-info)', marginTop: '0.2rem' }}>Verified directory</div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Pending Inquiries</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--status-warning)' }}>
                  {contacts.filter((c) => c.status === 'unread').length}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Inbox unread</div>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Platform Operational Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.92rem', marginBottom: '0.25rem' }}>AI Safety Filter</div>
                  <span className="badge badge-success">ACTIVE & ENFORCED</span>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.92rem', marginBottom: '0.25rem' }}>Voice Speech Engine</div>
                  <span className="badge badge-success">WEB SPEECH API LIVE</span>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.92rem', marginBottom: '0.25rem' }}>Emergency Red Flags</div>
                  <span className="badge badge-success">999 / 911 INTEGRATED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Health Tips Manager */}
        {activeTab === 'tips' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Health Tips Articles</h3>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setEditingTip({
                    title: '',
                    category: 'General',
                    description: '',
                    recommendation: '',
                    readTime: '3 min read',
                    status: 'published',
                  })
                }
              >
                <Plus size={16} />
                <span>Add Health Tip</span>
              </button>
            </div>

            {editingTip && (
              <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1.5px solid var(--brand-primary)' }}>
                <h4 style={{ marginBottom: '1rem' }}>{editingTip.id ? 'Edit Health Tip' : 'New Health Tip'}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Article Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingTip.title}
                      onChange={(e) => setEditingTip({ ...editingTip, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingTip.category}
                      onChange={(e) => setEditingTip({ ...editingTip, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={editingTip.description}
                    onChange={(e) => setEditingTip({ ...editingTip, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Actionable Recommendation</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingTip.recommendation}
                    onChange={(e) => setEditingTip({ ...editingTip, recommendation: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingTip(null)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      if (!editingTip.title) return;
                      if (editingTip.id) {
                        updateHealthTip(editingTip.id, editingTip);
                        triggerNotice('Health tip updated.');
                      } else {
                        addHealthTip(editingTip);
                        triggerNotice('Health tip created.');
                      }
                      setEditingTip(null);
                    }}
                  >
                    <Save size={16} /> Save Tip
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {healthTips.map((tip) => (
                <div key={tip.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="badge badge-teal">{tip.category}</span>
                      <span className="badge badge-info">{tip.status || 'published'}</span>
                    </div>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{tip.title}</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>{tip.description}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '1rem' }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingTip(tip)}>
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--status-danger)' }}
                      onClick={() => {
                        if (window.confirm('Delete this health tip?')) {
                          deleteHealthTip(tip.id);
                          triggerNotice('Health tip deleted.');
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Baby Care Manager */}
        {activeTab === 'babycare' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Baby Care Age Brackets</h3>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setEditingBaby({
                    ageId: 'new-age',
                    ageLabel: 'Age Label',
                    title: 'Growth & Care Title',
                    description: '',
                    nutrition: '',
                    sleep: '',
                    hygiene: '',
                    milestones: '',
                    vaccines: '',
                    safety: '',
                    warningSigns: '',
                    tips: '',
                  })
                }
              >
                <Plus size={16} />
                <span>Add Age Stage</span>
              </button>
            </div>

            {editingBaby && (
              <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1.5px solid var(--brand-primary)' }}>
                <h4 style={{ marginBottom: '1rem' }}>{editingBaby.id ? 'Edit Baby Care Stage' : 'New Age Stage'}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Age ID (e.g. 3m, 7m)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingBaby.ageId}
                      onChange={(e) => setEditingBaby({ ...editingBaby, ageId: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age Display Label</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingBaby.ageLabel}
                      onChange={(e) => setEditingBaby({ ...editingBaby, ageLabel: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Stage Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingBaby.title}
                    onChange={(e) => setEditingBaby({ ...editingBaby, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nutrition & Feeding Guidelines</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={editingBaby.nutrition}
                    onChange={(e) => setEditingBaby({ ...editingBaby, nutrition: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Vaccine Guidance</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingBaby.vaccines}
                    onChange={(e) => setEditingBaby({ ...editingBaby, vaccines: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Red Flag Symptoms</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={editingBaby.warningSigns}
                    onChange={(e) => setEditingBaby({ ...editingBaby, warningSigns: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingBaby(null)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      if (!editingBaby.ageId) return;
                      if (editingBaby.id) {
                        updateBabyCareBracket(editingBaby.id, editingBaby);
                        triggerNotice('Baby care stage updated.');
                      } else {
                        addBabyCareBracket(editingBaby);
                        triggerNotice('Baby care stage added.');
                      }
                      setEditingBaby(null);
                    }}
                  >
                    <Save size={16} /> Save Stage
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {babyCare.map((item) => (
                <div key={item.id || item.ageId} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                  <div>
                    <span className="badge badge-teal" style={{ marginBottom: '0.35rem' }}>{item.ageLabel}</span>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '700px' }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', marginLeft: '1rem' }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingBaby(item)}>
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--status-danger)' }}
                      onClick={() => {
                        if (window.confirm('Delete this age bracket?')) {
                          deleteBabyCareBracket(item.id || item.ageId);
                          triggerNotice('Age bracket deleted.');
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Medicines Manager */}
        {activeTab === 'medicines' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Verified Medicine Directory</h3>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setEditingMed({
                    name: '',
                    genericName: '',
                    therapeuticClass: '',
                    category: 'Fever & Pain',
                    purpose: '',
                    dosageGuidelines: '',
                    precautions: '',
                    sideEffects: '',
                    overdoseWarning: '',
                    storage: 'Store below 30°C.',
                    whenToSeeDoctor: 'If symptoms persist > 3 days.',
                    prescriptionRequired: false,
                    brandNames: [],
                  })
                }
              >
                <Plus size={16} />
                <span>Add Medicine Record</span>
              </button>
            </div>

            {editingMed && (
              <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1.5px solid var(--brand-primary)' }}>
                <h4 style={{ marginBottom: '1rem' }}>{editingMed.id ? 'Edit Medicine' : 'New Medicine'}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Medicine Brand/Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingMed.name}
                      onChange={(e) => setEditingMed({ ...editingMed, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Generic Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingMed.genericName}
                      onChange={(e) => setEditingMed({ ...editingMed, genericName: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingMed.category}
                      onChange={(e) => setEditingMed({ ...editingMed, category: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Therapeutic Class</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingMed.therapeuticClass}
                      onChange={(e) => setEditingMed({ ...editingMed, therapeuticClass: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Purpose / Uses</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={editingMed.purpose}
                    onChange={(e) => setEditingMed({ ...editingMed, purpose: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Dosage & Administration Guidelines</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={editingMed.dosageGuidelines}
                    onChange={(e) => setEditingMed({ ...editingMed, dosageGuidelines: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Precautions & Warnings</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingMed.precautions}
                    onChange={(e) => setEditingMed({ ...editingMed, precautions: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingMed(null)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      if (!editingMed.name) return;
                      if (editingMed.id) {
                        updateMedicine(editingMed.id, editingMed);
                        triggerNotice('Medicine record updated.');
                      } else {
                        addMedicine(editingMed);
                        triggerNotice('Medicine record added.');
                      }
                      setEditingMed(null);
                    }}
                  >
                    <Save size={16} /> Save Medicine
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {medicines.map((med) => (
                <div key={med.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem' }}>
                  <div>
                    <span className="badge badge-teal" style={{ marginBottom: '0.35rem' }}>{med.category}</span>
                    <h4 style={{ margin: '0 0 0.2rem 0' }}>{med.name}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{med.genericName}</p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>{med.purpose}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingMed(med)}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--status-danger)' }}
                      onClick={() => {
                        if (window.confirm(`Delete ${med.name}?`)) {
                          deleteMedicine(med.id);
                          triggerNotice('Medicine deleted.');
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Health Rating Rules */}
        {activeTab === 'ratings' && (
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>SYNORA Wellness Score Configuration Brackets</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Define the clinical messages, status badges, and recommendations shown to users in each score range.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {healthRatings.map((bracket) => (
                <div key={bracket.id} className="card" style={{ padding: '1.75rem', borderLeft: `5px solid ${bracket.badgeColor || 'var(--brand-primary)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className="badge" style={{ background: `${bracket.badgeColor}20`, color: bracket.badgeColor, fontSize: '0.9rem' }}>
                      Range: {bracket.minScore}% - {bracket.maxScore}% ({bracket.status})
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status Label</label>
                    <input
                      type="text"
                      className="form-input"
                      value={bracket.status}
                      onChange={(e) => updateHealthRatingBracket(bracket.id, { status: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Personalized Health Message</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={bracket.message}
                      onChange={(e) => updateHealthRatingBracket(bracket.id, { message: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Inquiries Manager */}
        {activeTab === 'contacts' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Patient & Public Inquiries</h3>

            {contacts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No contact submissions in inbox.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {contacts.map((c) => (
                  <div key={c.id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div>
                        <strong style={{ fontSize: '1.05rem' }}>{c.name}</strong> •{' '}
                        <a href={`mailto:${c.email}`} style={{ color: 'var(--brand-primary)' }}>{c.email}</a>
                        {c.phone && <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({c.phone})</span>}
                      </div>
                      <span className={`badge ${c.status === 'unread' ? 'badge-warning' : 'badge-success'}`}>
                        {c.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                      Subject: {c.subject}
                    </h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1rem', background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                      {c.message}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span>Submitted: {new Date(c.createdAt).toLocaleString()}</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {c.status === 'unread' ? (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              updateContactStatus(c.id, 'resolved');
                              triggerNotice('Marked inquiry as resolved.');
                            }}
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => updateContactStatus(c.id, 'unread')}
                          >
                            Mark Unread
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--status-danger)' }}
                          onClick={() => {
                            deleteContactMessage(c.id);
                            triggerNotice('Message deleted.');
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. Site Hotlines Settings */}
        {activeTab === 'settings' && (
          <div className="card" style={{ padding: '2rem', maxWidth: '700px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Global Emergency Hotlines & Contact Settings</h3>

            <div className="form-group">
              <label className="form-label">National Emergency Hotline</label>
              <input
                type="text"
                className="form-input"
                value={settingsForm.hotlines?.nationalEmergency || ''}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    hotlines: { ...settingsForm.hotlines, nationalEmergency: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">National Health Call Center</label>
              <input
                type="text"
                className="form-input"
                value={settingsForm.hotlines?.healthCallCenter || ''}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    hotlines: { ...settingsForm.hotlines, healthCallCenter: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Support Email</label>
              <input
                type="email"
                className="form-input"
                value={settingsForm.contact?.email || ''}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    contact: { ...settingsForm.contact, email: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">HQ Address</label>
              <input
                type="text"
                className="form-input"
                value={settingsForm.contact?.address || ''}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    contact: { ...settingsForm.contact, address: e.target.value },
                  })
                }
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setSiteSettings(settingsForm);
                triggerNotice('Site hotlines and settings updated.');
              }}
            >
              <Save size={18} /> Save Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
