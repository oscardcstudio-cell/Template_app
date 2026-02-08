# 💬 Guide de Communication avec l'IA

> Comment bien communiquer avec l'IA pour obtenir les meilleurs résultats

## 🎯 Bonnes Pratiques Générales

### ✅ Fais :

1. **Sois spécifique**
   - ❌ "Change le design"
   - ✅ "Change le bouton de login en bleu et ajoute une ombre"

2. **Donne du contexte**
   - ❌ "Ajoute une fonction"
   - ✅ "Ajoute une fonction qui envoie un email quand un utilisateur s'inscrit"

3. **Demande des clarifications**
   - Si l'IA propose quelque chose que tu ne comprends pas, dis-le !
   - "Peux-tu expliquer en termes plus simples ?"

4. **Mentionne les erreurs complètes**
   - Copie-colle le message d'erreur complet
   - Dis où ça se produit (page, action, etc.)

### ❌ Évite :

1. **Questions trop vagues**
   - "Fais quelque chose de mieux"
   - "Optimise l'app"
   
2. **Demandes multiples en une phrase**
   - Mieux vaut faire une demande à la fois
   - OU numéroter clairement : "1. Fais X, 2. Fais Y, 3. Fais Z"

3. **Assumer que l'IA sait tout**
   - L'IA n'a pas accès à Railway/GitHub sans que tu lui donnes les infos
   - Partage les logs d'erreur Railway si nécessaire

## 🔄 Quand Démarrer une Nouvelle Conversation

### Démarre une nouvelle conversation quand :

✅ **Tu changes de contexte majeur**
   - Tu passes d'une feature à une autre complètement différente
   - Exemple : Finir le système de login → Commencer un système de paiement

✅ **La conversation devient trop longue/confuse**
   - Si tu dois scroller beaucoup pour retrouver le contexte
   - Si l'IA semble "perdre le fil"

✅ **Tu veux un "fresh start"**
   - Pour reprendre quelque chose avec un angle différent
   - Pour mieux organiser les changements

### Continue dans la même conversation quand :

✅ **Tu itères sur la même feature**
   - Corrections de bugs sur ce que l'IA vient de créer
   - Ajustements de style/comportement

✅ **Contexte important dans la conversation**
   - Les messages précédents sont utiles
   - L'historique aide à comprendre

✅ **Petites modifications**
   - Changements mineurs qui ne nécessitent pas de grands contextes

## 📋 Au Début de Chaque Conversation : Checklist

Quand tu démarres une nouvelle conversation sur un projet existant, commence par :

```
Lis PROJECT_CONTEXT.md pour comprendre le projet. Ensuite [ta demande].
```

L'IA va automatiquement :
1. ✅ Lire le contexte du projet
2. ✅ Comprendre l'architecture
3. ✅ Voir les bonnes pratiques spécifiques
4. ✅ Être à jour sur l'état actuel

## 💡 Templates de Prompts Efficaces

### Pour une nouvelle feature
```
Lis PROJECT_CONTEXT.md. 

Je veux ajouter [feature], qui permettra de [objectif].

Fonctionnalités attendues :
1. [Fonctionnalité 1]
2. [Fonctionnalité 2]
3. [Fonctionnalité 3]

Questions si tu en as, sinon commence !
```

### Pour corriger un bug
```
Lis PROJECT_CONTEXT.md.

Bug : [description du problème]
Où : [page/action où ça se produit]
Erreur (si applicable) : [message d'erreur complet]

Peux-tu investiguer et corriger ?
```

### Pour améliorer quelque chose
```
Lis PROJECT_CONTEXT.md.

Je veux améliorer [aspect] parce que [raison].

Ce que je veux :
- [Amélioration 1]
- [Amélioration 2]

Propose-moi des solutions.
```

