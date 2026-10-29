# Franck David — Élagage · Puy-de-Dôme

Site vitrine statique (HTML, CSS, JavaScript natif) pour Franck David, élagueur dans le Puy-de-Dôme.
Aucun serveur ni base de données : il est conçu pour GitHub Pages.

## Structure

```
franck-david-elagage/
├── index.html               Page d'accueil (toutes les sections)
├── mentions-legales.html    Mentions légales + crédits photos (à compléter)
├── confidentialite.html     Politique de confidentialité (à compléter)
├── assets/
│   ├── css/style.css
│   ├── js/config.js         ← informations à personnaliser
│   ├── js/main.js
│   └── images/
├── ASSETS.md                Sources et licences des images
├── robots.txt
└── .nojekyll
```

Site en ligne : https://hervelombardo693-creator.github.io/franck-david-elagage/

## Personnaliser le site

Tout se règle dans `assets/js/config.js` :

| Clé | Effet |
|---|---|
| `email` | Affiche le lien e-mail et active la préparation du message par le formulaire |
| `phone` | Affiche le lien d'appel |
| `commune` | Ajoute « depuis [commune] » dans la section zone d'intervention |
| `hours` | Affiche les horaires dans la section contact |
| `services.xxx: false` | Retire une prestation de la page et du formulaire |

Une valeur vide reste masquée : aucune information n'est inventée.

Pour le référencement local, la commune principale peut aussi être ajoutée à la main dans la balise `<title>` et la `meta description` de `index.html`.

## Formulaire de devis

GitHub Pages ne peut pas envoyer d'e-mails. Le formulaire :

1. vérifie les champs dans le navigateur ;
2. ouvre le logiciel de messagerie du visiteur avec un e-mail pré-rempli (`mailto:`) ;
3. le visiteur vérifie puis envoie lui-même le message.

Tant que `email` est vide dans `config.js`, le formulaire affiche un message expliquant que l'adresse n'est pas encore configurée.
Pour un envoi direct, il faudra brancher un service tiers (Formspree, Web3Forms…) et mettre à jour la politique de confidentialité.

## Tester en local

Ouvrir `index.html` dans un navigateur suffit. Pour un test plus proche de la mise en ligne :

```bash
python -m http.server 8000
```

puis ouvrir http://localhost:8000.

## Mise en ligne sur GitHub Pages

1. Créer un dépôt sur GitHub (par exemple `franck-david-elagage`).
2. Ajouter les fichiers du dossier et les envoyer sur la branche `main` :
   ```bash
   git init -b main
   git add .
   git commit -m "Site Franck David élagage"
   git remote add origin https://github.com/UTILISATEUR/franck-david-elagage.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages**.
4. Dans **Build and deployment → Source**, choisir **Deploy from a branch**, puis la branche `main` et le dossier `/ (root)`.
5. Ouvrir l'onglet **Actions** et vérifier que le déploiement « pages build and deployment » se termine en vert.
6. Ouvrir l'adresse publiée : `https://UTILISATEUR.github.io/franck-david-elagage/`.
7. Vérifier que les images, les liens internes et les pages légales fonctionnent sous cette adresse (tous les chemins sont relatifs).

## Après la mise en ligne

- Remplacer `og:image` dans `index.html` par l'URL absolue de l'image (ex. `https://UTILISATEUR.github.io/franck-david-elagage/assets/images/hero-elagage.webp`).
- Ajouter une balise `<link rel="canonical">` et un `sitemap.xml` une fois l'adresse définitive connue (nom de domaine personnalisé éventuel), puis décommenter la ligne `Sitemap` de `robots.txt`.

## Informations à obtenir de Franck

- E-mail et téléphone professionnels
- Commune principale et zone d'intervention réelle
- Prestations réellement proposées (élagage, taille, abattage, évacuation des branches, dessouchage ?)
- Horaires
- Statut juridique, SIRET, adresse, assurance (pour les mentions légales)
- Ses propres photos de chantiers
