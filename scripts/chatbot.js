const chatToggle =
    document.getElementById(
        "chat-toggle"
    );

const chatBox =
    document.getElementById(
        "chat-box"
    );

const sendBtn =
    document.getElementById(
        "send-btn"
    );

const chatInput =
    document.getElementById(
        "chat-input"
    );

const chatMessages =
    document.getElementById(
        "chat-messages"
    );

chatToggle.addEventListener(
    "click",
    () => {

        if (
            chatBox.style.display
            === "block"
        ) {

            chatBox.style.display =
                "none";

        }
        else {

            chatBox.style.display =
                "block";

        }

    }
);

function addMessage(
    text,
    type
) {

    const div =
        document.createElement(
            "div"
        );

    div.classList.add(
        `${type}-message`
    );

    div.textContent =
        text;

    chatMessages.appendChild(
        div
    );

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}

function getAIResponse(
    message
) {

    message =
        message.toLowerCase();

    if (
        message.includes(
            "temperature"
        )
        ||
        message.includes(
            "temp"
        )
    ) {

        return "🌡️ Check current weather section above.";

    }

    if (
        message.includes(
            "umbrella"
        )
    ) {

        return "☔ Check rain forecast before going out.";

    }

    if (
        message.includes(
            "uv"
        )
    ) {

        return "🧴 High UV → use sunscreen.";

    }

    return "🤖 I understand. WeatherX AI is still learning.";
}

sendBtn.addEventListener(
    "click",
    () => {

        const text =
            chatInput.value.trim();

        if (!text)
            return;

        addMessage(
            text,
            "user"
        );

        const response =
            getAIResponse(
                text
            );

        setTimeout(
            () => {

                addMessage(
                    response,
                    "bot"
                );

            },
            500
        );

        chatInput.value = "";

    }
);