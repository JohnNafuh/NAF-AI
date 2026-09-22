const workspace = document.getElementById("workspace");
const enterAI = document.getElementById("enterAI");
const backButton = document.getElementById("backButton");

const menuButton = document.getElementById("menuButton");
const closeMenu = document.getElementById("closeMenu");
const menuPanel = document.getElementById("menuPanel");

const capabilities = document.querySelectorAll(".capability");
const core = document.querySelector(".core");
const coreArea = document.querySelector(".core-area");
const input = document.getElementById("input");
const send = document.getElementById("send");


// ENTER AI

enterAI.addEventListener("click", () => {
    workspace.classList.add("open");

    setTimeout(() => {
        input.focus();
    }, 600);
});


// BACK

backButton.addEventListener("click", () => {
    workspace.classList.remove("open");
});


// MENU

menuButton.addEventListener("click", () => {
    menuPanel.classList.add("open");
});


// CLOSE MENU

closeMenu.addEventListener("click", () => {
    menuPanel.classList.remove("open");
});


// CAPABILITIES

capabilities.forEach(button => {

    button.addEventListener("click", () => {

        capabilities.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        const mode = button.dataset.mode;

        core.dataset.mode = mode;

        core.classList.remove("thinking", "creating", "building", "researching");

        if (mode === "think") {
            core.classList.add("thinking");
        }

        if (mode === "create") {
            core.classList.add("creating");
        }

        if (mode === "build") {
            core.classList.add("building");
        }

        if (mode === "research") {
            core.classList.add("researching");
        }
    });

});


// CORE MOUSE MOVEMENT

document.addEventListener("mousemove", (event) => {

    if (window.innerWidth < 800) return;

    const x = (event.clientX / window.innerWidth - 0.5) * 20;
    const y = (event.clientY / window.innerHeight - 0.5) * 20;

    coreArea.style.transform =
        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

});


// SEND

function sendMessage() {

    const message = input.value.trim();

    if (!message) return;

    console.log("NAF AI:", message);

    input.value = "";

    input.style.height = "45px";

}


// SEND BUTTON

send.addEventListener("click", sendMessage);


// ENTER TO SEND

input.addEventListener("keydown", (event) => {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();

    }

});


// AUTO RESIZE TEXTAREA

input.addEventListener("input", () => {

    input.style.height = "auto";

    input.style.height =
        Math.min(input.scrollHeight, 140) + "px";

});
