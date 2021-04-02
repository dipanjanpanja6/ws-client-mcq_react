const config = {
  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 700,
  //     md: 800,
  //     lg: 1280,
  //     xl: 1920,
  //   },
  // },
  typography: {
    fontFamily: [
      "Poppins",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    // caption: {
    //   fontSize: "0.7rem",
    // },
    // button: {
    //   textTransform: "none",
    // },
  },
  props: {
    MuiLink: {
      underline: "none",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: 8,
          height: 8,
          background: "#fff",
        },
        "*::-webkit-scrollbar-track": {
          background: "#F3FBFC",
          borderRadius: 10,
        },
        "*::-webkit-scrollbar-thumb": {
          borderRadius: 10,
          background: "rgba(0, 0, 0, 0.3)",
        },
      },
    },
  },
}

export const theme_config = {
  dark: {
    ...config,
    palette: {
      type: "dark",

      primary: {
        main: "#006838",
      },
      secondary: {
        main: "#A4D985",
      },
    },
  },
  light: {
    ...config,
    palette: {
      type: "light",
      primary: {
        main: "#006838",
      },
      secondary: {
        main: "#A4D985",
      },
    },
  },
}
