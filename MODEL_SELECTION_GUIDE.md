# 🤖 Guide de Sélection de Modèle IA

> Comment choisir le bon modèle pour chaque tâche

## 📊 Modèles Disponibles

Voici les modèles et leurs points forts :

### Gemini 3 Flash ⚡
**Quand l'utiliser** :
- Questions rapides simples
- Corrections de bugs mineurs
- Modifications de style/texte
- Consultations de documentation
- Tâches répétitives

**Points forts** :
- ✅ Très rapide
- ✅ Bon pour itérations rapides
- ✅ Économique

**Éviter pour** :
- ❌ Architecture complexe
- ❌ Debugging difficile
- ❌ Réflexion profonde nécessaire

### Gemini 3 Pro (Low) 🎯
**Quand l'utiliser** :
- Développement standard
- Features classiques
- Refactoring modéré
- Documentation

**Points forts** :
- ✅ Bon équilibre coût/qualité
- ✅ Suffisant pour la plupart des tâches
- ✅ Rapide

**Éviter pour** :
- ❌ Problèmes très complexes
- ❌ Optimisations critiques

### Gemini 3 Pro (High) 🚀 **RECOMMANDÉ PAR DÉFAUT**
**Quand l'utiliser** :
- Développement général
- Nouvelles features
- Debugging standard
- Architecture de projet
- La plupart de tes tâches

**Points forts** :
- ✅ Excellent équilibre
- ✅ Peut gérer complexité élevée
- ✅ Meilleure compréhension du contexte

**C'est le choix par défaut !** 👍

### Claude Sonnet 4.5 💎
**Quand l'utiliser** :
- Refactoring complexe
- Code review détaillé
- Documentation technique
- Patterns architecturaux

**Points forts** :
- ✅ Excellent pour la qualité du code
- ✅ Très bon avec patterns
- ✅ Explications claires

**Éviter pour** :
- Questions simples (overkill)

### Claude Sonnet 4.5 (Thinking) 🧠
**Quand l'utiliser** :
- Debugging très difficile
- Problèmes qui nécessitent réflexion approfondie
- Optimisations critiques
- Décisions d'architecture importantes

**Points forts** :
- ✅ Raisonnement étape par étape
- ✅ Excellent pour problèmes complexes
- ✅ Explique son raisonnement

**Utiliser avec parcimonie** (plus lent)

### Claude Opus 4.5 (Thinking) 🏆
**Quand l'utiliser** :
- Problèmes extrêmement complexes
- Refactoring architectural majeur
- Situations où tu as tout essayé
- Code critique de production

**Points forts** :
- ✅ Le meilleur pour complexité extrême
- ✅ Raisonnement le plus approfondi

**Réserver pour cas exceptionnels** (le plus lent et coûteux)

### GPT-4o (Medium) 🔷
**Quand l'utiliser** :
- Alternative à Gemini
- Tâches diverses
- Si Gemini ne donne pas satisfaction

**Points forts** :
- ✅ Polyvalent
- ✅ Bon équilibre

---

## 🎯 Recommandations par Type de Tâche

### Initialisation de Projet
```
Modèle : Gemini 3 Pro (High)
```
Configuration initiale, architecture de base

### Nouvelle Feature Simple
```
Modèle : Gemini 3 Pro (High)
```
Ajouter un endpoint, créer une page simple

### Nouvelle Feature Complexe
```
Modèle : Claude Sonnet 4.5
```
Système d'authentification, intégration API complexe

### Bug Facile
```
Modèle : Gemini 3 Flash
```
Typo, erreur de syntaxe évidente

### Bug Difficile
```
Modèle : Claude Sonnet 4.5 (Thinking)
```
Comportement inexpliqué, race condition

### Refactoring Mineur
```
Modèle : Gemini 3 Pro (High)
```
Renommer variables, extraire fonctions

### Refactoring Majeur
```
Modèle : Claude Sonnet 4.5
```
Restructurer l'architecture, patterns

### Questions / Explications
```
Modèle : Gemini 3 Flash
```
"Comment ça marche ?", "C'est quoi X ?"

### Optimisation Performance
```
Modèle : Claude Sonnet 4.5 (Thinking)
```
Analyse approfondie nécessaire

### Code Review
```
Modèle : Claude Sonnet 4.5
```
Vérification qualité, suggestions

### Documentation
```
Modèle : Gemini 3 Pro (High)
```
README, guides, commentaires

---

## 💬 Gestion des Conversations

### Quand Démarrer une Nouvelle Conversation

**Démarre TOUJOURS une nouvelle conversation si :**

1. ✅ **Changement de feature majeur**
   - Tu passes du système de login au système de paiement
   - Nouveau module indépendant

2. ✅ **Conversation trop longue**
   - Plus de 50 messages
   - Tu scrolles beaucoup pour retrouver info
   - L'IA semble "perdre le fil"

