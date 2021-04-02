import React from "react"
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from "@material-ui/core/styles"
import { SnackbarProvider } from "notistack"
import { IconButton } from "@material-ui/core"
import { Cancel } from "@material-ui/icons"
import { theme_config } from "../config/theme"

function Theme({ children }) {
  //   const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersDarkMode = false
  var theme = React.useMemo(() =>
    // responsiveFontSizes(
    createMuiTheme(
      theme_config[prefersDarkMode ? "dark" : "light"],
      [prefersDarkMode]
      // ), { breakpoints: ["xs", "sm", "md", "lg"], factor: 7 }
    )
  )
  const notistackRef = React.createRef()
  const onClickDismiss = key => () => {
    notistackRef.current.closeSnackbar(key)
  }
  const action = key => (
    <IconButton onClick={onClickDismiss(key)}>
      <Cancel />
    </IconButton>
  )
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={2} ref={notistackRef} action={action}>
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default Theme
