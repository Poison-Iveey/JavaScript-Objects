export function groupByAuthor(books) {
  const groups = new Map();
  for (const book of books) {
    const key = book.author.trim().toLowerCase();
    const existing = groups.get(key);
    if (existing) existing.count += 1;
    else groups.set(key, { name: book.author.trim(), count: 1 });
  }
  return Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function groupByGenre(books) {
  const groups = new Map();
  for (const book of books) {
    const key = book.genre ?? "Uncategorized";
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  return Array.from(groups.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
