#!/usr/bin/env python3
"""
Build the property catalogue from Sanity (project dnwfnet2, dataset production).

Generates, from the published `property` documents:
  - data/properties_fr.json / data/properties_en.json   (read by the existing JS: lists, home, filters)
  - fr/biens/<slug>/index.html and en/properties/<slug>/index.html  (one static, indexable page per listing)
  - the listing entries of sitemap.xml (between the AUTO-BIENS markers)

Standard library only, no token needed (the dataset is public).
Run from the repository root:  python3 scripts/build_from_sanity.py
"""
import html
import json
import os
import re
import shutil
import sys
import urllib.parse
import urllib.request
import zlib

PROJECT_ID = "dnwfnet2"
DATASET = "production"
API_VERSION = "v2024-01-01"
SITE = "https://smartview-huahin.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LANGS = {
    "fr": {"dir": "fr/biens", "locale_price": "fr"},
    "en": {"dir": "en/properties", "locale_price": "en"},
}

QUERY = """*[_type == "property" && !(_id in path("drafts.**")) && defined(slug.current)]
| order(coalesce(displayOrder, -1) asc, _createdAt desc) {
  _id, _createdAt, _updatedAt, ref, legacyId, title, "slug": slug.current, status, featured, isNew,
  tag, description, features, transaction, propertyType, price, area, land, bedrooms, bathrooms,
  rooms, year, city, location, project,
  "images": images[defined(asset)]{ alt, "url": asset->url }
}"""

AUTO_START = "<!-- AUTO-BIENS:START (généré par scripts/build_from_sanity.py, ne pas modifier à la main) -->"
AUTO_END = "<!-- AUTO-BIENS:END -->"


# --------------------------------------------------------------------------- helpers
def fetch_properties():
    url = (f"https://{PROJECT_ID}.api.sanity.io/{API_VERSION}/data/query/{DATASET}?"
           + urllib.parse.urlencode({"query": QUERY, "perspective": "published"}))
    with urllib.request.urlopen(url, timeout=60) as r:
        return json.load(r)["result"]


def esc(s):
    return html.escape(str(s if s is not None else ""), quote=True)


def img(url, w=1600, h=None):
    q = {"w": w, "auto": "format", "q": 75}
    if h:
        q.update({"h": h, "fit": "crop"})
    return f"{url}?{urllib.parse.urlencode(q)}"


def legacy_id(p):
    """Numeric id used by the JS (property_id in GA4, ?id= links). Imported listings keep their
    historical id; new ones get a stable id derived from the Sanity document id."""
    if p.get("legacyId"):
        return int(p["legacyId"])
    return 100000 + zlib.crc32(p["_id"].encode()) % 900000


def page_path(lang, slug):
    return f"/{LANGS[lang]['dir']}/{slug}/"


def num(v):
    return v if isinstance(v, (int, float)) else 0


def price_text(price, lang, transaction):
    n = int(num(price))
    if lang == "fr":
        s = f"{n:,}".replace(",", " ") + " ฿"
        return s + (" /mois" if transaction == "location" else "")
    s = f"฿{n:,}"
    return s + (" /month" if transaction == "location" else "")


def loc(obj, lang):
    return (obj or {}).get(lang) or (obj or {}).get("fr" if lang == "en" else "en") or ""


