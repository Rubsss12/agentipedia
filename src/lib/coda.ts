// The CODA matrix (HUB Institute strategic framework), full two-axis model.
// Every deployment is scored on two independent axes:
//   Y - agent autonomy, the N1..N4 ladder ("l'escalier"), measured from what
//       independent sources attest ("au constat"), never from vendor claims;
//   X - business scope, the number of value-chain links ("maillons") the agent
//       measurably instruments (full or partial) on its process frieze.
// The quadrant (Copiloted / Orchestrated / Delegated / Agentic) is DERIVED
// from the two axes: autonomy N3+ is "high", scope >= 6 links is "broad".
// The anti agent-washing clause: declared level = min(observed level, level
// authorized by the four locks). A lock without public evidence is closed.
export type CodaKey = "C" | "O" | "D" | "A";
export type CodaLevel = 1 | 2 | 3 | 4;
/** Per-maillon instrumentation: 0 none, 1 partial (~), 2 full (v). */
export type LinkStatus = 0 | 1 | 2;
export type LockKey = "data" | "mandate" | "supervision" | "compliance";

export type ChainKey =
  | "care" | "commerce" | "achats" | "fonctions" | "pilotage"
  | "ops" | "fraude" | "revenue" | "claims" | "soin"
  | "delivery" | "science" | "public" | "supply" | "vente";

/** The per-entry CODA assessment stored in the data store. */
export interface CodaAssessment {
  chain: ChainKey;
  /** 10 statuses, one per maillon of the chain frieze. */
  links: LinkStatus[];
  /** Observed autonomy on the ladder, from independent evidence only. */
  observed: CodaLevel;
  /** Locks with positive public evidence; an undocumented lock is closed. */
  locks: LockKey[];
  /** Proof line: the evidence behind the level (logs, rates, walk-backs). */
  basis_en: string;
  basis_fr: string;
}

export interface CodaQuadrant {
  key: CodaKey;
  level: CodaLevel; // historical ladder order of the acronym C-O-D-A
  en: string;
  fr: string;
  autonomy: "low" | "high";
  scope: "narrow" | "broad";
  color: string; // solid, badges and dots
  fill: string; // light tint, matrix cells on the score card
  taglineEn: string;
  taglineFr: string;
  descEn: string;
  descFr: string;
}

export const CODA: Record<CodaKey, CodaQuadrant> = {
  C: {
    key: "C", level: 1, en: "Copiloted", fr: "Copiloté",
    autonomy: "low", scope: "narrow", color: "#9aa6b8", fill: "#e9edf3",
    taglineEn: "Low autonomy, narrow scope", taglineFr: "Autonomie faible, périmètre étroit",
    descEn: "Punctual assistants; a person validates or consumes each output. Fast benefits, limited risk. The starting point of most companies in 2026.",
    descFr: "Des assistants ponctuels ; un humain valide ou consomme chaque sortie. Bénéfices rapides, risques limités. Le point de départ de la majorité des entreprises en 2026.",
  },
  O: {
    key: "O", level: 2, en: "Orchestrated", fr: "Orchestré",
    autonomy: "low", scope: "broad", color: "#4e77b0", fill: "#dfe9f6",
    taglineEn: "Low autonomy, broad scope", taglineFr: "Autonomie faible, périmètre large",
    descEn: "AI coordinates whole processes, but the human stays in the loop at every critical step. The favoured model of regulated sectors.",
    descFr: "L'IA coordonne des processus entiers, mais l'humain reste dans la boucle à chaque étape critique. Le modèle privilégié des secteurs régulés.",
  },
  D: {
    key: "D", level: 3, en: "Delegated", fr: "Délégué",
    autonomy: "high", scope: "narrow", color: "#e0a43b", fill: "#f8eed7",
    taglineEn: "High autonomy, narrow scope", taglineFr: "Autonomie forte, périmètre étroit",
    descEn: "Agents execute and commit on targeted tasks; the human handles exceptions within written bounds. The operational-efficiency model.",
    descFr: "Les agents exécutent et engagent sur des tâches ciblées ; l'humain traite les exceptions dans des bornes écrites. Le modèle de l'efficacité opérationnelle.",
  },
  A: {
    key: "A", level: 4, en: "Agentic", fr: "Agentique",
    autonomy: "high", scope: "broad", color: "#6b2bd9", fill: "#ece7f8",
    taglineEn: "High autonomy, broad scope", taglineFr: "Autonomie forte, périmètre large",
    descEn: "Systems chain decisions across a whole process end to end; the human governs through reviews, journals and veto rights. A few pioneers in 2026.",
    descFr: "Des systèmes enchaînent les décisions sur un processus entier de bout en bout ; l'humain gouverne par les revues, les journaux et le droit de veto. Quelques pionniers en 2026.",
  },
};

