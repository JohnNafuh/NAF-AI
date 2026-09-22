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
    "205, 200, 194"
];


function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;

    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createBeams();
}


class Beam {

    constructor() {
        this.reset(true);
    }

    reset(initial = false) {

        this.x = initial
            ? Math.random() * innerWidth - 300
            : -250;

        this.y = initial
            ? Math.random() * innerHeight
            : -150;

        this.length = Math.random() * 240 + 130;
        this.speed = Math.random() * 5 + 3;

        this.size = Math.random() * 1.5 + 1;

        this.angle =
            Math.PI / 4 +
            (Math.random() * .12 - .06);

        this.opacity =
            Math.random() * .35 + .2;

        this.color =
            COLORS[
                Math.floor(
                    Math.random() * COLORS.length
                )
            ];
    }

    update() {

        this.x +=
            Math.cos(this.angle) * this.speed;

        this.y +=
            Math.sin(this.angle) * this.speed;

        if (
            this.x - this.length > innerWidth ||
            this.y - this.length > innerHeight
        ) {
            this.reset();
        }
    }

    draw() {

        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        const tail =
            ctx.createLinearGradient(
                -this.length,
                0,
                0,
                0
            );

        tail.addColorStop(
            0,
            `rgba(${this.color},0)`
        );

        tail.addColorStop(
            .72,
            `rgba(${this.color},${this.opacity * .3})`
        );

        tail.addColorStop(
            1,
            `rgba(${this.color},${this.opacity})`
        );

        ctx.fillStyle = tail;

        ctx.beginPath();

        ctx.moveTo(
            -this.length,
            -.5
        );

        ctx.lineTo(
            0,
            -this.size
        );

        ctx.lineTo(
            0,
            this.size
        );

        ctx.lineTo(
            -this.length,
            .5
        );

        ctx.closePath();

        ctx.fill();

        ctx.shadowColor =
            `rgba(${this.color},.8)`;

        ctx.shadowBlur =
            this.size * 8;

        ctx.fillStyle =
            `rgba(${this.color},${Math.min(
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
        innerWidth < 600 ? 14 : 24;

    for (let i = 0; i < amount; i++) {
        beams.push(new Beam());
    }
}


function animate() {

    ctx.clearRect(
        0,
        0,
        innerWidth,
        innerHeight
    );

    ctx.globalCompositeOperation = "screen";

    beams.forEach(beam => {
        beam.update();
        beam.draw();
    });

    animationId =
        requestAnimationFrame(animate);
}


resizeCanvas();
animate();

window.addEventListener(
    "resize",
    resizeCanvas
);


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

    }, 400);

    setTimeout(() => {

        loading.classList.remove("active");

        aiScreen.classList.add("active");

    }, 2700);
});


/* INPUT */

const prompt = document.getElementById("prompt");
const send = document.getElementById("send");

function sendPrompt() {

    const message =
        prompt.value.trim();

    if (!message) return;

    console.log(
        "NAF AI:",
        message
    );

    prompt.value = "";
}


send.addEventListener(
    "click",
    sendPrompt
);

prompt.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendPrompt();
        }
    }
);
