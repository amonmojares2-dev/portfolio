// Edit this list to add, remove, or update portfolio projects.
// Put image files in assets/optimized/ and update each `image` path.
const projects = [
  {
    title: "Araw ng Kalayaan",
    category: "poster",
    categoryLabel: "Poster design",
    image: "assets/optimized/araw-ng-kalayaan.jpg",
    alt: "Green Araw ng Kalayaan poster featuring the Philippine flag and Rizal Monument",
  },
  {
    title: "First Week Hi — Countdown",
    category: "graphic",
    categoryLabel: "Social media design",
    image: "assets/optimized/first-week-hi.jpg",
    alt: "Bright orange First Week Hi university countdown graphic",
  },
  {
    title: "Hero Day",
    category: "poster",
    categoryLabel: "Poster design",
    image: "assets/optimized/hero-day.jpg",
    alt: "Hero Day poster design by Diamond Ace M. Mojares",
  },
  {
    title: "Ravenous Horde",
    category: "poster",
    categoryLabel: "Poster design",
    image: "assets/optimized/horror.png",
    alt: "Dark horror poster artwork titled Ravenous Horde",
  },
  {
    title: "T-Shirt Design",
    category: "apparel",
    categoryLabel: "Apparel design",
    image: "assets/optimized/t-shirt-design.jpg",
    alt: "T-shirt design by Diamond Ace M. Mojares",
  },
  {
    title: "PHINMA University Polo",
    category: "apparel",
    categoryLabel: "Apparel design",
    image: "assets/optimized/phinma.jpg",
    alt: "Green and white PHINMA University of Pangasinan polo shirt design",
  },
  {
    title: "PSLS",
    category: "graphic",
    categoryLabel: "Graphic design",
    image: "assets/optimized/psls.jpg",
    alt: "PSLS graphic design work by Diamond Ace M. Mojares",
  },
  {
    title: "Final Design",
    category: "graphic",
    categoryLabel: "Graphic design",
    image: "assets/optimized/final-design.jpg",
    alt: "Graphic design work by Diamond Ace M. Mojares",
  },
];

const grid = document.querySelector("#project-grid");
const filters = document.querySelectorAll(".filter-button");
const lightbox = document.querySelector("#lightbox");
let activeProjects = projects;
let activeIndex = 0;

function renderProjects(category = "all") {
  activeProjects = category === "all" ? projects : projects.filter((project) => project.category === category);
  document.querySelector("#project-count").textContent = String(projects.length).padStart(2, "0");
  grid.replaceChildren();

  activeProjects.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card reveal";

    const openButton = document.createElement("button");
    openButton.className = "project-open";
    openButton.type = "button";
    openButton.setAttribute("aria-label", `View ${project.title}`);

    const imageWrap = document.createElement("span");
    imageWrap.className = "project-image-wrap";
    const image = document.createElement("img");
    image.className = "project-image";
    image.src = project.image;
    image.alt = project.alt;
    image.loading = "lazy";
    image.decoding = "async";
    const overlay = document.createElement("span");
    overlay.className = "project-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.textContent = "↗";
    imageWrap.append(image, overlay);
    openButton.append(imageWrap);
    openButton.addEventListener("click", () => showProject(index));

    const meta = document.createElement("div");
    meta.className = "project-meta";
    const text = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = project.title;
    const categoryLabel = document.createElement("p");
    categoryLabel.textContent = project.categoryLabel;
    text.append(title, categoryLabel);
    const number = document.createElement("span");
    number.className = "project-number";
    number.textContent = `${String(index + 1).padStart(2, "0")} / ${String(activeProjects.length).padStart(2, "0")}`;
    meta.append(text, number);
    card.append(openButton, meta);
    grid.append(card);
  });

  observeReveals();
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((filter) => {
      const selected = filter === button;
      filter.classList.toggle("is-active", selected);
      filter.setAttribute("aria-pressed", String(selected));
    });
    renderProjects(button.dataset.filter);
  });
});

function showProject(index) {
  activeIndex = index;
  const project = activeProjects[activeIndex];
  lightbox.querySelector(".lightbox-image").src = project.image;
  lightbox.querySelector(".lightbox-image").alt = project.alt;
  lightbox.querySelector(".lightbox-title").textContent = project.title;
  lightbox.querySelector(".lightbox-category").textContent = project.categoryLabel;
  if (!lightbox.open) {
    lightbox.showModal();
    document.body.classList.add("dialog-open");
  }
}

function changeProject(direction) {
  const nextIndex = (activeIndex + direction + activeProjects.length) % activeProjects.length;
  showProject(nextIndex);
}

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => changeProject(-1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => changeProject(1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => document.body.classList.remove("dialog-open"));
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") changeProject(-1);
  if (event.key === "ArrowRight") changeProject(1);
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks.classList.toggle("is-open", !isOpen);
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
  });
});

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const subject = encodeURIComponent(`Portfolio enquiry from ${data.get("name")}`);
  const body = encodeURIComponent(
    `Hi Diamond Ace,\n\n${data.get("message")}\n\nFrom: ${data.get("name")}\nEmail: ${data.get("email")}`,
  );
  window.location.href = `mailto:amonmojares3@gmail.com?subject=${subject}&body=${body}`;
  document.querySelector("#form-note").textContent = "Your email app should open with your message ready to send.";
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

let revealObserver;
function observeReveals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    return;
  }
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    return;
  }
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}

renderProjects();
document.querySelectorAll(".section-heading, .about-copy, .about-image-wrap, .hero-copy, .hero-art, .timeline-item, .skill-column, .contact-top, .contact-details, .contact-form")
  .forEach((element) => element.classList.add("reveal"));
observeReveals();
