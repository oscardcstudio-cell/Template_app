# 🚀 [Nom du Projet]

> Template de démarrage rapide avec Railway, GitHub auto-sync et persistance des données

## 📋 Description

[Décrire ici ce que fait ton application]

## 🛠️ Stack Technique

- **Runtime** : Node.js 18+
- **Framework** : Express.js
- **Déploiement** : Railway
- **Version Control** : GitHub avec auto-sync
- **Persistance** : Volume Railway

## ⚙️ Configuration Requise

### Après Création du Projet

**IMPORTANT**: Après avoir créé ton projet, lance le wizard de configuration :

```bash
# Méthode 1: Double-clic sur init-project.bat
# OU
# Méthode 2: En ligne de commande
npm run init
```

Ce wizard va te poser des questions pour configurer ton projet :
- Type de projet (bot, API, dashboard, etc.)
- Fonctionnalités nécessaires (database, API calls, etc.)
- Type de déploiement
- Stockage des données
- Description du projet

### Variables d'Environnement

Créer ces variables dans Railway :

```env
# GitHub Auto-Sync
GITHUB_TOKEN=ton_token_github
GITHUB_REPO=ton-username/ton-repo

# Paths
DATA_PATH=/app/data

# Application
NODE_ENV=production
PORT=3000

# [Ajouter tes variables spécifiques ici]
```

### Volume Railway

**IMPORTANT** : Créer un volume Railway :
- **Mount Path** : `/app/data`
- **Nom** : `data-volume` (ou autre)

## 📁 Structure du Projet

```
├── data/                  # Données persistantes (Volume Railway)
│   ├── backlog.md        # Notes et TODO (synced avec GitHub)
│   ├── state.json        # État de l'application
│   └── history.json      # Historique
├── src/
│   ├── index.js          # Point d'entrée principal
│   ├── config.js         # Configuration
│   └── utils/
│       ├── github-sync.js    # Auto-sync GitHub
│       └── storage.js        # Gestion du stockage
├── .gitignore
├── package.json
├── Procfile              # Configuration Railway
└── README.md
```

## 🚀 Démarrage

### Test Local (Recommandé)

**Double-cliquer sur `test-local.bat`**

Le script va automatiquement :
- ✅ Vérifier l'environnement
- ✅ Installer les dépendances si nécessaire
- ✅ Vérifier le fichier `.env`
- ✅ Lancer l'application
- ✅ Afficher les logs en temps réel

### Installation Manuelle

```bash
# Cloner le repo
git clone https://github.com/ton-username/ton-repo.git
cd ton-repo

# Installer les dépendances
npm install

# Créer le fichier .env
copy .env.example .env
# Puis éditer .env avec tes secrets

# Lancer en mode développement
npm run dev
```

### Déploiement Railway

Suivre le guide complet dans `ROADMAP.md`

## 🔧 Fonctionnalités

- ✅ Auto-sync GitHub (commit automatique des données)
- ✅ Persistance via Volume Railway
- ✅ Health check endpoint (`/health`)
- ✅ Logs structurés et clairs
- ✅ Gestion d'erreurs robuste

## 📊 Endpoints

- `GET /` - Page d'accueil
- `GET /health` - Health check
- [Ajouter tes endpoints ici]

## 🐛 Debugging

### Logs Railway
```bash
# Voir les logs en temps réel
railway logs
```

### Problèmes Courants

**L'app crash au démarrage** :
- Vérifier que toutes les variables d'environnement sont présentes
- Vérifier les logs Railway pour l'erreur exacte

**Les données ne persistent pas** :
- Vérifier que le volume Railway est créé et monté sur `/app/data`
- Vérifier que `DATA_PATH` est configuré

**L'auto-sync GitHub ne fonctionne pas** :
- Vérifier que `GITHUB_TOKEN` a les permissions `repo`
- Vérifier que `GITHUB_REPO` est au format `username/repo-name`

## 📝 TODO

- [ ] [Ajouter tes TODOs ici]

---

**Hamdoulilah, tout est prêt ! 🎉**
