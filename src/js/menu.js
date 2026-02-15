const ClawdimMenu = (() => {
  const SWIPE_THRESHOLD = 50;
  const EDGE_THRESHOLD = 50;

  let menu = null;
  let isOpen = false;
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  let settingsBtn = null;
  let chatBtn = null;
  let clearHistoryBtn = null;

  const initMenu = () => {
    menu = document.getElementById('side-menu');
    
    if (!menu) {
      console.error('Menu element not found');
      return false;
    }
    
    settingsBtn = document.getElementById('btn-settings');
    chatBtn = document.getElementById('btn-chat');
    clearHistoryBtn = document.getElementById('btn-clear-history');
    
    setupSwipeGesture();
    setupButtons();
    
    return true;
  };

  const setupSwipeGesture = () => {
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      isDragging = false;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (!startX) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        isDragging = true;
      }
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      if (!isDragging || !startX) {
        startX = 0;
        startY = 0;
        return;
      }
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const startFromEdge = startX > window.innerWidth - EDGE_THRESHOLD;
      const startFromMenu = startX < window.innerWidth - 280 || !isOpen;
      
      if (deltaX < -SWIPE_THRESHOLD && startFromEdge && !isOpen) {
        openMenu();
      } else if (deltaX > SWIPE_THRESHOLD && isOpen) {
        closeMenu();
      }
      
      startX = 0;
      startY = 0;
      isDragging = false;
    }, { passive: true });
    
    document.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
      isDragging = false;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!startX) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        isDragging = true;
      }
    });
    
    document.addEventListener('mouseup', (e) => {
      if (!isDragging || !startX) {
        startX = 0;
        startY = 0;
        return;
      }
      
      const deltaX = e.clientX - startX;
      const startFromEdge = startX > window.innerWidth - EDGE_THRESHOLD;
      
      if (deltaX < -SWIPE_THRESHOLD && startFromEdge && !isOpen) {
        openMenu();
      } else if (deltaX > SWIPE_THRESHOLD && isOpen) {
        closeMenu();
      }
      
      startX = 0;
      startY = 0;
      isDragging = false;
    });
    
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  };

  const setupButtons = () => {
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        closeMenu();
        document.dispatchEvent(new CustomEvent('open-settings'));
      });
    }
    
    if (chatBtn) {
      chatBtn.addEventListener('click', () => {
        closeMenu();
        toggleChat();
      });
    }
    
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        closeMenu();
        document.dispatchEvent(new CustomEvent('clear-history'));
      });
    }
  };

  const openMenu = () => {
    if (!menu) return;
    
    menu.classList.remove('closed');
    menu.classList.add('open');
    isOpen = true;
    
    document.dispatchEvent(new CustomEvent('menu-open'));
  };

  const closeMenu = () => {
    if (!menu) return;
    
    menu.classList.remove('open');
    menu.classList.add('closed');
    isOpen = false;
    
    document.dispatchEvent(new CustomEvent('menu-close'));
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const isMenuOpen = () => {
    return isOpen;
  };

  let chatVisible = false;

  const toggleChat = () => {
    chatVisible = !chatVisible;
    document.dispatchEvent(new CustomEvent('toggle-chat', { detail: { visible: chatVisible } }));
  };

  const hideChat = () => {
    chatVisible = false;
    document.dispatchEvent(new CustomEvent('toggle-chat', { detail: { visible: false } }));
  };

  return {
    initMenu,
    openMenu,
    closeMenu,
    toggleMenu,
    isMenuOpen,
    hideChat
  };
})();