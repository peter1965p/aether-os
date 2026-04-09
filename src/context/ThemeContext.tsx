'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({ accent: '59 130 246', setAccent: (c: string) => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccent] = useState('59 130 246');

  useEffect(() => {
    // FORCE UPDATE: Wir schreiben die Variable direkt ins Stylesheet des Dokuments
    document.documentElement.style.setProperty('--accent-rgb', accent);
    console.log("CSS Variable --accent-rgb is now:", accent);
  }, [accent]);

  return (
    <ThemeContext.Provider value={{ accent, setAccent }}>{children}</ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);