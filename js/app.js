/**
 * ShoreSquad - Main Application JavaScript
 * Features: Geolocation, Weather API, Map Integration, Event Management
 * Performance optimizations: Lazy loading, debouncing, caching
 */

// ========================================
// Configuration & Constants
// ========================================

const CONFIG = {
    // NEA (National Environment Agency) API - Singapore Realtime Weather
    weatherAPI: 'https://api.data.gov.sg/v1/environment/4-day-weather-forecast',
    psiAPI: 'https://api.data.gov.sg/v1/environment/psi',
    uvAPI: 'https://api.data.gov.sg/v1/environment/uv-index',
    mapTileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    mapAttribution: '&copy; OpenStreetMap contributors',
    defaultZoom: 13,
    geolocationTimeout: 10000,
};

// ========================================
// Global State Management
// ========================================

const AppState = {
    currentLocation: null,
    map: null,
    weatherData: null,
    events: [],
    crewMembers: [],
    localStorage: {
        prefix: 'shorescuad_',
        get(key) {
            return JSON.parse(localStorage.getItem(`${this.prefix}${key}`) || 'null');
        },
        set(key, value) {
            localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
        },
    },
};

// ========================================
// DOM Elements Cache
// ========================================

let DOM = {};

// Initialize DOM cache function (called after page loads)
function initializeDOMCache() {
    DOM = {
        geoButton: document.getElementById('geoButton'),
        menuToggle: document.getElementById('menuToggle'),
        navMenu: document.getElementById('navMenu'),
        ctaButton: document.getElementById('ctaButton'),
        weatherGrid: document.getElementById('weatherGrid'),
        eventsList: document.getElementById('eventsList'),
        crewMembers: document.getElementById('crewMembers'),
        beachesCleanedCount: document.getElementById('beachesCleanedCount'),
        crewMembersCount: document.getElementById('crewMembersCount'),
        trashCollectedCount: document.getElementById('trashCollectedCount'),
        locationStatus: document.getElementById('location-status'),
    };
}

// ========================================
// Utility Functions
// ========================================

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in ms
 */
function debounce(func, delay = 250) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function for performance-sensitive operations
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Show notification messages to user
 */
function showNotification(message, type = 'info') {
    const errorDiv = document.getElementById('weatherError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.className = type === 'error' ? 'error-message' : type === 'success' ? 'success-message' : 'info-message';
        errorDiv.style.display = 'block';
        
        if (type !== 'error') {
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }
    console.log(`[${type.toUpperCase()}] ${message}`);
}

/**
 * Show loading spinner
 */
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="weather-card loading" aria-busy="true"><div class="weather-skeleton"></div></div>';
    }
}

/**
 * Hide loading spinner
 */
function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const loading = element.querySelector('.loading');
        if (loading) loading.remove();
    }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Format date for display
 */
function formatDate(date) {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// ========================================
// Geolocation & Map Features
// ========================================

/**
 * Initialize Leaflet map
 */
function initMap(lat, lon) {
    if (AppState.map) {
        AppState.map.setView([lat, lon], CONFIG.defaultZoom);
    } else {
        AppState.map = L.map('map').setView([lat, lon], CONFIG.defaultZoom);
        L.tileLayer(CONFIG.mapTileLayer, {
            attribution: CONFIG.mapAttribution,
            maxZoom: 19,
        }).addTo(AppState.map);
    }

    // Add current location marker
    const userMarker = L.marker([lat, lon], {
        icon: L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjMDA3N0JFIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==',
            iconSize: [24, 24],
        }),
    }).addTo(AppState.map);

    userMarker.bindPopup('📍 Your Location').openPopup();

    // Add nearby beaches markers
    addBeachMarkers(lat, lon);
}

/**
 * Add beach cleanup location markers
 */
