import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "text";
      return !inline && match ? (
        <div className="my-4">
          <div className=" text-white bg-[#1E1E1E] p-1.5 rounded-t-lg px-4 text-sm border-b-0 border border-white/10">
            {language}
          </div>
          <SyntaxHighlighter
            {...props}
            wrapLines
            wrapLongLines
            children={children}
            PreTag="div"
            language={language}
            style={dark}
            className=" leading-6 !m-0 rounded-b-lg !px-4 text-sm border border-t border-white/10"
          />
        </div>
      ) : (
        <code className={`${className}  rounded-md px-1.5 py-0.5`} {...props}>
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: any) => {
      return (
        <ol
          className="list-decimal list-outside ml-6 my-3 space-y-1.5"
          {...props}
        >
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }: any) => {
      return <li {...props}>{children}</li>;
    },
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-disc list-outside ml-6 my-3" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }: any) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    a: ({ node, children, ...props }: any) => {
      return (
        <a
          className="text-blue-500 hover:underline font-medium"
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    },
    p: ({ node, children, ...props }: any) => {
      return (
        <p className="py-4" {...props}>
          {children}
        </p>
      );
    },
    h1: ({ node, children, ...props }: any) => {
      return (
        <h1 className=" font-bold mb-4 leading-tight text-lg" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }: any) => {
      return (
        <h2 className=" font-bold mt-8 leading-tight" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }: any) => {
      return (
        <h3 className="font-semibold mt-5 mb-2 leading-tight" {...props}>
          {children}
        </h3>
      );
    },
  };

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeMathjax]}
      remarkPlugins={[remarkGfm, remarkMath]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
