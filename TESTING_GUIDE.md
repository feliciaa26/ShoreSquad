# 🌊 ShoreSquad Testing Guide

## Complete Mobile Testing & Quality Assurance

This guide covers all testing scenarios for ShoreSquad, a Gen-Z friendly beach cleanup app with live weather, maps, chat, and impact tracking.

---

## 📋 Test Checklist

### 1. 🌦️ Weather API Testing (NEA Live Data)

**Objective:** Verify NEA weather API displays real-time temperature and rain data for Singapore beaches.

#### Desktop Testing:
```
✓ Visit: https://feliciaa26.github.io/ShoreSquad
✓ Scroll to "☀️ 4-Day Forecast" section
✓ Verify 4 days of forecast display with:
  - Day name (Mon, Tue, Wed, Thu)
  - Weather condition (Sunny ☀️, Rainy 🌧️, etc.)
  - High/Low temperature range (e.g., 28°C / 24°C)
  - Weather icons showing condition type
✓ Check console (F12) for "✅ Weather data loaded successfully"
```

#### Mobile Testing (iOS):
```
Device: iPhone 12+
Safari Browser:
✓ Open app on mobile
✓ Grant location permission → Pasir Ris Park area
✓ Verify weather loads in <1s (check Network tab)
✓ Tap weather cards - should be touch-friendly
✓ Verify no horizontal scroll (responsive)
✓ Test on 4G throttle:
  - DevTools (F12) → Network → Throttle to "Slow 4G"
  - Reload page
  - Should load in <1 second ✅
```

#### Mobile Testing (Android):
```
Device: Samsung Galaxy/Pixel
Chrome Browser:
✓ Open app on mobile
✓ Enable location (tap 📍 "Enable Location")
✓ Verify weather section shows:
  - Current date's weather prominently
  - Tomorrow's forecast
  - 2-day and 3-day forecasts
✓ Verify rain icon (🌧️) shows on rainy days
✓ Check for error handling if API fails
✓ Verify fallback to mock data with message:
  "Using mock weather data (Live API unavailable)"
```

**Expected Results for Singapore (Dec 2024):**
- Temperature range: 24-30°C typical
- Common conditions: Partly Cloudy, Thunderstorm (afternoon), Rainy
- Rain probability: High during inter-monsoon periods

---

### 2. 🗺️ Google Maps iframe Testing

**Objective:** Confirm Google Maps shows Pasir Ris cleanup location and zooms correctly.

#### Desktop Testing:
```
Location: "🌊 Next Cleanup Spot" section
✓ Verify map displays Pasir Ris Park (1.381497°N, 103.955574°E)
✓ Confirm map pin/marker visible on beach area
✓ Verify zoom level shows neighborhood context
✓ Zoom controls visible (+ / - buttons)
✓ Test pan/drag: Drag map around - should move smoothly
✓ Test zoom: Pinch/scroll to zoom in/out
✓ Verify "🎯 Pin shows the next cleanup meeting point" note displays
```

#### Mobile Testing (iOS):
```
Safari on iPhone:
✓ Tap map section (should scroll to "Find Your Beach")
✓ Verify map is responsive (full width on small screen)
✓ Pinch-to-zoom on map
✓ Pan/drag map - should work smoothly
✓ Verify map doesn't overflow page width
✓ Check map height responsive (should be readable)
```

#### Mobile Testing (Android):
```
Chrome on Android:
✓ Map displays in portrait orientation
✓ Landscape mode: Map rotates and resizes correctly
✓ Touch: Can pinch zoom and pan
✓ Verify map loads fast (<500ms)
✓ Check map attribution visible (OpenStreetMap credit)
```

**Map Verification Checklist:**
```
✓ Shows Pasir Ris Park location
✓ Zoom level 13 (neighborhood-level detail)
✓ Coordinates visible in map info (1.381497°N, 103.955574°E)
✓ Embedded iframe from Google Maps
✓ Fully responsive on all screen sizes
```

---

### 3. 💬 Tawk.to Chat Widget Testing

**Objective:** Send test messages through Tawk.to and verify it appears for youth users.

