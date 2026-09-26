        import {
            API_KEY,
            BASE_URL,
            UNSPLASH_ACCESS_KEY
        } from "./config.js";

        /* =========================
        LOGIN CHECK
        ========================= */

        const currentUser =
            JSON.parse(
                localStorage.getItem(
                    "currentUser"
                )
            );

        // Bỏ comment nếu muốn bắt buộc login

        /*
        if (!currentUser) {

            window.location.href =
                "login.html";

        }
        */

        /* =========================
        GET CITY
        ========================= */

        const params =
            new URLSearchParams(
                window.location.search
            );

        const city =
            params.get("q");

        /* =========================
        HERO
        ========================= */

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

        /* =========================
        WEATHER INFO
        ========================= */

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

        /* =========================
        AQI
        ========================= */

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

        /* =========================
        STATISTICS
        ========================= */

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

        /* =========================
        UV
        ========================= */

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

        /* =========================
        TRAVEL
        ========================= */

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

        /* =========================
        AI
        ========================= */

        const aiAdvice =
            document.getElementById(
                "ai-advice"
            );

        /* =========================
        FORECAST
        ========================= */

        const forecastContainer =
            document.getElementById(
                "forecast-container"
            );

        /* =========================
        LOAD WEATHER
        ========================= */

        async function getWeatherData() {

            try {

                cityName.textContent =
                    "Loading...";

                const response =
                    await fetch(
                        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes`
                    );

                const data =
                    await response.json();

                await renderWeather(
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

            }
            catch (error) {

                console.error(
                    error
                );

                cityName.textContent =
                    "Unable to load weather";

                condition.textContent =
                    "Please try again later";

            }

        }

        /* =========================
        AI ADVICE
        ========================= */

        function renderAIAdvice(
            data
        ) {

            const advice = [];

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
                    "👕 Hot weather, wear light clothes"
                );

            }
            else if (temp <= 18) {

                advice.push(
                    "🧥 Bring a jacket"
                );

            }

            if (uv >= 7) {

                advice.push(
                    "🧴 Use sunscreen"
                );

                advice.push(
                    "😎 Wear sunglasses"
                );

            }

            if (aqi >= 4) {

                advice.push(
                    "😷 Air quality is poor"
                );

            }

            if (
                condition.includes(
                    "rain"
                )
            ) {

                advice.push(
                    "☔ Bring an umbrella"
                );

            }
            else {

                advice.push(
                    "🌤️ No umbrella needed"
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
                    "🏃 Great for outdoor activities"
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

        /* =========================
        TRAVEL SCORE
        ========================= */

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

            if (
                temp >= 18
                &&
                temp <= 30
            ) score += 30;

            if (aqi <= 2)
                score += 30;
            else if (aqi <= 3)
                score += 20;

            if (uv <= 5)
                score += 20;
            else if (uv <= 7)
                score += 10;

            if (
                !condition.includes(
                    "rain"
                )
            )
                score += 20;

            travelScore.textContent =
                `${score}/100`;

            if (score >= 80) {

                travelStars.textContent =
                    "⭐⭐⭐⭐⭐";

                travelStatus.textContent =
                    "Excellent";

            }
            else if (score >= 60) {

                travelStars.textContent =
                    "⭐⭐⭐⭐☆";

                travelStatus.textContent =
                    "Good";

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
                    "Poor";

            }

        }
        /* =========================
        UV INFO
        ========================= */

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

        /* =========================
        UV CARD
        ========================= */

        function renderUV(
            data
        ) {

            const currentUV =
                data.current.uv;

            const uvInfo =
                getUVInfo(
                    currentUV
                );

            uvValue.textContent =
                currentUV;

            uvStatus.textContent =
                uvInfo.text;

            uvStatus.style.color =
                uvInfo.color;

            const percentage =
                Math.min(
                    (currentUV / 12) * 100,
                    100
                );

            uvProgress.style.width =
                `${percentage}%`;

            uvProgress.style.background =
                uvInfo.color;

        }

        /* =========================
        BACKGROUND
        ========================= */

        async function getWeatherBackground(
        condition
    ) {

        condition =
            condition.toLowerCase();

        let query = "weather";

        if (
            condition.includes("thunder")
            ||
            condition.includes("storm")
        ) {

            query = "thunderstorm weather";

        }
        else if (
            condition.includes("snow")
            ||
            condition.includes("blizzard")
            ||
            condition.includes("sleet")
        ) {

            query = "snow weather";

        }
        else if (
            condition.includes("rain")
            ||
            condition.includes("drizzle")
            ||
            condition.includes("shower")
        ) {

            query = "rain weather";

        }
        else if (
            condition.includes("fog")
            ||
            condition.includes("mist")
            ||
            condition.includes("haze")
        ) {

            query = "fog weather";

        }
        else if (
            condition.includes("cloud")
            ||
            condition.includes("overcast")
        ) {

            query = "cloudy sky weather";

        }
        else {

            query = "sunny sky weather";

        }

        try {

            const response =
                await fetch(
                    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                        query
                    )}&per_page=1&orientation=landscape`,
                    {
                        headers: {
                            Authorization:
                                `Client-ID ${UNSPLASH_ACCESS_KEY}`
                        }
                    }
                );

            const data =
                await response.json();

            if (
                data.results &&
                data.results.length > 0
            ) {

                return data.results[0].urls.regular;

            }

        }
        catch (error) {

            console.log(error);

        }

        return "https://images.unsplash.com/photo-1506744038136-46273834b3fb";

    }

        /* =========================
        SUN INFO
        ========================= */

        function renderSunInfo(
            forecastDays
        ) {

            sunrise.textContent =
                forecastDays[0]
                    .astro
                    .sunrise;

            sunset.textContent =
                forecastDays[0]
                    .astro
                    .sunset;

        }

        /* =========================
        STATISTICS
        ========================= */

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

            highestTemp.textContent =
                `${Math.max(
                    ...maxTemps
                )}°C`;

            lowestTemp.textContent =
                `${Math.min(
                    ...minTemps
                )}°C`;

            averageTemp.textContent =
                `${(
                    avgTemps.reduce(
                        (
                            a,
                            b
                        ) =>
                            a + b,
                        0
                    )
                    /
                    avgTemps.length
                ).toFixed(1)}°C`;

            maxWind.textContent =
                `${Math.max(
                    ...winds
                )} km/h`;

        }

        /* =========================
        AQI INFO
        ========================= */

        function getAQIInfo(
            index
        ) {

            switch (index) {

                case 1:

                    return {

                        text: "🟢 Good",

                        className:
                            "aqi-good"

                    };

                case 2:

                    return {

                        text: "🟡 Moderate",

                        className:
                            "aqi-moderate"

                    };

                case 3:

                    return {

                        text: "🟠 Sensitive",

                        className:
                            "aqi-sensitive"

                    };

                case 4:

                    return {

                        text: "🔴 Unhealthy",

                        className:
                            "aqi-unhealthy"

                    };

                case 5:

                    return {

                        text:
                            "🟣 Very Unhealthy",

                        className:
                            "aqi-very-unhealthy"

                    };

                default:

                    return {

                        text:
                            "⚫ Hazardous",

                        className:
                            "aqi-hazardous"

                    };

            }

        }

        /* =========================
        AQI %
        ========================= */

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

        function getAQIColor(
            aqi
        ) {

            const colors = {

                1: "#4caf50",

                2: "#ffeb3b",

                3: "#ff9800",

                4: "#f44336",

                5: "#9c27b0"

            };

            return (
                colors[aqi]
                ||
                "#7b1fa2"
            );

        }

        /* =========================
        MAIN WEATHER
        ========================= */

        async function renderWeather(
            data
        ) {

            cityName.textContent =
                `${data.location.name}, ${data.location.country}`;

            temperature.textContent =
                `${data.current.temp_c}°C`;

            condition.textContent =
                data.current.condition.text;

            const backgroundImage =
                await getWeatherBackground(
                    data.current.condition.text
                );

            infoHero.style.backgroundImage =
                `
                linear-gradient(
                    rgba(0,0,0,0.45),
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

            const aqiValue =
                data.current.air_quality[
                    "us-epa-index"
                ];

            aqi.textContent =
                aqiValue;

            const aqiData =
                getAQIInfo(
                    aqiValue
                );

            aqiStatus.textContent =
                aqiData.text;

            aqiStatus.className =
                aqiData.className;

            aqiProgress.style.width =
                `${getAQIPercentage(
                    aqiValue
                )}%`;

            aqiProgress.style.background =
                getAQIColor(
                    aqiValue
                );

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
        /* =========================
        WEATHER CHART
        ========================= */

        function renderWeatherChart(
            forecastDays
        ) {

            const chartCanvas =
                document.getElementById(
                    "weatherChart"
                );

            if (!chartCanvas)
                return;

            const labels =
                forecastDays.map(
                    day => day.date
                );

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

            const textColor =
                getComputedStyle(
                    document.body
                ).getPropertyValue(
                    "--text-color"
                );

            new Chart(
                chartCanvas,
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
                                    "rgba(255,77,77,0.15)",

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
                                    "rgba(0,191,255,0.15)",

                                borderWidth:
                                    3,

                                tension:
                                    0.4

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio:
                            false,

                        plugins: {

                            legend: {

                                labels: {

                                    color:
                                        textColor

                                }

                            }

                        },

                        scales: {

                            x: {

                                ticks: {

                                    color:
                                        textColor

                                }

                            },

                            y: {

                                ticks: {

                                    color:
                                        textColor

                                }

                            }

                        }

                    }

                }

            );

        }

        /* =========================
        FORECAST
        ========================= */

        function renderForecast(
            forecastDays
        ) {

            let html = "";

            forecastDays.forEach(
                day => {

                    html +=
                    `
                    <div class="forecast-card">

                        <h3>
                            ${day.date}
                        </h3>

                        <img
                            src="https:${day.day.condition.icon}"
                            alt="${day.day.condition.text}"
                        >

                        <p>
                            🌡️ ${day.day.avgtemp_c}°C
                        </p>

                        <p>
                            ${day.day.condition.text}
                        </p>

                    </div>
                    `;

                }
            );

            forecastContainer.innerHTML =
                html;

        }

        /* =========================
        INIT
        ========================= */

        async function init() {

            if (!city) {

                cityName.textContent =
                    "City not found";

                temperature.textContent =
                    "--";

                condition.textContent =
                    "No city selected";

                return;

            }

            await getWeatherData();

        }

        /* =========================
        START
        ========================= */

        init();