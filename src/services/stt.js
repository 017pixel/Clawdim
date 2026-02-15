const ClawdimSTT = (() => {
  let recognition = null;
  let isListening = false;
  let onResultCallback = null;
  let onInterimCallback = null;
  let onStartCallback = null;
  let onEndCallback = null;
  let onErrorCallback = null;

  const initSTT = () => {
    if (!isSupported()) {
      console.warn('Speech Recognition not supported');
      return false;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    const config = ClawdimConfig.getConfig();
    const sttConfig = config.stt || {};
    
    recognition.lang = sttConfig.language || 'de-DE';
    recognition.continuous = sttConfig.continuous || false;
    recognition.interimResults = sttConfig.interimResults !== false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      isListening = true;
      document.dispatchEvent(new CustomEvent('stt-start'));
      if (onStartCallback) onStartCallback();
    };
    
    recognition.onend = () => {
      isListening = false;
      document.dispatchEvent(new CustomEvent('stt-end'));
      if (onEndCallback) onEndCallback();
    };
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (interimTranscript && onInterimCallback) {
        onInterimCallback(interimTranscript);
      }
      
      if (finalTranscript && onResultCallback) {
        onResultCallback(finalTranscript.trim());
      }
      
      document.dispatchEvent(new CustomEvent('stt-result', {
        detail: { interim: interimTranscript, final: finalTranscript }
      }));
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      isListening = false;
      document.dispatchEvent(new CustomEvent('stt-error', { detail: event }));
      if (onErrorCallback) onErrorCallback(event.error);
    };
    
    return true;
  };

  const startListening = (options = {}) => {
    if (!recognition) {
      if (!initSTT()) {
        return false;
      }
    }
    
    if (isListening) {
      stopListening();
    }
    
    const config = ClawdimConfig.getConfig();
    const sttConfig = config.stt || {};
    
    recognition.lang = options.language || sttConfig.language || 'de-DE';
    
    onResultCallback = options.onResult || null;
    onInterimCallback = options.onInterim || null;
    onStartCallback = options.onStart || null;
    onEndCallback = options.onEnd || null;
    onErrorCallback = options.onError || null;
    
    try {
      recognition.start();
      return true;
    } catch (e) {
      console.error('Error starting speech recognition:', e);
      return false;
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      try {
        recognition.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
    }
  };

  const getListeningState = () => {
    return isListening;
  };

  const isSupported = () => {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  };

  const checkWakeWord = (text, triggerWord) => {
    if (!text || !triggerWord) return false;
    
    const normalizedText = text.toLowerCase().replace(/\s+/g, '');
    const normalizedTrigger = triggerWord.toLowerCase().replace(/\s+/g, '');
    
    return normalizedText.includes(normalizedTrigger);
  };

  let wakeWordRecognition = null;
  let wakeWordEnabled = false;
  let wakeWordCallback = null;

  const startWakeWordDetection = (callback) => {
    if (!isSupported()) {
      console.warn('Speech Recognition not supported for wake word detection');
      return false;
    }
    
    const config = ClawdimConfig.getConfig();
    
    if (!config.general?.wakeWordEnabled) {
      return false;
    }
    
    wakeWordCallback = callback;
    wakeWordEnabled = true;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    wakeWordRecognition = new SpeechRecognition();
    
    wakeWordRecognition.lang = config.general?.language || 'de-DE';
    wakeWordRecognition.continuous = true;
    wakeWordRecognition.interimResults = true;
    
    wakeWordRecognition.onresult = (event) => {
      const triggerWord = config.general?.triggerWord || 'HeyAssistent';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (checkWakeWord(transcript, triggerWord)) {
          if (wakeWordCallback) {
            wakeWordCallback(transcript);
          }
          document.dispatchEvent(new CustomEvent('wake-word-detected', {
            detail: { transcript, triggerWord }
          }));
        }
      }
    };
    
    wakeWordRecognition.onerror = (event) => {
      if (event.error !== 'no-speech' && wakeWordEnabled) {
        setTimeout(() => {
          if (wakeWordEnabled) {
            startWakeWordDetection(wakeWordCallback);
          }
        }, 1000);
      }
    };
    
    wakeWordRecognition.onend = () => {
      if (wakeWordEnabled) {
        setTimeout(() => {
          if (wakeWordEnabled && wakeWordRecognition) {
            try {
              wakeWordRecognition.start();
            } catch (e) {
              // Ignore
            }
          }
        }, 100);
      }
    };
    
    try {
      wakeWordRecognition.start();
      return true;
    } catch (e) {
      console.error('Error starting wake word detection:', e);
      return false;
    }
  };

  const stopWakeWordDetection = () => {
    wakeWordEnabled = false;
    
    if (wakeWordRecognition) {
      try {
        wakeWordRecognition.stop();
      } catch (e) {
        // Ignore
      }
      wakeWordRecognition = null;
    }
  };

  const updateWakeWordSettings = () => {
    const config = ClawdimConfig.getConfig();
    
    if (config.general?.wakeWordEnabled && !wakeWordEnabled) {
      startWakeWordDetection(wakeWordCallback);
    } else if (!config.general?.wakeWordEnabled && wakeWordEnabled) {
      stopWakeWordDetection();
    }
  };

  return {
    initSTT,
    startListening,
    stopListening,
    getListeningState,
    isSupported,
    checkWakeWord,
    startWakeWordDetection,
    stopWakeWordDetection,
    updateWakeWordSettings
  };
})();