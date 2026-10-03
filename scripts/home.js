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

const userName =
    document.getElementById(
        "user-name"
    );

const logoutBtn =
    document.getElementById(
        "logout-btn"
    );

const loginLink =
    document.getElementById(
        "login-link"
    );

const registerLink =
    document.getElementById(
        "register-link"
    );

const currentUser =
    JSON.parse(
        localStorage.getItem(
            "currentUser"
        )
    );
if (currentUser) {

    userName.textContent =
        `👤 ${currentUser.username}`;

    userName.style.display =
        "inline";

    logoutBtn.style.display =
        "inline-block";

    loginLink.style.display =
        "none";

    registerLink.style.display =
        "none";

}
else {

    userName.style.display =
        "none";

    logoutBtn.style.display =
        "none";

    loginLink.style.display =
        "inline-block";

    registerLink.style.display =
        "inline-block";

}

logoutBtn?.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "currentUser"
        );

        window.location.reload();

    }
);

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

async function renderFeaturedCities() {

    featuredCitiesContainer.innerHTML =
        "<p>Loading cities...</p>";

    try {

        const weatherResults =
            await Promise.all(

                cityList.map(
                    city =>
                        getCityWeather(
                            city
                        )
                )

            );

        const cards =
            await Promise.all(

                weatherResults.map(
                    data =>
                        createCityCard(
                            data
                        )
                )

            );

        featuredCitiesContainer.innerHTML =
            cards.join("");

    }
    catch {

        featuredCitiesContainer.innerHTML =
            `
            <div class="city-card">

                <div class="city-card-content">

                    <h3>
                        Failed
                    </h3>

                    <p>
                        Cannot load cities
                    </p>

                </div>

            </div>
            `;

    }

}

async function renderAQICities() {
    showSkeleton(aqiCitiesContainer, 6);
    try {
        const results = await Promise.all(
            cityList.map(city => getCityWeather(city))
        );
        aqiCitiesContainer.innerHTML = results.map(createAQICard).join("");
    } catch {
        showError(
            aqiCitiesContainer,
            "Không thể tải AQI",
            "Vui lòng kiểm tra kết nối mạng",
            "renderAQICities()"
        );
    }
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

function renderTravelRanking(
    cities
) {

    rankingContainer.innerHTML =
        "";

    cities.forEach(
        (
            city,
            index
        ) => {

            rankingContainer.innerHTML +=
                `
                <div class="city-card">

                    <div class="city-card-content">

                        <h3>
                            🏆 #${index + 1}
                        </h3>

                        <p>
                            ${city.city}
                        </p>

                        <p>
                            Travel Score:
                            ${city.score}/100
                        </p>

                        <p>
                            🌡️ ${city.temp}°C
                        </p>

                    </div>

                </div>
                `;

        }
    );

}

async function loadTravelRanking() {

    try {

        const results =
            await Promise.all(

                travelCities.map(
                    async city => {

                        const response =
                            await fetch(

`${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=yes`

                            );

                        const data =
                            await response.json();

                        return {

                            city,

                            score:
                                calculateTravelScore(
                                    data
                                ),

                            temp:
                                data.current.temp_c

                        };

                    }
                )

            );

        results.sort(
            (
                a,
                b
            ) =>
                b.score - a.score
        );

        renderTravelRanking(
            results
        );

    }
    catch (
        error
    ) {

        console.log(
            error
        );

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