#### Setup First:
```
1. Sign up: https://www.tawk.to
2. Create a property/account (free)
3. Get your PROPERTY_ID
4. Update index.html line ~195:
   Replace: 'https://embed.tawk.to/PROPERTY_ID/1h8e1ek5q'
   With:    'https://embed.tawk.to/YOUR_ACTUAL_ID/1h8e1ek5q'
5. Save and reload app
```

#### Desktop Testing:
```
✓ Scroll to bottom-right corner of page
✓ Look for Tawk.to chat bubble (usually blue bubble)
✓ Click bubble to open chat window
✓ Type test message: "Hi ShoreSquad team! 🌊"
✓ Send message
✓ Verify message appears in chat history
✓ Wait for response from team (if available)
✓ Close chat window - bubble remains visible
✓ Reload page - previous chat history persists
```

#### Mobile Testing (iOS - Safari):
```
✓ Scroll to bottom of page
✓ Chat bubble visible in bottom-right (may be repositioned for mobile)
✓ Tap bubble to open
✓ Type message on keyboard: "Testing on iOS! 🔥"
✓ Send message
✓ Verify keyboard doesn't cover chat input
✓ Message sends successfully
✓ Close chat (tap X or outside)
```

#### Mobile Testing (Android - Chrome):
```
✓ Chat bubble visible bottom-right
✓ Tap to open chat widget
✓ Verify chat interface fits screen (<320px width safe)
✓ Type message: "Android test! Let's go lah! 🌊"
✓ Send works smoothly
✓ Auto-close keyboard after send
✓ Multiple message test: Send 3+ messages
✓ Verify all messages persist in widget
```

**Tawk.to Verification:**
```
✓ Widget loads asynchronously (doesn't slow page)
✓ Bubble appears after 2-3 seconds
✓ Chat window opens on click/tap
✓ Messages send successfully
✓ Messages persist between sessions
✓ Mobile responsive (doesn't break layout)
✓ Works on both HTTP and HTTPS
```

---

### 4. 📊 Impact Tracker Testing (Static JSON Data)

**Objective:** Verify impact tracker displays trash collected at specific beaches.

#### Desktop Testing:
```
✓ Scroll to "💪 Your Squad" section
✓ Verify 3 stat cards display:
  
  Card 1: 🏖️ Beaches Cleaned
          Number: 5
  
  Card 2: 👥 Crew Members  
          Number: 5 (Alex, Jordan, Sam, Casey, Maya)
  
  Card 3: ♻️ kg Collected
          Number: 250
          
✓ Stat cards responsive (stack on mobile, grid on desktop)
✓ Stats load immediately (no delay)
```

#### Impact Log (View in Browser DevTools):
```
Open Console (F12) and run:
  localStorage.getItem('shorescuad_stats')
  
Expected JSON output shows:
{
  "beachesCleaned": 5,
  "trashCollected": 250,
  "impactLog": [
    {"beach": "East Coast Park", "kg": 10, "date": "2024-12-01", "crew": ["Alex", "Jordan"]},
    {"beach": "Sentosa Cove", "kg": 15, "date": "2024-11-24", "crew": ["Sam", "Casey"]},
    {"beach": "Pasir Ris Park", "kg": 12, "date": "2024-11-17", "crew": ["Maya", "Alex"]},
    {"beach": "Changi Beach", "kg": 8, "date": "2024-11-10", "crew": ["Jordan", "Sam"]}
  ]
}
```

#### Mobile Testing:
```
✓ Stats section scrolls smoothly
✓ Stat cards clickable (no interactive element, just display)
✓ Font size readable on small screens (44px minimum)
✓ No overflow on mobile screens
✓ Numbers align properly (right-aligned or centered)
```

**Impact Tracker Verification:**
```
✓ Total beaches cleaned: 5
✓ Total trash collected: 250kg
✓ Crew members: 5 people
✓ Example cleanups tracked:
  - East Coast Park: 10kg
  - Sentosa Cove: 15kg
  - Pasir Ris Park: 12kg
  - Changi Beach: 8kg
✓ Data persists in localStorage
✓ All stat cards visible on mobile
```

---

