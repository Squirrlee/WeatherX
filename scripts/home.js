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

const currentUser =
    JSON.parse(
        localStorage.getItem(
            "currentUser"
        )
    );

if (currentUser) {

    userName.textContent =
        `👤 ${currentUser.username}`;

}

logoutBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "currentUser"
        );

        location.reload();

    }
);

async function getCityWeather(city) {

    const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=yes`
    );

    const data =
        await response.json();

    return data;
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

function getAQIStatus(aqi) {

    if (aqi <= 50) {
        return "Good";
    }

    if (aqi <= 100) {
        return "Moderate";
    }

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
        temp >= 18
        &&
        temp <= 30
    ) {

        score += 30;

    }

    if (aqi <= 2) {

        score += 30;

    }
    else if (aqi <= 3) {

        score += 20;

    }

    if (uv <= 5) {

        score += 20;

    }
    else if (uv <= 7) {

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

async function loadTravelRanking() {

    const results = [];

    for (
        const city
        of travelCities
    ) {

        try {

            const response =
                await fetch(

`${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=yes`

                );

            const data =
                await response.json();

            const score =
                calculateTravelScore(
                    data
                );

            results.push({

                city,

                score,

                temp:
                    data.current.temp_c

            });

        }
        catch (error) {

            console.log(
                error
            );

        }

    }

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

            rankingContainer.innerHTML += `

<div class="city-card">

<h3>
#${index + 1}
${city.city}
</h3>

<p>
Travel Score:
${city.score}/100
</p>

<p>
🌡️ ${city.temp}°C
</p>

</div>

`;

        }
    );

}

function createCityCard(data) {

    const city =
        data.location.name;

    const country =
        data.location.country;

    const temp =
        data.current.temp_c;

    const condition =
        data.current.condition.text;

    const icon =
        data.current.condition.icon;

    return `
        <a
            href="./info.html?q=${city}"
        >

            <div class="city-card">

                <img
                    src="https:${icon}"
                    alt="${city}"
                >

                <div
                    class="city-card-content"
                >

                    <h3>
                        ${city}
                    </h3>

                    <p>
                        ${country}
                    </p>

                    <p>
                        🌡 ${temp}°C
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

function createAQICard(data) {

    const city =
        data.location.name;

    const country =
        data.location.country;

    const usAqi =
        data.current.air_quality[
            "us-epa-index"
        ];

    return `
        <a
            href="./info.html?q=${city}"
        >

            <div class="city-card">

                <div
                    class="city-card-content"
                >

                    <h3>
                        ${city}
                    </h3>

                    <p>
                        ${country}
                    </p>

                    <p>
                        AQI: ${usAqi}
                    </p>

                    <p>
                        ${getAQIStatus(
                            usAqi
                        )}
                    </p>

                </div>

            </div>

        </a>
    `;
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

document.addEventListener(
    "click",
    (event) => {

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

async function renderFeaturedCities() {

    featuredCitiesContainer.innerHTML =
        "";

    for (
        let i = 0;
        i < cityList.length;
        i++
    ) {

        const data =
            await getCityWeather(
                cityList[i]
            );

        featuredCitiesContainer.innerHTML +=
            createCityCard(
                data
            );
    }
}

async function renderAQICities() {

    aqiCitiesContainer.innerHTML =
        "";

    for (
        let i = 0;
        i < cityList.length;
        i++
    ) {

        const data =
            await getCityWeather(
                cityList[i]
            );

        aqiCitiesContainer.innerHTML +=
            createAQICard(
                data
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
            createCityCard(
                data
            );

    } catch (error) {

        myLocationContainer.innerHTML =
            `
            <div class="city-card">

                <div class="city-card-content">

                    <h3>
                        Location Access Denied
                    </h3>

                    <p>
                        Please allow GPS access.
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

    favoriteCitiesContainer.innerHTML =
        "";

    for (
        let i = 0;
        i < favorites.length;
        i++
    ) {

        const data =
            await getCityWeather(
                favorites[i]
            );

        favoriteCitiesContainer.innerHTML +=
            createCityCard(
                data
            );
    }

}

function getCurrentPosition() {

    return new Promise(
        (resolve, reject) => {

            navigator.geolocation.getCurrentPosition(
                resolve,
                reject
            );

        }
    );

}

loadTravelRanking();

async function init() {

    await renderMyLocation();

    await renderFavorites();

    await renderFeaturedCities();

    await renderAQICities();

}     
init();