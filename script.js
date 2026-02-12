let I18N = null;

let CURRENT_LANG = localStorage.getItem("lang") || "fr";

async function loadI18n() {
  const res = await fetch("data/i18n.json");
  if (!res.ok) throw new Error("Failed to load i18n.json");
  I18N = await res.json();
}

async function loadPartial(id, url) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(url);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error("Failed to load partial:", url);
  }
}

function t(path, vars = {}) {
  if (!I18N) return path;

  const dict = I18N[CURRENT_LANG] || I18N.fr || {};
  const value = path.split(".").reduce((acc, key) => (acc && acc[key] != null ? acc[key] : null), dict);

  if (value == null) return path;

  if (typeof value === "string") {
    return value.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : `{${k}}`));
  }

  return value; // au cas où tu as des objets
}


function bindLangButtons() {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.onclick = () => setLanguage(btn.dataset.lang);
  });
}

// function t(path, vars) {
//   const parts = path.split(".");
//   let node = I18N[CURRENT_LANG];
//   for (const p of parts) node = node?.[p];
//   if (typeof node === "function") return node(vars);
//   return node ?? path;
// }

function setLanguage(lang) {
  CURRENT_LANG = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  // title + meta
  document.title = t("meta.title");
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", t("meta.description"));

  applyTranslations();
  syncLangButtons?.();

  if (isDetailPage()) renderDetailPage();
  else render(PROPERTIES_LOCALIZED());
}


function applyTranslations() {
  // Text nodes
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    // Special case for elements that include HTML (footer address)
    if (key === "footer.address") el.innerHTML = t(key);
    else el.textContent = t(key);
  });

  // Placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.setAttribute("placeholder", t(key));
  });

  // aria-label
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    el.setAttribute("aria-label", t(key));
  });

  // Some elements set aria-label via a different key
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (key) el.setAttribute("aria-label", t(key));
  });

  // Options that have data-i18n (select options)
  document.querySelectorAll("option[data-i18n]").forEach((opt) => {
    opt.textContent = t(opt.getAttribute("data-i18n"));
  });
}

function syncLangButtons() {
  const isFR = CURRENT_LANG === "fr";

  const setLabels = (labelEl, altEl) => {
    if (!labelEl || !altEl) return;
    // highlight current on the left
    labelEl.textContent = isFR ? "FR" : "EN";
    altEl.textContent = isFR ? "EN" : "FR";
  };

  setLabels(
    document.getElementById("langLabel"),
    document.getElementById("langAlt")
  );
  setLabels(
    document.getElementById("langLabelMobile"),
    document.getElementById("langAltMobile")
  );
}

function toggleLanguage() {
  setLanguage(CURRENT_LANG === "fr" ? "en" : "fr");
}

const DATA_URL = "./data/properties.json";
let PROPERTIES = []; // sera rempli par fetch

