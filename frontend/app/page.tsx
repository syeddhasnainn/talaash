"use client";
import { FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Results } from "@/components/ui/results";
import SearchBar from "@/components/ui/search-bar";
import useStore from "@/utils/store";

export default function Home() {
  var { question, setQuestion, answer, results, isLoading, setIsLoading } =
    useStore();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuestion(e.currentTarget.value);

  return (
    <main>
      <div>
        <div className="flex flex-row justify-between p-2">
          <Badge variant="default">Talaash</Badge>
          <Badge className="rounded-full" variant="default">
            Beta
          </Badge>
        </div>
        {!isLoading && (
          <SearchBar handleInput={handleInput} handleSubmit={handleSubmit} />
        )}
        {isLoading && (
          <Results
            handleInput={handleInput}
            handleSubmit={handleSubmit}
            question={question}
            answer={answer}
          />
        )}
      </div>
    </main>
  );
}