# --------------------------------------------------------------------------- JSON for the JS
def to_site_json(p, lang):
    location = p.get("location") or {}
    label = location.get("labelFr" if lang == "fr" else "labelEn") or location.get("labelFr") or p.get("city")
    item = {
        "id": legacy_id(p),
        "ref": p.get("ref") or "",
        "new": bool(p.get("isNew")),
        "featured": bool(p.get("featured")),
        "status": p.get("status") or "disponible",
        "city": p.get("city") or "",
        "area": num(p.get("area")),
        "land": num(p.get("land")),
        "rooms": num(p.get("rooms")),
        "bedrooms": num(p.get("bedrooms")),
        "bathrooms": num(p.get("bathrooms")),
        "year": num(p.get("year")),
        "type": p.get("propertyType") or "maison",
        "transaction": p.get("transaction") or "achat",
        "price": num(p.get("price")),
        "currency": "THB",
        "project": "",
        "images": [img(i["url"]) for i in p.get("images") or []],
        "tag": loc(p.get("tag"), lang),
        "title": loc(p.get("title"), lang),
        "desc": loc(p.get("description"), lang),
        "features": (p.get("features") or {}).get(lang) or (p.get("features") or {}).get("fr") or [],
        "url": page_path(lang, p["slug"]),
    }
    if location.get("lat") is not None and location.get("lng") is not None:
        item["location"] = {"label": label, "coordinates": {"lat": location["lat"], "lng": location["lng"]}}
    else:
        item["location"] = {"label": label}
    if p.get("status") == "vendu":
        item["sold"] = True
    return item


# --------------------------------------------------------------------------- static pages
def load_i18n():
    with open(os.path.join(ROOT, "data/i18n.json"), encoding="utf-8") as f:
        return json.load(f)


