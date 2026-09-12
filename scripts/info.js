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

const infoHero =
    document.getElementById(
        "info-hero"
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

const aqiStatus =
    document.getElementById(
        "aqi-status"
    );

const aqiProgress =
    document.getElementById(
        "aqi-progress"
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

function getWeatherBackground(
    condition
) {

    condition =
        condition.toLowerCase();

    if (
        condition.includes("thunder")
        ||
        condition.includes("storm")
    ) {
        return "./assets/thunder.jpg";
    }

    if (
        condition.includes("snow")
        ||
        condition.includes("blizzard")
        ||
        condition.includes("sleet")
    ) {
        return "./assets/snow.jpg";
    }

    if (
        condition.includes("rain")
        ||
        condition.includes("drizzle")
        ||
        condition.includes("shower")
    ) {
        return "./assets/rain.jpg";
    }

    if (
        condition.includes("fog")
        ||
        condition.includes("mist")
        ||
        condition.includes("haze")
    ) {
        return "./assets/fog.jpg";
    }

    if (
        condition.includes("cloud")
        ||
        condition.includes("overcast")
    ) {
        return "./assets/cloudy.jpg";
    }

    return "./assets/sunny.jpg";
}

function getAQIInfo(
    index
) {

    switch (index) {

        case 1:
            return {
                text: "🟢 Good",
                className: "aqi-good"
            };

        case 2:
            return {
                text: "🟡 Moderate",
                className: "aqi-moderate"
            };

        case 3:
            return {
                text: "🟠 Sensitive",
                className: "aqi-sensitive"
            };

        case 4:
            return {
                text: "🔴 Unhealthy",
                className: "aqi-unhealthy"
            };

        case 5:
            return {
                text: "🟣 Very Unhealthy",
                className: "aqi-very-unhealthy"
            };

        default:
            return {
                text: "⚫ Hazardous",
                className: "aqi-hazardous"
            };

    }

}

function getAQIPercentage(
    aqi
) {

    switch (aqi) {

        case 1:
            return 16;

        case 2:
            return 33;

        case 3:
            return 50;

        case 4:
            return 66;

        case 5:
            return 83;

        default:
            return 100;

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

    const backgroundImage =
        getWeatherBackground(
            data.current.condition.text
        );

    infoHero.style.backgroundImage =
    `
    linear-gradient(
    rgba(0,0,0,0.4),
    rgba(0,0,0,0.9)
    ),
    url('${backgroundImage}')
    `;

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
    
    const aqiData =
        getAQIInfo(
            data.current.air_quality[
                "us-epa-index"
            ]
        );

    aqiStatus.textContent =
        aqiData.text;

    aqiStatus.className =
        aqiData.className;

    const aqiValue =
        data.current.air_quality[
            "us-epa-index"
        ];

    const percentage =
        getAQIPercentage(
            aqiValue
        );

    aqiProgress.style.width =
        `${percentage}%`;

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

    if (aqiValue === 1) {

        aqiProgress.style.background =
            "#4caf50";

    }
    else if (aqiValue === 2) {

        aqiProgress.style.background =
            "#ffeb3b";

    }
    else if (aqiValue === 3) {

        aqiProgress.style.background =
            "#ff9800";

    }
    else if (aqiValue === 4) {

        aqiProgress.style.background =
            "#f44336";

    }
    else if (aqiValue === 5) {

        aqiProgress.style.background =
            "#9c27b0";

    }
    else {

        aqiProgress.style.background =
            "#7b1fa2";

    }

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