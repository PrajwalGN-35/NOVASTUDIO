document.addEventListener("DOMContentLoaded", () => {

    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");
            });
        });
    }

    const contactForm = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message");

    if (contactForm && formMessage) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) {
                formMessage.textContent = "Please complete all fields.";
                formMessage.className = "form-message error";
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                formMessage.textContent = "Please enter a valid email address.";
                formMessage.className = "form-message error";
                return;
            }

            formMessage.textContent =
                "Thanks. Nova is currently being built. The conversation interface will be available soon.";

            formMessage.className = "form-message success";

            contactForm.reset();
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", event => {
            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    const heroVisual = document.querySelector(".hero-visual");

    if (heroVisual) {
        heroVisual.addEventListener("mousemove", event => {
            const rect = heroVisual.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            heroVisual.style.transform =
                `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
        });

        heroVisual.addEventListener("mouseleave", () => {
            heroVisual.style.transform =
                "perspective(1000px) rotateY(0deg) rotateX(0deg)";
        });
    }

    const revealElements = document.querySelectorAll(
        ".service-item, .process-card, .about-main-card, .about-stat"
    );

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => observer.observe(element));

});
