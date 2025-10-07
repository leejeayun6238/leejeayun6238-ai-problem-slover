import React, { useState, useEffect } from 'react';
import { Spinner } from './Spinner';

interface SolutionDisplayProps {
  result: string;
  isLoading: boolean;
  error: string | null;
}

const LoadingState: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center text-slate-400 p-8">
        <Spinner size="lg" />
        <p className="mt-4 text-lg font-medium">AI가 열심히 분석하고 있습니다...</p>
        <p className="text-sm">잠시만 기다려주세요.</p>
    </div>
);

const InitialState: React.FC = () => (
    <div className="text-center text-slate-500 p-8">
        <p>결과가 여기에 표시됩니다.</p>
    </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
    <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
        <p className="font-bold">오류 발생</p>
        <p>{error}</p>
    </div>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


const ResultContent: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeLang = '';

    const renderCodeBlock = (key: string | number) => {
        if (codeBlockContent.length > 0) {
            elements.push(
                <div key={`code-wrapper-${key}`} className="my-4">
                    {codeLang && <div className="bg-slate-900/70 p-2 rounded-t-md text-xs text-slate-400 -mb-2 relative z-10">{codeLang}</div>}
                    <pre className={`bg-black/50 p-4 overflow-x-auto text-sm font-mono whitespace-pre-wrap ${codeLang ? 'rounded-b-md' : 'rounded-md'}`}>
                        {codeBlockContent.join('\n')}
                    </pre>
                </div>
            );
        }
        codeBlockContent = [];
        codeLang = '';
    };

    lines.forEach((line, index) => {
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                // End of code block
                renderCodeBlock(index);
            } else {
                // Start of code block
                codeLang = line.trim().substring(3);
            }
            inCodeBlock = !inCodeBlock;
        } else if (inCodeBlock) {
            codeBlockContent.push(line);
        } else {
            if (line.startsWith('# ')) elements.push(<h1 key={index} className="text-3xl font-bold mt-6 mb-3 text-sky-300">{line.substring(2)}</h1>);
            else if (line.startsWith('## ')) elements.push(<h2 key={index} className="text-2xl font-semibold mt-5 mb-2 text-sky-400 border-b border-slate-700 pb-1">{line.substring(3)}</h2>);
            else if (line.startsWith('### ')) elements.push(<h3 key={index} className="text-xl font-semibold mt-4 mb-1 text-sky-400">{line.substring(4)}</h3>);
            else if (line.match(/^\s*[\*\-]\s/)) elements.push(<li key={index} className="ml-6 list-disc">{line.replace(/^\s*[\*\-]\s/, '')}</li>);
            else if (line.trim() === '---') elements.push(<hr key={index} className="my-6 border-slate-600" />);
            else if (line.trim() !== '') elements.push(<p key={index} className="my-3 leading-relaxed">{line}</p>);
        }
    });

    // If stream ends while in a code block, render what we have
    if (inCodeBlock) {
        renderCodeBlock('final');
    }

    return (
        <div className="prose prose-invert max-w-none text-slate-300">
            {elements}
        </div>
    );
};

export const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ result, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
      if (result) {
          navigator.clipboard.writeText(result).then(() => {
              setCopied(true);
          });
      }
  };

  useEffect(() => {
      if (copied) {
          const timer = setTimeout(() => {
              setCopied(false);
          }, 2000);
          return () => clearTimeout(timer);
      }
  }, [copied]);
  
  useEffect(() => {
      setCopied(false);
  }, [result]);

  return (
    <div className="mt-8 min-h-[200px] bg-slate-900/50 rounded-lg p-6 border border-slate-700 relative">
      {result && !isLoading && (
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 bg-slate-700/50 rounded-md text-slate-400 hover:bg-slate-600/50 hover:text-slate-100 transition-colors"
            aria-label={copied ? "복사 완료!" : "결과 복사하기"}
        >
            {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      )}
      {isLoading && !result && <LoadingState />}
      {error && <ErrorState error={error} />}
      {!isLoading && !error && !result && <InitialState />}
      {result && <ResultContent content={result} />}
    </div>
  );
};