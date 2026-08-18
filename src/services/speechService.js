// Web Speech API Service for Voice Input & Speech Synthesis

// Check Browser Support
export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
};

export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Speech-to-Text Recognition Factory
export class SpeechToTextService {
  constructor({ onResult, onError, onEnd, onStart, lang = 'en-US' }) {
    this.onResult = onResult;
    this.onError = onError;
    this.onEnd = onEnd;
    this.onStart = onStart;
    this.lang = lang;
    this.recognition = null;
    this.isListening = false;

    if (isSpeechRecognitionSupported()) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = lang;

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onStart) this.onStart();
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (this.onResult) {
          this.onResult({
            finalTranscript: finalTranscript.trim(),
            interimTranscript: interimTranscript.trim(),
            transcript: (finalTranscript || interimTranscript).trim(),
          });
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        let errorMessage = 'Voice recognition error. Please check microphone permissions.';
        if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please tap the microphone and speak again.';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Microphone permission denied. Please allow microphone access in your browser.';
        }
        if (this.onError) this.onError(errorMessage, event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onEnd) this.onEnd();
      };
    }
  }

  setLanguage(lang) {
    this.lang = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  start() {
    if (!this.recognition) {
      if (this.onError) this.onError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    try {
      this.recognition.start();
    } catch (err) {
      console.warn('Speech recognition start error:', err);
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Speech recognition stop error:', err);
      }
    }
  }
}

// Text-to-Speech (Audio Readout for accessible healthcare guidance)
export const speakText = (text, lang = 'en-US', onStart, onEnd) => {
  if (!isSpeechSynthesisSupported()) return;

  // Clean Markdown formatting before speaking
  const cleanText = text
    .replace(/[#*_`~>-]/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .trim();

  window.speechSynthesis.cancel(); // Stop any active speech

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang;
  utterance.rate = 0.95; // Slightly slower, comfortable medical pace
  utterance.pitch = 1.0;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};
