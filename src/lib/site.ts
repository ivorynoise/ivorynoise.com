const externalBlogUrl = process.env.NEXT_PUBLIC_BLOG_URL?.trim();

export const site = {
  name: "Ivory Noise",
  blog: externalBlogUrl
    ? { href: externalBlogUrl, external: true }
    : { href: "/blog", external: false },
};
