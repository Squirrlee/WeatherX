import {
    API_KEY,
    BASE_URL
} from "./config.js";

const currentUser =
    JSON.parse(
        localStorage.getItem(
            "currentUser"
        )
    );

if (!currentUser) {

    window.location.href =
        "login.html";

}

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

const sunrise =
    document.getElementById(
        "sunrise"
    );

const sunset =
    document.getElementById(
        "sunset"
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

const highestTemp =
    document.getElementById(
        "highest-temp"
    );

const lowestTemp =
    document.getElementById(
        "lowest-temp"
    );

const averageTemp =
    document.getElementById(
        "average-temp"
    );

const maxWind =
    document.getElementById(
        "max-wind"
    );

const uvValue =
    document.getElementById(
        "uv-value"
    );

const uvStatus =
    document.getElementById(
        "uv-status"
    );

const uvProgress =
    document.getElementById(
        "uv-progress"
    );

const travelScore =
    document.getElementById(
        "travel-score"
    );

const travelStars =
    document.getElementById(
        "travel-stars"
    );

const travelStatus =
    document.getElementById(
        "travel-status"
    );

const aiAdvice =
    document.getElementById(
        "ai-advice"
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

        renderWeatherChart(
            data.forecast.forecastday
        );

        renderStatistics(
            data.forecast.forecastday
        );

        renderSunInfo(
            data.forecast.forecastday
        );

        renderUV(
            data
        );

        renderTravelScore(
            data
        );

        renderAIAdvice(
            data
        );
    } catch (error) {

        console.log(error);

    }

}

function renderAIAdvice(
    data
) {

    let advice = [];

    const temp =
        data.current.temp_c;

    const uv =
        data.current.uv;

    const aqi =
        data.current.air_quality[
            "us-epa-index"
        ];

    const condition =
        data.current.condition.text
            .toLowerCase();

    if (temp >= 30) {

        advice.push(
            "👕 Nên mặc áo mỏng"
        );

    }
    else if (temp <= 18) {

        advice.push(
            "🧥 Nên mang áo khoác"
        );

    }

    if (uv >= 7) {

        advice.push(
            "🧴 UV cao, nên dùng kem chống nắng"
        );

        advice.push(
            "😎 Đeo kính râm khi ra ngoài"
        );

    }

    if (aqi >= 4) {

        advice.push(
            "😷 Chất lượng không khí kém, nên đeo khẩu trang"
        );

    }

    if (
        condition.includes(
            "rain"
        )
    ) {

        advice.push(
            "☔ Nên mang theo ô"
        );

    }
    else {

        advice.push(
            "🌤️ Không cần mang ô"
        );

    }

    if (
        temp >= 20
        &&
        temp <= 30
        &&
        aqi <= 2
    ) {

        advice.push(
            "🏃 Thích hợp hoạt động ngoài trời"
        );

    }

    aiAdvice.innerHTML =
        advice
            .map(
                item =>
                    `<div class="ai-item">${item}</div>`
            )
            .join("");

}

function renderTravelScore(
    data
) {

    let score = 0;

    const temp =
        data.current.temp_c;

    const aqi =
        data.current.air_quality[
            "us-epa-index"
        ];

    const uv =
        data.current.uv;

    const condition =
        data.current.condition.text
            .toLowerCase();

    // Temperature

    if (
        temp >= 18
        &&
        temp <= 30
    ) {
        score += 30;
    }

    // AQI

    if (aqi <= 2) {

        score += 30;

    }
    else if (aqi <= 3) {

        score += 20;

    }

    // UV

    if (uv <= 5) {

        score += 20;

    }
    else if (uv <= 7) {

        score += 10;

    }

    // Rain

    if (
        !condition.includes(
            "rain"
        )
    ) {

        score += 20;

    }

    travelScore.textContent =
        `${score}/100`;

    if (score >= 80) {

        travelStars.textContent =
            "⭐⭐⭐⭐⭐";

        travelStatus.textContent =
            "Great For Travel";

    }
    else if (score >= 60) {

        travelStars.textContent =
            "⭐⭐⭐⭐☆";

        travelStatus.textContent =
            "Good For Travel";

    }
    else if (score >= 40) {

        travelStars.textContent =
            "⭐⭐⭐☆☆";

        travelStatus.textContent =
            "Average";

    }
    else {

        travelStars.textContent =
            "⭐⭐☆☆☆";

        travelStatus.textContent =
            "Not Recommended";

    }

}

