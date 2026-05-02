document.addEventListener("DOMContentLoaded", async () => {
  // 1) langue
  const saved = window.__lang || "en";
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
  const _b = window.__base || '';
  const _lang = window.__partialLang || '';
  const _hf = _lang ? `partials/header-${_lang}.html` : 'partials/header.html';
  const _ff = _lang ? `partials/footer-${_lang}.html` : 'partials/footer.html';
  await Promise.all([
    loadPartial("site-header", _b + _hf),
    loadPartial("site-footer", _b + _ff)
  ]);

  // 3.1) load currency helper and initialize UI/rates (header partial is now present)
  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  try {
    await loadScript(_b + 'JS/currency.js');
    if (window.Currency && typeof window.Currency.loadRatesIfNeeded === 'function') {
      // load cached rates (non-blocking) but await so conversions work immediately after
      try { await window.Currency.loadRatesIfNeeded(); } catch(e) { console.warn('currency load failed', e); }
    }
    // setup UI (in case header was injected)
    if (typeof window.setupCurrencyUI === 'function') window.setupCurrencyUI();
  } catch (e) {
    console.warn('Failed to load currency helper', e);
  }

  // 4) bind + year (maintenant #year existe)
  //bindLangButtons();
  //setYear?.(); // si tu as une fonction setYear, sinon fais le code ci-dessous
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // 5) traductions + sync
  applyTranslations();
  syncLangButtons?.();

  // 6) init data/pages (déplacé ici)
  await init(); // ✅ appelle ton init ici

  // Re-render listings/detail when currency changes
  document.addEventListener('currency.change', () => {
    try {
      if (isDetailPage()) renderDetailPage();
      else render(PROPERTIES_LOCALIZED());
    } catch (err) {
      console.warn('currency change re-render failed', err);
    }
  });
});