function addBeachMarkers(lat, lon) {
    // Mock beach data - In production, fetch from API
    const mockBeaches = [
        { lat: lat + 0.02, lon: lon + 0.02, name: 'Sunny Cove Beach', cleanup: 'Every Saturday' },
        { lat: lat - 0.015, lon: lon + 0.03, name: 'Coral Bay', cleanup: 'Bi-weekly' },
        { lat: lat + 0.01, lon: lon - 0.025, name: 'Shell Point', cleanup: 'Every Sunday' },
    ];

    mockBeaches.forEach(beach => {
        const distance = calculateDistance(lat, lon, beach.lat, beach.lon).toFixed(1);
        const marker = L.marker([beach.lat, beach.lon], {
            icon: L.icon({
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBkPSJNMTYgMkM4LjMgMiAyIDggMiAxNnM2IDE0IDE0IDE0IDE0LTYgMTQtMTQtNi0xNC0xNC0xNHptMCAxMGMtMi4yIDAtNCAyLjItNCA0czEuOCA0IDQgNCA0LTEuOCA0LTQtMS44LTQtNC00eiIgZmlsbD0iIzAwRDRGRiIvPjwvc3ZnPg==',
                iconSize: [32, 32],
            }),
        }).addTo(AppState.map);

        marker.bindPopup(`
            <strong>${beach.name}</strong><br>
            📍 ${distance} km away<br>
            🔄 ${beach.cleanup}<br>
            <button onclick="viewBeachDetails('${beach.name}')" class="btn btn-primary" style="margin-top: 8px;">Join Cleanup</button>
        `);
    });
}

/**
 * Request user geolocation
 */
