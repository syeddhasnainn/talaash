import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useStore from "@/utils/store";
import { handleSearch } from "@/utils/get-search";

interface Attr {
  className: string;
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

interface SearchBarProps {
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SearchBar({
  handleInput,
  handleSubmit,
}: SearchBarProps) {

  const { question, setRelatedQuestions, setAnswer,setResults} = useStore();

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center h-screen w-full max-w-2xl mx-auto p-4 md:p-6 right-0 left-0 top-0 fixed"
    >
      <div className="w-full mb-8 relative rounded-lg">
        <Input
          onChange={handleInput}
          value={question}
          type="text"
          placeholder="Ask me anything..."
          className="w-full h-12 px-4 rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary "
        />
        <Button
          onClick={()=> handleSearch({
            question, 
            setResults,
            setRelatedQuestions,
            setAnswer
          })}
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
        >
          <SearchIcon className="w-5 h-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
}
