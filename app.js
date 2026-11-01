/**
 * ==========================================================================
 * A STORY JUST FOR YOU - INTERACTIVE ROMANTIC BOOK APPLICATION
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- State Variables ---
  let currentPage = 1;
  const totalPages = 4;
  let escapeCount = 0;
  let musicPlaying = false;
  let audioCtx = null;
  let musicInterval = null;
  let currentSwapTarget = null;

  // --- DOM Elements ---
  const pages = document.querySelectorAll('.page');
  const dots = document.querySelectorAll('.book-dot');
  const pageIndicator = document.getElementById('page-indicator');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const ribbonBookmark = document.getElementById('ribbon-bookmark');
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const musicLabel = document.getElementById('music-label');
  
  // Page 4 Elements
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const noBtnText = document.getElementById('no-btn-text');
  const runawayBubble = document.getElementById('runaway-bubble');
  const escapeCounter = document.getElementById('counter-badge');
  const questionMascot = document.getElementById('question-mascot');
  const celebrationModal = document.getElementById('celebration-modal');
  const celebrationCloseBtn = document.getElementById('celebration-close-btn');

  // Lightbox & File Input
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const imageFileInput = document.getElementById('image-file-input');

  // Page titles for header indicator
  const pageTitles = [
    "Page 1 of 4 • A Letter from My Heart 🌻",
    "Page 2 of 4 • Pictures of Us & Our Memories 📸💜",
    "Page 3 of 4 • Our Cute WhatsApp Stickers 💬",
    "Page 4 of 4 • Have You Forgiven Me? 🥺"
  ];

  // Cute begging messages for runaway No button
  const runawayMessages = [
    "Are you sure? 🥺",
    "Think again please! 💔",
    "Look at my puppy eyes! 🥺",
    "Error 404: 'No' not found! 🙈",
    "Wrong button cutie! Look left 👉",
    "I promise unlimited back massages! 💆‍♀️",
    "I'll buy you all the chocolates & snacks! 🍫",
    "Unlimited cuddles and forehead kisses! 🫂💋",
    "I promise to never ignore you again! 💖",
    "You can't catch me hehe! 🏃‍♂️💨",
    "Pretty please with a cherry on top? 🍒",
    "Resistance is futile, say Yes! 🥰",
    "Boba date peace offering on me! 🧋",
    "Look how sad the little bear is! 🥺",
    "You know you still love me! ❤️",
    "Just tap Yes already, pretty please! 👉👈",
    "I'll do the dishes for a whole month! 🧼",
    "No work talk during our dates forever! 誓",
    "Give your baby another chance! 🥺🌸",
    "Look at how shiny the Yes button is! ✨"
  ];

  // ==========================================================================
  // WEB AUDIO API SOUND SYSTEM (100% Native, Zero Dependencies)
  // ==========================================================================
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Cute Pop Sound for Stickers
  function playPopSound() {
    initAudio();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.log('Audio pop prevented', e);
    }
  }

  // Gentle Page Turn Sound
  function playPageTurnSound() {
    initAudio();
    if (!audioCtx) return;
    try {
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 1.5;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
    } catch (e) {
      console.log('Audio page turn prevented', e);
    }
  }

  // Celebratory Fanfare Sound for YES
  function playCelebrationFanfare() {
    initAudio();
    if (!audioCtx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      const now = audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const startTime = now + idx * 0.12;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) {
      console.log('Audio celebration prevented', e);
    }
  }

  // Romantic Lofi Chords Synthesizer
  function startRomanticLofiMusic() {
    initAudio();
    if (!audioCtx) return;

    // Chords: Cmaj7, Am7, Fmaj7, G7
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ];

    let chordIndex = 0;

    function playChord() {
      if (!musicPlaying) return;
      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      const now = audioCtx.currentTime;
      currentChord.forEach(freq => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 4);
      });
    }

    playChord();
    musicInterval = setInterval(playChord, 3800);
  }

  function stopRomanticLofiMusic() {
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  }

  // Music button toggle
  musicBtn.addEventListener('click', () => {
    initAudio();
    musicPlaying = !musicPlaying;

    if (musicPlaying) {
      musicBtn.classList.add('playing');
      musicIcon.textContent = '🎶';
      musicLabel.textContent = 'Music: Playing';
      startRomanticLofiMusic();
    } else {
      musicBtn.classList.remove('playing');
      musicIcon.textContent = '🎵';
      musicLabel.textContent = 'Music: Off';
      stopRomanticLofiMusic();
    }
  });

  // ==========================================================================
  // PAGE NAVIGATION SYSTEM
  // ==========================================================================
  function updatePage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    // Play page turn sound if changing pages
    if (currentPage !== pageNumber) {
      playPageTurnSound();
    }

    currentPage = pageNumber;

    // Show active page with flip animation
    pages.forEach((page, index) => {
      if (index + 1 === currentPage) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    // Update bookmark dots
    dots.forEach((dot, index) => {
      if (index + 1 === currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update header indicator
    pageIndicator.textContent = pageTitles[currentPage - 1];

    // Update bottom navigation button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Reset runaway button position if switching to page 4
    if (currentPage === 4) {
      resetNoButtonPosition();
    } else {
      // Hide runaway bubble if leaving page 4
      runawayBubble.classList.remove('visible');
    }

    // Smooth scroll to top of book
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Expose nextPage for in-text turn prompts
  window.bookApp = {
    nextPage: () => {
      if (currentPage < totalPages) updatePage(currentPage + 1);
    },
    prevPage: () => {
      if (currentPage > 1) updatePage(currentPage - 1);
    }
  };

  prevBtn.addEventListener('click', window.bookApp.prevPage);
  nextBtn.addEventListener('click', window.bookApp.nextPage);

  // Bookmark ribbon click moves to next page or loops
  ribbonBookmark.addEventListener('click', () => {
    if (currentPage < totalPages) {
      updatePage(currentPage + 1);
    } else {
      updatePage(1);
    }
  });

  // Direct dot click navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetPage = parseInt(dot.dataset.page, 10);
      updatePage(targetPage);
    });
  });

  // Keyboard navigation (Arrow keys)
  window.addEventListener('keydown', (e) => {
    if (celebrationModal.classList.contains('open')) return;
    if (lightboxModal.classList.contains('open')) return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      window.bookApp.nextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      window.bookApp.prevPage();
    }
  });

  // Mobile Touch Swipe Navigation (Strict Horizontal Only)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const bookContainer = document.getElementById('book-container');

  bookContainer.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  bookContainer.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      handleSwipe();
    }
  }, { passive: true });

  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const swipeThreshold = 55;

    // Only flip page on intentional horizontal swipe, not during vertical scrolling!
    if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX < 0) {
        // Swiped Left -> Go Next
        window.bookApp.nextPage();
      } else {
        // Swiped Right -> Go Prev
        window.bookApp.prevPage();
      }
    }
  }

  // ==========================================================================
  // PAGE 4: THE ELUSIVE UNCLICKABLE "NO" BUTTON (HOPS & CHANGES PLACE)
  // ==========================================================================
  // Playful dodge positions within the buttons area (stays inside page in plain sight!)
  const dodgePositions = [
    { x: -140, y: -45 },  // top-left hop
    { x: 120, y: 45 },   // bottom-right hop
    { x: -120, y: 45 },  // bottom-left hop
    { x: 130, y: -45 },  // top-right hop
    { x: -150, y: 0 },   // hop left of Yes
    { x: 110, y: 0 },    // hop right
    { x: -50, y: -52 },  // hop above
    { x: 40, y: 50 }     // hop below
  ];
  let lastPosIndex = -1;

  function resetNoButtonPosition() {
    btnNo.classList.remove('running');
    btnNo.style.transform = '';
    noBtnText.textContent = "No 😤";
    runawayBubble.classList.remove('visible');
    escapeCount = 0;
    escapeCounter.textContent = "Give it a try... 💜";
    btnYes.style.transform = 'scale(1)';
  }

  function moveNoButton() {
    escapeCount++;
    playPopSound();

    btnNo.classList.add('running');

    // Pick random cute teasing message
    const randomMsg = runawayMessages[(escapeCount - 1) % runawayMessages.length];
    noBtnText.textContent = randomMsg;

    // Pick a new position different from last position
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * dodgePositions.length);
    } while (newIndex === lastPosIndex && dodgePositions.length > 1);
    lastPosIndex = newIndex;

    // Boundary-safe clamping for mobile phones & desktops
    const arena = document.getElementById('buttons-arena');
    const arenaWidth = arena ? arena.offsetWidth : 360;
    const btnWidth = btnNo.offsetWidth || 100;
    const maxSafeX = Math.max(35, Math.floor((arenaWidth - btnWidth) / 2 - 12));
    const maxSafeY = 55;

    let targetX = dodgePositions[newIndex].x;
    let targetY = dodgePositions[newIndex].y;

    // Clamp strictly within the container so it never goes off-screen on phones!
    targetX = Math.max(-maxSafeX, Math.min(maxSafeX, targetX));
    targetY = Math.max(-maxSafeY, Math.min(maxSafeY, targetY));

    // Smooth physical hop to the new spot right inside the page!
    btnNo.style.transform = `translate(${targetX}px, ${targetY}px)`;

    // Update escape attempts text
    if (escapeCount === 1) {
      escapeCounter.textContent = "Hey! It changed place! 🙈 Try again!";
    } else if (escapeCount === 2) {
      escapeCounter.textContent = "Nice try! 'No' is feeling shy today 😜";
    } else if (escapeCount === 3) {
      escapeCounter.textContent = "Look at the shiny Yes button instead 👉💖";
    } else {
      escapeCounter.textContent = `Attempt ${escapeCount}: You can't catch 'No'! Just click Yes! 🥰`;
    }

    // Mascot gets even more pleading
    questionMascot.classList.remove('pulse-mascot');
    void questionMascot.offsetWidth; // trigger reflow
    questionMascot.classList.add('pulse-mascot');

    // The YES button grows slightly bigger with each attempt!
    const scaleFactor = Math.min(1.35, 1 + escapeCount * 0.035);
    btnYes.style.transform = `scale(${scaleFactor})`;
  }

  // Runaway triggers: Hover, Touch, Click Attempt
  btnNo.addEventListener('mouseenter', moveNoButton);
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  }, { passive: false });

  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
  });

  // ==========================================================================
  // PAGE 4: YES BUTTON & CELEBRATION
  // ==========================================================================
  btnYes.addEventListener('click', () => {
    playCelebrationFanfare();
    runawayBubble.classList.remove('visible');

    // Full screen confetti celebration
    triggerConfettiExplosion();

    // Open celebration modal
    celebrationModal.classList.add('open');
    celebrationModal.setAttribute('aria-hidden', 'false');
  });

  celebrationCloseBtn.addEventListener('click', () => {
    celebrationModal.classList.remove('open');
    celebrationModal.setAttribute('aria-hidden', 'true');
    updatePage(1); // Return to page 1 to read again
  });

  function triggerConfettiExplosion() {
    if (typeof confetti !== 'function') return;

    // Heart shapes and colorful bursts
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#7b5ea7', '#9d7bc7', '#ffb703']
    });

    fire(0.2, {
      spread: 60,
      colors: ['#af8de8', '#ffd166', '#ffffff']
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 1.2,
      colors: ['#7b5ea7', '#25d366', '#ffb703', '#d4b8f0']
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.5,
      colors: ['#ffffff', '#e8dbf4', '#ffcc00']
    });

    // Secondary burst after 400ms
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);
  }

  // ==========================================================================
  // PAGE 3: WHATSAPP STICKERS INTERACTION & FILTERING
  // ==========================================================================
  const stickerCards = document.querySelectorAll('.sticker-card');
  const tabBtns = document.querySelectorAll('.tab-btn');

  // Filter stickers by category
  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      tabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      stickerCards.forEach(card => {
        const categories = card.dataset.category.split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Tap sticker for bounce, sound, and floating hearts
  stickerCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicking change photo button, don't trigger bounce
      if (e.target.classList.contains('change-sticker-btn')) return;

      playPopSound();

      // Trigger bounce animation
      card.classList.remove('bouncing');
      void card.offsetWidth;
      card.classList.add('bouncing');

      // Create little floating hearts from sticker
      createPopParticles(e.clientX, e.clientY);
    });
  });

  function createPopParticles(x, y) {
    for (let i = 0; i < 6; i++) {
      const heart = document.createElement('div');
      heart.textContent = ['🌻', '💜', '✨', '🥺', '💕', '🐴'][Math.floor(Math.random() * 6)];
      heart.style.position = 'fixed';
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '9999';
      heart.style.fontSize = `${16 + Math.random() * 12}px`;
      heart.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
      document.body.appendChild(heart);

      const angle = (Math.random() * 360) * (Math.PI / 180);
      const dist = 40 + Math.random() * 60;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 30;

      requestAnimationFrame(() => {
        heart.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
        heart.style.opacity = '0';
      });

      setTimeout(() => heart.remove(), 850);
    }
  }

  // ==========================================================================
  // PAGE 2: POLAROID LIGHTBOX & IMAGE VIEWER
  // ==========================================================================
  const polaroidCards = document.querySelectorAll('.polaroid-card');

  polaroidCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open lightbox if user clicked change photo button
      if (e.target.classList.contains('change-photo-btn')) return;

      const img = card.querySelector('.polaroid-img');
      const caption = card.querySelector('.caption-handwritten');

      if (img) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightboxModal.classList.add('open');
        lightboxModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  function closeLightbox() {
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
  }

  lightboxCloseBtn.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-backdrop').addEventListener('click', closeLightbox);

  // ==========================================================================
  // LIVE IMAGE SWAPPER (Change Photos & Stickers directly in browser)
  // ==========================================================================
  // Allows user to click camera button to replace any photo or sticker directly!
  document.querySelectorAll('.change-photo-btn, .change-sticker-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentSwapTarget = btn.dataset.target;
      imageFileInput.click();
    });
  });

  imageFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file || !currentSwapTarget) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target.result;

      // Save to localStorage
      try {
        localStorage.setItem(`saved_img_${currentSwapTarget}`, dataUrl);
      } catch (err) {
        console.warn('LocalStorage limit reached for image', err);
      }

      // Update image on page immediately
      applyImageToTarget(currentSwapTarget, dataUrl);
    };
    reader.readAsDataURL(file);
    imageFileInput.value = ''; // Reset input
  });

  function applyImageToTarget(targetId, src) {
    if (targetId.startsWith('photo')) {
      const num = targetId.replace('photo', '');
      const img = document.getElementById(`img-photo-${num}`);
      if (img) img.src = src;
    } else if (targetId.startsWith('sticker')) {
      const num = targetId.replace('sticker', '');
      const img = document.getElementById(`img-sticker-${num}`);
      if (img) img.src = src;
    }
  }

  // Load custom saved images from LocalStorage if available
  function loadSavedCustomImages() {
    for (let i = 1; i <= 6; i++) {
      const savedPhoto = localStorage.getItem(`saved_img_photo${i}`);
      if (savedPhoto) applyImageToTarget(`photo${i}`, savedPhoto);
    }
    for (let i = 1; i <= 8; i++) {
      const savedSticker = localStorage.getItem(`saved_img_sticker${i}`);
      if (savedSticker) applyImageToTarget(`sticker${i}`, savedSticker);
    }
  }
  loadSavedCustomImages();

  // ==========================================================================
  // AMBIENT FLOATING SUNFLOWERS & LAVENDER HEARTS GENERATOR
  // ==========================================================================
  const ambientBg = document.getElementById('ambient-bg');
  const heartIcons = ['🌻', '💜', '🌸', '✨', '💕', '🌻', '🪻', '💛'];

  function createAmbientHeart() {
    if (!ambientBg) return;
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${8 + Math.random() * 8}s`;
    heart.style.fontSize = `${14 + Math.random() * 18}px`;
    ambientBg.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 16000);
  }

  // Spawn gentle hearts periodically
  for (let i = 0; i < 8; i++) {
    setTimeout(createAmbientHeart, i * 400);
  }
  setInterval(createAmbientHeart, 2500);

  // Initialize on Page 1
  updatePage(1);
});
