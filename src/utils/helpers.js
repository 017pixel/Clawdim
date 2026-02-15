const ClawdimHelpers = (() => {
  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE');
  };

  const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };

  const mergeDeep = (target, source) => {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = mergeDeep(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  };

  const isObject = (item) => {
    return item && typeof item === 'object' && !Array.isArray(item);
  };

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  };

  const randomRange = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const isValidApiKey = (key) => {
    return typeof key === 'string' && key.trim().length >= 10;
  };

  const parseErrorMessage = (error) => {
    if (error.message) return error.message;
    if (typeof error === 'string') return error;
    return 'Ein unbekannter Fehler ist aufgetreten';
  };

  const DEFAULT_CONFIG = {
    general: {
      triggerWord: 'HeyAssistent',
      wakeWordEnabled: true,
      wakeWordSensitivity: 0.5,
      autoSpeak: true,
      language: 'de-DE'
    },
    personality: {
      systemPrompt: '',
      userInfo: '',
      customInstructions: ''
    },
    providers: {
      defaultProvider: 'cerebras',
      cerebras: {
        apiKey: '',
        defaultModel: 'llama-3.3-70b'
      },
      nvidia: {
        apiKey: '',
        defaultModel: 'meta/llama-3.3-70b-instruct'
      }
    },
    tts: {
      provider: 'webspeech',
      webspeech: {
        language: 'de-DE',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        voice: 'auto'
      }
    },
    stt: {
      provider: 'webspeech',
      language: 'de-DE',
      continuous: false,
      interimResults: true
    }
  };

  const DEFAULT_SYSTEM_PROMPT = `Du bist ein freundlicher und hilfreicher KI-Assistent.
Antworte kurz und prägnant.
Versuche den Benutzer kennenzulernen und merke dir wichtige Informationen über ihn.
Sei natürlich und conversationell.`;

  return {
    debounce,
    throttle,
    generateId,
    formatTime,
    formatDate,
    deepClone,
    mergeDeep,
    isObject,
    sleep,
    clamp,
    randomRange,
    randomInt,
    escapeHtml,
    truncateText,
    isValidApiKey,
    parseErrorMessage,
    DEFAULT_CONFIG,
    DEFAULT_SYSTEM_PROMPT
  };
})();