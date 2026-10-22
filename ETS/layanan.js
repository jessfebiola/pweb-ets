
document.addEventListener("DOMContentLoaded", () => {
    /*tahun footer*/
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    /*animasi halaman layanan*/
    const page = document.querySelector(".page-layanan");
    const elements = document.querySelectorAll(".page-layanan .reveal");

    if (!page || elements.length === 0) {
        return;
    }

    /*fallback jika browser tidak mendukung observer*/
    if (!("IntersectionObserver" in window)) {
        return;
    }

    /*arah animasi hero*/
    const heroImage = document.querySelector(".service-hero-visual");
    const heroContent = document.querySelector(".service-hero-content");

    if (heroImage) {
        heroImage.classList.add("from-right");
    }

    if (heroContent) {
        heroContent.classList.add("from-left");
    }

    /*aktifkan animasi setelah observer siap*/
    page.classList.add("js-animations");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    elements.forEach((element) => {
        observer.observe(element);
    });
});
