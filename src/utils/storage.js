const ClawdimStorage = (() => {
  const DB_NAME = 'clawdim-db';
  const DB_VERSION = 1;
  
  let db = null;

  const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };
      
      request.onupgradeneeded = (event) => {
        const database = event.target.result;
        
        if (!database.objectStoreNames.contains('settings')) {
          database.createObjectStore('settings', { keyPath: 'key' });
        }
        
        if (!database.objectStoreNames.contains('chat-history')) {
          const chatStore = database.createObjectStore('chat-history', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          chatStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  };

  const getSettings = async () => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get('user-settings');
      
      request.onsuccess = () => {
        resolve(request.result?.value || null);
      };
      
      request.onerror = () => reject(request.error);
    });
  };

  const saveSettings = async (settings) => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put({ key: 'user-settings', value: settings });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const getChatHistory = async () => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['chat-history'], 'readonly');
      const store = transaction.objectStore('chat-history');
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev');
      
      const messages = [];
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          messages.unshift(cursor.value);
          cursor.continue();
        } else {
          resolve(messages);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  };

  const addChatMessage = async (message) => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['chat-history'], 'readwrite');
      const store = transaction.objectStore('chat-history');
      
      const messageWithTimestamp = {
        ...message,
        timestamp: Date.now()
      };
      
      const request = store.add(messageWithTimestamp);
      
      request.onsuccess = () => resolve(messageWithTimestamp);
      request.onerror = () => reject(request.error);
    });
  };

  const clearChatHistory = async () => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['chat-history'], 'readwrite');
      const store = transaction.objectStore('chat-history');
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const trimChatHistory = async (maxMessages = 25) => {
    if (!db) await initDB();
    
    const messages = await getChatHistory();
    
    if (messages.length <= maxMessages) return;
    
    const toDelete = messages.slice(0, messages.length - maxMessages);
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['chat-history'], 'readwrite');
      const store = transaction.objectStore('chat-history');
      
      toDelete.forEach(msg => {
        store.delete(msg.id);
      });
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  };

  const getLastMessages = async (count = 25) => {
    const messages = await getChatHistory();
    return messages.slice(-count);
  };

  return {
    initDB,
    getSettings,
    saveSettings,
    getChatHistory,
    addChatMessage,
    clearChatHistory,
    trimChatHistory,
    getLastMessages
  };
})();