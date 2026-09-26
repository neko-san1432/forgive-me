// Cute pleading GIFs from local assets (no external network dependencies)
const pleadingGifs = [
  "./assets/cat1.gif",
  "./assets/cat2.gif",
  "./assets/cat3.gif",
  "./assets/cat4.gif",
  "./assets/cat5.gif",
  "./assets/cat6.gif"
];

// Fun pleading messages when trying to click "No"
const pleaMessages = [
  "Are you really sure? 🥺",
  "Think about our sweet memories! 💭",
  "What if I buy you your favorite boba? 🧋",
  "I'll give you unlimited hugs & snacks! 🍪",
  "Don't break my tiny heart! 💔",
  "Look at my teary eyes! 🥹",
  "System Error 404: 'No' is not permitted! 🚫",
  "Wrong button! Aim for the pink one! 👉",
  "I'll give you forehead kisses! 🌸",
  "Pretty please with sprinkles on top? 🍨",
  "I promise to be on my best behavior! 🤞",
  "You have too kind of a heart to say no! 🥰",
  "I'm not letting you click me! 🏃‍♂️💨",
  "Have mercy on this poor soul! 😭",
  "I'll do all your chores for a week! 🧹"
];

// DOM Elements
const questionCard = document.getElementById("question-card");
const celebrationCard = document.getElementById("celebration-card");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const mainGif = document.getElementById("main-gif");
const pleaText = document.getElementById("plea-text");
const dodgeCountSpan = document.getElementById("dodge-count");
const heartsContainer = document.getElementById("hearts-container");
const soundBtn = document.getElementById("sound-btn");
const soundIcon = document.getElementById("sound-icon");
const celebrateAgainBtn = document.getElementById("celebrate-again-btn");

let dodgeCount = 0;
let soundEnabled = true;

// Web Audio API Synthesizer with safe autoplay handling
let audioCtx = null;

function unlockAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx && AudioContext) {
      audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
  } catch (e) {
    // Autoplay restrictions
  }
}

// Unlock audio on first real user gesture (click or tap)
["click", "touchstart", "touchend", "pointerdown"].forEach((evt) => {
  document.addEventListener(evt, unlockAudio, { once: true, passive: true });
});

// Play cute squeak / boing when "No" dodges
function playBoingSound() {
  if (!soundEnabled || !audioCtx || audioCtx.state !== "running") return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    const now = audioCtx.currentTime;

    // Pitch sweep up (cute boing)
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {
    // Audio might fail if user hasn't interacted yet
  }
}

// Play happy victory chime when "Yes" is clicked
function playCelebrationChime() {
  if (!soundEnabled) return;
  unlockAudio();
  if (!audioCtx) return;

  try {
    const playNotes = () => {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const now = audioCtx.currentTime + idx * 0.11;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.36);
      });
    };

    if (audioCtx.state === "suspended") {
      audioCtx.resume().then(playNotes).catch(() => {});
    } else {
      playNotes();
    }
  } catch (e) {
    // Ignore audio error
  }
}

// Sound toggle listener
soundBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
  if (soundEnabled) unlockAudio();
});

// Teleport the "No" button to a random safe position within the viewport
function moveNoButton(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Only unlock on touch or click events (not hover) to adhere to browser autoplay policy
  if (e && (e.type === "touchstart" || e.type === "click" || e.type === "pointerdown")) {
    unlockAudio();
  }
  playBoingSound();

  dodgeCount++;
  dodgeCountSpan.textContent = dodgeCount;

  // Make the Yes button grow bigger each dodge, safely capped for mobile screens
  const isMobile = window.innerWidth <= 480;
  const maxScale = isMobile ? 1.65 : 2.25;
  const scaleIncrease = Math.min(1 + dodgeCount * 0.08, maxScale);
  yesBtn.style.transform = `scale(${scaleIncrease})`;

  // Update speech bubble with a random message
  const randomMsg = pleaMessages[Math.floor(Math.random() * pleaMessages.length)];
  pleaText.textContent = randomMsg;

  // Update GIF based on attempts
  const gifIndex = dodgeCount % pleadingGifs.length;
  mainGif.src = pleadingGifs[gifIndex];

  // Button dimensions and viewport
  if (!noBtn.classList.contains("teleporting")) {
    noBtn.classList.add("teleporting");
  }

  const btnWidth = noBtn.offsetWidth || 110;
  const btnHeight = noBtn.offsetHeight || 45;
  const padding = isMobile ? 18 : 28;

  // Use visualViewport if available to account for mobile address bars
  const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;

  const maxX = Math.max(padding, vw - btnWidth - padding);
  const maxY = Math.max(padding, vh - btnHeight - padding);

  let randomX = Math.floor(Math.random() * (maxX - padding)) + padding;
  let randomY = Math.floor(Math.random() * (maxY - padding)) + padding;

  // Avoid top right corner where the sound toggle lives (48x48 + margins)
  if (randomX > vw - 100 && randomY < 90) {
    randomY += 80;
  }

  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
}

// Support desktop hover, mobile tap, click & pointer events
noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton, { passive: false });
noBtn.addEventListener("click", moveNoButton);

// Yes Button Action -> Celebration Screen
yesBtn.addEventListener("click", () => {
  unlockAudio();
  playCelebrationChime();

  // Hide question screen and show celebration card
  questionCard.classList.add("hidden");
  celebrationCard.classList.remove("hidden");

  // Remove the rogue No button so it doesn't linger
  noBtn.style.display = "none";

  // Trigger grand confetti shower!
  fireConfettiShower();
});

// Extra celebration button
celebrateAgainBtn.addEventListener("click", () => {
  playCelebrationChime();
  fireConfettiShower();
});

// Confetti burst using canvas-confetti
function fireConfettiShower() {
  if (typeof confetti === "function") {
    // Center big burst
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 }
    });

    // Side cannons
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);
  }
}

// Background Floating Hearts Generator
function createFloatingHearts() {
  const heartSymbols = ["💖", "💕", "🌸", "✨", "💗", "🧸", "🌷"];
  setInterval(() => {
    if (document.hidden) return;
    const heart = document.createElement("div");
    heart.classList.add("floating-heart");
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 95 + "vw";
    heart.style.animationDuration = Math.random() * 4 + 6 + "s";
    heart.style.fontSize = Math.random() * 16 + 18 + "px";

    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 9000);
  }, 600);
}

createFloatingHearts();
