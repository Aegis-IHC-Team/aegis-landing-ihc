document.addEventListener("DOMContentLoaded", () => {
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
            if (scrollY + 100 >= offsetTop) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const linkId = link.getAttribute("href")?.slice(1);
            if (linkId && linkId === currentSectionId) {
                link.style.color = "var(--primary)";
            } else {
                link.style.color = "";
            }
        });
    };

    setActiveNav();
    window.addEventListener("scroll", setActiveNav);

    const heroCard = document.querySelector(".hero__card");
    if (heroCard) {
        const maxRotation = 5;

        heroCard.addEventListener("mousemove", (e) => {
            const rect = heroCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / rect.height) * maxRotation;
            const rotateY = ((x - rect.width / 2) / rect.width) * -maxRotation;

            heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        heroCard.addEventListener("mouseleave", () => {
            heroCard.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
        });
    }

    const revealEls = document.querySelectorAll(
        ".hero, .section, .team-card, .card"
    );

    const onReveal = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(onReveal, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealEls.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        observer.observe(el);
    });
});