
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
          <span className="text-[10px] font-black uppercase opacity-50 mb-2 tracking-widest">{word.category}</span>
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const shuffle = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const createGameQuestions = useCallback(() => {
    const shuffledWords = shuffle(VOCABULARY);
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
  }, []);

  const startGame = () => {
    const newQs = createGameQuestions();
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

  const renderStart = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      {/* Title Box with Offset Black Background */}
      <div className="relative mb-12 max-w-lg w-full">
        <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 rotate-[1deg]"></div>
        <BrutalistBox color={COLORS.secondary} className="relative z-10 rotate-[-1deg] py-10 px-4 w-full">
          <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter text-black leading-none">HÉBREU FLASH</h1>
          <p className="text-xl font-bold italic text-black">Apprenez le vocabulaire en un clin d'œil</p>
        </BrutalistBox>
      </div>
      
      <div className="flex flex-col gap-0 w-full max-w-md items-center">
        {/* Play Button and Timer Row */}
        <div className="flex flex-row items-center gap-4 w-full mb-8 z-20">
          <BrutalistBox 
            color={COLORS.accent} 
            hoverable 
            onClick={startGame}
            className="text-2xl md:text-3xl px-8 py-8 rotate-[1deg] text-center flex-[2]"
          >
            JOUER MAINTENANT
          </BrutalistBox>

          <div 
            onClick={() => setUseTimer(!useTimer)}
            className="flex flex-row items-center gap-3 cursor-pointer group bg-white neo-border p-3 neo-shadow-sm rotate-[-1deg] hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 neo-border bg-white flex items-center justify-center transition-all shrink-0">
              {useTimer && (
                <span className="text-red-600 text-3xl font-black select-none leading-none" style={{ transform: 'translateY(-2px)' }}>
                  V
                </span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black uppercase text-[10px] tracking-[0.1em] text-black leading-tight">CHRONO</span>
              <span className="font-black uppercase text-[10px] tracking-[0.1em] text-black leading-tight">6 SEC.</span>
            </div>
          </div>
        </div>

        {/* List Button inside Black Block Container */}
        <div className="bg-black p-4 w-full max-w-xs rotate-[-1deg] neo-shadow pt-10">
           <div 
            onClick={() => setGameState('LEXICON')}
            className="bg-white neo-border p-5 cursor-pointer hover:bg-gray-100 transition-colors text-center"
           >
              <span className="text-2xl font-black uppercase tracking-tighter text-black">LISTE DES MOTS</span>
           </div>
        </div>
      </div>
    </div>
  );

  const renderLexicon = () => (
    <div className="p-6 max-w-2xl mx-auto mb-20">
      <div className="flex items-center justify-between mb-8 sticky top-[88px] bg-[#FFF4E0] py-4 z-10 border-b-8 border-black">
        <BrutalistBox 
          color={COLORS.secondary} 
          hoverable 
          onClick={() => setGameState('START')}
          className="py-2 px-6 mr-4"
        >
          RETOUR
        </BrutalistBox>
        <h2 className="text-4xl md:text-5xl font-black text-black leading-none uppercase tracking-tighter text-right">
          DICTIONNAIRE<br/>
          <span className="text-3xl">({VOCABULARY.length})</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-8">
        {VOCABULARY.map((word) => (
          <Flashcard key={word.id} word={word} />
        ))}
      </div>
    </div>
  );

  const renderGame = () => {
    if (questions.length === 0 || !questions[currentIdx]) return null;
    const current = questions[currentIdx];

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 max-w-2xl mx-auto">
        <div className="w-full flex justify-between items-center mb-8 gap-4">
          <BrutalistBox color="white" className="py-2 px-4 text-xl flex-1 text-center">
            {currentIdx + 1} / {questions.length}
          </BrutalistBox>
          {useTimer && (
            <BrutalistBox color={timeLeft <= 2 ? COLORS.error : 'white'} className="py-2 px-6 text-2xl font-black animate-pulse">
              {timeLeft}s
            </BrutalistBox>
          )}
          <BrutalistBox color={COLORS.secondary} className="py-2 px-4 text-xl flex-1 text-center">
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
      <header className="p-6 flex justify-between items-center border-b-8 border-black bg-white sticky top-0 z-30">
        <div 
          className="font-black text-3xl md:text-4xl tracking-tighter cursor-pointer hover:skew-x-2 transition-transform select-none lowercase"
          onClick={() => setGameState('START')}
        >
          ulpan<span className="text-pink-500">.</span>avi
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:block font-black text-sm bg-black text-white px-3 py-1 rotate-[-2deg]">
             HEBREW LEARN
           </div>
        </div>
      </header>
      
      <main className="container mx-auto pb-24 pt-8">
        {gameState === 'START' && renderStart()}
        {gameState === 'LEXICON' && renderLexicon()}
        {gameState === 'PLAYING' && renderGame()}
        {gameState === 'FINISHED' && renderFinished()}
      </main>

      <footer className="fixed bottom-0 w-full p-4 text-center text-sm font-black border-t-8 border-black bg-white z-30 uppercase tracking-widest">
        NÉO-BRUTALISME x HÉBREU &copy; 2024
      </footer>
    </div>
  );
};

export default App;
