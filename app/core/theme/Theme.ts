import { createTheme, ThemeOptions } from "@material-ui/core"

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#0a1239",
    },
    secondary: {
      main: "#f70b62",
    },
  },
}

export const theme = createTheme(themeOptions)
