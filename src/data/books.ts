export type BookCategory = "technical" | "non-technical" | "startup";

export type BookEntry = {
  title: string;
  author: string;
  /** Display year (edition / first read / publication — string allows values like "c. 180") */
  year: string;
  url: string;
  category: BookCategory;
  /** Optional label before the title, e.g. "notes" → [notes] (omit unless you want it) */
  tag?: string;
};

/** Curated list — add or reorder here. Links point to Amazon India listings you provided. */
export const books: BookEntry[] = [
  // TECHNICAL
  {
    title: "Designing Data-Intensive Applications",
    author: " Martin Kleppmann",
    year: "2026",
    url: "https://amzn.in/d/089M1Mov",
    category: "technical",
  },
  {
    title: "The C++ Programming Language",
    author: "Brian W. Kernighan & Dennis M. Ritchie",
    year: "1988",
    url: "https://www.amazon.in/dp/9356060134",
    category: "technical",
  },
  // STARTUP
  {
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    year: "2014",
    url: "https://www.amazon.in/dp/B0GS5W26WD",
    category: "startup",
  },
  {
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    year: "2016",
    url: "https://www.amazon.in/dp/0062641549",
    category: "startup",
  },
  // NON-TECHNICAL
  {
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    year: "1997",
    url: "https://www.amazon.in/dp/1612681131",
    category: "non-technical",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    year: "2014",
    url: "https://www.amazon.in/dp/0099590085",
    category: "non-technical",
  },
  {
    title: "The Top Five Regrets of the Dying",
    author: "Bronnie Ware",
    year: "2011",
    url: "https://www.amazon.in/dp/9385827626",
    category: "non-technical",
  },
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    year: "2023",
    url: "https://www.amazon.in/dp/8175994754",
    category: "non-technical",
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    year: "1988",
    url: "https://www.amazon.in/dp/0553380168",
    category: "non-technical",
  },
];

export function booksByCategory(category: BookCategory): BookEntry[] {
  return books.filter((b) => b.category === category);
}
