const canvas = document.getElementById("meteorCanvas");
const ctx = canvas.getContext("2d");

const useAI = document.getElementById("useAI");
const landing = document.getElementById("landing");
const loading = document.getElementById("loading");
const aiScreen = document.getElementById("aiScreen");

let beams = [];
let animationId;
let transitioning = false;

const COLORS = [
    "255, 100, 31",
    "255, 145, 85",
    "210, 205, 198"
];

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createBeams();
}

class Beam {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.x = initial
            ? Math.random() * w - w * 0.3
            : -200 - Math.random() * 300;

        this.y = initial
            ? Math.random() * h
            : -150;

        this.length = Math.random() * 220 + 120;
        this.speed = Math.random() * 5 + 3;
        this.size = Math.random() * 1.4 + 1;
        this.angle = Math.PI / 4 + (Math.random() * 0.12 - 0.06);
        this.opacity = Math.random() * 0.35 + 0.2;

        this.color =
            COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (
            this.x - this.length > window.innerWidth ||
            this.y - this.length > window.innerHeight
        ) {
            this.reset();
        }
    }

    draw() {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        const tail = ctx.createLinearGradient(
            -this.length,
            0,
            0,
            0
        );

        tail.addColorStop(
            0,
            `rgba(${this.color}, 0)`
        );

        tail.addColorStop(
            0.7,
            `rgba(${this.color}, ${this.opacity * 0.3})`
        );

        tail.addColorStop(
            1,
            `rgba(${this.color}, ${this.opacity})`
        );

        ctx.fillStyle = tail;

        ctx.beginPath();
        ctx.moveTo(-this.length, -0.5);
        ctx.lineTo(0, -this.size);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.length, 0.5);
        ctx.closePath();
        ctx.fill();

        ctx.shadowColor =
            `rgba(${this.color}, .8)`;

        ctx.shadowBlur = this.size * 8;

        ctx.fillStyle =
            `rgba(${this.color}, ${Math.min(
                1,
                this.opacity * 1.5
            )})`;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }
}

function createBeams() {
    beams = [];

    const amount =
        window.innerWidth < 600 ? 12 : 20;

    for (let i = 0; i < amount; i++) {
        beams.push(new Beam());
    }
}

function animate() {
    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    ctx.globalCompositeOperation = "screen";

    beams.forEach(beam => {
        beam.update();
        beam.draw();
    });

    animationId = requestAnimationFrame(animate);
}

resizeCanvas();
animate();

window.addEventListener("resize", resizeCanvas);


/* USE AI */

useAI.addEventListener("click", () => {
    if (transitioning) return;

    transitioning = true;

    useAI.style.transform =
        "translateX(-50%) scale(.88)";

    useAI.style.opacity = "0";

    landing.classList.add("hidden");

    setTimeout(() => {
        cancelAnimationFrame(animationId);

        loading.classList.add("active");
    }, 350);

    setTimeout(() => {
        loading.classList.remove("active");
        aiScreen.classList.add("active");
    }, 2700);
});


/* ENTER TO SEND */

const prompt = document.getElementById("prompt");
const send = document.getElementById("send");

send.addEventListener("click", sendPrompt);

prompt.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendPrompt();
    }
});

function sendPrompt() {
    const message = prompt.value.trim();

    if (!message) return;

    console.log("NAF AI:", message);

    prompt.value = "";
}
