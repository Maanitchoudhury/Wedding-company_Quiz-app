import { useState } from 'react';
import { ChevronLeft, ChevronRight, PawPrint } from 'lucide-react';

// --- Data & Types ---

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What sound does a cat make?",
    options: ["Bhau-Bhau", "Meow-Meow", "Oink-Oink"],
    correctAnswer: "Meow-Meow"
  },
  {
    id: 2,
    text: "What would you probably find in your fridge?",
    options: ["Shoes", "Ice Cream", "Books"],
    correctAnswer: "Ice Cream"
  },
  {
    id: 3,
    text: "How many stars are in the sky?",
    options: ["Two", "Infinite", "One Hundred"],
    correctAnswer: "Infinite"
  },
  {
    id: 4,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter"],
    correctAnswer: "Mars"
  }
];

// --- Components ---

const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="flex gap-2 mb-8 w-full max-w-lg mx-auto" role="progressbar" aria-valuenow={currentStep} aria-valuemin={0} aria-valuemax={totalSteps}>
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <div
          key={idx}
          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
            idx <= currentStep ? 'bg-slate-800' : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
};

const OptionButton = ({ 
  label, 
  isSelected, 
  onClick 
}: { 
  label: string; 
  isSelected: boolean; 
  onClick: () => void; 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full py-4 px-6 rounded-lg text-center font-medium transition-all duration-200
        border-2 
        ${isSelected 
          ? 'bg-sky-50 border-sky-200 text-sky-900 shadow-sm' 
          : 'bg-white border-transparent text-slate-600 shadow-sm hover:shadow-md hover:bg-slate-50'
        }
      `}
    >
      {label}
    </button>
  );
};

const ResultScreen = ({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) => {
  const percentage = Math.round((score / total) * 100);
  
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 animate-fade-in">
      <div className="bg-white rounded-lg px-4 py-2 mb-8 shadow-sm border border-slate-100 transform -rotate-1">
        <span className="text-slate-600 font-medium text-sm">Keep Learning!</span>
      </div>

      <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-700 italic mb-6 text-center">
        Your Final score is
      </h2>

      <div className="flex items-baseline justify-center mb-12">
        <span className="text-8xl md:text-9xl font-serif text-slate-700 font-bold tracking-tighter">
          {percentage}
        </span>
        <span className="text-4xl md:text-5xl font-serif text-slate-500 ml-1 italic">%</span>
      </div>

      <button
        onClick={onRestart}
        className="bg-sky-100 hover:bg-sky-200 text-slate-800 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
      >
        Start Again
      </button>
    </div>
  );
};

// --- Main Application Component ---

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Preload font (simulated by using standard web safe fonts that look similar)
  // Design uses a distinct Serif for headers (Playfair Display-esque) and Sans for body.

  const handleOptionSelect = (option: string) => {
    setAnswers(prev => ({ ...prev, [currentStep]: option }));
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setAnimating(false);
      }, 300); // Wait for exit animation
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setAnimating(false);
      }, 300);
    }
  };

  const calculateScore = () => {
    let score = 0;
    QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResult(false);
  };

  const currentQuestion = QUESTIONS[currentStep];
  const isLastQuestion = currentStep === QUESTIONS.length - 1;
  const hasAnsweredCurrent = !!answers[currentStep];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-50 to-blue-100 flex items-center justify-center p-4 md:p-8 font-sans selection:bg-sky-200">
      
      {/* Decorative Border Container (Gold Line) */}
      <div className="relative w-full max-w-4xl aspect-[16/10] md:aspect-[16/9] min-h-[600px]">
        
        {/* The Golden Border/Frame from screenshot */}
        <div className="absolute inset-0 border-2 border-yellow-400 rounded-3xl pointer-events-none z-0 hidden md:block opacity-50 translate-x-2 translate-y-2"></div>

        {/* Main Card */}
        <div className="relative bg-white w-full h-full rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
          
          {/* Content Area */}
          <div className="flex-1 flex flex-col px-6 py-8 md:px-12 md:py-10 max-w-3xl mx-auto w-full">
            
            {!showResult ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-700 font-serif italic mb-3 tracking-tight">
                    Test Your Knowledge
                  </h1>
                  <div className="inline-block bg-white px-4 py-1">
                    <p className="text-slate-500 text-sm font-medium tracking-wide">
                      Answer all questions to see your results
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <ProgressBar currentStep={currentStep} totalSteps={QUESTIONS.length} />

                {/* Quiz Content with Transitions */}
                <div className={`flex-1 flex flex-col transition-opacity duration-300 ${animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                  
                  {/* Question Box */}
                  <div className="bg-sky-100/50 rounded-lg p-6 mb-6 text-center border border-sky-100">
                    <h2 className="text-lg md:text-xl font-semibold text-slate-700">
                      {currentQuestion.id}. {currentQuestion.text}
                    </h2>
                  </div>

                  {/* Options List */}
                  <div className="flex flex-col gap-3 mb-8">
                    {currentQuestion.options.map((option, idx) => (
                      <OptionButton
                        key={idx}
                        label={option}
                        isSelected={answers[currentStep] === option}
                        onClick={() => handleOptionSelect(option)}
                      />
                    ))}
                  </div>

                </div>

                {/* Footer / Navigation */}
                <div className="flex justify-between items-end mt-auto relative">
                  
                  {/* Decorative Cat Paw & Tooltip (Only on first step or always? Screenshot shows it on Q1) */}
                  {currentStep === 0 && (
                    <div className="absolute bottom-0 left-[-20px] md:left-[-40px] flex flex-col items-center animate-bounce-slow hidden sm:flex">
                       <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 mb-2 relative shadow-sm transform -rotate-6">
                          <span className="text-slate-800 font-handwriting text-sm font-bold">Best of Luck!</span>
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-200 transform rotate-45"></div>
                       </div>
                       <div className="text-pink-200 transform rotate-[-12deg]">
                          <PawPrint size={64} fill="currentColor" className="text-pink-100 stroke-pink-300" strokeWidth={1.5} />
                       </div>
                    </div>
                  )}

                  <div className="flex-1"></div> {/* Spacer */}

                  <div className="flex gap-3">
                    <button
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                      className={`
                        w-10 h-10 flex items-center justify-center rounded-lg transition-colors
                        ${currentStep === 0 
                          ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }
                      `}
                      aria-label="Previous Question"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {isLastQuestion ? (
                      <button
                        onClick={handleNext}
                        disabled={!hasAnsweredCurrent}
                        className={`
                          px-6 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-all
                          ${!hasAnsweredCurrent
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            : 'bg-slate-800 text-white hover:bg-slate-700 shadow-md'
                          }
                        `}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        // Allow proceeding? Usually quiz apps want an answer. 
                        // The UI doesn't explicitly show disabled state in screenshots, but good UX.
                        // I will allow skipping if desired, or enforce. Let's enforce for "results".
                        disabled={!hasAnsweredCurrent} 
                        className={`
                          w-10 h-10 flex items-center justify-center rounded-lg transition-colors
                          ${!hasAnsweredCurrent
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }
                        `}
                        aria-label="Next Question"
                      >
                        <ChevronRight size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <ResultScreen 
                score={calculateScore()} 
                total={QUESTIONS.length} 
                onRestart={handleRestart} 
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Global Styles for specific fonts/animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&family=Kalam:wght@700&display=swap');
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        .font-sans {
          font-family: 'Inter', sans-serif;
        }
        .font-handwriting {
          font-family: 'Kalam', cursive;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}