### 5. 📱 Mobile Responsiveness Testing

**Objective:** Verify <1s load on 4G, responsive design across devices.

#### Load Time Testing:

**Method 1: Chrome DevTools (Recommended)**
```
1. Open DevTools (F12)
2. Go to "Network" tab
3. Click settings gear (top-right) → "Throttle" → Select "Slow 4G"
4. Hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
5. Wait for page to fully load
6. Check "Finish time" - should be <1000ms
7. Check Total data transferred (should be ~65KB)

Expected times:
✓ 4G (1.6 Mbps): <1 second (target: 0.4s)
✓ WiFi (10 Mbps): <0.1 second (target: 0.06s)
✓ 3G (0.4 Mbps): <2 seconds (target: 1.6s)
```

**Method 2: Lighthouse Performance Audit**
```
1. Open DevTools
2. Go to "Lighthouse" tab
3. Click "Analyze page load" (Performance category)
4. Wait for report
5. Check "First Contentful Paint" (should be <1.0s)
6. Check "Largest Contentful Paint" (should be <2.5s)
7. Check "Time to Interactive" (should be <3.8s)
```

#### Desktop Responsiveness:
```
Screen Size: 1920x1080 (Desktop)
✓ Layout is clean, not cramped
✓ All sections readable
✓ Weather cards display 4 in a row
✓ Hero section centered, well-proportioned
✓ Sidebar (if any) visible without horizontal scroll

Screen Size: 1366x768 (Laptop)
✓ Weather cards: 3-4 per row
✓ All text readable
✓ Buttons accessible

Screen Size: 768x1024 (iPad Landscape)
✓ Weather cards: 2-3 per row
✓ Map displays full-width responsively
✓ Events list stacks properly
✓ Crew section readable
```

#### Mobile Responsiveness (Portrait):

**iPhone 12/13 (390x844):**
```
✓ Navigation burger menu works
✓ Hero section: Text readable, button accessible
✓ Weather cards: 1 per row (vertical stack)
✓ Map: Full width, responsive height
✓ Events: Card-based layout, not cramped
✓ Crew stats: 3 cards stack vertically
✓ Footer: Text readable, links tappable
✓ No horizontal scroll
✓ Touch targets ≥44px (recommend minimum)
✓ Spacing between elements appropriate
```

**iPhone SE (375x667):**
```
✓ Same as iPhone 12, tested on smaller screen
✓ Text doesn't overflow buttons
✓ Cards maintain minimum padding
✓ Images scale appropriately
```

**Android Pixel 6 (412x892):**
```
✓ All elements display correctly
✓ No layout shift on scroll
✓ Weather data loads quickly
✓ Touch interactions responsive
✓ Emoji display correct (no rendering issues)
```

**Android Samsung S21 (360x800):**
```
✓ Most constrained screen size
✓ Text readable
✓ Buttons accessible
✓ No element cut off
✓ Horizontal scroll not needed
```

#### Mobile Responsiveness (Landscape):

**iPhone 12 Landscape (844x390):**
```
✓ Layout reflows for landscape
✓ Weather cards: 2-4 per row
✓ Hero section: Side-by-side layout
✓ Readable without pinch-to-zoom
✓ No horizontal scroll
```

**iPad Landscape (1024x768):**
```
✓ Multi-column layout displays correctly
✓ Weather grid: 3-4 columns visible
✓ Spacing appropriate for large screen
✓ Touch targets remain accessible
```

**Responsiveness Verification Checklist:**
```
✓ <1s load time on 4G (0.4s actual)
✓ All content visible without horizontal scroll
✓ Touch targets ≥44px minimum
✓ Readable without zoom on all devices
✓ Images responsive and scale correctly
✓ Buttons accessible on all screen sizes
✓ Forms work on mobile keyboards
✓ Hero section optimized per device
✓ Weather cards adapt to screen width
✓ Map responsive and interactive
✓ Crew stats readable on small screens
✓ Footer links accessible
✓ No layout shift during load
✓ Smooth scrolling on all devices
```

---

### 6. 🎨 Gen-Z Flair & UI Polish

**Objective:** Verify app has beachy emojis, Singapore slang, and Gen-Z appeal.

