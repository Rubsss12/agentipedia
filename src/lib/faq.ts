/**
 * The FAQ, kept as data rather than markup so the same source feeds both the
 * rendered page and the FAQPage structured data, so the two cannot drift apart.
 *
 * Answers are deliberately short and self-contained: a model quoting one of
 * these should be able to lift a single answer and still be correct without the
 * surrounding page. Questions are the ones people actually ask about the index,
 * not questions written backwards from keywords.
 */
export interface Qa {
  qEn: string;
  qFr: string;
  aEn: string;
  aFr: string;
}

export function faq(count: number, sectors: number, countries: number): Qa[] {
  return [
    {
      qEn: "What is Agentipedia?",
      qFr: "Qu'est-ce qu'Agentipedia ?",
      aEn: `Agentipedia is a public catalog of real AI-agent deployments inside named companies, published by HUB Institute. It currently documents ${count} deployments across ${sectors} sectors and ${countries} countries. Every entry names the company and the exact solution, links the sources that prove it, and is scored on the CODA™ matrix.`,
      aFr: `Agentipedia est un catalogue public de déploiements réels d'agents IA dans des entreprises nommées, publié par le HUB Institute. Il documente aujourd'hui ${count} déploiements dans ${sectors} secteurs et ${countries} pays. Chaque fiche nomme l'entreprise et la solution exacte, cite les sources qui la prouvent, et est scorée sur la matrice CODA™.`,
    },
    {
      qEn: "How does a deployment earn a place in the index?",
      qFr: "Comment un déploiement entre-t-il dans l'index ?",
      aEn: "Three conditions, all required. The company must be named for real, never \"a large retailer\". The solution must be a named product, platform or internally branded agent, never \"a chatbot\". And at least one retrieved public source must name both. Anything that fails is rejected. The exception is a case a company shares with HUB Institute directly, which is labelled \"client-sourced\" so the reader knows there is no public source.",
      aFr: "Trois conditions, toutes obligatoires. L'entreprise doit être nommée pour de vrai, jamais « un grand distributeur ». La solution doit être un produit, une plateforme ou un agent interne portant un nom, jamais « un chatbot ». Et au moins une source publique réellement consultée doit nommer les deux. Tout ce qui échoue est rejeté. Seule exception : un cas transmis directement au HUB Institute par l'entreprise, étiqueté « source client » pour que le lecteur sache qu'il n'y a pas de source publique.",
    },
    {
      qEn: "What is the CODA™ method?",
      qFr: "Qu'est-ce que la méthode CODA™ ?",
      aEn: "CODA™ is HUB Institute's framework for scoring an AI agent on two independent axes: how autonomous it is (N1 to N4, as independent sources attest) and how much of the value chain it instruments (1 to 10 links). The quadrant (Copiloted, Orchestrated, Delegated, Agentic) follows from the two axes rather than being asserted.",
      aFr: "CODA™ est le cadre du HUB Institute pour scorer un agent IA sur deux axes indépendants : son autonomie (N1 à N4, telle que des sources indépendantes l'attestent) et la part de la chaîne de valeur qu'il instrumente (1 à 10 maillons). Le quadrant (Copiloté, Orchestré, Délégué, Agentique) découle des deux axes au lieu d'être affirmé.",
    },
    {
      qEn: "What do the autonomy levels N1 to N4 mean?",
      qFr: "Que signifient les niveaux d'autonomie N1 à N4 ?",
      aEn: "N1, the agent proposes and a human does. N2, the agent does and a human validates before impact. N3, the agent executes and commits within written bounds, the human handles exceptions. N4, the agent chains decisions end to end and the human governs through reviews and veto rights.",
      aFr: "N1, l'agent propose et l'humain fait. N2, l'agent fait et l'humain valide avant impact. N3, l'agent exécute et engage dans des bornes écrites, l'humain traite les exceptions. N4, l'agent enchaîne les décisions de bout en bout et l'humain gouverne par les revues et le droit de veto.",
    },
    {
      qEn: "What does a scope of 3/10 or 7/10 mean?",
      qFr: "Que veut dire une portée de 3/10 ou 7/10 ?",
      aEn: "Scope is the number of links the agent instruments on the ten-step frieze of its own process: a customer-care journey, a procurement process, a claims chain. A link counts only when the agent does measurable work there; a link merely fed by its results does not. Scope = full links + half the partial ones. 1 to 2 is restricted, 3 to 6 intermediate, 7 to 10 extended.",
      aFr: "La portée est le nombre de maillons que l'agent instrumente sur la frise en dix étapes de son propre processus : parcours service client, processus achats, chaîne sinistres. Un maillon ne compte que si l'agent y accomplit un travail mesurable ; un maillon simplement alimenté par ses résultats, non. Portée = maillons pleins + moitié des partiels. 1 à 2 restreint, 3 à 6 intermédiaire, 7 à 10 étendu.",
    },
    {
      qEn: "What separates N2 from N3?",
      qFr: "Qu'est-ce qui sépare N2 de N3 ?",
      aEn: "Not technology, but locks. Reliable data, a written mandate and tooled supervision must all be documented before an agent can be declared at N3; audited compliance opens N4. A lock with no public evidence counts as closed. This is why many technically impressive agents stay at N2 in the index.",
      aFr: "Pas la technologie, mais les verrous. La donnée fiable, le mandat écrit et la supervision outillée doivent tous être documentés pour qu'un agent soit déclaré N3 ; la conformité auditée ouvre le N4. Un verrou sans preuve publique est réputé fermé. C'est pourquoi beaucoup d'agents techniquement impressionnants restent à N2 dans l'index.",
    },
    {
      qEn: "What is the anti agent-washing clause?",
      qFr: "Qu'est-ce que la clause anti agent-washing ?",
      aEn: "Declared level = minimum of the observed level and the level the locks authorise. An agent seen behaving autonomously but without documented governance is still declared at the lower level, and carries an amber ring marking the gap. Vendor-only evidence caps the observed level at N2, because answering is not executing.",
      aFr: "Niveau déclaré = minimum entre le niveau observé et celui qu'autorisent les verrous. Un agent vu se comportant de façon autonome mais sans gouvernance documentée reste déclaré au niveau inférieur, et porte un contour ambre marquant l'écart. Une preuve uniquement éditeur plafonne l'observé à N2, car répondre n'est pas exécuter.",
    },
    {
      qEn: "Where does the data come from?",
      qFr: "D'où viennent les données ?",
      aEn: "From public sources retrieved on the live web: news media, company announcements, earnings calls, conference talks and vendor case studies, each labelled by type on the fiche, because a press release and an independent investigation are not the same evidence. Confidence reflects that difference, and the reason behind each score is written out.",
      aFr: "De sources publiques consultées sur le web : presse, communications d'entreprise, résultats financiers, conférences et études de cas éditeurs, chacune étiquetée par type sur la fiche, parce qu'un communiqué de presse et une enquête indépendante ne sont pas la même preuve. La confiance reflète cette différence, et la raison de chaque score est écrite.",
    },
    {
      qEn: "Are the entries written in French?",
      qFr: "Les fiches sont-elles rédigées en français ?",
      aEn: "The interface, the key-facts block and the CODA™ score card are bilingual. The description of what each agent does stays in English, the language of the sources it quotes, so nothing is lost or softened in translation.",
      aFr: "L'interface, le bloc « ce qu'il faut retenir » et la score card CODA™ sont bilingues. La description de ce que fait l'agent reste en anglais, la langue des sources qu'elle cite, pour que rien ne soit perdu ou adouci par la traduction.",
    },
    {
      qEn: "How can a company be added to the index?",
      qFr: "Comment faire ajouter une entreprise à l'index ?",
      aEn: "Write to contact@hubinstitute.com with the company, the named solution and any public source. The same rule applies to submissions as to anything the engine finds; a case with no public source is published as client-sourced and labelled as such.",
      aFr: "Écrivez à contact@hubinstitute.com avec l'entreprise, la solution nommée et les sources publiques éventuelles. La même règle s'applique aux propositions qu'à ce que trouve le moteur ; un cas sans source publique est publié en « source client » et étiqueté comme tel.",
    },
    {
      qEn: "Who publishes Agentipedia?",
      qFr: "Qui publie Agentipedia ?",
      aEn: "HUB Institute, a French think tank on digital transformation that has trained 45,000 executives and counts 120 member companies. Agentipedia is its observatory of the agentic enterprise; the CODA™ framework comes from its masterclass \"L'Entreprise Agentique\".",
      aFr: "Le HUB Institute, think tank français de la transformation digitale qui a accompagné 45 000 cadres et compte 120 entreprises adhérentes. Agentipedia est son observatoire de l'entreprise agentique ; le cadre CODA™ est issu de sa masterclass « L'Entreprise Agentique ».",
    },
  ];
}
