import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Camera,
  ScanLine,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileText,
  User,
  Stethoscope,
  Pill,
  Calendar,
  Clock,
  Save,
  RotateCcw,
  Edit3,
  Search,
  ExternalLink,
  Eye,
  Check,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';

export const PrescriptionScannerModal = ({ isOpen, onClose, onSearchMedicine }) => {
  const { currentUser } = useAuth();
  const { savePrescription } = useHealthData();
  const { language } = useLanguage();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isScanning) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isScanning]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isScanning) return;
    setImageFile(null);
    setImagePreview('');
    setIsScanning(false);
    setScanProgress(0);
    setScanStepText('');
    setExtractedData(null);
    setIsEditing(false);
    setEditableData(null);
    setErrorMessage('');
    setSaveSuccess(false);
    onClose();
  };

  const processFile = (file) => {
    setErrorMessage('');
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage(
        language === 'bn'
          ? 'অনুগ্রহ করে একটি বৈধ ইমেজ ফাইল নির্বাচন করুন (JPG, JPEG, PNG, WEBP)।'
          : 'Please select a valid image file (JPG, JPEG, PNG, WEBP).'
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(
        language === 'bn'
          ? 'ছবির আকার ১০ মেগাবাইটের (10MB) কম হতে হবে।'
          : 'Prescription image size must be under 10MB.'
      );
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setExtractedData(null);
      setSaveSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.style.borderColor = 'var(--brand-primary)';
      dropZoneRef.current.style.background = 'var(--brand-primary-light)';
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.style.borderColor = 'var(--border-subtle)';
      dropZoneRef.current.style.background = 'var(--bg-tertiary)';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.style.borderColor = 'var(--border-subtle)';
      dropZoneRef.current.style.background = 'var(--bg-tertiary)';
    }
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // Perform Gemini AI Multimodal OCR Scan
  const handleStartScan = async () => {
    if (!imagePreview) return;

    setIsScanning(true);
    setErrorMessage('');
    setScanProgress(15);
    setScanStepText(
      language === 'bn'
        ? 'প্রেসক্রিপশন ইমেজ বিশ্লেষণ করা হচ্ছে (Gemini AI)...'
        : 'Analyzing prescription with Gemini Multimodal AI...'
    );

    const progressTimer1 = setTimeout(() => {
      setScanProgress(45);
      setScanStepText(
        language === 'bn'
          ? 'ওষুধের নাম, শক্তি ও খাওয়ার নিয়ম শনাক্ত করা হচ্ছে...'
          : 'Extracting medicines, strengths, dosage & timings...'
      );
    }, 1800);

    const progressTimer2 = setTimeout(() => {
      setScanProgress(75);
      setScanStepText(
        language === 'bn'
          ? 'ডাক্তারের পরামর্শ ও প্রেসক্রিপশন সারাংশ প্রস্তুত করা হচ্ছে...'
          : 'Structuring doctor advice and clinical summary...'
      );
    }, 4000);

    try {
      const response = await fetch('/api/ai/scan-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imagePreview,
          mimeType: imageFile?.type || 'image/jpeg',
        }),
      });

      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setScanProgress(100);
        setScanStepText(
          language === 'bn' ? 'বিশ্লেষণ সম্পন্ন!' : 'Prescription analysis complete!'
        );
        setTimeout(() => {
          setExtractedData(result.data);
          setEditableData(JSON.parse(JSON.stringify(result.data)));
          setIsScanning(false);
        }, 500);
      } else {
        throw new Error(result.message || 'Failed to parse prescription data');
      }
    } catch (err) {
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      setIsScanning(false);
      setScanProgress(0);
      setErrorMessage(
        language === 'bn'
          ? 'প্রেসক্রিপশন স্ক্যান করতে সমস্যা হয়েছে। অনুগ্রহ করে একটি স্পষ্ট ছবি দিয়ে পুনরায় চেষ্টা করুন।'
          : 'Could not process the prescription image. Please ensure the photo is clear, well-lit, and try again.'
      );
    }
  };

  // Save to Profile
  const handleSaveToProfile = () => {
    const dataToSave = isEditing ? editableData : extractedData;
    if (!dataToSave) return;

    savePrescription(
      {
        ...dataToSave,
        prescriptionImage: imagePreview,
      },
      currentUser?.uid || 'synora-user-01'
    );

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 5000);
  };

  // Medicine Edit Handlers
  const handleMedicineChange = (idx, field, value) => {
    if (!editableData) return;
    const updatedMeds = [...editableData.medicines];
    updatedMeds[idx] = { ...updatedMeds[idx], [field]: value };
    setEditableData({ ...editableData, medicines: updatedMeds });
  };

  const handleAddMedicineRow = () => {
    if (!editableData) return;
    const newMed = {
      id: `med-${Date.now()}`,
      name: '',
      genericName: '',
      strength: '',
      form: 'Tablet',
      quantity: '',
      frequency: '1+0+1',
      timing: 'Morning & Night',
      duration: '5 Days',
      instructions: '',
      mealInstruction: 'After Food',
    };
    setEditableData({
      ...editableData,
      medicines: [...editableData.medicines, newMed],
    });
  };

  const handleDeleteMedicineRow = (idx) => {
    if (!editableData) return;
    const updatedMeds = editableData.medicines.filter((_, i) => i !== idx);
    setEditableData({ ...editableData, medicines: updatedMeds });
  };

  const currentViewData = isEditing ? editableData : extractedData;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(6, 11, 25, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.75rem, 2.5vw, 1.5rem)',
        overflowY: 'auto',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '900px',
          width: '100%',
          maxHeight: 'min(92dvh, 880px)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-glass)',
          padding: 0,
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--brand-primary-light) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--brand-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              <ScanLine size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '700' }}>
                  {language === 'bn' ? 'সিনোরা এআই প্রেসক্রিপশন স্ক্যানার' : 'SYNORA AI Prescription Scanner'}
                </h2>
                <span
                  className="badge"
                  style={{
                    background: 'rgba(0, 168, 150, 0.15)',
                    color: 'var(--brand-primary)',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                  }}
                >
                  Gemini OCR 2.5
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {language === 'bn'
                  ? 'ডাক্তারের প্রেসক্রিপশনের ছবি তুলে বা আপলোড করে স্বয়ংক্রিয় সারাংশ জানুন'
                  : 'Capture or upload prescription photo for AI clinical structure extraction'}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-ghost btn-icon"
            onClick={handleClose}
            aria-label="Close Scanner"
            disabled={isScanning}
            style={{ borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: 'clamp(1rem, 2.5vw, 1.75rem)', overflowY: 'auto', flex: 1 }}>
          {/* Error Banner */}
          {errorMessage && (
            <div
              className="badge badge-danger"
              style={{
                width: '100%',
                padding: '0.9rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                textAlign: 'left',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Save Banner */}
          {saveSuccess && (
            <div
              className="badge badge-success"
              style={{
                width: '100%',
                padding: '0.9rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>
                {language === 'bn'
                  ? 'প্রেসক্রিপশনটি সফলভাবে আপনার প্রোফাইলে সংরক্ষিত হয়েছে!'
                  : 'Prescription details saved successfully to your Profile History!'}
              </span>
            </div>
          )}

          {/* STEP 1: Upload or Capture (When no image is selected) */}
          {!imagePreview && !isScanning && (
            <div>
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: '2px dashed var(--border-strong)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  background: 'var(--bg-tertiary)',
                  transition: 'var(--transition-normal)',
                  cursor: 'pointer',
                  marginBottom: '1.5rem',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--brand-primary-light)',
                    color: 'var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto',
                  }}
                >
                  <Upload size={30} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>
                  {language === 'bn'
                    ? 'প্রেসক্রিপশনের ছবি এখানে ড্রপ করুন অথবা ব্রাউজ করুন'
                    : 'Drop your prescription image here, or browse device'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  {language === 'bn'
                    ? 'সমর্থিত ফরম্যাট: JPG, JPEG, PNG, WEBP (সর্বোচ্চ ১০ মেগাবাইট)'
                    : 'Supported formats: JPG, JPEG, PNG, WEBP (Max 10MB)'}
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} />
                    <span>{language === 'bn' ? 'ফাইল নির্বাচন করুন' : 'Select From Gallery'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <Camera size={16} />
                    <span>{language === 'bn' ? 'ক্যামেরা দিয়ে তুলুন' : 'Use Camera'}</span>
                  </button>
                </div>
              </div>

              {/* Hidden File Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {/* Guidelines Box */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  fontSize: '0.86rem',
                }}
              >
                <div style={{ fontWeight: '600', color: 'var(--brand-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={15} />
                  <span>{language === 'bn' ? 'ভালো ফলাফলের জন্য নির্দেশনা:' : 'Tips for Best OCR Accuracy:'}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  <li>{language === 'bn' ? 'প্রেসক্রিপশনটি সমান জায়গায় রেখে ওপর থেকে স্পষ্ট আলোতে ছবি তুলুন।' : 'Lay prescription flat under bright, even lighting.'}</li>
                  <li>{language === 'bn' ? 'ওষুধের নাম, ডোজ ও ডাক্তারের সিল যেন স্পষ্টভাবে বোঝা যায়।' : 'Ensure medicine names, dosages, and doctor notes are in clear focus.'}</li>
                  <li>{language === 'bn' ? 'ছবির কোনো অংশ কাটা বা ঝাপসা থাকলে পুনরায় তুলুন।' : 'Avoid glare, motion blur, or cut-off corners.'}</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 2: Preview & Scanning State */}
          {imagePreview && !extractedData && (
            <div>
              <div
                style={{
                  position: 'relative',
                  background: '#070c1a',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  maxHeight: '380px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <img
                  src={imagePreview}
                  alt="Prescription Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '380px',
                    objectFit: 'contain',
                    filter: isScanning ? 'brightness(0.7) blur(1px)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />

                {/* Laser scan animation overlay while scanning */}
                {isScanning && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0, 168, 150, 0.15)',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: `${scanProgress}%`,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent, #00f5d4, #00a896, transparent)',
                        boxShadow: '0 0 15px #00f5d4, 0 0 30px #00a896',
                        transition: 'top 0.4s ease-out',
                      }}
                    />
                    <div
                      className="card card-glass"
                      style={{
                        padding: '1.25rem 1.75rem',
                        textAlign: 'center',
                        maxWidth: '360px',
                        boxShadow: 'var(--shadow-xl)',
                        borderRadius: 'var(--radius-lg)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                        <div className="spinner" style={{ width: '22px', height: '22px', border: '3px solid rgba(0, 168, 150, 0.2)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        <span style={{ fontWeight: '700', color: 'var(--brand-primary)', fontSize: '0.95rem' }}>
                          {scanProgress}%
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                        {scanStepText}
                      </p>
                      <div
                        style={{
                          width: '100%',
                          height: '6px',
                          background: 'var(--border-subtle)',
                          borderRadius: 'var(--radius-full)',
                          marginTop: '0.85rem',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${scanProgress}%`,
                            background: 'linear-gradient(90deg, var(--brand-primary), #00f5d4)',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for Preview State */}
              {!isScanning && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <RotateCcw size={15} />
                      <span>{language === 'bn' ? 'ছবি পরিবর্তন করুন' : 'Change Image'}</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                    >
                      <span>{language === 'bn' ? 'বাতিল' : 'Cancel'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-md"
                    onClick={handleStartScan}
                    style={{ minWidth: '180px' }}
                  >
                    <Sparkles size={18} />
                    <span>{language === 'bn' ? 'প্রেসক্রিপশন স্ক্যান করুন' : 'Scan Prescription'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Extracted Results View */}
          {extractedData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Clinical Safety & Disclaimer Notice */}
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.9rem 1.15rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  fontSize: '0.85rem',
                }}
              >
                <AlertTriangle size={18} color="var(--status-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--status-warning)' }}>
                    {language === 'bn' ? 'এআই প্রেসক্রিপশন সতর্কতা:' : 'AI Clinical Notice & Verification:'}
                  </strong>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: '0.35rem' }}>
                    {extractedData.confidenceNotice ||
                      (language === 'bn'
                        ? 'এটি এআই ও ওসিআর প্রযুক্তি দ্বারা তৈরি বিশ্লেষণ। কোনো অস্পষ্ট লেখা বা ওষুধ থাকলে অবশ্যই মূল প্রেসক্রিপশন ও রেজিস্টার্ড ডাক্তারের সাথে মিলিয়ে নিন।'
                        : 'This is an AI/OCR-generated interpretation for personal reference. Do not alter doses without physician approval.')}
                  </span>
                </div>
              </div>

              {/* Unclear items warning if present */}
              {extractedData.unclearItems && extractedData.unclearItems.length > 0 && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.84rem',
                    color: 'var(--status-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>
                    <strong>{language === 'bn' ? 'অস্পষ্ট অংশ:' : 'Ambiguous text:'}</strong>{' '}
                    {extractedData.unclearItems.join(', ')}
                  </span>
                </div>
              )}

              {/* Top Meta Summary: Patient & Doctor Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                  gap: '1rem',
                }}
              >
                {/* Patient Information Card */}
                <div
                  className="card"
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '1.15rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--brand-primary)' }}>
                    <User size={18} />
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>
                      {language === 'bn' ? 'রোগীর তথ্য (Patient)' : 'Patient Information'}
                    </h4>
                  </div>

                  {isEditing ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editableData.patientInfo.name}
                          onChange={(e) =>
                            setEditableData({
                              ...editableData,
                              patientInfo: { ...editableData.patientInfo, name: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Age</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editableData.patientInfo.age}
                          onChange={(e) =>
                            setEditableData({
                              ...editableData,
                              patientInfo: { ...editableData.patientInfo, age: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Gender</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editableData.patientInfo.gender}
                          onChange={(e) =>
                            setEditableData({
                              ...editableData,
                              patientInfo: { ...editableData.patientInfo, gender: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Name: </span>
                        <strong>{currentViewData.patientInfo.name || 'Not detected'}</strong>
                      </div>
                      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Age: </span>
                          <span>{currentViewData.patientInfo.age || '--'}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Gender: </span>
                          <span>{currentViewData.patientInfo.gender || '--'}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Date: </span>
                          <span>{currentViewData.patientInfo.prescriptionDate || currentViewData.scanDate}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Doctor Information Card */}
                <div
                  className="card"
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '1.15rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--brand-primary)' }}>
                    <Stethoscope size={18} />
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>
                      {language === 'bn' ? 'চিকিৎসক (Doctor)' : 'Prescribing Doctor'}
                    </h4>
                  </div>

                  {isEditing ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Doctor Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editableData.doctorInfo.name}
                          onChange={(e) =>
                            setEditableData({
                              ...editableData,
                              doctorInfo: { ...editableData.doctorInfo, name: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Specialization</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editableData.doctorInfo.specialization}
                          onChange={(e) =>
                            setEditableData({
                              ...editableData,
                              doctorInfo: { ...editableData.doctorInfo, specialization: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>Hospital / Chamber</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editableData.doctorInfo.hospital}
                          onChange={(e) =>
                            setEditableData({
                              ...editableData,
                              doctorInfo: { ...editableData.doctorInfo, hospital: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Doctor: </span>
                        <strong>{currentViewData.doctorInfo.name || 'Not detected'}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Specialization: </span>
                        <span>{currentViewData.doctorInfo.specialization || currentViewData.doctorInfo.qualification || '--'}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Hospital/Clinic: </span>
                        <span>{currentViewData.doctorInfo.hospital || '--'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Medicines Section Table */}
              <div
                className="card"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Pill size={18} color="var(--brand-primary)" />
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700' }}>
                      {language === 'bn'
                        ? `শনাক্তকৃত ওষুধ তালিকা (${currentViewData.medicines?.length || 0}টি)`
                        : `Prescribed Medicines (${currentViewData.medicines?.length || 0})`}
                    </h4>
                  </div>

                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleAddMedicineRow}
                    >
                      <span>+ {language === 'bn' ? 'ওষুধ যোগ করুন' : 'Add Medicine'}</span>
                    </button>
                  )}
                </div>

                {/* Responsive Medicines Table / Card List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {currentViewData.medicines?.map((med, idx) => (
                    <div
                      key={med.id || idx}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      {isEditing ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem' }}>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Medicine Name</label>
                            <input
                              type="text"
                              className="form-input"
                              value={med.name}
                              onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Generic Name</label>
                            <input
                              type="text"
                              className="form-input"
                              value={med.genericName}
                              onChange={(e) => handleMedicineChange(idx, 'genericName', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Strength</label>
                            <input
                              type="text"
                              className="form-input"
                              value={med.strength}
                              onChange={(e) => handleMedicineChange(idx, 'strength', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Frequency</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="1+0+1"
                              value={med.frequency}
                              onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Duration</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="7 Days"
                              value={med.duration}
                              onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Meal Instruction</label>
                            <select
                              className="form-select"
                              value={med.mealInstruction}
                              onChange={(e) => handleMedicineChange(idx, 'mealInstruction', e.target.value)}
                            >
                              <option value="After Food">After Food (ভরা পেটে)</option>
                              <option value="Before Food">Before Food (খালি পেটে)</option>
                              <option value="With Food">With Food</option>
                              <option value="Not specified">Not specified</option>
                            </select>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--status-danger)' }}
                              onClick={() => handleDeleteMedicineRow(idx)}
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>
                                {idx + 1}. {med.name}
                              </span>
                              {med.strength && med.strength !== 'As advised' && (
                                <span className="badge badge-teal" style={{ fontSize: '0.75rem' }}>
                                  {med.strength}
                                </span>
                              )}
                              {med.form && (
                                <span className="badge" style={{ background: 'var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                                  {med.form}
                                </span>
                              )}
                            </div>

                            {/* Search medicine in SYNORA */}
                            {onSearchMedicine && med.name && med.name !== 'Information could not be clearly detected' && (
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', padding: '0.2rem 0.5rem' }}
                                onClick={() => {
                                  handleClose();
                                  onSearchMedicine(med.genericName || med.name);
                                }}
                                title="Lookup details in SYNORA medicine catalog"
                              >
                                <Search size={13} />
                                <span>{language === 'bn' ? 'ডাটাবেজে খুঁজুন' : 'Lookup Info'}</span>
                              </button>
                            )}
                          </div>

                          {med.genericName && (
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                              Generic: <strong>{med.genericName}</strong>
                            </div>
                          )}

                          {/* Dosage badges */}
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                            {med.frequency && (
                              <span style={{ background: 'var(--bg-card)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                                ⏱️ <strong>{med.frequency}</strong> {med.timing ? `(${med.timing})` : ''}
                              </span>
                            )}
                            {med.mealInstruction && med.mealInstruction !== 'Not specified' && (
                              <span style={{ background: 'var(--bg-card)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', color: 'var(--brand-primary)' }}>
                                🍽️ <strong>{med.mealInstruction}</strong>
                              </span>
                            )}
                            {med.duration && (
                              <span style={{ background: 'var(--bg-card)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                                📅 {med.duration}
                              </span>
                            )}
                            {med.quantity && (
                              <span style={{ background: 'var(--bg-card)', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                                Qty: {med.quantity}
                              </span>
                            )}
                          </div>

                          {med.instructions && (
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                              📝 {med.instructions}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Notes, Diagnosis & Recommended Tests */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  gap: '1rem',
                }}
              >
                {/* Diagnosis & Problem */}
                <div
                  className="card"
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <h5 style={{ margin: '0 0 0.4rem 0', fontSize: '0.88rem', color: 'var(--brand-primary)', fontWeight: '700' }}>
                    {language === 'bn' ? 'রোগের লক্ষণ / ডায়াগনোসিস' : 'Diagnosis & Chief Complaint'}
                  </h5>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {currentViewData.diagnosis || 'None specified on prescription'}
                  </p>
                </div>

                {/* Recommended Lab Tests */}
                <div
                  className="card"
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <h5 style={{ margin: '0 0 0.4rem 0', fontSize: '0.88rem', color: 'var(--brand-primary)', fontWeight: '700' }}>
                    {language === 'bn' ? 'পরামর্শকৃত পরীক্ষা (Lab Tests)' : 'Advised Diagnostic Tests'}
                  </h5>
                  {currentViewData.tests && currentViewData.tests.length > 0 ? (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {currentViewData.tests.map((test, i) => (
                        <span key={i} className="badge badge-teal" style={{ fontSize: '0.78rem' }}>
                          {test}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      No diagnostic tests noted
                    </p>
                  )}
                </div>

                {/* Doctor's Advice & Notes */}
                {currentViewData.doctorNotes && (
                  <div
                    className="card"
                    style={{
                      background: 'var(--bg-tertiary)',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      gridColumn: '1 / -1',
                    }}
                  >
                    <h5 style={{ margin: '0 0 0.4rem 0', fontSize: '0.88rem', color: 'var(--brand-primary)', fontWeight: '700' }}>
                      {language === 'bn' ? 'ডাক্তারের সাধারণ পরামর্শ ও নির্দেশনা' : "Doctor's Advice & Clinical Notes"}
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {currentViewData.doctorNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Bottom Actions Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      if (isEditing) {
                        setExtractedData(editableData);
                        setIsEditing(false);
                      } else {
                        setIsEditing(true);
                      }
                    }}
                  >
                    <Edit3 size={15} />
                    <span>
                      {isEditing
                        ? (language === 'bn' ? 'সম্পাদনা সম্পন্ন' : 'Done Editing')
                        : (language === 'bn' ? 'তথ্য সম্পাদনা' : 'Edit Extracted Data')}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      setExtractedData(null);
                      setEditableData(null);
                    }}
                  >
                    <RotateCcw size={15} />
                    <span>{language === 'bn' ? 'নতুন স্ক্যান' : 'Scan Another'}</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-md"
                    onClick={handleSaveToProfile}
                    style={{ minWidth: '160px' }}
                  >
                    <Save size={17} />
                    <span>{language === 'bn' ? 'প্রোফাইলে সংরক্ষণ করুন' : 'Save to Profile'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