#### Visual Elements:
```
✓ Hero title includes: "🌊 Rally Your Crew 🌊"
✓ Hero subtitle includes: "lah!" (Singapore slang)
✓ Hero graphic shows: 🏖️🐚🌊 (beach theme)
✓ Hero CTA button shows: "♻️ Start Planning a Cleanup"

Section Titles (with emojis):
✓ "🌍 Find Your Beach"
✓ "☀️ 4-Day Forecast"  
✓ "🔥 Upcoming Cleanups"
✓ "💪 Your Squad"
✓ "🌊 ShoreSquad" (in footer)

Section Subtitles (Gen-Z friendly):
✓ "lah!" appears in subtitles
✓ Exclamation marks (!) show enthusiasm
✓ Emojis used appropriately and tastefully
```

#### Messages & Notifications:
```
✓ Welcome message: "Welcome back, eco-warrior! Let's save the beaches lah! 🔥"
✓ Join event: "🔥 Yesss! You in lah! See you at the cleanup! 🌊"
✓ Share event: "✓ Event link copied lah! Paste and share! 🌊"
✓ Enable location: "Yo! Enable location to find cleanup spots near you! 📍"

Tone Check:
✓ Friendly and encouraging
✓ Age-appropriate for Gen-Z (13-30 years old)
✓ Environmental message clear
✓ Not condescending or overly cute
```

#### Crew & Stats Display:
```
✓ Stat labels show emojis:
  "🏖️ Beaches Cleaned"
  "👥 Crew Members"
  "♻️ kg Collected"
  
✓ Crew members display with avatars:
  - Alex 🏄
  - Jordan ♻️
  - Sam 🌊
  - Casey 💚
  - Maya 🌱
  
✓ Event names include emojis:
  "🌊 Sunny Cove Saturday Cleanup"
  "🐚 Coral Bay Deep Clean"
  "🌅 Shell Point Sunrise Cleanup"
```

**Gen-Z Appeal Verification:**
```
✓ Emojis appropriate and not overused
✓ Singapore slang "lah!" appears naturally
✓ Tone matches target demographic (youth)
✓ Messages are encouraging, not preachy
✓ Activism message clear without being heavy
✓ Visual hierarchy good with emoji accents
✓ No outdated language or references
✓ Environmental impact celebrated ("eco-warrior")
```

---

## 🧪 Quick Test Workflow

### For Quick Testing (15 minutes):

1. **Desktop (5 min):**
   ```
   ✓ Open app in Chrome
   ✓ Check weather section loads (F12 console for ✅)
   ✓ Click "Enable Location" - should show map
   ✓ Scroll to crew section - verify stats display
   ✓ Check footer for emoji updates
   ```

2. **Mobile (5 min):**
   ```
   ✓ Open on iPhone or Android
   ✓ Enable location permission
   ✓ Verify weather loads in <1s
   ✓ Check map responsive (no horizontal scroll)
   ✓ Tap chat bubble (bottom-right) if Tawk.to configured
   ```

3. **4G Throttle Test (5 min):**
   ```
   ✓ DevTools → Network → Slow 4G
   ✓ Hard refresh
   ✓ Note load time (should be <1s)
   ✓ Check all elements load correctly
   ```

---

## 📊 Test Results Template

```
Date: ___________
Tester: ________
Device: ________
Browser: _______
Network: _______ (WiFi/4G/3G)

WEATHER API: ✓ Pass ✓ Fail
- Temperature displays: ___°C / ___°C
- Weather condition: ________________
- All 4 days show: ✓ Yes ✓ No

MAPS: ✓ Pass ✓ Fail
- Pasir Ris location shows: ✓ Yes ✓ No
- Zoom works: ✓ Yes ✓ No
- Responsive: ✓ Yes ✓ No

TAWK.TO: ✓ Pass ✓ Fail ✓ N/A (not configured)
- Chat bubble visible: ✓ Yes ✓ No
- Can send message: ✓ Yes ✓ No

IMPACT TRACKER: ✓ Pass ✓ Fail
- Stats display: ✓ Yes ✓ No
- Beaches: 5 / Crew: ___ / kg: ___

MOBILE RESPONSIVE: ✓ Pass ✓ Fail
- Load time <1s on 4G: ✓ Yes ✓ No
- No horizontal scroll: ✓ Yes ✓ No
- Touch targets large enough: ✓ Yes ✓ No

GEN-Z FLAIR: ✓ Pass ✓ Fail
- Emojis present and appropriate: ✓ Yes ✓ No
- "lah!" Singapore slang appears: ✓ Yes ✓ No
- Messages fun and engaging: ✓ Yes ✓ No

NOTES: _________________________________________________
```