3. ✅ **Contexte incompatible**
   - Tu travailles sur un fichier complètement différent
   - Projet différent

4. ✅ **Fresh start nécessaire**
   - L'approche actuelle ne marche pas
   - Tu veux réessayer différemment

5. ✅ **Changer de modèle pour tâche complexe**
   - Si tu passes à Claude Opus pour un gros problème

**Continue la MÊME conversation si :**

1. ✅ **Itérations sur la même feature**
   - Corrections, ajustements
   - Bug fixes sur ce que vous venez de coder

2. ✅ **Contexte important dans l'historique**
   - Les messages précédents sont utiles
   - Suite logique du travail

3. ✅ **Petites modifications**
   - Changements mineurs
   - Questions de suivi

---

## 🔄 Quand l'IA Devrait Suggérer Actions

### L'IA doit te dire :

#### "Démarrer une nouvelle conversation"
Quand :
- La conversation a >40 messages
- Changement majeur de contexte
- Tu es bloqué et on tourne en rond

**Exemple** :
> "Starfoula, on a bien avancé sur le système de login ! Pour commencer le système de paiement, je te suggère de démarrer une nouvelle conversation.
> 
> Prompt suggéré :
> ```
> Lis PROJECT_CONTEXT.md. Je veux ajouter un système de paiement avec Stripe...
> ```
> 
> Utilise **Gemini 3 Pro (High)** pour cette tâche."

#### "Utiliser un modèle plus puissant"
Quand :
- Le problème est plus complexe que prévu
- Besoin de raisonnement approfondi

**Exemple** :
> "Ce bug semble plus complexe que prévu. Je te suggère de démarrer une nouvelle conversation avec **Claude Sonnet 4.5 (Thinking)** pour analyser en profondeur.
> 
> Copie ce contexte :
> [résumé du problème]"

#### "Revenir à une conversation précédente"
Quand :
- Besoin de continuer un travail ancien
- Contexte utile dans l'ancienne conv

**Exemple** :
> "Pour cette feature, on avait déjà fait des recherches dans la conversation du 5 février (ID: abc123). Tu veux qu'on continue là-bas ou créer une nouvelle conversation ?"

#### "Terminer cette conversation"
Quand :
- La tâche est complètement terminée
- Tests passent
- Code déployé
- Documentation à jour

**Exemple** :
> "Hamdoulilah ! Le système de login est terminé, testé et déployé ! 🎉
> 
> ✅ Code fonctionnel
> ✅ Tests passent
> ✅ Déployé sur Railway
> ✅ Documentation à jour
> 
> Cette conversation peut être fermée. Pour la prochaine feature, démarre une nouvelle conversation !"

---

## 📋 Checklist de Fin de Conversation

**L'IA doit confirmer avant de suggérer de terminer :**

- [ ] La feature fonctionne en local
- [ ] Les tests passent (si applicable)
- [ ] Code déployé (si demandé)
- [ ] Documentation créée/mise à jour
- [ ] Aucun bug connu en suspens
- [ ] L'utilisateur confirme satisfaction

**Sinon, continuer la conversation !**

---

## 🎨 Format des Suggestions de l'IA

### Pour changer de conversation
```
💡 Suggestion : [Action recommandée]

Raison : [Pourquoi]

Modèle recommandé : [Nom du modèle]

Prompt de démarrage :
[Prompt complet à copier-coller]

Tu veux faire ça maintenant ou continuer ici ?
```

### Pour terminer
```
🎉 Tâche Complétée !

✅ [Liste des accomplissements]

Cette conversation peut être fermée.

Prochaine étape suggérée : [Si applicable]
```

---

## 🔍 Exemple Concret de Workflow

### Situation : Ajouter système d'authentification

**Conversation 1 - Planning**
- Modèle : Gemini 3 Pro (High)
- Tâche : Recherche et planification
- Fin : Plan validé par utilisateur

**Conversation 2 - Implémentation**
- Modèle : Gemini 3 Pro (High)
- Tâche : Coder le système
- Fin : Code fonctionnel en local

**Conversation 3 - Bug Difficile**
- Modèle : Claude Sonnet 4.5 (Thinking)
- Tâche : Résoudre problème de session
- Fin : Bug corrigé

**Retour Conversation 2**
- Continue l'implémentation
- Fin : Tests + Déploiement

---

## 💡 Astuces Pro

1. **Sauvegarde les IDs de conversations importantes**
   - Note les IDs dans un fichier
   - Facile de retrouver le contexte

2. **Utilise les tags/titres descriptifs**
   - Rename les conversations pour clarté

3. **Flash pour questions rapides**
   - Ne lance pas Pro pour "C'est quoi X ?"

4. **Thinking pour debugging persistant**
   - Si 3+ essais ont échoué → passe à Thinking

5. **Crée checkpoints**
   - Nouvelle conversation = nouveau départ propre

---

**Hamdoulilah, maintenant l'IA va te guider pour optimiser tes conversations ! 🎯**
