'use client'
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import SearchBar from '../search-bar';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { Card } from './card';

const scope = {Card}

export default function CodeEditor() {
    const html = `
    <Card />
    `
    return (
        <LiveProvider code={html} scope={scope} >
            <LiveEditor />
            <LiveError />
            <LivePreview />
        </LiveProvider>
    )
}