import { Dispatch, SetStateAction } from "react";

export interface IHeaderProps {
  setWordLength: Dispatch<SetStateAction<number>>;
  wordLength: number;
  setList: Dispatch<SetStateAction<string[]>>;
  hiddenWord: string | string[];
}
