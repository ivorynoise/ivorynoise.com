import GithubSlugger from "github-slugger";

export type TocItem = { level: 2 | 3; text: string; id: string };

function stripInlineMarkdown(raw: string): string {
  return raw
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/!?\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/#+$/u, "")
    .trim();
}

/** ## / ### lines; ids match `rehype-slug` (github-slugger). */
export function extractTocFromMarkdown(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];

  for (const line of markdown.split(/\r?\n/)) {
    const m = /^(#{2,3})\s+(.+?)(?:\s+#*)?\s*$/u.exec(line.trim());
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    const text = stripInlineMarkdown(m[2]);
    if (!text) continue;
    toc.push({ level, text, id: slugger.slug(text) });
  }

  return toc;
}
