import raw from "./color-tokens.json";

export type BrandColorCmyk = {
  value: string | null;
  source: string | null;
};

export type BrandColorSource = {
  file: string;
  rawValue: string;
};

export type BrandColorRelationship = {
  sectionId: string;
  sectionTitle: string;
  groupId: string;
  groupTitle: string;
  method: string;
  occurrence: number;
  role: string;
  scaleBase: string | null;
  scaleStep: number | null;
};

export type BrandColorToken = {
  id: string;
  cssVar: string;
  name: string;
  label: string;
  value: string;
  resolvedValue: string;
  hex: string | null;
  hexVar: string | null;
  rgb: string | null;
  oklab: string | null;
  oklch: string | null;
  lab: string | null;
  lch: string | null;
  hsl: string | null;
  cmyk: BrandColorCmyk;
  pantone: string | null;
  cam02: string | null;
  relativeLuminance: number | null;
  csvRelativeLuminanceVsBackground: number | null;
  apcaVsBackground: number | null;
  wcagContrastVsBackground: number | null;
  relationships: BrandColorRelationship[];
  source: BrandColorSource;
  matchedCsv: boolean;
};

export type BrandColorSectionGroup = {
  id: string;
  title: string;
  method: string;
};

export type BrandColorDerivedPaletteColor = {
  label: string;
  hex: string;
  oklch: string;
};

export type BrandColorDerivedPalette = {
  id: string;
  title: string;
  method: string;
  colors: BrandColorDerivedPaletteColor[];
};

export type BrandColorSection = {
  id: string;
  title: string;
  sourceTitle: string;
  groups: BrandColorSectionGroup[];
  tokens: BrandColorToken[];
  derivedPalettes: BrandColorDerivedPalette[];
};

export type BrandColorTokensFile = {
  generatedAt: string;
  source: string;
  csvSource: string;
  referenceBackground: string;
  generationNotes: string[];
  stats: {
    sectionCount: number;
    tokenCount: number;
    uniqueHexCount: number;
    uniqueCssVarCount: number;
    csvMatchedHexCount: number;
    pantoneCount: number;
  };
  sections: BrandColorSection[];
};

export const brandColorTokens = raw as BrandColorTokensFile;

export const allBrandColorTokens = brandColorTokens.sections.flatMap((section) => section.tokens);

export function formatGeneratedAt(value: string) {
  return value.replace("T", " ").slice(0, 16);
}

export function contrastGrade(value: number | null) {
  if (value === null) return "Ukjent";
  if (value >= 7) return "AAA";
  if (value >= 4.5) return "AA";
  if (value >= 3) return "Stor tekst";
  return "Lav";
}