// Display orders: the acronym ladder (legends, filters) and the matrix grid
// (top-left, top-right, bottom-left, bottom-right; top = high autonomy).
export const CODA_ORDER: CodaKey[] = ["C", "O", "D", "A"];
export const CODA_GRID: CodaKey[] = ["D", "A", "C", "O"];

/** The autonomy ladder N1..N4 (Y axis) - "l'escalier". */
export const LEVELS: Record<CodaLevel, {
  n: string; en: string; fr: string;
  verbEn: string; verbFr: string;
  descEn: string; descFr: string;
  color: string;
}> = {
  1: {
    n: "N1", en: "Assistance", fr: "Assistance", verbEn: "Proposes", verbFr: "Propose",
    descEn: "The agent proposes, the human does. Every output is reworked: writing, analysis and code copilots.",
    descFr: "L'agent propose, l'humain fait. Chaque sortie est reprise : copilotes de rédaction, d'analyse, de code.",
    color: "#9aa6b8",
  },
  2: {
    n: "N2", en: "Validated execution", fr: "Exécution validée", verbEn: "Prepares", verbFr: "Prépare",
    descEn: "The agent does, the human validates before impact - the systematic human-in-the-loop of orchestrated processes. Answering is not executing: a purely informational agent stays here.",
    descFr: "L'agent fait, l'humain valide avant impact : le human-in-the-loop systématique des processus orchestrés. Répondre n'est pas exécuter : un agent purement informationnel reste ici.",
    color: "#4e77b0",
  },
  3: {
    n: "N3", en: "Delegation under mandate", fr: "Délégation sous mandat", verbEn: "Executes", verbFr: "Exécute",
    descEn: "The agent does and commits; the human handles exceptions and audits a posteriori within written bounds.",
    descFr: "L'agent fait et engage ; l'humain traite les exceptions et audite a posteriori dans des bornes écrites.",
    color: "#e0a43b",
  },
  4: {
    n: "N4", en: "Audited autonomy", fr: "Autonomie auditée", verbEn: "Transacts", verbFr: "Transige",
    descEn: "The agent chains decisions end to end; the human governs: reviews, journals and veto rights.",
    descFr: "L'agent enchaîne les décisions de bout en bout ; l'humain gouverne : revues, journaux et droits de veto.",
    color: "#6b2bd9",
  },
};

export const TEST_24H = {
  en: "The 24-hour test - \"If the human does nothing for 24 hours, does the decision still get made?\" No: N1-N2. Yes, within written bounds: N3. Yes, re-arbitrations included, under reviews: N4.",
  fr: "Le test des 24 heures - « Si l'humain ne fait rien pendant 24 heures, la décision se prend-elle ? » Non : N1-N2. Oui, dans des bornes écrites : N3. Oui, ré-arbitrages compris, sous revues : N4.",
};

