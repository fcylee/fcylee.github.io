/* shared.js — shared infrastructure for all pages */

/**
 * Load an HTML partial into an element. Returns a promise.
 */
function loadHTML(file, elementId) {
    return fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error(`Error loading ${file}:`, error));
}

/**
 * Toggle the mobile hamburger menu.
 */
function toggleMenu() {
    const menu = document.getElementById("mobile-menu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

/**
 * Hide mobile menu when resizing past breakpoint.
 */
function handleResize() {
    const menu = document.getElementById("mobile-menu");
    if (menu && window.innerWidth > 768) {
        menu.style.display = "none";
    }
}

/**
 * Highlight the current page's nav link.
 */
function highlightCurrentNav() {
    const path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
    const navLinks = document.querySelectorAll('.nav > a, .nav > .nav-dropdown > a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href').replace(/\/$/, '') || '/';
        if (path === href || (href !== '/' && path.startsWith(href))) {
            link.classList.add('current');
        }
    });
    // Also highlight in mobile menu
    const mobileLinks = document.querySelectorAll('.mobile-menu > a:not(.mobile-sub)');
    mobileLinks.forEach(link => {
        const href = link.getAttribute('href').replace(/\/$/, '') || '/';
        if (path === href || (href !== '/' && path.startsWith(href))) {
            link.classList.add('current');
        }
    });
}

/**
 * Smart scroll: if user had scrolled past hero on previous page,
 * skip to content on this page automatically.
 */
function smartScroll() {
    const hero = document.querySelector('.container');
    if (!hero) return;

    // On load: if previously scrolled past hero, jump past it
    if (sessionStorage.getItem('scrolledPastHero') === 'true') {
        const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
        window.scrollTo(0, heroBottom);
    }

    // Track scroll position
    window.addEventListener('scroll', function () {
        const heroBottom = hero.getBoundingClientRect().bottom;
        sessionStorage.setItem('scrolledPastHero', heroBottom <= 0 ? 'true' : 'false');
    });
}

/**
 * Handle fragment scrolling (e.g. /research/details#ndd).
 */
function handleFragmentScroll() {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            // Override smart scroll — fragment takes priority
            sessionStorage.setItem('scrolledPastHero', 'true');
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
}

/**
 * Initialize on DOMContentLoaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    const headerEl = document.getElementById("header");
    const footerEl = document.getElementById("footer");

    const promises = [];
    if (headerEl) promises.push(loadHTML("/includes/header.html", "header"));
    if (footerEl) promises.push(loadHTML("/includes/footer.html", "footer"));

    Promise.all(promises).then(() => {
        highlightCurrentNav();
        handleFragmentScroll();
    });

    smartScroll();
});

window.addEventListener("resize", handleResize);
