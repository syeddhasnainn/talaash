import { Copy } from "lucide-react";
import React, { memo } from "react";
import Markdown from "react-markdown";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import { oneDark as dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

export default memo(function MemoizedMarkdown({ c }: any) {
  return (
    <Markdown
    
      remarkPlugins={[remarkGfm]}
      components={{
        code(props) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <div className="bg-[#393937] text-white relative text-sm ">
              <button className="absolute right-2 top-2">
                <Copy
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${String(children).replace(/\n$/, "")}`,
                    )
                  }
                  className="w-4"
                />
              </button>
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                style={dark}
                wrapLines={true}
                wrapLongLines={true}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {c}
    </Markdown>
  )
})
