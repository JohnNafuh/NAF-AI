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


// ENTER NAF AI

enterAI?.addEventListener("click", () => {
    workspace.classList.add("open");

    setTimeout(() => {
        input?.focus();
    }, 650);
});


// BACK

backButton?.addEventListener("click", () => {
    workspace.classList.remove("open");
});


// MENU

menuButton?.addEventListener("click", () => {
    menuPanel.classList.add("open");
});


// CLOSE MENU

closeMenu?.addEventListener("click", () => {
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

        core.classList.remove(
            "thinking",
            "creating",
            "building",
            "researching"
        );

        const states = {
            think: "thinking",
            create: "creating",
            build: "building",
            research: "researching"
        };

        if (states[mode]) {
            core.classList.add(states[mode]);
        }

    });

});


// PHONE TOUCH INTERACTION

let startX = 0;
let startY = 0;

let currentX = 0;
let currentY = 0;

let dragging = false;


coreArea?.addEventListener("touchstart", event => {

    const touch = event.touches[0];

    startX = touch.clientX;
    startY = touch.clientY;

    dragging = true;

}, { passive: true });


coreArea?.addEventListener("touchmove", event => {

    if (!dragging) return;

    const touch = event.touches[0];

    const moveX = touch.clientX - startX;
    const moveY = touch.clientY - startY;

    currentX = Math.max(-25, Math.min(25, moveX * 0.15));
    currentY = Math.max(-25, Math.min(25, moveY * 0.15));

    coreArea.style.transform =
        `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;

}, { passive: true });


coreArea?.addEventListener("touchend", () => {

    dragging = false;

    coreArea.style.transform =
        "translate(-50%, -50%)";

});


// CORE TAP

core?.addEventListener("click", () => {

    core.classList.remove("core-active");

    void core.offsetWidth;

    core.classList.add("core-active");

});


// SEND MESSAGE

function sendMessage() {

    const message = input.value.trim();

    if (!message) return;

    console.log("NAF AI:", message);

    input.value = "";
    input.style.height = "45px";

}


// SEND BUTTON

send?.addEventListener("click", sendMessage);


// ENTER TO SEND

input?.addEventListener("keydown", event => {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();

    }

});


// AUTO-GROW INPUT

input?.addEventListener("input", () => {

    input.style.height = "auto";

    input.style.height =
        Math.min(input.scrollHeight, 140) + "px";

});
