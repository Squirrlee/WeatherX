const loginForm =
    document.getElementById(
        "login-form"
    );

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

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
                JSON.stringify({
                    username:
                        user.username,
                    email:
                        user.email
                })
            );

            window.location.href =
                "index.html";

        }
    );

}