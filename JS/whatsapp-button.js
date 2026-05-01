(function () {
  var WHATSAPP_URL =
    "https://wa.me/66812984688?text=Bonjour%2C%20je%20vous%20contacte%20depuis%20votre%20site%20web";

  var style = document.createElement("style");
  style.textContent =
    ".wa-float{position:fixed;bottom:20px;right:20px;width:60px;height:60px;" +
    "background:#25D366;border-radius:50%;display:flex;align-items:center;" +
    "justify-content:center;z-index:9999;text-decoration:none;" +
    "box-shadow:0 4px 14px rgba(37,211,102,.45);" +
    "animation:wa-pulse 2.8s ease-in-out infinite;}" +
    ".wa-float:hover{transform:scale(1.1);box-shadow:0 6px 22px rgba(37,211,102,.65);animation:none;}" +
    "@keyframes wa-pulse{0%,100%{box-shadow:0 4px 14px rgba(37,211,102,.45)}" +
    "50%{box-shadow:0 4px 28px rgba(37,211,102,.72)}}";
  document.head.appendChild(style);

  var a = document.createElement("a");
  a.href = WHATSAPP_URL;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.className = "wa-float";
  a.setAttribute("aria-label", "Nous contacter sur WhatsApp");
  a.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="white" aria-hidden="true">' +
    '<path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.773L0 32l8.476-2.007A15.93 15.93 0 0016 32c8.836 0 16-7.163 16-16S24.836 0 16 0z' +
    "m0 29.333a13.27 13.27 0 01-6.769-1.845l-.485-.289-5.028 1.191 1.265-4.88-.317-.5A13.262 13.262 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333z" +
    "m7.28-9.92c-.399-.2-2.36-1.164-2.727-1.297-.366-.133-.632-.2-.898.2-.266.399-1.031 1.297-1.265 1.563-.233.266-.466.3-.865.1-.399-.2-1.685-.621-3.21-1.98-1.186-1.058-1.988-2.365-2.22-2.764-.233-.399-.025-.615.175-.814.18-.179.399-.466.598-.7.2-.233.266-.399.399-.665.133-.266.067-.499-.033-.7-.1-.199-.898-2.164-1.23-2.963-.325-.776-.656-.671-.898-.683l-.765-.013c-.266 0-.699.1-1.065.499-.366.399-1.398 1.365-1.398 3.33 0 1.964 1.431 3.863 1.63 4.13.2.265 2.815 4.296 6.82 6.025.953.411 1.697.657 2.277.84.957.304 1.828.261 2.517.158.767-.114 2.36-.965 2.693-1.896.333-.932.333-1.731.233-1.897-.1-.165-.366-.265-.765-.465z\"/>" +
    "</svg>";

  a.addEventListener("click", function () {
    if (typeof gtag === "function") {
      gtag("event", "whatsapp_click", {
        event_category: "contact",
        event_label: "floating_button",
      });
    }
  });

  function inject() {
    document.body.appendChild(a);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