/** The four locks; 1-3 open level N3, lock 4 opens N4. Undocumented = closed. */
export const LOCKS: { key: LockKey; en: string; fr: string; testEn: string; testFr: string; forLevel: 3 | 4 }[] = [
  {
    key: "data", en: "Reliable data", fr: "La donnée fiable", forLevel: 3,
    testEn: "Freshness, completeness and consistency measured on the case's perimeter - without it the agent hallucinates instead of deciding.",
    testFr: "Fraîcheur, complétude et cohérence mesurées sur le périmètre du cas - sans elle, l'agent hallucine au lieu de décider.",
  },
  {
    key: "mandate", en: "Written mandate", fr: "Le mandat écrit", forLevel: 3,
    testEn: "Perimeter, numbered bounds, testable prohibitions, escalations, reversibility - signed by the use-case owner.",
    testFr: "Périmètre, bornes chiffrées, interdits testables, escalades, réversibilité - signé par le propriétaire du cas d'usage.",
  },
  {
    key: "supervision", en: "Tooled supervision", fr: "La supervision outillée", forLevel: 3,
    testEn: "A named human owner (the Agent Manager), full journaling, tracked KPIs, periodic review.",
    testFr: "Propriétaire humain nommé (l'Agent Manager), journalisation complète, KPI suivis, revue périodique.",
  },
  {
    key: "compliance", en: "Audited compliance", fr: "La conformité auditée", forLevel: 4,
    testEn: "AI Act risk class, sector rules, GDPR - verified by a second line independent from the operators.",
    testFr: "AI Act (classification de risque), règles sectorielles, RGPD - vérifiée par une seconde ligne indépendante des opérateurs.",
  },
];

/** The scope bands under the X axis of the score card. */
export const BANDS = [
  { from: 1, to: 2, en: "Restricted scope", fr: "Périmètre restreint" },
  { from: 3, to: 6, en: "Intermediate scope", fr: "Périmètre intermédiaire" },
  { from: 7, to: 10, en: "Extended scope", fr: "Périmètre étendu" },
];

export interface Chain {
  key: ChainKey;
  en: string;
  fr: string;
  links: { en: string; fr: string }[];
}

