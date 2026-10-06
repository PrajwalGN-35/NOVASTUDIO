const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const yearElement = document.getElementById("year");


// =========================
// CURRENT YEAR
// =========================

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


// =========================
// MOBILE NAVIGATION
// =========================

if (navToggle && mainNav) {

  navToggle.addEventListener("click", () => {

    const isOpen = mainNav.classList.toggle("open");

    navToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

  });


  mainNav.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

      mainNav.classList.remove("open");

      navToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      navToggle.setAttribute(
        "aria-label",
        "Open navigation"
      );

    });

  });

}


// =========================
// CONTACT FORM
// =========================

if (contactForm) {

  contactForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();


    if (!name || !email || !message) {

      showFormMessage(
        "Please complete all fields before submitting.",
        "error"
      );

      return;
    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

      showFormMessage(
        "Please enter a valid corporate email address.",
        "error"
      );

      return;
    }


    showFormMessage(
      "Thank you. Your strategy session request has been received.",
      "success"
    );

    contactForm.reset();

  });

}


function showFormMessage(message, type) {

  if (!formMessage) {
    return;
  }

  formMessage.textContent = message;

  formMessage.classList.remove(
    "success",
    "error"
  );

  formMessage.classList.add(type);

}


// =========================
// SMOOTH NAVIGATION
// =========================

document.querySelectorAll('a[href^="#"]').forEach((link) => {

  link.addEventListener("click", (event) => {

    const targetId =
      link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target =
      document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});


// =========================
// SUBTLE PARALLAX EFFECT
// =========================

const heroVisual =
  document.querySelector(".hero-visual");

if (heroVisual && window.innerWidth > 720) {

  window.addEventListener("mousemove", (event) => {

    const x =
      (event.clientX / window.innerWidth - 0.5) * 8;

    const y =
      (event.clientY / window.innerHeight - 0.5) * 8;

    heroVisual.style.transform =
      `translate(${x}px, ${y}px)`;

  });

}


// =========================
// REVEAL ON SCROLL
// =========================

const revealElements =
  document.querySelectorAll(
    ".service-item, .process-card, .about-main-card, .about-stat"
  );

const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          revealObserver.unobserve(
            entry.target
          );

        }

      });

    },
    {
      threshold: 0.12
    }
  );


revealElements.forEach((element) => {

  element.style.opacity = "0";
  element.style.transform = "translateY(25px)";
  element.style.transition =
    "opacity 0.7s ease, transform 0.7s ease";

  revealObserver.observe(element);

});


// Add visible state through JS
const revealStyle = document.createElement("style");

revealStyle.textContent = `
  .service-item.visible,
  .process-card.visible,
  .about-main-card.visible,
  .about-stat.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;

document.head.appendChild(revealStyle);
