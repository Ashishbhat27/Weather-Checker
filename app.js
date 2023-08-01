// Attach an event listener to the form submission event
// Using the 'async' keyword allows us to use 'await' inside the function
document.getElementById('weatherForm').addEventListener('submit', async (event) => {
    // Prevent the form from submitting normally, which would cause the page to reload
    event.preventDefault();

    // Get the city name from the input field
    const city = document.getElementById('city').value;

    // This is your OpenWeatherMap API key
    const apiKey = 'bdbea80df06a0a7b99ad3089bf2b10e2';

    try {
        // Construct the URL for the weather API
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        // Use the fetch API to get the weather data
        // Using 'await' makes JavaScript wait until the Promise resolves
        const weatherResponse = await fetch(weatherUrl);

        // If the request was unsuccessful, throw an error
        if (!weatherResponse.ok) {
            throw new Error(`No weather found for ${city}`);
        }

        // Parse the JSON response
        const weatherData = await weatherResponse.json();

        // Destructure the response to get the needed data
        const { main, name, sys, weather } = weatherData;

        // Get the element where the weather result will be displayed
        const weatherReport = document.getElementById('weatherResult');

        // Display the weather data in a Bootstrap card
        weatherReport.innerHTML = `
            <div class="card mb-4">
                <div class="card-body">
                    <h2 class="card-title">${name}, ${sys.country}</h2>
                    <p class="card-text">${weather[0].description}</p>
                    <p class="card-text">Temp: ${main.temp} &deg;C</p>
                    <p class="card-text">Humidity: ${main.humidity}%</p>
                </div>
            </div>
        `;

        // Construct the URL for the forecast API
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

        // Use the fetch API to get the forecast data
        const forecastResponse = await fetch(forecastUrl);

        // If the request was unsuccessful, throw an error
        if (!forecastResponse.ok) {
            throw new Error(`No forecast found for ${city}`);
        }

        // Parse the JSON response
        const forecastData = await forecastResponse.json();

        // Filter the forecast data for readings at 18:00:00
        const dailyData = forecastData.list.filter(reading => reading.dt_txt.includes("18:00:00"));

        // For each forecast reading...
        dailyData.forEach(item => {
            // Convert the Unix timestamp to a date string
            const date = new Date(item.dt * 1000).toDateString();

            // Destructure the reading to get the needed data
            const {main, weather} = item;

            // Create a new Bootstrap Card for each forecast
            const forecastDiv = document.createElement('div');
            forecastDiv.className = 'card mb-3';
            forecastDiv.innerHTML = `
                <div class="card-body">
                    <h3 class="card-title">${date}</h3>
                    <p class="card-text">${weather[0].description}</p>
                    <p class="card-text">Temp: ${main.temp} &deg;C</p>
                    <p class="card-text">Humidity: ${main.humidity}%</p>
                </div>
            `;

            // Append each forecast card to the weather report div
            weatherReport.appendChild(forecastDiv);
        });

    } catch (err) {
        // If an error occurred, log it to the console and display it in the weather report div
        console.error(err);
        document.getElementById('weatherResult').textContent = err;
    }
});
