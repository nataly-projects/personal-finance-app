import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useTheme } from './hooks/useTheme';
import AppRoutes from './components/AppRoutes';

const App: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
