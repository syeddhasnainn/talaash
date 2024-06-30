import { create } from "zustand";

interface StoreState {
  question: string;
  setQuestion: any;
  answer: string;
  setAnswer: any;
  relatedQuestions: string[];
  setRelatedQuestions: any;
  results: SearchResults[];
  setResults: any;
  isLoading: boolean;
  setIsLoading: any;
  isWebAccess: boolean;
  setIsWebAccess: any;
}

interface SearchResults {
  title: string;
  url: string;
  description: string;
}

const useStore = create<StoreState>()((set) => ({
  question: "what is life?",
  setQuestion: (x: any) => set(() => ({ question: x })),

  answer: "",
  setAnswer: (x: any) => set(() => ({ answer: x })),

  relatedQuestions: [],
  setRelatedQuestions: (x: any) => set(() => ({ relatedQuestions: x })),

  results: [],
  setResults: (x: any) => set(() => ({ results: x })),

  isLoading: false,
  setIsLoading: (x: any) => set(() => ({ isLoading: x })),

  isWebAccess: false,
  setIsWebAccess: (x: any) => set(() => ({ isWebAccess: !x })),
}));

export default useStore;