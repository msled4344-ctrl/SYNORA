import React, { useState, useEffect, useRef } from 'react';
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

export const AiHealth = () => {
  const { currentUser } = useAuth();
  const { healthProfile, aiChats, saveAiConversation, deleteAiConversation, clearAllAiChats } = useHealthData();
  const { language, t } = useLanguage();

  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: language === 'bn'
        ? `**স্বাগতম! আমি সিনোরা এআই স্বাস্থ্য সহায়িকা।**\n\nআপনি বাংলায় বা ইংরেজিতে যেকোনো স্বাস্থ্য জিজ্ঞাসা, ঘরোয়া যত্ন, বা লক্ষণ সম্পর্কে প্রশ্ন করতে পারেন। টাইপ করতে সমস্যা হলে পাশে থাকা **মাইক্রোফোন** বাটনে চাপ দিয়ে মুখে বলুন।`
        : `**Welcome! I am your SYNORA AI Health Assistant.**\n\nYou can ask about general symptoms, home care tips, nutrition, or everyday wellness. If typing is difficult, tap the **Microphone** button to speak naturally.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followUps: [
        language === 'bn' ? 'আমার সর্দি ও জ্বর হয়েছে, কী করব?' : 'I have a cold and mild fever, what to do?',
        language === 'bn' ? 'মাথা ব্যথার ঘরোয়া উপায় কী?' : 'How to relieve tension headaches?',
        language === 'bn' ? 'ঘুম ভালো হওয়ার স্বাস্থ্য টিপস' : 'Tips for deeper, restful sleep',
      ],
    },
  ]);

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

  const suggestedQuestions = [
    language === 'bn' ? 'আজকে আমার সর্দি লাগছে আমি কী কী ওষুধ খাব?' : 'I have a runny nose and cold. What home care and OTC medicines are safe?',
    language === 'bn' ? 'মাথা ব্যথা ও ঘাড়ের ব্যথার উপশম' : 'I have a headache and eye strain. What should I do?',
    language === 'bn' ? 'গ্যাস্ট্রিক ও বুক জ্বালাপোড়া কমানোর উপায়' : 'How can I relieve acidity and heartburn naturally?',
    language === 'bn' ? 'শিশুর জ্বর ও যত্নের নিয়ম' : 'What is safe fever management for infants?',
    language === 'bn' ? 'উচ্চ রক্তচাপ নিয়ন্ত্রণে করণীয়' : 'Lifestyle habits to stabilize blood pressure',
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
      const contextPayload = includeContext && healthProfile
        ? {
            age: healthProfile.age,
            conditions: healthProfile.conditions,
            allergies: healthProfile.allergies,
            bp: `${healthProfile.bpSystolic}/${healthProfile.bpDiastolic}`,
            smoking: healthProfile.smoking,
          }
        : {};

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: contextPayload,
        }),
      });

      let aiResponseText = '';
      let followUps = [];
      let isEmergency = false;

      if (res.ok) {
        const data = await res.json();
        aiResponseText = data.reply;
        followUps = data.followUps || [];
        isEmergency = data.isEmergency || false;
      } else {
        aiResponseText = language === 'bn'
          ? 'দুঃখিত, সংযোগে সাময়িক ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Sorry, there was a temporary communication error. Please try again.';
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
          text: 'Unable to reach the healthcare intelligence engine. Please ensure your network is connected.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (transcriptText) => {
    setInputText(transcriptText);
    handleSendMessage(transcriptText);
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
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'ai',
        text: language === 'bn'
          ? 'কথোপকথন রিসেট হয়েছে। আপনার নতুন স্বাস্থ্য প্রশ্ন বলুন বা লিখুন।'
          : 'Conversation cleared. What healthcare topic would you like to explore?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
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
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-teal) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>SYNORA AI Health Assistant</h3>
                <span className="badge badge-teal" style={{ fontSize: '0.68rem' }}>
                  Safety Guardrails
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {language === 'bn' ? 'ভয়েস ও টেক্সট সক্রিয় • নিরাপদ পরামর্শ' : 'Voice & Text Enabled • Context-Aware Guidance'}
              </span>
            </div>
          </div>

          <div className="chat-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            {/* Context Toggle */}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setIncludeContext((prev) => !prev)}
              title="Toggle personalization with your saved Health Profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                color: includeContext ? 'var(--brand-primary)' : 'var(--text-muted)',
                padding: '0.35rem 0.5rem',
              }}
            >
              {includeContext ? <ToggleRight size={20} color="var(--brand-primary)" /> : <ToggleLeft size={20} />}
              <span className="chat-context-text">
                {includeContext ? 'Health Profile Active' : 'Generic Mode'}
              </span>
            </button>

            {/* Saved History Trigger */}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowHistoryDrawer((prev) => !prev)}
              title="View Chat History"
              style={{ padding: '0.35rem 0.65rem' }}
            >
              <History size={16} />
              <span>{language === 'bn' ? 'হিস্ট্রি' : 'History'}</span>
            </button>

            {/* Clear Chat */}
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={handleClearChat}
              title="Clear current conversation"
              style={{ width: '36px', height: '36px' }}
            >
              <Trash2 size={17} color="var(--status-danger)" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="chat-messages" ref={chatMessagesRef}>
          {/* Subtle Emergency Notice */}
          <div
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              textAlign: 'center',
            }}
          >
            <ShieldAlert size={14} color="var(--brand-primary)" />
            <span>SYNORA is an informational assistant. In severe medical emergencies, immediately call <strong>999 / 911</strong>.</span>
          </div>

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
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.65',
                  }}
                >
                  {msg.text}
                </div>

                {/* Suggested Follow-up Questions Chips */}
                {isAi && msg.followUps && msg.followUps.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '600' }}>
                      Suggested Follow-up:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
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
            <div className="message-bubble message-ai" style={{ width: '120px' }}>
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
              </div>
            </div>
          )}
        </div>

        {/* Input Bar & Suggested Chips */}
        <div className="chat-input-area">
          {/* Suggested Starter Chips */}
          <div className="suggested-prompts">
            {suggestedQuestions.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="prompt-chip"
                onClick={() => handleSendMessage(prompt)}
              >
                {prompt}
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
                    ? 'আপনার স্বাস্থ্য প্রশ্ন এখানে লিখুন (Enter চাপলে পাঠানো হবে, Shift+Enter নতুন লাইন)...'
                    : 'Type your healthcare inquiry (Press Enter to send, Shift+Enter for new line)...'
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
                <Send size={17} />
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
