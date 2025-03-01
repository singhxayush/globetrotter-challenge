"use client";

import {createContext, useContext, useState, useEffect, ReactNode} from "react";

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({children}: {children: ReactNode}) => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("isDark");
    if (storedDarkMode !== null) setDarkMode(JSON.parse(storedDarkMode));
  }, []);

  useEffect(() => {
    localStorage.setItem("isDark", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{darkMode, toggleDarkMode}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
