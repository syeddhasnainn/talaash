"use client";
import { FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Results } from "@/components/ui/results";
import SearchBar from "@/components/ui/search-bar";
import useStore from "@/utils/store";

export default function Home() {
  var {
    question,
    setQuestion,
    answer,
    results,
  } = useStore();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        {results.length == 0 && (
          <SearchBar
            handleInput={handleInput}
            handleSubmit={handleSubmit}
          />
        )}
        {results.length > 0 && (
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
