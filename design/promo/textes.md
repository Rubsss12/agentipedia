# Kit promo Agentipedia, textes de publication

Les visuels se régénèrent avec `npm run promo-kit` (français) et
`npm run promo-kit -- --en` (anglais). Ils sortent dans `promo-kit/`, qui n'est
pas versionné : les chiffres changent à chaque curation, donc on refait les
images au moment de publier plutôt que de traîner des visuels périmés.

| Fichier | Taille | Usage |
|---|---|---|
| `annonce.png` | 1200 x 627 | Image d'un post avec lien, bannière, en-tête d'email |
| `carre.png` | 1080 x 1080 | Post simple LinkedIn, Instagram, X |
| `carrousel-1` à `carrousel-5` | 1080 x 1350 | Carrousel LinkedIn, à exporter en PDF dans cet ordre |

Ce fichier est un gabarit : les chiffres y sont des champs, pas des valeurs.
`npm run promo-kit` écrit la version remplie dans `promo-kit/textes.md`, aux
chiffres du jour. On publie depuis cette sortie, jamais depuis ce gabarit, et
aucun chiffre périmé ne peut partir.

---

## 1. Post de lancement, LinkedIn, français

> Nous avons passé des mois à vérifier, une par une, les annonces d'agents IA en entreprise.
>
> {total} déploiements tiennent la route. Un seul est vraiment agentique.
>
> Pas « une grande banque ». Pas « un chatbot IA ». Une fiche n'existe dans l'Agentipedia que si une source publique nomme l'entreprise et nomme la solution. Les contrats signés, les protocoles d'accord et les démonstrations d'éditeurs sans client nommé restent dehors.
>
> Ce qui reste dessine un paysage très différent du récit ambiant :
>
> {C} déploiements sont copilotés. L'IA assiste, l'humain valide.
> {O} sont orchestrés sur un processus large, l'humain gardant les étapes critiques.
> {D} sont délégués : l'agent engage sur un périmètre ciblé.
> 1 seul enchaîne les décisions de bout en bout.
>
> Et {capped} agents sont observés au-dessus de ce que leurs garde-fous publiés autorisent. Ils engagent de l'argent, des commandes ou du code sans mandat écrit ni supervision documentée. Nous les publions au niveau que leurs verrous tiennent, pas à celui qu'ils revendiquent.
>
> L'annuaire est ouvert, sans inscription : agentipedia.hubinstitute.com
>
> Cherchez votre secteur. Cherchez votre concurrent.

Visuel : `carre.png`, ou le carrousel complet.

## 2. Post carrousel, accroche courte

> {total} agents IA déployés en entreprise. Un seul est vraiment agentique.
>
> Cinq slides pour comprendre ce que les annonces disent vraiment, et ce que mesure la matrice CODA™ du HUB Institute.
>
> L'annuaire complet, en accès libre : agentipedia.hubinstitute.com

Visuel : `carrousel-1` à `carrousel-5`, exportés en un seul PDF.

## 3. Post hebdomadaire, gabarit du lundi

Le texte des nouveautés sort de `npm run weekly`. Gabarit du post :

> Les nouveaux déploiements d'agents IA vérifiés cette semaine dans l'Agentipedia :
>
> [coller ici la liste produite par npm run weekly, entreprise, solution, pays]
>
> Chaque fiche nomme l'entreprise, nomme la solution et renvoie aux sources publiques qui l'attestent. Pas de source, pas de fiche.
>
> agentipedia.hubinstitute.com

Une semaine sans nouveauté se publie telle quelle : c'est une information, pas
un trou à combler. Le script produit déjà le texte qui le dit.

## 4. Post éditorial, l'angle agent washing

> « Agent autonome. » Nous avons vérifié.
>
> Sur les {total} déploiements d'agents IA que nous avons documentés, {capped} font plus que leurs garde-fous publiés ne l'autorisent. L'agent engage de l'argent, une commande ou du code, mais aucun mandat écrit, aucune supervision outillée, aucun contrôle de conformité n'est documenté publiquement.
>
> Nous ne les retirons pas de l'annuaire. Nous les publions au niveau que leurs verrous tiennent, et nous le signalons sur la fiche.
>
> C'est la différence entre un agent autonome et un agent qu'on dit autonome.
>
> agentipedia.hubinstitute.com

Visuel : `carrousel-4.png`.

## 5. Format court, X et Bluesky

> {total} agents IA déployés en entreprise, vérifiés un par un. Un seul est vraiment agentique.
> Pas de source, pas de fiche.
> agentipedia.hubinstitute.com

---

# English versions

## 1. Launch post, LinkedIn

> We spent months checking corporate AI agent announcements, one by one.
>
> {total} deployments hold up. Only one is truly agentic.
>
> Not "a major bank". Not "an AI chatbot". An entry exists in Agentipedia only when a public source names the company and names the solution. Signed contracts, memoranda of understanding and vendor demos with no named customer stay out.
>
> What is left looks nothing like the prevailing story:
>
> {C} deployments are copiloted. AI assists, a person validates.
> {O} are orchestrated across a broad process, with people keeping the critical steps.
> {D} are delegated: the agent commits within a defined scope.
> 1 chains decisions end to end.
>
> And {capped} agents are observed above what their published safeguards allow. They commit money, orders or code with no written mandate and no documented supervision. We publish them at the level their locks hold, not the one they claim.
>
> The directory is open, no sign-up: agentipedia.hubinstitute.com
>
> Search your sector. Search your competitor.

## 2. Carousel caption

> {total} AI agents deployed inside real companies. Only one is truly agentic.
>
> Five slides on what the announcements actually say, and what the HUB Institute CODA™ matrix measures.
>
> The full directory, free to browse: agentipedia.hubinstitute.com

## 3. Weekly post template

> The AI agent deployments verified into Agentipedia this week:
>
> [paste the list from npm run weekly -- --en]
>
> Every entry names the company, names the solution and links the public sources behind it. No source, no entry.
>
> agentipedia.hubinstitute.com

## 4. Agent washing post

> "Autonomous agent." We checked.
>
> Of the {total} AI agent deployments we have documented, {capped} reach further than their published safeguards allow. The agent commits money, an order or code, yet no written mandate, no tooled supervision and no compliance control is documented in public.
>
> We do not remove them from the directory. We publish them at the level their locks hold, and we flag it on the entry.
>
> That is the difference between an autonomous agent and an agent said to be autonomous.
>
> agentipedia.hubinstitute.com

## 5. Short form

> {total} corporate AI agents, verified one by one. Only one is truly agentic.
> No source, no entry.
> agentipedia.hubinstitute.com
