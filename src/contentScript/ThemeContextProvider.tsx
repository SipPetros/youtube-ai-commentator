import React, {
  ReactNode, createContext, useMemo, useState, useCallback,
} from 'react';
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from '@mui/material/styles';

type ThemeContextType = {
  switchColorMode: () => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeContext = createContext<ThemeContextType>({
  switchColorMode: () => {},
});

export function ThemeContextProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const switchColorMode = useCallback(() => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = useMemo(
    () => createTheme({
      palette: {
        mode,
      },
    }),
    [mode],
  );

  const contextValue = useMemo(() => ({
    switchColorMode,
  }), [switchColorMode]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeContext.Provider value={contextValue}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeContext.Provider>
    </StyledEngineProvider>
  );
}
