const ClawdimTTS = (() => {
  let currentUtterance = null;
  let isSpeaking = false;
  let voices = [];

  const initTTS = () => {
    return new Promise((resolve) => {
      const loadVoices = () => {
        voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          resolve(voices);
        }
      };
      
      loadVoices();
      
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      setTimeout(() => {
        if (voices.length === 0) {
          resolve([]);
        }
      }, 1000);
    });
  };

  const getVoices = () => {
    return voices;
  };

  const getGermanVoices = () => {
    return voices.filter(voice => 
      voice.lang.startsWith('de') || voice.lang.includes('German')
    );
  };

  const speak = (text, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!text || text.trim() === '') {
        resolve();
        return;
      }
      
      if (isSpeaking) {
        stop();
      }
      
      const config = ClawdimConfig.getConfig();
      const ttsConfig = config.tts?.webspeech || {};
      
      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance = utterance;
      
      utterance.lang = options.language || ttsConfig.language || 'de-DE';
      utterance.rate = options.rate ?? ttsConfig.rate ?? 1;
      utterance.pitch = options.pitch ?? ttsConfig.pitch ?? 1;
      utterance.volume = options.volume ?? ttsConfig.volume ?? 1;
      
      if (options.voice || ttsConfig.voice !== 'auto') {
        const voiceId = options.voice || ttsConfig.voice;
        const voice = voices.find(v => v.name === voiceId || v.voiceURI === voiceId);
        if (voice) {
          utterance.voice = voice;
        }
      } else {
        const germanVoices = getGermanVoices();
        if (germanVoices.length > 0) {
          utterance.voice = germanVoices[0];
        }
      }
      
      utterance.onstart = () => {
        isSpeaking = true;
        document.dispatchEvent(new CustomEvent('tts-start', { detail: { text } }));
      };
      
      utterance.onend = () => {
        isSpeaking = false;
        currentUtterance = null;
        document.dispatchEvent(new CustomEvent('tts-end'));
        resolve();
      };
      
      utterance.onerror = (event) => {
        isSpeaking = false;
        currentUtterance = null;
        document.dispatchEvent(new CustomEvent('tts-error', { detail: event }));
        reject(event);
      };
      
      speechSynthesis.speak(utterance);
    });
  };

  const stop = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      isSpeaking = false;
      currentUtterance = null;
      document.dispatchEvent(new CustomEvent('tts-stop'));
    }
  };

  const pause = () => {
    if (isSpeaking) {
      speechSynthesis.pause();
      document.dispatchEvent(new CustomEvent('tts-pause'));
    }
  };

  const resume = () => {
    if (isSpeaking) {
      speechSynthesis.resume();
      document.dispatchEvent(new CustomEvent('tts-resume'));
    }
  };

  const getSpeakingState = () => {
    return isSpeaking;
  };

  const isSupported = () => {
    return 'speechSynthesis' in window;
  };

  return {
    initTTS,
    getVoices,
    getGermanVoices,
    speak,
    stop,
    pause,
    resume,
    getSpeakingState,
    isSupported
  };
})();