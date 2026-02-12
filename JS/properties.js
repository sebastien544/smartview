const DATA_URL = "./data/properties.json";

async function loadProperties() {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${DATA_URL}: ${res.status}`);
  PROPERTIES = await res.json();
  return PROPERTIES;
}

function isDetailPage() {
  return (
    document.getElementById("propertyDetail") &&
    document.getElementById("detailTitle")
  );
}

function render(list) {
  listingEl.innerHTML = list.map(cardTemplate).join("");
  emptyStateEl.classList.toggle("hide", list.length !== 0);
}

function PROPERTIES_LOCALIZED() {
  return PROPERTIES.map((p) => ({
    ...p,
    titleText: p.title?.[CURRENT_LANG] ?? p.title?.fr ?? "",
    tagText: p.tag?.[CURRENT_LANG] ?? p.tag?.fr ?? "",
  }));
}


/* ------------------------------------------------------------------------------------------------------------------------
------------------------------------------PROPERTIES DETAILS ------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------*/

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
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
      ? `${item.rooms} ${I18N.fr.units.rooms}`
      : I18N.en.units.rooms;

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


/* ------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------MAP ------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------*/

let __leafletMap = null;
let __leafletMarker = null;

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

function destroyMapIfAny() {
  if (__leafletMap) {
    __leafletMap.remove();
    __leafletMap = null;
    __leafletMarker = null;
  }
}

/* ------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------*/

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