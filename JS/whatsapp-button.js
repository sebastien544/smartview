// Floating "Contact us" widget (expandable: WhatsApp + Call) — replaces the old WhatsApp bubble.
(function () {
  var fr = (window.__lang || "en") === "fr";
  var T = fr
    ? { open: "Nous contacter", close: "Fermer", wa: "WhatsApp", call: "Appeler", aria: "Nous contacter", waText: "Bonjour, je vous contacte depuis votre site web" }
    : { open: "Contact us", close: "Close", wa: "WhatsApp", call: "Call us", aria: "Contact us", waText: "Hello, I'm contacting you from your website" };
  var PHONE = "+66812984688";
  var WA = "https://wa.me/66812984688?text=" + encodeURIComponent(T.waText);

  var css = document.createElement("style");
  css.textContent = [
    ".sv-contact{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:10px;font-family:inherit}",
    ".sv-menu{display:flex;flex-direction:column;gap:8px;opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .2s ease,transform .2s ease}",
    ".sv-contact.open .sv-menu{opacity:1;transform:none;pointer-events:auto}",
    ".sv-item{display:inline-flex;align-items:center;gap:9px;background:#fff;color:#0b1220;font-weight:700;font-size:14px;text-decoration:none;padding:11px 16px;border-radius:999px;box-shadow:0 10px 26px rgba(11,18,32,.22);white-space:nowrap;transition:transform .15s ease}",
    ".sv-item:hover{transform:translateY(-1px)}",
    ".sv-item svg{width:18px;height:18px;flex:none}",
    ".sv-item.wa svg{color:#25D366}",
    ".sv-toggle{display:inline-flex;align-items:center;gap:9px;border:0;cursor:pointer;font-family:inherit;font-weight:800;font-size:15px;color:#07101a;background:linear-gradient(135deg,#6ea8ff,#4ef0c4);padding:14px 20px;border-radius:999px;box-shadow:0 10px 26px rgba(11,18,32,.3);transition:transform .15s ease}",
    ".sv-toggle:hover{transform:translateY(-1px)}",
    ".sv-toggle svg{width:18px;height:18px;flex:none}",
    ".sv-toggle .lbl-open{display:inline-flex;align-items:center;gap:9px}",
    ".sv-toggle .lbl-close{display:none;align-items:center}",
    ".sv-contact.open .sv-toggle .lbl-open{display:none}",
    ".sv-contact.open .sv-toggle .lbl-close{display:inline-flex}"
  ].join("");
  document.head.appendChild(css);

  var chat = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2v3l4-3h6a2 2 0 0 0 2-2Z"/></svg>';
  var phoneIco = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h2.5l1.3 4-1.8 1.4a10 10 0 0 0 4.6 4.6l1.4-1.8 4 1.3V16a2 2 0 0 1-2 2A13 13 0 0 1 4 6a2 2 0 0 1 2-2Z"/></svg>';
  var waIco = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.773L0 32l8.476-2.007A15.93 15.93 0 0016 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm0 29.333a13.27 13.27 0 01-6.769-1.845l-.485-.289-5.028 1.191 1.265-4.88-.317-.5A13.262 13.262 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.28-9.92c-.399-.2-2.36-1.164-2.727-1.297-.366-.133-.632-.2-.898.2-.266.399-1.031 1.297-1.265 1.563-.233.266-.466.3-.865.1-.399-.2-1.685-.621-3.21-1.98-1.186-1.058-1.988-2.365-2.22-2.764-.233-.399-.025-.615.175-.814.18-.179.399-.466.598-.7.2-.233.266-.399.399-.665.133-.266.067-.499-.033-.7-.1-.199-.898-2.164-1.23-2.963-.325-.776-.656-.671-.898-.683l-.765-.013c-.266 0-.699.1-1.065.499-.366.399-1.398 1.365-1.398 3.33 0 1.964 1.431 3.863 1.63 4.13.2.265 2.815 4.296 6.82 6.025.953.411 1.697.657 2.277.84.957.304 1.828.261 2.517.158.767-.114 2.36-.965 2.693-1.896.333-.932.333-1.731.233-1.897-.1-.165-.366-.265-.765-.465z"/></svg>';

  var wrap = document.createElement("div");
  wrap.className = "sv-contact";
  wrap.innerHTML =
    '<div class="sv-menu">' +
      '<a class="sv-item wa" href="' + WA + '" target="_blank" rel="noopener noreferrer">' + waIco + T.wa + '</a>' +
      '<a class="sv-item call" href="tel:' + PHONE + '">' + phoneIco + T.call + '</a>' +
    '</div>' +
    '<button class="sv-toggle" aria-expanded="false" aria-label="' + T.aria + '">' +
      '<span class="lbl-open">' + chat + T.open + '</span>' +
      '<span class="lbl-close">✕ ' + T.close + '</span>' +
    '</button>';

  function mount() {
    document.body.appendChild(wrap);
    var toggle = wrap.querySelector(".sv-toggle");
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    wrap.querySelector(".sv-item.wa").addEventListener("click", function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "whatsapp_click", page_source: window.location.pathname });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
