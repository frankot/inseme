const POLISH_CHARS: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
};

/** "Leczenie alkoholizmu — Ośrodek" → "leczenie-alkoholizmu-osrodek" */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => POLISH_CHARS[char] ?? char)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
