import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeHighlight from "rehype-highlight";

/** Wrap each Markdown <table> in a scrollable div (styled by `.table-wrapper`). */
function rehypeWrapTables() {
  const walk = (node) => {
    node.children?.forEach((child, i) => {
      if (child.type === "element" && child.tagName === "table") {
        node.children[i] = {
          type: "element",
          tagName: "div",
          properties: { className: ["table-wrapper"] },
          children: [child],
        };
      } else {
        walk(child);
      }
    });
  };
  return walk;
}

export default defineConfig({
  site: "https://deepakaggarwal.me",
  // `/blog/foo` → `blog/foo.html`, same URLs as the old Next.js export.
  build: { format: "file" },
  trailingSlash: "never",
  // On by default; it drops line-break whitespace next to tags, gluing words to <strong>/<a>.
  compressHTML: false,
  markdown: {
    // highlight.js classes, styled by the `.hljs-*` rules in global.css
    syntaxHighlight: false,
    processor: unified({ rehypePlugins: [rehypeHighlight, rehypeWrapTables] }),
  },
  vite: { plugins: [tailwindcss()] },
});
