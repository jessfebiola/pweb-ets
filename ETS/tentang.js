
document.addEventListener("DOMContentLoaded", () => {
    /*animasi hero*/
    const heroImage = document.querySelector(".about-visual");
    const heroContent = document.querySelector(".about-content");

    if (heroImage) {
        heroImage.classList.add("animate-from-left");
    }

    if (heroContent) {
        heroContent.classList.add("animate-from-right");
    }

    /*animasi saat scroll*/
    const animatedElements = document.querySelectorAll(
        ".history-image, .history-text, .vision-card, .contact-card"
    );

    if (!("IntersectionObserver" in window)) {
        animatedElements.forEach((element) => {
            element.classList.add("is-visible");
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const siblings = Array.from(
                    element.parentElement.children
                );
                const index = siblings.indexOf(element);

                setTimeout(() => {
                    element.classList.add("is-visible");
                }, index * 150);

                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.15
    });

    animatedElements.forEach((element) => {
        observer.observe(element);
    });

    /*tahun footer*/
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }
});
