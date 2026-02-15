const ClawdimCerebras = (() => {
  const CEREBRAS_BASE_URL = 'https://api.cerebras.ai/v1';

  const cerebrasChat = async (messages, model = 'llama-3.3-70b', apiKey) => {
    if (!apiKey) {
      throw new Error('Cerebras API Key ist nicht konfiguriert');
    }
    
    const response = await fetch(`${CEREBRAS_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 2048,
        temperature: 0.7,
        stream: false
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `API Fehler: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  };

  const cerebrasStreamChat = async function* (messages, model = 'llama-3.3-70b', apiKey) {
    if (!apiKey) {
      throw new Error('Cerebras API Key ist nicht konfiguriert');
    }
    
    const response = await fetch(`${CEREBRAS_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 2048,
        temperature: 0.7,
        stream: true
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `API Fehler: ${response.status}`);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') continue;
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch (e) {
          // Skip malformed JSON
        }
      }
    }
  };

  const cerebrasModels = [
    { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', recommended: true },
    { id: 'llama-4-scout', name: 'Llama 4 Scout', recommended: false },
    { id: 'glm-4.7', name: 'GLM-4.7 (Best Tool Calling)', recommended: true },
    { id: 'llama-4-maverick', name: 'Llama 4 Maverick', recommended: false },
    { id: 'qwen3-235b', name: 'Qwen3 235B', recommended: false }
  ];

  return {
    cerebrasChat,
    cerebrasStreamChat,
    cerebrasModels
  };
})();