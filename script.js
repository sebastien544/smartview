// ---------------- i18n ----------------
const I18N = {
  fr: {
    meta: {
      title: "SmartView — Agence immobilière",
      description:
        "SmartView vous accompagne pour acheter, vendre ou louer : annonces vérifiées, estimation gratuite, conseillers experts.",
    },
    nav: {
      listings: "Annonces",
      services: "Services",
      reviews: "Avis",
      contact: "Contact",
    },
    cta: {
      viewListings: "Voir les biens",
      viewListingsAria: "Voir les annonces",
      freeEstimate: "Estimation gratuite",
      freeEstimateAria: "Estimation gratuite",
    },
    hero: {
      eyebrow: "Annonces vérifiées • Conseillers experts",
      title: "Trouvez le bien qui vous ressemble, sans perdre de temps.",
      lead: "Achat, vente ou location : SmartView vous accompagne avec une sélection de biens rigoureuse, des visites rapides et une estimation gratuite de votre logement.",
      statsAria: "Chiffres clés",
      stats: {
        active: "biens actifs",
        delay: "délai moyen de visite",
        rating: "avis clients",
      },
    },
    search: {
      aria: "Recherche de biens",
      cityLabel: "Ville / Quartier",
      cityPlaceholder: "Ex. Lyon, Part-Dieu",
      typeLabel: "Type",
      transactionLabel: "Transaction",
      budgetLabel: "Budget max",
      submit: "Rechercher",
      submitAria: "Rechercher",
      all: "Tous",
      buyOrRent: "Achat / Location",
      noLimit: "Sans limite",
    },
    type: {
      apartment: "Appartement",
      house: "Maison",
      villa: "Villa",
      office: "Bureau",
    },
    transaction: { buy: "Achat", rent: "Location" },

    side: {
      aria: "Encart services",
      eyebrow: "Accompagnement de A à Z",
      title: "Vendre mieux, acheter serein.",
      lead: "Nos experts optimisent votre projet avec des outils pro et une stratégie claire.",
      item1: {
        title: "Estimation précise",
        desc: "Analyse marché + comparables",
      },
      item2: { title: "Photos & diffusion", desc: "Mise en valeur + portails" },
      item3: {
        title: "Accompagnement juridique",
        desc: "De l’offre au compromis",
      },
      talkToAdvisor: "Parler à un conseiller",
      urgent: "Urgent ?",
      callUs: "Appelez le 01 84 00 00 00",
    },

    listings: {
      title: "Biens à la une",
      subtitle:
        "Une sélection récente — filtrez par ville, type, transaction et budget.",
      reset: "Réinitialiser",
      empty: "Aucun bien ne correspond à votre recherche.",
      details: "Détails",
      visit: "Visiter",
    },

    services: {
      title: "Pourquoi choisir SmartView",
      subtitle: "Une approche simple, transparente, et orientée résultats.",
      f1: {
        title: "Conseillers locaux",
        desc: "Une vraie connaissance des quartiers et des prix au m².",
      },
      f2: {
        title: "Dossiers sécurisés",
        desc: "Vérification des pièces, solvabilité, conformité et diagnostics.",
      },
      f3: {
        title: "Visites rapides",
        desc: "Créneaux sous 48h en moyenne, suivi clair après chaque visite.",
      },
      f4: {
        title: "Stratégie de vente",
        desc: "Positionnement prix, diffusion premium, négociation.",
      },
    },

    reviews: {
      title: "Ils nous ont fait confiance",
      subtitle:
        "Quelques retours récents de clients accompagnés par nos équipes.",
      q1: {
        text: "“Visite organisée en 24h, dossier clair, et négociation maîtrisée. Super accompagnement.”",
        who: "Camille • Achat",
      },
      q2: {
        text: "“Estimation juste et vente signée rapidement. Les photos pro ont vraiment aidé.”",
        who: "Mehdi • Vente",
      },
      q3: {
        text: "“Très réactifs, transparents sur les charges et le bail. Je recommande.”",
        who: "Sarah • Location",
      },
    },

    contact: {
      title: "Besoin d’une estimation ou d’une sélection sur-mesure ?",
      subtitle: "Décrivez votre projet : on vous rappelle sous 24h ouvrées.",
      phonePlaceholder: "Votre téléphone",
      phoneAria: "Votre téléphone",
      submit: "Être rappelé",
    },

    footer: {
      explore: "Explorer",
      legal: "Légal",
      contact: "Contact",
      legalNotice: "Mentions légales",
      privacy: "Politique de confidentialité",
      cookies: "Cookies",
      callback: "Demander un rappel",
      rights: "Tous droits réservés.",
      address:
        "Agence immobilière • Achat • Vente • Location<br/>Supalai Blue Whale, 77110 Hua Hin",
    },

    toast: {
      details: ({ title, city, area }) =>
        `Détails — ${title} à ${city} (${area} m²).`,
      visitSent: ({ title }) =>
        `Demande de visite envoyée — un conseiller vous recontacte pour ${title}.`,
      phoneInvalid: "Merci d’indiquer un numéro valide (ex. 06 12 34 56 78).",
      callbackOk: "Merci ! Un conseiller vous rappelle sous 24h ouvrées.",
    },

    detail: {
      metaTitle: "SmartView — Détail annonce",
      back: "Retour aux annonces",
      notFoundTitle: "Annonce introuvable",
      notFoundText:
        "Cette annonce n’existe pas (ou plus). Retournez à la liste.",
      goBack: "Voir les annonces",
      keyInfo: "Informations",
      requestViewing: "Demander une visite",
      send: "Envoyer",
      description: "Description",
      features: "Équipements",
      location: "Localisation",
      locationHint:
        "Carte illustrative. L’adresse exacte est communiquée lors de la visite.",
      labels: {
        city: "Ville",
        type: "Type",
        deal: "Transaction",
        area: "Surface",
        rooms: "Pièces",
      },
    },

    units: { sqm: "m²", rooms: (n) => `pièce${n > 1 ? "s" : ""}` },
    rentSuffix: "/mois",
  },

  en: {
    meta: {
      title: "SmartView — Real Estate Agency",
      description:
        "SmartView helps you buy, sell, or rent: verified listings, free valuation, expert advisors.",
    },
    nav: {
      listings: "Listings",
      services: "Services",
      reviews: "Reviews",
      contact: "Contact",
    },
    cta: {
      viewListings: "View properties",
      viewListingsAria: "View listings",
      freeEstimate: "Free valuation",
      freeEstimateAria: "Free valuation",
    },
    hero: {
      eyebrow: "Verified listings • Expert advisors",
      title: "Find the home that fits you — without wasting time.",
      lead: "Buy, sell, or rent: SmartView supports you with a carefully curated selection, fast viewings, and a free home valuation.",
      statsAria: "Key stats",
      stats: {
        active: "active listings",
        delay: "avg. time to viewing",
        rating: "customer rating",
      },
    },
    search: {
      aria: "Property search",
      cityLabel: "City / Area",
      cityPlaceholder: "e.g., Lyon, Part-Dieu",
      typeLabel: "Type",
      transactionLabel: "Deal",
      budgetLabel: "Max budget",
      submit: "Search",
      submitAria: "Search",
      all: "All",
      buyOrRent: "Buy / Rent",
      noLimit: "No limit",
    },
    type: {
      apartment: "Apartment",
      house: "House",
      villa: "Villa",
      office: "Office",
    },
    transaction: { buy: "Buy", rent: "Rent" },

    side: {
      aria: "Services panel",
      eyebrow: "End-to-end support",
      title: "Sell smarter, buy with confidence.",
      lead: "Our experts optimize your project with pro tools and a clear strategy.",
      item1: {
        title: "Accurate valuation",
        desc: "Market analysis + comparables",
      },
      item2: { title: "Photos & promotion", desc: "Showcase + portals" },
      item3: { title: "Legal guidance", desc: "From offer to contract" },
      talkToAdvisor: "Talk to an advisor",
      urgent: "Urgent?",
      callUs: "Call +33 1 84 00 00 00",
    },

    listings: {
      title: "Featured properties",
      subtitle: "A recent selection — filter by city, type, deal, and budget.",
      reset: "Reset",
      empty: "No properties match your search.",
      details: "Details",
      visit: "Book a viewing",
    },

    services: {
      title: "Why choose SmartView",
      subtitle: "Simple, transparent, and results-driven.",
      f1: {
        title: "Local advisors",
        desc: "Real neighborhood expertise and price-per-sqm insight.",
      },
      f2: {
        title: "Secure files",
        desc: "Document checks, solvency, compliance, and diagnostics.",
      },
      f3: {
        title: "Fast viewings",
        desc: "Slots within 48 hours on average, clear follow-up after each visit.",
      },
      f4: {
        title: "Sales strategy",
        desc: "Pricing, premium distribution, negotiation.",
      },
    },

    reviews: {
      title: "Trusted by our clients",
      subtitle: "A few recent reviews from clients supported by our teams.",
      q1: {
        text: "“Viewing arranged within 24 hours, clear file, and great negotiation. Excellent support.”",
        who: "Camille • Buyer",
      },
      q2: {
        text: "“Accurate valuation and a fast sale. The professional photos really helped.”",
        who: "Mehdi • Seller",
      },
      q3: {
        text: "“Very responsive and transparent about fees and the lease. Highly recommended.”",
        who: "Sarah • Renter",
      },
    },

    contact: {
      title: "Need a valuation or a tailored shortlist?",
      subtitle:
        "Tell us about your project — we’ll call you back within 1 business day.",
      phonePlaceholder: "Your phone number",
      phoneAria: "Your phone number",
      submit: "Request a call",
    },

    footer: {
      explore: "Explore",
      legal: "Legal",
      contact: "Contact",
      legalNotice: "Legal notice",
      privacy: "Privacy policy",
      cookies: "Cookies",
      callback: "Request a callback",
      rights: "All rights reserved.",
      address:
        "Real Estate Agency • Buy • Sell • Rent<br/>Supalai Blue Whale, 77110 Lyon",
    },

    toast: {
      details: ({ title, city, area }) =>
        `Details — ${title} in ${city} (${area} sqm).`,
      visitSent: ({ title }) =>
        `Viewing request sent — an advisor will contact you about ${title}.`,
      phoneInvalid: "Please enter a valid phone number.",
      callbackOk:
        "Thanks! An advisor will call you back within 1 business day.",
    },

    detail: {
      metaTitle: "SmartView — Property details",
      back: "Back to listings",
      notFoundTitle: "Listing not found",
      notFoundText: "This listing doesn’t exist anymore. Go back to the list.",
      goBack: "View listings",
      keyInfo: "Key information",
      requestViewing: "Request a viewing",
      send: "Send",
      description: "Description",
      features: "Features",
      location: "Location",
      locationHint:
        "Illustrative map. Exact address is shared during the viewing.",
      labels: {
        city: "City",
        type: "Type",
        deal: "Deal",
        area: "Area",
        rooms: "Rooms",
      },
    },

    units: { sqm: "sqm", rooms: (n) => `${n} room${n > 1 ? "s" : ""}` },
    rentSuffix: "/month",
  },
};

