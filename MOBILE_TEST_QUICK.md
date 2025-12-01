# 📱 Quick Mobile Testing Checklist

**App:** ShoreSquad - Beach Cleanup Social App  
**Version:** 1.0.0  
**Date:** December 1, 2025

---

## ⚡ 2-Minute Quick Test

**Device:** iPhone / Android  
**Time:** 2 minutes

### Actions:
1. **Open app:** `https://feliciaa26.github.io/ShoreSquad`
2. **Allow location** when prompted
3. **Scroll through sections:**
   - ✓ Hero - See "🌊 Rally Your Crew 🌊" with emojis?
   - ✓ Map - Pasir Ris shows? 🗺️
   - ✓ Weather - 4 days visible? ☀️🌧️
   - ✓ Events - Can you see "🔥 Upcoming Cleanups"?
   - ✓ Crew - Stats show (🏖️ 5, 👥 5, ♻️ 250)?
4. **Tap:** "Join Cleanup" button - Does notification say "You in lah! 🔥"?
5. **Chat:** Scroll bottom-right - See Tawk.to bubble? 💬

**Result:** ✓ Pass ✓ Fail

---

## 📊 Load Time Test (4G Throttle)

**Device:** Any smartphone / laptop  
**Browser:** Chrome

### Steps:
1. Open `https://feliciaa26.github.io/ShoreSquad`
2. **F12** → **Network** → Throttle: **Slow 4G**
3. **Hard Refresh** (Ctrl+Shift+R)
4. **Watch timer** - Page should load in **<1000ms**

**Expected:**
- Page loads: **✓ <1s**
- All text visible: **✓ Yes**
- Images appear: **✓ Yes**
- No errors: **✓ Console clear**

**Result:** Load time: _____ ms | ✓ Pass ✓ Fail

---

## 🎮 Interaction Test (5 min)

| Action | Expected | ✓/✗ |
|--------|----------|-----|
| Tap "🌍 Find Your Beach" | Scroll to map section | ✓ |
| Tap map area | Can pan/pinch zoom | ✓ |
| Tap "☀️ 4-Day Forecast" | Scroll to weather (4 cards) | ✓ |
| Weather card visible | Shows temp (28°C), condition | ✓ |
| Tap "🔥 Upcoming Cleanups" | See 3 events with dates | ✓ |
| Tap "Join Cleanup" button | Toast: "You in lah! 🔥" | ✓ |
| Share event | Message shows "lah!" | ✓ |
| Tap "💪 Your Squad" | See 3 stat cards (5/5/250) | ✓ |
| Bottom-right corner | Tawk.to chat bubble visible | ✓ |
| Tap chat bubble | Chat opens (if configured) | ✓ |
| Scroll bottom | Footer shows "🌊 ShoreSquad" | ✓ |

---

## 🌦️ Weather Verification

### What you should see:

**Card 1 (Today):**
```
Mon
Dec 1
[Icon: ☀️ or 🌧️]
[Condition]
28°C / 24°C
```

**Card 2-4:** Similar format for next 3 days

### Console Check (F12 → Console):
```
Look for: ✅ Weather data loaded successfully from NEA API
```

**Status:** ✓ Real API ✓ Mock Data | ✓ Pass ✓ Fail

---

## 📍 Map Verification

### What to see:
- [ ] Map displays Pasir Ris area
- [ ] Can pinch-to-zoom
- [ ] Can drag/pan
- [ ] No map coverage (shows street/terrain)
- [ ] Full responsive width on mobile
- [ ] Note below map: "🎯 Pin shows the next cleanup meeting point at Pasir Ris, Singapore"

**Status:** ✓ Pass ✓ Fail

---

## 💬 Chat Widget (Tawk.to)

### Setup First:
1. Go to https://www.tawk.to
2. Sign up (free)
3. Get PROPERTY_ID
4. Update index.html line ~195

### Then Test:
- [ ] Scroll to bottom-right
- [ ] See blue chat bubble
- [ ] Tap bubble
- [ ] Type: "Hi ShoreSquad! 🌊"
- [ ] Send message
- [ ] Message appears in chat

