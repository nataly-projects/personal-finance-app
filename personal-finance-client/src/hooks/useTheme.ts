import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createTheme} from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import { RootState } from "../store/store";
import { toggleTheme } from "../store/themeSlice";

interface ThemeConfig {
  mode: PaletteMode;
  primaryColor: string;
  secondaryColor: string;
}

export const useTheme = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  const themeConfig: ThemeConfig = {
    mode: isDarkMode ? "dark" : "light",
    primaryColor: "#1976d2",
    secondaryColor: "#dc004e"
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeConfig.mode,
          primary: {
            main: themeConfig.primaryColor,
          },
          secondary: {
            main: themeConfig.secondaryColor,
          },
        },
      }),
    [themeConfig]
  );

  const toggleThemeMode = () => {
    dispatch(toggleTheme());
  };

  return {
    theme,
    isDarkMode,
    toggleTheme: toggleThemeMode,
    // ThemeProvider: MuiThemeProvider,
  };
};