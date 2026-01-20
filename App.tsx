
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { GameState, Question, Word } from './types';
import { VOCABULARY, COLORS } from './constants';
import { audioService } from './services/audioService';
import { BrutalistBox } from './components/BrutalistBox';

const Flashcard: React.FC<{ word: Word }> = ({ word }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <BrutalistBox 
      color="white" 
      hoverable
      onClick={() => setIsFlipped(!isFlipped)}
      className="flex justify-between items-center transition-all min-h-[140px] relative"
    >
      {!isFlipped ? (
        <div className="w-full text-center py-4">
          <div className="text-5xl font-black hebrew-text text-black mb-2" dir="rtl">{word.hebrew}</div>
          <span className="text-[12px] font-black uppercase opacity-40 tracking-[0.2em]">Cliquez pour voir</span>
        </div>
      ) : (
        <div className="flex flex-col text-center w-full py-4">
          <div className="flex justify-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase opacity-50 tracking-widest">{word.category}</span>
          </div>
          <span className="text-3xl font-black text-black mb-1">{word.french}</span>
          <span className="text-[10px] font-black uppercase opacity-30 mt-4 tracking-widest italic">Cliquez pour masquer</span>
        </div>
      )}
    </BrutalistBox>
  );
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; show: boolean } | null>(null);
  const [useTimer, setUseTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(6);
  const [selectedLesson, setSelectedLesson] = useState<number | 'ALL'>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get dynamic list of lessons from vocabulary
  const lessonsList = useMemo(() => {
    const lessons = [...new Set(VOCABULARY.map(w => w.lesson))].sort((a, b) => a - b);
    return lessons;
  }, []);

  const shuffle = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const createGameQuestions = useCallback(() => {
    const pool = selectedLesson === 'ALL' 
      ? VOCABULARY 
      : VOCABULARY.filter(w => w.lesson === selectedLesson);
      
    const shuffledWords = shuffle(pool);
    return shuffledWords.map((word) => {
      const otherOptions = VOCABULARY
        .filter((w) => w.id !== word.id)
        .map((w) => w.french);
      const shuffledOthers = shuffle(otherOptions).slice(0, 2);
      const options = shuffle([word.french, ...shuffledOthers]);
      
      return {
        word,
        options,
        correctAnswer: word.french
      };
    });
  }, [selectedLesson]);

  const startGame = () => {
    const newQs = createGameQuestions();
    if (newQs.length === 0) return;
    setQuestions(newQs);
    setCurrentIdx(0);
    setScore(0);
    setFeedback(null);
    setGameState('PLAYING');
    audioService.playStart();
    if (useTimer) setTimeLeft(6);
  };

  const nextQuestion = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(idx => idx + 1);
      if (useTimer) setTimeLeft(6);
    } else {
      setGameState('FINISHED');
      audioService.playFinish();
    }
  }, [currentIdx, questions.length, useTimer]);

  const handleAnswer = useCallback((selected: string | null) => {
    if (feedback?.show) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = selected === questions[currentIdx].correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
      audioService.playCorrect();
    } else {
      audioService.playWrong();
    }

    setFeedback({ isCorrect, show: true });

    setTimeout(() => {
      setFeedback(null);
      nextQuestion();
    }, 1200);
  }, [currentIdx, feedback?.show, nextQuestion, questions]);

  useEffect(() => {
    if (gameState === 'PLAYING' && useTimer && !feedback?.show) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(null); // Time's up!
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, useTimer, feedback, handleAnswer]);

  const LessonSelector = ({ className = "" }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <select 
        value={selectedLesson}
        onChange={(e) => setSelectedLesson(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
        className="w-full neo-border neo-shadow-sm p-4 bg-white font-black text-xl appearance-none cursor-pointer focus:outline-none focus:bg-gray-50 active-press"
      >
        <option value="ALL">TOUS LES COURS</option>
        {lessonsList.map(num => (
          <option key={num} value={num}>COURS {num}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 7L10 12L15 7" stroke="black" strokeWidth="3" strokeLinecap="square"/>
        </svg>
      </div>
    </div>
  );

  const renderStart = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <div className="relative mb-10 max-w-lg w-full">
        <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 rotate-[1deg]"></div>
        <BrutalistBox color={COLORS.secondary} className="relative z-10 rotate-[-1deg] py-10 px-4 w-full">
          <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter text-black leading-none">HÉBREU FLASH</h1>
          <p className="text-xl font-bold italic text-black">Apprenez le vocabulaire en un clin d'œil</p>
        </BrutalistBox>
      </div>
      
      {/* Dynamic Lesson Selector Dropdown */}
      <div className="mb-10 w-full max-w-md text-left">
        <div className="text-xs font-black uppercase mb-3 ml-1 tracking-[0.2em] opacity-60">CHOISIR LE COURS</div>
        <LessonSelector />
      </div>
      
      <div className="flex flex-col gap-0 w-full max-w-md items-center">
        <div className="flex flex-row items-center gap-4 w-full mb-8 z-20 max-w-xs sm:max-w-md">
          <BrutalistBox 
            color={COLORS.accent} 
            hoverable 
            onClick={startGame}
            className="text-xl md:text-3xl px-4 sm:px-8 py-6 sm:py-8 rotate-[1deg] text-center flex-[3]"
          >
            JOUER MAINTENANT
          </BrutalistBox>

          <div 
            onClick={() => setUseTimer(!useTimer)}
            className="flex flex-row items-center gap-2 sm:gap-3 cursor-pointer group bg-white neo-border p-2 sm:p-3 neo-shadow-sm rotate-[-1deg] hover:bg-gray-50 transition-colors flex-1 min-w-[80px] sm:min-w-[120px]"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 neo-border bg-white flex items-center justify-center transition-all shrink-0">
              {useTimer && (
                <span className="text-red-600 text-2xl sm:text-3xl font-black select-none leading-none" style={{ transform: 'translateY(-2px)' }}>
                  V
                </span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black uppercase text-[8px] sm:text-[10px] tracking-[0.05em] text-black leading-tight">TIMER</span>
              <span className="font-black uppercase text-[8px] sm:text-[10px] tracking-[0.05em] text-black leading-tight">6s</span>
            </div>
          </div>
        </div>

        <div className="bg-black p-4 w-full max-w-[280px] sm:max-w-xs rotate-[-1deg] neo-shadow pt-10">
           <div 
            onClick={() => setGameState('LEXICON')}
            className="bg-white neo-border p-5 cursor-pointer hover:bg-gray-100 transition-colors text-center"
           >
              <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-black">LISTE DES MOTS</span>
           </div>
        </div>
      </div>
    </div>
  );

  const renderLexicon = () => {
    const filteredLexicon = selectedLesson === 'ALL' 
      ? VOCABULARY 
      : VOCABULARY.filter(w => w.lesson === selectedLesson);

    return (
      <div className="p-6 max-w-2xl mx-auto mb-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sticky top-[88px] bg-[#FFF4E0] py-4 z-10 border-b-8 border-black gap-4">
          <h2 className="text-2xl md:text-3xl font-black text-black leading-none uppercase tracking-tighter text-left">
            DICTIONNAIRE<br/>
            <span className="text-xl">({filteredLexicon.length} MOTS)</span>
          </h2>
          <div className="w-full sm:w-64">
             <LessonSelector />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8">
          {filteredLexicon.map((word) => (
            <Flashcard key={word.id} word={word} />
          ))}
        </div>
      </div>
    );
  };

  const renderGame = () => {
    if (questions.length === 0 || !questions[currentIdx]) return null;
    const current = questions[currentIdx];

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 max-w-2xl mx-auto relative">
        {useTimer && (
          <div className="fixed top-24 right-4 z-40 rotate-[3deg]">
            <BrutalistBox color={timeLeft <= 2 ? COLORS.error : 'white'} className="py-2 px-6 text-3xl font-black animate-pulse neo-shadow-lg">
              {timeLeft}s
            </BrutalistBox>
          </div>
        )}

        <div className="w-full flex justify-center items-center mb-8 gap-4">
          <BrutalistBox color={COLORS.secondary} className="py-2 px-8 text-xl text-center min-w-[200px]">
            SCORE: {score}
          </BrutalistBox>
        </div>

        <BrutalistBox color="white" className="w-full mb-10 text-center py-16 relative overflow-visible neo-shadow-lg">
          <div className="absolute -top-4 -left-4 bg-black text-white px-4 py-1 font-black uppercase text-sm rotate-[-3deg]">
            {current.word.category}
          </div>
          <h2 className="text-6xl md:text-9xl font-black hebrew-text text-black" dir="rtl">
            {current.word.hebrew}
          </h2>
        </BrutalistBox>

        <div className="grid grid-cols-1 gap-5 w-full">
          {current.options.map((opt, i) => {
            let bgColor = 'white';
            if (feedback?.show) {
              if (opt === current.correctAnswer) bgColor = COLORS.success;
              else bgColor = 'white';
            }

            return (
              <BrutalistBox
                key={i}
                color={bgColor}
                hoverable={!feedback?.show}
                onClick={() => handleAnswer(opt)}
                className={`text-2xl md:text-3xl text-center py-6 ${feedback?.show ? 'pointer-events-none' : ''}`}
              >
                {opt}
              </BrutalistBox>
            );
          })}
        </div>

        <div className="h-20 flex items-center justify-center">
          {feedback?.show && (
            <div className={`text-5xl font-black italic uppercase animate-bounce ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {feedback.isCorrect ? 'BRAVO !' : 'DOMMAGE !'}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFinished = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <BrutalistBox color={COLORS.primary} className="mb-12 rotate-[1deg] max-w-lg w-full py-12">
        <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase text-black">RÉSULTATS</h2>
        <div className="text-8xl md:text-9xl font-black mb-8 tracking-tighter text-black">
          {score}<span className="text-4xl">/{questions.length}</span>
        </div>
        <p className="text-2xl font-bold px-4 text-black">
          {score === questions.length 
            ? "PERFECT ! Tu es une légende !" 
            : score > questions.length / 2 
            ? "Pas mal ! On continue ?" 
            : "Entraîne-toi encore un peu !"}
        </p>
      </BrutalistBox>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
        <BrutalistBox 
          color={COLORS.accent} 
          hoverable 
          onClick={startGame}
          className="flex-1 text-2xl px-8 py-6 rotate-[-1deg] text-center"
        >
          REJOUER
        </BrutalistBox>
        <BrutalistBox 
          color="white" 
          hoverable 
          onClick={() => setGameState('START')}
          className="flex-1 text-2xl px-8 py-6 rotate-[2deg] text-center"
        >
          MENU
        </BrutalistBox>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <header className="p-6 flex justify-between items-center border-b-8 border-black bg-white sticky top-0 z-50">
        <div 
          className="font-black text-3xl md:text-4xl tracking-tighter cursor-pointer hover:skew-x-2 transition-transform select-none"
          onClick={() => setGameState('START')}
        >
          Ulpan<span className="text-pink-500">.</span>Go
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:block font-black text-sm bg-black text-white px-3 py-1 rotate-[-2deg]">
             {selectedLesson === 'ALL' ? 'TOUS LES COURS' : `COURS ${selectedLesson}`}
           </div>
        </div>
      </header>
      
      <main className="container mx-auto pb-12 pt-8">
        {gameState === 'START' && renderStart()}
        {gameState === 'LEXICON' && renderLexicon()}
        {gameState === 'PLAYING' && renderGame()}
        {gameState === 'FINISHED' && renderFinished()}
      </main>
    </div>
  );
};

export default App;
