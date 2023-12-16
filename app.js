const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiKey = '8030bfbb1e44911e550ce532d5496706'; // replace weather api and url of the server that you use

app.post('/getWeather', async (req, res) => {
    try {
        const { cities } = req.body;
        const temperatureResults = await getTemperatureData(cities);
        res.json({ success: true, temperature: temperatureResults });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

async function getTemperatureData(cities) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const units = 'metric'; // 'metric' for Celsius

    const temperaturePromises = cities.map(async (city) => {
        try {
            const response = await axios.get(apiUrl, {
                params: {
                    q: city,
                    appid: apiKey,
                    units: units,
                },
            });

            const temperature = response.data.main?.temp;
            return { city, temperature: `${temperature}°C` };
        } catch (error) {
            console.error(`Error fetching temperature for ${city}:`, error.message);
            return { city, temperature: 'Error fetching data' };
        }
    });

    return Promise.all(temperaturePromises);
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
