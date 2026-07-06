import type { GroceryItem } from "../types/grocery";

export function reconcileItems(
  oldItems: GroceryItem[],
  lines: string[]
): GroceryItem[] {
  const result: GroceryItem[] = [];

  const usedOld = new Set<string>();

  for (const line of lines) {
    const existing = oldItems.find(
      (item) => item.name === line && !usedOld.has(item.id)
    );

    if (existing) {
      result.push(existing);
      usedOld.add(existing.id);
    } else {
      result.push({
        id: crypto.randomUUID(),
        name: line,
        checked: false,
      });
    }
  }

  return result;
}