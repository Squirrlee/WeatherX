import {
    GEMINI_API_KEY
} from "./config.js";

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

/* =========================
   Toggle Chat
========================= */

chatToggle.addEventListener(
    "click",
    () => {

        chatBox.style.display =
            chatBox.style.display === "block"
                ? "none"
                : "block";

    }
);

/* =========================
   Add Message
========================= */

function addMessage(
    text,
    type
) {

    const div =
        document.createElement(
            "div"
        );

    div.className =
        `${type}-message`;

    div.textContent =
        text;

    chatMessages.appendChild(
        div
    );

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}

/* =========================
   Gemini API
========================= */

async function getAIResponse(
    message
) {

    try {

        const response =
            await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            contents: [
                                {
                                    parts: [
                                        {
                                            text: `
You are WeatherX AI.

You are an AI assistant for a weather website.

Rules:
- Answer briefly.
- Be friendly.
- Focus on weather, climate, travel and air quality.
- Use emojis when appropriate.

User:
${message}
`
                                        }
                                    ]
                                }
                            ]

                        })

                }
            );

        const data =
            await response.json();

        return data
            ?.candidates?.[0]
            ?.content?.parts?.[0]
            ?.text
            ||
            "❌ No response";

    }
    catch (error) {

        console.error(error);

        return "❌ AI Error";

    }

}

/* =========================
   Send Message
========================= */

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    addMessage(message, "user");
    chatInput.value = "";
    
    // Typing indicator với 3 chấm nhảy
    const typingDiv = document.createElement("div");
    typingDiv.className = "bot-message";
    typingDiv.innerHTML = `
        <span class="typing-dots">
            <span>●</span><span>●</span><span>●</span>
        </span>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    const response = await getAIResponse(message);
    typingDiv.remove();
    addMessage(response, "bot");
}

/* =========================
   Events
========================= */

sendBtn.addEventListener(
    "click",
    sendMessage
);

chatInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            sendMessage();

        }

    }
);