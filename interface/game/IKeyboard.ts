// RenderAttemptRow properties

export interface IRenderAttempRowProps {
  attemptIndex: number;
  prevList: IAttemptData[];
  lengthOfWord: string[];
  close: number | null;
  length?: string;
  mode: boolean;
}

export interface ILetterData {
  isCorrect: boolean;
  isOccured: boolean;
  perLetter: string;
  countInWord?: number | undefined;
}

export interface IAttemptData {
  prev: ILetterData[];
}

export interface ILetterProps {
  a: number;
  i: ILetterData;
  lengthOfWord: string[];
}

// Key properties
export interface IKeyProps {
  per_key: string;
  letter: KeyboardEvent | null;
  setIsClick: React.Dispatch<React.SetStateAction<string>>;
  isClick: string;
  setLength: React.Dispatch<React.SetStateAction<string>>;
  length: string;
  text: string;
  wordLength: number;
  mode: boolean;
  checkedLetters: ILetterData[];
}
