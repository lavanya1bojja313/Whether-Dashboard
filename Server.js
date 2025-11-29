const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows your frontend to communicate with this backend
app.use(express.json());

// CONFIGURATION
// Replace 'YOUR_API_KEY_HERE' with your actual OpenWeatherMap API key
const API_KEY = 'YOUR_API_KEY_HERE'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Endpoint: GET /weather
 * Usage: http://localhost:5000/weather?city=London
 */
app.get('/weather', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        // Fetch data from OpenWeatherMap
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric' // Change to 'imperial' for Fahrenheit
            }
        });

        // Structure the data for your dashboard
        const weatherData = {
            city: response.data.name,
            temp: response.data.main.temp,
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        };

        res.json(weatherData);

    } catch (error) {
        // Handle errors (e.g., city not found)
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.message });
        } else {
            res.status(500).json({ error: 'Server error fetching weather data' });
        }
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});