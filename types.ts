
export interface Word {
  id: string;
  hebrew: string;
  french: string;
  category: 'Nom' | 'Verbe' | 'Adjectif' | 'Divers';
}

export type GameState = 'START' | 'PLAYING' | 'FINISHED' | 'LEXICON';

export interface Question {
  word: Word;
  options: string[];
  correctAnswer: string;
}
