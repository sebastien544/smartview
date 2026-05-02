(function () {
  document.addEventListener("click", function (e) {
    const link = e.target.closest('a[href^="tel:"]');
    if (!link) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "phone_click",
      page_source: window.location.pathname,
    });
  });
})();
