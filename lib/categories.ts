export interface SubCategory {
  slug: string
  name: string
}

export interface Category {
  slug: string
  name: string
  icon: string
  subs?: SubCategory[]
}

export const CATEGORIES: Category[] = [
  {
    slug: 'batterier-opladere',
    name: 'Batterier & opladere',
    icon: '🔋',
    subs: [
      { slug: '12v', name: '12V batterier & ladere' },
      { slug: '18v', name: '18V batterier & ladere' },
      { slug: 'procore', name: 'ProCORE-serien' },
      { slug: 'tilbehor', name: 'Tilbehør til batterier' },
    ],
  },
  {
    slug: 'bore-skruemaskiner',
    name: 'Bore- & skruemaskiner',
    icon: '🔩',
  },
  {
    slug: 'haveredskaber',
    name: 'Haveredskaber',
    icon: '🌿',
    subs: [
      { slug: 'beskaeringssakse', name: 'Beskæringssakse' },
      { slug: 'buskryddere', name: 'Buskryddere' },
      { slug: 'haekkeklippere', name: 'Hækkeklippere' },
    ],
  },
  {
    slug: 'maalevaerktoj',
    name: 'Måleværktøj',
    icon: '📐',
    subs: [
      { slug: 'detektorer', name: 'Detektorer' },
      { slug: 'vaterpas', name: 'Digitale vaterpas' },
      { slug: 'linjelasere', name: 'Kryds- og linjelasere' },
      { slug: 'afstandsmaalere', name: 'Laserafstandsmålere' },
      { slug: 'rotationslasere', name: 'Rotationslasere' },
      { slug: 'termiske-kameraer', name: 'Termiske kameraer' },
    ],
  },
  {
    slug: 'multivaerktoj',
    name: 'Multiværktøj',
    icon: '🔧',
    subs: [
      { slug: 'multifunktionelle', name: 'Multifunktionelle maskiner' },
      { slug: 'oscillerende', name: 'Oscillerendeværktøj' },
    ],
  },
  {
    slug: 'savevaerktoj',
    name: 'Saveteknik',
    icon: '🪚',
    subs: [
      { slug: 'rundsave', name: 'Rundsave' },
      { slug: 'dyksave', name: 'Dyksave' },
      { slug: 'stiksave', name: 'Stiksave' },
      { slug: 'bajonetsave', name: 'Bajonetsave' },
      { slug: 'kadesave', name: 'Kædesave' },
      { slug: 'kap-geringssave', name: 'Kap-/ geringssave' },
      { slug: 'tilbehor-save', name: 'Tilbehør til save' },
    ],
  },
  {
    slug: 'slagboremaskiner',
    name: 'Slagboremaskiner & borehamre',
    icon: '⚙️',
  },
  {
    slug: 'skaere-slibemaskiner',
    name: 'Skære- og slibemaskiner',
    icon: '✨',
    subs: [
      { slug: 'vinkelslibere', name: 'Vinkelslibere' },
      { slug: 'excenterslibere', name: 'Excenterslibere' },
      { slug: 'baandslibere', name: 'Båndslibere' },
      { slug: 'pudsemaskiner', name: 'Pudsemaskiner' },
      { slug: 'hovle', name: 'Høvle' },
    ],
  },
  {
    slug: 'stovsugere',
    name: 'Støvsugere',
    icon: '🌀',
  },
  {
    slug: 'tilbehor',
    name: 'Tilbehør',
    icon: '🔗',
    subs: [
      { slug: 'bits-skruetilbehor', name: 'Bits & skruetilbehør' },
      { slug: 'bor-mejsler', name: 'Bor & mejsler' },
      { slug: 'saveklinger', name: 'Saveklinger' },
      { slug: 'skiver', name: 'Skiver' },
      { slug: 'slibemidler', name: 'Slibemidler' },
    ],
  },
  {
    slug: 'varmluft-limpistoler',
    name: 'Varmluft- & limpistoler',
    icon: '🌡️',
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getSubCategoryBySlug(
  categorySlug: string,
  subSlug: string
): SubCategory | undefined {
  const cat = getCategoryBySlug(categorySlug)
  return cat?.subs?.find((s) => s.slug === subSlug)
}
