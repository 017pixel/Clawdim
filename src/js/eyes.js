const ClawdimEyes = (() => {
  const eyes = {
    left: null,
    right: null
  };

  let leftPupil = null;
  let rightPupil = null;

  let currentState = 'idle';
  let animationFrame = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const IDLE_RANGE = 15;
  const FOLLOW_SMOOTHING = 0.08;

  const initEyes = () => {
    eyes.left = document.getElementById('left-eye');
    eyes.right = document.getElementById('right-eye');
    
    if (!eyes.left || !eyes.right) {
      console.error('Eye elements not found');
      return false;
    }
    
    leftPupil = eyes.left.querySelector('.pupil');
    rightPupil = eyes.right.querySelector('.pupil');
    
    startIdleAnimation();
    setupMouseTracking();
    
    return true;
  };

  const startIdleAnimation = () => {
    let lastMove = Date.now();
    let idleTargetX = 0;
    let idleTargetY = 0;
    
    const updateIdle = () => {
      const now = Date.now();
      
      if (currentState === 'idle' && now - lastMove > ClawdimHelpers.randomInt(1500, 4000)) {
        idleTargetX = ClawdimHelpers.randomRange(-IDLE_RANGE, IDLE_RANGE);
        idleTargetY = ClawdimHelpers.randomRange(-IDLE_RANGE, IDLE_RANGE);
        lastMove = now;
      }
      
      if (currentState === 'idle') {
        targetX = idleTargetX;
        targetY = idleTargetY;
      }
      
      currentX += (targetX - currentX) * FOLLOW_SMOOTHING;
      currentY += (targetY - currentY) * FOLLOW_SMOOTHING;
      
      updatePupilPosition();
      
      animationFrame = requestAnimationFrame(updateIdle);
    };
    
    updateIdle();
  };

  const updatePupilPosition = () => {
    const transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
    
    if (leftPupil) {
      leftPupil.style.transform = transform;
    }
    if (rightPupil) {
      rightPupil.style.transform = transform;
    }
  };

  const setupMouseTracking = () => {
    document.addEventListener('mousemove', (e) => {
      if (currentState !== 'idle') return;
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;
      
      const maxOffset = 20;
      targetX = ClawdimHelpers.clamp(deltaX * maxOffset, -maxOffset, maxOffset);
      targetY = ClawdimHelpers.clamp(deltaY * maxOffset, -maxOffset, maxOffset);
    });
    
    document.addEventListener('touchmove', (e) => {
      if (currentState !== 'idle') return;
      
      const touch = e.touches[0];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const deltaX = (touch.clientX - centerX) / centerX;
      const deltaY = (touch.clientY - centerY) / centerY;
      
      const maxOffset = 20;
      targetX = ClawdimHelpers.clamp(deltaX * maxOffset, -maxOffset, maxOffset);
      targetY = ClawdimHelpers.clamp(deltaY * maxOffset, -maxOffset, maxOffset);
    });
  };

  const setState = (state) => {
    currentState = state;
    
    if (!eyes.left || !eyes.right) return;
    
    eyes.left.classList.remove('idle', 'listening', 'speaking', 'thinking', 'blink');
    eyes.right.classList.remove('idle', 'listening', 'speaking', 'thinking', 'blink');
    
    eyes.left.classList.add(state);
    eyes.right.classList.add(state);
    
    if (state === 'idle') {
      document.dispatchEvent(new CustomEvent('eyes-state-change', { detail: { state: 'idle' } }));
    }
  };

  const blink = () => {
    if (!eyes.left || !eyes.right) return;
    
    eyes.left.classList.add('blink');
    eyes.right.classList.add('blink');
    
    setTimeout(() => {
      eyes.left.classList.remove('blink');
      eyes.right.classList.remove('blink');
    }, 150);
  };

  const lookAt = (x, y) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;
    
    const maxOffset = 25;
    targetX = ClawdimHelpers.clamp(deltaX * maxOffset, -maxOffset, maxOffset);
    targetY = ClawdimHelpers.clamp(deltaY * maxOffset, -maxOffset, maxOffset);
  };

  const lookCenter = () => {
    targetX = 0;
    targetY = 0;
  };

  const startRandomBlink = (interval = 3000) => {
    setInterval(() => {
      if (currentState === 'idle' && Math.random() > 0.3) {
        blink();
      }
    }, interval);
  };

  const getState = () => {
    return currentState;
  };

  const destroy = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  };

  return {
    initEyes,
    setState,
    blink,
    lookAt,
    lookCenter,
    startRandomBlink,
    getState,
    destroy
  };
})();