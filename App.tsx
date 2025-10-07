import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { SolutionDisplay } from './components/SolutionDisplay';
import { analyzeProblem } from './services/geminiService';
import { ExamplePrompts } from './components/ExamplePrompts';

// Helper to convert File to base64
const fileToBase64 = (file: File): Promise<{ mimeType: string, data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('Failed to read file as string'));
      }
      const result = reader.result;
      const mimeType = result.substring(5, result.indexOf(';'));
      const data = result.substring(result.indexOf(',') + 1);
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!prompt && !imageFile) {
      setError('분석할 문제나 이미지를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult('');

    try {
      let imagePart: { mimeType: string, data: string } | null = null;
      if (imageFile) {
        imagePart = await fileToBase64(imageFile);
      }
      
      await analyzeProblem(prompt, imagePart, (chunk) => {
        setAnalysisResult((prev) => prev + chunk);
      });

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`분석 중 오류가 발생했습니다: ${err.message}`);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, imageFile]);

  const handleReset = useCallback(() => {
    setPrompt('');
    setImageFile(null);
    setAnalysisResult('');
    setError(null);
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8 bg-slate-800/50 rounded-xl shadow-2xl p-6 sm:p-8 border border-slate-700 backdrop-blur-sm">
          <InputForm
            prompt={prompt}
            setPrompt={setPrompt}
            imageFile={imageFile}
            setImageFile={setImageFile}
            onAnalyze={handleAnalyze}
            onReset={handleReset}
            isLoading={isLoading}
          />
          {!isLoading && !analysisResult && !error && (
            <ExamplePrompts onSelect={(p) => setPrompt(p)} />
          )}
          <SolutionDisplay
            result={analysisResult}
            isLoading={isLoading}
            error={error}
          />
        </main>
      </div>
       <footer className="text-center text-slate-500 mt-8 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
}

export default App;