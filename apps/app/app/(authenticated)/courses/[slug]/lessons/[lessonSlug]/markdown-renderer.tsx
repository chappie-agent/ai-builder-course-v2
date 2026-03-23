"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-sm max-w-none prose-headings:text-[#2c231a] prose-headings:font-semibold prose-p:text-[#4a3f33] prose-p:leading-relaxed prose-a:text-[#8b7355] prose-a:underline hover:prose-a:text-[#2c231a] prose-strong:text-[#2c231a] prose-code:rounded prose-code:bg-[#f0e9dd] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#6b5c4c] prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:border prose-pre:border-[#e8dfd0] prose-pre:bg-[#2c231a] prose-blockquote:border-l-[#c4956a] prose-blockquote:text-[#6b5c4c] prose-li:text-[#4a3f33] prose-hr:border-[#e8dfd0] prose-img:rounded-xl prose-th:text-[#2c231a] prose-td:text-[#4a3f33]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Opdracht/assignment callout blocks
          blockquote: ({ children }) => {
            const text = String(children);
            const isAssignment = text.toLowerCase().includes("opdracht");
            if (isAssignment) {
              return (
                <div className="not-prose my-4 rounded-xl border border-[#c4956a]/30 bg-[#c4956a]/5 p-4">
                  <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-[#c4956a]">
                    📝 Opdracht
                  </div>
                  <div className="text-sm text-[#4a3f33]">{children}</div>
                </div>
              );
            }
            return (
              <blockquote className="border-l-4 border-[#c4956a] pl-4 italic text-[#6b5c4c]">
                {children}
              </blockquote>
            );
          },
          // Ensure code blocks use proper styling
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-xl border border-[#e8dfd0] bg-[#2c231a] p-4 text-sm">
              {children}
            </pre>
          ),
        }}
      />
    </div>
  );
};
