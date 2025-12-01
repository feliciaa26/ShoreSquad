# 🌊 ShoreSquad

**Rally your crew, track weather, and hit the next beach cleanup.**

A mobile-first web application designed to mobilize young people to clean beaches using weather tracking, interactive maps, and social features to make eco-action fun and connected.

---

## 📋 Table of Contents

- [Features](#features)
- [Brand Analysis](#brand-analysis)
- [Color Palette](#color-palette)
- [Technology Stack](#technology-stack)
- [JavaScript Features](#javascript-features)
- [UX/Accessibility Principles](#uxaccessibility-principles)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Performance Optimizations](#performance-optimizations)

---

## ✨ Features

### Core Features
- **📍 Geolocation & Interactive Maps** - Find nearby beaches and cleanup locations
- **🌤️ Real-time Weather Tracking** - Check conditions before you go
- **📅 Event Management** - Create, join, and track cleanup events
- **👥 Crew Tracking** - Rally your squad and celebrate eco-action wins
- **📊 Impact Statistics** - Track beaches cleaned, trash collected, and team growth
- **📱 Mobile-First Design** - Optimized for all devices
- **♿ WCAG 2.1 AA Accessible** - Inclusive design for all users

---

## 🎨 Brand Analysis

### Target Audience
Young people (18-35) passionate about environmental action and community.

### Brand Tone
- Energetic and youthful
- Approachable and inclusive
- Action-oriented and impactful
- Fun and social

---

## 🎨 Color Palette

| Color | Hex | Usage | Psychology |
|-------|-----|-------|-----------|
| **Ocean Blue** | `#0077BE` | Primary brand color | Trust, connection, sea theme |
| **Sandy Beige** | `#E8D4B8` | Secondary/accents | Warm, approachable, beach vibes |
| **Vibrant Teal** | `#00D4FF` | CTAs & highlights | Energy, youth, action |
| **Success Green** | `#10B981` | Positive actions | Growth, environmental health |
| **Dark Charcoal** | `#2D3748` | Text & content | Professional, readable |
| **Light Background** | `#F7FAFC` | Sections & cards | Modern, clean, breathable |

### Design System
- **Typography**: Inter (body), Poppins (display) for modern, friendly feel
- **Border Radius**: Rounded (8-16px) for approachable, modern aesthetic
- **Shadows**: Subtle shadows for depth and hierarchy
- **Spacing**: 8px base unit for consistent rhythm

---

## 🛠 Technology Stack

### Frontend
- **HTML5** - Semantic, accessible markup
- **CSS3** - Modern layouts, responsive design, CSS variables
- **Vanilla JavaScript** - No framework dependencies; lightweight and performant
- **Leaflet.js** - Lightweight mapping library
- **OpenWeatherMap API** - Weather data integration

### Build & Deployment Tools
- **Live Server** - Local development server with hot reload
- **Git** - Version control and collaboration

---

## ⚙️ JavaScript Features

### 1. **Geolocation API**
- Request user permission for location tracking
- Calculate distances to nearby beaches using Haversine formula
- Cache location data in localStorage for 1 hour
- Fallback to mock location if permission denied

```javascript
navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  // Initialize map and fetch weather
}, { timeout: 10000, maximumAge: 3600000 });
```

### 2. **Leaflet Map Integration**
- Dynamic map rendering with user marker
- Beach location markers with popups
- Distance calculation and display
- Responsive map resizing

### 3. **Weather API Integration**
- Fetch real-time weather data
- Display temperature, wind, humidity, pressure
- Mock data fallback for demonstration
- Animated loading states

### 4. **Performance Optimizations**
- **Debouncing**: Smooth geolocation & resize handlers
- **Throttling**: High-frequency event handlers
- **Lazy Loading**: Image loading with IntersectionObserver
- **LocalStorage**: Client-side caching for user preferences
- **Service Workers**: Offline capability (template ready)

### 5. **State Management**
- Centralized `AppState` object
- LocalStorage abstraction for persistent data
- Event-driven architecture for updates

### 6. **Interactive Features**
- Mobile menu toggle with ARIA attributes
- Toast notifications for user feedback
- Event join/share functionality
- Real-time crew member updates
- Statistics dashboard with live counters

---

## ♿ UX/Accessibility Principles

### Accessibility (WCAG 2.1 AA)
✅ **Semantic HTML**
- Proper heading hierarchy (h1, h2, h3)
- `<nav>`, `<main>`, `<footer>` landmarks
- `<button>` for interactive elements

✅ **ARIA Labels & Roles**
- `aria-label` for icon buttons
- `aria-expanded` for menu states
- `aria-live` for dynamic updates
- `role="region"` for content sections

✅ **Keyboard Navigation**
- Tab order optimization
- Focus indicators (2px outline, 2px offset)
- Keyboard-accessible menu toggle

✅ **Visual Accessibility**
- 4.5:1 contrast ratio for text
- 44×44px minimum touch targets
- Dark mode support via `prefers-color-scheme`
- Reduced motion support with `@media (prefers-reduced-motion: reduce)`

### UX Design Principles
1. **Mobile-First** - Optimized for touch devices first
2. **Clear CTAs** - Prominent call-to-action buttons with high contrast
3. **Progressive Disclosure** - Complex features revealed progressively
4. **Feedback** - User actions generate immediate visual feedback
5. **Error Prevention** - Disable buttons when actions unavailable
6. **Consistency** - Uniform spacing, typography, and color usage
7. **Performance** - Fast load times and smooth interactions

---

## 📁 Project Structure

```
ShoreSquad/
├── index.html              # HTML5 boilerplate with semantic structure
├── css/
│   └── styles.css          # Complete styling with responsive design
├── js/
│   └── app.js              # Main application logic
├── assets/                 # Images, icons, media (expandable)
├── .vscode/
│   └── settings.json       # Live Server configuration
├── .gitignore              # Git ignore patterns
├── .git/                   # Git repository
└── README.md               # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- VS Code with Live Server extension (recommended)
- Git (optional, for version control)

### Quick Start

#### Option 1: Using Live Server (Recommended)
1. Open the project folder in VS Code
2. Install the **Live Server** extension by Ritwick Dey
3. Right-click `index.html` → "Open with Live Server"
4. App opens on `http://localhost:5500`

#### Option 2: Using Python
```bash
cd ShoreSquad
python -m http.server 8000
# Visit http://localhost:8000
```

#### Option 3: Using Node.js http-server
```bash
npm install -g http-server
cd ShoreSquad
http-server
# Visit http://localhost:8080
```

---

## 📖 Getting Started

### First Run
1. **Enable Location**: Click the "📍 Enable Location" button
2. **View Map**: Interactive map shows nearby beaches
3. **Check Weather**: Real-time weather data displays
4. **Browse Events**: View upcoming cleanup events
5. **Join Crew**: Add crew members and track impact

### Features to Explore
- 🗺️ **Map**: Click beach markers for details
- 🌤️ **Weather**: Current conditions and forecast data
- 📅 **Events**: Join events or create your own
- 👥 **Crew**: Track your eco-warriors
- 📊 **Stats**: Monitor team impact

---

## ⚙️ Configuration

### Live Server Settings
Edit `.vscode/settings.json`:

```json
{
    "liveServer.settings.port": 5500,
    "liveServer.settings.root": "/",
    "liveServer.settings.CustomBrowser": "chrome"
}
```

### API Keys
To use real weather data, add your OpenWeatherMap API key in `js/app.js`:

```javascript
const CONFIG = {
    apiKey: 'YOUR_OPENWEATHERMAP_API_KEY_HERE'
};
```

Get your free API key: https://openweathermap.org/api

### Map Customization
Change the default map center in `js/app.js`:

```javascript
const mockLocation = { latitude: 40.7128, longitude: -74.0060 }; // NYC
```

---

## 📊 Performance Optimizations

### Code-Level
- ✅ Debounced resize events (250ms)
- ✅ Throttled scroll handlers (300ms)
- ✅ Lazy image loading with IntersectionObserver
- ✅ Event delegation for dynamic content

### Network
- ✅ LocalStorage caching (1-hour TTL for location)
- ✅ Lightweight Leaflet.js (33KB)
- ✅ Google Fonts preconnection
- ✅ CSS custom properties for efficient styling

### Rendering
- ✅ GPU acceleration via `transform` animations
- ✅ Will-change hints for frequent animations
- ✅ CSS containment for layout performance
- ✅ Minimal reflows with batched DOM updates

### Accessibility
- ✅ Dark mode support
- ✅ Reduced motion respect
- ✅ Print stylesheet
- ✅ Semantic HTML structure

---

## 🌍 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📝 Git Workflow

### Initial Commit
```bash
git add .
git commit -m "Initial ShoreSquad project setup"
```

### Development Workflow
```bash
# Create feature branch
git checkout -b feature/event-creation

# Make changes
git add src/
git commit -m "Add event creation form"

# Push and create PR
git push origin feature/event-creation
```

### .gitignore Patterns
- `node_modules/` - Dependencies
- `.env` - Environment variables
- `dist/` - Build output
- `.DS_Store` - macOS files
- `.vscode/*` (except settings.json) - IDE cache

---

## 🔮 Future Enhancements

### Phase 2
- [ ] User authentication & profiles
- [ ] Event creation & management
- [ ] Social media sharing
- [ ] Push notifications
- [ ] Backend API integration

### Phase 3
- [ ] Photo uploads from cleanups
- [ ] Leaderboard & gamification
- [ ] Environmental impact metrics
- [ ] Partner integrations (NGOs, brands)
- [ ] Merchandise rewards

### Phase 4
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Carbon offset tracking
- [ ] Live cleanup streaming
- [ ] Donation integration

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - Feel free to use, modify, and distribute.

---

## 💬 Support

For questions or issues, please open a GitHub issue or contact us at support@shorescuad.local.

---

## 🌊 Let's Make Waves!

Join ShoreSquad today and be part of the movement to keep our beaches clean and our communities connected.

**Happy cleaning! 🌊♻️💚**

---

**Made with ❤️ for the ocean and our communities.**
