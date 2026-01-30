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
  //bindLangButtons();
  //setYear?.(); // si tu as une fonction setYear, sinon fais le code ci-dessous
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // 5) traductions + sync
  applyTranslations();
  syncLangButtons?.();

  // 6) init data/pages (déplacé ici)
  await init(); // ✅ appelle ton init ici
});