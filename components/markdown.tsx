import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark as dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "text";
      return !inline && match ? (
        <div className="mb-4  border-gray-200 bg-gray-100">
          <div className="text-sm font-bold text-gray-500 bg-gray-200 p-2 rounded-t-2xl">
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
            className="text-sm rounded-2xl leading-7"
          />
        </div>
      ) : (
        <code
          className={`${className} text-gray-500 rounded-2xl px-1.5 py-0.5 bg-gray-100`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: any) => {
      return (
        <ol
          className="list-decimal list-outside ml-6 my-2 space-y-2"
          {...props}
        >
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }: any) => {
      return (
        <li className="leading-7" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-disc list-outside ml-6  space-y-2" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }: any) => {
      return (
        <span className="" {...props}>
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
        <p className="leading-1 mb-2" {...props}>
          {children}
        </p>
      );
    },
    h1: ({ node, children, ...props }: any) => {
      return (
        <h1 className="text-3xl font-bold mt-8 mb-4" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }: any) => {
      return (
        <h2 className="text-2xl font-bold mt-6 mb-3" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }: any) => {
      return (
        <h3 className="text-xl font-medium my-4" {...props}>
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
