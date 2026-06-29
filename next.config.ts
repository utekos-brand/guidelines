import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

import createMDX from "@next/mdx";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const enableMdxRs = process.env.MDX_RS === "true";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  poweredByHeader: false,
  typedRoutes: true,
  reactCompiler: true,
  cacheComponents: true,

  turbopack: {
    root: projectRoot,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utekos.no",
        pathname: "/**",
      },
    ],

    formats: ["image/avif", "image/webp"],

    qualities: [50, 75, 85, 95],

    maximumRedirects: 1,
  },

  experimental: {
    ...(enableMdxRs
      ? {
          mdxRs: {
            mdxType: "gfm" as const,
          },
        }
      : {}),
  },

  async rewrites() {
    return [
      {
        source: "/details/figma/figma-tokens.json",
        destination: "/details/figma",
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/i,
  options: {
    remarkPlugins: ["remark-gfm", "remark-math"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-autolink-headings",
        {
          behavior: "wrap",
          properties: {
            className: ["heading-anchor"],
            ariaLabel: "Lenke til seksjonen",
          },
        },
      ],
      [
        "rehype-katex",
        {
          strict: true,
          throwOnError: true,
        },
      ],
      "rehype-starry-night",
      [
        "rehype-external-links",
        {
          target: "_blank",
          rel: ["noopener", "noreferrer"],
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
