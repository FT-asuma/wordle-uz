"use client"
import { IDoubleTrouble } from '@/interface';
import React, {createContext, useContext, useState} from 'react'


const defaultValue: IDoubleTrouble = {
    value: "Default Value",
    setValue: () => {}, // Placeholder function to avoid TypeScript errors
};

const AppContext = createContext<IDoubleTrouble>(defaultValue)

const AppProvider = ({children}: {children: React.ReactNode}) => {
    const [value, setValue] = useState<string>("hii")
  return (
    <AppContext.Provider value={{value, setValue}}>{children}</AppContext.Provider>
  )
}

export default AppProvider

export const useAppContext = () => {
    return useContext(AppContext)
}