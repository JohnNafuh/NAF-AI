const input = document.getElementById("input");
const send = document.getElementById("send");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const newChat = document.getElementById("newChat");
let conversations = [];
/* SEND MESSAGE */
function sendMessage(text = input.value.trim()) {
    if (!text) return;
    welcome.style.display = "none";
    addMessage(text, "user");
    input.value = "";
    input.style.height = "40px";
    conversations.push({
        role: "user",
        content: text
    });
    setTimeout(() => {
        addMessage(
            "I'm ready. Once the NAF AI backend is connected, I'll be able to process this request and give you a real AI response.",
            "ai"
        );
    }, 600);
}
/* ADD MESSAGE */
function addMessage(text, type) {
    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.innerHTML = `
        <div class="message-avatar">
            ${type === "user" ? "N" : "N"}
        </div>
        <div class="message-content">
            ${text}
        </div>
    `;
    messages.appendChild(message);
    messages.scrollIntoView({
        behavior: "smooth",
        block: "end"
    });
}
/* SEND BUTTON */
send.addEventListener("click", () => {
    sendMessage();
});
/* ENTER TO SEND */
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});
/* AUTO GROW TEXTAREA */
input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height =
        Math.min(input.scrollHeight, 130) + "px";
});
/* SUGGESTION BUTTONS */
document.querySelectorAll(".suggestions button").forEach(button => {
    button.addEventListener("click", () => {
        const prompt = button.dataset.prompt;
        input.value = prompt;
        input.focus();
    });
});
/* NEW CONVERSATION */
newChat.addEventListener("click", () => {
    messages.innerHTML = "";
    welcome.style.display = "block";
    conversations = [];
    input.value = "";
    input.focus();
});
/* TOP NEW CONVERSATION */
const topAction = document.querySelector(".top-action");
if (topAction) {
    topAction.addEventListener("click", () => {
        messages.innerHTML = "";
        welcome.style.display = "block";
        conversations = [];
        input.value = "";
        input.focus();
    });
}
