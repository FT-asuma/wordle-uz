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
  setHiddenWord: Dispatch<SetStateAction<string>> | Dispatch<SetStateAction<string[]>>;
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
}

interface IPrevList {
  prev: [ILetterData];
}

export interface IGameOverProps {
  setText: (text: string) => void;
  text: string;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  gameWon: boolean;
  setGameWon: Dispatch<SetStateAction<boolean>>;
  setPrevList: React.Dispatch<React.SetStateAction<IPrevList[]>>
}
