import { Dispatch, SetStateAction } from "react";
import { Action, InitialStateProps } from "./IGame";

export interface IDoubleTrouble {
  wordLength: number;
  setWordLength: Dispatch<SetStateAction<number>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  listOfWords: string[];
  setListOfWords: Dispatch<SetStateAction<string[]>>;
  hiddenWord: string[];
  setHiddenWord:
    | Dispatch<SetStateAction<string>>
    | Dispatch<SetStateAction<string[]>>;
  confetti: boolean;
  setConfetti: Dispatch<SetStateAction<boolean>>;
  setList: Dispatch<SetStateAction<string[]>>;
  swap: boolean;
  setSwap: Dispatch<SetStateAction<boolean>>;
  mode: boolean;
  setMode: Dispatch<SetStateAction<boolean>>;
  deviceType: string;
  setDeviceType: Dispatch<SetStateAction<string>>;
  randomWords: (list: string[], min: number, max: number) => string[];
}

export interface IKeyboardProps1 {
  textareaRef: any;
  setIsEnterPressed: React.Dispatch<React.SetStateAction<boolean>>;
  state: InitialStateProps;
  dispatch: React.Dispatch<Action>;
  length: string;
  length1: string;
  setLength: React.Dispatch<React.SetStateAction<string>>;
  setLength1: React.Dispatch<React.SetStateAction<string>>;
}
