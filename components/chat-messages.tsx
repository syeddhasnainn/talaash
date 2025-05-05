import { Markdown } from '@/components/markdown';
import { Spinner } from '@/components/spinner';
import { useChat } from '@ai-sdk/react';
import { Copy } from 'lucide-react';

export function ChatMessages({
  chatid,
  initialMessages,
}: {
  chatid: string;
  initialMessages: any;
}) {
  const { messages: conversation, status } = useChat({
    id: chatid,
    api: '/api/chat',
    initialMessages: initialMessages,
  });
  return (
    <div className="space-y-4 py-6 pb-8">
      {conversation &&
        conversation.map((message, index) =>
          message.role === 'user' ? (
            <div
              key={index}
              className="bg-base-50 shadow-sm border rounded-sm ml-auto max-w-xl  text-foreground px-4 py-2"
            >
              {message.content}
            </div>
          ) : (
            <div
              key={index}
              className=" shadow-sm max-w-fit rounded-sm px-4 py-2 space-y-1"
            >
              <Markdown>{String.raw`${message.content}`}</Markdown>
              <button
                className="ml-2"
                onClick={() => navigator.clipboard.writeText(message.content)}
              >
                <Copy width={16} height={16} />
              </button>
            </div>
          ),
        )}

      {status === 'submitted' && (
        <div className="flex px-4 py-3">
          <Spinner size="sm" />
        </div>
      )}
    </div>
  );
}
