import {
    API_KEY,
    BASE_URL,
    UNSPLASH_ACCESS_KEY
} from "./config.js";

const favoriteCitiesContainer =
    document.getElementById(
        "favorite-cities"
    );

const myLocationContainer =
    document.getElementById(
        "my-location"
    );

const featuredCitiesContainer =
    document.getElementById(
        "featured-cities"
    );

const aqiCitiesContainer =
    document.getElementById(
        "aqi-cities"
    );

const rankingContainer =
    document.getElementById(
        "travel-ranking"
    );

const travelCities = [

    "Tokyo",
    "Seoul",
    "Paris",
    "London",
    "Singapore",
    "Sydney",
    "Hanoi",
    "Ho Chi Minh City",
    "New York",
    "Bangkok",
    "Dubai"

];

const cityList = [

    "Hanoi",
    "Tokyo",
    "London",
    "Paris",
    "New York",
    "Sydney"

];

/* =========================
AUTHENTICATION
========================= */
const userName = document.getElementById("user-name");
const logoutBtn = document.getElementById("logout-btn");
const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");

function updateAuthUI() {
    try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        
        if (currentUser && currentUser.username) {
            userName.textContent = `👤 ${currentUser.username}`;
            userName.style.display = "inline-block";
            logoutBtn.style.display = "inline-block";
            loginLink.style.display = "none";
            registerLink.style.display = "none";
        } else {
            userName.style.display = "none";
            logoutBtn.style.display = "none";
            loginLink.style.display = "inline-block";
            registerLink.style.display = "inline-block";
        }
    } catch (error) {
        console.error("Auth error:", error);
        // Fallback
        userName.style.display = "none";
        logoutBtn.style.display = "none";
        loginLink.style.display = "inline-block";
        registerLink.style.display = "inline-block";
    }
}

// Call on load
updateAuthUI();

// Logout handler
logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    updateAuthUI(); // Update ngay không cần reload
    window.location.href = "./index.html";
});

function showSkeleton(container, count = 4) {
    container.innerHTML = Array(count)
        .fill('<div class="skeleton skeleton-card"></div>')
        .join('');
}

