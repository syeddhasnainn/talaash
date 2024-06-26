type Search = {
  question: string;
  setResults: (results: any) => void;
  setRelatedQuestions: (relatedQuestions: any) => void;
  setAnswer: (answer: string) => void;
  isWebAccess: boolean;
};

export const handleSearch = async ({
  question,
  setResults,
  setRelatedQuestions,
  setAnswer,
  isWebAccess,
}: Search) => {
  console.log(isWebAccess);
  var context = "";
  if (isWebAccess) {
    const searchResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    }).then((res) => res.json());
    context = searchResponse.data;
    setResults(context);

    const relatedQuestions = await fetch("/api/relatedQuestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    })
      .then((res) => res.json())
      .then((res) => res.output.relatedQuestions);
    setRelatedQuestions(relatedQuestions);
  }

  const llmResponse = await fetch("/api/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, sources: context, isWebAccess }),
  });

  console.log(llmResponse);

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
    const { value, done: streamDone } = await reader.read();
    done = streamDone;
    if (value) {
      fullContent += decoder.decode(value);
      // ()=>setAnswer(fullContent)
      setAnswer(fullContent);
    }
  }
};
