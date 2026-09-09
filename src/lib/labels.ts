// French labels for the taxonomies that live in the data as English strings.
// The fiches themselves stay in English (they quote English-language sources),
// but everything the site *derives* from the data (the takeaway block, the
// figures page) reads in the language the visitor picked. That matters for
// discovery: the audience for this index searches in French.
//
// A sector or region absent from these maps falls back to its English string
// rather than throwing, so adding a taxonomy value never breaks a page.

export const SECTOR_FR: Record<string, string> = {
  "Financial Services": "Services financiers",
  "Public Sector & Education": "Secteur public & éducation",
  "Healthcare & Life Sciences": "Santé & sciences du vivant",
  "Retail & E-commerce": "Commerce & e-commerce",
  "Travel & Transportation": "Voyage & transport",
  "Media & Entertainment": "Médias & divertissement",
  Telecommunications: "Télécommunications",
  "Technology & Software": "Technologie & logiciel",
  "Professional & Business Services": "Services aux entreprises",
  "Consumer Goods & Manufacturing": "Biens de consommation & industrie",
  Insurance: "Assurance",
  "Hospitality & Food": "Hôtellerie & restauration",
  "Energy & Utilities": "Énergie & services publics",
  "Automotive & Mobility": "Automobile & mobilité",
};

export const REGION_FR: Record<string, string> = {
  "North America": "Amérique du Nord",
  Europe: "Europe",
  "Asia-Pacific": "Asie-Pacifique",
  "Latin America": "Amérique latine",
  "Middle East": "Moyen-Orient",
  "Middle East & Africa": "Moyen-Orient & Afrique",
  Africa: "Afrique",
  Oceania: "Océanie",
  Global: "International",
};

// Only the countries that actually carry weight in the index are translated;
// the rest keep their English name, which is usually identical or close enough
// to read in French (Portugal, Singapore, Qatar…).
export const COUNTRY_FR: Record<string, string> = {
  "United States": "États-Unis",
  "United Kingdom": "Royaume-Uni",
  Germany: "Allemagne",
  Spain: "Espagne",
  Italy: "Italie",
  Netherlands: "Pays-Bas",
  Belgium: "Belgique",
  Switzerland: "Suisse",
  Sweden: "Suède",
  Norway: "Norvège",
  Denmark: "Danemark",
  Finland: "Finlande",
  Ireland: "Irlande",
  Poland: "Pologne",
  Greece: "Grèce",
  Turkey: "Turquie",
  Japan: "Japon",
  China: "Chine",
  India: "Inde",
  "South Korea": "Corée du Sud",
  Australia: "Australie",
  "New Zealand": "Nouvelle-Zélande",
  Brazil: "Brésil",
  Mexico: "Mexique",
  Colombia: "Colombie",
  Chile: "Chili",
  Argentina: "Argentine",
  Peru: "Pérou",
  Canada: "Canada",
  "Saudi Arabia": "Arabie saoudite",
  "United Arab Emirates": "Émirats arabes unis",
  Egypt: "Égypte",
  Nigeria: "Nigeria",
  "South Africa": "Afrique du Sud",
  Kenya: "Kenya",
  Morocco: "Maroc",
  Israel: "Israël",
  Thailand: "Thaïlande",
  Indonesia: "Indonésie",
  Philippines: "Philippines",
  Vietnam: "Viêt Nam",
  Malaysia: "Malaisie",
  "Sri Lanka": "Sri Lanka",
  Qatar: "Qatar",
  Kuwait: "Koweït",
  Luxembourg: "Luxembourg",
  Austria: "Autriche",
  Portugal: "Portugal",
  Czechia: "Tchéquie",
  Romania: "Roumanie",
  Hungary: "Hongrie",
};

export const sectorFr = (s: string) => SECTOR_FR[s] ?? s;
export const regionFr = (s: string) => REGION_FR[s] ?? s;
export const countryFr = (s: string) => COUNTRY_FR[s] ?? s;
