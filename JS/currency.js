/* currency.js
   - Loads FX rates (base THB) from exchangerate.host and caches them in localStorage for 24h
   - Exposes window.Currency with helpers and dispatches `currency.change` events
*/
(function () {
  const FX_CACHE_KEY = "fx_rates_v1";
  const CURRENCY_KEY = "site_currency";
  const DEFAULT_CURRENCY = "THB";
  let FX_RATES = null;
  // Emergency fallback rates (approx) used only if all providers fail.
  // These are conservative placeholders – replace with live values when possible.
  const EMERGENCY_RATES = { EUR: 0.025, USD: 0.030 };
  // Visible load indicator for debugging
  try { console.log('currency.js: script loaded'); } catch (e) {}

  async function loadRatesIfNeeded() {
    const raw = localStorage.getItem(FX_CACHE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.ts < 24 * 3600 * 1000 && parsed.rates) {
          FX_RATES = parsed.rates;
          return FX_RATES;
        }
      } catch (e) {}
    }

    // Helper to persist computed rates
    function persistRates(ratesObj) {
      FX_RATES = ratesObj || {};
      try {
        localStorage.setItem(FX_CACHE_KEY, JSON.stringify({ ts: Date.now(), rates: FX_RATES }));
      } catch (e) {}
      try {
        // expose for debugging in console
        window.__FX_DEBUG = window.__FX_DEBUG || {};
        window.__FX_DEBUG.rates = FX_RATES;
        if (window.Currency) window.Currency.__rates = FX_RATES;
        console.log('currency: persistRates saved', FX_RATES);
      } catch (e) {}
      return FX_RATES;
    }

    // Try multiple free providers in sequence. Prefer providers that do not require an API key.
    const providers = [
      {
        name: 'frankfurter.app',
        fn: async () => {
          const url = 'https://api.frankfurter.app/latest?from=THB&to=EUR,USD';
          console.log('currency: frankfurter fetching', url);
          const res = await fetch(url);
          const text = await res.text();
          console.log('currency: frankfurter status', res.status, 'len', text.length);
          let json = null;
          try { json = JSON.parse(text); console.log('currency: frankfurter json', Object.keys(json || {})); } catch (e) { console.log('currency: frankfurter json parse failed'); }
          if (!res.ok) {
            const msg = (json && json.error) ? json.error : text.slice(0, 500);
            throw new Error(msg || 'non-200 from frankfurter');
          }
          if (json && json.rates) return { EUR: json.rates.EUR, USD: json.rates.USD };
          return null;
        }
      },
      {
        name: 'open.er-api.com',
        fn: async () => {
          const url = 'https://open.er-api.com/v6/latest/THB';
          console.log('currency: open.er-api fetching', url);
          const res = await fetch(url);
          const text = await res.text();
          console.log('currency: open.er-api status', res.status, 'len', text.length);
          let json = null;
          try { json = JSON.parse(text); console.log('currency: open.er-api json keys', Object.keys(json || {})); } catch (e) { console.log('currency: open.er-api json parse failed'); }
          if (!res.ok) {
            const msg = (json && json.error) ? json.error : text.slice(0, 500);
            throw new Error(msg || 'non-200 from open.er-api.com');
          }
          if (json && json.rates) return { EUR: json.rates.EUR, USD: json.rates.USD };
          return null;
        }
      },
      {
        name: 'exchangerate.host-fallback',
        fn: async () => {
          const url = 'https://api.exchangerate.host/latest?symbols=EUR,USD,THB';
          console.log('currency: exchangerate.host fetching', url);
          const res = await fetch(url);
          const text = await res.text();
          console.log('currency: exchangerate.host status', res.status, 'len', text.length);
          let json = null;
          try { json = JSON.parse(text); console.log('currency: exchangerate.host json keys', Object.keys(json || {})); } catch (e) { console.log('currency: exchangerate.host json parse failed'); }
          if (!res.ok) {
            const msg = (json && json.error) ? json.error : text.slice(0, 500);
            throw new Error(msg || 'non-200 from exchangerate.host fallback');
          }
          if (json && json.rates && json.rates.THB) {
            const thbPerBase = json.rates.THB;
            const eurPerThb = 1 / thbPerBase;
            const usdPerThb = json.rates.USD / thbPerBase;
            return { EUR: eurPerThb, USD: usdPerThb };
          }
          return null;
        }
      }
    ];

    console.log('currency.js: attempting to load FX rates from providers', providers.map(p=>p.name));
    for (const p of providers) {
      try {
        const result = await p.fn();
        if (result && (result.EUR || result.USD)) {
          console.log('currency: loaded rates from', p.name, result);
          const rates = persistRates(result);
          console.log('currency: rates after persist', rates);
          return rates;
        }
      } catch (err) {
        try {
          const text = err && err.message ? err.message : '';
          console.log('currency: provider', p.name, 'failed:', text);
        } catch (e) {}
      }
    }

    console.warn('currency: all providers failed to return usable FX rates — using emergency fallback rates', EMERGENCY_RATES);
    // Persist emergency rates so conversion works while diagnosing provider issues
    const fallback = persistRates(EMERGENCY_RATES);
    console.log('currency: persisted emergency rates', fallback);
    return fallback;
  }

  function getSelectedCurrency() {
    return localStorage.getItem(CURRENCY_KEY) || DEFAULT_CURRENCY;
  }

  function setSelectedCurrency(cur) {
    localStorage.setItem(CURRENCY_KEY, cur);
    // immediate event so UI (symbols) updates quickly
    try { console.log('currency: setSelectedCurrency', cur); } catch(e){}
    document.dispatchEvent(new CustomEvent("currency.change", { detail: { currency: cur } }));

    // ensure rates are loaded and then re-dispatch to allow numeric conversion
    loadRatesIfNeeded()
      .then(() => {
        document.dispatchEvent(new CustomEvent("currency.change", { detail: { currency: cur, ratesLoaded: true } }));
      })
      .catch(() => {
        // ignore — render will fallback to THB values
      });
  }

  function safeNumber(n) {
    if (n == null || n === "") return 0;
    if (typeof n === "string") {
      const digits = n.replace(/[^0-9.-]/g, "");
      return Number(digits) || 0;
    }
    return Number(n) || 0;
  }

  function convertFromTHB(amountTHB, targetCurrency) {
    amountTHB = safeNumber(amountTHB);
    if (!targetCurrency || targetCurrency === "THB") return amountTHB;
    if (!FX_RATES) {
      //console.log('convertFromTHB: no FX_RATES available');
      return amountTHB;
    }
    const rate = FX_RATES[targetCurrency];
    //console.log('convertFromTHB', { amountTHB, targetCurrency, FX_RATES, rate });
    if (!rate) return amountTHB;
    return amountTHB * rate;
  }

  // expose
  window.Currency = {
    loadRatesIfNeeded,
    getSelectedCurrency,
    setSelectedCurrency,
    convertFromTHB,
    // Force a network reload (clears cache and re-fetches). Useful for debugging.
    forceReloadRates: async function () {
      try {
        console.log('currency: forceReloadRates clearing cache and fetching');
        localStorage.removeItem(FX_CACHE_KEY);
      } catch (e) {}
      return await loadRatesIfNeeded();
    }
  };

  // Attach UI handler if select exists (header partial is loaded asynchronously; pages should call setupCurrencyUI after partial is loaded)
  function setupCurrencyUI() {
    const sel = document.getElementById("currencySelect");
    if (!sel) return;
    try { console.log('currency: setupCurrencyUI found selector', sel); } catch(e){}
    sel.value = getSelectedCurrency();
    sel.addEventListener("change", (e) => setSelectedCurrency(e.target.value));
  }

  // Try to setup on DOMContentLoaded and also when partials are loaded
  document.addEventListener("DOMContentLoaded", () => {
    setupCurrencyUI();
  });

  // expose helper for pages that load partials after DOMContentLoaded
  window.setupCurrencyUI = setupCurrencyUI;
})();
