const loginForm =
    document.getElementById(
        "login-form"
    );

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const email =
            document.getElementById(
                "email"
            ).value;

        const password =
            document.getElementById(
                "password"
            ).value;

        const users =
            JSON.parse(
                localStorage.getItem(
                    "users"
                )
            ) || [];

        const user =
            users.find(
                item =>
                    item.email === email
                    &&
                    item.password === password
            );

        if (!user) {

            alert(
                "Wrong email or password!"
            );

            return;

        }

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        alert(
            "Login successful!"
        );

        window.location.href =
            "index.html";

    }
);