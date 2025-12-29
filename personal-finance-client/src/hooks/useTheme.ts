import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createTheme } from "@mui/material/styles";
import { RootState } from "../store/store";
import { toggleTheme as toggleThemeAction } from "../store/themeSlice";
import { getThemeOptions } from "../theme";

export const useTheme = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  const theme = useMemo(() => {
    const mode = isDarkMode ? 'dark' : 'light';
    const options = getThemeOptions(mode);
    return createTheme(options);
  }, [isDarkMode]);

  return { 
    theme, 
    isDarkMode, 
    toggleTheme: () => dispatch(toggleThemeAction()) 
  };
};