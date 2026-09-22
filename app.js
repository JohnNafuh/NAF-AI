const useAI = document.getElementById("useAI");
const landing = document.getElementById("landing");
const loading = document.getElementById("loading");
const aiScreen = document.getElementById("aiScreen");

useAI.addEventListener("click", () => {

    // Hide landing
    landing.classList.add("hidden");

    // Show loading
    setTimeout(() => {
        loading.classList.add("active");
    }, 250);

    // Open AI
    setTimeout(() => {
        loading.classList.remove("active");
        aiScreen.classList.add("active");
    }, 2500);

});
