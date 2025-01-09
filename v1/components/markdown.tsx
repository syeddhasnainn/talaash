import { Copy } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark as dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

export default memo(function MemoizedMarkdown({ c }: any) {
  const [textContent, setTextContent] = useState<string>("");
  const [codeBlocks, setCodeBlocks] = useState<Array<{ language: string; code: string }>>([]);

  useEffect(() => {
    // Split content into text and code blocks
    const parts = c.split(/(```[\s\S]*?```)/g);
    const newTextContent: string[] = [];
    const newCodeBlocks: Array<{ language: string; code: string }> = [];

    parts.forEach((part: string) => {
      if (part.startsWith("```")) {
        const lines = part.split("\n");
        const language = lines[0].replace("```", "").trim();
        const code = lines.slice(1, -1).join("\n");
        newCodeBlocks.push({ language, code });
      } else {
        newTextContent.push(part);
      }
    });

    setTextContent(newTextContent.join("\n"));
    setCodeBlocks(newCodeBlocks);
  }, [c]);

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Text content on the left */}
      <div className="overflow-auto">
        <Markdown remarkPlugins={[remarkGfm]}>
          {textContent}
        </Markdown>
      </div>

      {/* Code blocks on the right */}
      <div className="overflow-auto space-y-4">
        {codeBlocks.map((block, index) => (
          <div key={index} className="bg-[#393937] text-white relative text-sm">
            <button className="absolute right-2 top-2">
              <Copy
                onClick={() => navigator.clipboard.writeText(block.code)}
                className="w-4"
              />
            </button>
            <SyntaxHighlighter
              PreTag="div"
              language={block.language}
              style={dark}
              wrapLines={true}
