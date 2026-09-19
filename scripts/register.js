const registerForm =
    document.getElementById(
        "register-form"
    );

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const username =
                document
                    .getElementById(
                        "username"
                    )
                    .value
                    .trim();

            const email =
                document
                    .getElementById(
                        "email"
                    )
                    .value
                    .trim();

            const password =
                document
                    .getElementById(
                        "password"
                    )
                    .value;

            if (
                username.length < 3
            ) {

                alert(
                    "Username must be at least 3 characters!"
                );

                return;
            }

            if (
                password.length < 6
            ) {

                alert(
                    "Password must be at least 6 characters!"
                );

                return;
            }

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

            window.location.href =
                "login.html";

        }
    );

}