let CURRENT_LANG = localStorage.getItem("lang") || "fr";

function t(path, vars) {
  const parts = path.split(".");
  let node = I18N[CURRENT_LANG];
  for (const p of parts) node = node?.[p];
  if (typeof node === "function") return node(vars);
  return node ?? path;
}

function setLanguage(lang) {
  CURRENT_LANG = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  // title + meta description
  document.title = t("meta.title");

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", t("meta.description"));

  applyTranslations();
  syncLangButtons();

  if (isDetailPage()) {
    renderDetailPage();             // ← met à jour title/desc/features selon CURRENT_LANG
  } else {
    render(PROPERTIES_LOCALIZED()); // ← met à jour les cartes
  }
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

// ---------------- Listings data (localized) ----------------
// Keep base data, but store translations for titles & tags.
// const PROPERTIES = [
//   {
//     id: 1,
//     title: {
//       fr: "Appartement lumineux • 3 pièces",
//       en: "Bright apartment • 3 rooms",
//     },
//     city: "Lyon",
//     area: 68,
//     rooms: 3,
//     type: "appartement",
//     transaction: "achat",
//     price: 329000,
//     tag: { fr: "Exclusivité", en: "Exclusive" },

//     desc: {
//       fr: "Appartement traversant, lumineux, proche transports et commerces. Cuisine équipée, séjour spacieux, rangements.",
//       en: "Bright dual-aspect apartment near transport and shops. Fully equipped kitchen, spacious living room, storage.",
//     },
//     features: {
//       fr: ["Balcon", "Ascenseur", "Cuisine équipée", "Double vitrage"],
//       en: ["Balcony", "Elevator", "Equipped kitchen", "Double glazing"],
//     },
//   },
//   {
//     id: 2,
//     title: {
//       fr: "Maison familiale avec jardin",
//       en: "Family home with garden",
//     },
//     city: "Nantes",
//     area: 120,
//     rooms: 5,
//     type: "maison",
//     transaction: "achat",
//     price: 489000,
//     tag: { fr: "Coup de cœur", en: "Top pick" },
//   },
//   {
//     id: 3,
//     title: {
//       fr: "Studio meublé proche métro",
//       en: "Furnished studio near метро",
//     },
//     city: "Paris",
//     area: 22,
//     rooms: 1,
//     type: "appartement",
//     transaction: "location",
//     price: 1150,
//     tag: { fr: "Meublé", en: "Furnished" },
//   },
//   {
//     id: 4,
//     title: { fr: "Villa contemporaine • piscine", en: "Modern villa • pool" },
//     city: "Nice",
//     area: 160,
//     rooms: 6,
//     type: "villa",
//     transaction: "achat",
//     price: 1090000,
//     tag: { fr: "Prestige", en: "Prestige" },
//   },
//   {
//     id: 5,
//     title: {
//       fr: "Bureau rénové en centre-ville",
//       en: "Renovated office downtown",
//     },
//     city: "Bordeaux",
//     area: 95,
//     rooms: 4,
//     type: "bureau",
//     transaction: "location",
//     price: 2100,
//     tag: { fr: "Pro", en: "Pro" },
//   },
//   {
//     id: 6,
//     title: {
//       fr: "Appartement avec balcon • 2 pièces",
//       en: "Apartment with balcony • 2 rooms",
//     },
//     city: "Lille",
//     area: 45,
//     rooms: 2,
//     type: "appartement",
//     transaction: "achat",
//     price: 199000,
//     tag: { fr: "Nouveau", en: "New" },
//   },
// ];

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
  const roomsLabel =
    CURRENT_LANG === "fr"
      ? `${p.rooms} ${I18N.fr.units.rooms(p.rooms)}`
      : I18N.en.units.rooms(p.rooms);

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
        <div class="price">${formatMoney(p.price, p.transaction, p.currency || "EUR")}</div>
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
          <a class="btn small ghost" href="property.html?id=${p.id}" data-action="details">
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

burger.addEventListener("click", () => {
  const open = mobileNav.style.display === "block";
  mobileNav.style.display = open ? "none" : "block";
  burger.setAttribute("aria-expanded", String(!open));
});

mobileNav.addEventListener("click", (e) => {
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

  thumbs.innerHTML = images.map((src, i) => `
    <button
      class="detail-thumb ${i === 0 ? "active" : ""}"
      type="button"
      aria-label="Image ${i + 1}"
      style="background-image:url('${src}')"
      data-index="${i}">
    </button>
  `).join("");

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
  const typeLabel =
    item.type === "appartement"
      ? t("type.apartment")
      : item.type === "maison"
      ? t("type.house")
      : item.type === "villa"
      ? t("type.villa")
      : t("type.office");

  const roomsLabel =
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
document.getElementById("detailFeatures").innerHTML = feats.map(f => `<li>${f}</li>`).join("");

  // Fake thumbs
  const hero = document.getElementById("detailHeroImg");
  const thumbs = document.getElementById("detailThumbs");

  const images = Array.isArray(item.images) && item.images.length
  ? item.images
  : [];

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
}

// ---------------- Init ----------------
async function init() {
  document.getElementById("year").textContent = new Date().getFullYear();

  // i18n UI (tes fonctions existantes)
  applyTranslations();
  syncLangButtons();

  // Charge les données
  try {
    await loadProperties();
  } catch (err) {
    console.error(err);
    // Option: afficher un message user-friendly
    return;
  }

  // Route simple
  if (isDetailPage()) {
    renderDetailPage();
  } else {
    render(PROPERTIES_LOCALIZED());
  }
}

init();
