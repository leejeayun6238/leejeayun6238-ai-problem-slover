import React from 'react';

interface ExamplePromptsProps {
  onSelect: (prompt: string) => void;
}

const examples = [
  '이 수학 문제를 풀어줘: 2x + 5 = 15',
  '이 Python 코드에 어떤 문제가 있는지 알려줘. def my_func(a. b): return a + b',
  '우리 집 고양이가 밤에 우는 이유가 뭘까?',
  '이미지 속 식물의 이름이 뭐야?',
];

const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M19 3v4M17 5h4M12 21l-1.5-3L9 16.5l3-1.5L15 18l-1.5 1.5L12 21zM12 3l1.5 3L15 7.5l-3 1.5L9 6l1.5-1.5L12 3zM3 12h4M5 10v4M21 12h-4M19 10v4" />
    </svg>
);


export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onSelect }) => {
  return (
    <div className="my-8 animate-fade-in">
      <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center">
          <SparkleIcon />
          이렇게 질문해보세요!
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onSelect(example)}
            className="p-4 bg-slate-800 border border-slate-700 rounded-lg text-left text-slate-300 hover:bg-slate-700/80 hover:border-sky-500 transition-all duration-200 transform hover:scale-[1.02]"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};