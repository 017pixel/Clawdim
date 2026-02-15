const ClawdimSettings = (() => {
  let settingsOverlay = null;
  let settingsPanel = null;
  let settingsClose = null;
  let settingsSave = null;

  let providerSelect = null;
  let cerebrasSettings = null;
  let nvidiaSettings = null;
  let cerebrasApiKey = null;
  let cerebrasModel = null;
  let nvidiaApiKey = null;
  let nvidiaModel = null;
  let triggerWordInput = null;
  let wakeWordEnabled = null;
  let autoSpeak = null;
  let languageSelect = null;
  let userInfoInput = null;
  let customInstructionsInput = null;
  let systemPromptInput = null;
  let ttsRate = null;
  let ttsRateValue = null;
  let ttsPitch = null;
  let ttsPitchValue = null;
  let ttsVoice = null;

  const initSettings = async () => {
    settingsOverlay = document.getElementById('settings-overlay');
    settingsPanel = document.getElementById('settings-panel');
    settingsClose = document.getElementById('settings-close');
    settingsSave = document.getElementById('settings-save');
    
    providerSelect = document.getElementById('provider-select');
    cerebrasSettings = document.getElementById('cerebras-settings');
    nvidiaSettings = document.getElementById('nvidia-settings');
    cerebrasApiKey = document.getElementById('cerebras-api-key');
    cerebrasModel = document.getElementById('cerebras-model');
    nvidiaApiKey = document.getElementById('nvidia-api-key');
    nvidiaModel = document.getElementById('nvidia-model');
    triggerWordInput = document.getElementById('trigger-word');
    wakeWordEnabled = document.getElementById('wake-word-enabled');
    autoSpeak = document.getElementById('auto-speak');
    languageSelect = document.getElementById('language');
    userInfoInput = document.getElementById('user-info');
    customInstructionsInput = document.getElementById('custom-instructions');
    systemPromptInput = document.getElementById('system-prompt');
    ttsRate = document.getElementById('tts-rate');
    ttsRateValue = document.getElementById('tts-rate-value');
    ttsPitch = document.getElementById('tts-pitch');
    ttsPitchValue = document.getElementById('tts-pitch-value');
    ttsVoice = document.getElementById('tts-voice');
    
    if (!settingsOverlay) {
      console.error('Settings overlay not found');
      return false;
    }
    
    await ClawdimTTS.initTTS();
    populateVoices();
    setupEventListeners();
    await loadSettingsToUI();
    
    return true;
  };

  const populateVoices = () => {
    if (!ttsVoice) return;
    
    const voices = ClawdimTTS.getVoices();
    const germanVoices = ClawdimTTS.getGermanVoices();
    
    ttsVoice.innerHTML = '<option value="auto">Automatisch</option>';
    
    const voicesToAdd = germanVoices.length > 0 ? germanVoices : voices;
    
    voicesToAdd.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      ttsVoice.appendChild(option);
    });
  };

  const setupEventListeners = () => {
    settingsClose.addEventListener('click', hideSettings);
    settingsSave.addEventListener('click', saveSettings);
    
    settingsOverlay.addEventListener('click', (e) => {
      if (e.target === settingsOverlay) {
        hideSettings();
      }
    });
    
    document.addEventListener('open-settings', showSettings);
    
    if (providerSelect) {
      providerSelect.addEventListener('change', () => {
        const provider = providerSelect.value;
        
        if (provider === 'cerebras') {
          cerebrasSettings.classList.remove('hidden');
          nvidiaSettings.classList.add('hidden');
        } else {
          cerebrasSettings.classList.add('hidden');
          nvidiaSettings.classList.remove('hidden');
        }
      });
    }
    
    if (ttsRate) {
      ttsRate.addEventListener('input', () => {
        ttsRateValue.textContent = parseFloat(ttsRate.value).toFixed(1);
      });
    }
    
    if (ttsPitch) {
      ttsPitch.addEventListener('input', () => {
        ttsPitchValue.textContent = parseFloat(ttsPitch.value).toFixed(1);
      });
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !settingsOverlay.classList.contains('hidden')) {
        hideSettings();
      }
    });
  };

  const loadSettingsToUI = async () => {
    const config = await ClawdimConfig.loadConfig();
    
    if (providerSelect) {
      providerSelect.value = config.providers?.defaultProvider || 'cerebras';
      providerSelect.dispatchEvent(new Event('change'));
    }
    
    if (cerebrasApiKey) {
      cerebrasApiKey.value = config.providers?.cerebras?.apiKey || '';
    }
    
    if (cerebrasModel) {
      cerebrasModel.value = config.providers?.cerebras?.defaultModel || 'llama-3.3-70b';
    }
    
    if (nvidiaApiKey) {
      nvidiaApiKey.value = config.providers?.nvidia?.apiKey || '';
    }
    
    if (nvidiaModel) {
      nvidiaModel.value = config.providers?.nvidia?.defaultModel || 'meta/llama-3.3-70b-instruct';
    }
    
    if (triggerWordInput) {
      triggerWordInput.value = config.general?.triggerWord || 'HeyAssistent';
    }
    
    if (wakeWordEnabled) {
      wakeWordEnabled.checked = config.general?.wakeWordEnabled !== false;
    }
    
    if (autoSpeak) {
      autoSpeak.checked = config.general?.autoSpeak !== false;
    }
    
    if (languageSelect) {
      languageSelect.value = config.general?.language || 'de-DE';
    }
    
    if (userInfoInput) {
      userInfoInput.value = config.personality?.userInfo || '';
    }
    
    if (customInstructionsInput) {
      customInstructionsInput.value = config.personality?.customInstructions || '';
    }
    
    if (systemPromptInput) {
      systemPromptInput.value = config.personality?.systemPrompt || '';
    }
    
    if (ttsRate) {
      ttsRate.value = config.tts?.webspeech?.rate || 1;
      ttsRateValue.textContent = (config.tts?.webspeech?.rate || 1).toFixed(1);
    }
    
    if (ttsPitch) {
      ttsPitch.value = config.tts?.webspeech?.pitch || 1;
      ttsPitchValue.textContent = (config.tts?.webspeech?.pitch || 1).toFixed(1);
    }
    
    if (ttsVoice) {
      ttsVoice.value = config.tts?.webspeech?.voice || 'auto';
    }
  };

  const saveSettings = async () => {
    const config = {
      general: {
        triggerWord: triggerWordInput?.value || 'HeyAssistent',
        wakeWordEnabled: wakeWordEnabled?.checked !== false,
        autoSpeak: autoSpeak?.checked !== false,
        language: languageSelect?.value || 'de-DE'
      },
      personality: {
        systemPrompt: systemPromptInput?.value || '',
        userInfo: userInfoInput?.value || '',
        customInstructions: customInstructionsInput?.value || ''
      },
      providers: {
        defaultProvider: providerSelect?.value || 'cerebras',
        cerebras: {
          apiKey: cerebrasApiKey?.value || '',
          defaultModel: cerebrasModel?.value || 'llama-3.3-70b'
        },
        nvidia: {
          apiKey: nvidiaApiKey?.value || '',
          defaultModel: nvidiaModel?.value || 'meta/llama-3.3-70b-instruct'
        }
      },
      tts: {
        provider: 'webspeech',
        webspeech: {
          language: languageSelect?.value || 'de-DE',
          rate: parseFloat(ttsRate?.value || 1),
          pitch: parseFloat(ttsPitch?.value || 1),
          volume: 1,
          voice: ttsVoice?.value || 'auto'
        }
      },
      stt: {
        provider: 'webspeech',
        language: languageSelect?.value || 'de-DE',
        continuous: false,
        interimResults: true
      }
    };
    
    await ClawdimConfig.saveConfig(config);
    
    ClawdimSTT.updateWakeWordSettings();
    
    document.dispatchEvent(new CustomEvent('settings-saved'));
    document.dispatchEvent(new CustomEvent('status-update', { detail: { text: 'Einstellungen gespeichert' } }));
    
    hideSettings();
  };

  const showSettings = () => {
    if (!settingsOverlay) return;
    
    settingsOverlay.classList.remove('hidden');
    
    setTimeout(() => {
      populateVoices();
    }, 100);
  };

  const hideSettings = () => {
    if (!settingsOverlay) return;
    
    settingsOverlay.classList.add('hidden');
  };

  const isSettingsOpen = () => {
    return settingsOverlay && !settingsOverlay.classList.contains('hidden');
  };

  const checkInitialConfig = async () => {
    await ClawdimConfig.loadConfig();
    
    if (!ClawdimConfig.isConfigured()) {
      showSettings();
      document.dispatchEvent(new CustomEvent('status-update', { 
        detail: { text: 'Bitte API Key eingeben' } 
      }));
    }
  };

  return {
    initSettings,
    showSettings,
    hideSettings,
    isSettingsOpen,
    checkInitialConfig
  };
})();