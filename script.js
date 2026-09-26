// Cute pleading GIFs for the question screen
const pleadingGifs = [
  "https://media.tenor.com/7d7aH4uXgU8AAAAM/cat-sad.gif",
  "https://media.tenor.com/o2xH87fXkksAAAAM/cat-crying.gif",
  "https://media.tenor.com/9vD_vV5v0lAAAAAM/cry-sad.gif",
  "https://media.tenor.com/Fw8_8H_5B6IAAAAM/tkthao219-bubududu.gif",
  "https://media.tenor.com/0Fvdq6VvUqAAAAAM/cat-please.gif",
  "https://media.tenor.com/tHqgU6x_VfAAAAAM/milk-and-mocha-bear-crying.gif",
  "https://media.tenor.com/uP1Y2k58aRAAAAAM/sad-kitten.gif"
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

// Web Audio API Synthesizer for cute sound effects
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

// Play cute squeak / boing when "No" dodges
function playBoingSound() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;

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
  try {
    initAudio();
    if (!audioCtx) return;

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
  } catch (e) {
    // Ignore audio error
  }
}

// Sound toggle listener
soundBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
  if (soundEnabled) initAudio();
});

// Teleport the "No" button to a random safe position within the viewport
function moveNoButton(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  initAudio();
  playBoingSound();

  dodgeCount++;
  dodgeCountSpan.textContent = dodgeCount;

  // Make the Yes button grow bigger each dodge!
  const scaleIncrease = Math.min(1 + dodgeCount * 0.09, 2.3);
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

  const btnWidth = noBtn.offsetWidth || 120;
  const btnHeight = noBtn.offsetHeight || 50;
  const padding = 25;

  const maxX = window.innerWidth - btnWidth - padding;
  const maxY = window.innerHeight - btnHeight - padding;

  const randomX = Math.floor(Math.random() * (maxX - padding)) + padding;
  const randomY = Math.floor(Math.random() * (maxY - padding)) + padding;

  noBtn.style.left = `${Math.max(padding, randomX)}px`;
  noBtn.style.top = `${Math.max(padding, randomY)}px`;
}

// Support desktop hover, mobile tap, click & pointer events
noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton, { passive: false });
noBtn.addEventListener("click", moveNoButton);

// Yes Button Action -> Celebration Screen
yesBtn.addEventListener("click", () => {
  initAudio();
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
