# 🌙 Tamawatchu - Gamified Productivity Web App

A lo-fi indie game-style productivity app where you manage a virtual pet's health through task completion. Built with pure vanilla HTML, CSS, and JavaScript.

## Features

### 🎮 Core Mechanics

- **Virtual Pet System**: Manage Tamawatchu's health (max 100 HP) through task completion and scheduling
- **Star Difficulty System**: Rate tasks 1-5 stars; higher difficulty = more token rewards
- **Health Decay**: Passive HP decay based on schedule mode and inactivity
- **Token Economy**: Earn ⚡ Watchu Watts by completing tasks; spend them at the Capsule Machine
- **Deadline Tracking**: Clock mascot animates urgently when deadlines approach (<2 hours)

### 🗓️ Schedule Modes

- **School Schedule** (10 PM - 7 AM sleep): Standard 1 HP/hour decay
- **Summer Schedule** (12 AM - 9 AM sleep): Relaxed 0.5 HP/hour decay
- **Holiday Vacation**: No decay, tasks worth 50% tokens

### 🎁 Capsule Machine

Spend 50 ⚡ to pull cosmetic or utility items:
- **Common/Rare Cosmetics** (60%/30%): Hats, glasses, color variants
- **Epic Utilities** (10%): Elixir of Focus (freeze decay 4h), Totem of Undying (auto-revive)

### ⚡ Token Economy

| Difficulty | Reward | Penalty (missed deadline) |
|-----------|--------|--------------------------|
| ⭐ | +5 | -5 HP |
| ⭐⭐ | +12 | -10 HP |
| ⭐⭐⭐ | +25 | -20 HP |
| ⭐⭐⭐⭐ | +50 | -35 HP |
| ⭐⭐⭐⭐⭐ | +100 | -50 HP |

**Bonuses:**
- Daily Focus Streak: +20 ⚡ (complete ≥1 task per day)
- Perfect Day Bonus: +50 ⚡ (complete all daily deadlines by midnight)

## 🎨 Visual Design

- **Aesthetic**: Sketchy indie/lo-fi with hand-drawn pastel colors
- **Color Scheme**: 
  - Background: `#F4F1EA` (soft parchment)
  - Cards: `#FFFFFF` with irregular borders
  - Pet Blob: `#D1E8E2` (pastel mint)
  - Health Full: `#A8D5BA` → Health Low: `#E8A8A8`

- **Key Elements**:
  - Asymmetrical CSS blob pet with idle pulse animation
  - Expressive SVG clock that shakes frantically near deadlines
  - Animated health bar with color transitions
  - Particle confetti on task completion

## 🛠️ Project Structure

```
tamawatchu/
├── index.html              # Main entry point
├── css/
│   ├── style.css           # Core styles & layout
│   ├── animations.css      # Keyframe animations
│   └── responsive.css      # Mobile & tablet rules
├── js/
│   ├── game-state.js       # LocalStorage persistence
│   ├── pet.js              # Pet rendering & cosmetics
│   ├── clock.js            # Clock mascot & urgency
│   ├── health.js           # Health decay system
│   ├── tasks.js            # Task economy & rewards
│   ├── capsule.js          # Capsule machine & items
│   ├── ui.js               # DOM & event handling
│   └── app.js              # Main game loop
└── README.md               # This file
```

## 💾 Data Persistence

All game state is saved to browser `localStorage` under the key `tamawatchu_state`:
- Pet health, name, cosmetics
- Token balance & inventory
- Active tasks & deadlines
- Schedule mode & daily streaks

Auto-saves every 30 seconds + on page unload.

## 🚀 Getting Started

1. Open `index.html` in a modern web browser
2. Create your first task with a difficulty and deadline
3. Complete tasks to earn tokens and keep Tamawatchu healthy
4. Visit the Capsule Machine to discover cosmetics and utility items
5. Switch schedule modes based on your lifestyle

## 🎮 Gameplay Tips

- **Daily Streaks**: Log in and complete at least one task daily for bonus tokens
- **Perfect Day**: Finish all deadlines before midnight to earn +50 ⚡
- **Totem of Undying**: Use wisely—it's your pet's emergency revive
- **Holiday Mode**: Safe for breaks without your pet dying
- **Clock Watching**: Keep an eye on the urgency indicator for near deadlines

## ⚙️ Browser Compatibility

- Modern browsers supporting:
  - ES6+ JavaScript
  - CSS Grid & Flexbox
  - SVG rendering
  - LocalStorage API

Tested on Chrome, Firefox, Safari, Edge (latest versions).

## 📱 Responsive Design

Fully responsive:
- Desktop (full experience)
- Tablet (2-column layout adapts to 1)
- Mobile (<480px, optimized touch targets)
- Landscape mode adjustments

## 🔐 Privacy

- All data stored locally in your browser
- No server communication
- No tracking or analytics
- Your pet's data is 100% yours

## 🐛 Known Limitations

- No cloud save (localStorage only)
- Pet name currently fixed (could be customizable in future)
- Single pet per browser
- No multiplayer features

## 🎨 Customization

To customize colors, edit `css/style.css` `:root` variables:

```css
:root {
    --bg-main: #F4F1EA;
    --color-pet-mint: #D1E8E2;
    /* ... */
}
```

## 📝 Future Features

- Pet customization (name, personality)
- Achievements & badges
- Statistics dashboard
- Cloud save integration
- Pet evolution/leveling
- Multiplayer streaks

## 📄 License

See LICENSE file for details.

---

**Made with ❤️ and plenty of ⚡ Watchu Watts**

Enjoy managing your Tamawatchu! Remember: small consistent tasks lead to big victories. 🌙✨
