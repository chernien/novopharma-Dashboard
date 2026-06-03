<div align="center">

# 💊 Novopharma Dashboard

### Plateforme d'administration back-office pour la force de vente dermo-cosmétique

[![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Présentation

**Novopharma Dashboard** est une application web d'**administration interne** (back-office) destinée à piloter l'activité commerciale terrain d'un laboratoire **dermo-cosmétique / pharmaceutique**.

Elle centralise dans une seule interface le suivi des **dermo-conseiller(e)s**, des **ventes**, des **factures**, du **catalogue produits** et de la **gestion des cadeaux/échantillons (gifts)**, le tout enrichi d'un tableau de bord analytique **Power BI** embarqué.

| | |
| --- | --- |
| **Type de projet** | Dashboard d'administration (SPA) |
| **Domaine métier** | Dermo-cosmétique / industrie pharmaceutique |
| **Rôle** | Outil de pilotage de la force de vente (MSL — *Medical Sales*) |
| **Public cible** | Administrateurs, responsables commerciaux, équipe back-office Novopharma |

---

## 🎯 Aperçu — Que permet de faire le dashboard ?

L'administrateur se connecte via une page d'authentification sécurisée, puis accède à un espace protégé lui permettant de :

- 📊 **Suivre les indicateurs clés** (KPIs) en temps réel : nombre total de commandes, commandes du mois, nombre de conseillers actifs.
- 📈 **Visualiser des analyses avancées** grâce à un rapport **Power BI** intégré.
- 👥 **Gérer les comptes** des dermo-conseiller(e)s (activation / désactivation, ajout).
- 📍 **Suivre l'activité terrain** des conseiller(e)s via les check-ins géolocalisés.
- 🛒 **Consulter et gérer les ventes** (commandes), avec upload d'un justificatif image.
- 🧾 **Consulter les factures** clients.
- 🎁 **Attribuer et suivre les gifts** (cadeaux / échantillons) par dermo et par pharmacie.
- 📦 **Administrer le catalogue articles** (détails, familles, produits recommandés).
- 📤 **Exporter les données** au format **PDF** et **Excel**.

---

## ✨ Fonctionnalités

### 🔐 Authentification & sécurité
- Page de connexion avec **formulaires réactifs** (`ReactiveFormsModule`) et validation.
- **Garde de route** (`AuthGuard` / `CanActivate`) protégeant l'espace d'administration.
- Pages dédiées **non autorisé** (`/unauth`) et **404** personnalisée.
- Page **politique de confidentialité** (`/confidentialite`).

### 📊 Tableau de bord
- Cartes de **KPIs dynamiques** calculées côté client.
- Rapport **Power BI** embarqué (analyse des ventes dermo).

### 👥 Dermo-Conseiller(e)s
- Liste filtrable des conseiller(e)s.
- Activation / désactivation des comptes.
- Ajout de nouveaux conseiller(e)s.

### 📍 Suivi terrain (« Suivi Dermo »)
- Affichage des check-ins terrain triés du plus récent au plus ancien.
- Recherche / filtre par nom et intitulé.

### 🛒 Ventes & commandes
- Liste des commandes avec filtre par date et par conseiller.
- Création de commande, mise à jour des quantités.
- **Upload d'image** justificative de commande.
- **Export PDF (jsPDF)** et **Excel (SheetJS)**.

### 🧾 Factures
- Consultation de l'ensemble des factures et de leur détail.

### 🎁 Gestion des Gifts
- Attribution de gifts par dermo / pharmacie.
- Suivi des commandes de gifts.
- Suppression d'attributions.

### 📦 Articles
- Catalogue produits, détails, familles, gestion des produits recommandés.

### 🎨 Expérience utilisateur
- **Sidebar rétractable**, navbar, notifications élégantes via **SweetAlert2**.
- Interface responsive basée sur Bootstrap.

---

## 🛠️ Technologies utilisées

| Technologie | Usage |
| ----------- | ----- |
| **Angular 17** | Framework frontend (architecture modulaire NgModule) |
| **TypeScript 5.2** | Langage de développement typé |
| **RxJS 7.8** | Programmation réactive & gestion des flux HTTP |
| **Angular Router** | Navigation, guards, routes enfants |
| **Reactive Forms** | Gestion et validation des formulaires |
| **Bootstrap 5 (template Sneat)** | Système de design & composants UI |
| **Boxicons** | Bibliothèque d'icônes |
| **ApexCharts** | Graphiques & visualisations |
| **Power BI Embedded** | Rapports analytiques intégrés (iframe) |
| **SweetAlert2** | Modales & notifications |
| **jsPDF + jspdf-autotable** | Génération / export de documents PDF |
| **xlsx (SheetJS)** | Export de données au format Excel |
| **Karma + Jasmine** | Tests unitaires |
| **Angular CLI 17** | Tooling, build & scaffolding |

---

## 🖼️ Captures d'écran

> _Les captures seront ajoutées ultérieurement. Écrans recommandés à présenter :_
>
> - 🔐 **Authentification** — page de connexion
> - 📊 **Tableau de bord principal** — KPIs + rapport Power BI
> - 👥 **Dermo-Conseiller(e)s** — gestion des comptes
> - 📍 **Suivi Dermo** — check-ins terrain
> - 🛒 **Les Ventes** — liste des commandes + export
> - 🎁 **Gestion des Gifts** — attribution & commandes

---

## 📂 Structure du projet

```
Novopharma-dash/
├── src/
│   ├── app/
│   │   ├── components/          # Composants UI organisés par domaine métier
│   │   │   ├── login/           # Authentification
│   │   │   ├── home/            # Conteneur de l'espace admin
│   │   │   ├── layout/          # Dashboard (KPIs + Power BI)
│   │   │   ├── nav-bar/         # Barre de navigation
│   │   │   ├── side-bar/        # Menu latéral rétractable
│   │   │   ├── footer/          # Pied de page
│   │   │   ├── conseiller/      # Gestion des dermo-conseiller(e)s
│   │   │   ├── suivi/           # Suivi terrain (check-ins)
│   │   │   ├── commandes/       # Ventes & commandes (+ export PDF/Excel)
│   │   │   ├── facture/         # Factures
│   │   │   ├── gift/            # Attribution des gifts
│   │   │   ├── gift-list/       # Commandes de gifts
│   │   │   ├── articles/        # Catalogue produits
│   │   │   ├── regle/           # Politique de confidentialité
│   │   │   ├── unauth/          # Accès non autorisé
│   │   │   └── not-found/       # Page 404
│   │   ├── services/            # Couche d'accès aux API REST
│   │   │   ├── auth.service.ts
│   │   │   ├── article.service.ts
│   │   │   ├── commandes.service.ts
│   │   │   └── facture.service.ts
│   │   ├── guards/              # AuthGuard (protection des routes)
│   │   ├── pipes/               # Pipes de filtrage personnalisés
│   │   ├── app.module.ts        # Module racine
│   │   └── app-routing.module.ts# Configuration du routing
│   ├── environments/            # Configuration par environnement (URL API)
│   ├── assets/                  # Images, polices, vendor (template Sneat)
│   ├── index.html
│   └── main.ts
├── angular.json                 # Configuration Angular CLI
├── package.json
└── tsconfig*.json
```

---

## 🚀 Installation

### Prérequis

- [Node.js](https://nodejs.org/) **≥ 18.13**
- **npm ≥ 9**
- [Angular CLI 17](https://angular.io/cli) : `npm install -g @angular/cli`

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/chernien/novopharma-Dashboard.git
cd novopharma-Dashboard

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm start
```

L'application est accessible sur **`http://localhost:4200/`** et se recharge automatiquement à chaque modification.

### Build de production

```bash
npm run build
```

Les fichiers optimisés sont générés dans `dist/novopharma-dash/`.

### Tests unitaires

```bash
npm test
```

### ⚙️ Configuration de l'API

L'URL du back-end est centralisée dans `src/environments/` :

| Fichier | Utilisé pour | Valeur |
| ------- | ------------ | ------ |
| `environment.ts` | Production (`ng build`) | `https://novopharma.tn` |
| `environment.development.ts` | Développement (`ng serve`) | `https://novopharma.tn` *(ou `https://localhost:7156` en local)* |

Modifiez simplement `apiUrl` — aucune URL n'est codée en dur dans les services.

---

## 📱 Responsive Design

- **Mise en page fluide** basée sur la grille Bootstrap (`container-xxl`, classes `col-*`, `order-*`).
- **Sidebar rétractable** pour optimiser l'espace sur petits écrans.
- **Meta viewport** configuré pour le rendu mobile.
- Composants (cartes, tableaux, formulaires) qui s'adaptent aux différentes tailles d'écran.

---

## 🧠 Points techniques intéressants

- **🏗️ Architecture modulaire par domaine** — composants regroupés par fonctionnalité métier (conseiller, commandes, gift…), facilitant la maintenance et l'évolutivité.
- **🧩 Séparation des responsabilités** — couche **services** dédiée à la communication HTTP, clairement isolée des composants de présentation.
- **♻️ Réutilisation** — **pipes personnalisés** (`conseiller`, `commande`, `article`, `filter-date`) pour un filtrage déclaratif et réutilisable côté template.
- **🔐 Sécurisation du routing** — `AuthGuard` (`CanActivate`) + routes enfants imbriquées sous un layout protégé, avec pages d'erreur dédiées.
- **🌐 Configuration par environnement** — URL d'API externalisée dans `src/environments/`, substituée automatiquement au build via `fileReplacements`.
- **📊 Intégration BI** — embarquement d'un rapport **Power BI** au sein de l'interface Angular.
- **📤 Génération de documents** — export **PDF** (jsPDF + autoTable) et **Excel** (SheetJS) directement côté client.
- **⚡ Programmation réactive** — utilisation de **RxJS / Observables** pour les appels asynchrones.
- **🎨 UX soignée** — feedback utilisateur cohérent via SweetAlert2, navigation claire, design Sneat professionnel.



---

## 👤 Auteur

**Amine Cherni**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Amine_Cherni-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/amine-cherni/)

---

## 📄 Licence

Ce projet est distribué sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

⭐ Si ce projet vous a plu, n'hésitez pas à laisser une étoile !

</div>
