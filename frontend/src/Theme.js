import { createTheme } from "@mui/material";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1200,
      xl: 1400,
    },
  },
  palette: {
    primary: {
      main: 'rgb(24 24 27 )',
      light: '#fff',
      dark: 'rgba(0, 0, 0, 0.38)',
      selected: 'rgb(185 28 28)'
    },
    secondary: {
      main: 'rgb(254, 249, 195)',
      light: 'rgb(254 252 232)',

      dark: '#1976d2'
    },
    status: {
      ok: '#4caf50'
    }
  },
  typography: {
    "fontFamily": "Inter, sans-serif",
    cardTitle: { // <-- Este es el nombre de tu nueva variante
      textAlign: 'center',
      color: 'black',
      fontSize: '1.15rem',
      lineHeight: '1.4rem',
      height: '2.8rem',
      fontWeight: '600',
      '@media (min-width: 1500px)': {
        fontSize: '1.4rem',
        lineHeight: '1.2rem',
        height: '2.4rem'
      },
      '@media (max-width: 1024px)': {
        fontSize: '1.1rem',
        lineHeight: '1rem',
        height: '2rem'
      },
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          '&.Mui-selected': {
            backgroundColor: 'rgb(24, 24, 27)',
            color: '#fff',
            '& .MuiListItemIcon-root': {
              color: '#fff',
            },
            '&:hover': {
              backgroundColor: 'rgb(30, 30, 33)',
            },
          },
        },
      },
    },
     MuiAlert: {
      variants: [
        {
          props: { variant: 'temp' },
          style: {
            position: 'fixed',
            top: 20,
            right: 20,
            backgroundColor: '#333',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 4,
            zIndex: 9999,
          },
        },
      ],
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          '&:focus': {
        outline: 'none',
      },
      '&:focus-visible': {
        outline: 'none',
      },
        },
      },
    },
    MuiAccordionSummary:{
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          '&:focus': {
        outline: 'none',
      },
      '&:focus-visible': {
        outline: 'none',
      },
        },
      },

    },
      MuiIconButton: {
  styleOverrides: {
    root: {
      '&:focus': {
        outline: 'none',
      },
      '&:focus-visible': {
        outline: 'none',
      },
    },
  },
},
MuiTableCell: {
      styleOverrides: {
        root: {
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: 'none',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: 'none',
          },
        },
      },
    },
  },

  paperCustom: {
    padding: "2rem",
    fontFamily: "roboto",
    margin: "2rem",
    minHeight: window.innerHeight,
    borderRadius: 0
  },
  typographyCustom: {
    marginBottom: "1rem"
  },
  dividerCustom: {
    marginTop: "2rem"
  }

},




);





export { theme }