function showError(container, title, message, onRetry = null) {
    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>${title}</h3>
            <p>${message}</p>
            ${onRetry ? `<button onclick="${onRetry}">🔄 Thử lại</button>` : ''}
        </div>
    `;
}

async function renderFeaturedCities() {
    showSkeleton(featuredCitiesContainer, 6);
    try {
        const weatherResults = await Promise.all(
            cityList.map(city => getCityWeather(city))
        );
        const cards = await Promise.all(
            weatherResults.map(data => createCityCard(data))
        );
        featuredCitiesContainer.innerHTML = cards.join("");
    } catch {
        showError(
            featuredCitiesContainer,
            "Không thể tải thành phố",
            "Vui lòng kiểm tra kết nối mạng",
            "renderFeaturedCities()"
        );
    }
}

async function getCityWeather(
    city
) {

    const response =
        await fetch(

`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=yes`

        );

    return await response.json();

}

function getCurrentPosition() {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            navigator
                .geolocation
                .getCurrentPosition(
                    resolve,
                    reject
                );

        }
    );

}

function saveFavoriteCity(
    cityName
) {

    let favorites =
        JSON.parse(
            localStorage.getItem(
                "favorites"
            )
        ) || [];

    if (
        favorites.includes(
            cityName
        )
    ) {
        return;
    }

    favorites.push(
        cityName
    );

    localStorage.setItem(
        "favorites",
        JSON.stringify(
            favorites
        )
    );

}

function removeFavoriteCity(
    cityName
) {

    let favorites =
        JSON.parse(
            localStorage.getItem(
                "favorites"
            )
        ) || [];

    favorites =
        favorites.filter(
            city =>
                city !== cityName
        );

    localStorage.setItem(
        "favorites",
        JSON.stringify(
            favorites
        )
    );

}
function getAQIStatus(
    aqi
) {

    if (aqi <= 50)
        return "Good";

    if (aqi <= 100)
        return "Moderate";

    return "Unhealthy";

}

function calculateTravelScore(
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
        temp >= 18 &&
        temp <= 30
    ) {

        score += 30;

    }

    if (
        aqi <= 2
    ) {

        score += 30;

    }
    else if (
        aqi <= 3
    ) {

        score += 20;

    }

    if (
        uv <= 5
    ) {

        score += 20;

    }
    else if (
        uv <= 7
    ) {

        score += 10;

    }

    if (
        !condition.includes(
            "rain"
        )
    ) {

        score += 20;

    }

    return score;

}

function getWeatherIcon(
    condition
) {

    condition =
        condition.toLowerCase();

    if (
        condition.includes("thunder")
        ||
        condition.includes("storm")
    ) {
        return "wi-thunderstorm";
    }

    if (
        condition.includes("snow")
    ) {
        return "wi-snow";
    }

    if (
        condition.includes("rain")
        ||
        condition.includes("drizzle")
        ||
        condition.includes("shower")
    ) {
        return "wi-rain";
    }

    if (
        condition.includes("fog")
        ||
        condition.includes("mist")
        ||
        condition.includes("haze")
    ) {
        return "wi-fog";
    }

    if (
        condition.includes("cloud")
        ||
        condition.includes("overcast")
    ) {
        return "wi-cloudy";
    }

    return "wi-day-sunny";

}

async function getCityImage(
    city,
    country
) {

    try {

        let response =
            await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                    city + " " + country
                )}&per_page=1&orientation=landscape`,
                {
                    headers: {
                        Authorization:
                            `Client-ID ${UNSPLASH_ACCESS_KEY}`
                    }
                }
            );

        let data =
            await response.json();

        if (
            data.results &&
            data.results.length > 0
        ) {

            return data
                .results[0]
                .urls
                .regular;

        }

        response =
            await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                    country
                )}&per_page=1&orientation=landscape`,
                {
                    headers: {
                        Authorization:
                            `Client-ID ${UNSPLASH_ACCESS_KEY}`
                    }
                }
            );

        data =
            await response.json();

        if (
            data.results &&
            data.results.length > 0
        ) {

            return data
                .results[0]
                .urls
                .regular;

        }

    }
    catch (error) {

        console.log(error);

    }

    return "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
}

async function createCityCard(
    data
) {

    const city =
        data.location.name;

    const country =
        data.location.country;

    const temp =
        data.current.temp_c;

    const condition =
        data.current.condition.text;

    const cityImage =
        await getCityImage(
            city,
            country
        );

    return `
<a href="./info.html?q=${city}">

<div class="city-card">

<div class="city-image">

<img
    src="${cityImage}"
    alt="${city}"
    loading="lazy"
>

</div>

<div class="city-card-content">

<h3>${city}</h3>

<div class="city-temp">
    ${temp}°C
</div>

<div class="city-condition">
    ${condition}
</div>

<div class="city-country">
    📍 ${country}
</div>

<div class="card-actions">

<button
class="favorite-btn"
data-city="${city}"
>
❤️ Favorite
</button>

<button
class="remove-btn"
data-city="${city}"
>
❌ Remove
</button>

</div>

</div>

</div>

</a>
`;
}

function createAQICard(
    data
) {

    const city =
        data.location.name;

    const country =
        data.location.country;

    const aqi =
        data.current.air_quality[
            "us-epa-index"
        ];

    return `
<a href="./info.html?q=${city}">

<div class="city-card">

<div class="city-card-content">

<h3>${city}</h3>

<p>${country}</p>

<p>
AQI: ${aqi}
</p>

<p>
${getAQIStatus(aqi)}
</p>

</div>

</div>

