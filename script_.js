








// function t(path, vars) {
//   const parts = path.split(".");
//   let node = I18N[CURRENT_LANG];
//   for (const p of parts) node = node?.[p];
//   if (typeof node === "function") return node(vars);
//   return node ?? path;
// }





let PROPERTIES = []; // sera rempli par fetch



));
}



// ---------------- Search / filters ----------------
const form = document.getElementById("searchForm");
const resetBtn = document.getElementById("resetBtn");

function applyFilters() {
  const q = (document.getElementById("q").value || "").trim().toLowerCase();
  const type = document.getElementById("type").value;
  const transaction = document.getElementById("transaction").value;
  const budget = document.getElementById("budget").value;

  let filtered = PROPERTIES_LOCALIZED();

  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.city.toLowerCase().includes(q) ||
        p.titleText.toLowerCase().includes(q)
    );
  }
  if (type !== "all") filtered = filtered.filter((p) => p.type === type);
  if (transaction !== "all")
    filtered = filtered.filter((p) => p.transaction === transaction);
  if (budget !== "all") {
    const max = Number(budget);
    filtered = filtered.filter((p) => p.price <= max);
  }

  render(filtered);
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  applyFilters();
  document
    .getElementById("annonces")
    .scrollIntoView({ behavior: "smooth", block: "start" });
});

resetBtn?.addEventListener("click", () => {
  form.reset();
  render(PROPERTIES_LOCALIZED());
});

// ---------------- Card interactions ----------------
listingEl?.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const card = e.target.closest(".card");
  if (!card) return;

  const id = Number(card.dataset.id);
  const p = PROPERTIES_LOCALIZED().find((x) => x.id === id);
  if (!p) return;

  const toast = document.getElementById("toast");
  toast.classList.remove("hide");

  if (btn.dataset.action === "details") {
    toast.textContent = t("toast.details", {
      title: p.titleText,
      city: p.city,
      area: p.area,
    });
  } else {
    toast.textContent = t("toast.visitSent", { title: p.titleText });
    document
      .getElementById("contact")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }

  window.clearTimeout(window.__toastTimer);
  window.__toastTimer = window.setTimeout(
    () => toast.classList.add("hide"),
    4500
  );
});

// ---------------- Contact form ----------------
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const phone = document.getElementById("phone").value.trim();
  const toast = document.getElementById("toast");
  toast.classList.remove("hide");

  if (!phone || phone.length < 6) {
    toast.textContent = t("toast.phoneInvalid");
  } else {
    toast.textContent = t("toast.callbackOk");
    e.target.reset();
  }

  window.clearTimeout(window.__toastTimer);
  window.__toastTimer = window.setTimeout(
    () => toast.classList.add("hide"),
    4500
  );
});

// ---------------- Mobile menu ----------------
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");

burger?.addEventListener("click", () => {
  const open = mobileNav.style.display === "block";
  mobileNav.style.display = open ? "none" : "block";
  burger.setAttribute("aria-expanded", String(!open));
});

mobileNav?.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  mobileNav.style.display = "none";
  burger.setAttribute("aria-expanded", "false");
});














// ---------------- Init ----------------
async function init() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  syncLangButtons();

  try {
    await loadProperties();
  } catch (err) {
    console.error(err);
    return;
  }

  if (isDetailPage()) renderDetailPage();
  else render(PROPERTIES_LOCALIZED());
}


document.addEventListener("click", (e) => {
  const btn = e.target.closest(".lang-btn");
  if (!btn) return;
  const lang = btn.dataset.lang;
  if (!lang) return;
  setLanguage(lang);
});