function requestGeolocation() {
    if (!navigator.geolocation) {
        showNotification('Geolocation not supported by your browser', 'error');
        return;
    }

    DOM.geoButton.disabled = true;
    DOM.geoButton.textContent = '📍 Finding location...';
    DOM.locationStatus.textContent = '📍 Finding your location...';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            AppState.currentLocation = { latitude, longitude };
            AppState.localStorage.set('userLocation', { latitude, longitude });

            initMap(latitude, longitude);
            fetchWeatherData(latitude, longitude);

            DOM.locationStatus.textContent = `📍 Location found: ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
            DOM.geoButton.textContent = '✓ Location Enabled';
            DOM.geoButton.disabled = true;

            showNotification('Location enabled! Check nearby beaches.', 'success');
        },
        (error) => {
            console.error('Geolocation error:', error);
            DOM.geoButton.disabled = false;
            DOM.geoButton.textContent = '📍 Enable Location';

            // Load mock location if permission denied
            const mockLocation = { latitude: 40.7128, longitude: -74.0060 }; // NYC
            AppState.currentLocation = mockLocation;
            initMap(mockLocation.latitude, mockLocation.longitude);

            showNotification('Using mock location. Grant permission for real coordinates.', 'info');
        },
        {
            timeout: CONFIG.geolocationTimeout,
            maximumAge: 3600000, // 1 hour cache
        }
    );
}

// ========================================
// Weather Features
// ========================================

/**
 * Fetch weather data from NEA (Singapore National Environment Agency)
 * Uses public API from data.gov.sg - No authentication required
 */
async function fetchWeatherData(lat, lon) {
    try {
        showLoading('weatherGrid');
        const errorDiv = document.getElementById('weatherError');
        if (errorDiv) errorDiv.style.display = 'none';

        // Fetch 4-day weather forecast from NEA with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
        
        const response = await fetch(CONFIG.weatherAPI, {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        const weatherData = await response.json();
        
        // Extract 4-day forecast with detailed data
        if (weatherData.items && weatherData.items.length > 0) {
            const todayItem = weatherData.items[0];
            const forecasts = todayItem.forecasts;
            
            // Store full forecast data
            AppState.weatherData = {
                forecasts: forecasts,
                timestamp: todayItem.timestamp,
                updateTimestamp: todayItem.update_timestamp,
            };
            
            // Render 4-day forecast cards with detailed information
            renderWeatherForecast(forecasts);
            console.log('✅ Weather data loaded successfully from NEA API', forecasts);
        } else {
            renderMockWeatherForecast();
        }
    } catch (error) {
        console.error('❌ Weather fetch error:', error.message);
        
        // Show user-friendly error message
        const errorDiv = document.getElementById('weatherError');
        if (errorDiv) {
            errorDiv.textContent = `⚠️ Live weather unavailable. Showing forecast estimate lah! 🌊`;
            errorDiv.className = 'error-message';
            errorDiv.style.display = 'block';
        }
        
        renderMockWeatherForecast();
    }
}

/**
 * Render 4-day weather forecast
 */
function renderWeatherForecast(forecasts) {
    DOM.weatherGrid.innerHTML = '';
    
    if (!forecasts || forecasts.length === 0) {
        renderMockWeatherForecast();
        return;
    }

    // NEA API returns forecasts as array of objects with detailed weather data
    const daysToShow = Math.min(4, forecasts.length);
    
    for (let i = 0; i < daysToShow; i++) {
        const forecast = forecasts[i];
        const date = new Date(forecast.date);
        const dayName = date.toLocaleDateString('en-SG', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-SG', { month: 'short', day: 'numeric' });
        
        const weatherIcon = getWeatherIcon(forecast.forecast);
        const tempHigh = forecast.temperature.high;
        const tempLow = forecast.temperature.low;
        const humidity = forecast.relative_humidity;
        const wind = forecast.wind;
        
        // Day label
        let dayLabel = 'Today';
        if (i === 1) dayLabel = 'Tomorrow';
        if (i >= 2) dayLabel = dayName;
        
        const card = document.createElement('div');
        card.className = 'weather-card forecast-card';
        card.innerHTML = `
            <div class="forecast-day">${dayLabel}</div>
            <div class="forecast-date">${dateStr}</div>
            <div style="font-size: 2.5rem; margin: 10px 0;">${weatherIcon}</div>
            <div class="forecast-condition">${forecast.forecast}</div>
            <div class="forecast-temps">
                <div><strong>${tempHigh}°C</strong> / ${tempLow}°C</div>
            </div>
            <div class="weather-details">
                <div>💧 ${humidity.low}-${humidity.high}%</div>
                <div>💨 ${wind.speed.low}-${wind.speed.high}km/h ${wind.direction}</div>
            </div>
        `;
        
        DOM.weatherGrid.appendChild(card);
    }
}

/**
 * Render mock weather forecast (fallback)
 */
function renderMockWeatherForecast() {
    DOM.weatherGrid.innerHTML = '';
    
    const mockForecasts = [
        { date: new Date(), day: 'Today', condition: 'Partly Cloudy', high: 28, low: 24 },
        { date: new Date(Date.now() + 86400000), day: 'Tomorrow', condition: 'Thunderstorm', high: 26, low: 23 },
        { date: new Date(Date.now() + 172800000), day: 'Day 3', condition: 'Cloudy', high: 29, low: 25 },
        { date: new Date(Date.now() + 259200000), day: 'Day 4', condition: 'Sunny', high: 30, low: 26 },
    ];
    
    mockForecasts.forEach(forecast => {
        const weatherIcon = getWeatherIcon(forecast.condition);
        const card = document.createElement('div');
        card.className = 'weather-card forecast-card';
        card.innerHTML = `
            <div class="forecast-day">${forecast.date.toLocaleDateString('en-SG', { weekday: 'short' })}</div>
            <div class="forecast-date">${forecast.date.toLocaleDateString('en-SG', { month: 'short', day: 'numeric' })}</div>
            <div style="font-size: 2rem; margin: 8px 0;">${weatherIcon}</div>
            <div class="forecast-condition">${forecast.condition}</div>
            <div class="forecast-temps">
                <div class="temp-high">${forecast.high}°C</div>
                <div class="temp-low">${forecast.low}°C</div>
            </div>
        `;
        
        DOM.weatherGrid.appendChild(card);
    });
    
    showNotification('Using mock weather data (Live API unavailable)', 'info');
}

/**
 * Get emoji icon for weather condition
 */
function getWeatherIcon(condition) {
    if (!condition) return '🌤️';
    
    const condLower = condition.toLowerCase();
    
    // Check various weather conditions
    if (condLower.includes('sunny') || condLower.includes('clear')) return '☀️';
    if (condLower.includes('partly cloudy') || condLower.includes('partly')) return '⛅';
    if (condLower.includes('cloudy') || condLower.includes('overcast')) return '☁️';
    if (condLower.includes('thundery') || condLower.includes('thunderstorm')) return '⛈️';
    if (condLower.includes('showers') || condLower.includes('rain')) return '🌧️';
    if (condLower.includes('drizzle')) return '🌦️';
    if (condLower.includes('snow')) return '❄️';
    if (condLower.includes('haze')) return '🌫️';
    if (condLower.includes('fog')) return '🌫️';
    if (condLower.includes('wind')) return '💨';
    
    // Default
    return '🌤️';
}

// ========================================
// Event Management
// ========================================

/**
 * Initialize mock events data
 */
function initializeMockEvents() {
    const mockEvents = [
        {
            id: 1,
            name: '🌊 Sunny Cove Saturday Cleanup',
            location: 'Sentosa Beach',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            crew: 12,
            maxCrew: 25,
        },
        {
            id: 2,
            name: '🐚 Coral Bay Deep Clean',
            location: 'East Coast Park',
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            crew: 8,
            maxCrew: 20,
        },
        {
            id: 3,
            name: '🌅 Shell Point Sunrise Cleanup',
            location: 'Pasir Ris Park',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            crew: 15,
            maxCrew: 30,
        },
    ];

    AppState.events = mockEvents;
    AppState.localStorage.set('events', mockEvents);
    renderEvents();
}

/**
 * Render events list
 */
function renderEvents() {
    DOM.eventsList.innerHTML = '';

    if (AppState.events.length === 0) {
        DOM.eventsList.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No events scheduled yet. Be the first to create one!</p>';
        return;
    }

    AppState.events.forEach(event => {
        const spotsLeft = event.maxCrew - event.crew;
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-date">${formatDate(event.date)}</div>
            <div class="event-name">${event.name}</div>
            <div class="event-location">📍 ${event.location}</div>
            <div class="event-crew">
                👥 ${event.crew}/${event.maxCrew} crew members
                ${spotsLeft > 0 ? `(${spotsLeft} spots left)` : '(Full)'}
            </div>
            <div class="event-actions">
                <button class="btn btn-primary" onclick="joinEvent(${event.id})" 
                    ${spotsLeft === 0 ? 'disabled' : ''}>
                    ${spotsLeft > 0 ? 'Join Cleanup' : 'Full'}
                </button>
                <button class="btn btn-secondary" onclick="shareEvent(${event.id})">
                    Share
                </button>
            </div>
        `;
        DOM.eventsList.appendChild(card);
    });
}