function getUVInfo(
    uv
) {

    if (uv <= 2) {

        return {
            text: "🟢 Low",
            color: "#4caf50"
        };

    }

    if (uv <= 5) {

        return {
            text: "🟡 Moderate",
            color: "#ffeb3b"
        };

    }

    if (uv <= 7) {

        return {
            text: "🟠 High",
            color: "#ff9800"
        };

    }

    if (uv <= 10) {

        return {
            text: "🔴 Very High",
            color: "#f44336"
        };

    }

    return {
        text: "🟣 Extreme",
        color: "#9c27b0"
    };

}

function renderUV(
    data
) {

    const uv =
        data.current.uv;

    const uvInfo =
        getUVInfo(
            uv
        );

    uvValue.textContent =
        uv;

    uvStatus.textContent =
        uvInfo.text;

    uvStatus.style.color =
        uvInfo.color;

    const percentage =
        Math.min(
            (uv / 12) * 100,
            100
        );

    uvProgress.style.width =
        `${percentage}%`;

    uvProgress.style.background =
        uvInfo.color;

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

function renderSunInfo(
    forecastDays
) {

    sunrise.textContent =
        forecastDays[0].astro.sunrise;

    sunset.textContent =
        forecastDays[0].astro.sunset;

}

function renderStatistics(
    forecastDays
) {

    const maxTemps =
        forecastDays.map(
            day =>
                day.day.maxtemp_c
        );

    const minTemps =
        forecastDays.map(
            day =>
                day.day.mintemp_c
        );

    const avgTemps =
        forecastDays.map(
            day =>
                day.day.avgtemp_c
        );

    const winds =
        forecastDays.map(
            day =>
                day.day.maxwind_kph
        );

    const highest =
        Math.max(
            ...maxTemps
        );

    const lowest =
        Math.min(
            ...minTemps
        );

    const average =
        (
            avgTemps.reduce(
                (a, b) => a + b,
                0
            )
            /
            avgTemps.length
        ).toFixed(1);

    const wind =
        Math.max(
            ...winds
        );

    highestTemp.textContent =
        `${highest}°C`;

    lowestTemp.textContent =
        `${lowest}°C`;

    averageTemp.textContent =
        `${average}°C`;

    maxWind.textContent =
        `${wind} km/h`;

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

function renderWeatherChart(
    forecastDays
) {

    const labels =
        forecastDays.map(
            day => day.date
        );

    const maxTemps =
        forecastDays.map(
            day => day.day.maxtemp_c
        );

    const minTemps =
        forecastDays.map(
            day => day.day.mintemp_c
        );

    const ctx =
        document.getElementById(
            "weatherChart"
        );

    new Chart(
        ctx,
        {

            type: "line",

            data: {

                labels,

                datasets: [

                    {

                        label:
                            "Max Temp °C",

                        data:
                            maxTemps,

                        borderColor:
                            "#ff4d4d",

                        backgroundColor:
                            "rgba(255,77,77,0.2)",

                        borderWidth:
                            3,

                        tension:
                            0.4

                    },

                    {

                        label:
                            "Min Temp °C",

                        data:
                            minTemps,

                        borderColor:
                            "#00bfff",

                        backgroundColor:
                            "rgba(0,191,255,0.2)",

                        borderWidth:
                            3,

                        tension:
                            0.4

                    }

                ]

            },

            options: {

                responsive:
                    true,

                plugins: {

                    legend: {

                        labels: {

                            color:
                                "white"

                        }

                    }

                },

                scales: {

                    x: {

                        ticks: {

                            color:
                                "white"

                        }

                    },

                    y: {

                        ticks: {

                            color:
                                "white"

                        }

                    }

                }

            }

        }
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