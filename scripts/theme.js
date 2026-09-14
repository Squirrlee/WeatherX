document.addEventListener(
    "DOMContentLoaded",
    () => {

        const themeButton =
            document.getElementById(
                "theme-toggle"
            );

        if (!themeButton)
            return;

        const savedTheme =
            localStorage.getItem(
                "theme"
            );

        if (
            savedTheme ===
            "light"
        ) {

            document.body.classList.add(
                "light-theme"
            );

            themeButton.textContent =
                "☀️";

        }

        themeButton.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "light-theme"
                );

                if (
                    document.body.classList.contains(
                        "light-theme"
                    )
                ) {

                    localStorage.setItem(
                        "theme",
                        "light"
                    );

                    themeButton.textContent =
                        "☀️";

                }
                else {

                    localStorage.setItem(
                        "theme",
                        "dark"
                    );

                    themeButton.textContent =
                        "🌙";

                }

            }
        );

    }
);