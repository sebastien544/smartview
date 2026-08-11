# KeyCare — en pause

Projet mis en pause le 11 août 2026. Rien n'est supprimé : les fichiers sont
simplement sortis du site publié.

GitHub Pages construit ce dépôt avec Jekyll (pas de `.nojekyll`, pas de workflow
Actions), et Jekyll **exclut du build tout dossier commençant par `_`**. Le
contenu de `_paused/` n'est donc pas servi : `/en/keycare/` et `/fr/keycare/`
renvoient 404.

## Ce qui a été fait

- `en/keycare/` → `_paused/en/keycare/`
- `fr/keycare/` → `_paused/fr/keycare/`
- `keycare/` → `_paused/keycare/` (assets)
- `robots.txt` : `Disallow` sur les trois chemins, pour que les URLs déjà
  crawlées cessent d'être proposées pendant la pause

L'arborescence est conservée telle quelle : les pages référencent leurs assets
en `../../keycare/assets/…`, ce qui reste correct à l'intérieur de `_paused/`.

Les CTA de navigation étaient déjà commentés dans `partials/header-en.html` et
`partials/header-fr.html` — ils le restent.

## Pour reprendre

```bash
git mv _paused/en/keycare en/keycare
git mv _paused/fr/keycare fr/keycare
git mv _paused/keycare    keycare
rmdir _paused/en _paused/fr
```

Puis retirer les trois lignes `Disallow` de `robots.txt`, décommenter les blocs
KeyCare des deux partials de header, et ajouter les pages au `sitemap.xml`
(elles n'y ont jamais figuré).

## À savoir

Le formulaire de ces pages poste sur le webhook Make
`hook.eu1.make.com/9djg…96w8`, **partagé avec `contact.html` et le site Sparkle
Hua Hin**. Le scénario n'a pas été touché : ne pas l'archiver, ça couperait
aussi les demandes Sparkle. Les leads KeyCare sont identifiables par
`brand: "KeyCare"` dans le payload.
