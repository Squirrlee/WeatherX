const registerForm =
    document.getElementById(
        "register-form"
    );

registerForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const username =
            document.getElementById(
                "username"
            ).value;

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

        const exists =
            users.find(
                user =>
                    user.email === email
            );

        if (exists) {

            alert(
                "Email already exists!"
            );

            return;

        }

        users.push({

            username,
            email,
            password

        });

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        alert(
            "Register successful!"
        );

        window.location.href =
            "login.html";

    }
);