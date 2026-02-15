const ClawdimApp = (() => {
  let statusText = null;
  let listeningIndicator = null;
  let listeningTextEl = null;

  const init = async () => {
    try {
      await ClawdimStorage.initDB();
      console.log('IndexedDB initialized');
      
      await ClawdimConfig.loadConfig();
      console.log('Config loaded');
      
      const eyesReady = ClawdimEyes.initEyes();
      if (eyesReady) {
        ClawdimEyes.startRandomBlink(4000);
        console.log('Eyes initialized');
      }
      
      const menuReady = ClawdimMenu.initMenu();
      if (menuReady) {
        console.log('Menu initialized');
      }
      
      const chatReady = ClawdimChat.initChat();
      if (chatReady) {
        console.log('Chat initialized');
      }
      
      const settingsReady = await ClawdimSettings.initSettings();
      if (settingsReady) {
        console.log('Settings initialized');
      }
      
      statusText = document.getElementById('status-text');
      listeningIndicator = document.getElementById('listening-indicator');
      listeningTextEl = document.getElementById('listening-text');
      
      setupEventListeners();
      setupSTT();
      
      await ClawdimSettings.checkInitialConfig();
      
      document.dispatchEvent(new CustomEvent('status-update', { detail: { text: 'Bereit' } }));
      
      console.log('Clawdim initialized successfully');
      
    } catch (error) {
      console.error('Error initializing app:', error);
      document.dispatchEvent(new CustomEvent('status-update', { detail: { text: 'Fehler beim Starten' } }));
    }
  };

  const setupEventListeners = () => {
    document.addEventListener('status-update', (e) => {
      if (statusText && e.detail.text) {
        statusText.textContent = e.detail.text;
      }
    });
    
    document.addEventListener('eyes-thinking', () => {
      ClawdimEyes.setState('thinking');
    });
    
    document.addEventListener('eyes-idle', () => {
      ClawdimEyes.setState('idle');
    });
    
    document.addEventListener('eyes-listening', () => {
      ClawdimEyes.setState('listening');
    });
    
    document.addEventListener('eyes-speaking', () => {
      ClawdimEyes.setState('speaking');
    });
    
    document.addEventListener('message-sent', async (e) => {
      const { response } = e.detail;
      const config = ClawdimConfig.getConfig();
      
      if (config.general?.autoSpeak && response) {
        handleSpeak(response);
      }
    });
    
    document.addEventListener('tts-start', () => {
      document.dispatchEvent(new CustomEvent('eyes-speaking'));
    });
    
    document.addEventListener('tts-end', () => {
      document.dispatchEvent(new CustomEvent('eyes-idle'));
    });
    
    document.addEventListener('tts-stop', () => {
      document.dispatchEvent(new CustomEvent('eyes-idle'));
    });
    
    document.addEventListener('stt-start', () => {
      if (listeningIndicator) {
        listeningIndicator.classList.remove('hidden');
      }
      document.dispatchEvent(new CustomEvent('eyes-listening'));
    });
    
    document.addEventListener('stt-end', () => {
      if (listeningIndicator) {
        listeningIndicator.classList.add('hidden');
      }
      document.dispatchEvent(new CustomEvent('eyes-idle'));
    });
    
    document.addEventListener('wake-word-detected', (e) => {
      handleWakeWord(e.detail);
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !ClawdimChat.isChatVisible() && !ClawdimSettings.isSettingsOpen() && !ClawdimSTT.getListeningState()) {
        e.preventDefault();
        startVoiceInput();
      }
      
      if (e.code === 'Escape') {
        if (ClawdimSTT.getListeningState()) {
          ClawdimSTT.stopListening();
        }
      }
    });
  };

  const setupSTT = () => {
    if (!ClawdimSTT.isSupported()) {
      console.warn('Speech recognition not supported');
      document.dispatchEvent(new CustomEvent('status-update', { 
        detail: { text: 'Spracherkennung nicht unterstützt' } 
      }));
      return;
    }
    
    ClawdimSTT.initSTT();
    ClawdimSTT.startWakeWordDetection(handleWakeWord);
  };

  const handleWakeWord = (detail) => {
    console.log('Wake word detected:', detail);
    
    ClawdimEyes.blink();
    
    setTimeout(() => {
      startVoiceInput();
    }, 200);
  };

  const startVoiceInput = () => {
    if (ClawdimSTT.getListeningState()) return;
    
    ClawdimSTT.startListening({
      onResult: handleVoiceResult,
      onInterim: handleInterimResult,
      onStart: () => {
        document.dispatchEvent(new CustomEvent('status-update', { detail: { text: 'Höre zu...' } }));
      },
      onEnd: () => {
        document.dispatchEvent(new CustomEvent('status-update', { detail: { text: 'Bereit' } }));
      },
      onError: (error) => {
        console.error('STT error:', error);
        document.dispatchEvent(new CustomEvent('status-update', { detail: { text: 'Fehler bei Spracherkennung' } }));
      }
    });
  };

  const handleVoiceResult = (text) => {
    if (!text || text.trim() === '') return;
    
    ClawdimChat.setInputValue(text);
    ClawdimChat.showChat();
    ClawdimChat.focusInput();
    
    setTimeout(() => {
      const sendBtn = document.getElementById('chat-send');
      if (sendBtn) {
        sendBtn.click();
      }
    }, 300);
  };

  const handleInterimResult = (text) => {
    if (listeningTextEl) {
      listeningTextEl.textContent = text || 'Höre zu...';
    }
  };

  const handleSpeak = async (text) => {
    if (!ClawdimTTS.isSupported()) {
      console.warn('TTS not supported');
      return;
    }
    
    try {
      await ClawdimTTS.speak(text);
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  const getVersion = () => '1.0.0';

  const getState = () => ({
    listening: ClawdimSTT.getListeningState(),
    speaking: ClawdimTTS.getSpeakingState()
  });

  return {
    init,
    getVersion,
    getState
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ClawdimApp.init);
} else {
  ClawdimApp.init();
}