### Pour demander conseil
```
Lis PROJECT_CONTEXT.md.

Je me demande comment [situation/problème].

Options que je vois :
1. [Option A]
2. [Option B]

Qu'est-ce que tu recommandes et pourquoi ?
```

## 🤝 Collaboration Efficace

### L'IA va te demander des clarifications si :

- ❓ Ta demande est ambiguë
- ❓ Plusieurs approches sont possibles
- ❓ Elle a besoin d'infos que tu peux mieux fournir

**C'est bon signe !** Ça signifie qu'elle veut faire exactement ce dont tu as besoin.

### Si l'IA propose quelque chose qui ne te convient pas :

✅ **Dis-le clairement**
   - "Non, je veux plutôt [alternative]"
   - "Ce n'est pas exactement ça, plutôt [précision]"

❌ **Ne dis pas juste "Non" sans explications**
   - L'IA ne saura pas comment améliorer

### Si tu n'es pas sûr de ce que l'IA a fait :

✅ **Demande des explications**
   - "Peux-tu expliquer ce que fait ce nouveau code ?"
   - "Pourquoi as-tu choisi cette approche ?"

## 🚨 Quand Demander à l'IA de Vérifier Avant d'Agir

Pour les changements importants, tu peux demander :

```
Lis PROJECT_CONTEXT.md.

[Ta demande]

Mais avant de coder, explique-moi ton plan d'implémentation.
```

L'IA va :
1. Expliquer ce qu'elle compte faire
2. Te laisser valider ou ajuster
3. Ensuite coder

**Utile pour :** Grandes features, refactoring, changements d'architecture

## 📝 Exemples de Bonnes vs Mauvaises Questions

### ❌ Vague
> "L'app ne marche pas"

### ✅ Précis
> "Quand je clique sur le bouton Login, j'obtiens une erreur 500. Voici le message : [erreur]. Peux-tu investiguer ?"

---

### ❌ Trop large
> "Améliore tout"

### ✅ Ciblé
> "Améliore la vitesse de chargement de la page d'accueil. Elle prend 5 secondes actuellement."

---

### ❌ Assume du contexte
> "Corrige le bug de la semaine dernière"

### ✅ Contexte clair
> "Le bug où les utilisateurs ne pouvaient pas uploader d'images (conversation du 3 février) est revenu. Peux-tu vérifier ?"

## 🎓 Pro Tips

1. **Backlog d'abord** : Si tu as plusieurs idées, note-les dans le backlog widget avant de tout demander d'un coup

2. **Une tâche à la fois** : Laisse l'IA finir une tâche complètement avant de passer à la suivante

3. **Teste localement** : Après chaque changement important, teste avec `test-local.bat` avant de déployer

4. **Partage les succès** : Dis "Ça marche !" quand c'est bon. Ça aide l'IA à savoir qu'elle peut passer à autre chose.

5. **Nouvelle conversation pour gros changements** : Si tu vas passer plusieurs jours sur une feature, démarre une conversation dédiée

6. **Choisis le bon modèle** : Regarde `MODEL_SELECTION_GUIDE.md` pour savoir quel modèle utiliser selon la tâche

## 🤖 Sélection de Modèle IA

**Voir `MODEL_SELECTION_GUIDE.md` pour le guide complet !**

**Résumé rapide** :
- **Gemini 3 Pro (High)** : Par défaut, la plupart des tâches ✅
- **Gemini 3 Flash** : Questions rapides, modifications simples ⚡
- **Claude Sonnet 4.5** : Features complexes, refactoring majeur 💎
- **Claude Sonnet 4.5 (Thinking)** : Bugs difficiles, optimisations 🧠
- **Claude Opus 4.5 (Thinking)** : Cas exceptionnels extrêmes 🏆

L'IA te suggérera de changer de modèle si nécessaire !

---

**Hamdoulilah, maintenant tu sais comment bien communiquer ! 🎉**

N'oublie pas : l'IA est là pour t'aider. Si quelque chose n'est pas clair, demande !
