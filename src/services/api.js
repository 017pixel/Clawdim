const ClawdimAPI = (() => {
  const sendMessage = async (userMessage) => {
    if (!ClawdimConfig.isConfigured()) {
      throw new Error('Bitte konfiguriere zuerst einen API Key in den Einstellungen');
    }
    
    const systemPrompt = ClawdimConfig.getSystemPrompt();
    const provider = ClawdimConfig.getProvider();
    const model = ClawdimConfig.getModel();
    const apiKey = ClawdimConfig.getApiKey();
    
    const history = await ClawdimStorage.getLastMessages(24);
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];
    
    let response;
    
    if (provider === 'cerebras') {
      response = await ClawdimCerebras.cerebrasChat(messages, model, apiKey);
    } else if (provider === 'nvidia') {
      response = await ClawdimNvidia.nvidiaChat(messages, model, apiKey);
    } else {
      throw new Error(`Unbekannter Provider: ${provider}`);
    }
    
    await ClawdimStorage.addChatMessage({ role: 'user', content: userMessage });
    await ClawdimStorage.addChatMessage({ role: 'assistant', content: response });
    await ClawdimStorage.trimChatHistory(25);
    
    return response;
  };

  const streamMessage = async function* (userMessage, onHistoryUpdate) {
    if (!ClawdimConfig.isConfigured()) {
      throw new Error('Bitte konfiguriere zuerst einen API Key in den Einstellungen');
    }
    
    const systemPrompt = ClawdimConfig.getSystemPrompt();
    const provider = ClawdimConfig.getProvider();
    const model = ClawdimConfig.getModel();
    const apiKey = ClawdimConfig.getApiKey();
    
    const history = await ClawdimStorage.getLastMessages(24);
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];
    
    let fullResponse = '';
    
    await ClawdimStorage.addChatMessage({ role: 'user', content: userMessage });
    
    if (provider === 'cerebras') {
      for await (const chunk of ClawdimCerebras.cerebrasStreamChat(messages, model, apiKey)) {
        fullResponse += chunk;
        yield chunk;
      }
    } else if (provider === 'nvidia') {
      for await (const chunk of ClawdimNvidia.nvidiaStreamChat(messages, model, apiKey)) {
        fullResponse += chunk;
        yield chunk;
      }
    } else {
      throw new Error(`Unbekannter Provider: ${provider}`);
    }
    
    await ClawdimStorage.addChatMessage({ role: 'assistant', content: fullResponse });
    await ClawdimStorage.trimChatHistory(25);
    
    if (onHistoryUpdate) {
      onHistoryUpdate();
    }
  };

  const getChatContext = async () => {
    return await ClawdimStorage.getLastMessages(25);
  };

  const clearContext = async () => {
    await ClawdimStorage.clearChatHistory();
  };

  return {
    sendMessage,
    streamMessage,
    getChatContext,
    clearContext
  };
})();