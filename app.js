
// DATE AND TIME

function updateDateTime() {

    let now = new Date();

    let date = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    let time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    document.getElementById("date").innerText = date;

    document.getElementById("time").innerText = time;

}

updateDateTime();

setInterval(updateDateTime, 1000);

// WEATHER INFORMATION


function getWeatherInfo(code) {

    let weather = {

        0: {
            condition: "Clear Sky",
            icon: "fa-sun",
            description: "The sky is clear with plenty of sunshine."
        },

        1: {
            condition: "Mainly Clear",
            icon: "fa-cloud-sun",
            description: "The weather is mainly clear."
        },

        2: {
            condition: "Partly Cloudy",
            icon: "fa-cloud-sun",
            description: "The sky is partly covered with clouds."
        },

        3: {
            condition: "Overcast",
            icon: "fa-cloud",
            description: "The sky is covered with clouds."
        },

        45: {
            condition: "Fog",
            icon: "fa-smog",
            description: "Foggy conditions are present."
        },

        48: {
            condition: "Fog",
            icon: "fa-smog",
            description: "Depositing fog is present."
        },

        51: {
            condition: "Light Drizzle",
            icon: "fa-cloud-rain",
            description: "Light drizzle is falling."
        },

        53: {
            condition: "Drizzle",
            icon: "fa-cloud-rain",
            description: "Moderate drizzle is falling."
        },

        55: {
            condition: "Heavy Drizzle",
            icon: "fa-cloud-showers-heavy",
            description: "Heavy drizzle is falling."
        },

        61: {
            condition: "Light Rain",
            icon: "fa-cloud-rain",
            description: "Light rain is falling."
        },

        63: {
            condition: "Moderate Rain",
            icon: "fa-cloud-showers-heavy",
            description: "Moderate rain is falling."
        },

        65: {
            condition: "Heavy Rain",
            icon: "fa-cloud-showers-heavy",
            description: "Heavy rain is falling."
        },

        71: {
            condition: "Light Snow",
            icon: "fa-snowflake",
            description: "Light snow is falling."
        },

        73: {
            condition: "Snow",
            icon: "fa-snowflake",
            description: "Snow is falling."
        },

        75: {
            condition: "Heavy Snow",
            icon: "fa-snowflake",
            description: "Heavy snow is falling."
        },

        80: {
            condition: "Rain Showers",
            icon: "fa-cloud-rain",
            description: "Rain showers are occurring."
        },

        81: {
            condition: "Rain Showers",
            icon: "fa-cloud-showers-heavy",
            description: "Moderate rain showers are occurring."
        },

        82: {
            condition: "Heavy Rain Showers",
            icon: "fa-cloud-showers-heavy",
            description: "Violent rain showers are occurring."
        },

        95: {
            condition: "Thunderstorm",
            icon: "fa-cloud-bolt",
            description: "Thunderstorm conditions are present."
        },

        96: {
            condition: "Thunderstorm",
            icon: "fa-cloud-bolt",
            description: "Thunderstorm with hail is possible."
        },

        99: {
            condition: "Heavy Thunderstorm",
            icon: "fa-cloud-bolt",
            description: "Heavy thunderstorm with hail is possible."
        }

    };
    return weather[code] || {

        condition: "Unknown Weather",

        icon: "fa-cloud",

        description: "Weather information is unavailable."

    };

}

// SEARCH CITY


async function searchCity(city) {

    try {

        document.getElementById("condition").innerText = "Searching...";

        let geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json&countryCode=LK`;

        let response = await fetch(geoURL);

        if (!response.ok) {
            throw new Error("City search failed");
        }

        let geoData = await response.json();
        if (!geoData.results || geoData.results.length === 0) {

            alert("Sri Lanka wala me nagaraya hoyaganna ba!");

            document.getElementById("condition").innerText = "City Not Found";

            return;

        }

        let location = geoData.results[0];
        let latitude = location.latitude;
        let longitude = location.longitude;
        let cityName = location.name;
        let country = location.country;
        getWeather(latitude, longitude, cityName, country);

    } catch (error) {

        console.log("Search Error:", error);

        alert("City Search Failed!");

    }

}

// GET CURRENT WEATHER

async function getWeather(latitude, longitude, city, country) {

    try {

        document.getElementById("condition").innerText = "Loading...";

        let weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m&timezone=auto`;

        let response = await fetch(weatherURL);
        if (!response.ok) {
            throw new Error("Weather API failed");
        }
        let data = await response.json();
        displayCurrentWeather(data, city, country);

    } catch (error) {
        console.log("Weather API Error:", error);
        alert("Unable to load weather!");
        document.getElementById("condition").innerText = "Weather Unavailable";
    }

}

// DISPLAY  WEATHER


function displayCurrentWeather(data, city, country) {

    let current = data.current;

    let weather = getWeatherInfo(current.weather_code);

    document.getElementById("temperature").innerText =
        Math.round(current.temperature_2m) + "°C";

    document.getElementById("condition").innerText =
        weather.condition;

    document.getElementById("cityName").innerText =
        city + ", " + country;

    document.getElementById("mainIcon").className =
        "fa-solid " + weather.icon;

    document.getElementById("feelsLike").innerText =
        Math.round(current.apparent_temperature) + "°C";

    document.getElementById("humidity").innerText =
        current.relative_humidity_2m + "%";

    document.getElementById("windSpeed").innerText =
        current.wind_speed_10m + " km/h";

    document.getElementById("pressure").innerText =
        current.surface_pressure + " hPa";


    document.getElementById("weatherDescription").innerText =
        weather.description;

}

// SEARCH FORM

document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let city = document.getElementById("cityInput").value.trim();
    if (city !== "") {

        searchCity(city);

    }

});

// DEFAULT CITY


searchCity("Colombo");