/**
 * Join an event
 */
function joinEvent(eventId) {
    const event = AppState.events.find(e => e.id === eventId);
    if (event && event.crew < event.maxCrew) {
        event.crew++;
        AppState.localStorage.set('events', AppState.events);
        renderEvents();
        showNotification('🔥 Yesss! You in lah! See you at the cleanup! 🌊', 'success');
    }
}

/**
 * Share event
 */
function shareEvent(eventId) {
    const event = AppState.events.find(e => e.id === eventId);
    if (event && navigator.share) {
        navigator.share({
            title: 'ShoreSquad Cleanup Event',
            text: `Let's gooooo! Join us for ${event.name} at ${event.location}! 🌊♻️ #EcoWarriors`,
            url: window.location.href,
        }).catch(err => console.log('Share failed:', err));
    } else {
        showNotification('✓ Event link copied lah! Paste and share! 🌊', 'success');
    }
}

// ========================================
// Crew Management
// ========================================

/**
 * Initialize mock crew data
 */
function initializeMockCrew() {
    const mockMembers = [
        { name: 'Alex', role: 'Organizer', avatar: '🏄' },
        { name: 'Jordan', role: 'Eco-warrior', avatar: '♻️' },
        { name: 'Sam', role: 'Beach Lover', avatar: '🌊' },
        { name: 'Casey', role: 'Supporter', avatar: '💚' },
        { name: 'Maya', role: 'Chief Collector', avatar: '🌱' },
    ];

    AppState.crewMembers = mockMembers;
    AppState.localStorage.set('crew', mockMembers);
    renderCrew();
    updateCrewStats();
}

