import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    console.log('Current theme:', theme);
    if (theme === 'dark') {
      console.log('Adding dark class');
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      console.log('Removing dark class');
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    console.log('HTML classes:', root.className);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
