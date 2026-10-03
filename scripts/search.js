import {
    API_KEY,
    BASE_URL,
    UNSPLASH_ACCESS_KEY
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

async function searchCities(cityName) {
    // Thay thế text "🔄 Searching..." bằng skeleton
    searchResults.innerHTML = Array(6)
        .fill('<div class="skeleton skeleton-card"></div>')
        .join('');
    
    try {
        const response = await fetch(
            `${BASE_URL}/search.json?key=${API_KEY}&q=${cityName}`
        );
        const data = await response.json();
        renderCities(data);
    } catch (error) {
        console.error(error);
        searchResults.innerHTML = `
            <div class="error-state">
                <div class="error-icon">❌</div>
                <h3>Tìm kiếm thất bại</h3>
                <p>Vui lòng thử lại với từ khóa khác</p>
            </div>
        `;
    }
}       

/* =========================
   Render Cities
========================= */

async function renderCities(
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

    for (const city of cityList) {

        const image =
            await getCityImage(
                city.name,
                city.country
            );

        searchResults.innerHTML += `

            <a
                href="./info.html?q=${encodeURIComponent(city.name)}"
            >

                <div class="city-card">

                    <div class="city-image">

                        <img
                            src="${image}"
                            alt="${city.name}"
                        >

                    </div>

                    <div class="city-card-content">

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

                </div>

            </a>

        `;

    }

}

async function getCityImage(
    city,
    country
) {

    try {

        const response =
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