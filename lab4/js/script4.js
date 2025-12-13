document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".gallery img");

    images.forEach(img => {
        img.addEventListener("click", (event) => {
            onKittyClick(event);
        });
    });
});