import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useStore from "@/utils/store";
import { handleSearch } from "@/utils/get-search";

interface Attr {
  className: string;
}
function LinkIcon(props: Attr) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function SearchIcon(props: Attr) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
type SingleResult = {
  title: string;
  url: string;
  description: string;
};
interface ResultProps {

  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  question: string;
  answer: string;

}

export function Results({
  handleInput,
  handleSubmit,
  question,
  answer,
}: ResultProps) {
  const {results, setResults, setRelatedQuestions, setAnswer, relatedQuestions} = useStore()

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 md:p-6"
    >
      <div className="w-full mb-8 relative rounded-lg">
        <Input
          onChange={handleInput}
          value={question}
          type="search"
          placeholder="Ask me anything..."
          className="w-full h-12 px-4 rounded-lg bg-background"
        />
        <Button
          type="submit"
          onClick={()=>handleSearch({
            question,
            setResults,
            setRelatedQuestions,
            setAnswer
          })}
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
        >
          <SearchIcon className="w-5 h-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full">
          <div className="col-span-1 md:col-span-2 bg-card rounded-lg p-2">
            <h3 className="text-lg font-medium mb-4">Answer</h3>
            <div className="prose text-muted-foreground">
              <p>{answer}</p>
            </div>
          </div>

          <div className="col-span-2 bg-card rounded-lg p-2">
            <h3 className="text-lg font-medium mb-4">Sources</h3>
            {results.map((item: SingleResult, index: number) => (
              <div key={index} className="space-y-2">
                <Link
                  href={item.url}
                  className="flex items-center gap-2 text-sm hover:bg-muted/50 rounded-md p-2"
                  prefetch={false}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="col-span-2 bg-card rounded-lg p-2">
            <h3 className="text-lg font-medium mb-4">Related Questions</h3>
            <div className="space-y-2">
              {relatedQuestions.map((item: string, index: number) => (
                <div
                onClick={()=>handleSearch({
                  question:item,
                  setResults,
                  setRelatedQuestions,
                  setAnswer
                })}
                  key={index}
                  className="flex items-center gap-2 text-sm hover:bg-muted/50 rounded-md p-2"
                >
                  <SearchIcon className="w-4 h-4" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
