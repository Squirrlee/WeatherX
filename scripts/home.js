import {
    API_KEY,
    BASE_URL
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

function getWeatherImage(
    condition
) {

    condition =
        condition.toLowerCase();

    if (
        condition.includes("thunder")
        ||
        condition.includes("storm")
    ) {
        return "./assets/weather-icons/storm.png";
    }

    if (
        condition.includes("snow")
    ) {
        return "./assets/weather-icons/snow.png";
    }

    if (
        condition.includes("rain")
        ||
        condition.includes("drizzle")
    ) {
        return "./assets/weather-icons/rain.png";
    }

    if (
        condition.includes("fog")
        ||
        condition.includes("mist")
    ) {
        return "./assets/weather-icons/fog.png";
    }

    if (
        condition.includes("cloud")
        ||
        condition.includes("overcast")
    ) {
        return "./assets/weather-icons/cloudy.png";
    }

    return "./assets/weather-icons/sunny.png";

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
function createCityCard(
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

    const icon =
        getWeatherImage(
            data.current.condition.text
        );

    return `
<a href="./info.html?q=${city}">

<div class="city-card">

<img
    src="${icon}"
    alt="${city}"
    class="weather-icon"
>

<div class="city-card-content">

<h3>${city}</h3>

<p>
📍 ${country}
</p>

<p>
🌡️ ${temp}°C
</p>

<p>
${condition}
</p>

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

        const results =
            await Promise.all(

                cityList.map(
                    city =>
                        getCityWeather(
                            city
                        )
                )

            );

        featuredCitiesContainer.innerHTML =
            results
                .map(
                    createCityCard
                )
                .join("");

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

    aqiCitiesContainer.innerHTML =
        "<p>Loading AQI...</p>";

    try {

        const results =
            await Promise.all(

                cityList.map(
                    city =>
                        getCityWeather(
                            city
                        )
                )

            );

        aqiCitiesContainer.innerHTML =
            results
                .map(
                    createAQICard
                )
                .join("");

    }
    catch {

        aqiCitiesContainer.innerHTML =
            `
            <div class="city-card">

                <div class="city-card-content">

                    <h3>
                        Failed
                    </h3>

                    <p>
                        Cannot load AQI
                    </p>

                </div>

            </div>
            `;

    }

}

async function renderFavorites() {

    const favorites =
        JSON.parse(
            localStorage.getItem(
                "favorites"
            )
        ) || [];

    if (
        favorites.length === 0
    ) {

        favoriteCitiesContainer.innerHTML =
            `
            <div class="city-card">

                <div class="city-card-content">

                    <h3>
                        ❤️ No Favorite Cities
                    </h3>

                    <p>
                        Add cities you like
                    </p>

                </div>

            </div>
            `;

        return;

    }

    try {

        const results =
            await Promise.all(

                favorites.map(
                    city =>
                        getCityWeather(
                            city
                        )
                )

            );

        favoriteCitiesContainer.innerHTML =
            results
                .map(
                    createCityCard
                )
                .join("");

    }
    catch {

        favoriteCitiesContainer.innerHTML =
            `
            <div class="city-card">

                <div class="city-card-content">

                    <h3>
                        Failed
                    </h3>

                    <p>
                        Cannot load favorites
                    </p>

                </div>

            </div>
            `;

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
            createCityCard(
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