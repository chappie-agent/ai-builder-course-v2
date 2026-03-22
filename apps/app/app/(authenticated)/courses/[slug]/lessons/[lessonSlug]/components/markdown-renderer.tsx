"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Children, isValidElement, type ReactNode } from "react";

/** Recursively extract text from React children */
function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (isValidElement(node)) {
    return extractText(node.props.children);
  }
  if (Array.isArray(node)) {
    return Children.toArray(node).map(extractText).join("");
  }
  return "";
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-8 mb-4 text-2xl font-bold tracking-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-6 mb-3 text-xl font-semibold tracking-tight">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-4 mb-2 text-lg font-semibold">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-[#2c231a] p-4 text-sm font-mono text-[#c4b5a0]">
      {children}
    </pre>
  ),
  code: ({ children, className }) => {
    if (className) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="rounded bg-secondary px-1.5 py-0.5 text-sm font-mono">
        {children}
      </code>
    );
  },
  blockquote: ({ children }) => {
    const text = extractText(children);
    if (text.includes("Opdracht:")) {
      return (
        <div className="my-4 rounded-r-lg border-l-4 border-muted-foreground bg-secondary p-4">
          <p className="mb-1 text-sm font-semibold text-muted-foreground">📝 Opdracht</p>
          <div className="text-sm">{children}</div>
        </div>
      );
    }
    return (
      <blockquote className="my-4 border-l-4 border-border pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    );
  },
  img: ({ src, alt }) => (
    <figure className="my-4">
      <img
        src={src ?? ""}
        alt={alt ?? ""}
        className="w-full rounded-lg border border-border"
      />
      {alt && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {alt}
        </figcaption>
      )}
    </figure>
  ),
  hr: () => <hr className="my-6 border-border" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
};

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => (
  <div className="max-w-none text-sm leading-relaxed">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  </div>
);
