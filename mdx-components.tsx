import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";

import { cn } from "@/lib/utils";

function MdxWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="mdx-shell">
      <article className="mdx-content">{children}</article>
    </div>
  );
}

function MdxH1({ className, ...props }: ComponentPropsWithoutRef<"h1">) {
  return <h1 className={cn("mdx-h1", className)} {...props} />;
}

function MdxH2({ className, ...props }: ComponentPropsWithoutRef<"h2">) {
  return <h2 className={cn("mdx-h2", className)} {...props} />;
}

function MdxH3({ className, ...props }: ComponentPropsWithoutRef<"h3">) {
  return <h3 className={cn("mdx-h3", className)} {...props} />;
}

function MdxParagraph({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p className={cn("mdx-p", className)} {...props} />;
}

function MdxLink({ className, ...props }: ComponentPropsWithoutRef<"a">) {
  return <a className={cn("mdx-a", className)} {...props} />;
}

function MdxPre({ className, ...props }: ComponentPropsWithoutRef<"pre">) {
  return <pre className={cn("mdx-pre", className)} {...props} />;
}

function MdxCode({ className, ...props }: ComponentPropsWithoutRef<"code">) {
  return <code className={cn("mdx-code", className)} {...props} />;
}

const components = {
  wrapper: MdxWrapper,
  h1: MdxH1,
  h2: MdxH2,
  h3: MdxH3,
  p: MdxParagraph,
  a: MdxLink,
  pre: MdxPre,
  code: MdxCode,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
