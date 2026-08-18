import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Check, X, Volume2 } from 'lucide-react';
import { SpeechToTextService, isSpeechRecognitionSupported } from '../services/speechService';
import { useLanguage } from '../context/LanguageContext';

export const VoiceInputButton = ({ onTranscriptComplete, placeholder = 'Speak now...' }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const { language } = useLanguage();
  const speechServiceRef = useRef(null);
  const transcriptRef = useRef('');

  const supported = isSpeechRecognitionSupported();

  useEffect(() => {
    if (supported) {
      speechServiceRef.current = new SpeechToTextService({
        lang: language === 'bn' ? 'bn-BD' : 'en-US',
        onStart: () => {
          setIsListening(true);
          setErrorMessage(null);
        },
        onResult: ({ transcript: text }) => {
          transcriptRef.current = text;
          setTranscript(text);
        },
        onError: (err) => {
          setIsListening(false);
          setErrorMessage(err);
        },
        onEnd: () => {
          setIsListening(false);
          if (transcriptRef.current.trim()) {
            setShowPreviewModal(true);
          }
        },
      });
    }

    return () => {
      if (speechServiceRef.current) {
        speechServiceRef.current.stop();
      }
    };
  }, [language, supported]);

  const handleToggleListening = () => {
    if (!supported) {
      alert('Speech recognition is not supported on this browser. Please use Google Chrome, Edge, or an updated Chromium browser.');
      return;
    }

    if (isListening) {
      speechServiceRef.current?.stop();
      setIsListening(false);
      if (transcriptRef.current.trim()) {
        setShowPreviewModal(true);
      }
    } else {
      transcriptRef.current = '';
      setTranscript('');
      setErrorMessage(null);
      speechServiceRef.current?.start();
      setIsListening(true);
    }
  };

  const handleConfirmTranscript = () => {
    const text = (transcript || transcriptRef.current).trim();
    if (text) {
      onTranscriptComplete(text);
    }
    setShowPreviewModal(false);
    transcriptRef.current = '';
    setTranscript('');
  };

  const handleCancelTranscript = () => {
    setShowPreviewModal(false);
    transcriptRef.current = '';
    setTranscript('');
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        type="button"
        className={`voice-btn ${isListening ? 'listening' : ''}`}
        onClick={handleToggleListening}
        title={isListening ? 'Stop listening' : 'Click to speak (Voice input)'}
        aria-label="Voice input button"
      >
        {isListening ? (
          <div className="voice-wave">
            <div className="voice-wave-bar"></div>
            <div className="voice-wave-bar"></div>
            <div className="voice-wave-bar"></div>
            <div className="voice-wave-bar"></div>
          </div>
        ) : (
          <Mic size={20} />
        )}
      </button>

      {/* Listening Status Tooltip / Badge */}
      {isListening && (
        <div
          style={{
            position: 'absolute',
            bottom: '120%',
            right: 0,
            background: 'var(--bg-secondary)',
            border: '1.5px solid var(--status-danger)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 0.85rem',
            boxShadow: 'var(--shadow-lg)',
            whiteSpace: 'nowrap',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 60,
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--status-danger)',
              animation: 'pulse-ring 1s infinite',
            }}
          ></span>
          <span>{language === 'bn' ? 'শুনছি... কথা বলুন' : 'Listening... Speak now'}</span>
        </div>
      )}

      {/* Transcript Review Modal / Popover before sending */}
      {showPreviewModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            background: 'rgba(10, 17, 40, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '460px',
              width: '100%',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--brand-primary-light)',
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Volume2 size={18} />
              </div>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>
                {language === 'bn' ? 'ভয়েস বার্তা পর্যালোচনা করুন' : 'Review Recognized Voice'}
              </h4>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              {language === 'bn'
                ? 'আপনার বলা কথা নিচে দেখা যাচ্ছে। প্রয়োজনে সম্পাদনা করে পাঠাতে পারেন:'
                : 'Your speech was transcribed below. You can edit before sending:'}
            </p>

            <textarea
              className="form-textarea"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={3}
              style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}
              placeholder={placeholder}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCancelTranscript}
              >
                <X size={16} />
                {language === 'bn' ? 'বাতিল' : 'Discard'}
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleConfirmTranscript}
                disabled={!transcript.trim()}
              >
                <Check size={16} />
                {language === 'bn' ? 'ব্যবহার করুন' : 'Confirm & Use'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