def render_page(template, p, lang, i18n):
    T = i18n[lang]
    other = "en" if lang == "fr" else "fr"
    item = to_site_json(p, lang)
    title = item["title"]
    desc_full = item["desc"]
    meta_desc = re.sub(r"\s+", " ", desc_full).strip()
    if len(meta_desc) > 158:
        meta_desc = meta_desc[:155].rsplit(" ", 1)[0] + "…"
    url = SITE + page_path(lang, p["slug"])
    url_other = SITE + page_path(other, p["slug"])
    url_fr = url if lang == "fr" else url_other
    images = p.get("images") or []
    og_image = img(images[0]["url"], 1200, 630) if images else f"{SITE}/assets/hero.webp"

    type_key = {"appartement": "apartment", "maison": "house", "villa": "villa"}.get(item["type"], "office")
    type_label = T["type"][type_key]
    deal_label = T["transaction"]["buy" if item["transaction"] == "achat" else "rent"]
    rooms_label = T["units"]["roomsPlural" if item["bedrooms"] > 1 else "rooms"].replace("{n}", str(item["bedrooms"]))
    sqm = T["units"]["sqm"]
    labels = T["detail"]["labels"]
    sold = item.get("sold", False)

    jsonld = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": title,
        "description": meta_desc,
        "url": url,
        "image": [img(i["url"], 1600) for i in images[:6]],
        "datePosted": (p.get("_createdAt") or "")[:10],
        "inLanguage": lang,
        "offers": {
            "@type": "Offer",
            "price": item["price"],
            "priceCurrency": "THB",
            "availability": "https://schema.org/SoldOut" if sold else "https://schema.org/InStock",
            "seller": {"@type": "RealEstateAgent", "name": "SmartView Hua Hin", "url": SITE,
                       "telephone": "+66812984688"},
        },
        "about": {
            "@type": "Accommodation",
            "numberOfBedrooms": item["bedrooms"] or None,
            "numberOfBathroomsTotal": item["bathrooms"] or None,
            "floorSize": {"@type": "QuantitativeValue", "value": item["area"], "unitCode": "MTK"} if item["area"] else None,
            "address": {"@type": "PostalAddress", "addressLocality": item["city"], "addressCountry": "TH"},
        },
    }
    jsonld["about"] = {k: v for k, v in jsonld["about"].items() if v is not None}

    head_extra = f"""
  <base href="/{lang}/" />
  <link rel="canonical" href="{esc(url)}" />
  <link rel="alternate" hreflang="{lang}" href="{esc(url)}" />
  <link rel="alternate" hreflang="{other}" href="{esc(url_other)}" />
  <link rel="alternate" hreflang="x-default" href="{esc(url_fr)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="SmartView Hua Hin" />
  <meta property="og:locale" content="{'fr_FR' if lang == 'fr' else 'en_GB'}" />
  <meta property="og:title" content="{esc(title)}" />
  <meta property="og:description" content="{esc(meta_desc)}" />
  <meta property="og:url" content="{esc(url)}" />
  <meta property="og:image" content="{esc(og_image)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <script type="application/ld+json">{json.dumps(jsonld, ensure_ascii=False).replace("</", "<\\/")}</script>"""

    out = template

    def sub(pattern, repl, count=1, flags=0):
        nonlocal out
        new, n = re.subn(pattern, lambda m: repl, out, count=count, flags=flags)
        if n == 0:
            raise RuntimeError(f"[{lang}] template pattern not found: {pattern}")
        out = new

    # <head>
    sub(r'<meta charset="utf-8" />', '<meta charset="utf-8" />' + head_extra)
    sub(r"window\.__lang='(fr|en)';", f"window.__lang='{lang}'; window.__propertyId={item['id']};")
    sub(r'<title data-i18n="detail\.metaTitle">.*?</title>',
        f"<title>{esc(title)} | SmartView Hua Hin</title>")
    sub(r'<meta name="description" content="" />', f'<meta name="description" content="{esc(meta_desc)}" />')
    # language switch
    if lang == "fr":
        sub(r'<a href="\.\./en/property\.html">EN</a>', f'<a href="{page_path("en", p["slug"])}">EN</a>')
    else:
        sub(r'<a href="\.\./fr/">FR</a>', f'<a href="{page_path("fr", p["slug"])}">FR</a>')
    # pre-rendered content (the JS re-renders the same data on load)
    sub(r'id="propertyDetail" class="detail-grid hide"', 'id="propertyDetail" class="detail-grid"')
    hero_style = f' style="background:url(&quot;{esc(img(images[0]["url"]))}&quot;) center / cover no-repeat"' if images else ""
    sub(r'<div class="detail-heroimg" id="detailHeroImg">', f'<div class="detail-heroimg" id="detailHeroImg"{hero_style}>')
    sub(r'<span class="badge" id="detailTag"></span>', f'<span class="badge" id="detailTag">{esc(item["tag"])}</span>')
    sub(r'<span class="badge" id="detailDeal"></span>', f'<span class="badge" id="detailDeal">{esc(deal_label)}</span>')
    if sold:
        sub(r'<span class="badge sold hide" id="detailSold"></span>',
            f'<span class="badge sold" id="detailSold">{esc(i18n[lang]["listings"]["sold"])}</span>')
    sub(r'<h1 class="detail-title" id="detailTitle"></h1>', f'<h1 class="detail-title" id="detailTitle">{esc(title)}</h1>')
    sub(r'<div class="detail-price" id="detailPrice"></div>',
        f'<div class="detail-price{" sold" if sold else ""}" id="detailPrice">{esc(price_text(item["price"], lang, item["transaction"]))}</div>')
    chips = "".join(f'<span class="chip">{esc(c)}</span>' for c in
                    [item["city"], f'{item["area"]} {sqm}', rooms_label, type_label])
    sub(r'<div class="detail-meta" id="detailMeta"></div>', f'<div class="detail-meta" id="detailMeta">{chips}</div>')
    kv = "".join(f'<div class="kv"><span>{esc(k)}</span><strong>{esc(v)}</strong></div>' for k, v in [
        (labels["city"], item["city"]), (labels["type"], type_label), (labels["deal"], deal_label),
        (labels["area"], f'{item["area"]} {sqm}'), (labels["rooms"], rooms_label)])
    sub(r'<div class="detail-kv" id="detailKV"></div>', f'<div class="detail-kv" id="detailKV">{kv}</div>')
    # description, features, contact link (plain replacements on known snippets)
    for a, b in [
        ('id="detailDesc" style="color: #0b1220;"></p>',
         f'id="detailDesc" style="color: #0b1220;">{esc(desc_full)}</p>'),
        ('id="detailFeatures" style="color: #0b1220"></ul>',
         'id="detailFeatures" style="color: #0b1220">' + "".join(f"<li>{esc(f)}</li>" for f in item["features"]) + "</ul>"),
        ('href="contact.html?source=immobilier"', f'href="contact.html?source=immobilier&amp;id={item["id"]}"'),
    ]:
        if a not in out:
            raise RuntimeError(f"[{lang}] template snippet not found: {a}")
        out = out.replace(a, b, 1)
    return out


