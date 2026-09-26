# 💖 Will You Forgive Me? 🥺

A cute, interactive apology website with dynamic pleading messages, an elusive "No" button that playfully dodges every click/hover, cute GIFs, sound effects, and a sweet celebration screen with confetti!

Designed to be deployed directly to **GitHub Pages**.

---

## ✨ Features

- 🏃 **Elusive "No" Button**: The "No" button runs away whenever the cursor hovers or a finger taps on it!
- 💬 **Dynamic Pleading Messages**: Displays cute and funny excuses (e.g., *"What if I buy you boba? 🧋"*, *"I'll clean your room! 🧹"*).
- 🐱 **Cute GIFs**: Rotates through pleading and crying cat/bear GIFs as they keep trying to click "No".
- 📈 **Growing "Yes" Button**: Every time they try to hit "No", the "Yes" button gets bigger and more tempting to click!
- 🎉 **Celebration Screen**: Confetti shower, happy hugging GIFs, and sweet forgiveness rewards.
- 🔊 **Built-in Cute SFX**: Synthesized "boing" and victory fanfare sounds via Web Audio API (no external audio files required!).
- 📱 **Mobile & Desktop Friendly**: Works smoothly on iPhones, Android devices, tablets, and desktops.

---

## 🚀 How to Deploy to GitHub Pages

### 1. Initialize Git and Commit
Open PowerShell or your terminal in this project folder and run:

```bash
git init
git add .
git commit -m "feat: initial commit for cute forgive me website"
```

### 2. Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new) (e.g., named `forgive-me`).
2. Link your local repo and push:
```bash
git remote add origin https://github.com/<your-username>/forgive-me.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** (tab at the top) > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Branch**:
   - Select `main` branch.
   - Select `/ (root)` folder.
   - Click **Save**.
4. In 1–2 minutes, your website will be live at:
   `https://<your-username>.github.io/forgive-me/`

---

## 💻 Local Preview

You can open `index.html` directly in any web browser, or use VS Code Live Server / Python:

```bash
# Using Python built-in server:
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.
