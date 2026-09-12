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

const cityList = [
    "Hanoi",
    "Tokyo",
    "London",
    "Paris",
    "New York",
    "Sydney"
];

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

async function init() {

    await renderMyLocation();

    await renderFavorites();

    await renderFeaturedCities();

    await renderAQICities();

}     
init();