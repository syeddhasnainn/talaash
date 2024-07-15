"use client";
import { FormEvent, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Results } from "@/components/ui/results";
import SearchBar from "@/components/ui/search-bar";
import useStore from "@/utils/store";
import { useSocket } from "./socket";

export default function Home() {
  const socket = useSocket()

  var { question, setQuestion, answer, results, isLoading, setIsLoading } =
    useStore();

  
  const [conversation, setConversation] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuestion(e.currentTarget.value);

  return (
    <main>
      {/* <div className="mx-2">
        <div className="flex flex-row justify-between p-2">
          <Badge variant="default">Talaash</Badge>
          <Badge className="rounded-full" variant="default">
            Beta
          </Badge>
        </div>
        {!isLoading && (
          <SearchBar handleInput={handleInput} handleSubmit={handleSubmit} socket={socket}/>
        )}
      </div> */}
      {!isLoading && (
          <SearchBar handleInput={handleInput} handleSubmit={handleSubmit} socket={socket}/>
        )}
      {isLoading && (
          <Results
            handleInput={handleInput}
            handleSubmit={handleSubmit}
            question={question}
            answer={answer}
            socket={socket}
          />
        )}

    </main>
  );
}
