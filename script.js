const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const siteHeader = document.querySelector(".site-header");

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

const yearEl = document.getElementById("year");


// ==================== YEAR ====================

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


// ==================== MOBILE NAVIGATION ====================

function closeNavigation() {
  if (!navToggle || !mainNav) return;

  mainNav.classList.remove("open");
  navToggle.classList.remove("active");

  navToggle.setAttribute("aria-expanded", "false");

  document.body.classList.remove("menu-open");
  navToggle.setAttribute("aria-label", "Open navigation");
}

function toggleNavigation() {
  if (!navToggle || !mainNav) return;

  const isOpen = mainNav.classList.toggle("open");

  navToggle.classList.toggle("active", isOpen);

  navToggle.setAttribute("aria-expanded", String(isOpen));

  navToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );

  document.body.classList.toggle("menu-open", isOpen);
}

if (navToggle && mainNav) {
  navToggle.addEventListener("click", toggleNavigation);

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      closeNavigation();
    }
  });
}


// ==================== HEADER SCROLL ====================

function updateHeader() {
  if (!siteHeader) return;

  if (window.scrollY > 30) {
    siteHeader.classList.add("scrolled");
  } else {
    siteHeader.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateHeader, {
  passive: true
});

updateHeader();


// ==================== SCROLL REVEAL ====================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}


// ==================== CONTACT FORM ====================

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    if (!nameInput || !emailInput || !messageInput) {
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    clearFormMessage();

    if (!name || !email || !message) {
      showFormMessage(
        "Please complete all fields before sending your inquiry.",
        "error"
      );

      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showFormMessage(
        "Please enter a valid email address.",
        "error"
      );

      return;
    }

    showFormMessage(
      `Thanks ${name.split(" ")[0]} — your inquiry is ready to be sent.`,
      "success"
    );

    contactForm.reset();
  });
}


// ==================== FORM MESSAGE ====================

function showFormMessage(message, type) {
  if (!formMessage) return;

  formMessage.textContent = message;

  formMessage.classList.remove("success", "error");

  formMessage.classList.add(type);
}

function clearFormMessage() {
  if (!formMessage) return;

  formMessage.textContent = "";

  formMessage.classList.remove("success", "error");
}


// ==================== SMOOTH ANCHOR FALLBACK ====================

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

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
