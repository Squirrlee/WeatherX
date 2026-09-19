import {
    API_KEY,
    BASE_URL
} from "./config.js";

const recentSearchesContainer =
    document.getElementById(
        "recent-searches"
    );

const searchForm =
    document.getElementById(
        "search-form"
    );

const searchInput =
    document.getElementById(
        "search-input"
    );

const searchResults =
    document.getElementById(
        "search-results"
    );

/* =========================
   Search Cities
========================= */

async function searchCities(
    cityName
) {

    searchResults.innerHTML = `
        <div class="empty-state">
            🔄 Searching...
        </div>
    `;

    try {

        const response =
            await fetch(
                `${BASE_URL}/search.json?key=${API_KEY}&q=${cityName}`
            );

        const data =
            await response.json();

        renderCities(data);

    } catch (error) {

        console.error(error);

        searchResults.innerHTML = `
            <div class="empty-state">
                ❌ Search failed
            </div>
        `;

    }

}

/* =========================
   Render Cities
========================= */

function renderCities(
    cityList
) {

    searchResults.innerHTML = "";

    if (
        !cityList ||
        cityList.length === 0
    ) {

        searchResults.innerHTML = `
            <div class="empty-state">
                🌍 No cities found
            </div>
        `;

        return;

    }

    cityList.forEach(
        city => {

            searchResults.innerHTML += `
                <a
                    href="./info.html?q=${encodeURIComponent(city.name)}"
                >

                    <div class="city-card">

                        <h3>
                            📍 ${city.name}
                        </h3>

                        <p>
                            ${city.region || "Unknown Region"}
                        </p>

                        <p>
                            ${city.country}
                        </p>

                    </div>

                </a>
            `;

        }
    );

}

/* =========================
   Save Recent Search
========================= */

function saveRecentSearch(
    cityName
) {

    let recentSearches =
        JSON.parse(
            localStorage.getItem(
                "recentSearches"
            )
        ) || [];

    recentSearches =
        recentSearches.filter(
            city =>
                city.toLowerCase() !==
                cityName.toLowerCase()
        );

    recentSearches.unshift(
        cityName
    );

    recentSearches =
        recentSearches.slice(
            0,
            5
        );

    localStorage.setItem(
        "recentSearches",
        JSON.stringify(
            recentSearches
        )
    );

}

/* =========================
   Render Recent Searches
========================= */

function renderRecentSearches() {

    const recentSearches =
        JSON.parse(
            localStorage.getItem(
                "recentSearches"
            )
        ) || [];

    recentSearchesContainer.innerHTML =
        "";

    if (
        recentSearches.length === 0
    ) {

        recentSearchesContainer.innerHTML = `
            <div class="empty-state">
                No recent searches
            </div>
        `;

        return;

    }

    recentSearches.forEach(
        city => {

            recentSearchesContainer.innerHTML += `
                <a
                    href="./info.html?q=${encodeURIComponent(city)}"
                >

                    <div class="city-card">

                        <h3>
                            📍 ${city}
                        </h3>

                    </div>

                </a>
            `;

        }
    );

}

/* =========================
   Form Submit
========================= */

searchForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const cityName =
            searchInput.value.trim();

        if (
            cityName === ""
        ) {
            return;
        }

        saveRecentSearch(
            cityName
        );

        renderRecentSearches();

        searchCities(
            cityName
        );

    }
);

/* =========================
   Init
========================= */

renderRecentSearches();

searchInput.focus();

/* Default Search */

searchCities(
    "Hanoi"
);