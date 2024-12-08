// RenderAttemptRow properties
export interface IKeyboardProps {
  textareaRef: any;
  length: string;
  setLength: React.Dispatch<React.SetStateAction<string>>;
  setIsEnterPressed: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  checkedLetters: ILetterData[];
}

export interface IRenderAttemptRowsProps {
  totalAttempts?: number; // Optional, defaults to 6
  prevList: IAttemptData[];
  close: number;
  length: string;
}

export interface IRenderAttempRowProps {
  attemptIndex: number;
  prevList: IAttemptData[];
  close: number | null;
  length?: string;
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
