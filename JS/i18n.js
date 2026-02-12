let I18N = null;

let CURRENT_LANG = localStorage.getItem("lang") || "fr";

// --------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------Language buttons--------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------

// const langToggle = document.getElementById("langToggle");
// const langToggleMobile = document.getElementById("langToggleMobile");

// if (langToggle) langToggle.addEventListener("click", toggleLanguage);
// if (langToggleMobile)
//   langToggleMobile.addEventListener("click", toggleLanguage);

// function toggleLanguage() {
//   setLanguage(CURRENT_LANG === "fr" ? "en" : "fr");
// }

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-lang]");
  if (!btn) return;

//   const lang = btn.dataset.lang;
//   if (!lang) return;

  setLanguage(CURRENT_LANG === "fr" ? "en" : "fr");
});


// --------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------


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

function bindLangButtons() {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.onclick = () => setLanguage(btn.dataset.lang);
  });
}

function toggleLanguage() {
  setLanguage(CURRENT_LANG === "fr" ? "en" : "fr");
}

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

async function loadI18n() {
  const res = await fetch("./data/i18n.json");
  if (!res.ok) throw new Error("Failed to load i18n.json");
  I18N = await res.json();
}