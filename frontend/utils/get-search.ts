
type Search = {
  question: string;
  setResults: (results: any) => void;
  setAnswer: (answer: string) => void;
  extractedCode:string,
  setExtractedCode: (extractedCode: string) => void;
  socket:any,
  streaming:boolean, 
  setStreaming:(streaming: boolean) => void;
  stopStreaming:boolean
};

export const handleSearch = async ({
  question,
  setResults,
  setAnswer,
  extractedCode,
  setExtractedCode,
  socket,
  streaming,
  setStreaming,
  stopStreaming

}: Search) => {

  console.log('handleSearch', stopStreaming)
  console.log('handleSearch', stopStreaming)
  console.log('handleSearch', stopStreaming)


  setStreaming(false)
  console.log('this is from handleSearch', socket)
  var context = "";
  const llmResponse = await fetch("/api/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, sources: context,  }),
  });

  console.log(llmResponse);

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

  if (!llmResponse.ok) {
    throw new Error("Failed to fetch answer");
  }

  const reader = llmResponse.body?.getReader();

  if (!reader) {
    throw new Error("Response body is null");
  }

  const decoder = new TextDecoder();
  let done = false;
  let fullContent = "";

  while (!done) {
    if(stopStreaming){
      break
    }
    const { value, done: streamDone } = await reader.read();
    done = streamDone;
    if(done){
      setStreaming(done)
    }
    if (value) {
      fullContent += decoder.decode(value);
      // ()=>setAnswer(fullContent)
      setAnswer(fullContent);
    }
  }

  const onlyCode = extractCodeFromChat(fullContent) as string;
  setExtractedCode(onlyCode);
  console.log('only code',onlyCode)

  if(socket){
    socket.emit('generation', onlyCode)
  }
};
