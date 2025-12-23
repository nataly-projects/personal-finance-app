import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customColors: {
      lightBlue: string;
      hoverBlue: string;
      backgroundLight: string;
    };
  }
  // Allow configuration using `createTheme`
  interface ThemeOptions {
    customColors?: {
      lightBlue?: string;
      hoverBlue?: string;
      backgroundLight?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2', // Light blue
    },
    secondary: {
      main: '#357ABD', // Darker blue
    },
    background: {
      default: '#F0F8FF', // Light blue-gray background
      paper: '#FFFFFF', // White for cards and forms
    },
    text: {
      primary: '#333', // Dark gray for primary text
      secondary: '#555', // Medium gray for secondary text
    },
  },
  customColors: {
    lightBlue: '#4A90E2',
    hoverBlue: '#357ABD',
    backgroundLight: '#F0F8FF',
  },
});

export default theme;