// The CODA matrix (HUB Institute strategic framework): every deployment is
// placed by two axes, agent autonomy and business scope. Read as a maturity
// ladder, the four quadrants number N1 to N4 in the order of the acronym
// C-O-D-A. This is an analytical reading, never a claim made by the source.
export type CodaKey = "C" | "D" | "O" | "A";
export type CodaLevel = 1 | 2 | 3 | 4;

export interface CodaQuadrant {
  key: CodaKey;
  letter: CodaKey;
  level: CodaLevel; // N1..N4, the maturity ladder (C=N1, O=N2, D=N3, A=N4)
  n: string; // "N1".."N4"
  en: string;
  fr: string;
  autonomy: "low" | "high";
  scope: "narrow" | "broad";
  color: string; // solid, for the matrix cells
  taglineEn: string;
  taglineFr: string;
  descEn: string;
  descFr: string;
}

export const CODA: Record<CodaKey, CodaQuadrant> = {
  C: {
    key: "C", letter: "C", level: 1, n: "N1", en: "Copilot", fr: "Copilote",
    autonomy: "low", scope: "narrow", color: "#9aa6b8",
    taglineEn: "Low autonomy, narrow scope", taglineFr: "Autonomie faible, périmètre étroit",
    descEn: "Agents are punctual assistants; a person validates each output. Fast benefits, limited risk. The starting point for most companies.",
    descFr: "Les agents sont des assistants ponctuels ; un humain valide chaque sortie. Bénéfices rapides, risques limités. Le point de départ de la plupart.",
  },
  O: {
    key: "O", letter: "O", level: 2, n: "N2", en: "Orchestrated", fr: "Orchestrée",
    autonomy: "low", scope: "broad", color: "#4e77b0",
    taglineEn: "Low autonomy, broad scope", taglineFr: "Autonomie faible, périmètre large",
    descEn: "AI coordinates whole processes, but the human stays in the loop at every critical step. The favoured model of regulated sectors.",
    descFr: "L'IA coordonne des processus entiers, mais l'humain reste dans la boucle à chaque étape critique. Le modèle privilégié des secteurs régulés.",
  },
  D: {
    key: "D", letter: "D", level: 3, n: "N3", en: "Delegated", fr: "Déléguée",
    autonomy: "high", scope: "narrow", color: "#e0a43b",
    taglineEn: "High autonomy, narrow scope", taglineFr: "Autonomie forte, périmètre étroit",
    descEn: "Agents execute targeted tasks autonomously; the human steps in only as an exception. The operational-efficiency model.",
    descFr: "Les agents exécutent des tâches ciblées en autonomie ; l'humain n'intervient qu'en exception. Le modèle de l'efficacité opérationnelle.",
  },
  A: {
    key: "A", letter: "A", level: 4, n: "N4", en: "Agentic", fr: "Agentique",
    autonomy: "high", scope: "broad", color: "#7c5ce0",
    taglineEn: "High autonomy, broad scope", taglineFr: "Autonomie forte, périmètre large",
    descEn: "Multi-agent systems pilot entire processes end to end; the human designs, supervises and arbitrates. A few pioneers in 2026.",
    descFr: "Des systèmes multi-agents pilotent des processus entiers de bout en bout ; l'humain conçoit, supervise, arbitre. Quelques pionniers en 2026.",
  },
};

// Ladder order N1 -> N4 (the acronym C-O-D-A). Used for filters, legends, sort.
export const CODA_ORDER: CodaKey[] = ["C", "O", "D", "A"];

// Matrix grid order (top-left, top-right, bottom-left, bottom-right):
// top row = high autonomy, left column = narrow scope.
export const CODA_GRID: CodaKey[] = ["D", "A", "C", "O"];

// Rank a deployment on the maturity ladder; unset coda sorts last.
export function codaRank(key?: CodaKey): number {
  return key ? CODA[key].level : 99;
}
