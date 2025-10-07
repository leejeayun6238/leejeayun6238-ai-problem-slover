import React, { useState, useRef, useCallback, ChangeEvent, useEffect } from 'react';
import { Spinner } from './Spinner';

interface InputFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  onAnalyze: () => void;
  onReset: () => void;
  isLoading: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 14M20 20l-1.5-1.5A9 9 0 003.5 10" />
    </svg>
);


export const InputForm: React.FC<InputFormProps> = ({ prompt, setPrompt, imageFile, setImageFile, onAnalyze, onReset, isLoading }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imageFile) {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
  }, [imageFile]);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [setImageFile]);

  const handleRemoveImage = useCallback(() => {
    setImageFile(null);
  }, [setImageFile]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="여기에 문제를 입력하거나, 아래 버튼을 눌러 이미지를 업로드하세요..."
          className="w-full h-40 p-4 bg-slate-700/50 border border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:outline-none transition-colors"
          disabled={isLoading}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2 bg-slate-600 text-slate-100 rounded-lg hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <UploadIcon />
                이미지 선택
            </button>
            <button
                onClick={onReset}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <RefreshIcon />
                초기화
            </button>
            {imagePreview && (
                 <div className="relative group">
                    <img src={imagePreview} alt="Problem preview" className="h-14 w-14 rounded-md object-cover border-2 border-slate-500" />
                    <button
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                    >
                       <TrashIcon />
                    </button>
                </div>
            )}
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading || (!prompt && !imagePreview)}
          className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 disabled:bg-sky-800/50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? <><Spinner /> 분석 중...</> : '분석하기'}
        </button>
      </div>
    </div>
  );
};