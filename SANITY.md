# Biens immobiliers — gestion via Sanity

Les annonces ne se modifient plus dans `data/properties_*.json` : elles sont gérées dans
**Sanity Studio** → https://smartview-huahin.sanity.studio/ (projet `dnwfnet2`, dataset `production`).

## Comment ça marche

1. Vous créez / modifiez / passez en « Vendu » un bien dans le Studio, puis **Publier**.
2. Le workflow GitHub Actions **« Biens depuis Sanity »** (`.github/workflows/build-from-sanity.yml`)
   tourne toutes les 15 minutes (ou à la demande : onglet *Actions* → *Run workflow*).
3. Il lance `scripts/build_from_sanity.py`, qui régénère :
   - `data/properties_fr.json` et `data/properties_en.json` (lus par le JavaScript des listes et de l'accueil) ;
   - une page par bien : `/fr/biens/<slug>/` et `/en/properties/<slug>/` (titre, description, prix, photos,
     balises SEO, Open Graph, données structurées `RealEstateListing`, hreflang) ;
   - les entrées des biens dans `sitemap.xml` (entre les marqueurs `AUTO-BIENS`).
4. Il commite ces fichiers sur `main` → GitHub Pages republie le site.

⚠️ Ne modifiez pas à la main les fichiers générés ci-dessus : ils sont écrasés à chaque passage.

## Règles

- **Adresse de la page** (slug) : générée depuis le titre FR. La changer change l'URL publique du bien.
- **Bien sans photo** : présent dans le Studio mais pas publié sur le site (pas de page, pas de carte).
- **Ordre d'affichage** : plus petit = en premier ; vide = en tête de liste.
- **Nouveauté** : affiché dans « Biens à la une » sur l'accueil (6 max).
- Les anciennes adresses `property.html?id=…` redirigent automatiquement vers la nouvelle page du bien
  (liens Google Ads et partages conservés). L'identifiant `property_id` envoyé à GA4 est inchangé.

## Lancer en local

```bash
python3 scripts/build_from_sanity.py   # aucune dépendance, aucun jeton (dataset public)
python3 -m http.server 8000            # puis http://localhost:8000/fr/
```

Le gabarit des pages de biens est `fr/property.html` / `en/property.html` : toute modification de ces
fichiers est reprise à la prochaine génération.
