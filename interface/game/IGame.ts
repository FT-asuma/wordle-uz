import { Dispatch, SetStateAction } from "react";
import { ILetterData } from "..";

export interface IGame {
  wordLength: number;
  setWordLength: Dispatch<SetStateAction<number>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  listOfWords: string[];
  setListOfWords: Dispatch<SetStateAction<string[]>>;
  hiddenWord: string | string[];
  setHiddenWord:
    | Dispatch<SetStateAction<string>>
    | Dispatch<SetStateAction<string[]>>;
  lengthOfWord: string[];
  setList: Dispatch<SetStateAction<string[]>>;
  confetti: boolean;
  setConfetti: Dispatch<SetStateAction<boolean>>;
  swap: boolean;
  setSwap: Dispatch<SetStateAction<boolean>>;
  mode: boolean;
  setMode: Dispatch<SetStateAction<boolean>>;
  deviceType: string;
  setDeviceType: Dispatch<SetStateAction<string>>;
  randomWord: (list: string[], min: number, max: number) => string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  setIsCommentSectionVisible: React.Dispatch<React.SetStateAction<boolean>>
  isCommentSectionVisible: boolean
}

interface IPrevList {
  prev: [ILetterData];
}

export interface IGameOverProps {
  state: InitialStateProps;
  dispatch: React.Dispatch<Action>;
}

export interface InitialStateProps {
  length: string;
  prevList: IPrevList[];
  prevList1: IPrevList[];
  close: number;
  error: string;
  checkedLetters: ILetterData[];
  modalOpen: boolean;
  text: string;
  gameWon: boolean;
}

export type Action =
  | { type: "SET_LENGTH"; payload: string }
  | { type: "ADD_PREV_LIST"; payload: IPrevList | any } // Replace `any` with the correct type
  | { type: "ADD_SECOND_PREV_LIST"; payload: IPrevList | any } // Replace `any` with the correct type
  | { type: "INCREMENT_CLOSE" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_CHECKED_LETTERS"; payload: ILetterData[] } // Replace `any` with the correct type
  | { type: "TOGGLE_MODAL"; payload: boolean }
  | { type: "SET_TEXT"; payload: string }
  | { type: "SET_GAME_WON"; payload: boolean }
  | { type: "RESET_STATE" }; // For resetting the state entirely
