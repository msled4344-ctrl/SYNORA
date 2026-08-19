import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bot,
  User,
  Send,
  Trash2,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  History,
  PlusCircle,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Info,
} from 'lucide-react';
import { VoiceInputButton } from '../components/VoiceInputButton';
import { speakText, stopSpeaking, isSpeechSynthesisSupported } from '../services/speechService';
import { useAuth } from '../context/AuthContext';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';

// Helper component to format Markdown text (bold, lists, headers) into clean HTML
const FormattedMessage = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let currentList = [];
  let listType = null; // 'ul' | 'ol'

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === 'ol') {
        elements.push(
          <ol key={`ol-${elements.length}`} style={{ paddingLeft: '1.25rem', margin: '0.4rem 0' }}>
            {currentList.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.25rem' }}>{renderInline(item)}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} style={{ paddingLeft: '1.25rem', margin: '0.4rem 0' }}>
            {currentList.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.25rem' }}>{renderInline(item)}</li>
            ))}
          </ul>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  const renderInline = (str) => {
    if (!str) return '';
    const parts = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    let lastIdx = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIdx) {
        parts.push(str.substring(lastIdx, match.index));
      }
      const raw = match[0];
      if (raw.startsWith('**') && raw.endsWith('**')) {
        parts.push(
          <strong key={key++} style={{ fontWeight: 650, color: 'inherit' }}>
            {raw.slice(2, -2)}
          </strong>
        );
      } else if (raw.startsWith('*') && raw.endsWith('*')) {
        parts.push(
          <em key={key++} style={{ fontStyle: 'italic' }}>
            {raw.slice(1, -1)}
          </em>
        );
      }
      lastIdx = regex.lastIndex;
    }
    if (lastIdx < str.length) {
      parts.push(str.substring(lastIdx));
    }
    return parts.length > 0 ? parts : str;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      elements.push(<div key={`space-${index}`} style={{ height: '0.4rem' }} />);
      return;
    }

    // Heading ###
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4
          key={`h4-${index}`}
          style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            margin: '0.65rem 0 0.35rem',
            color: 'var(--brand-primary)',
          }}
        >
          {renderInline(trimmed.replace(/^###\s+/, ''))}
        </h4>
      );
      return;
    }

    // Heading ##
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3
          key={`h3-${index}`}
          style={{
            fontSize: '1.08rem',
            fontWeight: 700,
            margin: '0.75rem 0 0.4rem',
            color: 'var(--brand-primary)',
          }}
        >
          {renderInline(trimmed.replace(/^##\s+/, ''))}
        </h3>
      );
      return;
    }

    // Bullet point: * or -
    const bulletMatch = trimmed.match(/^[\*\-]\s+(.+)/);
    if (bulletMatch) {
      if (listType !== 'ul') flushList();
      listType = 'ul';
      currentList.push(bulletMatch[1]);
      return;
    }

    // Numbered list: 1. 2.
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      if (listType !== 'ol') flushList();
      listType = 'ol';
      currentList.push(numMatch[2]);
      return;
    }

    flushList();
    elements.push(
      <p key={`p-${index}`} style={{ margin: '0.25rem 0', lineHeight: '1.65' }}>
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList();
  return <div className="formatted-ai-response">{elements}</div>;
};

const getWelcomeMessage = (lang) => ({
  id: 'msg-welcome',
  sender: 'ai',
  text:
    lang === 'bn'
      ? 'হ্যালো! আমি সিনোরা এআই (SYNORA AI), আপনার সার্বক্ষণিক ডিজিটাল স্বাস্থ্য ও চিকিৎসা তথ্য সহকারী।\n\nআপনি শারীরিক কোনো লক্ষণ, নিরাপদ ঘরোয়া প্রতিকার, ওষুধ সম্পর্কিত তথ্য, কিংবা স্বাস্থ্য ও শিশুর যত্ন নিয়ে যেকোনো প্রশ্ন করতে পারেন। আজ আপনাকে কীভাবে সাহায্য করতে পারি?'
      : 'Hello! I am SYNORA AI, your intelligent personal health and wellness companion.\n\nYou can ask me any questions regarding symptoms, safe home care, medicine guidance, healthy habits, or baby care. How can I help you today?',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  followUps:
    lang === 'bn'
      ? [
          'সর্দি ও জ্বরে নিরাপদ ঘরোয়া পরামর্শ কী?',
          'গ্যাস্ট্রিক ও বুক জ্বালাপোড়া কমানোর উপায়',
          'মাথা ব্যথা কমানোর সহজ উপায়',
          'শিশুর জ্বরে করণীয় কী?',
        ]
      : [
          'What is safe guidance for cold and fever?',
          'How to relieve acidity and heartburn quickly?',
          'Safe ways to relieve a tension headache',
          'What should I do if my baby has a fever?',
        ],
});

export const AiHealth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');

  const { currentUser } = useAuth();
  const { healthProfile, aiChats, saveAiConversation, deleteAiConversation, clearAllAiChats } = useHealthData();
  const { language, t } = useLanguage();

  const [messages, setMessages] = useState([getWelcomeMessage(language)]);

  // Dynamically update welcome message on language toggle if user has not messaged yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id?.startsWith('msg-welcome')) {
        return [getWelcomeMessage(language)];
      }
      return prev;
    });
  }, [language]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [includeContext, setIncludeContext] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  const chatMessagesRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    if (chatMessagesRef.current) {
      if (smooth) {
        chatMessagesRef.current.scrollTo({
          top: chatMessagesRef.current.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isLoading]);

  // Adjust textarea height on input change
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      const targetHeight = Math.min(Math.max(el.scrollHeight, 42), 140);
      el.style.height = `${targetHeight}px`;
    }
  }, [inputText]);

  const quickTopics = [
    {
      label: language === 'bn' ? '🤧 সর্দি ও জ্বর' : '🤧 Cold & Fever',
      query:
        language === 'bn'
          ? 'আমার সর্দি ও হালকা জ্বর হয়েছে, ঘরোয়া সমাধান ও নিরাপদ পরামর্শ কী?'
          : 'I have a cold and mild fever. What safe home remedies are recommended?',
    },
    {
      label: language === 'bn' ? '🤕 মাথা ব্যথা' : '🤕 Headache',
      query:
        language === 'bn'
          ? 'মাথা ব্যথা কমানোর সহজ ও দ্রুত উপায় কী?'
          : 'How can I relieve a tension headache safely?',
    },
    {
      label: language === 'bn' ? '🔥 গ্যাস্ট্রিক ও এসিডিটি' : '🔥 Acidity & Gas',
      query:
        language === 'bn'
          ? 'গ্যাস্ট্রিক ও বুক জ্বালাপোড়া কমানোর ঘরোয়া উপায় কী?'
          : 'How to relieve acidity and heartburn quickly?',
    },
    {
      label: language === 'bn' ? '👶 শিশুর যত্ন' : '👶 Baby Care',
      query:
        language === 'bn'
          ? 'শিশুর জ্বর ও প্রাথমিক যত্নের নিয়ম কী?'
          : 'What is safe fever management guidance for a child?',
    },
    {
      label: language === 'bn' ? '💤 ভালো ঘুম' : '💤 Better Sleep',
      query:
        language === 'bn'
          ? 'রাতে ভালো ও গভীর ঘুমের জন্য কার্যকরী উপায় কী?'
          : 'What are natural tips for deep, restful sleep?',
    },
    {
      label: language === 'bn' ? '🩺 রক্তচাপ' : '🩺 Blood Pressure',
      query:
        language === 'bn'
          ? 'রক্তচাপ স্বাভাবিক রাখার সহজ উপায় কী?'
          : 'Lifestyle habits to stabilize blood pressure naturally',
    },
  ];

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build context payload if enabled
      const contextPayload =
        includeContext && healthProfile
          ? {
              age: healthProfile.age,
              conditions: healthProfile.conditions,
              allergies: healthProfile.allergies,
              bp: `${healthProfile.bpSystolic}/${healthProfile.bpDiastolic}`,
              smoking: healthProfile.smoking,
            }
          : {};

      // Filter out welcome and previous error messages from history payload
      const historyPayload = messages
        .filter(
          (m) =>
            !m.id?.startsWith('msg-welcome') &&
            !m.id?.startsWith('ai-err') &&
            m.text &&
            !m.text.includes('communication error') &&
            !m.text.includes('Unable to reach')
        )
        .slice(-8)
        .map((m) => ({
          role: m.sender === 'ai' ? 'assistant' : 'user',
          content: m.text,
        }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: contextPayload,
          history: historyPayload,
        }),
      });

      let aiResponseText = '';
      let followUps = [];
      let isEmergency = false;

      if (res.ok) {
        const data = await res.json();
        aiResponseText = data.reply || (language === 'bn' ? 'কোনো তথ্য পাওয়া যায়নি।' : 'No response returned.');
        followUps = data.followUps || [];
        isEmergency = data.isEmergency || false;
      } else {
        const errData = await res.json().catch(() => ({}));
        aiResponseText =
          errData.error ||
          (language === 'bn'
            ? 'দুঃখিত, সংযোগে সাময়িক ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Sorry, there was a temporary communication error with the health engine. Please try again.');
      }

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        followUps,
        isEmergency,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Save conversation state
      saveAiConversation({
        preview: text.slice(0, 60),
        messageCount: messages.length + 2,
        messages: [...messages, userMessage, aiMessage],
      });
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text:
            language === 'bn'
              ? 'স্বাস্থ্য এআই সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।'
              : 'Unable to reach the healthcare intelligence engine. Please ensure your network is connected and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
      // Clean query parameter after consumption
      setSearchParams({}, { replace: true });
    }
  }, [initialQuery]);

  const handleVoiceTranscript = (transcriptText) => {
    if (transcriptText && transcriptText.trim()) {
      setInputText(transcriptText);
      handleSendMessage(transcriptText);
    }
  };

  const handleToggleSpeak = (msgId, text) => {
    if (speakingMessageId === msgId) {
      stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      const speechLang = /[\u0980-\u09FF]/.test(text) ? 'bn-BD' : 'en-US';
      setSpeakingMessageId(msgId);
      speakText(
        text,
        speechLang,
        () => setSpeakingMessageId(msgId),
        () => setSpeakingMessageId(null)
      );
    }
  };

  const handleClearChat = () => {
    stopSpeaking();
    setSpeakingMessageId(null);
    setMessages([getWelcomeMessage(language)]);
  };

  const handleLoadSavedChat = (chat) => {
    if (chat.messages && chat.messages.length > 0) {
      setMessages(chat.messages);
      setShowHistoryDrawer(false);
    }
  };

  return (
    <div className="container chat-page-container" style={{ paddingTop: '1.25rem', paddingBottom: '6.5rem' }}>
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-teal) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 168, 150, 0.25)',
                flexShrink: 0,
              }}
            >
              <Bot size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>SYNORA AI</h3>
                <span className="badge badge-teal" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                  ● {language === 'bn' ? 'সক্রিয়' : 'Online'}
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {language === 'bn' ? 'এআই স্বাস্থ্য সহকারী' : 'AI Health Assistant'}
              </span>
            </div>
          </div>

          <div className="chat-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Context Toggle */}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setIncludeContext((prev) => !prev)}
              title={includeContext ? 'Health profile context active' : 'Health profile context inactive'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                color: includeContext ? 'var(--brand-primary)' : 'var(--text-muted)',
                padding: '0.3rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                background: includeContext ? 'var(--brand-primary-light)' : 'transparent',
              }}
            >
              {includeContext ? <ToggleRight size={18} color="var(--brand-primary)" /> : <ToggleLeft size={18} />}
              <span className="chat-context-text">
                {includeContext ? (language === 'bn' ? 'প্রোফাইল সক্রিয়' : 'Profile Active') : (language === 'bn' ? 'সাধারণ' : 'Generic')}
              </span>
            </button>

            {/* Saved History Trigger */}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowHistoryDrawer((prev) => !prev)}
              title={language === 'bn' ? 'হিস্ট্রি দেখুন' : 'View History'}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', gap: '0.35rem' }}
            >
              <History size={15} />
              <span>{language === 'bn' ? 'হিস্ট্রি' : 'History'}</span>
            </button>

            {/* Clear Chat */}
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={handleClearChat}
              title={language === 'bn' ? 'চ্যাট মুছুন' : 'Clear Chat'}
              style={{ width: '34px', height: '34px' }}
            >
              <Trash2 size={16} color="var(--status-danger)" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            const isSpeaking = speakingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`message-bubble ${isAi ? 'message-ai' : 'message-user'}`}
                style={
                  msg.isEmergency
                    ? {
                        border: '2px solid var(--status-danger)',
                        background: 'var(--status-danger-bg)',
                      }
                    : {}
                }
              >
                {/* AI Header with Read Aloud Voice Button */}
                {isAi && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.4rem',
                      fontSize: '0.75rem',
                      color: 'var(--brand-primary)',
                      fontWeight: '600',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Sparkles size={13} /> SYNORA AI
                    </span>

                    {isSpeechSynthesisSupported() && (
                      <button
                        type="button"
                        onClick={() => handleToggleSpeak(msg.id, msg.text)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isSpeaking ? 'var(--status-danger)' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                        }}
                        title={isSpeaking ? 'Stop voice readout' : 'Read aloud with voice (Text-to-Speech)'}
                      >
                        {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                        <span>{isSpeaking ? 'Stop Reading' : 'Listen'}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Message Body */}
                <div style={{ lineHeight: '1.65' }}>
                  {isAi ? <FormattedMessage content={msg.text} /> : msg.text}
                </div>

                {/* Suggested Follow-up Questions Chips */}
                {isAi && msg.followUps && msg.followUps.length > 0 && (
                  <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: '600' }}>
                      {language === 'bn' ? 'প্রাসঙ্গিক প্রশ্ন:' : 'Suggested Follow-up:'}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {msg.followUps.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="prompt-chip"
                          onClick={() => handleSendMessage(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: isAi ? 'var(--text-muted)' : 'rgba(255,255,255,0.7)',
                    textAlign: 'right',
                    marginTop: '0.4rem',
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            );
          })}

          {/* Typing / Thinking indicator */}
          {isLoading && (
            <div className="message-bubble message-ai" style={{ width: '130px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--brand-primary)',
                    animation: 'wave 0.8s infinite alternate',
                  }}
                ></span>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--brand-primary)',
                    animation: 'wave 0.8s infinite alternate 0.2s',
                  }}
                ></span>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--brand-primary)',
                    animation: 'wave 0.8s infinite alternate 0.4s',
                  }}
                ></span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar & Suggested Chips */}
        <div className="chat-input-area">
          {/* Suggested Starter Chips */}
          <div className="suggested-prompts">
            {quickTopics.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="prompt-chip"
                onClick={() => handleSendMessage(item.query)}
                title={item.query}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Form Input Row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="chat-input-form"
          >
            <div className="chat-input-wrapper">
              {/* Voice Input Button with Speech-to-Text */}
              <VoiceInputButton onTranscriptComplete={handleVoiceTranscript} />

              <textarea
                ref={textareaRef}
                rows={1}
                className="chat-textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  language === 'bn'
                    ? 'স্বাস্থ্য বিষয়ক যেকোনো প্রশ্ন লিখুন...'
                    : 'Ask any health question...'
                }
                disabled={isLoading}
                aria-label="Health consultation input"
              />

              <button
                type="submit"
                className="btn btn-primary chat-send-btn"
                disabled={!inputText.trim() || isLoading}
                title={t('send')}
              >
                <Send size={16} />
                <span className="send-btn-label">{t('send')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Slide-out Saved History Drawer */}
      {showHistoryDrawer && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(10, 17, 40, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setShowHistoryDrawer(false)}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '380px',
              height: '100%',
              borderRadius: 0,
              background: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={20} color="var(--brand-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Past Consultations</h3>
              </div>
              <button
                type="button"
                className="btn-ghost btn-icon"
                onClick={() => setShowHistoryDrawer(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {aiChats.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
                  No saved consultations yet. Your completed conversations will appear here.
                </div>
              ) : (
                aiChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="card card-hover"
                    style={{ padding: '0.85rem 1rem', cursor: 'pointer' }}
                    onClick={() => handleLoadSavedChat(chat)}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                      "{chat.preview}..."
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>{new Date(chat.timestamp).toLocaleDateString()}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAiConversation(chat.id);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {aiChats.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={clearAllAiChats}
                style={{ marginTop: '1rem', color: 'var(--status-danger)' }}
              >
                Clear All History
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
