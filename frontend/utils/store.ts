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
  allResponses: any,
  setAllResponses: any,
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

  allResponses: [],
  // setAllResponses: (x: string[] | ((prev: string[]) => string[])) => set((state) => ({
  //   allResponses: typeof x === 'function' ? x(state.allResponses) : x
  // })),
  setAllResponses: (x: any) => set(() => ({ allResponses: x })),

}));

export default useStore;
