import { Action, InitialStateProps } from "./IGame";

// RenderAttemptRow properties
export interface IKeyboardProps {
  textareaRef: any;
  setIsEnterPressed: React.Dispatch<React.SetStateAction<boolean>>;
  state: InitialStateProps;
  dispatch: React.Dispatch<Action>;
  length: string;
  setLength: React.Dispatch<React.SetStateAction<string>>;
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
  setIsClick: React.Dispatch<React.SetStateAction<string>>;
  dispatch: React.Dispatch<Action>;
  state: InitialStateProps;
  setLength: React.Dispatch<React.SetStateAction<string>>;
}