</a>
`;
}

async function renderAQICities() {
    showSkeleton(aqiCitiesContainer, 6);
    try {
        const results = await Promise.all(
            cityList.map(city => getCityWeather(city))
        );
        
        // 1. Render List View (Danh sách dọc)
        aqiCitiesContainer.innerHTML = results.map((item, index) => {
            const aqiIndex = item.current.air_quality["us-epa-index"]; // 1 đến 5
            const aqiPercentage = (aqiIndex / 5) * 100;
            const aqiColor = aqiIndex <= 2 ? '#4caf50' : 
                             aqiIndex <= 3 ? '#ffeb3b' : 
                             aqiIndex <= 4 ? '#ff9800' : '#f44336';
            
            // Chuyển index 1-5 thành text mô tả
            const aqiText = aqiIndex === 1 ? "Good" : 
                            aqiIndex === 2 ? "Moderate" : 
                            aqiIndex === 3 ? "Sensitive" : 
                            aqiIndex === 4 ? "Unhealthy" : "Very Unhealthy";

            return `
                <div class="aqi-list-item">
                    <div class="aqi-list-info">
                        <div class="aqi-list-rank">#${index + 1}</div>
                        <div class="aqi-list-city">
                            <h3>${item.location.name}</h3>
                            <p>${item.location.country}</p>
                        </div>
                    </div>
                    <div class="aqi-list-bar">
                        <div class="aqi-bar-bg">
                            <div class="aqi-bar-fill" style="width: ${aqiPercentage}%; background: ${aqiColor}"></div>
                        </div>
                    </div>
                    <div class="aqi-list-value">
                        <span class="aqi-number" style="color: ${aqiColor}">${aqiIndex}</span>
                        <span class="aqi-label">${aqiText}</span>
                    </div>
                </div>
            `;
        }).join('');

        // 2. ✅ GỌI HÀM RENDER BIỂU ĐỒ NGAY SAU KHI CÓ DỮ LIỆU
        renderAQIChart(results);

    } catch {
        showError(
            aqiCitiesContainer,
            "Không thể tải AQI",
            "Vui lòng kiểm tra kết nối mạng",
            "renderAQICities()"
        );
    }
}

// ✅ HÀM RENDER BIỂU ĐỒ (Đã sửa lỗi CSS variable và thêm destroy chart cũ)
function renderAQIChart(citiesData) {
    const chartCanvas = document.getElementById('aqiChart');
    if (!chartCanvas) return;

    // Lấy màu text đúng cách từ CSS variable
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-color').trim();

    // Hủy biểu đồ cũ nếu có (tránh lỗi "Canvas is already in use" khi reload)
    if (window.aqiChartInstance) {
        window.aqiChartInstance.destroy();
    }

    const ctx = chartCanvas.getContext('2d');
    window.aqiChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: citiesData.map(c => c.location.name),
            datasets: [{
                label: 'AQI Index (1-5)',
                data: citiesData.map(c => c.current.air_quality["us-epa-index"]),
                backgroundColor: citiesData.map(c => {
                    const aqi = c.current.air_quality["us-epa-index"];
                    return aqi <= 2 ? '#4caf50' : 
                           aqi <= 3 ? '#ffeb3b' : 
                           aqi <= 4 ? '#ff9800' : '#f44336';
                }),
                borderRadius: 8,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const aqi = context.raw;
                            const labels = ["", "Good", "Moderate", "Sensitive", "Unhealthy", "Very Unhealthy"];
                            return `AQI: ${aqi} (${labels[aqi] || "Hazardous"})`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: { 
                        color: textColor,
                        stepSize: 1 // Hiển thị từng số nguyên 1, 2, 3, 4, 5
                    },
                    grid: { color: 'rgba(128, 128, 128, 0.1)' }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { display: false }
                }
            }
        }
    });
}

async function renderFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.length === 0) {
        favoriteCitiesContainer.innerHTML = `
            <div class="city-card">
                <div class="city-card-content">
                    <h3>❤️ Chưa có thành phố yêu thích</h3>
                    <p>Hãy thêm thành phố bạn thích nhé!</p>
                </div>
            </div>
        `;
        return;
    }
    showSkeleton(favoriteCitiesContainer, favorites.length);
    try {
        const results = await Promise.all(
            favorites.map(city => getCityWeather(city))
        );
        const cards = await Promise.all(
            results.map(data => createCityCard(data))
        );
        favoriteCitiesContainer.innerHTML = cards.join("");
    } catch {
        showError(
            favoriteCitiesContainer,
            "Không thể tải yêu thích",
            "Vui lòng thử lại sau",
            "renderFavorites()"
        );
    }
}

async function renderMyLocation() {

    try {

        const position =
            await getCurrentPosition();

        const lat =
            position.coords.latitude;

        const lon =
            position.coords.longitude;

        const response =
            await fetch(

`${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=1&aqi=yes`

            );

        const data =
            await response.json();

        myLocationContainer.innerHTML =
            await createCityCard(
                data
            );

    }
    catch {

        myLocationContainer.innerHTML =
            `
            <div class="city-card">

                <div class="city-card-content">

                    <h3>
                        📍 Location Access Denied
                    </h3>

                    <p>
                        Please allow GPS access
                    </p>

                </div>

            </div>
            `;

    }

}

function renderTravelRanking(cities) {
    const tbody = document.getElementById("travel-ranking-body");
    
    tbody.innerHTML = cities.map((city, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : "rank-other";
        const rankIcon = rank === 1 ? "" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
        
        return `
            <tr>
                <td>
                    <div class="rank-badge ${rankClass}">
                        ${rankIcon}
                    </div>
                </td>
                <td>
                    <div class="table-city">
                        <img src="${city.image || './assets/default-city.jpg'}" alt="${city.city}">
                        <div>
                            <div class="table-city-name">${city.city}</div>
                            <div class="table-city-country">${city.country}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${city.score}/100</strong>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${city.score}%"></div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="weather-mini">
                        <span class="weather-mini-icon">${city.weatherIcon}</span>
                        <span>${city.temp}°C</span>
                    </div>
                </td>
                <td>
                    <span class="aqi-badge aqi-${city.aqi <= 2 ? 'good' : city.aqi <= 3 ? 'moderate' : 'bad'}">
                        ${city.aqi} - ${getAQIStatus(city.aqi)}
                    </span>
                </td>
                <td>
                    <a href="./info.html?q=${encodeURIComponent(city.city)}" class="btn btn-primary">
                        View Details
                    </a>
                </td>
            </tr>
        `;
    }).join("");
}

// Cập nhật hàm loadTravelRanking
async function loadTravelRanking() {
    try {
        const results = await Promise.all(
            travelCities.map(async city => {
                const response = await fetch(
                    `${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=yes`
                );
                const data = await response.json();
                return {
                    city,
                    country: data.location.country,
                    score: calculateTravelScore(data),
                    temp: data.current.temp_c,
                    aqi: data.current.air_quality["us-epa-index"],
                    weatherIcon: getWeatherIcon(data.current.condition.text),
                    image: await getCityImage(city, data.location.country)
                };
            })
        );
        results.sort((a, b) => b.score - a.score);
        renderTravelRanking(results);
    } catch (error) {
        console.error("Error loading travel ranking:", error);
    }
}

document.addEventListener(
    "click",
    event => {

        if (

            event.target.classList.contains(
                "favorite-btn"
            )

        ) {

            event.preventDefault();

            const city =
                event.target.dataset.city;

            saveFavoriteCity(
                city
            );

            renderFavorites();

        }

        if (

            event.target.classList.contains(
                "remove-btn"
            )

        ) {

            event.preventDefault();

            const city =
                event.target.dataset.city;

            removeFavoriteCity(
                city
            );

            renderFavorites();

        }

    }
);

async function init() {

    await renderMyLocation();

    await renderFavorites();

    await renderFeaturedCities();

    await renderAQICities();

    await loadTravelRanking();

}

init();