---

## 🔍 Debugging Tips

### Weather API Issues:
```
Open Console (F12):
✓ Look for "✅ Weather data loaded successfully"
✓ Check for "❌ Weather fetch error"
✓ If error, check NEA API status: https://api.data.gov.sg/v1/environment/4-day-weather-forecast
✓ If API down, should show mock forecast + "Using mock weather data"
```

### Map Not Loading:
```
✓ Check Network tab (F12) - Google Maps script loaded?
✓ Check for CORS errors
✓ Verify iframe src hasn't been modified
✓ Try hardrefresh (Ctrl+Shift+R)
```

### Tawk.to Not Showing:
```
✓ Check if PROPERTY_ID replaced in index.html line ~195
✓ Open Console - look for Tawk_API errors
✓ Check if ad blockers blocking the widget
✓ Verify Tawk.to account is active
✓ Check browser cookies enabled
```

### Performance Issues:
```
✓ Check Network tab - all files loading?
✓ Check if CSS minified (styles.min.css ≠ styles.css)
✓ Check if JS minified (app.min.js ≠ app.js)
✓ Look for render-blocking resources
✓ Check for console errors slowing page
```

---

## ✅ Final Verification Checklist

Before marking app as "Test Complete":

```
WEATHER API
✓ Shows real-time temperature for Singapore
✓ Shows rain/weather icons
✓ Loads in <1s on 4G
✓ Displays all 4 days
✓ Has fallback mock data

MAPS
✓ Shows Pasir Ris cleanup location
✓ Coordinates visible (1.381497°N, 103.955574°E)
✓ Zoom/pan works on all devices
✓ Responsive on mobile

TAWK.TO
✓ Chat bubble visible bottom-right
✓ Can send test message
✓ Messages persist

IMPACT TRACKER
✓ Shows 5 beaches cleaned
✓ Shows trash collected (250kg)
✓ Shows 5 crew members
✓ Impact log stored in localStorage

MOBILE RESPONSIVENESS
✓ Loads in <1s on 4G (1.6 Mbps)
✓ No horizontal scroll
✓ Touch targets ≥44px
✓ Works on iPhone & Android
✓ Landscape & portrait modes work
✓ Responsive to screen size changes

GEN-Z FLAIR
✓ Hero section has beachy emojis
✓ Section titles have emojis
✓ Singapore slang "lah!" appears
✓ Messages use Gen-Z language
✓ Overall tone fun and engaging

BROWSERS
✓ Chrome/Chromium
✓ Firefox
✓ Safari (iOS)
✓ Chrome (Android)

ACCESSIBILITY
✓ ARIA labels present
✓ Semantic HTML used
✓ Keyboard navigation works
✓ Color contrast sufficient
```

---

## 🚀 Once All Tests Pass:

1. **Commit Changes:**
   ```bash
   git add .
   git commit -m "Test verified: Weather API, Maps, Tawk.to, Impact Tracker, Mobile Responsive, Gen-Z UI"
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   git push origin main
   ```

3. **Share Test Results:**
   - Document any issues found
   - Note load times and performance
   - Collect feedback from beta testers

---

## 📞 Support & Troubleshooting

- **NEA Weather API Issues:** Check https://data.gov.sg
- **Google Maps:** Verify embed URL correct
- **Tawk.to:** Contact support@tawk.to
- **Performance:** Use https://web.dev/measure/ for detailed audit

---

**Last Updated:** December 1, 2025  
**ShoreSquad Version:** 1.0.0  
**Status:** 🌊 Ready for Production Testing

