document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("js-animations");

    const aboutSection = document.querySelector("#tentang");

    if (aboutSection && "IntersectionObserver" in window) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    aboutSection.classList.add("is-visible");
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        aboutObserver.observe(aboutSection);
    }

    const cards = document.querySelectorAll(
        ".info-card, .strength-card"
    );

    if ("IntersectionObserver" in window) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = Array.from(cards).indexOf(entry.target);

                    setTimeout(() => {
                        entry.target.classList.add("show-card");
                    }, (index % 3) * 150);

                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach((card) => cardObserver.observe(card));
    } else {
        cards.forEach((card) => card.classList.add("show-card"));
    }

    const stats = document.querySelectorAll(
        ".statistics-section .stat-item h3"
    );

    function animateNumber(element) {
        const original = element.textContent.trim();
        const match = original.match(/^([\d,.]+)(.*)$/);

        if (!match) return;

        const target = Number(match[1].replace(/[,.]/g, ""));
        const suffix = match[2];
        const duration = 1600;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);

            if (progress < 0.7) {
                const randomNumber = Math.floor(
                    Math.random() * (target + 1)
                );

                element.textContent =
                    randomNumber.toLocaleString("en-US") + suffix;
            } else {
                const p = (progress - 0.7) / 0.3;
                const eased = 1 - Math.pow(1 - p, 3);
                const value = Math.floor(target * eased);

                element.textContent =
                    value.toLocaleString("en-US") + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = original;
            }
        }

        requestAnimationFrame(update);
    }

    if ("IntersectionObserver" in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateNumber(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach((stat) => statsObserver.observe(stat));
    }
});