// The value-chain friezes ("frises"), 10 maillons each - the unit of measure
// of the X axis. "achats" and "commerce" are verbatim from the HUB Institute
// masterclass; the others transpose the same method to the corpus's processes.
export const CHAINS: Record<ChainKey, Chain> = {
  care: {
    key: "care", en: "Customer-care journey", fr: "Parcours service client",
    links: [
      { en: "Contact & intake", fr: "Contact & accueil" },
      { en: "Identity & context", fr: "Identification & contexte" },
      { en: "Request triage", fr: "Qualification de la demande" },
      { en: "Answer & information", fr: "Réponse & information" },
      { en: "Account action", fr: "Action sur le compte" },
      { en: "Financial transaction", fr: "Transaction financière" },
      { en: "Technical resolution", fr: "Résolution technique" },
      { en: "Human escalation", fr: "Escalade humaine" },
      { en: "Post-contact follow-up", fr: "Suivi post-contact" },
      { en: "Satisfaction & loyalty", fr: "Satisfaction & fidélisation" },
    ],
  },
  commerce: {
    key: "commerce", en: "Purchase journey (agentic commerce)", fr: "Parcours d'achat (commerce agentique)",
    links: [
      { en: "Intent & mandate", fr: "Intention & mandat" },
      { en: "Discovery", fr: "Découverte" },
      { en: "Evaluation", fr: "Évaluation" },
      { en: "Comparison", fr: "Comparaison" },
      { en: "Offer & loyalty", fr: "Offre & fidélité" },
      { en: "Financing", fr: "Financement" },
      { en: "Confirmation", fr: "Confirmation" },
      { en: "Payment", fr: "Paiement" },
      { en: "Delivery & tracking", fr: "Livraison & suivi" },
      { en: "Service & repeat purchase", fr: "Service & réachat" },
    ],
  },
  achats: {
    key: "achats", en: "Procurement process", fr: "Processus achats",
    links: [
      { en: "Need expression", fr: "Expression du besoin" },
      { en: "Supplier sourcing", fr: "Sourcing fournisseurs" },
      { en: "Tender / RFx", fr: "Appel d'offres / RFx" },
      { en: "Bid analysis", fr: "Analyse des offres" },
      { en: "Negotiation", fr: "Négociation" },
      { en: "Contracting", fr: "Contractualisation" },
      { en: "Ordering", fr: "Commande" },
      { en: "Receipt / conformity", fr: "Réception / conformité" },
      { en: "Invoicing", fr: "Facturation" },
      { en: "Payment", fr: "Paiement" },
    ],
  },
  fonctions: {
    key: "fonctions", en: "Enterprise functions (transverse)", fr: "Fonctions de l'entreprise (transverse)",
    links: [
      { en: "Management & finance", fr: "Direction & finance" },
      { en: "Marketing & communication", fr: "Marketing & communication" },
      { en: "Sales & commerce", fr: "Vente & commerce" },
      { en: "Customer relations", fr: "Relation client" },
      { en: "Operations & production", fr: "Opérations & production" },
      { en: "Supply chain & logistics", fr: "Supply chain & logistique" },
      { en: "HR & talent", fr: "RH & talents" },
      { en: "IT & engineering", fr: "IT & ingénierie" },
      { en: "Legal & compliance", fr: "Juridique & conformité" },
      { en: "R&D & innovation", fr: "R&D & innovation" },
    ],
  },
  pilotage: {
    key: "pilotage", en: "Steering & decision chain", fr: "Chaîne de pilotage & décision",
    links: [
      { en: "Data collection", fr: "Collecte des données" },
      { en: "Consolidation & reliability", fr: "Consolidation & fiabilisation" },
      { en: "Dashboards & reporting", fr: "Restitution & tableaux de bord" },
      { en: "Variance alerts", fr: "Alertes sur écarts" },
      { en: "Causal analysis", fr: "Analyse causale" },
      { en: "Forecasting", fr: "Prévision" },
      { en: "Simulation & scenarios", fr: "Simulation & scénarios" },
      { en: "Recommendation", fr: "Recommandation" },
      { en: "Arbitration & decision", fr: "Arbitrage & décision" },
      { en: "Execution & follow-through", fr: "Exécution & suivi" },
    ],
  },
  ops: {
    key: "ops", en: "Industrial operations chain", fr: "Chaîne des opérations industrielles",
    links: [
      { en: "Field data capture", fr: "Capture terrain (capteurs)" },
      { en: "Monitoring & detection", fr: "Surveillance & détection" },
      { en: "Diagnosis", fr: "Diagnostic" },
      { en: "Forecast & anticipation", fr: "Prévision & anticipation" },
      { en: "Intervention recommendation", fr: "Recommandation d'intervention" },
      { en: "Planning & scheduling", fr: "Planification & ordonnancement" },
      { en: "Action execution", fr: "Exécution de l'action" },
      { en: "Quality control", fr: "Contrôle qualité" },
      { en: "Traceability & documentation", fr: "Traçabilité & documentation" },
      { en: "Continuous improvement", fr: "Amélioration continue" },
    ],
  },
  fraude: {
    key: "fraude", en: "Risk & fraud chain", fr: "Chaîne risque & fraude",
    links: [
      { en: "Signal collection", fr: "Collecte des signaux" },
      { en: "Profiling & rules", fr: "Profilage & règles" },
      { en: "Real-time scoring", fr: "Scoring temps réel" },
      { en: "Anomaly detection", fr: "Détection de l'anomalie" },
      { en: "Decision (block / allow)", fr: "Décision (bloquer / laisser)" },
      { en: "Block execution", fr: "Exécution du blocage" },
      { en: "Customer notification", fr: "Notification client" },
      { en: "Exception review", fr: "Revue des exceptions" },
      { en: "Reporting & restitution", fr: "Restitution & reporting" },
      { en: "Model improvement", fr: "Amélioration des modèles" },
    ],
  },
  revenue: {
    key: "revenue", en: "Pricing & revenue management", fr: "Pricing & revenue management",
    links: [
      { en: "Market & demand data", fr: "Collecte marché & demande" },
      { en: "Demand forecasting", fr: "Prévision de la demande" },
      { en: "Segmentation", fr: "Segmentation" },
      { en: "Price optimization", fr: "Optimisation du prix" },
      { en: "Price publication", fr: "Publication des prix" },
      { en: "Multichannel distribution", fr: "Distribution multicanal" },
      { en: "Promotions & offers", fr: "Promotions & offres" },
      { en: "Performance tracking", fr: "Suivi de la performance" },
      { en: "Re-arbitration", fr: "Ré-arbitrage" },
      { en: "Reporting", fr: "Reporting" },
    ],
  },
  claims: {
    key: "claims", en: "Insurance claims chain", fr: "Chaîne sinistres (assurance)",
    links: [
      { en: "Claim declaration", fr: "Déclaration du sinistre" },
      { en: "Policy verification", fr: "Vérification de la police" },
      { en: "Anti-fraud checks", fr: "Contrôle anti-fraude" },
      { en: "Damage assessment", fr: "Évaluation du dommage" },
      { en: "Settlement decision", fr: "Décision d'indemnisation" },
      { en: "Payout", fr: "Paiement" },
      { en: "Notification & explanation", fr: "Notification & explication" },
      { en: "Dispute handling", fr: "Gestion des litiges" },
      { en: "Case closure", fr: "Clôture du dossier" },
      { en: "Prevention & pricing", fr: "Prévention & tarification" },
    ],
  },
  soin: {
    key: "soin", en: "Care pathway", fr: "Parcours de soin",
    links: [
      { en: "Intake & symptoms", fr: "Accueil & symptômes" },
      { en: "Record & history", fr: "Dossier & antécédents" },
      { en: "Orientation", fr: "Orientation" },
      { en: "Diagnostic support", fr: "Aide au diagnostic" },
      { en: "Care plan", fr: "Plan de soin" },
      { en: "Prescription", fr: "Prescription" },
      { en: "Care delivery", fr: "Exécution des soins" },
      { en: "Patient follow-up", fr: "Suivi du patient" },
      { en: "Care-team coordination", fr: "Coordination des acteurs" },
      { en: "Prevention", fr: "Prévention" },
    ],
  },
  delivery: {
    key: "delivery", en: "Software delivery chain", fr: "Chaîne de développement logiciel",
    links: [
      { en: "Need expression", fr: "Expression du besoin" },
      { en: "Design", fr: "Conception" },
      { en: "Code generation", fr: "Génération de code" },
      { en: "Code review", fr: "Revue de code" },
      { en: "Testing", fr: "Tests" },
      { en: "Bug fixing", fr: "Correction & debug" },
      { en: "Continuous integration", fr: "Intégration continue" },
      { en: "Deployment", fr: "Déploiement" },
      { en: "Production monitoring", fr: "Supervision en production" },
      { en: "Documentation", fr: "Documentation" },
    ],
  },
  science: {
    key: "science", en: "Scientific analysis chain", fr: "Chaîne d'analyse scientifique",
    links: [
      { en: "Data collection", fr: "Collecte des données" },
      { en: "Pre-processing", fr: "Prétraitement" },
      { en: "Detection & annotation", fr: "Détection & annotation" },
      { en: "Classification", fr: "Classification" },
      { en: "Analysis & measurement", fr: "Analyse & mesure" },
      { en: "Interpretation", fr: "Interprétation" },
      { en: "Restitution", fr: "Restitution" },
      { en: "Operational decision", fr: "Décision opérationnelle" },
      { en: "Archiving & sharing", fr: "Archivage & partage" },
      { en: "Model improvement", fr: "Amélioration des modèles" },
    ],
  },
  public: {
    key: "public", en: "Citizen-service journey", fr: "Parcours usager (service public)",
    links: [
      { en: "Request intake", fr: "Accueil de la demande" },
      { en: "Identification", fr: "Identification" },
      { en: "Information & orientation", fr: "Information & orientation" },
      { en: "Case triage", fr: "Qualification du dossier" },
      { en: "Case assembly", fr: "Constitution du dossier" },
      { en: "Processing", fr: "Instruction" },
      { en: "Administrative decision", fr: "Décision administrative" },
      { en: "Notification", fr: "Notification" },
      { en: "Delivery & execution", fr: "Délivrance & exécution" },
      { en: "Follow-up & complaints", fr: "Suivi & réclamation" },
    ],
  },
  supply: {
    key: "supply", en: "Supply chain", fr: "Chaîne d'approvisionnement",
    links: [
      { en: "Demand forecasting", fr: "Prévision de la demande" },
      { en: "Inventory planning", fr: "Planification des stocks" },
      { en: "Ordering & replenishment", fr: "Commande & réassort" },
      { en: "Allocation & distribution", fr: "Allocation & répartition" },
      { en: "Warehouse preparation", fr: "Préparation & entrepôt" },
      { en: "Transport & delivery", fr: "Transport & livraison" },
      { en: "Real-time tracking", fr: "Suivi temps réel" },
      { en: "Exception handling", fr: "Gestion des exceptions" },
      { en: "Returns", fr: "Retours" },
      { en: "Continuous optimization", fr: "Optimisation continue" },
    ],
  },
  vente: {
    key: "vente", en: "B2B sales cycle", fr: "Cycle de vente B2B",
    links: [
      { en: "Targeting & prospecting", fr: "Ciblage & prospection" },
      { en: "Lead qualification", fr: "Qualification des leads" },
      { en: "First contact", fr: "Prise de contact" },
      { en: "Need discovery", fr: "Découverte du besoin" },
      { en: "Proposal & quote", fr: "Proposition & devis" },
      { en: "Negotiation", fr: "Négociation" },
      { en: "Signature", fr: "Signature" },
      { en: "Customer onboarding", fr: "Onboarding client" },
      { en: "Account & repeat business", fr: "Compte & réachat" },
      { en: "Loyalty", fr: "Fidélisation" },
    ],
  },
};

