import { create } from "zustand";

interface StoreState {
  question: string;
  setQuestion: any;
  answer: string;
  setAnswer: any
  relatedQuestions: string[];
  setRelatedQuestions: any;
  results :string,
  setResults:any
}

const useStore = create<StoreState>()((set) => ({
  question: "add a toggle for web search",
  setQuestion: (x: any) => set(() => ({ question: x })),

  answer: "",
  setAnswer: (x: any) => set(() => ({ answer: x })),

  relatedQuestions: [],
  setRelatedQuestions: (x: any) => set(() => ({ relatedQuestions: x })),

  results: "",
  setResults: (x:any)=>set(()=>({answer:x}))
}));

export default useStore;
