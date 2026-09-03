# Ajouter un cas d'usage à la main

Pour les cas clients HUB Institute, ou tout déploiement repéré hors du moteur
de curation automatique.

## La règle ne change pas

Une fiche ajoutée à la main passe **exactement la même validation** que celles
trouvées par le moteur :

1. **L'entreprise est nommée** — jamais « un grand distributeur ».
2. **La solution est nommée** — le nom public de l'agent, ou un descriptif
   explicite commençant par « Unnamed … » si l'agent n'a pas de nom public.
3. **Au moins une source vérifiable**, avec URL, titre, éditeur et date.

> ⚠️ **Un cas client sans aucune source publique ne peut pas entrer dans
> l'index.** C'est la promesse du site (« Pas de source, pas de fiche ») et
> c'est aussi une question de confidentialité : ne publiez pas le déploiement
> interne d'un client sans qu'il existe une trace publique et un accord.
> S'il n'y a rien de public, demandez au client de publier (post LinkedIn,
> communiqué, page site, intervention en conférence) — cette trace devient
> la source.

## Quatre façons de faire

### 1. Le formulaire sur le site (recommandé)

Rendez-vous sur **https://agentipedia.hubinstitute.com/admin**, saisissez le mot
de passe d'équipe et remplissez le formulaire. La fiche est validée, ajoutée au
dépôt, et **le site se reconstruit tout seul** : elle est en ligne une à deux
minutes plus tard.

C'est le seul chemin qui met à jour le site sans passer par un terminal.

*Mise en place (une fois)* — dans Cloudflare → Pages → `agentipedia` →
Settings → Variables and Secrets, ajouter deux variables **chiffrées** :

| Variable | Valeur |
|---|---|
| `ADD_CASE_PASSWORD` | le mot de passe que l'équipe saisira |
| `GITHUB_TOKEN` | un jeton GitHub *fine-grained* avec **Contents : Read and write** sur `Rubsss12/agentipedia` |

### 2. Saisie guidée en terminal

```bash
npm run add-case
```

Le script pose les questions une par une, propose les valeurs autorisées
(secteur, région, chaîne CODA…), calcule l'identifiant et la confiance, valide,
puis écrit dans `data/entries.json`. **Rien n'est écrit si la fiche est
invalide** : les erreurs sont listées pour correction.

### 3. À partir d'un modèle JSON

```bash
npm run add-case -- --template          # crée nouvelle-fiche.json
# … on remplit le fichier …
npm run add-case -- nouvelle-fiche.json
```

Le fichier peut aussi contenir un **tableau** de fiches pour en ajouter
plusieurs d'un coup.

### 4. Demander à Claude

Donnez-lui les infos et les liens : il rédige la fiche, la score sur la
matrice CODA™ et l'ajoute.

## Publier

```bash
git add data/entries.json && git commit -m "Ajout du cas <Entreprise>" && git push
```

Le déploiement Cloudflare part tout seul (workflow `deploy.yml`).

## Bon à savoir

- Les fiches ajoutées à la main sont stockées dans `data/manual-cases.json`,
  séparé de `data/entries.json` (qui dépasse la limite de 1 Mo de l'API GitHub).
  Le site et l'artifact fusionnent les deux fichiers à la construction.
- Les fiches ajoutées à la main portent `provenance: "manual"` et affichent le
  badge **« Ajouté par le HUB Institute »** sur leur page.
- Le moteur de curation ne les écrasera jamais : il n'ajoute que des sources ou
  des résultats manquants, sans jamais remplacer un champ déjà rempli.
- Les doublons sont refusés (même entreprise + même solution).
- Le score CODA™ suit la même règle que partout : `déclaré = min(observé,
  autorisé par les verrous documentés)`. Un verrou sans preuve publique est
  réputé fermé.
