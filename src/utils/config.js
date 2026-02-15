const ClawdimConfig = (() => {
  let currentConfig = null;

  const loadConfig = async () => {
    try {
      const savedSettings = await ClawdimStorage.getSettings();
      
      if (savedSettings) {
        currentConfig = ClawdimHelpers.mergeDeep(ClawdimHelpers.DEFAULT_CONFIG, savedSettings);
      } else {
        currentConfig = ClawdimHelpers.deepClone(ClawdimHelpers.DEFAULT_CONFIG);
        await saveConfig(currentConfig);
      }
      
      return currentConfig;
    } catch (error) {
      console.error('Error loading config:', error);
      currentConfig = ClawdimHelpers.deepClone(ClawdimHelpers.DEFAULT_CONFIG);
      return currentConfig;
    }
  };

  const getConfig = () => {
    if (!currentConfig) {
      console.warn('Config not loaded, returning default');
      return ClawdimHelpers.DEFAULT_CONFIG;
    }
    return currentConfig;
  };

  const saveConfig = async (config) => {
    try {
      currentConfig = config;
      await ClawdimStorage.saveSettings(config);
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  };

  const updateConfig = async (path, value) => {
    const config = getConfig();
    const keys = path.split('.');
    let current = config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    
    return await saveConfig(config);
  };

  const getApiKey = () => {
    const config = getConfig();
    const provider = config.providers?.defaultProvider || 'cerebras';
    return config.providers?.[provider]?.apiKey || '';
  };

  const getModel = () => {
    const config = getConfig();
    const provider = config.providers?.defaultProvider || 'cerebras';
    return config.providers?.[provider]?.defaultModel || 'llama-3.3-70b';
  };

  const getProvider = () => {
    const config = getConfig();
    return config.providers?.defaultProvider || 'cerebras';
  };

  const getSystemPrompt = () => {
    const config = getConfig();
    const personality = config.personality || {};
    
    let systemPrompt = personality.systemPrompt || '';
    
    if (!systemPrompt) {
      systemPrompt = ClawdimHelpers.DEFAULT_SYSTEM_PROMPT;
    }
    
    if (personality.userInfo) {
      systemPrompt += `\n\nInformationen über den Benutzer:\n${personality.userInfo}`;
    }
    
    if (personality.customInstructions) {
      systemPrompt += `\n\nAnweisungen:\n${personality.customInstructions}`;
    }
    
    return systemPrompt;
  };

  const isConfigured = () => {
    const apiKey = getApiKey();
    return apiKey && apiKey.trim().length >= 10;
  };

  return {
    loadConfig,
    getConfig,
    saveConfig,
    updateConfig,
    getApiKey,
    getModel,
    getProvider,
    getSystemPrompt,
    isConfigured
  };
})();