# 🚀 Feuille de Route - Nouveau Projet

## 🎯 Méthode Recommandée : Setup Wizard Automatique

**Double-cliquer sur `setup-new-project.bat` et laisser le wizard faire tout le travail !**

Le wizard va :
- ✅ Créer le projet dans le bon dossier
- ✅ Configurer Git et GitHub
- ✅ Créer le fichier `.env` avec tes secrets
- ✅ Installer les dépendances
- ✅ Tout préparer pour le déploiement

**Si tu préfères la méthode manuelle, continue ci-dessous.**

---

## Checklist Pour Chaque Nouveau Projet (Méthode Manuelle)

### 1️⃣ Préparation Locale (5 min)
- [ ] Copier le contenu de `project-starter-template` dans un nouveau dossier
- [ ] Renommer le dossier avec le nom de ton projet (ex: `mon-super-bot`)
- [ ] Ouvrir le dossier dans Antigravity

### 2️⃣ Configuration GitHub (10 min)
- [ ] Aller sur [github.com/new](https://github.com/new)
- [ ] Créer un nouveau repository (public ou privé)
- [ ] **NE PAS** initialiser avec README (on a déjà nos fichiers)
- [ ] Copier l'URL du repo (ex: `https://github.com/ton-username/ton-repo.git`)
- [ ] Créer un **Personal Access Token** :
  - Aller sur [github.com/settings/tokens](https://github.com/settings/tokens)
  - Cliquer "Generate new token" → "Generate new token (classic)"
  - Nom : `Railway Deploy Token` (ou le nom de ton projet)
  - Expiration : `No expiration` (ou selon ta préférence)
  - Cocher les permissions : `repo` (toutes les cases sous repo)
  - Générer et **COPIER LE TOKEN** (tu ne pourras plus le revoir !)

### 3️⃣ Premier Push vers GitHub (5 min)
Dans le terminal Antigravity, exécuter ces commandes :
```bash
git init
git add .
git commit -m "🎉 Initial commit - starfoula"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/TON-REPO.git
git push -u origin main
```

### 4️⃣ Configuration Railway (15 min)

#### A. Créer le Projet Railway
- [ ] Aller sur [railway.app](https://railway.app/new)
- [ ] Cliquer "Deploy from GitHub repo"
- [ ] Sélectionner ton repository
- [ ] Attendre le premier déploiement

#### B. Créer un Volume (IMPORTANT !)
- [ ] Dans ton projet Railway, cliquer sur ton service
- [ ] Aller dans l'onglet "**Variables**"
- [ ] Ajouter les variables d'environnement nécessaires (voir ci-dessous)
- [ ] Aller dans l'onglet "**Volumes**"
- [ ] Cliquer "**+ New Volume**"
- [ ] Mount Path : `/app/data` (ou selon ton projet)
- [ ] Sauvegarder

#### C. Variables d'Environnement Railway
Variables minimales à ajouter :
```
NODE_ENV=production
PORT=3000
GITHUB_TOKEN=ton_token_github_ici
GITHUB_REPO=ton-username/ton-repo
DATA_PATH=/app/data
```

Variables spécifiques selon ton projet (exemples) :
```
# Pour un bot Discord
DISCORD_TOKEN=ton_token_discord

# Pour un bot Polymarket
POLYMARKET_API_KEY=ta_clé_api

# Pour une base de données
DATABASE_URL=ton_url_database
```

### 5️⃣ Configuration Auto-Sync GitHub (10 min)
- [ ] Vérifier que `GITHUB_TOKEN` est dans les variables Railway
- [ ] Vérifier que `GITHUB_REPO` est au format `username/repo-name`
- [ ] Le code de base inclut déjà l'auto-sync
- [ ] Redémarrer le service Railway après ajout des variables

### 6️⃣ Vérification (5 min)
- [ ] Vérifier les logs Railway (pas d'erreurs ?)
- [ ] Vérifier que le service est "Active"
- [ ] Tester une fonctionnalité de base
- [ ] Vérifier qu'un commit auto se fait (si auto-sync activé)

---

## 🎯 Résumé Rapide

**Ordre des opérations :**
1. Copier le template
2. Créer repo GitHub + Token
3. Push initial
4. Créer projet Railway
5. Ajouter Volume + Variables
6. Déployer et tester

**Temps total estimé : ~45 minutes**

---

## 📝 Informations à Garder

Pour chaque projet, note quelque part :
- **Nom du projet** : ________________
- **URL GitHub** : ________________
- **Token GitHub** : ________________ (garde-le précieusement !)
- **URL Railway** : ________________
- **Volume Mount Path** : ________________
- **Variables d'environnement importantes** : ________________

---

## 💡 Conseils
- Hamdoulilah, tout est automatisé une fois configuré !
- Si tu vois une erreur Railway, c'est souvent les variables d'environnement
- Le volume Railway = tes données persistent même après redémarrage
- L'auto-sync GitHub = ton bot sauvegarde automatiquement ses données

**Starfoula, t'es prêt à créer des projets comme un chef ! 🔥**
