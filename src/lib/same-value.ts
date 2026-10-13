/**
 * Comparing form values with what is published — shared by the CMS editor,
 * the record forms (Zespół, Artykuły) and their server actions, so the panel
 * and the server agree on what counts as a change.
 */

/** `sections.hero.data.items.0.title` → the value at that path, or undefined. */
export function valueAt(doc: unknown, path: string): unknown {
  let current = doc;
  for (const key of path.split(".")) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/**
 * Deep equality where "nothing" is one value: an optional field that was
 * never filled (undefined), cleared (""), or nulled reads the same, so
 * opening a field and leaving it empty doesn't count as a change.
 */
export function sameValue(a: unknown, b: unknown): boolean {
  const blank = (v: unknown) => v === undefined || v === null || v === "";
  if (blank(a) || blank(b)) return blank(a) && blank(b);
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, i) => sameValue(item, b[i]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const ra = a as Record<string, unknown>;
    const rb = b as Record<string, unknown>;
    const keys = new Set([...Object.keys(ra), ...Object.keys(rb)]);
    return [...keys].every((key) => sameValue(ra[key], rb[key]));
  }
  return a === b;
}
