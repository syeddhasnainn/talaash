'use client'
import { xcode } from "react-syntax-highlighter/dist/esm/styles/hljs";
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
  extractedCode: string,
  setExtractedCode: any,
  streaming: boolean,
  setStreaming: any,
  allResponses: any,
  setAllResponses: any,
  chatId:any,
  setChatId:any

}

interface SearchResults {
  title: string;
  url: string;
  description: string;
}

const useStore = create<StoreState>()((set) => ({
  question: "",
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

  extractedCode: "",
  setExtractedCode: (x: any) => set(() => ({ extractedCode: x })),

  streaming: true,
  setStreaming: (x: any) => set(() => ({ streaming: x })),

  allResponses: [],
  setAllResponses: (x: string[] | ((prev: string[]) => string[])) => set((state) => ({
    allResponses: typeof x === 'function' ? x(state.allResponses) : x
  })),

  chatId: "",
  setChatId: (x: any) => set(() => ({ chatId: x })),
}));

export default useStore;
