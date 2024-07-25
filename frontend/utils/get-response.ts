import { streamingController } from './streamingController';
import { v4 as uuidv4 } from 'uuid';
import { addMessage } from '@/actions/actions';
import { systemPrompt } from './prompts';

type handleSearchProps = {
  question: string;
  setQuestion: any;
  setExtractedCode: (extractedCode: string) => void;
  socket:any,
  setStreaming:(streaming: boolean) => void;
  allResponses:any,
  setAllResponses:(allResponses:any) => void,
  setChatId: (chatId:any)=> void,
  uuid: string
};

export function extractCodeFromChat(chatResponse: string): string | string[] | null {
  const codeBlockPattern = /```(?:\w+)?\s*\n([\s\S]*?)\n```/g;
  const codeBlocks: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = codeBlockPattern.exec(chatResponse)) !== null) {
    codeBlocks.push(match[1].trim());
  }

  if (codeBlocks.length === 0) {
    return null;
  }

  // if (codeBlocks.length === 1) {
  //   return codeBlocks[0];
  // }

  //returning array of blocks
  return codeBlocks[0];
}

export const handleSearch = async ({
  question,
  setQuestion,
  setExtractedCode,
  socket,
  setStreaming,
  allResponses,
  setAllResponses,
  setChatId,
  uuid
}: handleSearchProps) => {
  setChatId(uuid)
  setStreaming(true);
  const signal = streamingController.startStreaming()


  
  const currentChat = {role: 'user', content: question}
  const sp = {role: 'system', content: systemPrompt}

  const chatHistory = [...allResponses, ...[sp, currentChat]]
  setQuestion('')
  await addMessage(currentChat.role, currentChat.content, uuid)

  // const chatHistory = [...allResponses, ...[systemPrompt, currentChat]]

  const llmResponse = await fetch("/api/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatHistory }),
    signal
  });

  const reader = llmResponse.body?.getReader();

  if (!llmResponse.ok) {
    throw new Error("Failed to fetch answer");
  }


  if (!reader) {
    throw new Error("Response body is null");
  }
  
  setAllResponses([...chatHistory, {role:"assistant",  content: ""}])

  const decoder = new TextDecoder();
  let done = false;
  let fullContent = "";

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    done = streamDone;
    if(done){
      setStreaming(false)
    }
    if (value) {
      fullContent += decoder.decode(value);
      setAllResponses((prev:any) => {
        const updated = [...prev]
        updated[updated.length - 1].content += decoder.decode(value);
        return updated;
      })
    }
  }
  
  await addMessage("assistant",fullContent,uuid)
  const onlyCode = extractCodeFromChat(fullContent) as string;
  setExtractedCode(onlyCode);

  // setAllResponses(fullContent)

  if(socket){
    socket.emit('generation', onlyCode)
  }
};
