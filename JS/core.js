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

function roomsLabelText(n) {
  // fonctionne avec ton JSON: "units.rooms": "{n} room(s)" (et pareil en FR)
  return t("units.rooms", { n });
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