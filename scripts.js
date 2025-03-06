document.addEventListener("DOMContentLoaded", () => {
    loadHTML("header.html", "header");
    loadHTML("footer.html", "footer");
    loadHTML("research.html", "content"); // Load default section

    function loadHTML(file, elementId) {
        fetch(file)
            .then(response => response.text())
            .then(data => document.getElementById(elementId).innerHTML = data)
            .catch(error => console.error(`Error loading ${file}:`, error));
    }
});