async function loadProperties() {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${DATA_URL}: ${res.status}`);
  PROPERTIES = await res.json();
  return PROPERTIES;
}

function PROPERTIES_LOCALIZED() {
  return PROPERTIES.map((p) => ({
    ...p,
    titleText: p.title?.[CURRENT_LANG] ?? p.title?.fr ?? "",
    tagText: p.tag?.[CURRENT_LANG] ?? p.tag?.fr ?? "",
  }));
}

// ---------------- Helpers ----------------
function formatMoney(n, transaction) {
  const locale = CURRENT_LANG === "fr" ? "fr-FR" : "en-GB";
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(n);

  if (transaction === "location") return `${formatted} ${t("rentSuffix")}`;
  return formatted;
}

const listingEl = document.getElementById("listings");
const emptyStateEl = document.getElementById("emptyState");

function cardTemplate(p) {
  const typeLabel =
    p.type === "appartement"
      ? t("type.apartment")
      : p.type === "maison"
      ? t("type.house")
      : p.type === "villa"
      ? t("type.villa")
      : t("type.office");

  const transactionLabel =
    p.transaction === "achat" ? t("transaction.buy") : t("transaction.rent");

  const areaLabel = `${p.area} ${t("units.sqm")}`;
  const roomsLabel = roomsLabelText(p.rooms);

  const cover =
    (Array.isArray(p.images) && p.images.length ? p.images[0] : null) ||
    p.cover ||
    p.image ||
    null;

  const thumbBg = cover
    ? `background-image:url('${cover}')`
    : `background-image:
        radial-gradient(600px 260px at 20% 20%, rgba(110,168,255,.25), transparent 60%),
        radial-gradient(600px 260px at 80% 0%, rgba(78,240,196,.22), transparent 55%)`;

  return `
    <article class="card" data-id="${p.id}">
      <div class="thumb" aria-hidden="true" style="${thumbBg}">
        <div class="badge">${p.tagText}</div>
        <div class="price">${formatMoney(
          p.price,
          p.transaction,
          p.currency || "EUR"
        )}</div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${p.titleText}</h3>
        <div class="meta">
          <span class="chip">${p.city}</span>
          <span class="chip">${areaLabel}</span>
          <span class="chip">${roomsLabel}</span>
          <span class="chip">${typeLabel}</span>
          <span class="chip">${transactionLabel}</span>
        </div>

        <div class="card-footer">
          <a class="btn small ghost" href="property.html?id=${
            p.id
          }" data-action="details">
            ${t("listings.details")}
          </a>
          <button class="btn small primary" type="button" data-action="contact">
            ${t("listings.visit")}
          </button>
        </div>
      </div>
    </article>
  `;
}

function render(list) {
  listingEl.innerHTML = list.map(cardTemplate).join("");
  emptyStateEl.classList.toggle("hide", list.length !== 0);
}

function roomsLabelText(n) {
  // fonctionne avec ton JSON: "units.rooms": "{n} room(s)" (et pareil en FR)
  return t("units.rooms", { n });
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

// ---------------- Language buttons ----------------
const langToggle = document.getElementById("langToggle");
const langToggleMobile = document.getElementById("langToggleMobile");

if (langToggle) langToggle.addEventListener("click", toggleLanguage);
if (langToggleMobile)
  langToggleMobile.addEventListener("click", toggleLanguage);

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function isDetailPage() {
  return (
    document.getElementById("propertyDetail") &&
    document.getElementById("detailTitle")
  );
}

function initCarousel(images) {
  const hero = document.getElementById("detailHeroImg");
  const thumbs = document.getElementById("detailThumbs");
  const prevBtn = hero.querySelector(".prev");
  const nextBtn = hero.querySelector(".next");

  let index = 0;

  function render() {
    hero.style.background = `url("${images[index]}") center / cover no-repeat`;

    thumbs.querySelectorAll(".detail-thumb").forEach((t, i) => {
      t.classList.toggle("active", i === index);
    });
  }

  thumbs.innerHTML = images
    .map(
      (src, i) => `
    <button
      class="detail-thumb ${i === 0 ? "active" : ""}"
      type="button"
      aria-label="Image ${i + 1}"
      style="background-image:url('${src}')"
      data-index="${i}">
    </button>
  `
    )
    .join("");

  thumbs.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-index]");
    if (!b) return;
    index = Number(b.dataset.index);
    render();
  });

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + images.length) % images.length;
    render();
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % images.length;
    render();
  });

  render();
}

function renderDetailPage() {
  const id = Number(getParam("id"));
  const item = PROPERTIES_LOCALIZED().find((p) => p.id === id);

  const empty = document.getElementById("detailEmpty");
  const wrap = document.getElementById("propertyDetail");

  if (!item) {
    empty.classList.remove("hide");
    wrap.classList.add("hide");
    return;
  }

  empty.classList.add("hide");
  wrap.classList.remove("hide");

  // Title / badges / price
  document.getElementById("detailTitle").textContent = item.titleText;
  document.getElementById("detailTag").textContent = item.tagText;

  const dealLabel =
    item.transaction === "achat" ? t("transaction.buy") : t("transaction.rent");
  document.getElementById("detailDeal").textContent = dealLabel;

  document.getElementById("detailPrice").textContent = formatMoney(
    item.price,
    item.transaction
  );

  // Meta chips
 // Meta chips
const typeLabel =
  item.type === "appartement"
    ? t("type.apartment")
    : item.type === "maison"
    ? t("type.house")
    : item.type === "villa"
    ? t("type.villa")
    : t("type.office");

const roomsLabel = roomsLabelText(item.rooms);

    CURRENT_LANG === "fr"
      ? `${item.rooms} ${I18N.fr.units.rooms(item.rooms)}`
      : I18N.en.units.rooms(item.rooms);

  document.getElementById("detailMeta").innerHTML = `
    <span class="chip">${item.city}</span>
    <span class="chip">${item.area} ${t("units.sqm")}</span>
    <span class="chip">${roomsLabel}</span>
    <span class="chip">${typeLabel}</span>
  `;

  // KV
  document.getElementById("detailKV").innerHTML = `
    <div class="kv"><span>${t("detail.labels.city")}</span><strong>${
    item.city
  }</strong></div>
    <div class="kv"><span>${t(
      "detail.labels.type"
    )}</span><strong>${typeLabel}</strong></div>
    <div class="kv"><span>${t(
      "detail.labels.deal"
    )}</span><strong>${dealLabel}</strong></div>
    <div class="kv"><span>${t("detail.labels.area")}</span><strong>${
    item.area
  } ${t("units.sqm")}</strong></div>
    <div class="kv"><span>${t(
      "detail.labels.rooms"
    )}</span><strong>${roomsLabel}</strong></div>
  `;

  // Description / features (fallback si non fourni)
  const desc = item.desc?.[CURRENT_LANG] ?? item.desc?.fr ?? "";
  document.getElementById("detailDesc").textContent = desc;

  const feats = item.features?.[CURRENT_LANG] ?? item.features?.fr ?? [];
  document.getElementById("detailFeatures").innerHTML = feats
    .map((f) => `<li>${f}</li>`)
    .join("");

  // Fake thumbs
  const hero = document.getElementById("detailHeroImg");
  const thumbs = document.getElementById("detailThumbs");

  const images =
    Array.isArray(item.images) && item.images.length ? item.images : [];

  if (images.length > 0) {
    initCarousel(images);
  } else {
    document.getElementById("detailHeroImg").style.background = `
    radial-gradient(900px 360px at 20% 20%, rgba(110,168,255,.28), transparent 60%),
    radial-gradient(800px 360px at 80% 0%, rgba(78,240,196,.22), transparent 55%),
    #0f1a32
  `;
    document.getElementById("detailThumbs").innerHTML = "";
  }

  // Contact form
  const form = document.getElementById("detailContactForm");
  const toast = document.getElementById("detailToast");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = document.getElementById("detailPhone").value.trim();
    toast.classList.remove("hide");

    if (!phone || phone.length < 6) toast.textContent = t("toast.phoneInvalid");
    else {
      toast.textContent = t("toast.visitSent", { title: item.titleText });
      form.reset();
    }
    window.clearTimeout(window.__detailToastTimer);
    window.__detailToastTimer = window.setTimeout(
      () => toast.classList.add("hide"),
      4500
    );
  });

  const locLabel =
    item.location?.label?.[CURRENT_LANG] ||
    item.location?.label?.fr ||
    `${item.city}`;

  const lat = item.location?.coordinates?.lat;
  const lng = item.location?.coordinates?.lng;

  if (typeof lat === "number" && typeof lng === "number") {
    renderLeafletMap(lat, lng, locLabel);
  } else {
    destroyMapIfAny(); // pas de coords => pas de map
  }
}

let __leafletMap = null;
let __leafletMarker = null;

function destroyMapIfAny() {
  if (__leafletMap) {
    __leafletMap.remove();
    __leafletMap = null;
    __leafletMarker = null;
  }
}

function renderLeafletMap(lat, lng, label) {
  const el = document.getElementById("map");
  if (!el || !window.L) return;

  destroyMapIfAny();

  __leafletMap = L.map(el, {
    scrollWheelZoom: false,
    dragging: true,
    tap: true,
  }).setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(__leafletMap);

  __leafletMarker = L.marker([lat, lng]).addTo(__leafletMap);
  if (label) __leafletMarker.bindPopup(label).openPopup();

  // Fix classique Leaflet quand la map est dans un conteneur flex/grid
  setTimeout(() => __leafletMap.invalidateSize(), 50);
}

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

document.addEventListener("DOMContentLoaded", async () => {
  // 1) langue
  const saved = localStorage.getItem("lang") || "fr";
  CURRENT_LANG = saved;
  document.documentElement.lang = saved;

  // 2) charger i18n (mais ne bloque pas le site si ça rate)
  try {
    await loadI18n();
  } catch (err) {
    console.error("i18n.json introuvable ou invalide :", err);
    // fallback minimal pour éviter de planter
    I18N = I18N || { fr: {}, en: {} };
  }

  // 3) injecter header/footer
  await Promise.all([
    loadPartial("site-header", "partials/header.html"),
    loadPartial("site-footer", "partials/footer.html")
  ]);

  // 4) bind + year (maintenant #year existe)
  bindLangButtons();
  //setYear?.(); // si tu as une fonction setYear, sinon fais le code ci-dessous
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // 5) traductions + sync
  applyTranslations();
  syncLangButtons?.();

  // 6) init data/pages (déplacé ici)
  await init(); // ✅ appelle ton init ici
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".lang-btn");
  if (!btn) return;
  const lang = btn.dataset.lang;
  if (!lang) return;
  setLanguage(lang);
});



