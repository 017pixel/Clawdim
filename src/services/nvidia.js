const ClawdimNvidia = (() => {
  const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';

  const nvidiaChat = async (messages, model = 'meta/llama-3.3-70b-instruct', apiKey) => {
    if (!apiKey) {
      throw new Error('NVIDIA API Key ist nicht konfiguriert');
    }
    
    const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
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

  const nvidiaStreamChat = async function* (messages, model = 'meta/llama-3.3-70b-instruct', apiKey) {
    if (!apiKey) {
      throw new Error('NVIDIA API Key ist nicht konfiguriert');
    }
    
    const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
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

  const nvidiaModels = [
    { id: 'meta/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', recommended: true },
    { id: 'meta/llama-nemotron-ultra-4b-instruct', name: 'Nemotron Ultra', recommended: true },
    { id: 'meta/llama-nemotron-super-4b-instruct', name: 'Nemotron Super', recommended: false },
    { id: 'mistralai/mistral-large-3-instruct', name: 'Mistral Large 3', recommended: false },
    { id: 'mistralai/mistral-small-3.2-2506-instruct', name: 'Mistral Small 3.2', recommended: false }
  ];

  return {
    nvidiaChat,
    nvidiaStreamChat,
    nvidiaModels
  };
})();