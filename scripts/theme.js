document.addEventListener(
    "DOMContentLoaded",
    () => {

        const themeButton =
            document.getElementById(
                "theme-toggle"
            );

        if (!themeButton) {
            return;
        }

        /* =========================
           Apply Theme
        ========================= */

        function applyTheme(
            theme
        ) {

            if (
                theme === "light"
            ) {

                document.body.classList.add(
                    "light-theme"
                );

                themeButton.textContent =
                    "☀️";

            } else {

                document.body.classList.remove(
                    "light-theme"
                );

                themeButton.textContent =
                    "🌙";

            }

        }

        /* =========================
           Load Saved Theme
        ========================= */

        const savedTheme =
            localStorage.getItem(
                "theme"
            ) || "dark";

        applyTheme(
            savedTheme
        );

        /* =========================
           Toggle Theme
        ========================= */

        themeButton.addEventListener(
            "click",
            () => {

                const currentTheme =
                    document.body.classList.contains(
                        "light-theme"
                    )
                        ? "light"
                        : "dark";

                const newTheme =
                    currentTheme === "light"
                        ? "dark"
                        : "light";

                applyTheme(
                    newTheme
                );

                localStorage.setItem(
                    "theme",
                    newTheme
                );

            }
        );

    }
);