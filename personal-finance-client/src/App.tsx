import React from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRoutes from './components/AppRoutes';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </MuiThemeProvider>
    </Provider>
  );
};

export default App;
