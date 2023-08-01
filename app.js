document.getElementById('weatherForm').addEventListener('submit', async (event) => { // <-- make the callback async
    event.preventDefault();

    const city = document.getElementById('city').value;
    const apiKey = 'bdbea80df06a0a7b99ad3089bf2b10e2'; // replace with your OpenWeatherMap API key

    try {
        // Fetch current weather
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const weatherResponse = await fetch(weatherUrl); // <-- use await to wait for the promise to resolve

        if (!weatherResponse.ok) {
            throw new Error(`No weather found for ${city}`);
        }

        const weatherData = await weatherResponse.json(); // <-- and again here

        const { main, name, sys, weather } = weatherData;
        const weatherReport = document.getElementById('weatherResult');
        weatherReport.innerHTML = `
            <h2>${name}, ${sys.country}</h2>
            <p>${weather[0].description}</p>
            <p>Temp: ${main.temp} &deg;C</p>
            <p>Humidity: ${main.humidity}%</p>
        `;

        // Fetch 5 day forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
        const forecastResponse = await fetch(forecastUrl);

        if (!forecastResponse.ok) {
            throw new Error(`No forecast found for ${city}`);
        }

        const forecastData = await forecastResponse.json();

        const dailyData = forecastData.list.filter(reading => reading.dt_txt.includes("18:00:00"));

        dailyData.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            const {main, weather} = item;
            const forecastDiv = document.createElement('div');
            forecastDiv.innerHTML = `
                <h3>${date}</h3>
                <p>${weather[0].description}</p>
                <p>Temp: ${main.temp} &deg;C</p>
                <p>Humidity: ${main.humidity}%</p>
            `;
            weatherReport.appendChild(forecastDiv);
        });

    } catch (err) {
        console.error(err);
        document.getElementById('weatherResult').textContent = err;
    }
});
