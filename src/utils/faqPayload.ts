/** Comma, semicolon, or newline separated tag names from a single text field. */
export function tagsRawToPayload(raw: string | null | undefined): { tag_name: string }[] {
  if (raw == null || !String(raw).trim()) return [];
  const parts = String(raw)
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return normalizeFaqTagPayload(parts);
}

export function normalizeFaqTagPayload(labels: string[]): { tag_name: string }[] {
  const seen = new Set<string>();
  const out: { tag_name: string }[] = [];
  for (const raw of labels) {
    const name = String(raw).trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ tag_name: name });
  }
  return out;
}
