import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("smartSpendTheme");

    if (savedTheme === "light") {
      return false;
    }

    return true;
  });

  useEffect(() => {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.remove("light");
      html.classList.add("dark");

      localStorage.setItem("smartSpendTheme", "dark");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");

      localStorage.setItem("smartSpendTheme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}