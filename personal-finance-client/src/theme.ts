import { ThemeOptions, createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customColors: {
      lightBlue: string;
      hoverBlue: string;
      backgroundLight: string;
      taskCompletedBg: string;
      taskPendingBg: string;
      chartColors: string[];
    };
  }
  interface ThemeOptions {
    customColors?: {
      lightBlue?: string;
      hoverBlue?: string;
      backgroundLight?: string;
      taskCompletedBg?: string;
      taskPendingBg?: string;
      chartColors?: string[];
    };
  }
}

export const brandColors = {
  lightBlue: '#4A90E2',
  hoverBlue: '#357ABD',
  backgroundLight: '#F0F8FF',
  taskCompletedBgLight: '#f5f5f5',
  taskCompletedBgDark: '#2c2c2c',
  taskPendingBgLight: '#ffffff',
  taskPendingBgDark: '#1e1e1e',
  charts: {
    light: ['#4A90E2', '#4caf50', '#ff9800', '#f44336', '#9c27b0'], 
    dark: ['#64B5F6', '#81C784', '#FFB74D', '#E57373', '#BA68C8'],  
  }
};

export const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => {
  return {
    palette: {
      mode,
      primary: {
        main: brandColors.lightBlue,
      },
      background: {
        default: mode === 'light' ? brandColors.backgroundLight : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1e1e1e',
      },
    },
    customColors: {
    ...brandColors,
      lightBlue: brandColors.lightBlue,
      hoverBlue: brandColors.hoverBlue,
      backgroundLight: brandColors.backgroundLight,
      taskCompletedBg: mode === 'light' ? brandColors.taskCompletedBgLight : brandColors.taskCompletedBgDark,
      taskPendingBg: mode === 'light' ? brandColors.taskPendingBgLight : brandColors.taskPendingBgDark,
      chartColors: mode === 'light' ? brandColors.charts.light : brandColors.charts.dark,
  }
  };
};

const theme = createTheme(getThemeOptions('light'));
export default theme;