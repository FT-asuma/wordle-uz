export interface IGame {
  wordLength: number;
  setWordLength: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  listOfWords: string[];
  setListOfWords: React.Dispatch<React.SetStateAction<string[]>>;
  hiddenWord: string;
  setHiddenWord: React.Dispatch<React.SetStateAction<string>>;
  lengthOfWord: string[];
  setList: React.Dispatch<React.SetStateAction<string[]>>;
  confetti: boolean;
  setConfetti: React.Dispatch<React.SetStateAction<boolean>>;
  swap: boolean;
  setSwap: React.Dispatch<React.SetStateAction<boolean>>;
  mode: boolean;
  setMode: React.Dispatch<React.SetStateAction<boolean>>;
  deviceType: string;
  setDeviceType: React.Dispatch<React.SetStateAction<string>>;
  randomWord: (list: string[], min: number, max: number) => string;
}
