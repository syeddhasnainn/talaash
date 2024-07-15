import { streamingController } from './streamingController';

type Search = {
  question: string;
  setResults: (results: any) => void;
  setAnswer: (answer: string) => void;
  extractedCode:string,
  setExtractedCode: (extractedCode: string) => void;
  socket:any,
  streaming:boolean, 
  setStreaming:(streaming: boolean) => void;
  allResponses:any,
  setAllResponses:(allResponses:any) => void,
};

function extractCodeFromChat(chatResponse: string): string | string[] | null {
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
  setResults,
  setAnswer,
  extractedCode,
  setExtractedCode,
  socket,
  streaming,
  setStreaming,
  allResponses,
  setAllResponses,
}: Search) => {

  setStreaming(true);
  const signal = streamingController.startStreaming()

  // console.log('this is from handleSearch', socket)
  const chatHistory = [...allResponses, {role: 'user', content: question}]
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
  // console.log('all responses', allResponses)

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


  const onlyCode = extractCodeFromChat(fullContent) as string;
  setExtractedCode(onlyCode);

  // setAllResponses(fullContent)

  if(socket){
    socket.emit('generation', onlyCode)
  }
};
