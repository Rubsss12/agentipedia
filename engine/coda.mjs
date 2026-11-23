// La règle CODA en JavaScript simple, pour les scripts hors site.
//
// La référence pour le site reste src/lib/coda.ts, et l'artefact autonome en
// garde sa propre copie dans artifact/template.html. Les trois disent la même
// chose : si vous touchez à l'une, touchez aux autres.
//
//   portée    = maillons pleins + la moitié des maillons partiels, de 1 à 10
//   autorisé  = ce que les verrous documentés permettent (données + mandat +
//               supervision ouvrent N3, le quatrième verrou ouvre N4)
//   déclaré   = min(observé, autorisé). C'est la clause anti agent washing :
//               un agent vu plus autonome que ses verrous ne l'autorisent est
//               publié au niveau que ses verrous tiennent, pas à ce qu'il fait.

export function codaScope(links) {
  const full = links.filter((s) => s === 2).length;
  const partial = links.filter((s) => s === 1).length;
  return Math.min(10, Math.max(1, Math.round(full + partial / 2)));
}

export function locksAllow(locks = []) {
  const has = (k) => locks.includes(k);
  if (has("data") && has("mandate") && has("supervision")) return has("compliance") ? 4 : 3;
  return 2;
}

export function codaDeclared(a) {
  return Math.min(a.observed, locksAllow(a.locks));
}

export function quadrantOf(level, scope) {
  if (level >= 3) return scope >= 6 ? "A" : "D";
  return scope >= 6 ? "O" : "C";
}

export function codaQuadrant(a) {
  if (!a) return null;
  return quadrantOf(codaDeclared(a), codaScope(a.links));
}

/** Vu au-dessus de ce que ses verrous autorisent : le cas « agent washing ». */
export function isCapped(a) {
  return !!a && a.observed > codaDeclared(a);
}

export const QUADRANT = {
  C: { en: "Copiloted", fr: "Copiloté" },
  O: { en: "Orchestrated", fr: "Orchestré" },
  D: { en: "Delegated", fr: "Délégué" },
  A: { en: "Agentic", fr: "Agentique" },
};

export const LEVEL = {
  1: { en: "Assistance", fr: "Assistance" },
  2: { en: "Validated execution", fr: "Exécution validée" },
  3: { en: "Delegation under mandate", fr: "Délégation sous mandat" },
  4: { en: "Audited autonomy", fr: "Autonomie auditée" },
};
