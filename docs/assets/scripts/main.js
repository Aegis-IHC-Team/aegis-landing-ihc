// main.js
// Interacciones básicas para la landing de Aegis

document.addEventListener("DOMContentLoaded", () => {
    // ========== SMOOTH SCROLL PARA TODOS LOS LINKS CON # ==========
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href || href === "#") return;

            const targetId = href.slice(1);
            const targetEl = document.getElementById(targetId);
            if (!targetEl) return;

            e.preventDefault();
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // ========== NAVBAR: LINK ACTIVO SEGÚN SECCIÓN ==========
    const navLinks = document.querySelectorAll(".navbar__links a");
    const sections = Array.from(navLinks)
        .map((link) => {
            const id = link.getAttribute("href")?.slice(1);
            if (!id) return null;
            return document.getElementById(id);
        })
        .filter(Boolean);

    const setActiveNav = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        let currentSectionId = null;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const offsetTop = rect.top + scrollY;
            if (scrollY + 120 >= offsetTop) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const linkId = link.getAttribute("href")?.slice(1);
            if (linkId && linkId === currentSectionId) {
                link.classList.add("navbar__link--active");
            } else {
                link.classList.remove("navbar__link--active");
            }
        });
    };

    setActiveNav();
    window.addEventListener("scroll", setActiveNav);

    // ========== TILT CARD EN EL HERO ==========
    const heroCard = document.querySelector(".hero__card");
    if (heroCard) {
        const maxRotation = 7; // grados

        heroCard.addEventListener("mousemove", (e) => {
            const rect = heroCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / rect.height) * maxRotation;
            const rotateY = ((x - rect.width / 2) / rect.width) * -maxRotation;

            heroCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        heroCard.addEventListener("mouseleave", () => {
            heroCard.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
        });
    }

    // ========== ANIMACIÓN DE APARICIÓN EN SCROLL ==========
    const revealEls = document.querySelectorAll(
        ".hero, .section, .team-card, .card"
    );

    const onReveal = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(onReveal, {
        threshold: 0.2,
    });

    revealEls.forEach((el) => observer.observe(el));

    // ========== FORM DEMO: “FAKE SUBMIT” CON FEEDBACK ==========
    const demoSection = document.getElementById("demo");
    if (demoSection) {
        const form = demoSection.querySelector("form.form");
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();

                const button = form.querySelector("button[type='submit']");
                if (!button) return;

                const originalText = button.textContent;
                button.disabled = true;
                button.textContent = "Enviando...";
                button.classList.add("btn--sending");

                setTimeout(() => {
                    button.textContent = "Demo registrada ✓";
                    button.classList.remove("btn--sending");
                    button.classList.add("btn--success");

                    // limpiar campos
                    form.reset();

                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                        button.classList.remove("btn--success");
                    }, 2000);
                }, 1000);
            });
        }
    }
});