/**
 * ShoreSquad - Main Application JavaScript
 * Features: Geolocation, Weather API, Map Integration, Event Management
 * Performance optimizations: Lazy loading, debouncing, caching
 */

// ========================================
// Configuration & Constants
// ========================================

const CONFIG = {
    weatherAPI: 'https://api.openweathermap.org/data/2.5/weather',
    apiKey: 'YOUR_API_KEY_HERE', // User needs to add their own API key
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

const DOM = {
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
 * Distance calculation using Haversine formula (for nearby beaches)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
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
 * Fetch weather data from API
 */
async function fetchWeatherData(lat, lon) {
    try {
        DOM.weatherGrid.innerHTML = '<div class="weather-card loading"><div class="weather-skeleton"></div></div>';

        // Mock weather data (replace with real API call when API key available)
        const weatherData = {
            main: {
                temp: Math.round(22 + Math.random() * 8),
                humidity: Math.round(60 + Math.random() * 30),
                pressure: 1013,
            },
            weather: [
                {
                    main: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
                    description: 'mostly cloudy with 20% chance of rain',
                }
            ],
            wind: {
                speed: Math.round(5 + Math.random() * 15),
            },
        };

        AppState.weatherData = weatherData;
        renderWeatherCard(weatherData);
    } catch (error) {
        console.error('Weather fetch error:', error);
        showNotification('Could not fetch weather data', 'error');
        DOM.weatherGrid.innerHTML = '<p>Weather data unavailable</p>';
    }
}

/**
 * Render weather card
 */
function renderWeatherCard(data) {
    const { main, weather, wind } = data;
    const condition = weather[0];
    const weatherIcon = getWeatherIcon(condition.main);

    const card = document.createElement('div');
    card.className = 'weather-card';
    card.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 8px;">${weatherIcon}</div>
        <div class="weather-temp">${main.temp}°C</div>
        <div class="weather-condition">${condition.main}</div>
        <div class="weather-details">
            <div>💨 Wind: ${wind.speed} km/h</div>
            <div>💧 Humidity: ${main.humidity}%</div>
            <div>📊 Pressure: ${main.pressure} hPa</div>
        </div>
    `;

    DOM.weatherGrid.innerHTML = '';
    DOM.weatherGrid.appendChild(card);
}

/**
 * Get emoji icon for weather condition
 */
function getWeatherIcon(condition) {
    const icons = {
        'Sunny': '☀️',
        'Cloudy': '☁️',
        'Rainy': '🌧️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Clear': '🌟',
    };
    return icons[condition] || '🌤️';
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
            name: 'Sunny Cove Saturday Cleanup',
            location: 'Sunny Cove Beach',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            crew: 12,
            maxCrew: 25,
        },
        {
            id: 2,
            name: 'Coral Bay Deep Clean',
            location: 'Coral Bay',
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            crew: 8,
            maxCrew: 20,
        },
        {
            id: 3,
            name: 'Shell Point Sunrise Cleanup',
            location: 'Shell Point',
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
        showNotification('✓ You joined the cleanup! See you there! 🌊', 'success');
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
            text: `Join us for ${event.name} at ${event.location}! 🌊`,
            url: window.location.href,
        }).catch(err => console.log('Share failed:', err));
    } else {
        showNotification('Event link copied to clipboard!', 'success');
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
 * Update crew statistics
 */
function updateCrewStats() {
    const stats = AppState.localStorage.get('stats') || {
        beachesCleaned: 5,
        trashCollected: 250,
    };

    DOM.beachesCleanedCount.textContent = stats.beachesCleaned;
    DOM.crewMembersCount.textContent = AppState.crewMembers.length;
    DOM.trashCollectedCount.textContent = stats.trashCollected;
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
    } else {
        initMap(40.7128, -74.0060); // Default NYC
    }

    // Service Worker registration (if supported)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('SW registration failed:', err));
    }

    console.log('🌊 ShoreSquad app initialized successfully!');
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
