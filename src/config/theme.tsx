import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const Theme = {
  primary: "#666",
  primaryText: "#282829",
  hermes: "#F6F1EB",

  button: "#444444",
  buttonText : '#FFFFFF',


  secondary: "#004990",
  secondaryText : '#626971',


  searchBarTitle : '#FFFFFF',
  searchIcon: "#000",
  searchTabBar: "#F6F1EB",
  searchTabBorder: "#FFFFFF",
  searchBarBackground: "#F6F1EB",
  searchTabText : "#FFFFFF",

  footer: "#FFFFFF",

  mobileSize: 480,
};

const theme = createTheme({
  palette: {
    mode: "light",
    text: {
      primary: Theme.primaryText,
    },
    primary: {
      main: Theme.primary,
    },
    secondary: {
      main: Theme.secondary,
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    fontFamily:
      "Hermes,Orator, canada-type-gibson, Gibson,Noto Sans, Avenir, Helvetica, Arial, sans-serif",
    // Material-UI uses rem units for the font size. This will change the base size for the entire search page
    // More info at https://material-ui.com/customization/typography/#font-size
    fontSize: 16,
    fontWeightRegular: "300",
    fontWeightMedium: "500",
  },
});

export default theme;
