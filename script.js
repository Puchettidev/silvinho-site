/* Comportamentos gerais do site (menu, cabeçalho, animações de entrada) */
(() => {
    const header = document.querySelector(".site-header");
    const menuButton = document.querySelector(".menu-toggle");
    const navLinks = document.querySelectorAll(".nav-links a");
    const revealItems = document.querySelectorAll(".reveal");
    const observedSections = document.querySelectorAll("main section[id]");

    let lastScrollY = window.scrollY;

    function updateHeader() {
        if (!header) return;
        const currentScroll = window.scrollY;
        const menuOpen = document.body.classList.contains("menu-open");
        header.classList.toggle("scrolled", currentScroll > 16);
        header.classList.toggle("hidden", !menuOpen && currentScroll > lastScrollY && currentScroll > 520);
        lastScrollY = currentScroll;
    }

    function setMenu(open) {
        document.body.classList.toggle("menu-open", open);
        if (menuButton) {
            menuButton.setAttribute("aria-expanded", String(open));
            menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        }
    }

    if (menuButton) {
        menuButton.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
    }

    navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
            setMenu(false);
            menuButton && menuButton.focus();
        }
    });

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        revealItems.forEach((item) => revealObserver.observe(item));

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                    if (entry.isIntersecting && link) {
                        navLinks.forEach((item) => item.classList.remove("active"));
                        link.classList.add("active");
                    }
                });
            },
            { threshold: 0.3 }
        );
        observedSections.forEach((section) => sectionObserver.observe(section));
    } else {
        revealItems.forEach((item) => item.classList.add("visible"));
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
})();
