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

async function searchCities(
    cityName
) {

    try {

        const response =
            await fetch(
                `${BASE_URL}/search.json?key=${API_KEY}&q=${cityName}`
            );

        const data =
            await response.json();

        renderCities(data);

    } catch (error) {

        console.log(error);

    }

}

function renderCities(
    cityList
) {

    searchResults.innerHTML =
        "";

    if (
        cityList.length === 0
    ) {

        searchResults.innerHTML =
            `
                <p>
                    No cities found.
                </p>
            `;

        return;
    }

    cityList.forEach(
        (city) => {

            searchResults.innerHTML +=
                `
                <a
                    href="./info.html?q=${city.name}"
                >

                    <div
                        class="city-card"
                    >

                        <h3>
                            ${city.name}
                        </h3>

                        <p>
                            ${city.region}
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
                city !== cityName
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

function renderRecentSearches() {

    const recentSearches =
        JSON.parse(
            localStorage.getItem(
                "recentSearches"
            )
        ) || [];

    recentSearchesContainer.innerHTML =
        "";

    recentSearches.forEach(
        city => {

            recentSearchesContainer.innerHTML +=
                `
                <a
                    href="./info.html?q=${city}"
                >

                    <div
                        class="city-card"
                    >

                        <h3>
                            ${city}
                        </h3>

                    </div>

                </a>
                `;
        }
    );

}

searchForm.addEventListener(
    "submit",
    (event) => {

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

renderRecentSearches();