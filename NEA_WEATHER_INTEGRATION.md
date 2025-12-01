# NEA Weather API Integration

## Overview

ShoreSquad now integrates with Singapore's official **National Environment Agency (NEA)** weather API from **data.gov.sg** for real-time, accurate weather forecasting.

## API Details

### Endpoint
- **URL**: `https://api.data.gov.sg/v1/environment/4-day-weather-forecast`
- **Method**: GET
- **Authentication**: None required (public API)
- **Response Format**: JSON

### Features

✅ **4-Day Weather Forecast**
- Real-time weather data from Singapore's official source
- Updated regularly throughout the day
- No authentication required
- Completely free to use

### Additional NEA APIs Available (Optional)
- **PSI (Air Quality)**: `https://api.data.gov.sg/v1/environment/psi`
- **UV Index**: `https://api.data.gov.sg/v1/environment/uv-index`

## API Response Structure

The API returns weather data in the following format:

```json
{
  "api_info": {
    "status": "healthy"
  },
  "items": [
    {
      "update_timestamp": "2024-01-15T18:00:00+08:00",
      "valid_period": {
        "start": "2024-01-15T18:00:00+08:00",
        "end": "2024-01-16T18:00:00+08:00"
      },
      "forecasts": [
        {
          "area": "Ang Mo Kio",
          "forecast": "Cloudy"
        },
        // ... more areas
      ],
      "forecast": [
        {
          "date": "2024-01-15",
          "forecast": "Partly Cloudy",
          "temperature": {
            "low": 24,
            "high": 28
          }
        },
        // ... up to 4 days
      ]
    }
  ]
}
```

## Implementation Details

### Configuration (`js/app.js`)

```javascript
const CONFIG = {
    weatherAPI: 'https://api.data.gov.sg/v1/environment/4-day-weather-forecast',
    psiAPI: 'https://api.data.gov.sg/v1/environment/psi',
    uvAPI: 'https://api.data.gov.sg/v1/environment/uv-index',
    // ... other config
};
```

### Functions

#### `fetchWeatherData(lat, lon)`
- Fetches 4-day weather forecast from NEA API
- Falls back to mock data if API unavailable
- Handles errors gracefully
- **Called on**: App initialization and geolocation updates

#### `renderWeatherForecast(forecasts)`
- Renders up to 4 days of forecast cards
- Displays: Day, Date, Weather Icon, Condition, High/Low Temperature
- Shows loading state during fetch
- Responsive grid layout (4 columns on desktop, 1 on mobile)

#### `renderMockWeatherForecast()`
- Fallback display showing mock data
- Ensures app remains functional if API is unavailable
- Displays notification indicating mock data usage

### UI Components

**Forecast Cards Display:**
- Located in "4-Day Forecast" section
- Each card shows:
  - Day of week (Mon, Tue, etc.)
  - Date (Jan 15, Jan 16, etc.)
  - Weather emoji icon
  - Weather condition (Sunny, Cloudy, Thunderstorm, etc.)
  - High temperature (°C)
  - Low temperature (°C)

**Responsive Design:**
- Desktop (>768px): 4 cards in a row
- Tablet (480-768px): 2 cards per row
- Mobile (<480px): 1 card full width

### Weather Icons

The app uses emoji weather icons mapped to conditions:
- ☀️ Sunny
- ⛅ Partly Cloudy
- ☁️ Cloudy
- 🌧️ Thunderstorm/Rainy
- 💨 Strong Wind

## Units & Measurements

All weather data displayed in **metric units**:
- 🌡️ Temperature: **°C** (Celsius)
- 💨 Wind Speed: **km/h** (kilometers per hour)
- 📊 Pressure: **hPa** (hectopascals)
- 📏 Distance: **km** (kilometers)

## Error Handling

If the NEA API is unavailable:
1. Console error is logged
2. Mock weather data is displayed
3. User notification shows "Using mock weather data (Live API unavailable)"
4. App continues to function normally

## Performance Considerations

- **Fetch Optimization**: Single API call for 4-day forecast (efficient)
- **Caching**: Weather data stored in `AppState.weatherData`
- **Lazy Loading**: Weather section uses Intersection Observer for optimal performance
- **No DOM Thrashing**: Batch DOM updates when rendering cards

## Testing the API

### Manual Test (Browser Console)
```javascript
// Test API call
fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e));
```

### Expected Response Time
- Typically < 500ms from Singapore
- Max 2000ms before fallback to mock data

## Limitations

- API returns data for **Singapore only**
- 4-day forecast only (not 7-day)
- Data updated 3-4 times daily (approximately 6am, 12pm, 6pm, 12am)
- Weather icons are predefined (limited options)

## Future Enhancements

Potential improvements:
- ✨ Add PSI (air quality index) overlay on weather cards
- ✨ Add UV Index display
- ✨ Add wind direction (North, South, etc.)
- ✨ Add 7-day forecast if data becomes available
- ✨ Add hourly forecast view
- ✨ Add historical weather comparison

## Resources

- **NEA Data Portal**: https://data.gov.sg
- **Weather API Docs**: https://data.gov.sg/datasets/d_8fefc410b38022c9a98a7c9f908e2cfe/view
- **Singapore Weather**: https://www.weather.gov.sg

## Commit History

- **Commit 8b8dc57**: "Implement NEA weather API integration with 4-day forecast display"
  - Added `fetchWeatherData()` with NEA API integration
  - Added `renderWeatherForecast()` for 4-day display
  - Updated HTML section title to "4-Day Forecast"
  - Added forecast card CSS styling
  - Graceful fallback to mock data

---

**Last Updated**: January 2024
**Status**: ✅ Production Ready