# --------------------------------------------------------------------------- sitemap
def sitemap_block(props):
    lines = [AUTO_START]
    for p in props:
        for lang in ("fr", "en"):
            other = "en" if lang == "fr" else "fr"
            u, uo = SITE + page_path(lang, p["slug"]), SITE + page_path(other, p["slug"])
            ufr = u if lang == "fr" else uo
            lines += [
                "  <url>",
                f"    <loc>{u}</loc>",
                f'    <xhtml:link rel="alternate" hreflang="{lang}" href="{u}"/>',
                f'    <xhtml:link rel="alternate" hreflang="{other}" href="{uo}"/>',
                f'    <xhtml:link rel="alternate" hreflang="x-default" href="{ufr}"/>',
                f"    <lastmod>{(p.get('_updatedAt') or '')[:10]}</lastmod>",
                "    <changefreq>weekly</changefreq>",
                f"    <priority>{'0.5' if p.get('status') == 'vendu' else '0.8'}</priority>",
                "  </url>",
            ]
    lines.append("  " + AUTO_END)
    return "\n".join(lines)


def update_sitemap(props):
    path = os.path.join(ROOT, "sitemap.xml")
    with open(path, encoding="utf-8") as f:
        s = f.read()
    # drop the old generic property.html entries (replaced by one URL per listing)
    s = re.sub(r"\s*<!--[^>]*Property[^>]*-->\s*<url>\s*<loc>[^<]*/property\.html</loc>.*?</url>", "", s, flags=re.S)
    s = re.sub(r"\s*<url>\s*<loc>[^<]*/property\.html</loc>.*?</url>", "", s, flags=re.S)
    block = sitemap_block(props)
    if AUTO_START in s:
        s = re.sub(re.escape(AUTO_START) + r".*?" + re.escape(AUTO_END), lambda m: block.strip(), s, flags=re.S)
    else:
        s = s.replace("</urlset>", "\n  " + block.strip() + "\n\n</urlset>")
    with open(path, "w", encoding="utf-8") as f:
        f.write(s)


# --------------------------------------------------------------------------- main
def main():
    props = fetch_properties()
    if len(props) < 1:
        sys.exit("Aucun bien renvoyé par Sanity — arrêt pour ne pas vider le site.")
    seen = set()
    for p in props:
        if p["slug"] in seen:
            sys.exit(f"Slug en double dans Sanity : {p['slug']} — corrigez-le dans le Studio.")
        seen.add(p["slug"])

    i18n = load_i18n()
    with_photos = [p for p in props if p.get("images")]

    # 1) JSON read by the existing JavaScript (all listings; the JS hides those without photos)
    for lang in LANGS:
        data = [to_site_json(p, lang) for p in props]
        with open(os.path.join(ROOT, f"data/properties_{lang}.json"), "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
            f.write("\n")

    # 2) one static page per listing with photos (full rebuild of the generated folders)
    for lang, cfg in LANGS.items():
        with open(os.path.join(ROOT, f"{lang}/property.html"), encoding="utf-8") as f:
            template = f.read()
        out_dir = os.path.join(ROOT, cfg["dir"])
        shutil.rmtree(out_dir, ignore_errors=True)
        for p in with_photos:
            page = render_page(template, p, lang, i18n)
            d = os.path.join(out_dir, p["slug"])
            os.makedirs(d, exist_ok=True)
            with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
                f.write(page)

    # 3) sitemap
    update_sitemap(with_photos)

    print(f"{len(props)} biens lus dans Sanity, {len(with_photos)} pages générées par langue "
          f"({len(props) - len(with_photos)} sans photo, non publiés).")


if __name__ == "__main__":
    main()
