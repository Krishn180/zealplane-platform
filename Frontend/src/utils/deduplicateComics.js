/**
 * Shared utility: extract the base series name from any comic title,
 * stripping episode/chapter/part numbers, language tags, etc.
 * Used by all carousels to prevent duplicate series from appearing.
 */
export const extractSeriesKey = (name = "") => {
  let clean = (name || "").toLowerCase().trim();
  // Strip after hyphen/dash (e.g. "Pepper & Carrot - Episode 1" → "pepper & carrot ")
  clean = clean.split(/\s*[-–—]\s*/)[0];
  // Strip parenthetical tags like (English), (Hindi), (one-shot), (mini comic)
  clean = clean.replace(/\(.*?\)/g, "");
  // Strip episode/chapter/part/issue numbers
  clean = clean.replace(/\b(episode|chapter|part|issue|vol|volume)\s*\d+\b/gi, "");
  clean = clean.replace(/#\s*\d+/g, "");
  // Strip trailing "ki duniya", "ke naye karnamen" etc
  clean = clean.replace(/\s+ke\s+naye\s+ka?rnaam?e?/gi, "");
  clean = clean.replace(/\s+ki\s+duniya/gi, "");
  return clean.trim() || name.toLowerCase().trim();
};

/**
 * Deduplicate an array of comic/project objects by series key.
 * Keeps the first encountered entry for each series.
 */
export const deduplicateComics = (comics = [], limit = 999) => {
  const seen = new Set();
  const result = [];
  for (const comic of comics) {
    if (!comic.name) continue;
    const key = extractSeriesKey(comic.name);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(comic);
      if (result.length >= limit) break;
    }
  }
  return result;
};

/**
 * Helper to identify if a comic project is Hindi / Vernacular vs English
 */
export const isHindiComic = (comic) => {
  if (!comic) return false;
  const name = (comic.name || "").toLowerCase();
  const desc = (comic.description || "").toLowerCase();
  const tags = (comic.tags || []).join(" ").toLowerCase();
  const subtags = (comic.subtags || []).join(" ").toLowerCase();
  
  const isEnglishExplicit = name.includes("(english)") || name.includes("english");
  if (isEnglishExplicit) return false;

  const isDevanagari = /[\u0900-\u097F]/.test(comic.name || "") || /[\u0900-\u097F]/.test(comic.description || "");
  const isHindiWord = 
    name.includes("hindi") || name.includes("aur") || name.includes("bhoot") || 
    name.includes("uncle") || name.includes("parilok") || name.includes("duniya") || 
    name.includes("laal") || name.includes("dupatta") || name.includes("ghunghat") || 
    name.includes("kisse") || name.includes("daddu") || name.includes("vidyut") ||
    name.includes("humour") || name.includes("kaarnaame") ||
    tags.includes("hindi") || subtags.includes("hindi");

  return isDevanagari || isHindiWord || (comic.language && comic.language.toLowerCase().includes("hi"));
};
