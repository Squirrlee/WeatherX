import {
    API_KEY,
    BASE_URL
} from "./config.js";

const params =
    new URLSearchParams(
        window.location.search
    );

const city =
    params.get("q");

/* Hero */

const cityName =
    document.getElementById(
        "city-name"
    );

const temperature =
    document.getElementById(
        "temperature"
    );

const condition =
    document.getElementById(
        "condition"
    );

/* Weather Info */

const humidity =
    document.getElementById(
        "humidity"
    );

const wind =
    document.getElementById(
        "wind"
    );

const pressure =
    document.getElementById(
        "pressure"
    );

const uv =
    document.getElementById(
        "uv"
    );

/* AQI */

const aqi =
    document.getElementById(
        "aqi"
    );

const pm25 =
    document.getElementById(
        "pm25"
    );

const pm10 =
    document.getElementById(
        "pm10"
    );

const co =
    document.getElementById(
        "co"
    );

/* Forecast */

const forecastContainer =
    document.getElementById(
        "forecast-container"
    );

async function getWeatherData() {

    try {

        const response =
            await fetch(
                `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes`
            );

        const data =
            await response.json();

        renderWeather(
            data
        );

        renderForecast(
            data.forecast.forecastday
        );

    } catch (error) {

        console.log(error);

    }

}

function renderWeather(
    data
) {

    cityName.textContent =
        `${data.location.name}, ${data.location.country}`;

    temperature.textContent =
        `${data.current.temp_c}°C`;

    condition.textContent =
        data.current.condition.text;

    humidity.textContent =
        `${data.current.humidity}%`;

    wind.textContent =
        `${data.current.wind_kph} km/h`;

    pressure.textContent =
        `${data.current.pressure_mb} mb`;

    uv.textContent =
        data.current.uv;

    aqi.textContent =
        data.current.air_quality[
            "us-epa-index"
        ];

    pm25.textContent =
        data.current.air_quality.pm2_5.toFixed(
            1
        );

    pm10.textContent =
        data.current.air_quality.pm10.toFixed(
            1
        );

    co.textContent =
        data.current.air_quality.co.toFixed(
            1
        );

}

function renderForecast(
    forecastDays
) {

    forecastContainer.innerHTML =
        "";

    forecastDays.forEach(
        (day) => {

            forecastContainer.innerHTML +=
                `
                <div class="forecast-card">

                    <h3>
                        ${day.date}
                    </h3>

                    <img
                        src="https:${day.day.condition.icon}"
                        alt=""
                    >

                    <p>
                        ${day.day.avgtemp_c}°C
                    </p>

                    <p>
                        ${day.day.condition.text}
                    </p>

                </div>
                `;
        }
    );

}

if (
    city
) {

    getWeatherData();

} else {

    cityName.textContent =
        "City not found";

}