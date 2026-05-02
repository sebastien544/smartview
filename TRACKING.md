# Tracking & Analytics — SmartView

**GTM Container:** `GTM-KRBH34LP`  
**GA4 Property:** configuré dans GTM (connecter via Data Stream)

---

## Événements implémentés

### 1. `generate_lead` — Soumission du formulaire de contact

| Champ | Valeur |
|-------|--------|
| Nom GTM / GA4 | `generate_lead` |
| Déclenché sur | `en/merci.html` et `fr/merci.html` (au chargement) |
| Méthode | `dataLayer.push` dans le `<head>` avant GTM |
| Paramètres | `form_name: "contact"`, `page_type: "thank_you"`, `lead_source: <valeur>` |
| Fichier source | [en/merci.html](en/merci.html), [fr/merci.html](fr/merci.html) |

**Valeurs possibles de `lead_source` :**

| Valeur | Origine |
|--------|---------|
| `direct` | Accès direct à la page contact (défaut) |
| `visa` | Formulaire sur `en/visa.html` ou `fr/visa.html` |
| `immobilier` | Bouton "Demander une visite" sur `property.html` |
| `<custom>` | Tout paramètre `?source=` passé dans l'URL |

**Flux complet :**  
`contact.html?source=<X>` → formulaire soumis → fetch Make.com + `lead_source` → `finally` → redirect vers `merci.html?source=<X>` → dataLayer push `generate_lead` avec `lead_source` → GTM capture → GA4 / Google Ads

---

### 2. `whatsapp_click` — Clic sur le bouton WhatsApp flottant

| Champ | Valeur |
|-------|--------|
| Nom | `whatsapp_click` |
| Déclenché sur | Toutes les pages (bouton flottant bas-droite) |
| Méthode | `window.dataLayer.push` dans le handler click |
| Paramètres | `page_source: window.location.pathname` |
| Fichier source | [JS/whatsapp-button.js](JS/whatsapp-button.js) |

---

### 3. `phone_click` — Clic sur un lien téléphone

| Champ | Valeur |
|-------|--------|
| Nom | `phone_click` |
| Déclenché sur | Toutes les pages — tout lien `href^="tel:"` |
| Méthode | `window.dataLayer.push` via délégation d'événement sur `document` |
| Paramètres | `page_source: window.location.pathname` |
| Fichier source | [JS/phone-tracking.js](JS/phone-tracking.js) |

---

### 4. `property_view` — Consultation d'une fiche bien

| Champ | Valeur |
|-------|--------|
| Nom | `property_view` |
| Déclenché sur | `property.html` — après résolution de la fiche |
| Méthode | `window.dataLayer.push` dans `renderDetailPage()` |
| Paramètres | `property_id`, `property_type`, `property_price`, `property_neighborhood` |
| Fichier source | [JS/properties.js](JS/properties.js) — fonction `renderDetailPage()` |

---

### 5. `page_view` automatique — Toutes les pages

Chaque page déclenche un `page_view` automatique via GTM dès le chargement. Pages instrumentées :

| Page | Fichier |
|------|---------|
| Accueil | `index.html` |
| Annonces | `listings.html` |
| Fiche bien | `property.html` |
| Contact (EN) | `en/contact.html` |
| Contact (FR) | `fr/contact.html` |
| Remerciement (EN) | `en/merci.html` |
| Remerciement (FR) | `fr/merci.html` |
| Visa (EN) | `en/visa.html` |
| Visa (FR) | `fr/visa.html` |

---

## Paramètres personnalisés à créer dans GA4

Dans **GA4 → Admin → Définitions personnalisées → Dimensions personnalisées** :

| Nom de la dimension | Paramètre de l'événement | Portée | Utilisé par |
|---------------------|--------------------------|--------|-------------|
| Lead Source | `lead_source` | Événement | `generate_lead` |
| Page Source | `page_source` | Événement | `whatsapp_click`, `phone_click` |
| Property ID | `property_id` | Événement | `property_view` |
| Property Type | `property_type` | Événement | `property_view` |
| Property Price | `property_price` | Événement | `property_view` |
| Property Neighborhood | `property_neighborhood` | Événement | `property_view` |

---

## Configuration Google Ads — Conversion sur `generate_lead`

Pour relier `generate_lead` à une conversion Google Ads :

1. Dans **GTM** → Tags → Nouveau tag de type **Google Ads Conversion Tracking** (ou utiliser GA4 + import des conversions depuis GA4)
2. Déclencheur : **Custom Event** → nom de l'événement = `generate_lead`
3. Renseigner le Conversion ID et Conversion Label fournis par Google Ads
4. Publier le conteneur GTM

Alternativement, dans **GA4** :
1. Aller dans Admin → Événements → marquer `generate_lead` comme **Événement de conversion**
2. Dans Google Ads → Outils → Conversions → Importer depuis GA4

---

## Vérification dans GA4 DebugView

### Activer le mode debug

**Option A — Chrome Extension** (recommandé)  
Installer [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) → activer l'extension → recharger la page.

**Option B — Paramètre URL**  
Ajouter `?debug_mode=1` à l'URL, ex :  
`https://smartview-huahin.com/en/merci.html?source=visa&debug_mode=1`

### Checklist de validation

- [ ] `page_view` visible sur `merci.html` dans DebugView
- [ ] `generate_lead` visible avec `form_name`, `page_type`, et `lead_source` dans DebugView
- [ ] `whatsapp_click` visible avec `page_source` au clic sur le bouton flottant
- [ ] `phone_click` visible avec `page_source` au clic sur un numéro de téléphone
- [ ] `property_view` visible avec `property_id`, `property_type`, `property_price`, `property_neighborhood` sur une fiche bien
- [ ] `generate_lead` apparaît dans **Rapports → Événements** après 24–48h
- [ ] Conversion `generate_lead` marquée comme telle dans GA4 Admin → Événements

---

## Fichiers clés

| Fichier | Rôle |
|---------|------|
| [en/contact.html](en/contact.html) | Formulaire de contact EN → lit `?source=`, redirige vers `en/merci.html?source=<X>` |
| [fr/contact.html](fr/contact.html) | Formulaire de contact FR → lit `?source=`, redirige vers `fr/merci.html?source=<X>` |
| [en/merci.html](en/merci.html) | Page de remerciement EN — point de conversion GA4 / Google Ads |
| [fr/merci.html](fr/merci.html) | Page de remerciement FR — point de conversion GA4 / Google Ads |
| [JS/whatsapp-button.js](JS/whatsapp-button.js) | Bouton WhatsApp flottant + tracking clic via dataLayer |
| [JS/phone-tracking.js](JS/phone-tracking.js) | Tracking clics sur liens téléphone |
| [JS/properties.js](JS/properties.js) | Rendu fiche bien + événement `property_view` |
