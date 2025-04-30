import { Markdown } from '@/components/markdown';
import { Spinner } from '@/components/spinner';
import { useChat } from '@ai-sdk/react';

export function ChatMessages() {
  const { messages: conversation, status } = useChat({
    id: 'chat',
    api: '/api/chat',
  });
console.log('status', status);
  return (
    <div className=" space-y-4 py-6 pb-8">
      {conversation &&
        conversation.map((message, index) =>
          message.role === 'user' ? (
            <div
              key={index}
              className="p-4 shadow-sm rounded-custom ml-auto max-w-fit bg-[#1A1A1A] px-4 py-3"
            >
              {message.content}
            </div>
          ) : (
            <div
              key={index}
              className="shadow-sm max-w-fit  px-4 py-3 rounded-custom"
            >
              <Markdown>{message.content}</Markdown>
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
