const cityInput = document.getElementById("cityInput");
const weatherButton = document.getElementById("weatherBtn");
const loading = document.getElementById("loading");

//action
weatherButton.addEventListener("click", getCity);

// Get coordinates for a city name
async function getCity() {
    const cityName = cityInput.value.trim();
    if (!cityName) {
        return alert("Please enter a city name");
    };
    
    //Show loading, hide previous results
    loading.style.display = "block";
    document.getElementById("currentWeather").innerHTML = "";
    document.getElementById("stats").innerHTML = "";
    document.getElementById("forecast").innerHTML = "";
    const cityUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;
    const response = await fetch(cityUrl);
    const data = await response.json();


    if (!data.results || data.results.length === 0) {
        loading.style.display = "none";
        return alert("City not found. Please try again.");
    }
    

    const latitude = data.results[0].latitude;
    const longitude = data.results[0].longitude;
    const name = data.results[0].name;
    const country = data.results[0].country;

    //console.log(data.results[0].latitude);
        


    await getWeather(latitude, longitude, name, country);

    loading.style.display = "none";
    cityInput.value = "";
}
// Fetch current weather and 5-day forecast
async function getWeather(latitude , longitude, name, country) {

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    

     displayCurrentWeather(data, name, country);
     displayForecast(data.daily);

 }

 // Update the DOM with current weather data
 function displayCurrentWeather(data, name, country) {
    const currentWeatherDiv = document.getElementById("currentWeather");
    const stats = document.getElementById("stats");
    currentWeatherDiv.innerHTML = `
        <h1>${getWeatherDescription(data.current.weather_code).icon}</h1>
        <h3>${name}, ${country}</h3>
        <h1> ${data.current.temperature_2m}°C</h1>
        <p> ${getWeatherDescription(data.current.weather_code).description}</p>
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
             <p id="uvIndex">${getWeatherDescription(data.current.weather_code).description}</p>
        </div>
    `;

//console.log(data);

}

function displayForecast(daily) { 

    const forecastDiv = document.getElementById("forecast");
    for (let i = 0; i < 5; i++) {
        const date = new Date(daily.time[i]);
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        const dayName = date.toLocaleDateString(undefined, options);
        const maxTemp = daily.temperature_2m_max[i];
        const minTemp = daily.temperature_2m_min[i];
        const { icon, description } = getWeatherDescription(daily.weather_code[i]);
        forecastDiv.innerHTML += `
            <div class="forecast-day">
                <h3 class="forecast-date">${dayName}</h3>
                <p class="forecast-icon">${icon}</p>
                <p class="forecast-max">Max: ${maxTemp}°C</p>
                <p class="forecast-min">Min: ${minTemp}°C</p>
            </div>
        `;
    }
    

}

// Convert a WMO weather code to description and icon
function getWeatherDescription(code) { 
    
        if (code === 0)                      return {description: "Clear sky, perfect day to step out", icon: "🔆"};
        if ([1, 2, 3].includes(code))       return {description: "Partly cloudy, Keep plans flexible", icon: "⛅"};
        if ([45, 48].includes(code))        return {description: "Foggy, Stay alert on the road", icon: "🌫️"};
        if ([51, 53, 55].includes(code))    return {description: "Drizzle, Carry a light umbrella", icon: "🌦️"};
        if ([61, 63, 65].includes(code))    return {description: "Rain, Rain protection is vital", icon: "🌧️"};
        if ([71, 73, 75].includes(code))    return {description: "Snow , Dress warm and move carefully", icon: "❄️"};
        if ([80, 81, 82].includes(code))    return {description: "Rain showers, Weather may change fast", icon: "🌦"};
        if (code === 95)                    return {description: "Thunderstorm, Just stay indoors", icon: "🌧️+⚡"};
        return {description: "Unknown", icon: "❓"};

    //console.log(getWeatherDescription(code));
    


}


// // Show an error message on the page
// function showError(message) {
//     const errorDiv = document.getElementById("error");
//     errorDiv.textContent = message;
//         setTimeout(() => {
//             errorDiv.textContent = "";
//         }, 5000);
//   }


