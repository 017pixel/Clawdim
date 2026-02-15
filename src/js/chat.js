const ClawdimChat = (() => {
  let chatContainer = null;
  let chatMessages = null;
  let chatInput = null;
  let chatSendBtn = null;
  let isVisible = false;
  let isProcessing = false;

  const initChat = () => {
    chatContainer = document.getElementById('chat-container');
    chatMessages = document.getElementById('chat-messages');
    chatInput = document.getElementById('chat-input');
    chatSendBtn = document.getElementById('chat-send');
    
    if (!chatContainer || !chatMessages || !chatInput || !chatSendBtn) {
      console.error('Chat elements not found');
      return false;
    }
    
    setupEventListeners();
    loadHistory();
    
    return true;
  };

  const setupEventListeners = () => {
    chatSendBtn.addEventListener('click', handleSend);
    
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
    
    document.addEventListener('toggle-chat', (e) => {
      if (e.detail.visible) {
        showChat();
      } else {
        hideChat();
      }
    });
    
    document.addEventListener('clear-history', async () => {
      await ClawdimStorage.clearChatHistory();
      clearMessages();
      document.dispatchEvent(new CustomEvent('status-update', { detail: { text: 'Verlauf gelöscht' } }));
    });
  };

  const loadHistory = async () => {
    try {
      const history = await ClawdimStorage.getChatHistory();
      history.forEach(msg => {
        addMessageToUI(msg.role, msg.content, msg.timestamp);
      });
      scrollToBottom();
    } catch (e) {
      console.error('Error loading chat history:', e);
    }
  };

  const handleSend = async () => {
    const message = chatInput.value.trim();
    
    if (!message || isProcessing) return;
    
    chatInput.value = '';
    
    addMessageToUI('user', message);
    scrollToBottom();
    
    isProcessing = true;
    document.dispatchEvent(new CustomEvent('status-update', { detail: { text: 'Denke nach...' } }));
    document.dispatchEvent(new CustomEvent('eyes-thinking'));
    
    try {
      let responseText = '';
      
      addMessageToUI('assistant', '', Date.now(), true);
      const responseElement = chatMessages.lastElementChild;
      const contentElement = responseElement.querySelector('.message-content');
      
      for await (const chunk of ClawdimAPI.streamMessage(message)) {
        responseText += chunk;
        contentElement.textContent = responseText;
        scrollToBottom();
      }
      
      responseElement.classList.remove('streaming');
      
      document.dispatchEvent(new CustomEvent('status-update', { detail: { text: 'Bereit' } }));
      document.dispatchEvent(new CustomEvent('eyes-idle'));
      
      document.dispatchEvent(new CustomEvent('message-sent', {
        detail: { userMessage: message, response: responseText }
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      
      if (chatMessages.lastElementChild?.classList.contains('streaming')) {
        chatMessages.lastElementChild.remove();
      }
      
      addMessageToUI('assistant', `Fehler: ${error.message}`);
      
      document.dispatchEvent(new CustomEvent('status-update', { detail: { text: 'Fehler' } }));
      document.dispatchEvent(new CustomEvent('eyes-idle'));
    }
    
    isProcessing = false;
  };

  const addMessageToUI = (role, content, timestamp = Date.now(), isStreaming = false) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}${isStreaming ? ' streaming' : ''}`;
    
    const time = ClawdimHelpers.formatTime(timestamp);
    
    messageDiv.innerHTML = `
      <div class="message-bubble">
        <div class="message-content">${ClawdimHelpers.escapeHtml(content)}</div>
        <div class="message-time">${time}</div>
      </div>
    `;
    
    chatMessages.appendChild(messageDiv);
  };

  const scrollToBottom = () => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const clearMessages = () => {
    chatMessages.innerHTML = '';
  };

  const showChat = () => {
    if (!chatContainer) return;
    
    chatContainer.classList.remove('hidden');
    isVisible = true;
    chatInput.focus();
  };

  const hideChat = () => {
    if (!chatContainer) return;
    
    chatContainer.classList.add('hidden');
    isVisible = false;
  };

  const toggleChat = () => {
    if (isVisible) {
      hideChat();
    } else {
      showChat();
    }
  };

  const isChatVisible = () => {
    return isVisible;
  };

  const setInputValue = (value) => {
    if (chatInput) {
      chatInput.value = value;
    }
  };

  const getChatInputValue = () => {
    return chatInput?.value || '';
  };

  const focusInput = () => {
    if (chatInput) {
      chatInput.focus();
    }
  };

  const isProcessingMessage = () => {
    return isProcessing;
  };

  return {
    initChat,
    showChat,
    hideChat,
    toggleChat,
    isChatVisible,
    setInputValue,
    getChatInputValue,
    focusInput,
    isProcessingMessage
  };
})();