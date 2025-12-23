import React from 'react';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRoutes from './components/AppRoutes';

const App: React.FC = () => {

  return (
    <Provider store={store}>
        <CssBaseline />
        <AppRoutes />
    </Provider>
  );
};

export default App;