**Status:** ✓ Configured ✓ Not Configured | ✓ Pass ✓ Fail

---

## 📊 Impact Tracker

### What you should see:

**Your Squad Section:**
```
🏖️               👥              ♻️
Beaches          Crew            kg
Cleaned          Members         Collected

  5                5              250
```

### Crew Members (scroll down):
```
🏄 Alex (Organizer)
♻️ Jordan (Eco-warrior)
🌊 Sam (Beach Lover)
💚 Casey (Supporter)
🌱 Maya (Chief Collector)
```

**Status:** ✓ Pass ✓ Fail

---

## 🎨 Gen-Z Flair Check

| Element | Should Have | ✓ |
|---------|------------|---|
| Hero Title | 🌊 Rally Your Crew 🌊 | ✓ |
| Hero Subtitle | "lah!" (Singapore slang) | ✓ |
| Hero CTA | "♻️ Start Planning" | ✓ |
| Map Section | 🌍 emoji | ✓ |
| Weather Section | ☀️ emoji | ✓ |
| Events Section | 🔥 emoji | ✓ |
| Crew Section | 💪 emoji | ✓ |
| Join Notification | "You in lah! 🔥" | ✓ |
| Share Notification | "lah!" appears | ✓ |
| Event Names | 🌊🐚🌅 emojis | ✓ |
| Stat Labels | 🏖️👥♻️ emojis | ✓ |
| Footer | "♻️" and positive tone | ✓ |

**Vibes:** ✓ Fire (🔥) ✓ Good ✓ Needs Work

---

## 📱 Responsive Check

### Portrait (vertical):
- [ ] No horizontal scroll
- [ ] Text readable (no tiny fonts)
- [ ] Buttons tappable (not too small)
- [ ] Weather cards stack 1 per row
- [ ] Map full width
- [ ] Events readable
- [ ] Stats cards stack vertically
- [ ] Footer readable

### Landscape (horizontal):
- [ ] Reflows naturally
- [ ] Still readable
- [ ] Weather cards: 2-4 per row
- [ ] No horizontal scroll

**Status:** ✓ Fully Responsive ✓ Issues Found | ✓ Pass ✓ Fail

---

## ✨ Performance Summary

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Load Time (4G) | <1s | ____ms | ✓ ✗ |
| Bundle Size | <65KB | ____KB | ✓ ✗ |
| First Paint | <0.5s | ____ms | ✓ ✗ |
| Largest Paint | <2.5s | ____ms | ✓ ✗ |

---

## 🐛 Issues Found

### Issue #1:
```
Device: _____________
Issue: _____________
Steps to Reproduce: _____________
Expected: _____________
Actual: _____________
Severity: ✓ Critical ✓ Major ✓ Minor
```

### Issue #2:
```
Device: _____________
Issue: _____________
Steps to Reproduce: _____________
Expected: _____________
Actual: _____________
Severity: ✓ Critical ✓ Major ✓ Minor
```

---

## 📋 Final Checklist

- [ ] Weather API works on mobile
- [ ] Map shows Pasir Ris correctly
- [ ] Chat widget accessible (if configured)
- [ ] Impact tracker displays stats
- [ ] App loads <1s on 4G
- [ ] No horizontal scroll on mobile
- [ ] Buttons accessible and tappable
- [ ] Emojis display correctly
- [ ] "lah!" appears in messages
- [ ] Messages are Gen-Z friendly
- [ ] Crew avatars show emojis
- [ ] Events have beachy theme
- [ ] All tests pass on iPhone
- [ ] All tests pass on Android

---

## ✅ Test Result

**Overall Status:** ✓ PASS ✓ FAIL

**Tester:** _______________  
**Device:** _______________  
**Browser:** _______________  
**Date:** _______________  

**Comments:** 
```
_________________________________________________
_________________________________________________
_________________________________________________
```

---

### 🚀 Next Steps:
- [ ] If PASS: App ready for production! 🎉
- [ ] If FAIL: Document issues, fix, retest

**Share Results:**
- Screenshot of weather section
- Video of chat interaction (if Tawk.to works)
- Note about load time

---

**ShoreSquad Testing Guide v1.0**  
Generated: December 1, 2025
