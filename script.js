cityInput = document.getElementById("cityInput");
weatherButton = document.getElementById("weatherBtn");

//action
weatherButton.addEventListener("click", getCity);

// Get coordinates for a city name
async function getCity() {
    const cityName = cityInput.value.trim();
    if (cityName == "") {
        return alert("Please enter a city name")
    } ;
    const cityUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;
    const response = await fetch(cityUrl);
    const data = await response.json();
    

    const latitude = data.results[0].latitude;
    const longitude = data.results[0].longitude;
    const name = data.results[0].name;
    const country = data.results[0].country;

    //console.log(data.results[0].latitude);
        


    await getWeather(latitude, longitude, name, country);
}
// Fetch current weather and 5-day forecast
async function getWeather(latitude , longitude, name, country) {

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;
    const response = await fetch(weatherUrl);
    const data = await response.json();


    const timeZone = data.timezone;
    const currentTemperature = data.current.temperature_2m;
    const currentHumidity = data.current.relative_humidity_2m;
    const currentWindSpeed = data.current.wind_speed_10m;
    const currentWeatherCode = data.current.weather_code;
    const dailyMaxTemperature = data.daily.temperature_2m_max[0-4];
    const dailyMinTemperature = data.daily.temperature_2m_min[0-4];
    const dailyTime = data.daily.time[0-4];
    

    await displayCurrentWeather(data, name, country);

 }

 // Update the DOM with current weather data
async function displayCurrentWeather(data, name, country) {
    const currentWeatherDiv = document.getElementById("currentWeather");
    const stats = document.getElementById("stats");
    currentWeatherDiv.innerHTML = `
        <h3>${name}, ${country}</h3>
        <h1> ${data.current.temperature_2m}°C</h1>
    `;

    stats.innerHTML = `
        <div> 
            <p>Humidity</p>
             <p id="humidity">${data.current.relative_humidity_2m}%</p>
        </div>
        <hr>
        <div>
            <p>Wind</p>
             <p id="wind">${data.current.wind_speed_10m} km/h</p>
        </div>
        <hr>
        <div>
            <p>UV Index</p>
             <p id="uvIndex">${data.current.weather_code}</p>
        </div>
    `;

console.log(data);

}

function displayForecast(daily) { 
    

}

// Convert a WMO weather code to description and icon
function getWeatherDescription(code) {  }


// Show an error message on the page
function showError(message) {  }


// Main function triggered by the Search button
async function handleSearch() {  }