/**
 * Render crew members
 */
function renderCrew() {
    DOM.crewMembers.innerHTML = '';

    AppState.crewMembers.forEach(member => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <div class="member-avatar">${member.avatar}</div>
            <div class="member-name">${member.name}</div>
            <div class="member-role">${member.role}</div>
        `;
        DOM.crewMembers.appendChild(card);
    });
}

/**
 * Update crew statistics with impact tracking
 */
function updateCrewStats() {
    const stats = AppState.localStorage.get('stats') || {
        beachesCleaned: 5,
        trashCollected: 250,
        impactLog: [
            { beach: 'East Coast Park', kg: 10, date: '2024-12-01', crew: ['Alex', 'Jordan'] },
            { beach: 'Sentosa Cove', kg: 15, date: '2024-11-24', crew: ['Sam', 'Casey'] },
            { beach: 'Pasir Ris Park', kg: 12, date: '2024-11-17', crew: ['Maya', 'Alex'] },
            { beach: 'Changi Beach', kg: 8, date: '2024-11-10', crew: ['Jordan', 'Sam'] },
        ]
    };

    DOM.beachesCleanedCount.textContent = stats.beachesCleaned;
    DOM.crewMembersCount.textContent = AppState.crewMembers.length;
    DOM.trashCollectedCount.textContent = stats.trashCollected;
    
    // Store stats with impact log
    AppState.localStorage.set('stats', stats);
}

// ========================================
// UI Interactions
// ========================================

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
        max-width: 300px;
    `;

    if (type === 'success') {
        toast.style.backgroundColor = '#10B981';
        toast.style.color = 'white';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#EF4444';
        toast.style.color = 'white';
    } else {
        toast.style.backgroundColor = '#0077BE';
        toast.style.color = 'white';
    }

    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Toggle mobile menu
 */
function toggleMenu() {
    const isOpen = DOM.navMenu.classList.toggle('active');
    DOM.menuToggle.setAttribute('aria-expanded', isOpen);
}

/**
 * View beach details
 */
function viewBeachDetails(beachName) {
    showNotification(`Viewing details for ${beachName}`, 'info');
    // In production, navigate to beach detail page
}

// ========================================
// Event Listeners
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM cache first!
    initializeDOMCache();

    // Navigation
    if (DOM.menuToggle) {
        DOM.menuToggle.addEventListener('click', toggleMenu);
    }

    // Close menu on nav link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            DOM.navMenu.classList.remove('active');
            DOM.menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Geolocation button
    if (DOM.geoButton) {
        DOM.geoButton.addEventListener('click', requestGeolocation);
    }

    // CTA button
    if (DOM.ctaButton) {
        DOM.ctaButton.addEventListener('click', () => {
            requestGeolocation();
            setTimeout(() => {
                document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        });
    }

    // Initialize app
    initializeMockEvents();
    initializeMockCrew();

    // Check for saved location
    const savedLocation = AppState.localStorage.get('userLocation');
    if (savedLocation) {
        initMap(savedLocation.latitude, savedLocation.longitude);
        fetchWeatherData(savedLocation.latitude, savedLocation.longitude);
        DOM.locationStatus.textContent = '✓ Using saved location';
        showNotification('🌊 Welcome back, eco-warrior! Let\'s save the beaches lah! 🔥', 'info');
    } else {
        initMap(1.3521, 103.8198); // Default Singapore (Sentosa)
        fetchWeatherData(1.3521, 103.8198);
        showNotification('🌊 Yo! Enable location to find cleanup spots near you! 📍', 'info');
    }

    // Service Worker registration (if supported)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('SW registration failed:', err));
    }

    console.log('🌊 ShoreSquad app initialized successfully! Let\'s save the oceans! 🐚');
});

// ========================================
// Performance: Lazy Load Images
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ========================================
// Responsive Map Resize
// ========================================

window.addEventListener('resize', debounce(() => {
    if (AppState.map) {
        AppState.map.invalidateSize();
    }
}, 250));
