export type ReadingCategory = "technical" | "non-technical";

export type ReadingItem = {
  title: string;
  url: string;
  category: ReadingCategory;
  date?: string;
  author?: string;
  source?: string;
};

export const readingSections: readonly {
  id: string;
  category: ReadingCategory;
  title: string;
}[] = [
  { id: "technical", category: "technical", title: "Technical" },
  { id: "non-technical", category: "non-technical", title: "Non-technical" },
];

export const readingItems: ReadingItem[] = [
  {
    title: "Startup Technical Guide: AI Agents",
    url: "https://drive.google.com/open?id=11XqTVQnw9yBRcUc77ADK54khAxwOxKTU&usp=drive_fs",
    category: "technical",
    // author: "Google",
    // source: "Google Drive",
  },
  {
    title: "Trustless Cross-chain Bridges Made Practical",
    url: "https://drive.google.com/open?id=16oXJZ9x0nbfpR5iUlzixO9le5-cPa4YD&usp=drive_fs",
    category: "technical",
    // author: "Research authors",
    // source: "Google Drive",
  },
];

export function readingByCategory(category: ReadingCategory): ReadingItem[] {
  return readingItems.filter((r) => r.category === category);
}
