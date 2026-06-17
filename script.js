const searchablePages = [
  {
    title: "Venue",
    route: "venue",
    text: "retreat venue camp rental lodge wooded property meeting dining white mountains"
  },
  {
    title: "Lodging & Grounds",
    route: "lodging",
    text: "lodging overnight capacity 32 guests dormitories bathrooms dining meeting hall game room trails fields"
  },
  {
    title: "Groups",
    route: "groups",
    text: "churches ministries youth groups family reunions private events retreats camps"
  },
  {
    title: "Rates",
    route: "rates",
    text: "rates pricing quote availability rental inquiry day overnight weekend group size"
  },
  {
    title: "About",
    route: "about",
    text: "christian heritage rental first identity rest fellowship renewal"
  },
  {
    title: "Rental Inquiry",
    route: "contact",
    text: "contact tour availability dates group size event type lodging meals"
  }
];

const views = [...document.querySelectorAll("[data-view]")];
const routeLinks = [...document.querySelectorAll("[data-route]")];
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const siteSearch = document.querySelector("#site-search");
const searchResults = document.querySelector("#search-results");
const contentGrid = document.querySelector(".content-grid");

function setRoute(route) {
  const target = !route || route === "home" ? "venue" : route;
  views.forEach((view) => {
    if (view.dataset.view === "home") return;
    view.classList.toggle("active", view.dataset.view === target);
  });
  routeLinks.forEach((link) => link.classList.toggle("active", link.dataset.route === target));
  navLinks.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

function scrollToRoute(route) {
  const target = !route || route === "home" ? "home" : route;
  const destination = target === "home"
    ? document.querySelector(".hero")
    : document.querySelector(`[data-view="${target}"]`) || contentGrid;

  if (!destination) return;

  destination.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function navigateToRoute(route) {
  const target = route || "venue";
  const hash = target === "home" ? "#home" : `#${target}`;

  setRoute(target);
  if (window.location.hash !== hash) {
    history.pushState(null, "", hash);
  }
  requestAnimationFrame(() => scrollToRoute(target));
}

function routeFromHash() {
  return window.location.hash.replace("#", "") || "venue";
}

function renderSearch() {
  const query = siteSearch.value.trim().toLowerCase();
  if (!query) {
    searchResults.innerHTML = "";
    return;
  }
  const matches = searchablePages
    .filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(query))
    .slice(0, 7);
  searchResults.innerHTML = matches.map((item) => `
    <a class="search-result" href="#${item.route}" data-route="${item.route}">
      <strong>${item.title}</strong>
      <span>Open ${item.route}</span>
    </a>
  `).join("") || "<p class='muted'>No matches yet.</p>";
}

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

window.addEventListener("hashchange", () => {
  const route = routeFromHash();
  setRoute(route);
  requestAnimationFrame(() => scrollToRoute(route));
});

document.addEventListener("click", (event) => {
  const routeLink = event.target.closest("[data-route]");
  if (routeLink) {
    event.preventDefault();
    navigateToRoute(routeLink.dataset.route);
  }
});

siteSearch.addEventListener("input", renderSearch);

document.querySelector("#contact-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const status = document.querySelector("#form-status");
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const message = String(form.get("message") || "").trim();
  const eventType = String(form.get("eventType") || "Event").trim();
  const subject = `Camp Shiloh rental inquiry: ${eventType || "Event"}`;

  if (form.get("_honey")) return;

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    status.textContent = "Please enter your name, a valid email, and a message.";
    return;
  }

  if (message.length > 3000) {
    status.textContent = "Please shorten your message and try again.";
    return;
  }

  status.textContent = "Sending your rental inquiry...";
  form.append("_subject", subject);
  form.append("_template", "table");

  try {
    const response = await fetch("https://formsubmit.co/ajax/thisisusedfortesting2@gmail.com", {
      method: "POST",
      headers: {
        Accept: "application/json"
      },
      body: form
    });

    if (!response.ok) throw new Error("The form service did not accept the message.");

    formElement.reset();
    status.textContent = "Thanks. Your rental inquiry has been sent.";
  } catch (error) {
    status.textContent = "Sorry, the inquiry could not be sent. Please call (603) 586-7973 or email thisisusedfortesting2@gmail.com.";
  }
});

setRoute(routeFromHash());
if (window.location.hash) {
  requestAnimationFrame(() => scrollToRoute(routeFromHash()));
}