/** Scope = full links + half the partial links, floored to [1, 10]. */
export function codaScope(links: LinkStatus[]): number {
  const full = links.filter((s) => s === 2).length;
  const partial = links.filter((s) => s === 1).length;
  return Math.min(10, Math.max(1, Math.round(full + partial / 2)));
}

/** Level the documented locks authorize: 1-3 open N3, all four open N4. */
export function locksAllow(locks: LockKey[]): CodaLevel {
  const has = (k: LockKey) => locks.includes(k);
  if (has("data") && has("mandate") && has("supervision")) {
    return has("compliance") ? 4 : 3;
  }
  return 2;
}

/** The anti agent-washing clause: declared = min(observed, authorized). */
export function codaDeclared(a: CodaAssessment): CodaLevel {
  return Math.min(a.observed, locksAllow(a.locks)) as CodaLevel;
}

/** Quadrant from the two axes; high autonomy = N3+, broad scope = 6+ links. */
export function quadrantOf(level: CodaLevel, scope: number): CodaKey {
  if (level >= 3) return scope >= 6 ? "A" : "D";
  return scope >= 6 ? "O" : "C";
}

/** The entry's official quadrant, computed on the DECLARED level. */
export function codaQuadrant(a?: CodaAssessment): CodaKey | undefined {
  if (!a) return undefined;
  return quadrantOf(codaDeclared(a), codaScope(a.links));
}

/** Sort key for the "maturity" sort: declared level first, then scope; unscored entries sort last. */
export function codaRank(a?: CodaAssessment): number {
  if (!a) return 9999;
  return codaDeclared(a) * 100 + codaScope(a.links);
}
