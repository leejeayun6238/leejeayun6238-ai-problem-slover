import React from 'react';

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7v0A2.5 2.5 0 0 1 7 4.5v0A2.5 2.5 0 0 1 9.5 2z" />
        <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7v0A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 14.5 2z" />
        <path d="M12 17.5A2.5 2.5 0 0 1 9.5 15v0a2.5 2.5 0 0 1 2.5-2.5v0A2.5 2.5 0 0 1 14.5 15v0A2.5 2.5 0 0 1 12 17.5z" />
        <path d="M20 12A2.5 2.5 0 0 1 17.5 9.5v0A2.5 2.5 0 0 1 15 12v0A2.5 2.5 0 0 1 17.5 14.5v0A2.5 2.5 0 0 1 20 12z" />
        <path d="M4 12a2.5 2.5 0 0 1 2.5-2.5v0A2.5 2.5 0 0 1 9 12v0a2.5 2.5 0 0 1-2.5 2.5v0A2.5 2.5 0 0 1 4 12z" />
        <path d="M12 22a2.5 2.5 0 0 1-2.5-2.5v0A2.5 2.5 0 0 1 12 17v0a2.5 2.5 0 0 1 2.5 2.5v0A2.5 2.5 0 0 1 12 22z" />
        <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        <path d="M12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex justify-center items-center gap-4">
        <BrainIcon />
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text">
          AI 문제 해결사
        </h1>
      </div>
      <p className="mt-4 text-lg text-slate-400">
        텍스트나 이미지로 문제를 알려주시면, AI가 명쾌한 해결책을 제시해 드립니다.
      </p>
    </header>
  );
};
